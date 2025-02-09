<script setup lang="ts">
import { onMounted, toRefs } from "vue";
import { ref, computed, defineProps } from "vue";
import { useAppStore } from "../../store/app";
import Konva from "konva";
const appStore = useAppStore();
const toggle = computed(() => appStore.rightSideToggle[0]);
const detailItems = [
  { id: "zoom_less", title: "-" },
  { id: "zoom_100", title: "重置" },
  { id: "zoom_more", title: "+" },
  { id: "zoom_fit", title: "合适" },
];

const initPreview = () => {
  const layer = appStore.canvas.layer;
  if (!layer) return;
  appStore.canvas.previewStage = new Konva.Stage({
    container: "canvas_preview",
    width: 176,
    height: 176,
  });
  appStore.canvas.previewLayer = layer.clone();
  const scaleX = 176 / appStore.canvas.width;
  const scaleY = 176 / appStore.canvas.height;
  const scale = Math.min(scaleX, scaleY);
  appStore.canvas.previewLayer.scale({ x: scale, y: scale });
  appStore.canvas.previewStage.add(appStore.canvas.previewLayer as Konva.Layer);
};

onMounted(() => {
  initPreview();
});
</script>

<template>
  <div class="preview block">
    <h2
      :class="['trn', 'toggle', { toggled: !toggle }]"
      @click="appStore.rightSideToggle[0] = !toggle"
    >
      {{ $t("preview") }}
    </h2>
    <div id="toggle_preview" v-show="toggle">
      <div class="canvas_preview_wrapper">
        <div
          class="transparent-grid white"
          id="canvas_preview_background"
        ></div>
        <div
          id="canvas_preview"
          class="transparent"
          width="176"
          height="176"
        ></div>
      </div>
      <div class="canvas_preview_details">
        <div class="details">
          <button
            :title="item.title"
            class="layer_add trn"
            :id="item.title"
            v-for="item in detailItems"
            :key="item.id"
            style="height: 19px; line-height: 19px"
          >
            {{ item.title }}
          </button>
        </div>
        <input
          type="range"
          id="zoom_range"
          value="100"
          min="50"
          max="1000"
          step="50"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
