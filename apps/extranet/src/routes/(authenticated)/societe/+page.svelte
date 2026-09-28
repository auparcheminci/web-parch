<script lang="ts">
  import { onMount } from "svelte";
  import { fetchUserAttributes } from "aws-amplify/auth";
  import NotificationBar from "$lib/components/NotificationBar.svelte";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import {
    addMember,
    companyState,
    createCompany,
    updateCompany,
  } from "$lib/company.svelte";

  let editing = $state(false);
  let name = $state("");
  let activity = $state("");
  let ownerName = $state("");
  let logoFile = $state<File | null>(null);
  let logoPreview = $state<string | null>(null);

  let memberEmail = $state("");
  let error = $state("");
  let message = $state("");
  let busy = $state(false);

  // Nom du propriétaire pré-rempli avec le profil de l'utilisateur
  let profileName = "";
  onMount(async () => {
    const attributes = await fetchUserAttributes();
    profileName = [attributes["custom:Prénom"], attributes["custom:Nom"]]
      .filter(Boolean)
      .join(" ");
    if (!ownerName) ownerName = profileName;
  });

  function startEditing() {
    const company = companyState.company;
    name = company?.name ?? "";
    activity = company?.activity ?? "";
    ownerName = company?.ownerName ?? profileName;
    logoFile = null;
    logoPreview = companyState.logoUrl;
    editing = true;
  }

  function handleLogoChange(event: Event) {
    const file = (event.currentTarget as HTMLInputElement).files?.[0] ?? null;
    if (logoPreview?.startsWith("blob:")) URL.revokeObjectURL(logoPreview);
    logoFile = file;
    logoPreview = file ? URL.createObjectURL(file) : companyState.logoUrl;
  }

  async function run(action: () => Promise<void>, success: string) {
    busy = true;
    error = "";
    message = "";
    try {
      await action();
      message = success;
    } catch (err) {
      error = err instanceof Error ? err.message : "Une erreur est survenue";
    }
    busy = false;
  }

  function handleSave(event: SubmitEvent) {
    event.preventDefault();
    const fields = {
      name: name.trim(),
      activity: activity.trim(),
      ownerName: ownerName.trim(),
      logoFile,
    };
    const isNew = !companyState.company;
    run(async () => {
      await (isNew ? createCompany(fields) : updateCompany(fields));
      editing = false;
    }, isNew ? "Société créée" : "Société mise à jour");
  }

  function handleAddMember(event: SubmitEvent) {
    event.preventDefault();
    run(async () => {
      await addMember(memberEmail.trim());
      memberEmail = "";
    }, "Membre ajouté");
  }
</script>

<NotificationBar />
<main
  class="main-content-space flex flex-col md:flex-row flex-1 min-h-0 gap-5 p-10 overflow-y-auto"
>
  <Sidebar />
  <div class="page-content flex-none md:flex-1 w-full min-w-0">
    <main class="flex flex-col gap-5">
      {#if !companyState.loaded}
        <p>Chargement…</p>
      {:else if companyState.loadError}
        <p class="text-red-600">{companyState.loadError}</p>
      {:else if !companyState.company || editing}
        <h1>{companyState.company ? "Modifier ma société" : "Créer ma société"}</h1>
        <form class="flex flex-col gap-2.5 max-w-md" onsubmit={handleSave}>
          <label for="company-name">Nom</label>
          <input
            id="company-name"
            class="rounded-md border px-3 py-2"
            bind:value={name}
            required
          />

          <label for="company-activity">Activité</label>
          <input
            id="company-activity"
            class="rounded-md border px-3 py-2"
            bind:value={activity}
            required
          />

          <label for="company-owner">Propriétaire</label>
          <input
            id="company-owner"
            class="rounded-md border px-3 py-2"
            bind:value={ownerName}
            required
          />

          <label for="company-logo">Logo</label>
          {#if logoPreview}
            <img
              src={logoPreview}
              alt="Aperçu du logo"
              class="size-20 rounded-full object-cover bg-gray-300"
            />
          {/if}
          <input
            id="company-logo"
            type="file"
            accept="image/*"
            onchange={handleLogoChange}
          />

          <div class="flex gap-2.5">
            <button class="rounded-md border px-3 py-2" disabled={busy}>
              {companyState.company ? "Enregistrer" : "Créer"}
            </button>
            {#if editing}
              <button
                type="button"
                class="rounded-md border px-3 py-2"
                onclick={() => (editing = false)}
              >
                Annuler
              </button>
            {/if}
          </div>
        </form>
      {:else}
        <div class="flex items-center gap-5">
          {#if companyState.logoUrl}
            <img
              src={companyState.logoUrl}
              alt="Logo de {companyState.company.name}"
              class="size-20 rounded-full object-cover bg-gray-300"
            />
          {/if}
          <h1>{companyState.company.name}</h1>
        </div>

        <ul>
          <li>Activité : {companyState.company.activity}</li>
          <li>Propriétaire : {companyState.company.ownerName}</li>
        </ul>

        {#if companyState.isOwner}
          <button class="rounded-md border px-3 py-2 self-start" onclick={startEditing}>
            Modifier
          </button>
        {/if}

        <section class="flex flex-col gap-2.5">
          <h2>Membres</h2>
          <ul>
            {#each companyState.company.memberEmails ?? [] as email}
              <li>{email}</li>
            {/each}
          </ul>
        </section>

        {#if companyState.isOwner}
          <form class="flex flex-col gap-2.5 max-w-md" onsubmit={handleAddMember}>
            <label for="member-email">Ajouter un membre (email)</label>
            <input
              id="member-email"
              type="email"
              class="rounded-md border px-3 py-2"
              bind:value={memberEmail}
              required
            />
            <p class="text-sm">
              Si cette personne n'a pas encore de compte, elle recevra un email
              d'invitation avec un mot de passe temporaire.
            </p>
            <button class="rounded-md border px-3 py-2" disabled={busy}>
              Ajouter
            </button>
          </form>
        {/if}
      {/if}

      {#if message}<p>{message}</p>{/if}
      {#if error}<p class="text-red-600">{error}</p>{/if}
    </main>
  </div>
</main>
