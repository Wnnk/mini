<script setup lang="ts">
import { toRefs } from "vue";
import { ref, computed, defineProps } from "vue";
import { useAppStore } from "../../store/app";
const appStore = useAppStore();
const toggle = computed(() => appStore.rightSideToggle[0]);
const detailItems = [
  { id: "zoom_less", title: "缩小" },
  { id: "zoom_100", title: "重置" },
  { id: "zoom_more", title: "放大" },
  { id: "zoom_fit", title: "合适" },
];
</script>

<template>
  <div class="preview block">
    <h2
      :class="['trn', 'toggle', { toggled: !toggle }]"
      @click="appStore.rightSideToggle[0] = !toggle"
    >
      预览
    </h2>
    <div id="toggle_preview" v-show="toggle">
      <div class="canvas_preview_wrapper">
        <div
          class="transparent-grid white"
          id="canvas_preview_background"
        ></div>
        <canvas
          width="176"
          height="100"
          class="transparent"
          id="canvas_preview"
        ></canvas>
      </div>
      <div class="canvas_preview_details">
        <div class="details">
          <button title="测试" class="layer_add trn" id="测试">测试</button>
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
