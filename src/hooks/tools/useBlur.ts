import Konva from "konva";
import { useAppStore } from "../../store/app";
import { watch } from "vue";
import { gaussBlur } from "../gaussBlur";
import { blur } from "../blur";

export const useBlur = (stage: Konva.Stage, layer: Konva.Layer) => {
  const appStore = useAppStore();
  if (appStore.tool !== "blur") return;
  let isDrawing = false;
  let activeImage: Konva.Image | null = null;
  let imageData: ImageData | null = null;

  layer.children.forEach((child) => {
    if (!(child instanceof Konva.Image)) return;
    child.on("mousedown", (event) => {
      event.cancelBubble = true;
      isDrawing = true;
      activeImage = child;
      activeImage.draggable(false);
      const context = child.getLayer()!.getContext();
      imageData = context.getImageData(
        child.x(),
        child.y(),
        child.width(),
        child.height()
      );
      activeImage.on("mousemove", mousemove);
      activeImage.on("mouseup", mouseup);
      const blurredData = gaussBlur(activeImage, imageData, 5, 2)!;
      context.putImageData(blurredData, child.x(), child.y());
    });
  });

  const mousemove = () => {
    if (!isDrawing) return;
    if (!activeImage) return;
    if (!imageData) return;
    const blurredData = gaussBlur(activeImage, imageData, 5, 5);

    const context = activeImage.getLayer()!.getContext();
    if (!blurredData) return;
    // context.putImageData(blurredData, activeImage.x(), activeImage.y());
  };

  const mouseup = () => {
    isDrawing = false;
  };

  const cancelListener = () => {
    isDrawing = false;
    activeImage = null;
    layer.children.forEach((child) => {
      if (!(child instanceof Konva.Image)) return;
      child.off("mousedown");
      child.off("mousemove", mousemove);
      child.off("mouseup", mouseup);
    });
  };

  watch(
    () => appStore.tool,
    () => {
      cancelListener();
    }
  );
};
