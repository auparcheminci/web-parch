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
  <div class="flex h-full w-full flex-col">
    <div class="main-topbar flex w-full justify-between">
      <div class="profil-space">
        <div class="profil-icon">
          <p>au parchemin</p>
        </div>
      </div>
      <div class="profil-sign-out-space flex">
        <p>Profil</p>
        <button onclick={handleSignOut}>Sign out</button>
      </div>
    </div>
    <div class="main-content-space flex-1 min-h-0 p-2.5">
      <div class="content-template-space w-full h-full">
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
    </div>
  </div>
{/if}
