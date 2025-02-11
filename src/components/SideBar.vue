<script setup lang="ts">
import { ref } from "vue";
import { useAppStore } from "../store/app";
import "../styles/curour/ColorPicker.scss";

const appStore = useAppStore();

const sidebarItems = [
  { id: "select", title: "选择对象工具" },
  { id: "selection", title: "选择工具" },
  // { id: "brush", title: "画刷" },
  { id: "pencil", title: "铅笔" },
  { id: "pick_color", title: "取色器" },
  { id: "erase", title: "橡皮擦" },
  // { id: "magic_erase", title: "魔法橡皮擦" },
  { id: "fill", title: "填充" },
  { id: "shape", title: "形状" },
  { id: "lasso", title: "套索工具" },
  { id: "text", title: "文字" },
  { id: "media", title: "图片" },
  { id: "crop", title: "裁剪" },
  { id: "blur", title: "模糊" },
  { id: "download", title: "下载" },
  // { id: "sharpen", title: "锐化" },
  // { id: "desaturate", title: "饱和度" },
];

/**
 * @description: 点击工具栏按钮切换工具
 * @param {string} id 工具栏按钮id
 **/
const switchTool = (id: string) => {
  appStore.tool = id;
  if (id === "media") {
    toggleMedia.value = true;
  } else if (id === "shape") {
    toggleShape.value = true;
  } else if (id === "download") {
    toggleDownload.value = true;
  }
};

const closePopup = () => {
  toggleMedia.value = false;
};

/**
 * @description: 打开图片选择弹窗
 * @param {Event} e 点击事件
 */
const fileTypes = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
const toggleMedia = ref(false);
const pickFile = (e: Event) => {
  if (!e.target) return;
  const files = (e.target as HTMLInputElement).files;
  if (!files) return;
  const file = files[0];
  if (!file) return;
  const fileExtenstion = file.name.split(".").pop();
  if (!fileExtenstion || !fileTypes.includes(fileExtenstion.toLowerCase())) {
    alert("请选择图片文件");
    return;
  }
  appStore.file = file;
  toggleMedia.value = false;
};

/**
 * @description: 打开形状选择弹窗
 *
 */

const toggleShape = ref(false);
const shapeItems = [
  { id: "rectangle", title: "矩形", url: "src/assets/rectangle.png" },
  { id: "circle", title: "圆形", url: "src/assets/circle.png" },
  { id: "triangle", title: "三角形", url: "src/assets/triangle.png" },
  {
    id: "isosceles-triangle",
    title: "直角三角形",
    url: "src/assets/isosceles-triangle.png",
  },
];

const closeShapePopup = () => {
  toggleShape.value = false;
};
const pickShape = (shapeType: string) => {
  appStore.shapeType = shapeType;
  toggleShape.value = false;
};

/* 保存下载 */
const toggleDownload = ref(false);
const closeDownloadPopup = () => {
  toggleDownload.value = false;
};
const saveAsImage = (type: string) => {
  appStore.download = type;
  toggleDownload.value = false;
};
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
      <button
        type="button"
        class="close"
        data-id="popup_close"
        title="Close"
        @click="closePopup"
      >
        ×
      </button>
      <input type="file" @change="pickFile" multiple />
    </div>
  </div>

  <div id="popups" v-show="toggleShape">
    <div class="popup wide">
      <div class="dialog_content">
        <div class="flex-container">
          <div
            class="shape-item"
            v-for="item in shapeItems"
            :key="item.id"
            @click="pickShape(item.id)"
          >
            <img
              :src="item.url"
              width="150px"
              height="120px"
              @click="appStore.shapeType = item.id"
            />
            <div class="preview-item-title">{{ item.title }}</div>
          </div>
          <button
            type="button"
            class="close"
            data-id="popup_close"
            title="Close"
            @click="closeShapePopup"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  </div>

  <div id="popups" v-show="toggleDownload">
    <div class="popup wide">
      <div>
        <button
          type="button"
          class="btn btn-primary"
          @click="saveAsImage('png')"
        >
          保存为图片
        </button>
        <button
          type="button"
          class="btn btn-secondary"
          @click="saveAsImage('json')"
        >
          保存为JSON
        </button>
        <button
          type="button"
          class="btn btn-secondary"
          @click="saveAsImage('pdf')"
        >
          保存为PDF
        </button>
        <button
          type="button"
          class="close"
          data-id="popup_close"
          title="Close"
          @click="closeDownloadPopup"
        >
          ×
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
