import Konva from "konva";
import { useAppStore } from "../../store/app"
import { ref, watch } from "vue";
import { hsvToHex } from "../../utils/color";


export const usePencil = (stage:Konva.Stage,layer:Konva.Layer) => {
  const appStore = useAppStore();
  
  if (appStore.tool !== "pencil") return;

  const isDrawing = ref(false);
  
  let line: Konva.Line | null = null;
  const startDraw = () => {
    if (isDrawing.value) return;
    isDrawing.value = true;
    // const pos = stage.getPointerPosition();
    // if (!pos) return;
    // const x= pos.x; 
    // const y = pos.y
    const {x, y} = appStore.info
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
    const pos = stage.getPointerPosition();
    if (!pos) return;
    const x= pos.x; 
    const y = pos.y
    const newPoints = line.points().concat([x, y]);
    line.points(newPoints);
    layer.batchDraw();
  }

  const endDraw = () => {
    isDrawing.value = false;
  }

 
    
  // stage.on("mousedown", startDraw);
  // stage.on("mousemove", draw);
  // stage.on("mouseup", endDraw);
  // stage.on("mouseleave", endDraw);
  document.addEventListener("mousedown", startDraw);
  document.addEventListener("mousemove", draw);
  document.addEventListener("mouseup", endDraw);
  document.addEventListener("mouseleave", endDraw);


  watch(() => [appStore.tool], () => {
  document.removeEventListener("mousedown", startDraw);
  document.removeEventListener("mousemove", draw);
  document.removeEventListener("mouseup", endDraw);
  document.removeEventListener("mouseleave", endDraw);
  });


}