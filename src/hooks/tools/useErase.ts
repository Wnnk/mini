import Konva from "konva";
import { useAppStore } from "../../store/app";
import { watch } from "vue";



export const useErase = (stage: Konva.Stage, layer: Konva.Layer) => {
  const appStore = useAppStore();
  if(appStore.tool !== "erase") return;
  let isErase = false;
  let p1 = null as { x: number; y: number } | null;
  let currentLine: Konva.Line | null = null;

  const mousedown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    isErase = true;
    p1 = {
      x: e.evt.offsetX,
      y: e.evt.offsetY,
    };
    currentLine = new Konva.Line({
      points: [p1.x, p1.y],
      stroke: 'white', // 设置擦除颜色为白色
      strokeWidth: 15,
      lineCap: 'round',
      lineJoin: 'round',
      globalCompositeOperation: 'destination-out', // 设置合成操作为擦除
    });
    layer.add(currentLine);
    layer.batchDraw();
  };

  const mousemove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isErase || !p1 || !currentLine) return;
    let p2 = {
      x: e.evt.offsetX,
      y: e.evt.offsetY,
    };
    currentLine.points([...currentLine.points(), p2.x, p2.y]);
    p1 = p2;
    layer.batchDraw();
  };

  const mouseup = () => {
    isErase = false;
    p1 = null;
    currentLine = null;
  };

  stage.on("mousedown", mousedown);
  stage.on("mousemove", mousemove);
  stage.on("mouseup", mouseup);

  watch(
    () => appStore.tool,
    (newTool) => {
      if (newTool !== "erase") {
        stage.off("mousedown", mousedown);
        stage.off("mousemove", mousemove);
        stage.off("mouseup", mouseup);
        isErase = false;
        p1 = null;
        currentLine = null;
      }
    }
  );
};