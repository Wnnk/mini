import Konva from "konva";
import { useAppStore } from "../../store/app";
import { ref, watch } from "vue";
import { hsvToHex } from "../../utils/color";

export const usePencil = (stage: Konva.Stage, layer: Konva.Layer) => {
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
    const { x, y } = appStore.info;
    line = new Konva.Line({
      stroke: hsvToHex(appStore.hsv.h, appStore.hsv.s, appStore.hsv.v),
      strokeWidth: 2,
      globalCompositeOperation: "source-over",
      points: [x, y],
      name: `Pencil_${Math.floor(Math.random() * 10000)}`,
    });
    layer.add(line);
  };

  const draw = () => {
    if (!isDrawing.value || line === null) return;
    const pos = stage.getPointerPosition();
    if (!pos) return;
    const x = pos.x;
    const y = pos.y;
    const newPoints = line.points().concat([x, y]);
    line.points(newPoints);
    layer.batchDraw();
  };

  const endDraw = () => {
    isDrawing.value = false;
  };

  stage.on("mousedown", startDraw);
  stage.on("mousemove", draw);
  stage.on("mouseup", endDraw);
  stage.on("mouseleave", endDraw);

  watch(
    () => [appStore.tool],
    () => {
      stage.off("mousedown", startDraw);
      stage.off("mousemove", draw);
      stage.off("mouseup", endDraw);
      stage.off("mouseleave", endDraw);
    }
  );
};
