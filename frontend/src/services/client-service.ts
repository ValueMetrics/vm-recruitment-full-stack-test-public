import { Client } from "@/stores/client/client-store";
import { clientMock } from "@/stores/client/client.mock";

export async function getClient(): Promise<Client> {
  return Promise.resolve(clientMock);
}
