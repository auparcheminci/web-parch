import { defineFunction, secret } from '@aws-amplify/backend';

export const updateNewsletter = defineFunction({
  name: 'update-newsletter',
  // La fonction est liée au schéma de données : on la range avec la stack data
  resourceGroupName: 'data',
  environment: {
    BREVO_API_KEY: secret('BREVO_API_KEY'),
    BREVO_LIST_ID: secret('BREVO_LIST_ID'),
  },
});
