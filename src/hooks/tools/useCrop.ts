import { useAppStore } from "../../store/app";
import { h, watch } from "vue";
import Konva from "konva";

export const useCrop = (stage: Konva.Stage, layer: Konva.Layer) => {
  const appStore = useAppStore();
  if (appStore.tool !== "crop") return;
  let isTransforming = false;
  let transformer = <Konva.Transformer | null>null;
  let transformerGroup = <Konva.Group | null>null;
  let rextWidth = 5;
  let rextHeight = 10;
  const mouseDown = () => {
    if(isTransforming) return;
    /* 清除上一个clip框 */
    if (transformer) {
      transformer.destroy();
      transformer = null;
      if (transformerGroup) {
        (transformerGroup as Konva.Group).destroy();
        transformerGroup = null;
      }
    }
    const pos = stage.getPointerPosition();
    if (!pos) {
      return;
    }
    const x= pos.x; 
    const y = pos.y
    transformerGroup = new Konva.Group();
    for (let row = 1; row <= 3; row++) {
      for (let col = 1; col <= 3; col++) {
        const rect = new Konva.Rect({
          x: x + (col - 1) * rextWidth,
          y: y + (row - 1) * rextHeight,
          width: rextWidth,
          height: rextHeight,
          fill: "#b9efb0",
          stroke: "black",
          strokeWidth: 1,
          strokeScaleEnabled: false,
        });
        transformerGroup.add(rect);
      }
    }

    transformer = new Konva.Transformer({
      lineCap: "round",
      anchorStroke: `black`,
      anchorSize: 8,
      borderStroke: `black`,
      borderStrokeWidth: 1,
      anchorCornerRadius: 5,

      keepRatio: false,
      ignoreStroke: true,
    });
    transformer.nodes([transformerGroup]);
    transformer.on("transformstart", () => {
      isTransforming = true;
    })
    transformer.on("transformend", (e) => {
      e.cancelBubble = true;
      clipArea();
      transformer!.destroy();
      transformerGroup!.destroy();
      transformer = null;
      transformerGroup = null;
      isTransforming = false;
    });
    layer.add(transformerGroup);
    layer.add(transformer);
    layer.draw();
  };

  const clipArea = () => {
    if (!transformerGroup) return;
    let { x, y, width, height } = transformerGroup.getClientRect();
    x= Math.max(0, Math.floor(x));
    y = Math.max(0, Math.floor(y));
    width = Math.floor(width);
    height = Math.floor(height);
    appStore.canvas.width =width;
    appStore.canvas.height = height;

    stage.width(width);
    stage.height(height);
    layer.children.forEach((child) => {
      child.x(child.x() - x);
      child.y(child.y() - y);
    });

    layer.draw();

  
  };

  stage.on("mousedown", mouseDown);


  watch(
    () => appStore.tool,
    () => {
      stage.off("mousedown", mouseDown);
    }
  );
};
