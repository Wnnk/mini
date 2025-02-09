<script setup lang="ts">
import MainMenus from "./components/MainMenus.vue";
import SubMenus from "./components/SubMenus.vue";
import SideBar from "./components/SideBar.vue";
import SideBarRight from "./components/SideBarRight/SideBarRight.vue";
import MiddleArea from "./components/MiddleArea.vue";

import { onMounted } from "vue";
</script>

<template>
  <div class="wrapper">
    <MainMenus />
    <SubMenus />
    <SideBar />
    <MiddleArea />
    <SideBarRight />
  </div>
</template>

<style>
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo.electron:hover {
  filter: drop-shadow(0 0 2em #9feaf9);
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
