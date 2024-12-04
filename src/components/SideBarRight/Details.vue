<script setup lang='ts'>
import { computed } from 'vue';
import { useAppStore } from '../../store/app';
const appStore = useAppStore();
const toggle = computed(() => appStore.rightSideToggle[3]);




const details = [
  {key: 'X', value: 0, type: 'number'},
  {key: 'Y', value: 0, type: 'number'},
  {key: 'Width', value: 0, type: 'number'},
  {key: 'Height', value: 0, type: 'number'},
  {key: 'Rotate', value: 0, type: 'number'},
  {key: 'Opacity', value: 100, type: 'number'},
  {key: 'Color', value: '#000000', type: 'color'},
]
</script>

<template>
  <div class="details block" id="details_base">
    <h2 :class="['trn', 'toggle', 'toggle-full', {toggled: !toggle}]" data-target="toggle-details" data-trn-key="图层">细节</h2>
    <div class="content details-content" id="toggle_details" v-show="toggle">
      <div class="row" v-for="(detail,index) in details" :key="detail.key">
        <span class="trn label">{{detail.key}}:</span>
        <input :type="detail.type" id="detail_x" step="any" data-layer="1" :value="detail.value">
        <button class="extra reset" type="button" id="reset_x" title="Reset"></button>
        <hr v-if="index === 2">
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
</style>