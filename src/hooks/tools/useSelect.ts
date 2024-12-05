import Konva from "konva";
import { useAppStore } from "../../store/app"
import {watch} from "vue"

export const useSelect = (stage:Konva.Stage, layer:Konva.Layer) => {
  const appStore = useAppStore()
  if (appStore.tool !== "select") return;
  let selected  = <number | null>null;
  let transformer: Konva.Transformer | null = null;

  for (const item of layer.children) {
    item.on("click", () => {
      if (item._id !== selected) {
        if (transformer) {
          transformer.nodes([]);
        } else {
          transformer = new Konva.Transformer();
          layer.add(transformer)
        }
        selected = item._id;
        transformer.nodes([item]);
        layer.draw();
      }
    });
  }


  watch(() => appStore.tool, ()=> {
    transformer?.nodes([])
    selected = null;
    for (const item of layer.children) {
      item.off("click")
    }
  })

}

