import { fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth';
import { getUrl, remove, uploadData } from 'aws-amplify/storage';
import type { Schema } from '../../amplify/data/resource';
import { client } from '$lib/dataClient';
import { isSameUser } from '../../amplify/functions/shared/identity';

export type Company = Schema['Company']['type'];

export type CompanyFields = {
  name: string;
  activity: string;
  ownerName: string;
  logoFile?: File | null;
};

// Société de l'utilisateur connecté, partagée entre la sidebar et la page société
export const companyState = $state<{
  company: Company | null;
  logoUrl: string | null;
  isOwner: boolean;
  // Demande d'adhésion envoyée à l'inscription, tant que l'utilisateur n'a pas de société
  pendingRequest: CompanyJoinRequest | null;
  loaded: boolean;
  loadError: string | null;
}>({
  company: null,
  logoUrl: null,
  isOwner: false,
  pendingRequest: null,
  loaded: false,
  loadError: null,
});

async function setCompany(company: Company | null) {
  companyState.company = company;
  companyState.logoUrl = company?.logo
    ? (await getUrl({ path: company.logo })).url.toString()
    : null;
}

export async function loadCompany() {
  companyState.loadError = null;
  try {
    // Absent si le backend déployé ne contient pas encore le modèle Company
    if (!client().models.Company) throw new Error('Le modèle Company n\'est pas déployé');
    const [{ userId, username }, { data, errors }] = await Promise.all([
      getCurrentUser(),
      // Ne renvoie que les sociétés dont l'utilisateur est créateur ou membre
      client().models.Company.list(),
    ]);
    if (errors?.length) throw new Error(errors[0].message);
    const company = data[0] ?? null;
    await setCompany(company);
    const me = { sub: userId, username };
    companyState.isOwner = isSameUser(company?.owner, me);
    companyState.pendingRequest = company ? null : await loadPendingRequest(me);
  } catch (err) {
    console.error('Company load failed', err);
    companyState.loadError = 'Impossible de charger votre société';
  }
  companyState.loaded = true;
}

// Demande envoyée par l'utilisateur lui-même (pas celles reçues par sa société)
async function loadPendingRequest(me: { sub: string; username: string }) {
  try {
    const requests = await listJoinRequests();
    return requests.find((r) => isSameUser(r.requester, me)) ?? null;
  } catch (err) {
    console.error('Pending join request load failed', err);
    return null;
  }
}

export function resetCompany() {
  companyState.company = null;
  companyState.logoUrl = null;
  companyState.isOwner = false;
  companyState.pendingRequest = null;
  companyState.loaded = false;
  companyState.loadError = null;
}

async function uploadLogo(file: File) {
  const { path } = await uploadData({
    path: ({ identityId }) => `company-logos/${identityId}/${Date.now()}-${file.name}`,
    data: file,
    options: { contentType: file.type },
  }).result;
  return path;
}

export async function createCompany({ logoFile, ...fields }: CompanyFields) {
  const { email } = await fetchUserAttributes();
  const logo = logoFile ? await uploadLogo(logoFile) : null;
  const { data, errors } = await client().models.Company.create({
    ...fields,
    logo,
    memberEmails: email ? [email] : [],
  });
  if (errors?.length) throw new Error(errors[0].message);
  await setCompany(data);
  companyState.isOwner = true;
}

export async function updateCompany({ logoFile, ...fields }: CompanyFields) {
  const current = companyState.company;
  if (!current) return;
  const logo = logoFile ? await uploadLogo(logoFile) : current.logo;
  const { data, errors } = await client().models.Company.update({
    id: current.id,
    ...fields,
    logo,
  });
  if (errors?.length) throw new Error(errors[0].message);
  // Supprime l'ancien logo une fois le nouveau enregistré
  if (logoFile && current.logo) {
    await remove({ path: current.logo }).catch(() => {});
  }
  await setCompany(data);
}

export async function addMember(email: string) {
  if (!companyState.company) return;
  const { data, errors } = await client().mutations.addCompanyMember({
    companyId: companyState.company.id,
    email,
  });
  if (errors?.length) throw new Error(errors[0].message);
  if (data) await setCompany(data as Company);
}

export type CompanySummary = { id: string; name: string };
export type CompanyJoinRequest = Schema['CompanyJoinRequest']['type'];

// Recherche de société depuis l'inscription : l'utilisateur n'est pas encore connecté
export async function searchCompanies(term: string): Promise<CompanySummary[]> {
  if (!client().queries.searchCompanies) return [];
  const { data, errors } = await client().queries.searchCompanies(
    { term },
    { authMode: 'identityPool' },
  );
  if (errors?.length) throw new Error(errors[0].message);
  return (data ?? []).filter((company): company is CompanySummary => !!company);
}

// Demandes visibles par l'utilisateur : celles reçues par sa société (s'il en est
// le créateur) et la sienne, s'il a demandé à rejoindre une société
export async function listJoinRequests() {
  if (!client().models.CompanyJoinRequest) return [];
  const requests: CompanyJoinRequest[] = [];
  let nextToken: string | null | undefined;
  do {
    const page = await client().models.CompanyJoinRequest.list({ nextToken });
    if (page.errors?.length) throw new Error(page.errors[0].message);
    requests.push(...page.data);
    nextToken = page.nextToken;
  } while (nextToken);
  return requests;
}

export async function answerJoinRequest(requestId: string, accept: boolean) {
  const { data, errors } = await client().mutations.answerJoinRequest({ requestId, accept });
  if (errors?.length) throw new Error(errors[0].message);
  if (data) await setCompany(data as Company);
}

export async function cancelJoinRequest(requestId: string) {
  const { errors } = await client().models.CompanyJoinRequest.delete({ id: requestId });
  if (errors?.length) throw new Error(errors[0].message);
  companyState.pendingRequest = null;
}
