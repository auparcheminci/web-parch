<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { getCurrentUser } from "aws-amplify/auth";

  let { children } = $props();
  let checkingAuth = $state(true);

  onMount(async () => {
    try {
      await getCurrentUser();
    } catch {
      goto("/");
      return;
    }
    checkingAuth = false;
  });
</script>

{#if !checkingAuth}
  {@render children()}
{/if}
