<template>
  <div class="w-full h-full space-y-4 p-4">
    <div v-if="errorMessage" class="text-red-500">{{ errorMessage }}</div>

    <div class="relative w-full h-full space-y-4">
      <Cropper
        ref="cropper"
        :src="image"
        :min-width="config.minWidth"
        :min-height="config.minHeight"
        :canvas="config.canvas"
        :stencil-props="config.stencilProps"
        :debounce="false"
        @change="onChange"
        @error="setError('error loading image')"
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
import type { CropperResult } from "vue-advanced-cropper";
import { Cropper, Preview } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

// Data
const cropper = ref(null as typeof Cropper | null);
const croppedImage = ref(null as string | null);
const errorMessage = ref<string>("");

const result = reactive({
  image: null,
  blob: null,
  coordinates: {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  },
});

const config = computed(() => cropperConfigs[props.cropperType]);

const props = defineProps({
  image: {
    type: String,
    required: true,
  },
  cropperType: {
    type: String as PropType<CropperConfigTypes>,
    required: true,
  },
});

// Configs
export interface CropperConfig {
  name: string;
  minHeight: number;
  minWidth: number;
  maxHeight?: number;
  maxWidth?: number;
  stencilComponent?: string;
  canvas: {
    minWidth: number;
    minHeight: number;
    maxWidth: number;
    maxHeight: number;
  };
  stencilSize?: {
    width: number;
    height: number;
  };
  stencilProps: {
    handlers?: Record<string, any>;
    movable: boolean;
    resizable?: boolean;
    aspectRatio?: number;
  };
}

const cropperConfigs: Record<CropperConfigTypes, CropperConfig> = {
  default: {
    name: "Default",
    minWidth: 160,
    minHeight: 160,
    canvas: {
      minHeight: 0,
      minWidth: 0,
      maxHeight: 480,
      maxWidth: 480,
    },
    stencilProps: {
      aspectRatio: 1,
      movable: true,
    },
  },
  avatar: {
    name: "avatar",
    minHeight: 160,
    minWidth: 160,
    canvas: {
      minHeight: 0,
      minWidth: 0,
      maxHeight: 480,
      maxWidth: 480,
    },
    stencilProps: {
      aspectRatio: 1,
      movable: true,
    },
  },
  cover: {
    name: "cover",
    minWidth: 1300,
    minHeight: 400,
    canvas: {
      minHeight: 0,
      minWidth: 0,
      maxWidth: 1200,
      maxHeight: 3900,
    },
    stencilProps: {
      aspectRatio: 3.25,
      movable: true,
    },
  },
};

// Checks & Utils
type Compression = "lossy" | "lossless" | "alpha" | "animation";

async function checkWebpFeature(feature: Compression): Promise<boolean> {
  return new Promise((resolve) => {
    const kTestImages = {
      lossy: "UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",
      lossless: "UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==",
      alpha:
        "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==",
      animation:
        "UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA",
    };

    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = "data:image/webp;base64," + kTestImages[feature];
  });
}

function convertImage(canvas: HTMLCanvasElement, mimeType: string) {
  canvas.toBlob(
    (blob) => {
      // load image for testing
      const newImg = document.createElement("img");
      const url = URL.createObjectURL(blob);
      newImg.onload = () => {
        URL.revokeObjectURL(url); // Clean up
      };
      newImg.src = url;
      document.body.appendChild(newImg);
      // here we would send to the server
      console.log("blobUrl", url, blob);
    },
    mimeType,
    1
  );
}

// Cropper
const crop = async (cropper) => {
  if (!cropper) return;

  const { canvas } = cropper.getResult();
  if (!canvas) return;

  let webpSupport = false;
  for (let feature of [
    "lossy",
    "lossless",
    "alpha",
    "animation",
  ] as Compression[]) {
    const result = await checkWebpFeature(feature);
    if (result) {
      webpSupport = true;
      break;
    }
  }

  const exportMimeType = webpSupport ? "image/webp" : "image/jpeg";

  convertImage(canvas, exportMimeType);
};

function onChange({ coordinates, image, canvas }: CropperResult) {
  // realtime changes in the cropper
  if (!coordinates || !image) return;

  result.coordinates = coordinates;
  result.image = image;
}

// Errors
const setError = (error: string) => {
  // probably a notification
  errorMessage.value = error;
};
</script>

<style scoped></style>
