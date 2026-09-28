import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import { defaultStorage, sessionStorage } from 'aws-amplify/utils';

// Choix "Se souvenir de moi" : session conservée dans localStorage (true)
// ou seulement pour l'onglet en cours dans sessionStorage (false).
// Ce choix doit être réappliqué à chaque chargement de l'app, sinon Amplify
// cherche la session dans localStorage et ne la trouve pas après un refresh.
const REMEMBER_ME_KEY = 'rememberMe';

export function getRememberMe() {
  try {
    return localStorage.getItem(REMEMBER_ME_KEY) === 'true';
  } catch {
    return false;
  }
}

export function applyTokenStorage(rememberMe = getRememberMe()) {
  cognitoUserPoolsTokenProvider.setKeyValueStorage(
    rememberMe ? defaultStorage : sessionStorage,
  );
}

export function setRememberMe(rememberMe: boolean) {
  try {
    localStorage.setItem(REMEMBER_ME_KEY, String(rememberMe));
  } catch {
    // Stockage indisponible (navigation privée…) : le choix ne sera pas mémorisé
  }
  applyTokenStorage(rememberMe);
}
