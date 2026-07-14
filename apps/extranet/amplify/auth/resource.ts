import { defineAuth } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    "custom:Nom": {
      dataType: "String",
      mutable: true,
    },
    "custom:Prénom": {
      dataType: "String",
      mutable: true,
    },
    "custom:Société": {
      dataType: "String",
      mutable: true,
    },
    "custom:Poste": {
      dataType: "String",
      mutable: true,
    },
  },
});
