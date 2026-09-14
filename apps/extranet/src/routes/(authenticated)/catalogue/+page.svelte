<script lang="ts">
  import NotificationBar from "$lib/components/NotificationBar.svelte";
  import Sidebar from "$lib/components/Sidebar.svelte";
</script>

<NotificationBar />
<main
  class="main-content-space flex flex-col md:flex-row flex-1 min-h-0 gap-5 p-10 overflow-y-auto"
>
  <Sidebar />
  <div class="page-content flex-none md:flex-1 w-full min-w-0">
    <main>
      <h1>Catalogue</h1>
      <p>Contenu à venir.</p>
    </main>
  </div>
</main>
