<template>
  <div class="p-8 mx-auto">
    <div class="relative bg-primary-50 w-full max-w-[1200px] h-64">
      <AppCropper cropper-type="cover" class="absolute bottom-0 right-0" />

      <div class="w-32 h-32 absolute -bottom-16 left-16 bg-red-50 rounded-full">
        <AppCropper cropper-type="avatar" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// upload button should be seperate from component, that way the cropper component is more dynamic.
</script>

<style scoped></style>
