<script setup lang="ts">
import { onMounted, reactive, ref, onUnmounted } from "vue";
import { useMousePosition } from "../hooks/useMousePosition";
import { useAppStore } from "../store/app";
import { useTools } from "../hooks/tools/index";
import Konva from "konva";

const appStore = useAppStore();

const stage = ref<any>(null);
const layer = ref<any>(null);

onMounted(() => {
  useMousePosition(document.getElementById("canvas_minipaint"));
  stage.value = new Konva.Stage({
    container: "canvas_minipaint",
    width: appStore.canvas.width,
    height: appStore.canvas.height,
  });
  layer.value = new Konva.Layer();

  // const line = new Konva.Line({
  //   points: [100, 100, 200, 200],
  //   stroke: 'black',
  //   dash: [10,5],
  //   strokeWidth: 2,
  // })

  // layer.value.add(line);


  stage.value.add(layer.value);
});
</script>

<template>
  <div :class="['middle_area']" id="middle_area">
    <canvas class="ruler_left" id="ruler_left"></canvas>
    <canvas class="ruler_top" id="ruler_top"></canvas>
    <div class="main_wrapper" id="main_wrapper">
      <div
        class="canvas_wrapper"
        id="canvas_wrapper"
        :style="`width:${appStore.canvas.width} ; height: ${appStore.canvas.height};`"
      >
        <!-- <div id="mouse" class="circle"></div> -->
        <div
          class="transparent-grid white"
          id="canvas_minipaint_background"
        ></div>
        <div
          id="canvas_minipaint"
          :style="`width:${appStore.canvas.width} ; height: ${appStore.canvas.height};`"
          @mousedown="
            () => {
              if (!appStore.isEdit) {
                useTools(stage, layer);
              }
            }
          "
        ></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
