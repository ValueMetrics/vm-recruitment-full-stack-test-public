<template>
  <button
    class="rounded bg-green-500 py-1 px-3 text-white font-semibold hover:bg-green-600 flex items-center justify-center text-base dark:bg-green-900 dark:text-inherit"
  >
    <slot />
    <DownloadSolid class="h-4 fill-white ml-2 icon" />
  </button>
</template>

<script lang="ts" setup>
import DownloadSolid from "@/assets/icons/DownloadSolid.vue";
</script>

<style lang="postcss" scoped>
.icon {
  /* If dark mode set to text color */
  @media (prefers-color-scheme: dark) {
    fill: var(--color-text);
  }
}
</style>
