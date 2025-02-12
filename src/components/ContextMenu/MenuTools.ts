import Konva from "konva"
import { useAppStore } from "../../store/app";
export const resetStage = () => {
  const appStore = useAppStore();
  const stage = appStore.canvas.stage;
  if(!stage) throw new Error("Stage is not defined");
  stage.scale({ x: 1, y: 1 });
  stage.position({ x: 0, y: 0 });
  stage.batchDraw();
}