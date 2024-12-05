import { usePencil } from "./usePencil";
import { useAppStore } from "../../store/app";
import { useText } from "./useText";
import { useSelect } from "./useSelect";
import { useSelection } from "./useSelection";
import Konva from "konva";

export const useTools = (stage:Konva.Stage,layer:Konva.Layer) => {
  const tool = useAppStore().tool;
  switch (tool) {
    case "select":
      return useSelect(stage,layer);
    case "selection":
      return useSelection(stage,layer);
    case "pencil":
      console.log("Using pencil tool");
      return usePencil(stage,layer);
    case "text":
     return useText(stage,layer);
    default:
      console.log("No tool selected");
      return null;
  }

}