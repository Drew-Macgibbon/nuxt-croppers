import type { CropperConfigTypes, CropperConfig } from "~/types/cropper";
import type { CropperResult } from "vue-advanced-cropper";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export default function useCropper(initialConfig?: CropperConfigTypes) {
  const errorMessage = ref<string>("");
  const image = ref<string>("");

  // result from crop
  const croppedImage = ref(null as string | null);
  // result from onChange
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

  // Configs (probably extract this)
  const activeConfig = ref<CropperConfigTypes>(initialConfig || "default");
  const cropperConfigs: Record<CropperConfigTypes, CropperConfig> = {
    default: {
      name: "Default",
      minWidth: 160,
      minHeight: 160,
      // maxWidth: 320, if you want to set a max width/height, but it's probably better to resize the image after cropping
      // maxHeight: 320,
      canvas: {
        width: 320,
        height: 320,
      },
      stencilSize: {
        width: 320,
        height: 320,
      },
      stencilProps: {
        movable: true,
        aspectRatio: 1,
      },
    },
    avatar: {
      name: "avatar",
      minHeight: 160,
      minWidth: 160,
      canvas: {
        width: 640,
        height: 640,
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
        width: 2600,
        height: 800,
      },
      stencilSize: {
        width: 1300,
        height: 400,
      },
      stencilProps: {
        movable: true,
      },
    },
  };

  // Utility functions
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
      errorMessage.value =
        "File is too large. Please select a file smaller than 5MB.";
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
      toggleModalOpen();
    } catch (error: any) {
      console.error("Error reading file:", error);
      errorMessage.value = `An error occurred while reading the file: ${error.message}`;
    }
  }

  function detectMimeType(imageSrc: string): string {
    const matches = imageSrc.match(/^data:(.+);base64,/);
    return matches && matches[1] ? matches[1] : "image/jpeg";
  }

  // image functions
  const crop = (cropper) => {
    if (!cropper) return;

    const { canvas, image }: CropperResult = cropper.getResult();
    if (!canvas || !image.src) return;

    const mimeType = detectMimeType(image.src);
    croppedImage.value = canvas.toDataURL(mimeType);

    // probably send to the server for processing
  };

  function onChange({ coordinates, image, canvas }: CropperResult) {
    // realtime changes in the cropper
    if (!coordinates || !image) return;

    result.coordinates = coordinates;
    result.image = image;
  }

  return {
    config: computed(
      () => cropperConfigs[activeConfig.value as CropperConfigTypes]
    ),
    handleFileChange,
    errorMessage,
    image,
    result,
    crop,
    onChange,
    croppedImage,
  };
}
