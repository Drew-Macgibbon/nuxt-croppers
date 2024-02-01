<template>
  <div>
    <form action="/action_page.php">
      <input type="file" id="myFile" name="filename" />
      <input type="submit" />
    </form>
    <AppCropper file="file" />
  </div>
</template>

<script setup lang="ts">

// upload button should be seperate from component, that way the cropper component is more dynamic.

</script>

<style scoped>

</style>