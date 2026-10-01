import { fetchUserAttributes } from 'aws-amplify/auth';
import { client } from '$lib/dataClient';

// Utilisateur connecté, chargé une fois par session (affiché dans la sidebar)
export const userState = $state<{ name: string }>({ name: '' });

export async function loadUser() {
  try {
    const attributes = await fetchUserAttributes();
    userState.name =
      [attributes['custom:Prénom'], attributes['custom:Nom']].filter(Boolean).join(' ') ||
      (attributes.email ?? '');
  } catch (err) {
    console.error('User load failed', err);
  }
}

// Interrupteur newsletter : ON abonne, OFF désabonne (Brevo + Cognito)
export async function setNewsletter(subscribed: boolean) {
  if (!client().mutations.setNewsletter) throw new Error("La newsletter n'est pas encore disponible");
  const { errors } = await client().mutations.setNewsletter({ subscribed });
  if (errors?.length) throw new Error(errors[0].message);
}
