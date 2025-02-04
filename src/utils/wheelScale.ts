import Konva from "konva";
import { useAppStore } from "../store/app";
export const wheelScale = (
  stage: Konva.Stage,
  event: Konva.KonvaEventObject<WheelEvent>
) => {
  const appStore = useAppStore();
  event.evt.preventDefault();
  const maxWidth = document.getElementById("main_wrapper")!.clientWidth;
  const maxHeight = document.getElementById("main_wrapper")!.clientHeight;
  const oldScaleX = stage.scaleX();
  const oldScaleY = stage.scaleY();

  if (event.evt.deltaY < 0) {
    if (
      appStore.wrapperStyle.width < maxWidth &&
      appStore.wrapperStyle.height < maxHeight
    ) {
      appStore.wrapperStyle.width = appStore.wrapperStyle.width * appStore.step;
      appStore.wrapperStyle.height =
        appStore.wrapperStyle.height * appStore.step;
      const newScaleX = oldScaleX * appStore.step;
      const newScaleY = oldScaleY * appStore.step;

      stage.scale({
        x: newScaleX,
        y: newScaleY,
      });

      return;
    }
  } else {
    if (
      appStore.wrapperStyle.width > appStore.canvas.width &&
      appStore.wrapperStyle.height > appStore.canvas.height
    ) {
      appStore.wrapperStyle.width = appStore.wrapperStyle.width / appStore.step;

      appStore.wrapperStyle.height =
        appStore.wrapperStyle.height / appStore.step;

      const newScaleX = oldScaleX / appStore.step;
      const newScaleY = oldScaleY / appStore.step;

      stage.scale({
        x: newScaleX,
        y: newScaleY,
      });
      return;
    }
  }
};
