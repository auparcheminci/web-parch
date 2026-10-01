import type { Schema } from '../../data/resource';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from '$amplify/env/answer-join-request';
import { addMemberToCompany } from '../shared/companyMembers';
import { isSameUser } from '../shared/identity';

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);
Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();

// Accepte (ajoute le demandeur aux membres) ou refuse une demande d'adhésion
export const handler: Schema['answerJoinRequest']['functionHandler'] = async (event) => {
  const caller = (event.identity ?? {}) as { sub?: string; username?: string };
  if (!caller.sub) throw new Error('Non authentifié');

  const { data: request } = await client.models.CompanyJoinRequest.get({
    id: event.arguments.requestId,
  });
  if (!request) throw new Error('Demande introuvable');

  const { data: company } = await client.models.Company.get({ id: request.companyId });
  if (!company) throw new Error('Société introuvable');
  // Seul le créateur de la société peut répondre aux demandes
  if (!isSameUser(company.owner, caller)) throw new Error('Non autorisé');

  const result =
    event.arguments.accept && request.requester
      ? await addMemberToCompany(client, company, request.requester, request.email)
      : company;

  const { errors } = await client.models.CompanyJoinRequest.delete({ id: request.id });
  if (errors?.length) throw new Error(errors[0].message);
  return result;
};
