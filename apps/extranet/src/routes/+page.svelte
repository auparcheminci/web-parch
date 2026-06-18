<script lang="ts">
  import { Authenticator } from "@aws-amplify/ui-svelte";
  import type { AuthUser } from "@aws-amplify/auth";
  import type { AuthMachineState } from "@aws-amplify/ui";
  import "./auth.scss";
</script>

<div id="home-container" class="flex flex-1 overflow-hidden">
  <div id="home-col-left" class="flex-1 py-5 pl-5 pr-2.5 overflow-hidden">
    <img
      src="https://strapi-z4iu.onrender.com/uploads/1000x1000_100_5cbae1b054.jpg"
      alt="placeholder"
      class="object-cover w-full h-full rounded-2xl"
    />
  </div>
  <div id="home-col-right" class="flex-1 py-5 pl-2.5 pr-5 overflow-hidden">
    <div
      id="auth-container"
      class="w-full h-full flex items-center justify-center"
    >
      <div id="auth-form-wrapper" class="flex flex-col w-full max-w-md">
        <div id="auth-header" class="flex flex-col items-center">
          <img src="" alt="logo" />
          <h2>Connexion</h2>
          <p class="text-sm text-center  text-gray-500">
            Pour accéder à la plateforme, saisissez votre identifiant et votre
            mot de passe dans les champs ci-dessous. Si vous ne possédez pas
            encore de compte, vous pouvez en créer un en cliquant sur “Créer mon
            compte”.
          </p>
        </div>
        <Authenticator formFields={{
          signIn: {
            username: {
              label: '',
              placeholder: 'Email',
            },
            password: {
              label: '',
              placeholder: 'Mot de passe',
            },
          },
        }}>
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
</div>
