<script setup lang='ts'>
import { defineProps, toRefs, ref,watch, computed } from 'vue'
import { useAppStore } from '../../store/app';
import { hsvToHex, hsvToRgb } from '../../utils/color';


const appStore = useAppStore();

const props = defineProps({
  type: {
    type: String,
  },
  label: {
    type: String,
  },
  title: {
    type: String,
    required: true
  },
  className: {
    type: String,
  },
  text: {
    type: String,
  },
  id: {
    type: String,
  },
  range: {
    type: String,
  }
})
const {label, title, className, text, id, range} = toRefs(props)
const style = ref(``)
/** 
 * @description 生成滑块的渐变色样式
 * @param {string} color1 颜色from
 * @param {string} color2 颜色to
 * @returns {string} 渐变色样式
  */
  const createGradient = (color1:string, color2:string): string => {
  return `background: linear-gradient(to right, rgb(${color1}), rgb(${color2}));`;
};
/** 
 * @description 初始化颜色滑块样式
 * 
**/
const initColorSlider = () => {
  const {r,g,b}   = hsvToRgb(appStore.hsv.h, appStore.hsv.s, appStore.hsv.v);
  if (title.value === 'Red') {
    style.value = createGradient(`${0},${g},${b}`, `${255},${g},${b}`)
  } else if (title.value === 'Green') {
    style.value = createGradient(`${r},${0},${b}`, `${r},${255},${b}`)
  } else if (title.value === 'Blue') {
    style.value = createGradient(`${r},${g},${0}`, `${r},${g},${255}`)
  } 
}

const inputValue = computed(() => {
  const {r,g,b}   = hsvToRgb(appStore.hsv.h, appStore.hsv.s, appStore.hsv.v);
  if (title.value === 'Red') {
    return Math.round(r);
  } else if (title.value === 'Green') {
    return Math.round(g);
  } else if (title.value === 'Blue') {
    return Math.round(b);
  } 
  return 0;
})





watch(appStore.hsv, () => {
  initColorSlider();
},{immediate: true})












</script>

<template>
    <div
    class="ui_input_group"
  >
    <label
      :id="label"
      :title="title"
      :class="['label_width_character', className]"
    >
      <strong
        >{{ title![0]
        }}<span class="sr_only">{{
          title?.substring(1) || ''
        }}</span></strong
      >
    </label>
    <div
      class="ui_range color_picker"
      tabindex="0"
      role="slider"
      aria-valuemin="0"
      aria-valuemax="255"
      :aria-valuenow="inputValue"
      :id="range"
    >
      <div
        class="padded_track"
        :style="style"
      ></div>
      <div class="bar" :style="{width: `${inputValue / 255 * 100}%`}">
        <div class="handle"></div>
      </div>
    </div>
    <div
      class="ui_number_input input_cw_3"
      :id="id + '_range'"
    >
      <input
        type="number"
        :aria-labelledby="label"
        max="255"
        step="1"
        :value="inputValue"
      />
      <!-- <button class="increase_number" tabindex="-1">
        <span class="sr_only">Increase</span>
      </button>
      <button class="decrease_number" tabindex="-1">
        <span class="sr_only">Decrease</span>
      </button> -->
    </div>
  </div>
  
</template>

<style lang='scss' scoped>
</style>