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
          v-if="preview.image && config.minWidth"
          :width="Math.floor(config.minWidth / 3)"
          :height="Math.floor(config.minHeight / 3)"
          :image="preview.image"
          :coordinates="preview.coordinates"
        />
      </div>
    </div>
    <UButton @click="crop"> Crop </UButton>
  </div>
</template>

<script setup lang="ts">
import type { CropperConfigTypes } from "~/types/cropper";
import type { CropperResult, ImageTransforms } from "vue-advanced-cropper";
import { Cropper, Preview } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

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
const config = computed(() => cropperConfigs[props.cropperType]);
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

const webpSupport = ref(false);
onMounted(async () => {
  for (let feature of [
    "lossy",
    "lossless",
    "alpha",
    "animation",
  ] as Compression[]) {
    const result = await checkWebpFeature(feature);
    if (result) {
      webpSupport.value = true;
      break;
    }
  }
});

function convertImage(canvas: HTMLCanvasElement, mimeType: string) {
  canvas.toBlob(
    (blob) => {
      if (!blob) {
        setError("Failed to convert canvas to blob.");
        return;
      }
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
const cropper = ref(null as typeof Cropper | null);
const crop = async () => {
  if (!cropper.value) {
    setError("No cropper instance in crop function.");
    return;
  }

  const { canvas } = cropper.value.getResult();
  if (!canvas) {
    setError("Cropper failed to get canvas");
    return;
  }

  const exportMimeType = webpSupport.value ? "image/webp" : "image/jpeg";

  convertImage(canvas, exportMimeType);
};

const preview = reactive<CropperResult>({
  image: {
    width: 0,
    height: 0,
    transforms: {} as ImageTransforms,
    src: null,
  },
  visibleArea: {
    width: 0,
    height: 0,
    left: 0,
    top: 0,
  },
  coordinates: {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  },
});
function onChange({ coordinates, image, canvas }: CropperResult) {
  // realtime changes in the cropper
  if (!coordinates || !image) return;

  preview.coordinates = coordinates;
  preview.image = image;
}

// Errors
const errorMessage = ref<string>("");
const setError = (error: string) => {
  // probably a notification
  errorMessage.value = error;
};
</script>

<style scoped></style>
