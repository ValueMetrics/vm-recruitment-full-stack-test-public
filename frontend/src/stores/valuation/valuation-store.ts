import { ref } from "vue";
import { defineStore, storeToRefs } from "pinia";

import { getValuations } from "@/services/valuations-service";
import { useClientStore } from "../client/client-store";
import {
  DataReportParams,
  downloadValuationReport,
} from "@/services/data-report-service";

export type Valuation = {
  id: number;
  clientId: string;
  quarter: string;
  snapshotId: number;
  versionId: number;
  isValuator: boolean;
  valuatorId: string | null;
};

export const useValuationStore = defineStore("valuation", () => {
  const valuations = ref<Valuation[]>();

  const clientStore = useClientStore();
  const { client } = storeToRefs(clientStore);

  async function initialize() {
    if (!client.value) {
      throw new Error("Client not initialized");
    }
    valuations.value = await getValuations(client.value.id);
  }

  function findValuation(valuationId: number) {
    const valuation = valuations.value?.find((v) => v.id === valuationId);
    if (!valuation) {
      throw new Error("Valuation not found");
    }

    return valuation;
  }

  async function getValuationReport(valuationId: number): Promise<{
    filename: string;
    blob: Blob;
  }> {
    const valuation = findValuation(valuationId);
    if (!valuation) {
      throw new Error("Valuation not found");
    }

    const dataReportParams: DataReportParams = {
      ...valuation,
      userId: "TestUser",
      reportId: "Waarderingsrapportage",
      columnDefinitionsId: "Valuation",
    };

    return downloadValuationReport(dataReportParams);
  }

  return { valuations, initialize, getValuationReport };
});
