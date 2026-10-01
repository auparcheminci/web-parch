import { fetchUserAttributes } from 'aws-amplify/auth';

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
