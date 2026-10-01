import type { Schema } from '../../data/resource';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from '$amplify/env/search-companies';

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);
Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();

const MIN_TERM_LENGTH = 2;
const MAX_RESULTS = 8;

// Insensible aux accents et majuscules : "parchemin" trouve "Au Parchemin"
const normalize = (value: string) =>
  value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();

// Recherche publique (inscription) : ne renvoie que l'id et le nom des sociétés
export const handler: Schema['searchCompanies']['functionHandler'] = async (event) => {
  const term = normalize(event.arguments.term);
  if (term.length < MIN_TERM_LENGTH) return [];

  const matches: { id: string; name: string }[] = [];
  let nextToken: string | null | undefined;
  do {
    const page = await client.models.Company.list({
      selectionSet: ['id', 'name'],
      nextToken,
    });
    for (const company of page.data) {
      if (normalize(company.name).includes(term)) matches.push(company);
    }
    nextToken = page.nextToken;
  } while (nextToken);

  return matches
    .sort((a, b) => a.name.localeCompare(b.name, 'fr'))
    .slice(0, MAX_RESULTS);
};
