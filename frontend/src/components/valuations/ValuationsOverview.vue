<template>
  <div>
    <h1
      class="mb-3 text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-600"
    >
      Valuations for {{ client?.name || "..." }}
    </h1>
    <table
      class="text-lg rounded shadow bg-gradient-to-r from-blue-50 to-white dark:from-black dark:to-gray-800"
    >
      <thead class="">
        <tr>
          <th>Client</th>
          <th>Period</th>
          <th>Version</th>
          <th>Valuator</th>
        </tr>
      </thead>
      <tbody v-if="valuations">
        <ValuationsTableRow
          @download-report="downloadValuationReport"
          v-for="valuation in valuations"
          :key="valuation.id"
          :valuation="valuation"
        />
      </tbody>
      <tbody v-else>
        <tr>
          <td class="py-2 px-5 whitespace-nowrap" colspan="5">
            No valuations found
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";

import { useClientStore } from "@/stores/client/client-store";
import { useValuationStore } from "@/stores/valuation/valuation-store";

import ValuationsTableRow from "@/components/valuations/ValuationsTableRow.vue";

const clientStore = useClientStore();
const { client } = storeToRefs(clientStore);

const valuationStore = useValuationStore();
const { valuations } = storeToRefs(valuationStore);

onMounted(async () => {
  try {
    await valuationStore.initialize();
  } catch (error) {
    console.error(error);
  }
});

async function downloadValuationReport(valuationId: number) {
  try {
    console.log("TODO: Download valuation report for valuationId", valuationId);
  } catch (error) {
    console.error(error);

    // Show browser alert
    alert("Failed to download valuation report");
  }
}
</script>
