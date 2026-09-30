import { fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth';
import { getUrl, remove, uploadData } from 'aws-amplify/storage';
import type { Schema } from '../../amplify/data/resource';
import { client } from '$lib/dataClient';

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
  loaded: boolean;
  loadError: string | null;
}>({ company: null, logoUrl: null, isOwner: false, loaded: false, loadError: null });

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
    const [{ userId }, { data, errors }] = await Promise.all([
      getCurrentUser(),
      // Ne renvoie que les sociétés dont l'utilisateur est créateur ou membre
      client().models.Company.list(),
    ]);
    if (errors?.length) throw new Error(errors[0].message);
    const company = data[0] ?? null;
    await setCompany(company);
    companyState.isOwner = !!company?.owner?.startsWith(`${userId}::`);
  } catch (err) {
    console.error('Company load failed', err);
    companyState.loadError = 'Impossible de charger votre société';
  }
  companyState.loaded = true;
}

export function resetCompany() {
  companyState.company = null;
  companyState.logoUrl = null;
  companyState.isOwner = false;
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
