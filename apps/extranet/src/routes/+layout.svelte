<script lang="ts">
	import { Amplify } from 'aws-amplify';
	import { I18n } from 'aws-amplify/utils';
	import { useAuthenticator } from '@aws-amplify/ui-svelte';
	import outputs from '../../amplify_outputs.json';
	import '../app.css';
	import './layout.scss';
	import favicon from '$lib/assets/favicon.svg';
	import '@aws-amplify/ui-svelte/styles.css';

	Amplify.configure(outputs, { ssr: true });

	// Amplify UI's auth store is a module-level singleton that only sets up
	// its Hub listener the first time it's used, and tears that listener
	// down when whichever component first called it is destroyed. Claiming
	// it here, in the root layout that never unmounts, keeps the listener
	// alive across route navigation instead of dying the first time the
	// "/" page (where <Authenticator> lives) unmounts — which otherwise
	// froze the auth status and made sign-out bounce straight back to
	// /dashboard.
	useAuthenticator();

	I18n.putVocabulariesForLanguage('en', {
		// Boutons principaux
		'Sign In': 'Me connecter',
		'Sign in': 'Me connecter',
		'Create Account': 'Créer mon compte',
		'Confirm': 'Confirmer',
		'Submit': 'Valider',
		'Send code': 'Envoyer le code',

		// Liens et actions secondaires
		'Forgot your password?': 'Mot de passe oublié ?',
		'Back to Sign In': 'Retour à la connexion',
		'Resend Code': 'Renvoyer le code',
		'Reset Password': 'Réinitialiser le mot de passe',
	});

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="flex flex-col w-full h-screen" id="app">
	{@render children()}
</div>