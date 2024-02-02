<template>
  <div class="cropper-container">
    <cropper
      ref="cropper"
      :src="file"
      :stencil-size="{
        width: 300,
        height: 300,
      }"
      :stencil-props="{
        handlers: {},
        movable: false,
        resizable: false,
        aspectRatio: 1,
      }"
      image-restriction="stencil"
      :default-size="defaultSize"
      :default-position="defaultPosition"
      :default-visible-area="defaultVisibleArea"
      default-boundaries="fill"
      priority="visibleArea"
    />
  </div>
</template>

<script setup lang="ts">
import { Cropper } from "vue-advanced-cropper";
import file from "~/public/files/avatar/avatar-jpg.jpg";
import "vue-advanced-cropper/dist/style.css";

const defaultPosition = {
  left: 100,
  top: 100,
};

const defaultSize = {
  width: 400,
  height: 400,
};

const defaultVisibleArea = () => ({
  width: 800,
  height: 775,
  left: 63,
  top: 668,
});
</script>

<style scoped>
.cropper-container {
  /* Style your cropper container here */
  max-width: 100%;
  height: auto;
}
</style>
