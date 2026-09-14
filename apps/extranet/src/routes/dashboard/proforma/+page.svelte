<script lang="ts">
  import "./proforma.scss";
</script>

<div
  class="proforma-container flex flex-col justify-between items-start gap-2 w-full h-full"
>
  <div
    class="proforma-header flex-1 flex flex-col justify-start items-start w-full"
  ></div>
  <div
    class="proforma-body flex-6 gap-1.5 flex flex-col justify-start items-start w-full"
  >
    <div
      class="proforma-body-count flex flex-row justify-between items-start w-full"
    >
      <p>Résultats</p>
      <div class="proforma-order">
        <p>Ordre</p>
      </div>
    </div>
    <div
      class="proforma-body-table flex-1 flex flex-col justify-start items-start w-full"
    ></div>
  </div>
</div>
