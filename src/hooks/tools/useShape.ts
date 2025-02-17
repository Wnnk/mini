import Konva from "konva";
import { useAppStore } from "../../store/app";
import { hsvToHex } from "../../utils/color";
import { watch } from "vue";

export const useShape = (stage: Konva.Stage, layer: Konva.Layer) => {
  const appStore = useAppStore();
  let shape: any = null;
  const createRectangle = (
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    return new Konva.Rect({
      x,
      y,
      width,
      height,
      stroke: hsvToHex(appStore.hsv.h, appStore.hsv.s, appStore.hsv.v),
      strokeWidth: 1,
      draggable: true,
      fill: Konva.Util.getRandomColor(),
      name: `Rectangle_${Math.floor(Math.random() * 10000)}`,
    });
  };

  const createCircle = (x: number, y: number, radius: number) => {
    return new Konva.Circle({
      x,
      y,
      radius,
      stroke: hsvToHex(appStore.hsv.h, appStore.hsv.s, appStore.hsv.v),
      strokeWidth: 1,
      draggable: true,
      fill: Konva.Util.getRandomColor(),
      name: `Circle_${Math.floor(Math.random() * 10000)}`,
    });
  };

  const createTriangle = (
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    return new Konva.Line({
      points: [x, y, x - width / 2, y + height, x + width / 2, y + height],
      stroke: hsvToHex(appStore.hsv.h, appStore.hsv.s, appStore.hsv.v),
      strokeWidth: 1,
      closed: true,
      draggable: true,
      fill: Konva.Util.getRandomColor(),
      name: `Triangle_${Math.floor(Math.random() * 10000)}`,
    });
  };
  const createIsoscelesTriangle = (
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    return new Konva.Line({
      points: [x, y, x, y - height, x + width, y],
      stroke: hsvToHex(appStore.hsv.h, appStore.hsv.s, appStore.hsv.v),
      strokeWidth: 1,
      closed: true,
      draggable: true,
      fill: Konva.Util.getRandomColor(),
      name: `IsoscelesTriangle_${Math.floor(Math.random() * 10000)}`,
    });
  };

  const transformShape = (shape: any) => {
    appStore.activeTransform = new Konva.Transformer({
      name: "transformer",
    });
    appStore.activeTransform.nodes([shape]);
    layer.add(appStore.activeTransform as Konva.Transformer);
  };

  const mouseDown = () => {
    /* 清除上一个shape的transformer */
    if (appStore.activeTransform) {
      appStore.activeTransform.destroy();
      appStore.activeTransform = null;
      return;
    }
    /* 没有选定shape */
    if (appStore.shapeType === "") return;

    const pos = stage.getPointerPosition();

    if (!pos) return;
    const x = pos.x;
    const y = pos.y;

    const type = appStore.shapeType;
    switch (type) {
      case "rectangle":
        shape = createRectangle(x, y, 100, 100);
        break;
      case "circle":
        shape = createCircle(x, y, 50);
        break;
      case "triangle":
        shape = createTriangle(x, y, 100, 100);
        break;
      case "isosceles-triangle":
        shape = createIsoscelesTriangle(x, y, 100, 100);
        break;
      default:
        break;
    }
    transformShape(shape);
    layer.add(shape);
    layer.draw();
  };

  stage.on("click", mouseDown);

  watch(
    () => appStore.tool,
    () => {
      if (appStore.activeTransform) {
        layer.find('Transformer').forEach((transformer) => transformer.destroy());
        appStore.activeTransform = null;
        layer.draw();
      }
      stage.off("click", mouseDown);

      shape = null;
 
    }
  );
};
