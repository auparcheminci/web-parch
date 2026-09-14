<script lang="ts">
  import { onMount } from "svelte";
  import { fetchUserAttributes } from "aws-amplify/auth";
  import NotificationBar from "$lib/components/NotificationBar.svelte";
  import Sidebar from "$lib/components/Sidebar.svelte";

  let attributes = $state<Partial<Record<string, string>>>({});

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
        <li>Société : {attributes["custom:Société"]}</li>
        <li>Poste : {attributes["custom:Poste"]}</li>
      </ul>
    </main>
  </div>
</main>
