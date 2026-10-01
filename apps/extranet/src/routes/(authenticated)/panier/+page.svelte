<script lang="ts">
  import { onMount } from "svelte";
  import "./panier.scss";
  import NotificationBar from "$lib/components/NotificationBar.svelte";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import {
    cartCount,
    cartState,
    clearCart,
    loadCart,
    removeFromCart,
    setQuantity,
  } from "$lib/cart.svelte";
  import { companyState } from "$lib/company.svelte";
  import { submitCartRequest } from "$lib/cartRequests";

  let error = $state<string | null>(null);
  let sending = $state(false);
  let sent = $state(false);

  async function handleRequest() {
    sending = true;
    sent = false;
    error = null;
    try {
      await submitCartRequest();
      sent = true;
    } catch (err) {
      console.error("Cart request failed", err);
      error = err instanceof Error ? err.message : "Impossible d'envoyer la proforma";
      // Réaffiche l'état réel du panier si l'échec a eu lieu en le vidant
      loadCart();
    } finally {
      sending = false;
    }
  }

  // Récupère les ajouts des collègues ; au premier chargement, le layout s'en occupe
  onMount(() => {
    if (companyState.loaded) loadCart();
  });

  async function run(action: () => Promise<void>) {
    error = null;
    try {
      await action();
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
      // Réaffiche l'état réel du panier après un échec
      loadCart();
    }
  }
</script>

<NotificationBar />
<main
  class="main-content-space flex flex-col md:flex-row flex-1 min-h-0 gap-5 p-10 overflow-y-auto"
>
  <Sidebar />
  <div class="page-content flex-none md:flex-1 w-full min-w-0">
    <div class="cart-page flex flex-col gap-4 w-full h-full p-4 rounded-md">
      <div class="flex justify-between items-center">
        <h1>Mon panier ({cartCount()})</h1>
        {#if cartState.items.length > 0}
          <button
            onclick={() => {
              if (confirm("Vider le panier de toute la société ?")) run(clearCart);
            }}
            class="cart-clear">Vider le panier</button
          >
        {/if}
      </div>

      {#if error}
        <p class="text-red-600">{error}</p>
      {/if}
      {#if sent}
        <p>
          Proforma envoyée. Retrouvez-la sur la page
          <a href="/societe" class="cart-link">de votre société</a>.
        </p>
      {/if}

      {#if companyState.loaded && !companyState.company}
        <p>
          <a href="/societe" class="cart-link">Créez votre société</a> pour utiliser
          le panier.
        </p>
      {:else if !cartState.loaded}
        <p>Chargement du panier…</p>
      {:else if cartState.loadError}
        <p class="text-red-600">{cartState.loadError}</p>
      {:else if cartState.items.length === 0}
        <p>
          Votre panier est vide. <a href="/proforma" class="cart-link"
            >Parcourir les produits</a
          >
        </p>
      {:else}
        <ul class="flex flex-col gap-2.5">
          {#each cartState.items as item (item.id)}
            <li class="cart-item flex items-center gap-4 p-2.5 rounded-md">
              <a
                href={`/proforma/${item.articleKey}`}
                class="cart-item-image size-16 shrink-0 overflow-hidden rounded-md"
              >
                {#if item.coverUrl}
                  <img
                    src={item.coverUrl}
                    alt=""
                    class="w-full h-full object-cover"
                  />
                {/if}
              </a>
              <a
                href={`/proforma/${item.articleKey}`}
                class="cart-item-info flex flex-col flex-1 min-w-0"
              >
                <h3>{item.designation}</h3>
                <p>{item.reference}</p>
              </a>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onchange={(e) => {
                  const quantity = e.currentTarget.valueAsNumber || 0;
                  run(() => setQuantity(item.id, quantity));
                }}
                aria-label="Quantité"
                class="cart-item-quantity w-20"
              />
              <button
                onclick={() => run(() => removeFromCart(item.id))}
                class="cart-item-remove"
              >
                Retirer
              </button>
            </li>
          {/each}
        </ul>
        <button
          onclick={handleRequest}
          disabled={sending}
          class="cart-request self-end rounded-md px-6 py-2.5"
        >
          {sending ? "Envoi…" : "Demander"}
        </button>
      {/if}
    </div>
  </div>
</main>
