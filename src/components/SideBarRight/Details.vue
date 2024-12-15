<script setup lang="ts">
import { computed } from "vue";
import { useAppStore } from "../../store/app";

const appStore = useAppStore();
const toggle = computed(() => appStore.rightSideToggle[3]);
</script>

<template>
  <div class="details block" id="details_base">
    <h2
      :class="['trn', 'toggle', 'toggle-full', { toggled: !toggle }]"
      data-target="toggle-details"
      data-trn-key="图层"
    >
      细节
    </h2>
    <div class="content details-content" id="toggle_details" v-show="toggle">
      <div
        class="row"
        v-for="(key, value, index) in appStore.currentElementInfos"
        :key="key"
        v-if="appStore.currentElementInfos"
      >
        <span class="trn label">{{ value }}:</span>

        <input
          :type="
            typeof key === 'number'
              ? 'number'
              : typeof value === 'string' && key.startsWith('#')
              ? 'color'
              : 'text'
          "
          id="detail_x"
          step="any"
          data-layer="1"
          :value="key || 0"
        />
        <button
          class="extra reset"
          type="button"
          id="reset_x"
          title="Reset"
        ></button>
        <hr v-if="index === 2" />
      </div>
      <div v-if="!appStore.currentElementInfos">请先选择一个元素</div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
