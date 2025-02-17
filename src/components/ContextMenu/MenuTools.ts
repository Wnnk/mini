import Konva from "konva"
import { useAppStore } from "../../store/app";
import { useSelect } from "../../hooks/tools/useSelect";
export const resetStage = () => {
  const appStore = useAppStore();
  const stage = appStore.canvas.stage;
  if(!stage) throw new Error("Stage is not defined");
  stage.scale({ x: 1, y: 1 });
  stage.position({ x: 0, y: 0 });
  stage.batchDraw();
}


export const unGroup = () => {
  const appStore = useAppStore();
  const el = appStore.currentElementInfos;
  if(!el) throw new Error("Element is not selected");
  const id = el.id;
  const layer = appStore.canvas.layer;
  if(!layer) return;
  const target = layer.findOne((child:Konva.Node) => {
    return child._id === id;
  });
  if(!target) return;
  if(target.getType() !== "Group") return;
  const group = target as Konva.Group;
  const nodes = group.getChildren();
  for (const node of nodes) {
    layer.add(node);
  }
  layer.find("Transformer").forEach((transformer:any) => {
    transformer.destroy();
  });
  layer.batchDraw();
}