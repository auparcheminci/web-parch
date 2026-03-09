<script lang="ts">
  
  import { Authenticator } from "@aws-amplify/ui-svelte";
  import "@aws-amplify/ui-svelte/styles.css";

</script>

<main class="login">
  <h1>Sign in</h1>

  <Authenticator initialState="signIn" loginMechanisms={['email']}>
  {#snippet children({ user, signOut })}
    <h1>Hello {user?.username}</h1>
    <button onclick={signOut}>Sign out</button>
  {/snippet}
</Authenticator>
</main>