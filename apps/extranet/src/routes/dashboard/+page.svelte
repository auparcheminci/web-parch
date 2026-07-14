<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { getCurrentUser, signOut } from "aws-amplify/auth";
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

  async function handleSignOut() {
    await signOut();
    goto("/");
  }
</script>

{#if !checkingAuth}
  <main>
    <p>Welcome, Welcome {user?.signInDetails?.loginId}</p>
    <ConnectedArticles {user} />
    <button onclick={handleSignOut}>Sign out</button>
  </main>
{/if}
