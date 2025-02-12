import Konva from "konva";
import { useAppStore } from "../store/app";

export const wheelScale = (
  stage: Konva.Stage,
  event: Konva.KonvaEventObject<WheelEvent>
) => {
  const appStore = useAppStore();
  event.evt.preventDefault();
  let oldScale = stage.scaleX();
  let pointer = stage.getPointerPosition();
  if(!pointer) return;
  let mousePointTo = {
    x: (pointer.x - stage.x()) / oldScale,
    y: (pointer.y - stage.y()) / oldScale,
  };
  let direction = event.evt.deltaY > 0 ? 1 : -1;

  if(event.evt.ctrlKey){
    direction = -direction;
  }

  let newScale = direction > 0 ? oldScale * appStore.step : oldScale / appStore.step;
  stage.scale({ x: newScale, y: newScale });
  let newPos = {
    x: pointer.x - mousePointTo.x * newScale,
    y: pointer.y - mousePointTo.y * newScale,
  };
  stage.position(newPos);
  return;
};


