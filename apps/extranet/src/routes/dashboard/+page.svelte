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
  <main class="flex flex-col md:flex-row gap-5 h-full">
    <section class="grid-section-one w-full md:w-[70%] flex-1 md:flex-none"><p>Section 1</p></section>
    <section class="grid-section-two w-full md:w-[30%] flex flex-col gap-5 flex-1 md:flex-none">
      <div class="grid-item-one w-full flex-1"><p>Under one</p></div>
      <div class="grid-item-two w-full flex-1"><p>Under two</p></div>
    </section>
    <!-- <ConnectedArticles {user} /> -->
  </main>
{/if}
