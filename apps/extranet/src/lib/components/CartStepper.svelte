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
  <span class="cart-stepper-quantity min-w-6 text-center">{quantity}</span>
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

  .cart-stepper-quantity {
    font-weight: 700;
  }
</style>
