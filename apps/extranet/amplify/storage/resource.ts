import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'extranetStorage',
  access: (allow) => ({
    // Logos de société : l'utilisateur qui les dépose peut les modifier,
    // tout utilisateur connecté peut les afficher
    'company-logos/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
      allow.authenticated.to(['read']),
    ],
    // PDF des demandes : S3 ne connaît pas les membres d'une société, les fichiers ont
    // donc un nom aléatoire et ne peuvent pas être listés. Seul l'enregistrement
    // CartRequest, réservé aux membres, donne leur chemin
    'company-requests/*': [allow.authenticated.to(['get', 'write'])],
  }),
});
