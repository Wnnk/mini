import Konva from "konva";
import { useAppStore } from "../../store/app";
import { watch, ref } from "vue";


export const useLasso = (stage: Konva.Stage, layer: Konva.Layer) => {
  const appStore = useAppStore();
  if (appStore.tool !== "lasso") return;
  appStore.isEdit = true;
  let line: Konva.Line | null = null; 
  let isDrawing = ref(false);
  const mousedown = () => {
    if (isDrawing.value) return;
    isDrawing.value = true;
    const {x , y} = appStore.info;
    line = new Konva.Line({
      points: [x, y],
      stroke: "black",
      strokeWidth: 1,
    })
    layer.add(line);
  }

  const mousemove = () => {
    if (line === null || !isDrawing.value) return;
    const {x , y} = appStore.info;
    // line.points([line.points()[0], x, y, y]);
    const newPoints = line.points().concat([x, y]);
    line.points(newPoints);
    layer.batchDraw();
  }

  const mouseup = () => {
    if (line === null || !isDrawing.value) return;
    isDrawing.value = false;
    const {x , y} = appStore.info;
    const len = line.points().length;
    const points = line.points();
     /* 非闭合选区 转换成闭合选区 */
    if (points[0] !== points[len - 2] || points[1] !== points[len - 1]) {
      points.push(points[0], points[1]);
      line.points(points);
    }
    line.dash([5, 5]);
    layer.add(line);
    createShape(line);

  }


  /** 
   * @description: 创建选区并储存到store中
   * @param {Konva.Line} line 
    */
  const createShape = (line: Konva.Line) => {
    if (line === null) return;
    const points = line.points();
    const shape = new Konva.Shape({
      sceneFunc: (ctx: any, shape: any) => {
        ctx.beginPath();
        ctx.moveTo(points[0], points[1]);
        for (let i = 2; i < points.length; i += 2) {
          ctx.lineTo(points[i], points[i + 1]);
        }
        ctx.closePath();
        ctx.fillStrokeShape(shape);
      },
      dash: [5, 5],
      stroke: "black",
      strokeWidth: 1,
    });
    appStore.selectArea = shape;
    line.destroy();
    layer.add(shape);
    layer.draw();
  }

  /** 
   * @description: 清除选区
    */
  const clearArea = (e:KeyboardEvent) => {
    if (line === null || e.key !== "Escape") return;
    line.destroy();
    line = null;
    appStore.selectArea = null;
    layer.draw();
  }



  stage.on("mousedown", mousedown);
  stage.on("mousemove", mousemove);
  stage.on("mouseup", mouseup);
  document.addEventListener("keydown", clearArea);

  watch(
    () => appStore.tool,
    () => {
      stage.off("mousedown", mousedown);
      stage.off("mousemove", mousemove);
      stage.off("mouseup", mouseup);
      document.removeEventListener("keydown",clearArea);
      line = null;
      isDrawing.value = false;
      appStore.isEdit = false;
    }
  )

}