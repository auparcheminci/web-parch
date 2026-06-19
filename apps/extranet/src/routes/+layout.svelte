<script lang="ts">
	import { Amplify } from 'aws-amplify';
	import { I18n } from 'aws-amplify/utils';
	import outputs from '../../amplify_outputs.json';
	import '../app.css';
	import './layout.scss';
	import favicon from '$lib/assets/favicon.svg';
	import '@aws-amplify/ui-svelte/styles.css';

	Amplify.configure(outputs, { ssr: true });

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