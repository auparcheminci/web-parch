import type { Schema } from '../../data/resource';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from '$amplify/env/resend-cart-request';
import { isSameUser } from '../shared/identity';
import { deliverProforma } from '../shared/proformaDelivery';

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);
Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();

// Bouton « Redemander » : renvoie la même proforma (même PDF) à son destinataire final,
// puis enregistre la date et le nombre de demandes
export const handler: Schema['resendCartRequest']['functionHandler'] = async (event) => {
  const caller = (event.identity ?? {}) as { sub?: string; username?: string };
  if (!caller.sub) throw new Error('Non authentifié');

  const { data: request } = await client.models.CartRequest.get({
    id: event.arguments.requestId,
  });
  if (!request) throw new Error('Proforma introuvable');
  // Tout membre de la société peut redemander une de ses proformas
  if (!(request.members ?? []).some((member) => isSameUser(member, caller))) {
    throw new Error('Non autorisé');
  }

  await deliverProforma(request);

  const { data, errors } = await client.models.CartRequest.update({
    id: request.id,
    requestCount: (request.requestCount ?? 1) + 1,
    lastRequestedAt: new Date().toISOString(),
  });
  if (errors?.length) throw new Error(errors[0].message);
  return data;
};
