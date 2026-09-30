<script lang="ts">
  import "./panier.scss";
  import NotificationBar from "$lib/components/NotificationBar.svelte";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import {
    cartCount,
    cartState,
    clearCart,
    removeFromCart,
    setQuantity,
  } from "$lib/cart.svelte";
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
          <button onclick={clearCart} class="cart-clear">Vider le panier</button>
        {/if}
      </div>

      {#if cartState.items.length === 0}
        <p>
          Votre panier est vide. <a href="/proforma" class="cart-link"
            >Parcourir les produits</a
          >
        </p>
      {:else}
        <ul class="flex flex-col gap-2.5">
          {#each cartState.items as item (item.key)}
            <li class="cart-item flex items-center gap-4 p-2.5 rounded-md">
              <a
                href={`/proforma/${item.key}`}
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
                href={`/proforma/${item.key}`}
                class="cart-item-info flex flex-col flex-1 min-w-0"
              >
                <h3>{item.designation}</h3>
                <p>{item.reference}</p>
              </a>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onchange={(e) =>
                  setQuantity(item.key, e.currentTarget.valueAsNumber || 0)}
                aria-label="Quantité"
                class="cart-item-quantity w-20"
              />
              <button
                onclick={() => removeFromCart(item.key)}
                class="cart-item-remove"
              >
                Retirer
              </button>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </div>
</main>
