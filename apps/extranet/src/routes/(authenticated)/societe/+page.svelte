<script lang="ts">
  import { onMount } from "svelte";
  import { fetchUserAttributes } from "aws-amplify/auth";
  import NotificationBar from "$lib/components/NotificationBar.svelte";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import SalesPointsSection from "$lib/components/SalesPointsSection.svelte";
  import {
    addMember,
    answerJoinRequest,
    cancelJoinRequest,
    companyState,
    createCompany,
    listJoinRequests,
    updateCompany,
    type CompanyJoinRequest,
    type SalesPointFields,
  } from "$lib/company.svelte";
  import {
    getCartRequestUrl,
    listCartRequests,
    type CartRequest,
  } from "$lib/cartRequests";

  let requests = $state<CartRequest[]>([]);
  let requestsError = $state("");

  // Proformas de la société (visibles par tous ses membres), rechargées quand la
  // société est chargée ou change
  $effect(() => {
    if (!companyState.company?.id) return;
    requestsError = "";
    listCartRequests()
      .then((list) => (requests = list))
      .catch((err) => {
        console.error("Proformas load failed", err);
        requestsError = "Impossible de charger les proformas";
      });
  });

  // Demandes d'adhésion reçues par la société : réservées à l'administrateur
  let joinRequests = $state<CompanyJoinRequest[]>([]);
  let joinRequestsError = $state("");
  let incomingRequests = $derived(
    joinRequests.filter((r) => r.companyId === companyState.company?.id),
  );

  async function refreshJoinRequests() {
    joinRequestsError = "";
    try {
      joinRequests = await listJoinRequests();
    } catch (err) {
      console.error("Join requests load failed", err);
      joinRequestsError = `Impossible de charger les demandes d'adhésion : ${
        err instanceof Error ? err.message : String(err)
      }`;
    }
  }

  // Recharge quand la société est chargée ou change ; rien n'est chargé pour un membre
  $effect(() => {
    if (companyState.isOwner && companyState.company?.id) refreshJoinRequests();
  });

  function handleAnswer(request: CompanyJoinRequest, accept: boolean) {
    run(async () => {
      await answerJoinRequest(request.id, accept);
      await refreshJoinRequests();
    }, accept ? `${request.email} a rejoint la société` : "Demande refusée");
  }

  function handleCancelRequest(request: CompanyJoinRequest) {
    run(() => cancelJoinRequest(request.id), "Demande annulée");
  }

  async function downloadRequest(request: CartRequest) {
    try {
      window.location.href = await getCartRequestUrl(request);
    } catch (err) {
      console.error("Request download failed", err);
      requestsError = "Impossible de télécharger la proforma";
    }
  }

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

  // Points de vente saisis à la création de la société ; ensuite, ils se gèrent
  // dans la section « Points de vente »
  let newSalesPoints = $state<SalesPointFields[]>([
    { name: "", address: "", manager: "" },
  ]);

  function handleSave(event: SubmitEvent) {
    event.preventDefault();
    const fields = {
      name: name.trim(),
      activity: activity.trim(),
      ownerName: ownerName.trim(),
      logoFile,
    };
    const isNew = !companyState.company;
    const points = newSalesPoints.map((point) => ({
      name: point.name.trim(),
      address: point.address.trim(),
      manager: point.manager.trim(),
    }));
    run(async () => {
      await (isNew ? createCompany(fields, points) : updateCompany(fields));
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
      {:else if !companyState.company && companyState.pendingRequest}
        {@const pendingRequest = companyState.pendingRequest}
        <h1>Votre demande est en cours</h1>
        <div class="flex flex-col gap-2.5 rounded-md bg-gray-100 p-4 max-w-md">
          <p>
            Votre demande pour rejoindre
            <strong>{pendingRequest.companyName}</strong> est en attente de
            validation par son responsable. Vous aurez accès à la société dès
            qu'elle sera acceptée.
          </p>
          <button
            class="rounded-md border px-3 py-2 self-start"
            disabled={busy}
            onclick={() => handleCancelRequest(pendingRequest)}
          >
            Annuler la demande
          </button>
        </div>
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

          {#if !companyState.company}
            <fieldset class="flex flex-col gap-2.5 mt-2.5">
              <legend class="font-bold">Points de vente</legend>
              {#each newSalesPoints as point, index}
                <div class="flex flex-col gap-1.5 rounded-md border p-2.5">
                  <label for="new-point-name-{index}">Nom</label>
                  <input
                    id="new-point-name-{index}"
                    class="rounded-md border px-3 py-2"
                    bind:value={point.name}
                    required
                  />
                  <label for="new-point-address-{index}">Adresse</label>
                  <textarea
                    id="new-point-address-{index}"
                    class="rounded-md border px-3 py-2"
                    rows="2"
                    bind:value={point.address}
                    required
                  ></textarea>
                  <label for="new-point-manager-{index}">Responsable</label>
                  <input
                    id="new-point-manager-{index}"
                    class="rounded-md border px-3 py-2"
                    bind:value={point.manager}
                    required
                  />
                  <button
                    type="button"
                    class="self-start underline"
                    onclick={() => newSalesPoints.splice(index, 1)}
                  >
                    Retirer ce point de vente
                  </button>
                </div>
              {/each}
              <button
                type="button"
                class="rounded-md border px-3 py-2 self-start"
                onclick={() =>
                  newSalesPoints.push({ name: "", address: "", manager: "" })}
              >
                Ajouter un point de vente
              </button>
            </fieldset>
          {/if}

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
        {:else}
          <p class="text-sm">
            Seul l'administrateur de la société peut la modifier et gérer ses
            membres.
          </p>
        {/if}

        <SalesPointsSection />

        <!-- Demandes d'adhésion : section réservée à l'administrateur, invisible pour les membres -->
        {#if companyState.isOwner}
          <section class="flex flex-col gap-2.5">
            <h2>Demandes d'adhésion ({incomingRequests.length})</h2>
            {#if joinRequestsError}
              <p class="text-red-600">{joinRequestsError}</p>
            {:else if incomingRequests.length === 0}
              <p>Aucune demande d'adhésion pour le moment.</p>
            {/if}
            <ul class="flex flex-col gap-1.5">
              {#each incomingRequests as request (request.id)}
                <li class="flex flex-wrap items-center gap-2.5">
                  <span>
                    {request.name ? `${request.name} — ` : ""}{request.email}
                  </span>
                  <button
                    class="rounded-md border px-3 py-1"
                    disabled={busy}
                    onclick={() => handleAnswer(request, true)}
                  >
                    Accepter
                  </button>
                  <button
                    class="rounded-md border px-3 py-1"
                    disabled={busy}
                    onclick={() => handleAnswer(request, false)}
                  >
                    Refuser
                  </button>
                </li>
              {/each}
            </ul>
          </section>
        {/if}

        <section class="flex flex-col gap-2.5">
          <h2>Membres</h2>
          <ul>
            <!-- Le premier email est celui du créateur, ajouté à la création -->
            {#each companyState.company.memberEmails ?? [] as email, index}
              <li>
                {email}{#if index === 0}
                  <strong> (administrateur)</strong>{/if}
              </li>
            {/each}
          </ul>
        </section>

        <!-- Proformas : visibles et téléchargeables par tous les membres -->
        <section class="flex flex-col gap-2.5">
          <h2>Proformas</h2>
          {#if requestsError}
            <p class="text-red-600">{requestsError}</p>
          {:else if requests.length === 0}
            <p>Aucune proforma pour le moment.</p>
          {:else}
            <ul class="flex flex-col gap-1.5">
              {#each requests as request (request.id)}
                <li class="flex items-center gap-2.5">
                  <span>
                    {new Date(request.createdAt).toLocaleString("fr-FR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })} — {request.itemCount} article{request.itemCount > 1
                      ? "s"
                      : ""}{request.salesPoint
                      ? ` — ${request.salesPoint.name}`
                      : ""}
                  </span>
                  <button
                    class="rounded-md border px-3 py-1"
                    onclick={() => downloadRequest(request)}
                  >
                    Télécharger le PDF
                  </button>
                </li>
              {/each}
            </ul>
          {/if}
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
