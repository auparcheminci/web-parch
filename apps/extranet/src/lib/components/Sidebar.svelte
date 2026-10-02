<script lang="ts">
  import { signOut } from "aws-amplify/auth";
  import { companyState, resetCompany } from "$lib/company.svelte";
  import { cartCount, resetCart } from "$lib/cart.svelte";
  import { resetFavorites } from "$lib/favorites.svelte";
  import { userState } from "$lib/user.svelte";

  // Sections repliables : une section réduite n'affiche plus que son titre,
  // l'autre prend la place restante
  let aproOpen = $state(true);
  let marketOpen = $state(true);

  async function handleSignOut() {
    try {
      await signOut();
    } catch (err) {
      console.error("Sign out failed", err);
    }
    resetCompany();
    resetCart();
    resetFavorites();
    // Rechargement complet plutôt que goto : l'Authenticator d'Amplify ne reçoit sa
    // configuration (formFields) qu'à son démarrage. Si la session a été ouverte sans
    // passer par la page de connexion, ce démarrage s'est fait sans elle et
    // l'inscription n'afficherait plus Prénom, Nom, Téléphone et Poste
    window.location.assign("/");
  }
</script>

<div class="sidebar flex flex-col gap-5 w-full md:h-full md:w-64 shrink-0">
  <div
    class="sidebar-company rounded-md shrink-0 w-full flex items-center justify-center px-7.5 py-4"
  >
    <div class="sidebar-company-content flex items-center gap-2.5">
      {#if companyState.logoUrl}
        <img
          src={companyState.logoUrl}
          alt="Logo de la société"
          class="profil-picture size-15 shrink-0 rounded-full object-cover bg-gray-300"
        />
      {:else}
        <!-- Pas de logo : cercle vide plutôt qu'une image cassée -->
        <div class="profil-picture size-15 shrink-0 rounded-full bg-gray-300"></div>
      {/if}
      <div class="sidebar-company-name flex flex-col">
        <h1 class="whitespace-nowrap">
          {companyState.company?.name ?? "Nom de la société"}
        </h1>
        <a href="/societe">
          {companyState.company
            ? // Seul l'administrateur (créateur) gère la société ; les membres la consultent
              companyState.isOwner
              ? "Gérer ma société"
              : "Voir ma société"
            : companyState.pendingRequest
              ? "Demande en cours"
              : "Créer ma société"}
        </a>
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

        <a href="/panier">
          Panier{#if cartCount() > 0}
            <span class="pocket-count rounded-full ml-1 px-1.5">{cartCount()}</span>
          {/if}
        </a>
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
    class="sidebar-menu-nav-apro rounded-md flex flex-col gap-2.5 {aproOpen
      ? 'flex-1'
      : 'shrink-0'}"
  >
    <div
      class="apro-big-container flex flex-col gap-3 mt-3 {aproOpen
        ? 'pb-5'
        : 'pb-3'}"
    >
      <div class="flex items-center justify-center gap-2.5">
        <h1>S'approvisionnez</h1>
        <button
          type="button"
          onclick={() => (aproOpen = !aproOpen)}
          aria-expanded={aproOpen}
          aria-label={aproOpen ? "Réduire la section S'approvisionnez" : "Ouvrir la section S'approvisionnez"}
          class="shrink-0 flex cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16.985"
            height="16.985"
            viewBox="0 0 16.985 16.985"
            class="overflow-visible"
          >
            <g transform="translate(0 0.618)">
              <circle
                cx="8.493"
                cy="8.493"
                r="8.493"
                transform="translate(0 -0.618)"
                fill="#121212"
              />
              <!-- Plus quand la section est ouverte, moins quand elle est réduite -->
              <path
                d={aproOpen ? "M17.468,14v6.935M14,17.468h6.935" : "M14,17.468h6.935"}
                transform="translate(-9.145 -9.423)"
                fill="#434343"
                stroke="#fff"
                stroke-linecap="round"
                stroke-width="2"
              />
            </g>
          </svg>
        </button>
      </div>
      {#if aproOpen}
        <div class="menu-apro-container flex flex-col gap-2.5">
          <div
            class="sidebar-menu-nav-apro-cata flex flex-col gap-0.5 w-47.5 self-center"
          >
            <a href="/catalogue">Catalogues</a>
            <p>
              Consultez les catalogues de nos différentes marques et
              fournisseurs
            </p>
          </div>
          <div
            class="sidebar-menu-nav-apro-pro flex flex-col gap-0.5 w-47.5 self-center"
          >
            <a href="/proforma">Produits</a>
            <p>Consultez notre base de donnée produits</p>
          </div>
        </div>
      {/if}
    </div>
  </div>
  <div
    class="sidebar-menu-nav-market rounded-md flex flex-col gap-2.5 {marketOpen
      ? 'flex-1'
      : 'shrink-0'}"
  >
    <div
      class="market-big-container flex flex-col gap-3 mt-3 {marketOpen
        ? ''
        : 'pb-3'}"
    >
      <div class="flex items-center justify-center gap-2.5">
        <h1>Communiquer</h1>
        <button
          type="button"
          onclick={() => (marketOpen = !marketOpen)}
          aria-expanded={marketOpen}
          aria-label={marketOpen ? "Réduire la section Communiquer" : "Ouvrir la section Communiquer"}
          class="shrink-0 flex cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16.985"
            height="16.985"
            viewBox="0 0 16.985 16.985"
            class="overflow-visible"
          >
            <g transform="translate(0 0.618)">
              <circle
                cx="8.493"
                cy="8.493"
                r="8.493"
                transform="translate(0 -0.618)"
                fill="#121212"
              />
              <!-- Plus quand la section est ouverte, moins quand elle est réduite -->
              <path
                d={marketOpen ? "M17.468,14v6.935M14,17.468h6.935" : "M14,17.468h6.935"}
                transform="translate(-9.145 -9.423)"
                fill="#434343"
                stroke="#fff"
                stroke-linecap="round"
                stroke-width="2"
              />
            </g>
          </svg>
        </button>
      </div>
      {#if marketOpen}
        <div class="menu-market-container flex flex-col gap-2.5">
          <div
            class="sidebar-menu-nav-market-cata flex flex-col gap-0.5 w-47.5 self-center"
          >
            <a href="/marketing">Menu 1</a>
            <p>explication</p>
          </div>
          <div
            class="sidebar-menu-nav-market-pro flex flex-col gap-0.5 w-47.5 self-center"
          >
            <a href="/marketing">Menu 2</a>
            <p>Explication du menu 2</p>
          </div>
        </div>
      {/if}
    </div>
  </div>

  <div class="littlebar-wrapper w-full shrink-0 flex gap-2.5">
    <a
      href="/dashboard"
      aria-label="Accueil"
      title="Accueil"
      class="littlebar-tab flex-1 min-w-0 rounded-md py-2.5 flex flex-col items-center justify-center gap-1.5"
    >
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
    </a>
    <button
      onclick={handleSignOut}
      aria-label="Sign out"
      title="Sign out"
      class="littlebar-tab flex-1 min-w-0 rounded-md py-2.5 flex flex-col items-center justify-center gap-1.5"
    >
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
    </button>
    <a
      href="/profil"
      class="littlebar-tab shrink-0 rounded-md py-2.5 px-6 flex flex-row items-center justify-center gap-1.5"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16.17"
        height="16.17"
        viewBox="0 0 16.17 16.17"
        class="shrink-0"
      >
        <g id="icone-parametres" transform="translate(-1.09 -1.09)">
          <path
            id="Path_2511"
            data-name="Path 2511"
            d="M7.783,3.368,8.155,1.59h2.04l.372,1.778,1.727.714,1.523-.991,1.443,1.443-.991,1.523.714,1.727,1.778.372v2.04l-1.778.372-.714,1.727.991,1.523-1.443,1.443-1.523-.991-1.727.714-.372,1.778H8.155l-.372-1.778-1.727-.714-1.523.991L3.091,13.816l.991-1.523-.714-1.727L1.59,10.195V8.155l1.778-.372.714-1.727L3.091,4.534,4.534,3.091l1.523.991Z"
            transform="translate(0 0)"
            fill="none"
            stroke="#000"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
          />
          <circle
            id="Ellipse_108"
            data-name="Ellipse 108"
            cx="2.332"
            cy="2.332"
            r="2.332"
            transform="translate(6.843 6.843)"
            fill="none"
            stroke="#000"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
          />
        </g>
      </svg>
      <span class="whitespace-nowrap">
        {userState.name}
      </span>
    </a>
  </div>
</div>
