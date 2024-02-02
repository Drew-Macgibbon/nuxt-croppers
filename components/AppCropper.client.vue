<template>
  <div class="space-y-24">
    <div v-if="errorMessage" class="text-red-500">{{ errorMessage }}</div>

    <AppModal>
      <template #button="{ toggleModalOpen }">
        <input
          type="file"
          ref="uploadInput"
          accept="image/jpg, image/jpeg, image/png, image/webp"
          id="myFile"
          name="filename"
          @change="handleFileChange($event, toggleModalOpen)"
        />
      </template>
      <template #modal>
        <VueAdvancedCropper :image="image" :cropper-type="cropperType" />
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import type { CropperConfigTypes } from "~/types/cropper";

const uploadInput = ref(null as HTMLInputElement | null);

defineProps({
  cropperType: {
    type: String as PropType<CropperConfigTypes>,
    required: true,
  },
});


const { handleFileChange, errorMessage, image } = useCropper();


</script>

<style scoped></style>
