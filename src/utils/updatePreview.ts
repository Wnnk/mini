import { useAppStore } from "../store/app";
import Konva from "konva";

export const updatePreview = () => {
  const appStore = useAppStore();
  const layer = appStore.canvas.layer;
  const previewLayer = appStore.canvas.previewLayer;
  const previewStage = appStore.canvas.previewStage;
  if (!layer || !previewLayer || !previewStage) return;
  /* 更新预览层 */
  previewLayer.destroy();
  appStore.canvas.previewLayer = layer.clone({ listening: false });
  const scaleX = 176 / appStore.canvas.width;
  const scaleY = 176 / appStore.canvas.height;
  const scale = Math.min(scaleX, scaleY);
  appStore.canvas.previewLayer.scale({ x: scale, y: scale });
  appStore.canvas.previewStage!.add(
    appStore.canvas.previewLayer as Konva.Layer
  );
};