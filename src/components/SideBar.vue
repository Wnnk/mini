<script setup lang="ts">
import { ref } from "vue";
import { useAppStore } from "../store/app";
import "../styles/curour/ColorPicker.scss";
import { app } from "electron";

const appStore = useAppStore();

const sidebarItems = [
  { id: "select", title: "选择对象工具" },
  { id: "selection", title: "选择工具" },
  { id: "brush", title: "画刷" },
  { id: "pencil", title: "铅笔" },
  { id: "pick_color", title: "取色器" },
  { id: "erase", title: "橡皮擦" },
  { id: "magic_erase", title: "魔法橡皮擦" },
  { id: "fill", title: "填充" },
  { id: "shape", title: "形状" },
  { id: "line", title: "线条" },
  { id: "arrow", title: "箭头" },
  { id: "text", title: "文字" },
  { id: "media", title: "图片" },
  { id: "crop", title: "裁剪" },
  { id: "blur", title: "模糊" },
  { id: "sharpen", title: "锐化" },
  { id: "desaturate", title: "饱和度" },
];

/**
 * @description: 点击工具栏按钮切换工具
 * @param {string} id 工具栏按钮id
 **/
const switchTool = (id: string) => {
  appStore.tool = id;
  if (id === 'media') {
    toggleMedia.value = true;
  }
};

const closePopup = () => {
  toggleMedia.value = false;
}


const fileTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
const toggleMedia = ref(false);
const pickFile = (e:Event) => {
  if (!e.target) return;
  const files = (e.target as HTMLInputElement).files;
  if (!files) return;
  const file = files[0];
  if (!file) return;
  const fileExtenstion = file.name.split('.').pop();
  if (!fileExtenstion || !fileTypes.includes(fileExtenstion.toLowerCase())) {
    alert('请选择图片文件');
    return;
  }
  appStore.file = file;
  toggleMedia.value = false;
}


</script>

<template>
  <div class="sidebar_left" id="tools_container">
    <span
      v-for="item in sidebarItems"
      :key="item.id"
      :class="[
        'item',
        'brn',
        item.id,
        appStore.tool === item.id ? 'active' : '',
        appStore.tool === 'pick_color' ? 'color-picker' : '',
      ]"
      @click="switchTool(item.id)"
    >
    </span>
  </div>
  <div id="popups" v-show="toggleMedia">
    <div class="popup wide">
      <button type="button" class="close" data-id="popup_close" title="Close" @click="closePopup">×</button>
      <input type="file" @change="pickFile" multiple/>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
