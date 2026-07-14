<script lang="ts">
	let { children } = $props();
</script>

<div class="flex h-full w-full">
	<nav class="dashboard-menu">
		<ul>
			<li><a href="/dashboard">Accueil</a></li>
			<li><a href="/dashboard/profil">Profil</a></li>
		</ul>
	</nav>
	<main class="flex-1">
		{@render children()}
	</main>
</div>
