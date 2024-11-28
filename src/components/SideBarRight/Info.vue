<script setup lang='ts'>
import { useAppStore } from '../../store/app';
const appStore = useAppStore();

const info = {
    size: {
      width: 800,
      height: 600
    },
    units: 'px',
    mouse: {
      x: 794,
      y: 154
    },
    resolution: 72,
}
</script>

<template>
  <div class="block" id="info_base">
    <h2 class="trn toggle toggle-full" data-target="toggle_info" data-trn-key="信息">信息</h2>
    <div class="content" id="toggle_info">
      <span class="trn label">Szie:</span>
      <span id="mouse_info_size">800 x 600</span>
      <span class="id-mouse_info_units">px</span>
      <br>
      <span class="trn label">Mouse:</span>
      <span id="mouse_info_mouse">{{appStore.info.x}}, {{appStore.info.y}}</span>
      <!-- <span class="id-mouse_info_units">px</span> -->
      <br>
      <span class="trn label">Resolution</span>
      <span id="mouse_info_resolution">72</span>
    </div>
  
  </div>
</template>

<style lang='scss' scoped>
</style>