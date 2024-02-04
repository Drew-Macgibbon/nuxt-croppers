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
      canvas: {
        width: 320,
        height: 320,
        minHeight: 0,
        minWidth: 0,
        maxHeight: 480,
        maxWidth: 480,
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
        maxHeight: 3900,
        maxWidth: 3900,
      },
      stencilProps: {
        aspectRatio: 3.25,
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
    } finally {
      // Handle same file selected again
      if (input) input.value = "";
    }
  }

  function detectMimeType(imageSrc: string): string {
    const matches = imageSrc.match(/^data:(.+);base64,/);
    return matches && matches[1] ? matches[1] : "image/jpeg";
  }

  // check_webp_feature:
  //   'feature' can be one of 'lossy', 'lossless', 'alpha' or 'animation'.
  //   'callback(feature, result)' will be passed back the detection result (in an asynchronous way!)
  // check_webp_feature:
  //   'feature' can be one of 'lossy', 'lossless', 'alpha' or 'animation'.
  //   'callback(feature, result)' will be passed back the detection result (in an asynchronous way!)
  async function check_webp_feature(feature): Promise<boolean> {
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
  // image functions
  const crop = async (cropper) => {
    if (!cropper) return;

    const { canvas } = cropper.getResult();
    if (!canvas) return;

    let webpSupport = false;
    for (let feature of ["lossy", "lossless", "alpha", "animation"]) {
      const result = await check_webp_feature(feature);
      console.log(feature + " result: ", result);
      if (result) {
        webpSupport = true;
        break; // Found support, no need to check further
      }
    }

    const exportMimeType = webpSupport ? "image/webp" : "image/jpeg";
    console.log(
      "WebP support:",
      webpSupport,
      "Export MIME type:",
      exportMimeType
    );

    canvas.toBlob(
      (blob) => {
        const newImg = document.createElement("img");
        const url = URL.createObjectURL(blob);
        newImg.onload = () => {
          URL.revokeObjectURL(url); // Clean up
        };
        newImg.src = url;
        document.body.appendChild(newImg);
        // here we would send to the server
      },
      exportMimeType,
      1
    );
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
