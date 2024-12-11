import { defineStore } from "pinia";
import Konva from "konva";


export const useAppStore = defineStore("app", {
  state: () => ({
    hsv: { h: 0, s: 0, v: 0 }, /* hsv color */
    info: { x: 0, y: 0 }, /* mouse position */
    rightSideToggle: [false, true, true, true, false], /* 右侧面板开关 */
    canvas: {
      width: 600,
      height: 480,
      background: "white",
    }, /* canvas size */
    tool: "", /* current tool */
    isEdit: false, /* is edit mode */
    file: <File | null>null,  /* media file */
    selectArea: <Konva.Shape | null> null,
  }),
});
