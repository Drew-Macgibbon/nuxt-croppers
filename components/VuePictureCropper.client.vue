<template>
  <div class="p-4 bg-white rounded-md flex flex-col gap-4">
    <div class="flex gap-2">
      <UButton @click="cropImage">Crop</UButton>
      <UButton @click="sendImage">Send To Server</UButton>
    </div>
    <VuePictureCropper
      :boxStyle="{
        width: '100%',
        height: '100%',
        backgroundColor: '#f8f8f8',
        margin: 'auto',
      }"
      :img="file"
      :options="{
        viewMode: 1,
        dragMode: 'move',
        aspectRatio: 1,
        cropBoxResizable: true,
        minContainerWidth: 160,
        maxContainerWidth: 640,
      }"
      :presetMode="presets"
      @ready="onCropperReady"
    />

    <div>
      show output
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CropperInstance, PresetModeOptions } from "vue-picture-cropper";
import VuePictureCropper from "vue-picture-cropper";
import file from "~/public/files/avatar/avatar-jpg.jpg";

console.log("testFile", file);

defineProps({
  file: {
    type: String,
    required: true,
  },
});

// Box style for the cropper
const boxStyle = ref({
  width: "100%",
  height: "100%",
  backgroundColor: "#f8f8f8",
  margin: "auto",
});

const presets = {
  mode: "fixedSize",
  width: 320,
  height: 320,
} as PresetModeOptions;

// Cropper options including aspect ratio, minWidth, and maxSize
const cropperOptions = ref({
  aspectRatio: 1 / 1,
  viewMode: 1,
  dragMode: "crop",
});

// Event handler when cropper is ready
const onCropperReady = (cropper: CropperInstance) => {
  console.log("Cropper is ready", cropper);
};
</script>

<style scoped></style>
