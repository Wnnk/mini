<script setup lang='ts'>
import { ref } from 'vue';
import { resetStage, unGroup } from './MenuTools'

const emit = defineEmits(['update:modelValue'])

const menuItem = [
  {id:1, label: "重置画布"},
  {id:2, label: "撤销"},
  {id:3, label: "恢复"},
  {id:4, label: "拆分"}
]



const useMenuTools = (id: number) => {
  switch (id) {
    case 1:
      resetStage()
      break;
    case 2:
      break;
    case 3:
      break;
    case 4:
      unGroup()
      break;
    default:
      break;
  }
  emit('update:modelValue', false)

}


</script>

<template>
  <div id="context-menu">
    <div v-for="item in menuItem" :key="item.id" :class="['menu-item']" @click="useMenuTools(item.id)">{{ item.label }}</div>
  </div>
</template>

<style lang='scss' scoped>
</style>