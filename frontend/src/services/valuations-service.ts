import { Valuation } from "@/stores/valuation/valuation-store";
import httpBackendClient from "../api/http-client";

export async function getValuations(clientId: string): Promise<Valuation[]> {
  const response = await httpBackendClient.get("/valuations", {
    params: { clientId },
  });
  return response.data;
}
