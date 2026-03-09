<script lang="ts">
	import './layout.scss';
	import favicon from '$lib/assets/favicon.svg';
	let { children } = $props();
  import '$lib/amplify';
  import '@aws-amplify/ui-svelte/styles.css';
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
