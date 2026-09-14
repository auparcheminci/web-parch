<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import "./article-detail.scss";
  import {
    getArticleBySlugOrId,
    getMediaUrl,
    type StrapiArticle,
  } from "$lib/api/strapi";

  let article = $state<StrapiArticle | null>(null);
  let loading = $state(true);
  let error = $state<string | null>(null);

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
      </div>
    </div>
  {/if}
</div>
