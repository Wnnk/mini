import Konva from "konva";
import { useAppStore } from "../../store/app";
import { watch } from "vue";

export const useSelect = (stage: Konva.Stage, layer: Konva.Layer) => {
  const appStore = useAppStore();
  if (appStore.tool !== "select") return;
  let selected = <number | null>null;
  let transformer: Konva.Transformer | null = null;
  let isMouseDown = false;

  for (const item of layer.children) {
    item.on("click", () => {
      if (item._id !== selected) {
        if (transformer) {
          transformer.nodes([]);
        } else {
          transformer = new Konva.Transformer();
          layer.add(transformer);
        }
        selected = item._id;
        transformer.nodes([item]);
        isMouseDown = true;
        layer.draw();
      }
    });
  }

  const mousedMove = () => {
    if (selected === null || isMouseDown === false) return;
    const target = layer.findOne((node: any) => node._id === selected);
    if (!target) return;
    target?.draggable(true);
    transformer?.nodes([target]);
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

  document.addEventListener("mousemove", mousedMove);
  document.addEventListener("mouseup", mouseUp);

  watch(
    () => appStore.tool,
    () => {
      transformer?.nodes([]);
      selected = null;
      for (const item of layer.children) {
        item.off("click");
      }
      document.removeEventListener("mousemove", mousedMove);
      document.removeEventListener("mouseup", mouseUp);
      clearListen();
    }
  );
};
