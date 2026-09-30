import { browser } from '$app/environment';
import type { StrapiArticle } from '$lib/api/strapi';

const STORAGE_KEY = 'cart';

export type CartItem = {
  // Identifiant utilisé dans l'URL de l'article (slug, sinon documentId/id)
  key: string;
  designation: string;
  reference: string;
  coverUrl: string | null;
  quantity: number;
};

function load(): CartItem[] {
  if (!browser) return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartState.items));
  } catch {
    // Stockage indisponible (navigation privée…) : le panier reste en mémoire
  }
}

// Panier partagé entre toutes les pages, conservé dans localStorage
export const cartState = $state<{ items: CartItem[] }>({ items: load() });

export function articleKey(article: StrapiArticle) {
  return String(article.slug ?? article.documentId ?? article.id);
}

export function cartCount() {
  return cartState.items.reduce((total, item) => total + item.quantity, 0);
}

export function addToCart(article: StrapiArticle, coverUrl: string | null, quantity = 1) {
  const key = articleKey(article);
  const existing = cartState.items.find((item) => item.key === key);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cartState.items.push({
      key,
      designation: article.designation ?? article.reference ?? String(article.id),
      reference: article.reference ?? article.codebarre ?? '',
      coverUrl,
      quantity,
    });
  }
  save();
}

export function setQuantity(key: string, quantity: number) {
  if (quantity < 1) return removeFromCart(key);
  const item = cartState.items.find((item) => item.key === key);
  if (!item) return;
  item.quantity = quantity;
  save();
}

export function removeFromCart(key: string) {
  cartState.items = cartState.items.filter((item) => item.key !== key);
  save();
}

export function clearCart() {
  cartState.items = [];
  save();
}
