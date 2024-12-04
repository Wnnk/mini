<script setup lang='ts'>
import { useAppStore } from '../../store/app';
import { ref, computed, defineProps } from 'vue'



const appStore = useAppStore();
const toggle = computed(() => appStore.rightSideToggle[2]);

</script>

<template>
  <div class="block" id="info_base">
    <h2 :class="['trn', 'toggle', 'toggle-full', {toggled: !toggle}]" data-target="toggle_info" data-trn-key="信息">信息</h2>
    <div class="content" id="toggle_info" v-show="toggle">
      <span class="trn label">Szie:</span>
      <span id="mouse_info_size">{{appStore.canvas.width }} x {{appStore.canvas.height }}</span>
      <span class="id-mouse_info_units">px</span>
      <br>
      <span class="trn label">Mouse:</span>
      <span id="mouse_info_mouse">{{appStore.info.x}}, {{appStore.info.y}}</span>
      <!-- <span class="id-mouse_info_units">px</span> -->
      <br>
      <!-- <span class="trn label">Resolution</span>
      <span id="mouse_info_resolution">72</span> -->
    </div>
  
  </div>
</template>

<style lang='scss' scoped>
</style>