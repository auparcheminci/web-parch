import { defineFunction } from '@aws-amplify/backend';

export const postConfirmation = defineFunction({
  name: 'post-confirmation',
  // Déclencheur Cognito : rangé avec la stack auth, comme le recommande Amplify
  resourceGroupName: 'auth',
});
