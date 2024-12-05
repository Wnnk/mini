import Konva from "konva";
import { useAppStore } from "../../store/app"
import {watch} from "vue"
import { hexToRgb } from "../../utils/color";


export const useSelection = (stage:Konva.Stage, layer: Konva.Layer) => {
  const appStore = useAppStore()
  if (appStore.tool !== "selection") return;
  let selectedList:any[] = [];
  let isSelect = false;
  let selectionBox = new Konva.Line({
    stroke: "black",
    strokeWidth: 2,
    dash: [10,5],
    draggable: false,
    closed: true,
    visible:true,
  })
  layer.add(selectionBox);
  const mouseDown = () => {
    isSelect = true;
    const pos = stage.getPointerPosition()!;
    selectionBox.visible(true);
    selectionBox.setAttr('points', [pos.x, pos.y]);
  }

  const mouseMove = () => {
    if (!isSelect) return;
    const pos = stage.getPointerPosition()!;
    const points = selectionBox.points();
    points[2] = pos.x;
    points[3] = points[1];
    points[4] = pos.x;
    points[5] = pos.y;
    points[6] = points[0];
    points[7] = pos.y;
    selectionBox.setAttr('points', points);
    layer.draw();
  }

  const mouseUp = () => {
    isSelect = false;
    const box = {
      x: selectionBox.points()[0],
      y: selectionBox.points()[1],
      width: selectionBox.points()[4] - selectionBox.points()[0],
      height: selectionBox.points()[5] - selectionBox.points()[1],
    }

  }



  document.addEventListener('mousedown', mouseDown);
  document.addEventListener('mousemove', mouseMove);
  document.addEventListener('mouseup', mouseUp);
  document.addEventListener('mouseleave', mouseUp);
    
    
}