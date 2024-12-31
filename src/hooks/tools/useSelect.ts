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
          appStore.activeTransform = new Konva.Transformer();
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
    const target = layer.findOne((node: any) => node._id === selected);
    if (!target) return;
    target?.draggable(true);
    appStore.activeTransform?.nodes([target]);
    layer.draw();
  };

  const mouseUp = () => {
    isMouseDown = false;
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

  document.addEventListener("mousemove", mousedMove);
  document.addEventListener("mouseup", mouseUp);
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
      document.removeEventListener("mousemove", mousedMove);
      document.removeEventListener("mouseup", mouseUp);
      stage.off("click", stageClick);
      clearListen();
    }
  );
};
