import Konva from "konva";
import { useAppStore } from "../../store/app";
import { watch } from "vue";
import { rgbToHsv } from "../../utils/color";

export const usePickColor = (stage: Konva.Stage, layer: Konva.Layer) => {
  const appStore = useAppStore();
  if (appStore.tool !== "pick_color") return;

  const getColor = () => {
    const pos = stage.getPointerPosition();
    if (!pos) return;
    const x= pos.x; 
    const y = pos.y
    const pixel = layer.getContext().getImageData(x, y, 1, 1).data;
    if (pixel) {
      // const color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
      appStore.hsv = rgbToHsv(pixel[0], pixel[1], pixel[2]);
    }
  };

  document.addEventListener("click", getColor);

  watch(
    () => appStore.tool,
    () => {
      document.removeEventListener("click", getColor);
    }
  );
};
