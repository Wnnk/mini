import { useAppStore } from "../../store/app";
import {watch } from "vue";
import Konva from "konva";

export const useCrop = (stage: Konva.Stage, layer: Konva.Layer) => {
  const appStore = useAppStore();
  if (appStore.tool !== "crop") return;
  let isMouseDown = false;
  let transformer = <Konva.Transformer | null>null;
  let rect = <Konva.Rect | null>null;


  

  const mouseDown = () => {
    if (isMouseDown) return;
    isMouseDown = true;
    const {x ,y} = appStore.info;
    rect = new Konva.Rect({
      x,
      y,
      width: 50,
      height: 100,
      fill: "transparent",
      stroke: "black",
      strokeWidth: 5,
      strokeScaleEnabled: false,
    });
    const group = new Konva.Group();
    group.add(rect);

    transformer = new Konva.Transformer({
      lineCap: "round",
      anchorStroke: `black`,
      anchorSize: 8,
      borderStroke: `black`,
      borderStrokeWidth: 1,
      anchorCornerRadius: 5,
      ignoreStroke: true,
   
    })
    transformer.nodes([group]);
    transformer.on('transform', () => {
     
    })

    layer.add(group);
    layer.add(transformer);
    layer.draw();
  };


  stage.on("mousedown", mouseDown);


  watch(
    () => appStore.tool,
    () => {
      stage.off("mousedown", mouseDown);
    }
  )
}