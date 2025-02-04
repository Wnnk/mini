<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { useMousePosition } from "../hooks/useMousePosition";
import { useAppStore } from "../store/app";
import { useTools } from "../hooks/tools/index";
import { wheelScale } from "../utils/wheelScale";
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

  stage.value.add(layer.value);
  appStore.canvas.stage = stage.value;
  appStore.canvas.layer = layer.value;

  /*  监听画布点击 */
  stage.value.on("click", () => {
    if (!appStore.activeTransform) return;
    appStore.activeTransform.destroy();
    appStore.activeTransform = null;
  });
  /* 鼠标滚轮缩放 */
  stage.value.on("wheel", (event: Konva.KonvaEventObject<WheelEvent>) => {
    wheelScale(stage.value, event);
  });
  /* 监听画布清除 */
  window.ipcRenderer.on("clear-canvas", () => {
    layer.value.destroyChildren();
  });
  /* 监听画布引入 */
  window.ipcRenderer.on("open-json", (_, data) => {
    try {
      stage.value = Konva.Node.create(data, "canvas_minipaint");
      layer.value = stage.value.children[0];
    } catch (error) {
      console.error(error);
    }
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

watch([stage, layer], () => {
  console.log("stage, layer changed");
  appStore.canvas.stage = stage.value;
  appStore.canvas.layer = layer.value;
  console.log(appStore.canvas.stage, appStore.canvas.layer);
});

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
        :style="`width:${appStore.wrapperStyle.width}px;height:${appStore.wrapperStyle.height}px;`"
      >
        <div
          class="transparent-grid white"
          id="canvas_minipaint_background"
        ></div>
        <div
          id="canvas_minipaint"
          :style="`width:${appStore.wrapperStyle.width}px;height:${appStore.wrapperStyle.height}px;`"
        ></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
