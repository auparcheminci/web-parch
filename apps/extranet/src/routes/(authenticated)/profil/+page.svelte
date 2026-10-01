<script lang="ts">
  import { onMount } from "svelte";
  import { fetchUserAttributes } from "aws-amplify/auth";
  import NotificationBar from "$lib/components/NotificationBar.svelte";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import { favoritesState, removeFavorite } from "$lib/favorites.svelte";
  import { setNewsletter } from "$lib/user.svelte";

  let attributes = $state<Partial<Record<string, string>>>({});
  let favoritesError = $state("");

  let newsletter = $derived(attributes["custom:Newsletter"] === "true");
  let newsletterBusy = $state(false);
  let newsletterError = $state("");

  async function handleNewsletterChange(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    const subscribed = input.checked;
    newsletterBusy = true;
    newsletterError = "";
    try {
      await setNewsletter(subscribed);
      attributes["custom:Newsletter"] = String(subscribed);
    } catch (err) {
      // Remet l'interrupteur dans son état réel
      input.checked = newsletter;
      newsletterError = err instanceof Error ? err.message : String(err);
    } finally {
      newsletterBusy = false;
    }
  }

  async function handleRemove(id: string) {
    favoritesError = "";
    try {
      await removeFavorite(id);
    } catch (err) {
      favoritesError = err instanceof Error ? err.message : String(err);
    }
  }

  onMount(async () => {
    attributes = await fetchUserAttributes();
  });
</script>

<NotificationBar />
<main
  class="main-content-space flex flex-col md:flex-row flex-1 min-h-0 gap-5 p-10 overflow-y-auto"
>
  <Sidebar />
  <div class="page-content flex-none md:flex-1 w-full min-w-0">
    <main>
      <h1>Profil</h1>
      <ul>
        <li>Email : {attributes.email}</li>
        <li>Nom : {attributes["custom:Nom"]}</li>
        <li>Prénom : {attributes["custom:Prénom"]}</li>
        <li>Poste : {attributes["custom:Poste"]}</li>
      </ul>

      <div class="flex items-center gap-2.5 mt-5">
        <label for="newsletter-toggle">Recevoir notre newsletter</label>
        <label class="toggle-switch">
          <input
            type="checkbox"
            id="newsletter-toggle"
            checked={newsletter}
            disabled={newsletterBusy}
            onchange={handleNewsletterChange}
          />
          <span class="toggle-slider"></span>
        </label>
      </div>
      <p class="text-sm">
        Désactivé, vous ne recevrez plus aucun de nos emails marketing.
      </p>
      {#if newsletterError}
        <p class="text-red-600">{newsletterError}</p>
      {/if}

      <section class="flex flex-col gap-2.5 mt-5">
        <h2>Mes favoris ({favoritesState.items.length})</h2>
        {#if favoritesError}
          <p class="text-red-600">{favoritesError}</p>
        {/if}
        {#if !favoritesState.loaded}
          <p>Chargement des favoris…</p>
        {:else if favoritesState.loadError}
          <p class="text-red-600">{favoritesState.loadError}</p>
        {:else if favoritesState.items.length === 0}
          <p>
            Aucun favori pour le moment. Cliquez sur l'étoile d'un
            <a href="/proforma" class="font-bold underline">produit</a> pour l'ajouter.
          </p>
        {:else}
          <ul class="flex flex-col gap-2.5">
            {#each favoritesState.items as item (item.id)}
              <li class="flex items-center gap-4 p-2.5 rounded-md bg-gray-100">
                <a
                  href={`/proforma/${item.articleKey}`}
                  class="size-16 shrink-0 overflow-hidden rounded-md bg-gray-300"
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
                  class="flex flex-col flex-1 min-w-0"
                >
                  <span class="font-bold">{item.designation}</span>
                  <span class="text-xs uppercase">{item.reference ?? ""}</span>
                </a>
                <button
                  onclick={() => handleRemove(item.id)}
                  class="font-bold underline"
                >
                  Retirer
                </button>
              </li>
            {/each}
          </ul>
        {/if}
      </section>
    </main>
  </div>
</main>
