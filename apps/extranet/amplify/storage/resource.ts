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
  }),
});
