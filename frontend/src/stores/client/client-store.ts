import { ref } from "vue";
import { defineStore } from "pinia";

import { getClient } from "@/services/client-service";

export interface Client {
  id: string;
  name: string;
}

export const useClientStore = defineStore("client", () => {
  const client = ref<Client>();

  async function initialize() {
    client.value = await getClient();
  }

  return { client, initialize };
});
