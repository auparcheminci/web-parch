import type { Schema } from '../../amplify/data/resource';
import type { StrapiArticle } from '$lib/api/strapi';
import { client } from '$lib/dataClient';
import { companyState, type Company } from '$lib/company.svelte';

export type CartItem = Schema['CartItem']['type'];

// Panier de la société de l'utilisateur, partagé entre ses membres
export const cartState = $state<{
  items: CartItem[];
  loaded: boolean;
  loadError: string | null;
}>({ items: [], loaded: false, loadError: null });

export function articleKey(article: StrapiArticle) {
  return String(article.slug ?? article.documentId ?? article.id);
}

export function cartCount() {
  return cartState.items.reduce((total, item) => total + item.quantity, 0);
}

function requireCompany() {
  const company = companyState.company;
  if (!company) throw new Error('Créez votre société pour utiliser le panier');
  // Absent si le backend déployé ne contient pas encore le modèle CartItem
  if (!client().models.CartItem) throw new Error('Le panier n\'est pas encore disponible');
  return company;
}

// Créateur et membres de la société : tous ont accès au panier
function cartMembers(company: Company) {
  return [company.owner, ...(company.members ?? [])].filter((m): m is string => !!m);
}

function findItem(key: string) {
  return cartState.items.find((item) => item.articleKey === key);
}

export async function loadCart() {
  cartState.loadError = null;
  const company = companyState.company;
  try {
    const items: CartItem[] = [];
    if (company) {
      // Absent si le backend déployé ne contient pas encore le modèle CartItem
      if (!client().models.CartItem) throw new Error('Le modèle CartItem n\'est pas déployé');
      let nextToken: string | null | undefined;
      do {
        const page = await client().models.CartItem.listCartItemByCompanyId(
          { companyId: company.id },
          { nextToken },
        );
        if (page.errors?.length) throw new Error(page.errors[0].message);
        items.push(...page.data);
        nextToken = page.nextToken;
      } while (nextToken);
    }
    cartState.items = items;
  } catch (err) {
    console.error('Cart load failed', err);
    cartState.loadError = 'Impossible de charger le panier';
  }
  cartState.loaded = true;
}

// Vide le panier affiché (déconnexion) sans toucher à celui de la société
export function resetCart() {
  cartState.items = [];
  cartState.loaded = false;
  cartState.loadError = null;
}

export async function addToCart(article: StrapiArticle, coverUrl: string | null, quantity = 1) {
  const company = requireCompany();
  const key = articleKey(article);
  const existing = findItem(key);
  if (existing) return setQuantity(existing.id, existing.quantity + quantity);

  const { data, errors } = await client().models.CartItem.create({
    // Identifiant fixe par société et article : empêche les doublons
    id: `${company.id}#${key}`,
    companyId: company.id,
    members: cartMembers(company),
    articleKey: key,
    designation: article.designation ?? article.reference ?? String(article.id),
    reference: article.reference ?? article.codebarre ?? null,
    coverUrl,
    quantity,
  });
  if (errors?.length) {
    // Un collègue a peut-être ajouté cet article entre-temps
    await loadCart();
    const current = findItem(key);
    if (!current) throw new Error(errors[0].message);
    return setQuantity(current.id, current.quantity + quantity);
  }
  if (data) cartState.items.push(data);
}

export async function setQuantity(id: string, quantity: number) {
  if (quantity < 1) return removeFromCart(id);
  const { data, errors } = await client().models.CartItem.update({ id, quantity });
  if (errors?.length) throw new Error(errors[0].message);
  if (data) cartState.items = cartState.items.map((item) => (item.id === id ? data : item));
}

export async function removeFromCart(id: string) {
  const { errors } = await client().models.CartItem.delete({ id });
  if (errors?.length) throw new Error(errors[0].message);
  cartState.items = cartState.items.filter((item) => item.id !== id);
}

export async function clearCart() {
  await Promise.all(cartState.items.map((item) => removeFromCart(item.id)));
}
