<script lang="ts">
  import { onMount } from "svelte";
  import "./proforma.scss";
  import {
    getArticles,
    getMediaUrl,
    type StrapiArticle,
  } from "$lib/api/strapi";

  let articles = $state<StrapiArticle[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);

  onMount(async () => {
    try {
      articles = await getArticles();
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
    } finally {
      loading = false;
    }
  });
</script>

<div
  class="proforma-container flex flex-col justify-between items-start gap-2 w-full h-full"
>
  <div
    class="proforma-header flex-1 shrink-0 min-h-16 flex flex-col justify-start items-start w-full"
  ></div>
  <div
    class="proforma-body flex-6 min-h-0 overflow-y-auto gap-1.5 flex flex-col justify-start items-start w-full"
  >
    <div
      class="proforma-body-count flex flex-row justify-between items-start w-full"
    >
      <p>Résultats</p>
      <div class="proforma-order">
        <p>Ordre</p>
      </div>
    </div>
    <div
      class="proforma-body-table flex-1 flex flex-col justify-start items-start w-full"
    >
      {#if loading}
        <p>Chargement des articles…</p>
      {:else if error}
        <p class="text-red-600">{error}</p>
      {:else}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
          {#each articles as article (article.id)}
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
              <a
                href={`/dashboard/proforma/${article.slug ?? article.documentId ?? article.id}`}
                class="article-card-detail text-center w-full p-2.5"
              >
                Voir le détail
              </a>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>
