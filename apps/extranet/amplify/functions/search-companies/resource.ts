import { defineFunction } from '@aws-amplify/backend';

export const searchCompanies = defineFunction({
  name: 'search-companies',
  // La fonction est liée au schéma de données : on la range avec la stack data
  resourceGroupName: 'data',
});
