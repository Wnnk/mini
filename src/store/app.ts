import { defineStore } from "pinia";
import Konva from "konva";

type ElementInfo = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  rotate: number;
  opacity: number;
};

export const useAppStore = defineStore("app", {
  state: () => ({
    hsv: { h: 0, s: 0, v: 0 } /* hsv color */,
    info: { x: 0, y: 0 } /* mouse position */,
    rightSideToggle: [true, true, true, false, true] /* 右侧面板开关 */,
    canvas: {
      width: 600,
      height: 600,
      background: "white",
      stage: <Konva.Stage | null>null,
      layer: <Konva.Layer | null>null,
      previewStage: <Konva.Stage | null>null,
      previewLayer: <Konva.Layer | null>null,
    } /* canvas size */,
    activeTransform: <Konva.Transformer | null>null,
    tool: "" /* current tool */,
    isEdit: false /* is edit mode */,
    file: <File | null>null /* media file */,
    shapeType: <string>"" /* shape type */,
    selectArea: <Konva.Shape | null>null,
    currentElementInfos: <ElementInfo | null>null,
  }),
});
