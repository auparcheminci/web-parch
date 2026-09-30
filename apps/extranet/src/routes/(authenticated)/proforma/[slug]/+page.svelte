<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import "./article-detail.scss";
  import {
    getArticleBySlugOrId,
    getMediaUrl,
    type StrapiArticle,
  } from "$lib/api/strapi";
  import { addToCart } from "$lib/cart.svelte";
  import { companyState } from "$lib/company.svelte";

  let article = $state<StrapiArticle | null>(null);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let quantity = $state(1);
  let added = $state(false);
  let adding = $state(false);
  let cartError = $state<string | null>(null);
  let addedTimeout: ReturnType<typeof setTimeout>;

  async function handleAddToCart() {
    if (!article || quantity < 1) return;
    adding = true;
    cartError = null;
    try {
      await addToCart(
        article,
        article.cover?.url ? getMediaUrl(article.cover.url) : null,
        quantity,
      );
    } catch (err) {
      cartError = err instanceof Error ? err.message : String(err);
      return;
    } finally {
      adding = false;
    }
    quantity = 1;
    added = true;
    clearTimeout(addedTimeout);
    addedTimeout = setTimeout(() => (added = false), 2500);
  }

  onMount(async () => {
    const slug = page.params.slug;
    if (!slug) {
      error = "Article introuvable";
      loading = false;
      return;
    }

    try {
      article = await getArticleBySlugOrId(slug);
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
    } finally {
      loading = false;
    }
  });
</script>

<div class="article-page flex flex-col w-full h-full">
  <a href="/proforma" class="article-detail-back">&larr; Retour</a>

  {#if loading}
    <p>Chargement de l'article…</p>
  {:else if error}
    <p class="text-red-600">{error}</p>
  {:else if article}
    <div class="flex flex-col md:flex-row gap-6">
      <div
        class="article-detail-image flex-1 md:max-w-md aspect-square flex items-center justify-center overflow-hidden rounded-md"
      >
        {#if article.cover?.url}
          <img
            src={getMediaUrl(article.cover.url)}
            alt={article.cover.alternativeText ?? ""}
            class="w-full h-full object-cover"
          />
        {/if}
      </div>
      <div class="article-detail-info flex flex-col gap-2">
        <h1>{article.designation ?? article.reference ?? article.id}</h1>
        <p class="text-gray-500">
          {article.reference ?? article.codebarre ?? ""}
        </p>
        {#if article.content}
          <p>{article.content}</p>
        {/if}
        {#if companyState.loaded && !companyState.company}
          <p class="mt-4">
            <a href="/societe" class="article-detail-link">Créez votre société</a>
            pour utiliser le panier.
          </p>
        {:else}
          <div class="article-detail-cart flex items-center gap-2.5 mt-4">
            <label class="flex items-center gap-1.5">
              Quantité
              <input
                type="number"
                min="1"
                bind:value={quantity}
                class="article-detail-quantity w-20"
              />
            </label>
            <button
              onclick={handleAddToCart}
              disabled={quantity < 1 || adding || !companyState.company}
              class="article-detail-add rounded-md px-4 py-2"
            >
              {adding ? "Ajout…" : "Ajouter au panier"}
            </button>
          </div>
        {/if}
        {#if cartError}
          <p class="text-red-600">{cartError}</p>
        {/if}
        {#if added}
          <p class="article-detail-added">
            Article ajouté au panier. <a href="/panier" class="article-detail-link">Voir le panier</a>
          </p>
        {/if}
      </div>
    </div>
  {/if}
</div>
