<template>
  <div class="space-y-24">
    <div>
      <p>Hello from cropper</p>
      <p>config: {{ cropperConfig }}</p>
      <form action="/action_page.php">
        <input type="file" id="myFile" name="filename" />
        <input type="submit" />
      </form>
    </div>
    <AppModal title="Vue Picture Cropper">
      <VuePictureCropper file="file" />
    </AppModal>
    <AppModal title="Vue Advanced Cropper">
      <VueAdvancedCropper />
    </AppModal>
  </div>
</template>

<script setup lang="ts">
const { cropperConfig } = useConfig();

defineProps({
  file: {
    type: String,
    required: true,
  },
});

// if the logic gets large consider extracting to a composable

// Decided to try these two options, get them working first and play:

// 2nd best option
//  Option 5, Vue Advanced Cropper: https://github.com/advanced-cropper/vue-advanced-cropper?tab=readme-ov-file
// 1k stars, updated: 2021

// Pros:
// Vue 3 support
// TS support
// Mobile Support
// Supports all features
// good design with theming options
// preview component
// good docs

// Cons:
// will have to create a plugin

// ----------------------------

// Best Option
//  Option 6, Vue Picture Cropper: https://cropper.chengpeiquan.com/quick-start.html
// 100 stars, last update 4 months ago

// Pros:
// Most recently updated and worked on
// TS support
// Wrapper around cropper.js so features are rich, does all we need
//

// Cons:
// small number of stars indicates fewer real world tests.

// Research conducted:

// Cropperjs last release: Sep 17 2023
// https://fengyuanchen.github.io/cropperjs/

// Pros:
// Most stars on github
// Decent documentation
// Browser support: Chrome (latest) Firefox (latest) Safari (latest) Opera (latest) Edge (latest) Internet Explorer 9+
// Supports 39 options
// Feature rich, supports everything we need and more.
//

// Cons:
// JS, no TS support
// Would probably have to setup Nuxt plugin
// There is a Vue Wrapper, last update 3 years ago: https://github.com/Agontuk/vue-cropperjs
//
// Quite an old library, might be dated in methods

//  Option 2, Vue Cropper last release Nov 2023, 4.1k stars

// Pros:
// Has enough features to meet criteria

// Cons:
// Chinese, docs may be hard to understand
// Only appears to support jpg, png, webp
// Works with Vue 3, plugin needed for nuxt, docs only for nuxt 2, but should be simple enough
// no ts support

//  Option 3, Croppie, last release April 2019, 2.5k stars
// Pros:

// Cons:
// seems outdated
// only vue 2 wrapper
// no ts support
// no further research

//  Option 4, Vue Croppa: https://github.com/zhanziyang/vue-croppa
// 1k stars, updated: 2018

// Cons:
// outdated, no further research.
</script>

<style scoped></style>
