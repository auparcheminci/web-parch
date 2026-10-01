import type { Schema } from '../../data/resource';
import { env } from '$amplify/env/update-newsletter';
import {
  AdminGetUserCommand,
  AdminUpdateUserAttributesCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { setNewsletterStatus } from '../shared/brevo';

const cognito = new CognitoIdentityProviderClient();
// Défini dans amplify/backend.ts
const userPoolId = process.env.USER_POOL_ID;

// Interrupteur newsletter du profil : Brevo d'abord (ON : abonné et ajouté à la liste,
// OFF : désabonné), puis l'attribut Cognito custom:Newsletter, pour qu'ils restent cohérents
export const handler: Schema['setNewsletter']['functionHandler'] = async (event) => {
  const username = (event.identity as { username?: string } | null)?.username;
  if (!username) throw new Error('Non authentifié');
  const { subscribed } = event.arguments;

  const user = await cognito.send(
    new AdminGetUserCommand({ UserPoolId: userPoolId, Username: username }),
  );
  const email = user.UserAttributes?.find((attr) => attr.Name === 'email')?.Value;
  if (!email) throw new Error('Email introuvable');

  try {
    await setNewsletterStatus(
      { apiKey: env.BREVO_API_KEY, listId: env.BREVO_LIST_ID },
      email,
      subscribed,
    );
  } catch (err) {
    // Détail technique (réponse Brevo) dans les journaux CloudWatch, pas à l'écran
    console.error('Newsletter status update failed', err);
    throw new Error('La mise à jour de la newsletter est impossible pour le moment. Réessayez plus tard.');
  }

  await cognito.send(
    new AdminUpdateUserAttributesCommand({
      UserPoolId: userPoolId,
      Username: username,
      UserAttributes: [{ Name: 'custom:Newsletter', Value: String(subscribed) }],
    }),
  );
  return subscribed;
};
