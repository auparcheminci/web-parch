<script lang="ts">
  import type { AuthUser } from "@aws-amplify/auth";
  import { getArticles, type StrapiArticle } from "$lib/api/strapi";

  let { user }: { user: AuthUser | undefined } = $props();

  let articles = $state<StrapiArticle[]>([]);
  let loading = $state(false);
  let error = $state<string | null>(null);

  // Amplify's Authenticator snippet re-renders with a new `user` object on
  // every auth state tick, so the effect must key off a stable primitive
  // instead of the object reference or it refetches forever and never
  // settles into a visible success/error state.
  let fetchedUserId: string | undefined;

  $effect(() => {
    const id = user?.userId ?? user?.username;
    if (!id || id === fetchedUserId) return;
    fetchedUserId = id;

    loading = true;
    error = null;

    getArticles()
      .then((data) => (articles = data))
      .catch((err) => (error = err instanceof Error ? err.message : String(err)))
      .finally(() => (loading = false));
  });
</script>

{#if loading}
  <p>Chargement des articles…</p>
{:else if error}
  <p class="text-red-600">{error}</p>
{:else}
  <ul>
    {#each articles as article (article.id)}
      <li>{article.title ?? article.id}</li>
    {/each}
  </ul>
{/if}
