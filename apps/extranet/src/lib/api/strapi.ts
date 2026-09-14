import { PUBLIC_STRAPI_URL, PUBLIC_STRAPI_API_TOKEN } from "$env/static/public";

const baseUrl = PUBLIC_STRAPI_URL.replace(/\/$/, "");

async function strapiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: PUBLIC_STRAPI_API_TOKEN
      ? { Authorization: `Bearer ${PUBLIC_STRAPI_API_TOKEN}` }
      : {},
  });

  if (!res.ok) {
    throw new Error(`Strapi request failed (${res.status}): ${path}`);
  }

  return res.json();
}

export interface StrapiMedia {
  id: number;
  url: string;
  alternativeText?: string;
}

export interface StrapiArticle {
  id: number;
  documentId?: string;
  title?: string;
  content?: string;
  designation?: string;
  reference?: string;
  codebarre?: string;
  slug?: string;
  cover?: StrapiMedia | null;
  [key: string]: unknown;
}

interface StrapiListResponse<T> {
  data: T[];
  meta: unknown;
}

export function getMediaUrl(url: string): string {
  return url.startsWith("http") ? url : `${baseUrl}${url}`;
}

export async function getArticles(): Promise<StrapiArticle[]> {
  const { data } = await strapiFetch<StrapiListResponse<StrapiArticle>>(
    "/api/articles?populate=cover",
  );
  return data;
}

export async function getArticleBySlug(slug: string): Promise<StrapiArticle> {
  const { data } = await strapiFetch<StrapiListResponse<StrapiArticle>>(
    `/api/articles?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=cover`,
  );
  if (!data[0]) {
    throw new Error(`No article found for slug: ${slug}`);
  }
  return data[0];
}

// Articles without a slug fall back to linking by documentId/id, so this
// resolver tries the slug lookup first and falls back to fetching directly
// by document id when no article matches that slug.
export async function getArticleBySlugOrId(
  slugOrId: string,
): Promise<StrapiArticle> {
  try {
    return await getArticleBySlug(slugOrId);
  } catch {
    return strapiFetch<{ data: StrapiArticle }>(
      `/api/articles/${encodeURIComponent(slugOrId)}?populate=cover`,
    ).then((res) => res.data);
  }
}
