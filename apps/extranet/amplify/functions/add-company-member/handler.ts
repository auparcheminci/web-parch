import type { Schema } from '../../data/resource';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from '$amplify/env/add-company-member';
import {
  AdminCreateUserCommand,
  CognitoIdentityProviderClient,
  ListUsersCommand,
  type UserType,
} from '@aws-sdk/client-cognito-identity-provider';
import { addMemberToCompany } from '../shared/companyMembers';
import { isSameUser } from '../shared/identity';

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);
Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();
const cognito = new CognitoIdentityProviderClient();
// Défini dans amplify/backend.ts
const userPoolId = process.env.USER_POOL_ID;

export const handler: Schema['addCompanyMember']['functionHandler'] = async (event) => {
  const email = event.arguments.email.trim().toLowerCase();
  const caller = (event.identity ?? {}) as { sub?: string; username?: string };
  if (!caller.sub) throw new Error('Non authentifié');

  const { data: company } = await client.models.Company.get({ id: event.arguments.companyId });
  if (!company) throw new Error('Société introuvable');
  // Seul le créateur de la société peut ajouter des membres
  if (!isSameUser(company.owner, caller)) throw new Error('Non autorisé');

  // Cherche l'utilisateur par email, ou le crée (Cognito lui envoie un email d'invitation)
  const found = await cognito.send(
    new ListUsersCommand({
      UserPoolId: userPoolId,
      Filter: `email = "${email.replace(/"/g, '')}"`,
      Limit: 1,
    }),
  );
  let user: UserType | undefined = found.Users?.[0];
  if (!user) {
    const created = await cognito.send(
      new AdminCreateUserCommand({
        UserPoolId: userPoolId,
        Username: email,
        UserAttributes: [
          { Name: 'email', Value: email },
          { Name: 'email_verified', Value: 'true' },
        ],
        DesiredDeliveryMediums: ['EMAIL'],
      }),
    );
    user = created.User;
  }

  const sub = user?.Attributes?.find((attr) => attr.Name === 'sub')?.Value;
  if (!sub || !user?.Username) throw new Error("Impossible d'ajouter cet utilisateur");

  return addMemberToCompany(client, company, `${sub}::${user.Username}`, email);
};
