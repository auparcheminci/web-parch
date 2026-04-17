<script lang="ts">
	import { Authenticator } from '@aws-amplify/ui-svelte';
	import type { AuthUser } from '@aws-amplify/auth';
	import type { AuthMachineState } from '@aws-amplify/ui';
</script>

<Authenticator>
	{#snippet children({ signOut, user }: { signOut: () => void; user: AuthUser; state: AuthMachineState; send: unknown })}
		<main>
			<p>Welcome, {user?.signInDetails?.loginId}</p>
			<button onclick={signOut}>Sign out</button>
		</main>
	{/snippet}
</Authenticator>
