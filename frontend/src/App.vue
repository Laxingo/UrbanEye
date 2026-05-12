<script setup>
import ToastContainer from "@/components/ToastContainer.vue"
import LoadingOverlay from "@/components/LoadingOverlay.vue"
</script>

<template>
  <router-view />
  <ToastContainer />
  <LoadingOverlay />
</template>

<style>
body {
  margin: 0;
  font-family: Inter, sans-serif;
  background-color: #0f0f0f;
}
</style>
