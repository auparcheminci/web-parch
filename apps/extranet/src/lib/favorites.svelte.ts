import type { Schema } from '../../amplify/data/resource';
import type { StrapiArticle } from '$lib/api/strapi';
import { articleKey } from '$lib/cart.svelte';
import { client } from '$lib/dataClient';

export type FavoriteArticle = Schema['FavoriteArticle']['type'];

// Favoris de l'utilisateur connecté, partagés entre les produits et le profil
export const favoritesState = $state<{
  items: FavoriteArticle[];
  loaded: boolean;
  loadError: string | null;
}>({ items: [], loaded: false, loadError: null });

export function isFavorite(article: StrapiArticle) {
  const key = articleKey(article);
  return favoritesState.items.some((item) => item.articleKey === key);
}

export async function loadFavorites() {
  favoritesState.loadError = null;
  try {
    // Absent si le backend déployé ne contient pas encore le modèle FavoriteArticle
    if (!client().models.FavoriteArticle) throw new Error('Le modèle FavoriteArticle n\'est pas déployé');
    const items: FavoriteArticle[] = [];
    let nextToken: string | null | undefined;
    do {
      // Ne renvoie que les favoris de l'utilisateur connecté
      const page = await client().models.FavoriteArticle.list({ nextToken });
      if (page.errors?.length) throw new Error(page.errors[0].message);
      items.push(...page.data);
      nextToken = page.nextToken;
    } while (nextToken);
    favoritesState.items = items;
  } catch (err) {
    console.error('Favorites load failed', err);
    favoritesState.loadError = 'Impossible de charger vos favoris';
  }
  favoritesState.loaded = true;
}

export function resetFavorites() {
  favoritesState.items = [];
  favoritesState.loaded = false;
  favoritesState.loadError = null;
}

// Ajoute l'article aux favoris, ou l'en retire s'il y est déjà
export async function toggleFavorite(article: StrapiArticle, coverUrl: string | null) {
  if (!client().models.FavoriteArticle) throw new Error('Les favoris ne sont pas encore disponibles');
  const key = articleKey(article);
  const existing = favoritesState.items.find((item) => item.articleKey === key);
  if (existing) return removeFavorite(existing.id);

  const { data, errors } = await client().models.FavoriteArticle.create({
    articleKey: key,
    designation: article.designation ?? article.reference ?? String(article.id),
    reference: article.reference ?? article.codebarre ?? null,
    coverUrl,
  });
  if (errors?.length) throw new Error(errors[0].message);
  if (data) favoritesState.items.push(data);
}

export async function removeFavorite(id: string) {
  const { errors } = await client().models.FavoriteArticle.delete({ id });
  if (errors?.length) throw new Error(errors[0].message);
  favoritesState.items = favoritesState.items.filter((item) => item.id !== id);
}
