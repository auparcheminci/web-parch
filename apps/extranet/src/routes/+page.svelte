<script lang="ts">
  import { Authenticator } from "@aws-amplify/ui-svelte";
  import type { AuthUser } from "@aws-amplify/auth";
  import type { AuthMachineState } from "@aws-amplify/ui";
</script>

<div id="home-container" class="flex flex-1 overflow-hidden">
  <div id="home-col-left" class="flex-1 py-5 pl-5 pr-2.5 overflow-hidden">
    <img src="https://strapi-z4iu.onrender.com/uploads/1000x1000_100_5cbae1b054.jpg" alt="placeholder" class="object-cover w-full h-full rounded-2xl" />
  </div>
  <div id="home-col-right" class="flex-1 py-5 pl-2.5 pr-5 overflow-hidden">
    <div id="auth-container" class="w-full h-full">
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

