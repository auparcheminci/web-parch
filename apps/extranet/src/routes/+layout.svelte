<script lang="ts">
	import { Amplify } from 'aws-amplify';
	import outputs from '../../amplify_outputs.json';
	import './layout.scss';
	import favicon from '$lib/assets/favicon.svg';
	import '@aws-amplify/ui-svelte/styles.css';

	Amplify.configure(outputs, { ssr: true });

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}