<script lang="ts">
  import { onMount } from "svelte";
  import "./proforma.scss";
  import NotificationBar from "$lib/components/NotificationBar.svelte";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import {
    getArticles,
    getMediaUrl,
    type StrapiArticle,
  } from "$lib/api/strapi";
  import CartStepper from "$lib/components/CartStepper.svelte";
  import SearchHeader from "$lib/components/SearchHeader.svelte";
  import FavoriteStar from "$lib/components/FavoriteStar.svelte";
  import { favoritesState, isFavorite } from "$lib/favorites.svelte";
  import { companyState } from "$lib/company.svelte";
  import { articleKey, cartState } from "$lib/cart.svelte";

  let articles = $state<StrapiArticle[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let searchTerm = $state("");
  // N'afficher que les articles mis en favoris par l'utilisateur
  let favoritesOnly = $state(false);

  let actionError = $state<string | null>(null);

  onMount(async () => {
    try {
      articles = await getArticles();
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
    } finally {
      loading = false;
    }
  });

  // Quantité d'un article dans le panier de la société (0 s'il n'y est pas)
  const quantityInCart = (article: StrapiArticle) =>
    cartState.items.find((item) => item.articleKey === articleKey(article))
      ?.quantity ?? 0;

  let sortOrder = $state<"default" | "asc" | "desc">("default");

  // Nom affiché sur la carte, utilisé pour le tri
  const articleName = (article: StrapiArticle) =>
    String(article.designation ?? article.reference ?? article.id);

  // Insensible aux accents et majuscules, "Produit 2" avant "Produit 10"
  const collator = new Intl.Collator("fr", {
    sensitivity: "base",
    numeric: true,
  });

  let filteredArticles = $derived.by(() => {
    const term = searchTerm.trim().toLowerCase();
    const visible = favoritesOnly ? articles.filter(isFavorite) : articles;
    const filtered = !term
      ? visible
      : visible.filter((article) =>
          [article.designation, article.reference, article.codebarre]
            .filter(Boolean)
            .some((field) => String(field).toLowerCase().includes(term)),
        );
    if (sortOrder === "default") return filtered;
    const direction = sortOrder === "asc" ? 1 : -1;
    return [...filtered].sort(
      (a, b) => direction * collator.compare(articleName(a), articleName(b)),
    );
  });
</script>

<NotificationBar />
<main
  class="main-content-space flex flex-col md:flex-row flex-1 min-h-0 gap-5 p-10 overflow-y-auto"
>
  <Sidebar />
  <div class="page-content flex-none md:flex-1 w-full min-w-0">
    <div
      class="proforma-container flex flex-col justify-between items-start gap-2 w-full h-full"
    >
      <SearchHeader
        bind:value={searchTerm}
        placeholder="Rechercher un article (désignation, référence, code-barres)"
      >
        <button
          type="button"
          onclick={() => (favoritesOnly = !favoritesOnly)}
          aria-pressed={favoritesOnly}
          disabled={!favoritesState.loaded}
          class="proforma-favorites-filter shrink-0 flex items-center gap-1.5"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={favoritesOnly ? "currentColor" : "none"}
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path
              d="M12 2.5l2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.52l-5.88 3.09 1.12-6.55L2.48 9.42l6.58-.96L12 2.5z"
            />
          </svg>
          Favoris
        </button>
      </SearchHeader>
      <div
        class="proforma-body flex-6 min-h-0 overflow-y-auto gap-1.5 flex flex-col justify-start items-start w-full"
      >
        <div
          class="proforma-body-count flex flex-row justify-between items-start w-full"
        >
          <p>Résultats ({filteredArticles.length})</p>
          {#if companyState.loaded && !companyState.company}
            <p>
              <a href="/societe" class="font-bold underline"
                >Créez votre société</a
              >
              pour utiliser le panier.
            </p>
          {:else if actionError}
            <p class="text-red-600">{actionError}</p>
          {/if}
          <label class="proforma-order flex items-center gap-1.5">
            Ordre
            <select bind:value={sortOrder} class="proforma-order-select">
              <option value="default">Par défaut</option>
              <option value="asc">A → Z</option>
              <option value="desc">Z → A</option>
            </select>
          </label>
        </div>
        <div
          class="proforma-body-table flex-1 flex flex-col justify-start items-start w-full"
        >
          {#if loading}
            <p>Chargement des articles…</p>
          {:else if error}
            <p class="text-red-600">{error}</p>
          {:else if favoritesOnly && favoritesState.loadError}
            <p class="text-red-600">{favoritesState.loadError}</p>
          {:else if filteredArticles.length === 0}
            <p>
              {favoritesOnly && !searchTerm.trim()
                ? "Vous n'avez encore aucun article en favori."
                : "Aucun article ne correspond à votre recherche."}
            </p>
          {:else}
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
              {#each filteredArticles as article (article.id)}
                <div class="article-card flex flex-col w-full rounded-md">
                  <div
                    class="article-card-image relative aspect-square shrink-0 w-full flex items-center justify-center overflow-hidden"
                  >
                    {#if article.cover?.url}
                      <img
                        src={getMediaUrl(article.cover.url)}
                        alt={article.cover.alternativeText ?? ""}
                        class="w-full h-full object-cover"
                      />
                    {/if}
                  </div>
                  <div class="article-card-info flex flex-col gap-1 p-3">
                    <!-- Étoile centrée sur le nom, référence alignée sous le nom -->
                    <div
                      class="grid grid-cols-[auto_1fr] items-center gap-x-2 gap-y-1"
                    >
                      <FavoriteStar
                        {article}
                        onerror={(message) => (actionError = message)}
                      />
                      <h3 class="min-w-0">
                        {article.designation ?? article.reference ?? article.id}
                      </h3>
                      <p class="col-start-2">
                        {article.reference ?? article.codebarre ?? ""}
                      </p>
                    </div>
                  </div>
                  <div class="flex w-full">
                    <div
                      class="article-card-action flex-1 flex items-center justify-center"
                    >
                      <a
                        href={`/proforma/${article.slug ?? article.documentId ?? article.id}`}
                        class="article-card-detail flex-1 p-3 text-center"
                      >
                        Voir le détail
                      </a>
                    </div>

                    <div class="article-card-cart flex items-center justify-center">
                      <CartStepper
                        {article}
                        onerror={(message) => (actionError = message)}
                      />
                    </div>
                    <div
                      class="article-card-action flex items-center justify-center"
                    >
                      <!-- Quantité de cet article dans le panier, s'il y est -->
                      {#if quantityInCart(article) > 0}
                        <span class="article-card-cart-count px-3">
                          {quantityInCart(article)}
                        </span>
                      {/if}
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</main>
