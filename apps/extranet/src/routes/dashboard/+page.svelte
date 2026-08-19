<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { getCurrentUser } from "aws-amplify/auth";
  import type { AuthUser } from "@aws-amplify/auth";
  import ConnectedArticles from "$lib/components/ConnectedArticles.svelte";

  let user = $state<AuthUser | undefined>(undefined);
  let checkingAuth = $state(true);

  onMount(async () => {
    try {
      user = await getCurrentUser();
    } catch {
      goto("/");
      return;
    }
    checkingAuth = false;
  });

 
</script>

{#if !checkingAuth}
  <main>
    <p class="wrap-break-word">Welcome, Welcome {user?.signInDetails?.loginId}</p>
    <ConnectedArticles {user} />
  </main>
{/if}
