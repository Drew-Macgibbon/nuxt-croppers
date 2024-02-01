<template>
  <div>
    <p>Hello from cropper</p>
    <p>config: {{ cropperConfig }}</p>
    <p>file: {{ file }}</p>
  </div>
</template>

<script setup lang="ts">
const { cropperConfig } = useConfig();

defineProps({
  file: {
    type: String,
    required: true,
  },
});

// if the logic gets large consider extracting to a composable

// different croppers to consider:

// https://cropper.chengpeiquan.com/quick-start.html
// https://fengyuanchen.github.io/cropperjs/



</script>

<style scoped></style>
