import Konva from "konva";
import { useAppStore } from "../store/app";
export const selectTarget = (layer: Konva.Layer, className: string) => {
  const target = layer.findOne(`.${className}`);
  if (!target) return;
  const appStore = useAppStore();
  if (appStore.activeTransform) {
    appStore.activeTransform.destroy();
    appStore.activeTransform = null;
  }
  appStore.activeTransform = new Konva.Transformer({});
  appStore.activeTransform.nodes([target]);
  layer.add(appStore.activeTransform as Konva.Transformer);
  layer.draw();
  return;
};
