<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { getCurrentUser, signOut } from "aws-amplify/auth";

  let { children } = $props();
  let checkingAuth = $state(true);
  let user = $state<Awaited<ReturnType<typeof getCurrentUser>> | null>(null);

  onMount(async () => {
    try {
      user = await getCurrentUser();
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
  <nav class="dashboard-menu flex top-0 w-full z-50">
    <ul
      class="menu-list flex flex-wrap justify-between items-center gap-1.25 w-full min-w-0 p-2.5"
    >
      <li><a href="/dashboard">Accueil</a></li>
      <li><a href="/dashboard/proforma">Proforma</a></li>
      <li><a href="/dashboard/marketing">Marketing</a></li>
      <li><a href="/dashboard/profil">Profil</a></li>
    </ul>
    <p class="wrap-break-word">
      Welcome, Welcome {user?.signInDetails?.loginId}
    </p>
    <div
      class="topbar-wrapper flex flex-wrap justify-between items-center gap-1.25 w-full min-w-0 p-2.5"
    >
      <div class="logo-space flex items-center">
        <div class="logo-icon flex items-center">
          <p class="whitespace-nowrap">au parchemin</p>
        </div>
      </div>
      <div
        class="profil-sign-out-space flex flex-wrap items-center gap-1.25 min-w-0"
      >
        <img
          alt="Votre logo"
          class="profil-picture size-8 shrink-0 rounded-full object-cover bg-gray-300"
        />
        <button onclick={handleSignOut} class="whitespace-nowrap"
          >Sign out</button
        >
      </div>
    </div>
  </nav>
  <div class="main-content-space flex-1 min-h-0 p-2.5">
    {@render children()}
  </div>
 <!--<div class="flex flex-1 min-h-0 w-full flex-col gap-2.5">
    <div class="main-topbar flex w-full min-w-0 shrink-0">
      <p>Search & Filter</p>
    </div>
  </div>--> 
{/if}
