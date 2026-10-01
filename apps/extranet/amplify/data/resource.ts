import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { addCompanyMember } from '../functions/add-company-member/resource';
import { answerJoinRequest } from '../functions/answer-join-request/resource';
import { postConfirmation } from '../functions/post-confirmation/resource';
import { searchCompanies } from '../functions/search-companies/resource';
import { updateNewsletter } from '../functions/update-newsletter/resource';

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
        // Points de vente : modifiables par le créateur seul, comme le reste de la société
        salesPoints: a.ref('SalesPoint').array(),
      })
      .authorization((allow) => [
        // Le créateur a tous les droits sur sa société
        allow.owner(),
        // Les membres peuvent seulement la consulter
        allow.ownersDefinedIn('members').to(['read']),
      ]),

    SalesPoint: a.customType({
      // Généré à la création, pour choisir le point de vente d'une proforma
      id: a.id().required(),
      name: a.string().required(),
      address: a.string().required(),
      manager: a.string().required(),
    }),

    // Une ligne par article dans le panier d'une société, partagée entre ses membres
    CartItem: a
      .model({
        companyId: a.id().required(),
        // Créateur et membres de la société ("sub::username"), pour les droits d'accès.
        // Tenu à jour par addCompanyMember quand un membre est ajouté. Rempli à la
        // création, jamais modifié par un membre (pas de droit 'update'). 'delete' est
        // requis par Amplify pour pouvoir supprimer la ligne (Retirer, vider le panier)
        members: a
          .string()
          .array()
          .authorization((allow) => [
            allow.ownersDefinedIn('members').to(['create', 'read', 'delete']),
          ]),
        // Identifiant de l'article dans Strapi (slug, sinon documentId/id)
        articleKey: a.string().required(),
        // Copie des infos de l'article au moment de l'ajout, pour l'affichage
        designation: a.string().required(),
        reference: a.string(),
        coverUrl: a.string(),
        quantity: a.integer().required(),
      })
      .secondaryIndexes((index) => [index('companyId')])
      .authorization((allow) => [allow.ownersDefinedIn('members')]),

    // Demande envoyée depuis le panier : PDF rattaché à la société
    CartRequest: a
      .model({
        companyId: a.id().required(),
        // Créateur et membres de la société, mêmes règles que pour CartItem
        members: a
          .string()
          .array()
          .authorization((allow) => [
            allow.ownersDefinedIn('members').to(['create', 'read', 'delete']),
          ]),
        // Chemin du PDF dans le stockage S3 (company-requests/...)
        pdfPath: a.string().required(),
        fileName: a.string().required(),
        itemCount: a.integer().required(),
        // Copie du point de vente choisi : la proforma reste juste s'il change ensuite
        salesPoint: a.ref('SalesPoint'),
      })
      .secondaryIndexes((index) => [index('companyId')])
      .authorization((allow) => [allow.ownersDefinedIn('members')]),

    // Article mis en favori, propre à chaque utilisateur (pas à la société)
    FavoriteArticle: a
      .model({
        // Identifiant de l'article dans Strapi (slug, sinon documentId/id)
        articleKey: a.string().required(),
        // Copie des infos de l'article au moment de l'ajout, pour l'affichage
        designation: a.string().required(),
        reference: a.string(),
        coverUrl: a.string(),
        // Rempli automatiquement avec l'utilisateur ; ne peut pas être réattribué
        owner: a.string().authorization((allow) => [allow.owner().to(['read', 'delete'])]),
      })
      .authorization((allow) => [allow.owner()]),

    addCompanyMember: a
      .mutation()
      .arguments({
        companyId: a.id().required(),
        email: a.email().required(),
      })
      .returns(a.ref('Company'))
      .authorization((allow) => [allow.authenticated()])
      .handler(a.handler.function(addCompanyMember)),

    // Demande d'adhésion créée à l'inscription (post-confirmation), en attente de
    // la réponse du créateur de la société. Aucun client ne peut en créer directement
    CompanyJoinRequest: a
      .model({
        companyId: a.id().required(),
        // Copie du nom : le demandeur, pas encore membre, ne peut pas lire la société
        companyName: a.string().required(),
        // Créateur de la société ("sub::username") : c'est lui qui accepte ou refuse
        companyOwner: a.string(),
        // Demandeur ("sub::username"), ajouté aux membres si la demande est acceptée
        requester: a.string(),
        email: a.email().required(),
        name: a.string(),
      })
      .secondaryIndexes((index) => [index('companyId')])
      .authorization((allow) => [
        allow.ownerDefinedIn('companyOwner').to(['read']),
        // Le demandeur voit sa demande en attente et peut l'annuler
        allow.ownerDefinedIn('requester').to(['read', 'delete']),
      ]),

    answerJoinRequest: a
      .mutation()
      .arguments({
        requestId: a.id().required(),
        accept: a.boolean().required(),
      })
      .returns(a.ref('Company'))
      .authorization((allow) => [allow.authenticated()])
      .handler(a.handler.function(answerJoinRequest)),

    // Inscription / désinscription à la newsletter Brevo depuis le profil
    setNewsletter: a
      .mutation()
      .arguments({ subscribed: a.boolean().required() })
      .returns(a.boolean())
      .authorization((allow) => [allow.authenticated()])
      .handler(a.handler.function(updateNewsletter)),

    CompanySummary: a.customType({
      id: a.id().required(),
      name: a.string().required(),
    }),

    // Recherche de société depuis le formulaire d'inscription, avant toute connexion
    searchCompanies: a
      .query()
      .arguments({ term: a.string().required() })
      .returns(a.ref('CompanySummary').array())
      .authorization((allow) => [allow.guest(), allow.authenticated()])
      .handler(a.handler.function(searchCompanies)),
  })
  // Accès des fonctions aux données (sociétés, paniers, demandes)
  .authorization((allow) => [
    allow.resource(addCompanyMember),
    allow.resource(answerJoinRequest),
    allow.resource(postConfirmation),
    allow.resource(searchCompanies).to(['query']),
  ]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
