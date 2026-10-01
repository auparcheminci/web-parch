<script lang="ts">
  import {
    addSalesPoint,
    companyState,
    removeSalesPoint,
    salesPoints,
    updateSalesPoint,
    type SalesPoint,
  } from "$lib/company.svelte";

  // Points de vente de la société : visibles par tous les membres,
  // modifiables par l'administrateur seulement
  let points = $derived(salesPoints(companyState.company));

  // null : pas de formulaire ; "new" : ajout ; sinon id du point modifié
  let editingId = $state<string | null>(null);
  let name = $state("");
  let address = $state("");
  let manager = $state("");
  let busy = $state(false);
  let error = $state("");

  function startEditing(point?: SalesPoint) {
    editingId = point?.id ?? "new";
    name = point?.name ?? "";
    address = point?.address ?? "";
    manager = point?.manager ?? "";
    error = "";
  }

  async function run(action: () => Promise<void>) {
    busy = true;
    error = "";
    try {
      await action();
    } catch (err) {
      error = err instanceof Error ? err.message : "Une erreur est survenue";
    }
    busy = false;
  }

  function handleSave(event: SubmitEvent) {
    event.preventDefault();
    const fields = {
      name: name.trim(),
      address: address.trim(),
      manager: manager.trim(),
    };
    const id = editingId;
    run(async () => {
      await (id === "new" ? addSalesPoint(fields) : updateSalesPoint(id!, fields));
      editingId = null;
    });
  }

  function handleRemove(point: SalesPoint) {
    if (!confirm(`Supprimer le point de vente « ${point.name} » ?`)) return;
    run(() => removeSalesPoint(point.id));
  }
</script>

<section class="flex flex-col gap-2.5">
  <h2>Points de vente ({points.length})</h2>

  {#if points.length === 0}
    <p>Aucun point de vente pour le moment.</p>
  {:else}
    <ul class="flex flex-col gap-2.5">
      {#each points as point (point.id)}
        <li class="flex flex-wrap items-start gap-2.5 rounded-md bg-gray-100 p-2.5">
          <div class="flex flex-col flex-1 min-w-0">
            <strong>{point.name}</strong>
            <span class="whitespace-pre-line">{point.address}</span>
            <span>Responsable : {point.manager}</span>
          </div>
          {#if companyState.isOwner}
            <button
              class="rounded-md border px-3 py-1"
              disabled={busy}
              onclick={() => startEditing(point)}
            >
              Modifier
            </button>
            <button
              class="rounded-md border px-3 py-1"
              disabled={busy}
              onclick={() => handleRemove(point)}
            >
              Supprimer
            </button>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}

  {#if companyState.isOwner}
    {#if editingId}
      <form class="flex flex-col gap-2.5 max-w-md" onsubmit={handleSave}>
        <label for="sales-point-name">Nom</label>
        <input
          id="sales-point-name"
          class="rounded-md border px-3 py-2"
          bind:value={name}
          required
        />

        <label for="sales-point-address">Adresse</label>
        <textarea
          id="sales-point-address"
          class="rounded-md border px-3 py-2"
          rows="3"
          bind:value={address}
          required
        ></textarea>

        <label for="sales-point-manager">Responsable</label>
        <input
          id="sales-point-manager"
          class="rounded-md border px-3 py-2"
          bind:value={manager}
          required
        />

        <div class="flex gap-2.5">
          <button class="rounded-md border px-3 py-2" disabled={busy}>
            {editingId === "new" ? "Ajouter" : "Enregistrer"}
          </button>
          <button
            type="button"
            class="rounded-md border px-3 py-2"
            onclick={() => (editingId = null)}
          >
            Annuler
          </button>
        </div>
      </form>
    {:else}
      <button
        class="rounded-md border px-3 py-2 self-start"
        onclick={() => startEditing()}
      >
        Ajouter un point de vente
      </button>
    {/if}
  {/if}

  {#if error}
    <p class="text-red-600">{error}</p>
  {/if}
</section>
