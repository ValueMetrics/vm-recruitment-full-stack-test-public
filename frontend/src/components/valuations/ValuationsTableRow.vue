<template>
  <tr
    class="border-t border-blue-100 bg-white dark:bg-transparent dark:border-blue-900"
  >
    <td>
      {{ valuation.clientId }}
    </td>
    <td>
      {{ valuation.quarter }}
    </td>
    <td>
      {{ valuation.versionId }}
    </td>
    <td>
      {{ formattedValuator }}
    </td>
  </tr>
</template>

<script lang="ts" setup>
import { PropType, computed } from "vue";
import { Valuation } from "@/stores/valuation/valuation-store";

const props = defineProps({
  valuation: {
    type: Object as PropType<Valuation>,
    required: true,
  },
});

const formattedValuator = computed(() => {
  if (props.valuation.isValuator) {
    return props.valuation.valuatorId;
  }
  return "No valuator assigned";
});

const emit = defineEmits(["download-report"]);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emitDownloadReport = () => {
  emit("download-report", props.valuation.id);
};
</script>
