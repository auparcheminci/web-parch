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
    <main class="flex flex-col md:flex-row gap-5 md:h-full min-w-0">
      <section class="grid-section-one md:flex-6 flex flex-col gap-2.5 min-w-0">
        <h2>Nouveautés :</h2>
        <div class="media-container w-full min-h-48 md:flex-1 rounded-md bg-gray-200"></div>
      </section>
      <section class="grid-section-two flex flex-col gap-5 md:flex-4 min-w-0">
        <div class="grid-item-one w-full md:flex-7 flex flex-col gap-2.5">
          <h3>Retour en Stock :</h3>
          <div class="media-container w-full min-h-32 md:flex-1 rounded-md bg-gray-200"></div>
        </div>
        <div class="grid-item-two w-full md:flex-3 flex flex-col gap-2.5">
          <h3>Formation du jour :</h3>
          <div class="media-container w-full min-h-32 md:flex-1 rounded-md bg-gray-200"></div>
        </div>
      </section>
    </main>
  </div>
</main>
