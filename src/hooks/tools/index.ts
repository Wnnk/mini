import { usePencil } from "./usePencil";
import { useAppStore } from "../../store/app";
import { useText } from "./useText";
import { useSelect } from "./useSelect";
import { useSelection } from "./useSelection";
import Konva from "konva";
import { usePickColor } from "./usePickColor";
import { useErase } from "./useErase";
import { useMedia } from "./useMedia";
import { useFill } from "./useFill";
import { useLasso } from "./useLasso";
import { useCrop } from "./useCrop";
import { useShape } from "./useShape";
import { useBlur } from "./useBlur";
import { useDownload } from "./useDownload";

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
    case "erase":
      return useErase(stage, layer);
    case "fill":
      return useFill(stage, layer);
    case "shape":
      return useShape(stage, layer);
    case "lasso":
      return useLasso(stage, layer);
    case "text":
      return useText(stage, layer);
    case "media":
      return useMedia(stage, layer);
    case "crop":
      return useCrop(stage, layer);
    case "blur":
      return useBlur(stage, layer);
    case "download":
      return useDownload(stage, layer);
    default:
      return null;
  }
};
