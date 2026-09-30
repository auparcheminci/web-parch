import type { Schema } from '../../data/resource';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from '$amplify/env/add-company-member';
import {
  AdminCreateUserCommand,
  CognitoIdentityProviderClient,
  ListUsersCommand,
  type UserType,
} from '@aws-sdk/client-cognito-identity-provider';

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);
Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();
const cognito = new CognitoIdentityProviderClient();
// Défini dans amplify/backend.ts
const userPoolId = process.env.USER_POOL_ID;

export const handler: Schema['addCompanyMember']['functionHandler'] = async (event) => {
  const email = event.arguments.email.trim().toLowerCase();
  const callerSub = (event.identity as { sub?: string } | null)?.sub;
  if (!callerSub) throw new Error('Non authentifié');

  const { data: company } = await client.models.Company.get({ id: event.arguments.companyId });
  if (!company) throw new Error('Société introuvable');
  // Seul le créateur de la société peut ajouter des membres
  if (!company.owner?.startsWith(`${callerSub}::`)) throw new Error('Non autorisé');

  // Cherche l'utilisateur par email, ou le crée (Cognito lui envoie un email d'invitation)
  const found = await cognito.send(
    new ListUsersCommand({
      UserPoolId: userPoolId,
      Filter: `email = "${email.replace(/"/g, '')}"`,
      Limit: 1,
    }),
  );
  let user: UserType | undefined = found.Users?.[0];
  if (!user) {
    const created = await cognito.send(
      new AdminCreateUserCommand({
        UserPoolId: userPoolId,
        Username: email,
        UserAttributes: [
          { Name: 'email', Value: email },
          { Name: 'email_verified', Value: 'true' },
        ],
        DesiredDeliveryMediums: ['EMAIL'],
      }),
    );
    user = created.User;
  }

  const sub = user?.Attributes?.find((attr) => attr.Name === 'sub')?.Value;
  if (!sub || !user?.Username) throw new Error("Impossible d'ajouter cet utilisateur");

  const memberId = `${sub}::${user.Username}`;
  const members = (company.members ?? []).filter((m): m is string => !!m);
  const memberEmails = (company.memberEmails ?? []).filter((m): m is string => !!m);
  if (members.includes(memberId)) return company;

  const { data, errors } = await client.models.Company.update({
    id: company.id,
    members: [...members, memberId],
    memberEmails: [...memberEmails, email],
  });
  if (errors?.length) throw new Error(errors[0].message);

  // Donne au nouveau membre l'accès au panier et aux demandes existants de la société
  const companyId = company.id;
  const withMember = (row: Row) => [
    ...(row.members ?? []).filter((m): m is string => !!m),
    memberId,
  ];
  await addMemberToRows(
    (nextToken) => client.models.CartItem.listCartItemByCompanyId({ companyId }, { nextToken }),
    (row) => client.models.CartItem.update({ id: row.id, members: withMember(row) }),
  );
  await addMemberToRows(
    (nextToken) =>
      client.models.CartRequest.listCartRequestByCompanyId({ companyId }, { nextToken }),
    (row) => client.models.CartRequest.update({ id: row.id, members: withMember(row) }),
  );

  return data;
};

type Row = { id: string; members?: (string | null)[] | null };

// Parcourt toutes les pages de lignes d'une société et met à jour chacune
async function addMemberToRows(
  list: (nextToken?: string | null) => Promise<{ data: Row[]; nextToken?: string | null }>,
  update: (row: Row) => Promise<unknown>,
) {
  let nextToken: string | null | undefined;
  do {
    const page = await list(nextToken);
    await Promise.all(page.data.map(update));
    nextToken = page.nextToken;
  } while (nextToken);
}
