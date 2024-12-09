import { defineStore } from "pinia";
import { ref } from "vue";

interface listenersType {
  type: string;
  listener: Function;
}
export const useAppStore = defineStore("app", {
  state: () => ({
    hsv: { h: 0, s: 0, v: 0 },
    info: { x: 0, y: 0 },
    rightSideToggle: [false, true, true, true, false],
    canvas: {
      width: 600,
      height: 480,
    },
    tool: "null",
    isEdit: false,
    file: <File | null>null,

    listeners: [] as listenersType[],
  }),
});
