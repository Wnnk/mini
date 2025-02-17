import Konva from "konva";
import { useAppStore } from "../store/app";
import { updateElementInfos } from "./getElementInofs";
export const selectTarget = (layer: Konva.Layer, className: string) => {
  const target = layer.findOne(`.${className}`);
  if (!target) return;
  const appStore = useAppStore();

  updateElementInfos(target);
  if (appStore.activeTransform) {
    appStore.activeTransform.destroy();
    appStore.activeTransform = null;
  }
  appStore.activeTransform = new Konva.Transformer({
    name: "transformer",
  });
  appStore.activeTransform.nodes([target]);
  layer.add(appStore.activeTransform as Konva.Transformer);
  layer.draw();

  return;
};
