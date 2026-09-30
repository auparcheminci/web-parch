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
  import { companyState } from "$lib/company.svelte";

  let articles = $state<StrapiArticle[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let searchTerm = $state("");

  let cartError = $state<string | null>(null);

  onMount(async () => {
    try {
      articles = await getArticles();
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
    } finally {
      loading = false;
    }
  });

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
    const filtered = !term
      ? articles
      : articles.filter((article) =>
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
      />
      <div
        class="proforma-body flex-6 min-h-0 overflow-y-auto gap-1.5 flex flex-col justify-start items-start w-full"
      >
        <div
          class="proforma-body-count flex flex-row justify-between items-start w-full"
        >
          <p>Résultats ({filteredArticles.length})</p>
          {#if companyState.loaded && !companyState.company}
            <p>
              <a href="/societe" class="font-bold underline">Créez votre société</a>
              pour utiliser le panier.
            </p>
          {:else if cartError}
            <p class="text-red-600">{cartError}</p>
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
          {:else if filteredArticles.length === 0}
            <p>Aucun article ne correspond à votre recherche.</p>
          {:else}
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
              {#each filteredArticles as article (article.id)}
                <div class="article-card flex flex-col w-full rounded-md">
                  <div
                    class="article-card-image flex-1 w-full flex items-center justify-center overflow-hidden"
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
                    <h3>
                      {article.designation ?? article.reference ?? article.id}
                    </h3>
                    <p>
                      {article.reference ?? article.codebarre ?? ""}
                    </p>
                  </div>
                  <div class="flex w-full">
                    <a
                      href={`/proforma/${article.slug ?? article.documentId ?? article.id}`}
                      class="article-card-detail text-center flex-1 p-2.5"
                    >
                      Voir le détail
                    </a>
                    <div class="article-card-cart flex-1 p-1">
                      <CartStepper
                        {article}
                        onerror={(message) => (cartError = message)}
                      />
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
