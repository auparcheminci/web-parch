<script lang="ts">
  import NotificationBar from "$lib/components/NotificationBar.svelte";
  import SearchHeader from "$lib/components/SearchHeader.svelte";
  import Sidebar from "$lib/components/Sidebar.svelte";

  // À brancher sur le filtrage des catalogues quand ils seront disponibles
  let searchTerm = $state("");
</script>

<NotificationBar />
<main
  class="main-content-space flex flex-col md:flex-row flex-1 min-h-0 gap-5 p-10 overflow-y-auto"
>
  <Sidebar />
  <div class="page-content flex-none md:flex-1 w-full min-w-0">
    <div
      class="flex flex-col justify-between items-start gap-2 w-full h-full"
    >
      <SearchHeader
        bind:value={searchTerm}
        placeholder="Rechercher un catalogue"
      />
      <div class="flex-6 min-h-0 overflow-y-auto flex flex-col w-full">
        <h1>Catalogue</h1>
        <p>Contenu à venir.</p>
      </div>
    </div>
  </div>
</main>
