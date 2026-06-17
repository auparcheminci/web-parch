<script lang="ts">
	import { Amplify } from 'aws-amplify';
	import outputs from '../../amplify_outputs.json';
	import '../app.css';
	import './layout.scss';
	import favicon from '$lib/assets/favicon.svg';
	import '@aws-amplify/ui-svelte/styles.css';

	Amplify.configure(outputs, { ssr: true });

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="grid w-full min-h-screen m-0 p-0" id="app">
	{@render children()}
</div>