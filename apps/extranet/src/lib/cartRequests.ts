import { getUrl, uploadData } from 'aws-amplify/storage';
import type { Schema } from '../../amplify/data/resource';
import { cartCount, cartMembers, cartState, clearCart } from '$lib/cart.svelte';
import { buildCartPdf } from '$lib/cartPdf';
import { companyState, type SalesPoint } from '$lib/company.svelte';
import { client } from '$lib/dataClient';

export type CartRequest = Schema['CartRequest']['type'];

// Envoie le panier à la société sous forme de PDF, pour le point de vente choisi, puis le vide
export async function submitCartRequest(salesPoint: SalesPoint | undefined) {
  const company = companyState.company;
  if (!company) throw new Error('Créez votre société pour utiliser le panier');
  if (!client().models.CartRequest) throw new Error('Les proformas ne sont pas encore disponibles');
  if (cartState.items.length === 0) throw new Error('Le panier est vide');
  if (!salesPoint) throw new Error('Choisissez un point de vente');
  // Copie des seuls champs du point de vente, figée dans la proforma
  const { id, name, address, manager } = salesPoint;
  const point = { id, name, address, manager };

  const date = new Date();
  const pdf = await buildCartPdf(cartState.items, company, point, date);
  const fileName = `proforma-${date.toISOString().slice(0, 10)}.pdf`;

  // Nom aléatoire : seul l'enregistrement CartRequest permet de retrouver le fichier
  const { path } = await uploadData({
    path: `company-requests/${company.id}/${crypto.randomUUID()}.pdf`,
    data: pdf,
    options: { contentType: 'application/pdf' },
  }).result;

  const { errors } = await client().models.CartRequest.create({
    companyId: company.id,
    members: cartMembers(company),
    pdfPath: path,
    fileName,
    itemCount: cartCount(),
    salesPoint: point,
    requestCount: 1,
    lastRequestedAt: date.toISOString(),
  });
  if (errors?.length) throw new Error(errors[0].message);

  await clearCart();
}

// Demandes de la société, les plus récentes en premier
export async function listCartRequests() {
  const company = companyState.company;
  if (!company || !client().models.CartRequest) return [];
  const requests: CartRequest[] = [];
  let nextToken: string | null | undefined;
  do {
    const page = await client().models.CartRequest.listCartRequestByCompanyId(
      { companyId: company.id },
      { nextToken },
    );
    if (page.errors?.length) throw new Error(page.errors[0].message);
    requests.push(...page.data);
    nextToken = page.nextToken;
  } while (nextToken);
  return requests.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

// Lien de téléchargement temporaire du PDF d'une proforma
export async function getCartRequestUrl(request: CartRequest) {
  const { url } = await getUrl({
    path: request.pdfPath,
    options: { contentDisposition: `attachment; filename="${request.fileName}"` },
  });
  return url.toString();
}

// Bouton « Redemander » : renvoie la même proforma à son destinataire final
export async function resendCartRequest(requestId: string) {
  if (!client().mutations.resendCartRequest) throw new Error("« Redemander » n'est pas encore disponible");
  const { data, errors } = await client().mutations.resendCartRequest({ requestId });
  if (errors?.length) throw new Error(errors[0].message);
  return data;
}
