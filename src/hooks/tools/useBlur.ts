import Konva from "konva";
import { useAppStore } from "../../store/app";
import { watch } from "vue";
import { gaussBlur } from "../gaussBlur";

export const useBlur = (stage: Konva.Stage, layer: Konva.Layer) => {
  const appStore = useAppStore();
  if (appStore.tool !== "blur") return;
  let isDrawing = false;
  let activeImage: Konva.Image | null = null;
  let imageData: ImageData | null = null;
  // const image = new Image();
  // image.src = "src/assets/test.png";
  // image.onload = () => {
  //   const img = new Konva.Image({
  //     x: 0,
  //     y: 0,
  //     image: image,
  //     width: 300,
  //     height: 300,
  //   });
  //   layer.add(img);
  //   layer.draw();

  layer.children.forEach((child) => {
    if (!(child instanceof Konva.Image)) return;
    child.on("mousedown", (event) => {
      event.cancelBubble = true;
      isDrawing = true;
      activeImage = child;
      imageData = child
        .getLayer()!
        .getContext()
        .getImageData(child.x(), child.y(), child.width(), child.height());
      activeImage.on("mousemove", mousemove);
      activeImage.on("mouseup", mouseup);
      gaussBlur(activeImage, imageData, 10, 10);
    });
  });
  // };

  const mousemove = () => {
    if (!isDrawing) return;
    if (!activeImage) return;
    if (!imageData) return;
    gaussBlur(activeImage, imageData, 10, 10);
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
