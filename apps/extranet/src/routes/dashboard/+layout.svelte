<script lang="ts">
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { getCurrentUser, signOut } from "aws-amplify/auth";

	let { children } = $props();
	let checkingAuth = $state(true);

	onMount(async () => {
		try {
			await getCurrentUser();
		} catch {
			goto("/");
			return;
		}
		checkingAuth = false;
	});
	 async function handleSignOut() {
    try {
      await signOut();
    } catch (err) {
      console.error("Sign out failed", err);
    }
    goto("/");
  }
</script>

{#if !checkingAuth}
	<div class="flex h-full w-full">
	<div>
		<p>Profil</p>
		 <button onclick={handleSignOut}>Sign out</button>
	</div>
		<nav class="dashboard-menu">
			<ul>
				<li><a href="/dashboard">Accueil</a></li>
				<li><a href="/dashboard/proforma">Proforma</a></li>
				<li><a href="/dashboard/marketing">Marketing</a></li>
				<li><a href="/dashboard/profil">Profil</a></li>
			</ul>
		</nav>
		<main class="flex-1">
			{@render children()}
		</main>
	</div>
{/if}
