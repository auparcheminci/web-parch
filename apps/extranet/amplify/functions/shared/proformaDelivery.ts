import type { Schema } from '../../data/resource';

type CartRequest = Schema['CartRequest']['type'];

// Point d'envoi unique d'une proforma (PDF au chemin request.pdfPath) à son destinataire
// final. Aucun destinataire n'est encore défini : la demande est seulement journalisée.
// Quand il le sera (email commercial via Brevo, par exemple), l'envoi se fera ici, et
// le bouton « Redemander » l'utilisera sans autre changement. Renvoie true si envoyé
export async function deliverProforma(request: CartRequest) {
  console.info('Proforma demandée, aucun destinataire défini', {
    requestId: request.id,
    companyId: request.companyId,
    pdfPath: request.pdfPath,
  });
  return false;
}
