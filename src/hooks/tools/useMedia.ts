import Konva from "konva";
import { useAppStore } from "../../store/app";

export const useMedia = (state: Konva.Stage, layer: Konva.Layer) => {
  const appStore = useAppStore();
  if (appStore.tool !== "media") return;
  let transformer = new Konva.Transformer();
  const createImage = () => {
    if (appStore.isEdit || !appStore.file) return;
    const { x, y } = appStore.info;
    const img = new Image();
    img.src = URL.createObjectURL(appStore.file);
    img.onload = () => {
      const image = new Konva.Image({
        x: x,
        y: y,
        image: img,
        width: 200,
        height: 200,
        draggable: true,
        name: `image_${Math.floor(Math.random() * 10000)}`,
      });
      layer.add(image);
      layer.batchDraw();
      appStore.isEdit = true;

      image.on("click", (e) => {
        e.cancelBubble = true;
        editImage(image);
      });
    };
  };

  const editImage = (target: Konva.Image) => {
    if (!appStore.isEdit) return;
    layer.add(transformer);
    transformer.nodes([target]);
    layer.draw();
  };

  state.on("click", () => {
    if (appStore.isEdit) {
      transformer.destroy();
      appStore.isEdit = false;
      appStore.file = null;
    } else {
      createImage();
    }
  });
  // document.addEventListener("mousedown", createImage)
};
