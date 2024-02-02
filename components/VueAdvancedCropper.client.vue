<template>
  <div class="w-full h-full space-y-4 p-4">
    <div class="relative w-full h-full space-y-4">
      <Cropper
        ref="cropper"
        :src="image"
        :min-width="config.minWidth"
        :min-height="config.minHeight"
        :max-width="config.maxWidth"
        :max-height="config.maxHeight"
        :canvas="config.canvas"
        :stencil-size="config.stencilSize"
        :stencil-props="config.stencilProps"
        @change="onChange"
      />
      <div>
        <Preview
          class="rounded-md"
          v-if="result.image && config.minWidth"
          :width="Math.floor(config.minWidth / 3)"
          :height="Math.floor(config.minHeight / 3)"
          :image="result.image"
          :coordinates="result.coordinates"
        />
        <p v-if="croppedImage">
          {{ croppedImage }}
        </p>
        <NuxtImg v-if="croppedImage" :src="croppedImage" />
      </div>
    </div>
    <UButton @click="crop(cropper)"> Crop </UButton>
  </div>
</template>

<script setup lang="ts">
import type { CropperConfigTypes } from "~/types/cropper";
import { Cropper, Preview } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

const cropper = ref(null as typeof Cropper | null);

const p = defineProps({
  image: {
    type: String,
    required: true,
  },
  cropperType: {
    type: String as PropType<CropperConfigTypes>,
    required: true,
  },
});

const cropType = computed(() => p.cropperType);
const { result, croppedImage, config, crop, onChange } = useCropper(
  cropType.value
);
</script>

<style scoped></style>
