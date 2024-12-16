import Konva from "konva";
import { hsvToHex } from "../../utils/color";
import { useAppStore } from "../../store/app";
import { watch } from "vue";

export const useFill = (stage: Konva.Stage, layer: Konva.Layer) => {
  const appStore = useAppStore();
  if (appStore.tool !== "fill") return;

  const shape = appStore.selectArea;
  if (shape) {
    layer.add(shape as Konva.Shape);
  }

  appStore.isEdit = true;

  /**
   * @description: 选区填充颜色
   */
  const clickArea = (event: any) => {
    if (!shape) return;
    event.evt.stopPropagation();
    /* 取消虚线边框 */
    shape.dash([0]);
    const hsv = appStore.hsv;
    const hex = hsvToHex(hsv.h, hsv.s, hsv.v);
    shape.fill(hex);
    shape.stroke(hex);
  };

  /**
   * @description: 背景填充颜色
   */
  const clickBackground = () => {
    if (appStore.selectArea) return;
    /* 取消选区 */
    appStore.selectArea = null;
    shape?.destroy();
    const hsv = appStore.hsv;
    const hex = hsvToHex(hsv.h, hsv.s, hsv.v);
    /* 获取background */
    const background = new Konva.Rect({
      x: 0,
      y: 0,
      width: stage.width(),
      height: stage.height(),
      fill: hex,
      opacity: 0.5,
    });
    appStore.canvas.background = hex;
    layer.add(background);
    layer.draw();
  };

  shape?.on("click", clickArea);
  stage.on("click", clickBackground);
  watch(
    () => appStore.tool,
    () => {
      shape?.off("click", clickArea);
      stage.off("click", clickBackground);
      appStore.selectArea = null;
      appStore.isEdit = false;
    }
  );
};
