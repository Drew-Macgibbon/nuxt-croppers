interface Dimensions {
  min: number;
  max: number;
  ratio: number;
}

interface CropperType {
  width: Dimensions;
  height: Dimensions;
  maxSize: number;
}