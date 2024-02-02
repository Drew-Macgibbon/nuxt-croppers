import type { CropperConfigTypes, CropperConfig } from "~/types/cropper";
import type { Cropper } from "vue-advanced-cropper";

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

  // Configs
  const activeConfig = ref<CropperConfigTypes>(initialConfig || "default");
  const cropperConfigs = {
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
        resizable: false,
      },
    } as CropperConfig,
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
    } as CropperConfig,
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
        resizable: true,
      },
    } as CropperConfig,
  };

  // Utility function to read file as data URL
  function readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.onerror = () =>
        reject(
          new Error("Failed to read the file as a data URL:", reader.error)
        );

      reader.readAsDataURL(file);
    });
  }

  const fileSizeOk = (fileSize: number) => {
    if (fileSize > MAX_FILE_SIZE) {
      errorMessage.value =
        "File is too large. Please select a file smaller than 5MB.";
      return false;
    }
    return true;
  };

  async function handleFileChange(e: Event, toggleModalOpen: () => void) {
    const input = e.target as HTMLInputElement;
    if (!input.files?.length) return;
    errorMessage.value = "";

    const file = input.files[0];

    if (!fileSizeOk(file.size)) return;

    try {
      image.value = await readFileAsDataURL(file);
      toggleModalOpen();
    } catch (error) {
      console.error("Error reading file:", error);
      errorMessage.value = "An error occurred while reading the file.";
    }
  }

  // image cropping
  const crop = (cropper) => {
    // We can access the cropper instance using the ref
    console.log("cropper", cropper);
    if (!cropper) return;

    const { canvas, image } = cropper.getResult();

    let mimeType = "image/jpeg"; // Default to JPEG if MIME type can't be determined
    const matches = image.src.match(/^data:(.+);base64,/);

    if (matches && matches[1]) {
      mimeType = matches[1];
    }
    console.log("cropTest", mimeType);
    croppedImage.value = canvas.toDataURL(mimeType);
    // do something with the result
  };

  function onChange({ coordinates, image, canvas }) {
    // we have access to the data in real time as the user moves the stencil
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
