import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { addCompanyMember } from '../functions/add-company-member/resource';

const schema = a
  .schema({
    Company: a
      .model({
        name: a.string().required(),
        activity: a.string(),
        // Nom du propriétaire de la société, saisi dans le formulaire
        ownerName: a.string(),
        // Chemin du logo dans le stockage S3 (company-logos/...)
        logo: a.string(),
        // Rempli automatiquement avec l'identifiant Cognito du créateur ("sub::username").
        // Sert aux droits d'accès : ne pas l'afficher ni le modifier
        owner: a.string().authorization((allow) => [
          allow.owner().to(['read', 'delete']),
          allow.ownersDefinedIn('members').to(['read']),
        ]),
        // Identifiants ("sub::username") des membres, utilisés pour les droits d'accès
        members: a.string().array(),
        // Emails des membres, pour l'affichage uniquement
        memberEmails: a.string().array(),
      })
      .authorization((allow) => [
        // Le créateur a tous les droits sur sa société
        allow.owner(),
        // Les membres peuvent seulement la consulter
        allow.ownersDefinedIn('members').to(['read']),
      ]),

    addCompanyMember: a
      .mutation()
      .arguments({
        companyId: a.id().required(),
        email: a.email().required(),
      })
      .returns(a.ref('Company'))
      .authorization((allow) => [allow.authenticated()])
      .handler(a.handler.function(addCompanyMember)),
  })
  // Permet à la fonction de lire et modifier les sociétés
  .authorization((allow) => [allow.resource(addCompanyMember)]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
