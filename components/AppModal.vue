<template>
  <div>
    <UButton @click="isOpen = true"> {{ title }}</UButton>
    <UModal v-model="isOpen">
      <slot />
    </UModal>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false);

defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>

<style scoped></style>
