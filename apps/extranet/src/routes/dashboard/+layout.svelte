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
  <div class="topbar-wrapper flex h-18.75 shrink-0 justify-center items-center">
    <div class="notification-content flex items-center gap-2.5">
      <svg
        class="notification-arrow-left"
        width="25"
        height="25"
        viewBox="0 0 24 24"
        fill="none"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      <p>Notification Bar</p>
      <svg
        class="notification-arrow-right"
        width="25"
        height="25"
        viewBox="0 0 24 24"
        fill="none"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </div>
  </div>
  <main
    class="main-content-space flex flex-col md:flex-row flex-1 min-h-0 gap-5 p-10"
  >
    <div class="sidebar flex flex-col gap-5 w-full h-full md:w-64 shrink-0">
      <div
        class="sidebar-company rounded-md shrink-0 h-16 w-full flex items-center justify-center px-7.5"
      >
        <div class="sidebar-company-content flex items-center gap-2.5">
          <img
            alt="Votre logo"
            class="profil-picture size-8 shrink-0 rounded-full object-cover bg-gray-300"
          />
          <div class="sidebar-company-name flex flex-col gap-2.5">
            <p class="whitespace-nowrap">Nom de la société</p>
            <p>Gérer mon profil</p>
          </div>
        </div>
      </div>
      <div class="sidebar-button shrink-0 w-full flex items-center gap-5 h-10">
        <div
          class="pocket-button rounded-md flex-1 flex justify-center items-center"
        >
          <p>Panier</p>
        </div>
        <div
          class="notification-button rounded-md flex-1 flex justify-center items-center"
        >
          <p>Notification</p>
        </div>
      </div>
      <button
        class="sidebar-short-pro rounded-md shrink-0 flex justify-center items-center w-full h-10"
      >
        <p>Crée une proforma</p>
      </button>
      <div
        class="sidebar-menu-nav-apro rounded-md flex-1 flex flex-col gap-2.5"
      >
        <div class="apro-big-container flex flex-col gap-3 mt-3">
          <h1 class="text-center">S'approvisionnez</h1>
          <div class="menu-apro-container flex flex-col gap-2.5">
            <div
              class="sidebar-menu-nav-apro-cata flex flex-col gap-0.5 w-47.5 self-center"
            >
              <a href="/dashboard/proforma">Catalogues</a>
              <p>
                Consultez les catalogues de nos différentes marques et
                fournisseurs
              </p>
            </div>
            <div
              class="sidebar-menu-nav-apro-pro flex flex-col gap-0.5 w-47.5 self-center"
            >
              <a href="/dashboard/proforma">Produits</a>
              <p>Consultez notre base de donnée produits</p>
            </div>
          </div>
        </div>
      </div>
      <div
        class="sidebar-menu-nav-market rounded-md flex-1 flex flex-col gap-2.5"
      >
        <h1 class="text-center mt-5">Communiquer</h1>
        <div class="sidebar-menu-nav-market-one flex flex-col gap-2.5">
          <a href="/dashboard/proforma">Calendrier</a>
          <p>Explication</p>
        </div>
        <div class="sidebar-menu-nav-market-two flex flex-col gap-2.5">
          <a href="/dashboard/proforma">Calendrier</a>
          <p>Menu 2</p>
        </div>
      </div>

      <div class="littlebar-wrapper w-full shrink-0 h-16 flex gap-5">
        <div class="sign-and-home flex-1 flex flex-col gap-2.5">
          <a href="/dashboard">Accueil</a>
          <button onclick={handleSignOut} class="whitespace-nowrap"
            >Sign out</button
          >
        </div>
        <div class="profil-space flex-1 min-w-0">
          <div class="logo-icon flex items-center min-w-0">
            <p class="wrap-break-word min-w-0">
              {user?.signInDetails?.loginId}
            </p>
          </div>
        </div>
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
