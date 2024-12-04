import { defineStore } from "pinia";
import { ref } from "vue";

export const useAppStore = defineStore('app', {
  state: () => ({
    hsv: {h: 0, s: 0, v: 0},
    info: {x: 0, y: 0},
    rightSideToggle: [false,true,true,true,false],
    canvas:{
      width: 600,
      height: 480,
    },
    tool: "text",
    isEdit:false,
  }),
})