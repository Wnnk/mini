<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { useMousePosition } from "../hooks/useMousePosition";
import { useAppStore } from "../store/app";
import { useTools } from "../hooks/tools/index";

import Konva from "konva";

const appStore = useAppStore();

const stage = ref<any>(null);
const layer = ref<any>(null);

const initBackground = (layer: Konva.Layer) => {
  appStore.canvas.background = new Konva.Rect({
    x: 0,
    y: 0,
    width: appStore.canvas.width,
    height: appStore.canvas.height,
    fill: "white",
    listening: false,
    name: "background",
  });
  layer.add(appStore.canvas.background as Konva.Rect);
};

onMounted(() => {
  useMousePosition(document.getElementById("canvas_minipaint"));
  stage.value = new Konva.Stage({
    container: "canvas_minipaint",
    width: appStore.canvas.width,
    height: appStore.canvas.height,
  });

  layer.value = new Konva.Layer();
  initBackground(layer.value);

  const rect = new Konva.Rect({
    x: 0,
    y: 0,
    width: 300,
    height: 200,
    fill: "red",
    name: `test`,
  });
  layer.value.add(rect);

  layer.value.draw();
  stage.value.add(layer.value);
  appStore.canvas.stage = stage.value;
  appStore.canvas.layer = layer.value;

  stage.value.on("click", () => {
    if (!appStore.activeTransform) return;
    appStore.activeTransform.destroy();
    appStore.activeTransform = null;
  });
});

watch(
  () => appStore.tool,
  () => {
    if (!appStore.isEdit) {
      useTools(stage.value, layer.value);
    }
  }
);

const updatePreview = () => {
  const layer = appStore.canvas.layer;
  const previewLayer = appStore.canvas.previewLayer;
  const previewStage = appStore.canvas.previewStage;
  if (!layer || !previewLayer || !previewStage) return;
  /* 更新预览层 */
  previewLayer.destroy();
  appStore.canvas.previewLayer = layer.clone({ listening: false });
  const scaleX = 176 / appStore.canvas.width;
  const scaleY = 176 / appStore.canvas.height;
  const scale = Math.min(scaleX, scaleY);
  appStore.canvas.previewLayer.scale({ x: scale, y: scale });
  appStore.canvas.previewStage!.add(
    appStore.canvas.previewLayer as Konva.Layer
  );
};

watch(
  () => appStore.canvas.layer,
  () => {
    updatePreview();
  },
  {
    deep: true,
  }
);
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
        <div
          class="transparent-grid white"
          id="canvas_minipaint_background"
        ></div>
        <div
          id="canvas_minipaint"
          :style="`width:${appStore.canvas.width} ; height: ${appStore.canvas.height};`"
        ></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
