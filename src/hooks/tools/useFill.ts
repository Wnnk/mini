import Konva from "konva";
import { hsvToHex } from "../../utils/color";
import { useAppStore } from "../../store/app";
import { watch } from "vue";

export const useFill = (stage: Konva.Stage, layer: Konva.Layer) => {
  const appStore = useAppStore();
  if (appStore.tool !== "fill") return;

  const shape = appStore.selectArea;
  // if (shape) {
  //   layer.add(shape as Konva.Shape);
  // }

  appStore.isEdit = true;

  /**
   * @description: 选区填充颜色
   */
  const clickArea = (event: any) => {
    console.log("clickArea");
    if (!shape) return;
    event.cancelBubble = true;
    /* 取消虚线边框 */
    shape.dash([0]);
    const hsv = appStore.hsv;
    const hex = hsvToHex(hsv.h, hsv.s, hsv.v);
    shape.fill(hex);
    shape.stroke(hex);
    appStore.selectArea = null;
  };

  /**
   * @description: 背景填充颜色
   */
  const clickBackground = () => {
    shape?.destroy();
    appStore.selectArea = null;

    const hsv = appStore.hsv;
    const hex = hsvToHex(hsv.h, hsv.s, hsv.v);

    /* 背景颜色已经存在 */
    if (appStore.canvas.background) {
      appStore.canvas.background.fill(hex);
    } else {
      appStore.canvas.background = new Konva.Rect({
        x: 0,
        y: 0,
        width: stage.width(),
        height: stage.height(),
        fill: hex,
        opacity: 1,
        zIndex: 0,
      });
    }
    appStore.canvas.backgroundColor = hex;
    layer.add(appStore.canvas.background as Konva.Rect);
    layer.draw();
  };

  shape?.on("click", clickArea);

  // stage.on("click", clickBackground);
  watch(
    () => appStore.tool,
    () => {
      shape?.off("click", clickArea);
      // stage.off("click", clickBackground);
      appStore.isEdit = false;
    }
  );
};
