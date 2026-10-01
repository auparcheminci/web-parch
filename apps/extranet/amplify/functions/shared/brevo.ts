// Statut newsletter dans Brevo, piloté par l'interrupteur (inscription et profil).
// La clé d'API et l'id de liste sont des secrets Amplify (BREVO_API_KEY, BREVO_LIST_ID)
type BrevoConfig = { apiKey: string; listId: string };

const API_URL = 'https://api.brevo.com/v3';

// ON : abonné (désabonnement levé) et ajouté à la liste newsletter.
// OFF : désabonné de tous les emails marketing (statut "blocklisté" dans Brevo).
// Le contact est créé s'il n'existe pas, mis à jour sinon
export async function setNewsletterStatus(
  config: BrevoConfig,
  email: string,
  subscribed: boolean,
) {
  const response = await fetch(`${API_URL}/contacts`, {
    method: 'POST',
    headers: {
      'api-key': config.apiKey,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      email,
      emailBlacklisted: !subscribed,
      ...(subscribed ? { listIds: [Number(config.listId)] } : {}),
      updateEnabled: true,
    }),
  });
  if (!response.ok) {
    throw new Error(`Brevo : ${response.status} ${await response.text()}`);
  }
}
