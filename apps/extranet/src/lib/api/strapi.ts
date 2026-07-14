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

export interface StrapiArticle {
  id: number;
  documentId?: string;
  title?: string;
  content?: string;
  [key: string]: unknown;
}

interface StrapiListResponse<T> {
  data: T[];
  meta: unknown;
}

export async function getArticles(): Promise<StrapiArticle[]> {
  const { data } = await strapiFetch<StrapiListResponse<StrapiArticle>>(
    "/api/articles",
  );
  return data;
}
