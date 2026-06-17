<script lang="ts">
  import { Authenticator } from "@aws-amplify/ui-svelte";
  import type { AuthUser } from "@aws-amplify/auth";
  import type { AuthMachineState } from "@aws-amplify/ui";
</script>

<div id="home-container" class="grid grid-cols-2">
  <div id="home-col-left" class="grid py-5 pl-5 pr-2.5 min-w-0">
    <p>Bonjour</p>
  </div>
  <div id="home-col-right" class="grid py-5 pl-2.5 pr-5 min-w-0">
    <div id="other">
      <Authenticator>
        {#snippet children({
          signOut,
          user,
        }: {
          signOut: () => void;
          user: AuthUser;
          state: AuthMachineState;
          send: unknown;
        })}
          <main>
            <p>Welcome, Welcome {user?.signInDetails?.loginId}</p>
            <button onclick={signOut}>Sign out</button>
          </main>
        {/snippet}
      </Authenticator>
    </div>
  </div>
</div>
