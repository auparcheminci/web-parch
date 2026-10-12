<script lang="ts">
  import { getMediaUrl, type StrapiArticle } from "$lib/api/strapi";
  import {
    addToCart,
    articleKey,
    cartState,
    setQuantity,
  } from "$lib/cart.svelte";
  import { companyState } from "$lib/company.svelte";

  let {
    article,
    onerror,
  }: { article: StrapiArticle; onerror?: (message: string) => void } =
    $props();

  // Quantité de cet article dans le panier de la société (0 s'il n'y est pas)
  let item = $derived(
    cartState.items.find((item) => item.articleKey === articleKey(article)),
  );
  let quantity = $derived(item?.quantity ?? 0);
  let busy = $state(false);

  async function change(delta: number) {
    busy = true;
    try {
      if (item) {
        // À 0, setQuantity retire l'article du panier
        await setQuantity(item.id, item.quantity + delta);
      } else {
        await addToCart(
          article,
          article.cover?.url ? getMediaUrl(article.cover.url) : null,
        );
      }
    } catch (err) {
      onerror?.(err instanceof Error ? err.message : String(err));
    } finally {
      busy = false;
    }
  }
</script>

<div class="cart-stepper flex items-center justify-center gap-2.5">
  {#if quantity > 0}
    <button
      onclick={() => change(-1)}
      disabled={busy}
      aria-label="Retirer un article"
      class="cart-stepper-button size-8 rounded-md">−</button
    >
  {/if}
  <!-- Icône chariot à la place de la quantité -->
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="cart-stepper-icon shrink-0"
    aria-hidden="true"
  >
    <path d="M2 4h2.5l2.4 11a1.5 1.5 0 0 0 1.5 1.2H19.5" />
    <path d="M5.2 7H21l-1.6 6.5H6.6" />
    <path d="M9.5 7v6.5M13.5 7v6.5M17.5 7v6.5M5.9 10.25h14.3" />
    <circle cx="9" cy="19.5" r="1.5" />
    <circle cx="17" cy="19.5" r="1.5" />
  </svg>
  <button
    onclick={() => change(1)}
    disabled={busy || !companyState.company}
    aria-label="Ajouter un article"
    class="cart-stepper-button size-8 rounded-md">+</button
  >
</div>

<style lang="scss">
  .cart-stepper-button {
    background-color: map.get($blue-vivid-scale, "1500");
    color: $font-color-white;
    font-weight: 700;

    &:disabled {
      opacity: 0.5;
    }
  }

  .cart-stepper-icon {
    color: map.get($grey-scale, "1300");
  }
</style>
