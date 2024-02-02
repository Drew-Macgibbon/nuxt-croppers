<template>
  <div>
    <slot name="button" v-bind="options" />
    <UModal v-model="isOpen">
      <slot name="modal" />
    </UModal>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false);

const toggleModalOpen = () => {
  isOpen.value = !isOpen.value;
};

const options = ref({
  isOpen,
  toggleModalOpen,
});
</script>

<style scoped></style>
