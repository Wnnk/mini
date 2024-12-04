import Konva from "konva";
import { useAppStore } from "../../store/app"
import { ref, watch } from "vue";
import { hsvToHex } from "../../utils/color";


export const usePencil = (stage:Konva.Stage) => {
  const appStore = useAppStore();
  
  if (appStore.tool !== "pencil") return;
  const layer = new Konva.Layer();
  stage.add(layer);
  const isDrawing = ref(false);
  
  let line: Konva.Line | null = null;
  const startDraw = () => {
    if (isDrawing.value) return;
    isDrawing.value = true;
    const { x, y } = appStore.info;
    line = new Konva.Line({
      stroke: hsvToHex(appStore.hsv.h, appStore.hsv.s, appStore.hsv.v),
      strokeWidth: 2,
      globalCompositeOperation: "source-over",
      points: [x, y],
    })
    layer.add(line);
  }

  const draw = () => {
    if (!isDrawing.value || line === null) return;
    const { x, y } = appStore.info;
    const newPoints = line.points().concat([x, y]);
    line.points(newPoints);
    layer.batchDraw();
    // stage.add(layer);
  }

  const endDraw = () => {
    isDrawing.value = false;
  }

 
    
  stage.on("mousedown", startDraw);
  stage.on("mousemove", draw);
  stage.on("mouseup", endDraw);
  stage.on("mouseleave", endDraw);


  watch(() => [appStore.tool], () => {
    stage.off("mousedown", startDraw);
    stage.off("mousemove", draw);
    stage.off("mouseup", endDraw);
    stage.off("mouseleave", endDraw);
  });


}