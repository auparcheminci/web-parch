// Inscription à la liste newsletter Brevo.
// La clé d'API et l'id de liste sont des secrets Amplify (BREVO_API_KEY, BREVO_LIST_ID)
type BrevoConfig = { apiKey: string; listId: string };

const API_URL = 'https://api.brevo.com/v3';

// Ajoute l'email à la liste uniquement s'il est inconnu de Brevo. Un contact existant
// n'est jamais modifié (ni ajouté, ni retiré, ni mis à jour) : Brevo reste la référence
// pour son statut. Renvoie true si le contact a été créé
export async function subscribeIfNewContact(config: BrevoConfig, email: string) {
  const response = await fetch(`${API_URL}/contacts`, {
    method: 'POST',
    headers: {
      'api-key': config.apiKey,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    // updateEnabled: false -> Brevo refuse au lieu de mettre à jour un contact existant
    body: JSON.stringify({
      email,
      listIds: [Number(config.listId)],
      updateEnabled: false,
    }),
  });
  if (response.ok) return true;

  const text = await response.text();
  // Contact déjà présent dans Brevo : on n'y touche pas
  if (response.status === 400 && /duplicate_parameter|already/i.test(text)) return false;
  throw new Error(`Brevo : ${response.status} ${text}`);
}
