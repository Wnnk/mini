<script setup lang='ts'>
import { ref } from 'vue';
import { useAppStore } from '../store/app';

const appStore = useAppStore();

const sidebarItems = [
  {id: 'select', title: '选择对象工具' },
  {id: 'selection', title: '选择工具' },
  {id: 'brush', title: '画刷' },
  {id: 'pencil', title: '铅笔' },
  {id: 'pick_color', title: '取色器' },
  {id: 'erase', title: '橡皮擦' },
  {id: 'magic_erase', title: '魔法橡皮擦' },
  {id: 'fill', title: '填充' },
  {id: 'shape', title: '形状' },
  {id: 'line', title: '线条' },
  {id: 'arrow', title: '箭头' },
  {id: 'text', title: '文字' },
  {id: 'media', title: '图片' },
  {id: 'crop', title: '裁剪' },
  {id: 'blur', title: '模糊' },
  {id: 'sharpen', title: '锐化' },
  {id: 'desaturate', title: '饱和度' }
]

const toolActive = ref<string>('pencil');
/** 
 * @description: 点击工具栏按钮切换工具
 * @param {string} id 工具栏按钮id
**/
const switchTool = (id: string) => {
  toolActive.value = id;
  appStore.tool = id;
  console.log(appStore.tool);
}


</script>

<template>
  <div class="sidebar_left" id="tools_container">
    <span 
      v-for="item in sidebarItems" :key="item.id" 
      :class="['item', 'brn', item.id, toolActive === item.id? 'active' : '']"
      @click="switchTool(item.id)"
    >
     
    </span>
  </div>
</template>

<style lang='scss' scoped>
</style>