<script lang="ts">
  import { searchCompanies, type CompanySummary } from "$lib/company.svelte";

  // Champ facultatif du formulaire d'inscription : la société choisie est envoyée
  // à Cognito (custom:RequestedCompany), puis transformée en demande d'adhésion
  const MIN_TERM_LENGTH = 2;

  let term = $state("");
  let results = $state<CompanySummary[]>([]);
  let selected = $state<CompanySummary | null>(null);
  let searching = $state(false);
  let error = $state("");
  let debounce: ReturnType<typeof setTimeout>;
  // Ignore les réponses d'une recherche dépassée par une frappe plus récente
  let lastQuery = 0;

  function handleInput() {
    clearTimeout(debounce);
    error = "";
    const query = term.trim();
    if (query.length < MIN_TERM_LENGTH) {
      results = [];
      searching = false;
      return;
    }
    searching = true;
    debounce = setTimeout(async () => {
      const id = ++lastQuery;
      try {
        const found = await searchCompanies(query);
        if (id === lastQuery) results = found;
      } catch (err) {
        console.error("Company search failed", err);
        if (id === lastQuery) error = "La recherche est indisponible";
      } finally {
        if (id === lastQuery) searching = false;
      }
    }, 300);
  }

  function select(company: CompanySummary) {
    selected = company;
    term = "";
    results = [];
  }
</script>

<div class="amplify-flex amplify-field company-picker">
  <label class="amplify-label" for="company-search">
    Votre société (facultatif)
  </label>

  {#if selected}
    <input type="hidden" name="custom:RequestedCompany" value={selected.id} />
    <div class="company-picker-selected flex items-center justify-between gap-2.5">
      <span>{selected.name}</span>
      <button type="button" class="company-picker-change" onclick={() => (selected = null)}>
        Changer
      </button>
    </div>
    <p class="company-picker-hint">
      Une demande sera envoyée au responsable de la société après la
      confirmation de votre compte.
    </p>
  {:else}
    <!-- Sans attribut name : la saisie n'est pas envoyée à Cognito -->
    <input
      id="company-search"
      type="search"
      autocomplete="off"
      class="amplify-input amplify-field-group__control"
      placeholder="Rechercher votre société"
      bind:value={term}
      oninput={handleInput}
      onkeydown={(e) => {
        // Entrée ne doit pas envoyer le formulaire d'inscription
        if (e.key === "Enter") e.preventDefault();
      }}
    />
    {#if error}
      <p class="company-picker-hint text-red-600">{error}</p>
    {:else if searching}
      <p class="company-picker-hint">Recherche…</p>
    {:else if results.length > 0}
      <ul class="company-picker-results flex flex-col">
        {#each results as company (company.id)}
          <li>
            <button
              type="button"
              class="company-picker-result w-full text-left"
              onclick={() => select(company)}
            >
              {company.name}
            </button>
          </li>
        {/each}
      </ul>
    {:else if term.trim().length >= MIN_TERM_LENGTH}
      <p class="company-picker-hint">
        Aucune société trouvée. Laissez ce champ vide : vous pourrez créer votre
        société après l'inscription.
      </p>
    {/if}
  {/if}
</div>

<style lang="scss">
  .company-picker {
    flex-direction: column;
    gap: 0.5rem;
  }

  .company-picker-selected {
    border: 1px solid map.get($grey-scale, "400");
    border-radius: 0.375rem;
    padding: 0.5rem 0.75rem;
    font-weight: 700;
  }

  .company-picker-change {
    font-weight: 400;
    text-decoration: underline;
  }

  .company-picker-results {
    border: 1px solid map.get($grey-scale, "400");
    border-radius: 0.375rem;
    overflow: hidden;
  }

  .company-picker-result {
    padding: 0.5rem 0.75rem;

    &:hover,
    &:focus-visible {
      background-color: map.get($grey-scale, "200");
    }
  }

  .company-picker-hint {
    font-size: 0.875rem;
  }
</style>
