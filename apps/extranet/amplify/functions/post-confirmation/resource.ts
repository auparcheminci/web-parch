import { defineFunction, secret } from '@aws-amplify/backend';

export const postConfirmation = defineFunction({
  name: 'post-confirmation',
  // Déclencheur Cognito : rangé avec la stack auth, comme le recommande Amplify
  resourceGroupName: 'auth',
  environment: {
    // Inscription à la newsletter si la case a été cochée à l'inscription
    BREVO_API_KEY: secret('BREVO_API_KEY'),
    BREVO_LIST_ID: secret('BREVO_LIST_ID'),
  },
});
