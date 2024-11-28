<script setup lang='ts'>
import { onMounted, reactive, ref,onUnmounted } from 'vue';
import { useMousePosition } from '../hooks/useMousePosition';


const canvasOption = reactive({
  canvas: null as HTMLCanvasElement | null,
  ctx: null as CanvasRenderingContext2D | null,
})




onMounted(() => {
  canvasOption.canvas = document.getElementById('canvas_minipaint') as HTMLCanvasElement;
  if (canvasOption.canvas) {
    canvasOption.ctx = canvasOption.canvas.getContext('2d') as CanvasRenderingContext2D;
    useMousePosition(canvasOption.canvas);
  } else {
    console.error('canvas not found');
  }

});


</script>

<template>
  <div class="middle_area" id="middle_area">
    <canvas class="ruler_left" id="ruler_left"></canvas>
    <canvas class="ruler_top" id="ruler_top"></canvas>
    <div class="main_wrapper" id="main_wrapper" >
      <div class="canvas_wrapper" id="canvas_wrapper" style="width: 560px; height: 420px;">
        <!-- <div id="mouse" class="circle"></div> -->
        <div class="transparent-grid white" id="canvas_minipaint_background"></div>
        <canvas id="canvas_minipaint" width="560" height="420"></canvas>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
</style>