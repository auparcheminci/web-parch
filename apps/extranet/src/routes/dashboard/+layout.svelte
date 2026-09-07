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
  <main class="main-content-space flex flex-col md:flex-row flex-1 min-h-0 gap-5 p-10">
    <div class="sidebar w-full md:w-64 shrink-0">
      <div class="sidebar-mainbar w-full h-full">
        <nav class="dashboard-menu flex flex-col w-full p-2.5">
        <div class="profil-info flex">
          <img
            alt="Votre logo"
            class="profil-picture size-8 shrink-0 rounded-full object-cover bg-gray-300"
          />
          <p class="wrap-break-word">
            {user?.signInDetails?.loginId}
          </p>
        </div>
          
          <ul class="menu-list flex flex-col gap-1.25">
            <li><a href="/dashboard">Accueil</a></li>
            <li><a href="/dashboard/proforma">Proforma</a></li>
            <li><a href="/dashboard/marketing">Marketing</a></li>
            <li><a href="/dashboard/profil">Profil</a></li>
          </ul>

          <div class="topbar-wrapper flex">
            <div class="logo-space flex items-center">
              <div class="logo-icon flex items-center">
                <p class="whitespace-nowrap">au parchemin</p>
              </div>
            </div>
            <div
              class="profil-sign-out-space flex flex-wrap items-center gap-1.25 min-w-0"
            >
              <button onclick={handleSignOut} class="whitespace-nowrap"
                >Sign out</button
              >
            </div>
          </div>
        </nav>
      </div>
    </div>
    <div class="page-content flex-1 min-w-0">
      {@render children()}
    </div>
  </main>
  <!--<div class="flex flex-1 min-h-0 w-full flex-col gap-2.5">
    <div class="main-topbar flex w-full min-w-0 shrink-0">
      <p>Search & Filter</p>
    </div>
  </div>-->
{/if}
