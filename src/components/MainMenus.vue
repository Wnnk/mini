<script setup lang='ts'>
const menuItem  = [
  {name: '文件'},
  {name: '编辑'},
  {name: '视图'},
]

const demo = (item: string) => {
  console.log(item); 
}
</script>

<template>
  <nav class="main_menu">
    <ul class="menu_bar">
      <li v-for="item in menuItem" :key="item.name" @click="demo(item.name)">
        <a>
          <span>
            {{ item.name }}
          </span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<style lang='scss' scoped>
</style>