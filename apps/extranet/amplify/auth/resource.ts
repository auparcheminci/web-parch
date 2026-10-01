import { defineAuth } from '@aws-amplify/backend';
import { postConfirmation } from '../functions/post-confirmation/resource';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    "custom:Prénom": {
      dataType: "String",
      mutable: true,
    },
    "custom:Nom": {
      dataType: "String",
      mutable: true,
    },
    "custom:PhoneNumber": {
      dataType: "Number",
      mutable: true,
    },
    "custom:Poste": {
      dataType: "String",
      mutable: true,
    },
    "custom:Newsletter": {
      dataType: "Boolean",
      mutable: true,
    },
    "custom:Whatsapp": {
      dataType: "Boolean",
      mutable: true,
    },
    // Id de la société choisie à l'inscription ; lu par le déclencheur post-confirmation
    "custom:RequestedCompany": {
      dataType: "String",
      mutable: true,
    },
  },
  triggers: {
    postConfirmation,
  },
});
