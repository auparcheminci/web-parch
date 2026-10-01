import { defineBackend } from '@aws-amplify/backend';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { addCompanyMember } from './functions/add-company-member/resource';
import { answerJoinRequest } from './functions/answer-join-request/resource';
import { postConfirmation } from './functions/post-confirmation/resource';
import { searchCompanies } from './functions/search-companies/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  storage,
  addCompanyMember,
  answerJoinRequest,
  postConfirmation,
  searchCompanies,
});

// Droits Cognito de la fonction d'ajout de membre (retrouver / inviter un utilisateur).
// Déclarés ici plutôt que via `access` dans defineAuth : la fonction est dans la stack
// data, et `access` rendrait auth dépendante de data -> dépendance circulaire.
const userPool = backend.auth.resources.userPool;
backend.addCompanyMember.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ['cognito-idp:ListUsers', 'cognito-idp:AdminCreateUser'],
    resources: [userPool.userPoolArn],
  }),
);
backend.addCompanyMember.addEnvironment('USER_POOL_ID', userPool.userPoolId);
