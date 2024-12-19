import Konva from "konva";
import { useAppStore } from "../../store/app";
import { hsvToHex } from "../../utils/color";
import { watch } from "vue";


export const useShape = (stage: Konva.Stage, layer: Konva.Layer) => {
  const appStore = useAppStore();
  let shape: any = null;
  let transformer: Konva.Transformer | null = null;
  const createRectangle = (x: number, y: number, width: number, height: number) => {
    return new Konva.Rect({
      x,
      y,
      width,
      height,
      stroke: hsvToHex(appStore.hsv.h, appStore.hsv.s, appStore.hsv.v),
      strokeWidth: 1,
      draggable: true,
    })
  }

  const createCircle = (x: number, y: number, radius: number) => {
    return new Konva.Circle({
      x,
      y,
      radius,
      stroke: hsvToHex(appStore.hsv.h, appStore.hsv.s, appStore.hsv.v),
      strokeWidth: 1,
      draggable: true,
    })
  }

  const createTriangle = (x: number, y: number, width: number, height: number) => {
    return new Konva.Line({
      points: [x,y, x - width /2, y + height, x + width /2, y + height],
      stroke: hsvToHex(appStore.hsv.h, appStore.hsv.s, appStore.hsv.v),
      strokeWidth: 1,
      closed: true,
      draggable: true,
    })
  }
  const createIsoscelesTriangle = (x: number, y: number, width: number, height: number) => {
    return new Konva.Line({
      points: [x,y, x, y - height, x + width, y],
      stroke: hsvToHex(appStore.hsv.h, appStore.hsv.s, appStore.hsv.v),
      strokeWidth: 1,
      closed: true,
      draggable: true,
    })
  }


  const transformShape = (shape: any) => {
    transformer = new Konva.Transformer()
    transformer.nodes([shape])
    layer.add(transformer);
  }

  const mouseDown = () => {
    /* 清除上一个shape的transformer */
    if (transformer) {
      transformer.destroy();
      transformer = null;
      return;
    }
    /* 没有选定shape */
    if (appStore.shapeType === '')return;
  


    const pos = stage.getPointerPosition();

    if (!pos) return;
    const x = pos.x;
    const y = pos.y;

    const type = appStore.shapeType;
    switch (type) {
      case'rectangle':
        shape = createRectangle(x, y, 100, 100);
        break;
      case 'circle':
        shape = createCircle(x, y, 50);
        break;
      case 'triangle':
        shape = createTriangle(x, y, 100, 100);
        break;
      case 'isosceles-triangle':
        shape = createIsoscelesTriangle(x, y, 100, 100);
        break;
      default:
        break;
    }
    shape.on('click',transformShape(shape))
    layer.add(shape);
    layer.draw();
  }


  stage.on('click', mouseDown)
  

  watch(
    () => appStore.tool,
    () => {
      stage.off('click', mouseDown)
      shape?.off('click',transformShape(shape))
      transformer?.destroy()
      shape = null;
      transformer = null;
    }
  )

};
