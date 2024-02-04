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
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const uploadInput = ref(null as HTMLInputElement | null);
const errorMessage = ref<string>("");
const image = ref<string>("");

const props = defineProps({
  cropperType: {
    type: String as PropType<CropperConfigTypes>,
    required: true,
  },
});

type CropperConfigDimensions = {
  [key in CropperConfigTypes]: { minWidth: number; minHeight: number };
};

async function checkImageDimensions(
  imageSrc: string,
  cropperType: CropperConfigTypes
): Promise<boolean> {
  const dimensions: CropperConfigDimensions = {
    default: { minWidth: 800, minHeight: 600 },
    avatar: { minWidth: 160, minHeight: 160 },
    cover: { minWidth: 1300, minHeight: 400 },
  };

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const { minWidth, minHeight } = dimensions[cropperType];
      if (img.width >= minWidth && img.height >= minHeight) {
        resolve(true);
      } else {
        setError(
          `Image dimensions must be at least ${minWidth}x${minHeight}px for ${cropperType}.`
        );
        resolve(false);
      }
    };
    img.onerror = () => {
      setError("Failed to load image for dimension check.");
      resolve(false);
    };
    img.src = imageSrc;
  });
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.onerror = () =>
      reject(new Error(`Failed to read the file: ${reader.error?.message}`));

    reader.readAsDataURL(file);
  });
}

function validateFileSize(fileSize: number): boolean {
  if (fileSize > MAX_FILE_SIZE) {
    setError("File is too large. Please select a file smaller than 5MB.");
    return false;
  }
  return true;
}

async function handleFileChange(e: Event, toggleModalOpen: () => void) {
  const input = e.target as HTMLInputElement;
  if (!input.files?.length) return;
  errorMessage.value = "";

  const file = input.files[0];

  if (!validateFileSize(file.size)) return;

  try {
    image.value = await readFileAsDataURL(file);
    if (!(await checkImageDimensions(image.value, props.cropperType))) return;
    toggleModalOpen();
  } catch (error: any) {
    setError(`An error occurred while reading the file: ${error.message}`);
  } finally {
    // reset the input value
    if (input) input.value = "";
  }
}

// Errors
const setError = (error: string) => {
  // probably a notification
  errorMessage.value = error;
};

</script>

<style scoped></style>
