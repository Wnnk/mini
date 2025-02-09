<script setup lang="ts">
import { computed, watch } from "vue";
import { useAppStore } from "../../store/app";

const appStore = useAppStore();
const toggle = computed(() => appStore.rightSideToggle[3]);

watch(
  () => appStore.currentElementInfos,
  () => {
    console.log(appStore.currentElementInfos);
  }
);
</script>

<template>
  <div class="details block" id="details_base">
    <h2
      :class="['trn', 'toggle', 'toggle-full', { toggled: !toggle }]"
      data-target="toggle-details"
      data-trn-key="图层"
      @click="appStore.rightSideToggle[3] = !toggle"
    >
      {{ $t("details") }}
    </h2>
    <div class="content details-content" id="toggle_details" v-show="toggle">
      <div
        class="row"
        v-for="([key, value], index) in Object.entries(
          appStore.currentElementInfos
        )"
        v-if="appStore.currentElementInfos"
      >
        <span class="trn label">{{ key }}:</span>

        <input id="detail_x" step="any" data-layer="1" :value="value || 0" />
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
