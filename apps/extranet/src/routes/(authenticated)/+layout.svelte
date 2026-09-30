<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { getCurrentUser } from "aws-amplify/auth";
  import { loadCompany } from "$lib/company.svelte";
  import { loadCart } from "$lib/cart.svelte";

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
    // Le panier dépend de la société de l'utilisateur
    loadCompany().then(loadCart);
  });
</script>

{#if !checkingAuth}
  {@render children()}
{/if}
