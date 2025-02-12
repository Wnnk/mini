<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { useMousePosition } from "../hooks/useMousePosition";
import { useAppStore } from "../store/app";
import { useTools } from "../hooks/tools/index";
import { wheelScale } from "../utils/wheelScale";
import { updatePreview } from "../utils/updatePreview";
import { contextMenu } from '../utils/contextMenu'
import ContextMenu from "./ContextMenu/ContextMenu.vue";
import Konva from "konva";

const appStore = useAppStore();

const stage = ref<any>(null);
const layer = ref<any>(null);

/** 
 * @description: 初始化画布背景色
  */
const initBackground = () => {
  document.getElementById('canvas_minipaint')!.style.backgroundColor = "white"
};

onMounted(() => {
  useMousePosition(document.getElementById("canvas_minipaint"));
  stage.value = new Konva.Stage({
    container: "canvas_minipaint",
    width: appStore.canvas.width,
    height: appStore.canvas.height,
  });
  initBackground();
  layer.value = new Konva.Layer();
  const rect = new Konva.Rect({
    x: 0,
    y: 0,
    width: 500,
    height: 500,
    fill: "red",
    name: "test"
  })

  layer.value.add(rect);
  stage.value.add(layer.value);

  appStore.canvas.stage = stage.value;
  appStore.canvas.layer = layer.value;

  console.log(layer.value)

  /*  监听画布点击 */
  stage.value.on("click", () => {
    if (!appStore.activeTransform) return;
    appStore.activeTransform.destroy();
    appStore.activeTransform = null;
  });
  /* 鼠标滚轮缩放 */
  stage.value.on("wheel", (event: Konva.KonvaEventObject<WheelEvent>) => {
    wheelScale(stage.value, event);
  });
  /* 监听画布右键菜单 */
  stage.value.on("contextmenu", (event: Konva.KonvaEventObject<MouseEvent>) => {
    toggleMenu();
  })


  /* 监听画布清除 */
  window.ipcRenderer.on("clear-canvas", () => {
    layer.value.destroyChildren();
  });
  /* 监听画布引入 */
  window.ipcRenderer.on("open-json", (_, data) => {
    try {
      stage.value = Konva.Node.create(data, "canvas_minipaint");
      layer.value = stage.value.children[0];
    } catch (error) {
      console.error(error);
    }
  });
});

watch(
  () => appStore.tool,
  () => {
    if (!appStore.isEdit) {
      useTools(stage.value, layer.value);
    }
  }
);

watch([stage, layer], () => {
  appStore.canvas.stage = stage.value;
  appStore.canvas.layer = layer.value;
});

watch(
  () => appStore.canvas.layer,
  () => {
    console.log("update preview")
    updatePreview();
  },
  {
    deep: true,
  }
);

/** 
 * @description: 改变画布背景色
  */
const changeColor = () => {
 document.getElementById('canvas_minipaint')!.style.backgroundColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
}

const menuToggle = ref(false);
const togglePosition = ref({x: 0, y: 0})
/** 
 * @description: 右键菜单显示隐藏
*/
const toggleMenu = () => {
  menuToggle.value =!menuToggle.value;
  if(menuToggle.value){
    const {x, y} = stage.value.getPointerPosition();
    togglePosition.value = {x, y};
    console.log(togglePosition.value)
  }
  return;
}


</script>

<template>
  <button @click="changeColor" type="button">改变颜色</button>
  <div :class="['middle_area']" id="middle_area">
    <canvas class="ruler_left" id="ruler_left"></canvas>
    <canvas class="ruler_top" id="ruler_top"></canvas>
    <div class="main_wrapper" id="main_wrapper">
      <div
        class="canvas_wrapper"
        id="canvas_wrapper"
        :style="`width:${appStore.wrapperStyle.width}px;height:${appStore.wrapperStyle.height}px;`"
      >
        <!-- <div
          class="transparent-grid white"
          id="canvas_minipaint_background"
        ></div> -->
        <div
          id="canvas_minipaint"
          :style="`width:${appStore.wrapperStyle.width}px;height:${appStore.wrapperStyle.height}px;`"
        ></div>

        <!-- 右键菜单 -->
         <ContextMenu 
          v-show="menuToggle"
          v-model="menuToggle"
          :style="`top:${togglePosition.y}px;left:${togglePosition.x}px;`"
          />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
