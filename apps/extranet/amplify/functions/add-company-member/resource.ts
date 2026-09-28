import { defineFunction } from '@aws-amplify/backend';

export const addCompanyMember = defineFunction({
  name: 'add-company-member',
  // La fonction est liée au schéma de données : on la range avec la stack data
  resourceGroupName: 'data',
});
