<script setup lang="ts">
import { ref, computed, defineProps, onMounted } from "vue";
import { useAppStore } from "../../store/app";
import Konva from "konva";
import { selectTarget } from "../../hooks/selectTarget";

const appStore = useAppStore();
const toggle = computed(() => appStore.rightSideToggle[4]);

const lyaerList = computed(() => {
  if (!appStore.canvas.layer) return [];
  return appStore.canvas.layer.children.filter((item: any) => {
    console.log(item.name());
    return item.getType() !== "Group" && item.name() !== "Erase";
  });
});

const activeName = ref("");

/**
 * @description: 选择激活的图层
 */

const selectActive = (name: string) => {
  if (!appStore.canvas.layer) return;
  activeName.value = name;
  selectTarget(appStore.canvas.layer as Konva.Layer, name);
};
/**
 * @description: 删除指定类名的元素
 * @param {string} className 元素的类名
 */
const destroyTarget = (className: string) => {
  if (!appStore.canvas.layer) return;
  const target = appStore.canvas.layer.findOne(`.${className}`);
  if (!target) return;
  target.destroy();
  if (appStore.activeTransform) {
    appStore.activeTransform.destroy();
    appStore.activeTransform = null;
  }
};
/**
 * @description: 切换指定类名的元素的可见性
 * @param {string} className 元素的类名
 */
const toggleTarget = (className: string) => {
  if (!appStore.canvas.layer) return;
  const target = appStore.canvas.layer.findOne(`.${className}`);
  if (!target) return;
  target.visible(!target.visible());
};

/**
 * @description: 更新图层
 **/
const updateLayers = (className: string, type: string) => {
  if (!appStore.canvas.layer) return;
  const target = appStore.canvas.layer.findOne(`.${className}`);
  if (!target) return;
  switch (type) {
    case "top":
      target.moveUp();
      break;
    case "bottom":
      target.moveDown();
      break;
    case "up":
      target.moveUp();
      break;
    case "down":
      target.moveDown();
      break;
  }
};
</script>

<template>
  <div class="layers block">
    <h2
      :class="['trn', 'toggle', { toggled: !toggle }]"
      data-trn-key="图层"
      @click="appStore.rightSideToggle[4] = !toggle"
    >
      {{ $t('layers') }}
    </h2>
    <div class="content" id="layers_base" v-show="toggle">
      <button
        type="button"
        class="layer_add"
        id="insert_layer"
        title="Insert new layer"
      >
        +
      </button>
      <button
        type="button"
        class="layer_duplicate"
        id="delete_layer"
        title="top layer"
        @click="updateLayers(activeName, 'top')"
      >
        T
      </button>
      <button
        type="button"
        class="layer_raster"
        id="layer_raster"
        title="bottom layer"
        @click="updateLayers(activeName, 'bottom')"
      >
        B
      </button>
      <button
        type="button"
        class="layers_arrow"
        title="Move layer down"
        id="layer_down"
        @click="updateLayers(activeName, 'down')"
      >
        ↓
      </button>
      <button
        type="button"
        class="layers_arrow"
        title="Move layer up"
        id="layer_up"
        @click="updateLayers(activeName, 'up')"
      >
        ↑
      </button>

      <div class="layers_list" id="layers">
        <div
          :class="['item', activeName === child.name() ? 'active' : '']"
          v-for="child of (lyaerList as any)"
        >
          <button
            :class="['visibility', 'trn', child.visible() ? 'visible' : '']"
            id="visibility"
            data-id="28"
            :title="child.visible() ? 'Hide' : 'Show'"
            @click="toggleTarget(child.name())"
          ></button>
          <button
            class="delete"
            id="delete"
            data-id="28"
            title="Delete"
            @click="destroyTarget(child.name())"
          ></button>
          <button
            class="layer_name"
            id="layer_name"
            :data-id="child._id"
            @click="selectActive(child.name())"
          >
            {{ child.name() }}
          </button>
          <div class="clear"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
