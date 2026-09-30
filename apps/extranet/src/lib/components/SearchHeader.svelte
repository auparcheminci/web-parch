<script lang="ts">
  // En-tête de recherche partagé entre les pages produits et catalogues
  let {
    value = $bindable(""),
    placeholder = "Rechercher",
  }: { value?: string; placeholder?: string } = $props();
</script>

<div
  class="search-header flex-1 shrink-0 min-h-16 flex flex-col justify-center items-start w-full px-4"
>
  <input
    type="search"
    bind:value
    {placeholder}
    class="search-header-input w-full max-w-md"
  />
</div>

<style lang="scss">
  .search-header {
    background-color: map.get($grey-scale, "300");
  }

  .search-header-input {
    background-color: map.get($grey-scale, "200");
    border: none;
    border-radius: 0.375rem;
    padding: 0.5rem 0.75rem;
    font-family: $font-primary;

    &::placeholder {
      color: map.get($grey-scale, "800");
    }

    &:focus {
      outline: 2px solid map.get($blue-vivid-scale, "1500");
      outline-offset: -2px;
    }
  }
</style>
