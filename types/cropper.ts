export type CropperConfigTypes = "avatar" | "cover" | "default";

export interface CropperConfig {
  name: string;
  minHeight: number;
  minWidth: number;
  maxHeight?: number;
  maxWidth?: number;
  stencilComponent?: string;
  canvas: {
    width: number;
    height: number;
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
