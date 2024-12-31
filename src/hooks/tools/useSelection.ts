import Konva from "konva";
import { useAppStore } from "../../store/app";
import { watch } from "vue";

export const useSelection = (stage: Konva.Stage, layer: Konva.Layer) => {
  const appStore = useAppStore();
  if (appStore.tool !== "selection") return;
  let selectedList: any[] = [];
  let isSelect = false;
  let selectionBox = new Konva.Line({
    stroke: "black",
    strokeWidth: 2,
    dash: [10, 5],
    draggable: false,
    closed: true,
    visible: true,
  });
  // let transformer = <Konva.Transformer | null>null;
  layer.add(selectionBox);
  const mouseDown = () => {
    if (isSelect) return;
    if (appStore.activeTransform) return;
    isSelect = true;
    const pos = stage.getPointerPosition()!;
    selectionBox.visible(true);
    selectionBox.setAttr("points", [pos.x, pos.y]);
    appStore.isEdit = true;
  };

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
    selectionBox.setAttr("points", points);
    layer.draw();
  };

  const mouseUp = () => {
    if (!isSelect) return;
    isSelect = false;
    selectedList = [];
    const points = selectionBox.points();
    const box = {
      x: Math.min(points[0], points[4]),
      y: Math.min(points[1], points[5]),
      width: Math.abs(points[0] - points[4]),
      height: Math.abs(points[1] - points[5]),
    };
    selectionBox.remove();
    layer.children.forEach((child) => {
      const childBox = child.getClientRect();
      if (
        childBox.x < box.x + box.width &&
        childBox.x + childBox.width > box.x &&
        childBox.y < box.y + box.height &&
        childBox.y + childBox.height > box.y
      ) {
        selectedList.push(child);
      }
    });
    createGroup();
  };

  const createGroup = () => {
    if (selectedList.length === 0) return;
    const group = new Konva.Group({
      x: selectionBox.x(),
      y: selectionBox.y(),
    });
    for (const child of selectedList) {
      group.add(child);
    }
    if (appStore.activeTransform) {
      appStore.activeTransform.destroy();
    }

    appStore.activeTransform = new Konva.Transformer({
      anchorSize: 10,
      borderStroke: "black",
      // borderDash: [3, 3],
    });

    appStore.activeTransform.nodes([group]);
    layer.add(appStore.activeTransform as Konva.Transformer);
    layer.add(group);
    // appStore.tool = "";
  };

  stage.on("mousedown", mouseDown);
  stage.on("mousemove", mouseMove);
  stage.on("mouseup", mouseUp);
  stage.on("mouseleave", mouseUp);

  watch(
    () => appStore.tool,
    () => {
      stage.off("mousedown", mouseDown);
      stage.off("mousemove", mouseMove);
      stage.off("mouseup", mouseUp);
      stage.off("mouseleave", mouseUp);
      appStore.activeTransform?.destroy();
      appStore.isEdit = false;
    }
  );
};
