import { defineStore } from "pinia";
import { ref } from "vue";

export const useAppStore = defineStore('app', ()=> {
  // state
  const info = ref({
    x: 0,
    y: 0,
  })

  return {
    info,
  }
})