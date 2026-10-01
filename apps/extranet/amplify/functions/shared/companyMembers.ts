import type { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../data/resource';

type DataClient = ReturnType<typeof generateClient<Schema>>;
type Company = Schema['Company']['type'];
type Row = { id: string; members?: (string | null)[] | null };

const strings = (values?: (string | null)[] | null) =>
  (values ?? []).filter((value): value is string => !!value);

// Ajoute un membre ("sub::username") à la société, et lui donne accès au panier
// et aux demandes existants. Partagé entre addCompanyMember et answerJoinRequest
export async function addMemberToCompany(
  client: DataClient,
  company: Company,
  memberId: string,
  email: string,
) {
  const members = strings(company.members);
  if (members.includes(memberId)) return company;

  const { data, errors } = await client.models.Company.update({
    id: company.id,
    members: [...members, memberId],
    memberEmails: [...strings(company.memberEmails), email],
  });
  if (errors?.length) throw new Error(errors[0].message);

  const companyId = company.id;
  const withMember = (row: Row) => [...strings(row.members), memberId];
  await updateAllRows(
    (nextToken) => client.models.CartItem.listCartItemByCompanyId({ companyId }, { nextToken }),
    (row) => client.models.CartItem.update({ id: row.id, members: withMember(row) }),
  );
  await updateAllRows(
    (nextToken) =>
      client.models.CartRequest.listCartRequestByCompanyId({ companyId }, { nextToken }),
    (row) => client.models.CartRequest.update({ id: row.id, members: withMember(row) }),
  );

  return data;
}

// Parcourt toutes les pages de lignes d'une société et met à jour chacune
async function updateAllRows(
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
