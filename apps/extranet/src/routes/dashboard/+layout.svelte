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
        class="sidebar-company rounded-md shrink-0 w-full flex items-center justify-center px-7.5 py-4"
      >
        <div class="sidebar-company-content flex items-center gap-2.5">
          <img
            alt="Votre logo"
            class="profil-picture size-15 shrink-0 rounded-full object-cover bg-gray-300"
          />
          <div class="sidebar-company-name flex flex-col">
            <h1 class="whitespace-nowrap">Nom de la société</h1>
            <p>Gérer mon profil</p>
          </div>
        </div>
      </div>
      <div class="sidebar-button shrink-0 w-full flex items-center gap-5">
        <div
          class="pocket-button rounded-md flex-1 flex justify-center items-center"
        >
          <div
            class="pocket-button-container flex flex-col items-center gap-1.5 py-2.5"
          >
            <svg
              class="sidebar-button-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="23.26"
              height="20"
              viewBox="0 0 22.528 19.369"
            >
              <g id="panier-icone" transform="translate(0.5 0.5)">
                <path
                  id="Path_2462"
                  data-name="Path 2462"
                  d="M8.4,10.42,12.612,3.4l4.212,7.02"
                  transform="translate(-1.848 -3.4)"
                  fill="none"
                  stroke="#000"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                />
                <path
                  id="Path_2463"
                  data-name="Path 2463"
                  d="M2.8,9.4H24.328"
                  transform="translate(-2.8 -2.38)"
                  fill="none"
                  stroke="#000"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                />
                <path
                  id="Path_2464"
                  data-name="Path 2464"
                  d="M4.6,9.4l1.58,9.419a2.34,2.34,0,0,0,2.3,1.931h9.547a2.34,2.34,0,0,0,2.3-1.931L21.916,9.4"
                  transform="translate(-2.494 -2.38)"
                  fill="none"
                  stroke="#000"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                />
                <path
                  id="Path_2465"
                  data-name="Path 2465"
                  d="M9.7,12.9v3.744M15.082,12.9v3.744"
                  transform="translate(-1.627 -1.785)"
                  fill="none"
                  stroke="#000"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                />
              </g>
            </svg>

            <a href="/dashboard/cart">Panier</a>
          </div>
        </div>
        <div
          class="notification-button rounded-md flex-1 flex justify-center items-center"
        >
          <div
            class="notification-button-container flex flex-col items-center gap-1.5 py-2.5"
          >
            <svg
              class="sidebar-button-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="17.33"
              height="20"
              viewBox="0 0 16.031 18.5"
            >
              <g id="cloche-icone" transform="translate(0.516 0.5)">
                <path
                  id="Path_2466"
                  data-name="Path 2466"
                  d="M11.628,3.2A5.147,5.147,0,0,0,6.34,8.37c0,3.139-.524,5.078-2,6.693A.8.8,0,0,0,4.959,16.4H18.3a.8.8,0,0,0,.619-1.339c-1.477-1.616-2-3.554-2-6.693A5.147,5.147,0,0,0,11.628,3.2Z"
                  transform="translate(-4.128 -3.2)"
                  fill="none"
                  stroke="#000"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                />
                <path
                  id="Path_2467"
                  data-name="Path 2467"
                  d="M13.7,20.4a2.065,2.065,0,0,1-3.554,0"
                  transform="translate(-4.427 -4.413)"
                  fill="none"
                  stroke="#000"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </g>
            </svg>

            <a href="/dashboard/notifications">Notifications</a>
          </div>
        </div>
      </div>
      <button
        class="sidebar-short-pro rounded-md shrink-0 flex justify-center items-center w-full py-2.5"
      >
        <p>Crée une proforma</p>
      </button>
      <div
        class="sidebar-menu-nav-apro rounded-md flex-1 flex flex-col gap-2.5"
      >
        <div class="apro-big-container flex flex-col gap-3 mt-3 pb-5">
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
        <div class="market-big-container flex flex-col gap-3 mt-3">
          <h1 class="text-center">Communiquer</h1>
          <div class="menu-market-container flex flex-col gap-2.5">
            <div
              class="sidebar-menu-nav-market-cata flex flex-col gap-0.5 w-47.5 self-center"
            >
              <a href="/dashboard/proforma">Menu 1</a>
              <p>explication</p>
            </div>
            <div
              class="sidebar-menu-nav-market-pro flex flex-col gap-0.5 w-47.5 self-center"
            >
              <a href="/dashboard/proforma">Menu 2</a>
              <p>Explication du menu 2</p>
            </div>
          </div>
        </div>
      </div>

      <div class="littlebar-wrapper w-full shrink-0 flex gap-5">
        <div class="sign-and-home flex-1 flex flex-col justify-center">
          <div class="home-sign-container flex flex-col py-3 pl-2.5 gap-1.5">
            <div class="home-button-container flex items-center gap-1.5 ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15.5"
                height="15"
                viewBox="0 0 12.712 12.3"
              >
                <g id="accueil" transform="translate(0.706 0.5)">
                  <path
                    id="Path_2502"
                    data-name="Path 2502"
                    d="M2,7.085,7.65,2,13.3,7.085"
                    transform="translate(-2 -2)"
                    fill="none"
                    stroke="#333333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                  />
                  <path
                    id="Path_2503"
                    data-name="Path 2503"
                    d="M4,11v6.215H7.107v-3.39H9.932v3.39H13.04V11"
                    transform="translate(-2.87 -5.915)"
                    fill="none"
                    stroke="#333333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                  />
                </g>
              </svg>
              <a href="/dashboard">Accueil</a>
            </div>
            <div class="sign-out-button-container flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14.5"
                height="14.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#333333"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <path d="M16 17l5-5-5-5" />
                <path d="M21 12H9" />
              </svg>
              <button onclick={handleSignOut} class="whitespace-nowrap"
                >Sign out</button
              >
            </div>
          </div>
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
