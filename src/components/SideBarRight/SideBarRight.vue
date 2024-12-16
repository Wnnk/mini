<script setup lang="ts">
import ColorPick from "./ColorPick.vue";
import Details from "./Details.vue";
import Info from "./Info.vue";
import Preview from "./Preview.vue";
import Layers from "./Layers.vue";
</script>

<template>
  <div class="sidebar_right">
    <Preview />
    <ColorPick />
    <Info />
    <Details />
    <Layers />
  </div>
</template>

<style lang="scss" scoped></style>
