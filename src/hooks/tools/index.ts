import { usePencil } from "./usePencil";
import { useAppStore } from "../../store/app";
import { useText } from "./useText";
import Konva from "konva";

export const useTools = (stage:Konva.Stage,layer:Konva.Layer) => {
  const tool = useAppStore().tool;
  switch (tool) {
    case "pencil":
      console.log("Using pencil tool");
      return usePencil(stage);
    case "text":
     return useText(stage);
    default:
      console.log("No tool selected");
      return null;
  }

}