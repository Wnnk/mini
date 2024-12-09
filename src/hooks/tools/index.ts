import { usePencil } from "./usePencil";
import { useAppStore } from "../../store/app";
import { useText } from "./useText";
import { useSelect } from "./useSelect";
import { useSelection } from "./useSelection";
import Konva from "konva";
import { usePickColor } from "./usePickColor";
import { useMedia } from "./useMedia";
import { test } from "./test";

export const useTools = (stage: Konva.Stage, layer: Konva.Layer) => {
  const tool = useAppStore().tool;
  switch (tool) {
    case "select":
      return useSelect(stage, layer);
    case "selection":
      return useSelection(stage, layer);
    case "pencil":
      return usePencil(stage, layer);
    case "pick_color":
      return usePickColor(stage, layer);
    case "text":
      return useText(stage, layer);
    case "media":
      return useMedia(stage, layer);  
    default:
      test(stage);
      return null;
  }
};
