import { useAppStore } from "../../store/app";
import { watch } from "vue";
import Konva from "konva";

export const useCrop = (stage: Konva.Stage, layer: Konva.Layer) => {
  const appStore = useAppStore();
  if (appStore.tool !== "crop") return;
  let isMouseDown = false;
  let transformer = <Konva.Transformer | null>null;
  let transformerGroup = <Konva.Group | null>null;
  let rextWidth = 5;
  let rextHeight = 10;
  const mouseDown = () => {
    if (isMouseDown) return;
    /* 清除上一个clip框 */
    if (transformer) {
      transformer.destroy();
      transformer = null;
    }
    isMouseDown = true;
    const { x, y } = appStore.info;
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
    transformer.on("transformend", () => {
      clipArea();
      transformer!.destroy();
      transformerGroup!.destroy();
      transformer = null;
      transformerGroup = null;
    });
    layer.add(transformerGroup);
    layer.add(transformer);
    layer.draw();
    console.log(transformer, transformerGroup, layer);
  };

  const clipArea = () => {
    if (!transformerGroup) return;
    const { x, y, width, height } = transformerGroup.getClientRect();

    layer.clip({
      x: x,
      y: y,
      width: width,
      height: height,
    });
    appStore.canvas.width = width;
    appStore.canvas.height = height;
    stage.width(width);
    stage.height(height);
    stage.offset({ x, y });
    isMouseDown = false;
  };

  stage.on("mousedown", mouseDown);

  watch(
    () => appStore.tool,
    () => {
      stage.off("mousedown", mouseDown);
    }
  );
};
