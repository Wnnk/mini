import { useAppStore } from "../store/app";
export const updateElementInfos = (node: any) => {
  const appStore = useAppStore();
  let { x, y, width, height } = node.getClientRect();
  if (x === 0 && y === 0) {
    x = node.x();
    y = node.y();
    width = node.width();
    height = node.height();
  }

  appStore.currentElementInfos = {
    id: node._id,
    x: Math.floor(x),
    y: Math.floor(y),
    width: Math.floor(width),
    height: Math.floor(height),
    rotate: node.rotation(),
    opacity: node.opacity(),
    // fill: node.stroke(),
  };
};
