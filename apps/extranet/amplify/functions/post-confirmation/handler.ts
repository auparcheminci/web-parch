import type { PostConfirmationTriggerHandler } from 'aws-lambda';
import type { Schema } from '../../data/resource';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from '$amplify/env/post-confirmation';
import { subscribeIfNewContact } from '../shared/brevo';

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);
Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();

// Après confirmation de l'inscription : inscrit à la newsletter Brevo si demandé, et
// crée la demande d'adhésion à la société choisie, que son créateur acceptera ou refusera
export const handler: PostConfirmationTriggerHandler = async (event) => {
  // Aussi appelé après un mot de passe oublié : seule l'inscription nous intéresse
  if (event.triggerSource !== 'PostConfirmation_ConfirmSignUp') return event;

  const attributes = event.request.userAttributes;

  // Oui : ajouté à la liste s'il est inconnu de Brevo. Non : rien n'est envoyé à Brevo
  if (attributes['custom:Newsletter'] === 'true') {
    try {
      await subscribeIfNewContact(
        { apiKey: env.BREVO_API_KEY, listId: env.BREVO_LIST_ID },
        attributes.email,
      );
    } catch (err) {
      // Ne bloque jamais l'inscription : l'utilisateur pourra s'inscrire depuis son profil
      console.error('Newsletter subscription failed', err);
    }
  }

  const companyId = attributes['custom:RequestedCompany'];
  if (!companyId) return event;

  try {
    const { data: company } = await client.models.Company.get({ id: companyId });
    if (!company?.owner) return event;
    const { errors } = await client.models.CompanyJoinRequest.create({
      companyId: company.id,
      companyName: company.name,
      companyOwner: company.owner,
      requester: `${attributes.sub}::${event.userName}`,
      email: attributes.email,
      name: [attributes['custom:Prénom'], attributes['custom:Nom']].filter(Boolean).join(' '),
    });
    if (errors?.length) throw new Error(errors[0].message);
  } catch (err) {
    // Ne bloque jamais l'inscription : l'utilisateur pourra créer ou rejoindre une société ensuite
    console.error('Join request creation failed', err);
  }
  return event;
};
