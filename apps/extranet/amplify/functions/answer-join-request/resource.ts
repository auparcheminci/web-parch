import { defineFunction } from '@aws-amplify/backend';

export const answerJoinRequest = defineFunction({
  name: 'answer-join-request',
  // La fonction est liée au schéma de données : on la range avec la stack data
  resourceGroupName: 'data',
});
