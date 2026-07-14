<script lang="ts">
	import { onMount } from "svelte";
	import { fetchUserAttributes } from "aws-amplify/auth";

	let attributes = $state<Partial<Record<string, string>>>({});

	onMount(async () => {
		attributes = await fetchUserAttributes();
	});
</script>

<main>
	<h1>Profil</h1>
	<ul>
		<li>Email : {attributes.email}</li>
		<li>Nom : {attributes["custom:Nom"]}</li>
		<li>Prénom : {attributes["custom:Prénom"]}</li>
		<li>Société : {attributes["custom:Société"]}</li>
		<li>Poste : {attributes["custom:Poste"]}</li>
	</ul>
</main>
