import { defineFunction } from '@aws-amplify/backend';

export const resendCartRequest = defineFunction({
  name: 'resend-cart-request',
  // La fonction est liée au schéma de données : on la range avec la stack data
  resourceGroupName: 'data',
});
