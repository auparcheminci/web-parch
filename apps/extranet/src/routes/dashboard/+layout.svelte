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
  <div class="flex flex-1 min-h-0 w-full flex-col gap-2.5">
    <div class="main-topbar flex w-full min-w-0 shrink-0">
      <div class="topbar-wrapper flex flex-wrap justify-between items-center gap-1.25 w-full min-w-0 p-2.5">
        <div class="logo-space flex items-center">
          <div class="logo-icon flex items-center">
            <p class="whitespace-nowrap">au parchemin</p>
          </div>
        </div>
        <div class="profil-sign-out-space flex flex-wrap items-center gap-1.25 min-w-0">
          <img alt="Votre logo" class="profil-picture size-8 shrink-0 rounded-full object-cover bg-gray-300" />
          <div class="min-w-0">
            {@render children()}
          </div>
          <button onclick={handleSignOut} class="whitespace-nowrap">Sign out</button>
        </div>
      </div>
    </div>
    <div class="main-content-space flex-1 min-h-0 p-2.5">
      <div class="content-template-space flex flex-col md:flex-row justify-between items-start gap-1.25 w-full h-full">
        <nav class="dashboard-menu w-full md:w-1/5 md:min-w-32 shrink-0">
          <ul>
            <li><a href="/dashboard">Accueil</a></li>
            <li><a href="/dashboard/proforma">Proforma</a></li>
            <li><a href="/dashboard/marketing">Marketing</a></li>
            <li><a href="/dashboard/profil">Profil</a></li>
          </ul>
        </nav>
        <main class="main-pub-space w-full md:flex-1 self-stretch min-h-0">
          <img alt="Contenu à venir" class="main-pub-picture w-full h-full rounded-lg object-cover bg-gray-200" />
        </main>
      </div>
    </div>
  </div>
{/if}
