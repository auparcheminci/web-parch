<script lang="ts">
  import { onMount } from "svelte";
  import "./proforma.scss";
  import { getArticles, getMediaUrl, type StrapiArticle } from "$lib/api/strapi";

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
    class="proforma-header flex-1 flex flex-col justify-start items-start w-full"
  ></div>
  <div
    class="proforma-body flex-6 gap-1.5 flex flex-col justify-start items-start w-full"
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
        <div class="flex flex-wrap gap-4 w-full">
          {#each articles as article (article.id)}
            <div
              class="article-card flex flex-col rounded-md overflow-hidden bg-white border border-gray-200"
            >
              <div
                class="article-card-image aspect-square w-full flex items-center justify-center bg-white p-2"
              >
                {#if article.cover?.url}
                  <img
                    src={getMediaUrl(article.cover.url)}
                    alt={article.cover.alternativeText ?? ""}
                    class="max-w-full max-h-full object-contain"
                  />
                {/if}
              </div>
              <div class="article-card-info flex flex-col gap-1 p-3">
                <p class="font-bold text-sm">
                  {article.designation ?? article.reference ?? article.id}
                </p>
                <p class="text-xs text-gray-500">
                  {article.reference ?? article.codebarre ?? ""}
                </p>
              </div>
              <button
                class="article-card-detail bg-gray-200 font-bold text-sm py-2.5 w-full"
              >
                Voir le détail
              </button>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>
