<script lang="ts">
  import { getMediaUrl, type StrapiArticle } from "$lib/api/strapi";
  import { isFavorite, toggleFavorite } from "$lib/favorites.svelte";

  let {
    article,
    onerror,
  }: { article: StrapiArticle; onerror?: (message: string) => void } =
    $props();

  let active = $derived(isFavorite(article));
  let busy = $state(false);

  async function toggle() {
    busy = true;
    try {
      await toggleFavorite(
        article,
        article.cover?.url ? getMediaUrl(article.cover.url) : null,
      );
    } catch (err) {
      onerror?.(err instanceof Error ? err.message : String(err));
    } finally {
      busy = false;
    }
  }
</script>

<button
  onclick={toggle}
  disabled={busy}
  aria-pressed={active}
  aria-label={active ? "Retirer des favoris" : "Ajouter aux favoris"}
  title={active ? "Retirer des favoris" : "Ajouter aux favoris"}
  class="favorite-star"
>
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={active ? "currentColor" : "none"}
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linejoin="round"
  >
    <path
      d="M12 2.5l2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.52l-5.88 3.09 1.12-6.55L2.48 9.42l6.58-.96L12 2.5z"
    />
  </svg>
</button>

<style lang="scss">
  .favorite-star {
    display: flex;
    padding: 0.25rem;
    color: map.get($grey-scale, "1300");
    cursor: pointer;
  }

  .favorite-star:disabled {
    opacity: 0.6;
  }
</style>
