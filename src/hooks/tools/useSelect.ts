import Konva from "konva";
import { useAppStore } from "../../store/app";
import { watch } from "vue";
import { updateElementInfos } from "../getElementInofs";




export const useSelect = (stage: Konva.Stage, layer: Konva.Layer) => {
  const appStore = useAppStore();
  if (appStore.tool !== "select") return;
  let selected = <number | null>null;
  let isMouseDown = false;

  for (const item of layer.children) {
    item.on("click", (event) => {
      event.cancelBubble = true;
      if (item._id !== selected) {
        if (appStore.activeTransform) {
          appStore.activeTransform.nodes([]);
        } else {
          appStore.activeTransform = new Konva.Transformer({
            name: "transformer",
          });
        }
        item.draggable(true);
        selected = item._id;
        appStore.activeTransform.nodes([item]);
        layer.add(appStore.activeTransform as Konva.Transformer);
        isMouseDown = true;
        layer.draw();
        updateElementInfos(item);
      }
    });
  }

  const mousedMove = () => {
    if (selected === null || isMouseDown === false) return;
    const target = layer.findOne((node: Konva.Node) => node._id === selected);
    console.log(target)
    if (!target) return;

    appStore.activeTransform?.nodes([target]);
    drawGuidesLine(target);

    layer.batchDraw();
  };

  const drawGuidesLine = (node:Konva.Node) => {
    layer.find('.guid-line').forEach(node => node.destroy());

    if (!node) return;
    const { x, y } = node.getClientRect();
    const rowGuide = new Konva.Line({
      points: [-6000, y, 6000, y],
      stroke: 'rgb(0, 161, 255)',
      strokeWidth: 1,
      dash: [5, 5],
      name: "guid-line",
    })
    const colGuide = new Konva.Line({
      points: [x, -6000, x, 6000],
      stroke: 'rgb(0, 161, 255)',
      strokeWidth: 1,
      dash: [5, 5],
      name: "guid-line",
    })
    layer.add(rowGuide);
    layer.add(colGuide);
    layer.batchDraw();
  }

  const mouseUp = () => {
    isMouseDown = false;
    layer.find('.guid-line').forEach((node: any) => node.destroy());
    layer.batchDraw();
  };

  const clearListen = () => {
    for (const item of layer.children) {
      item.off("click");
    }
  };

  const stageClick = () => {
    appStore.activeTransform?.destroy();
    appStore.activeTransform = null;
    const target = layer.children.find((item) => {
      return item._id === selected;
    });
    target?.draggable(false);
    selected = null;
    layer.draw();
  };

  // layer.on("dragmove", drawGuidesLine(selected))

  layer.on("dragmove", mousedMove);
  stage.on("mouseup", (e) => {
    mouseUp();
  });
  stage.on("click", stageClick);

  

 



  watch(
    () => appStore.tool,
    () => {
      appStore.activeTransform?.nodes([]);
      selected = null;
      for (const item of layer.children) {
        item.off("click");
        item.draggable(false);
      }
      layer.off("dragmove", mousedMove);
      stage.off("mouseup", mouseUp);
      stage.off("click", stageClick);
      clearListen();
    }
  );


};

