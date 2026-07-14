<script lang="ts">
  import { goto } from "$app/navigation";

  let { to }: { to: string } = $props();

  $effect(() => {
    goto(to);
  });
</script>
