import Konva from "konva";
import { useAppStore } from "../../store/app";


export const useFill = (stage: Konva.Stage, layer: Konva.Layer) => {
  const appStore = useAppStore();
  if (appStore.tool !== "fill") return;

  for (const item of layer.children) {
    item.on("click", () => {
      console.log(item);
    });
  }






}