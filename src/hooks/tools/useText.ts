import { watch } from "vue";
import { useAppStore } from "../../store/app";
import Konva from "konva";
import { hsvToHex } from "../../utils/color";
import { KonvaEventObject } from "konva/lib/Node";

export function useText(stage: Konva.Stage, layer: Konva.Layer) {
  const appStore = useAppStore();
  if (appStore.tool !== "text") return;
  let currentText = "";
  let text: Konva.Text | null = null;
  let input: HTMLInputElement;
  // let tr: Konva.Transformer;

  /**
   * @description 创建编辑区域
   */
  const createeditArea = () => {
    const pos = stage.getPointerPosition();
    if (!pos) return;
    const x = pos.x;
    const y = pos.y;
    /* 清除上一次的编辑 */
    if (appStore.activeTransform && input) {
      enterEvent();
    }
    text = new Konva.Text({
      x: x,
      y: y,
      text: "   ",
      fontSize: 24,
      fontFamily: "Arial",
      draggable: false,
      fill: `${hsvToHex(appStore.hsv.h, appStore.hsv.s, appStore.hsv.v)}`,
      name: `Text_${Math.floor(Math.random() * 10000)}`,
    });
    layer.add(text);
    appStore.activeTransform = new Konva.Transformer({
      anchorSize: 10,
      borderStroke: "black",
      borderDash: [3, 3],
    });
    layer.add(appStore.activeTransform as Konva.Transformer);
    appStore.activeTransform.nodes([text]);
    layer.draw();

    /* 使用input记录输入文本,实现支持中文输入 */
    input = document.createElement("input");
    input.type = "text";
    input.style.position = "absolute";
    input.style.left = `${x}px`;
    input.style.top = `${y}px`;
    input.style.fontSize = "24px";
    input.style.opacity = "0"; // 隐藏输入框
    input.id = `${text._id}`;
    document.body.appendChild(input);
    requestAnimationFrame(() => {
      input.focus();
    });
    input.addEventListener("input", updateText);
    text.on("click", selectText);

    appStore.isEdit = true;
  };

  /**
   * @description 选定文本编辑
   **/
  const selectText = (e: KonvaEventObject<MouseEvent, Konva.Text>) => {
    /* 清除上一次的编辑 */
    if (appStore.activeTransform && input) {
      enterEvent();
    }
    e.cancelBubble = true;
    input = document.getElementById(`${e.target._id}`) as HTMLInputElement;
    text = layer.children.find(
      (child) => child._id === e.target._id
    ) as Konva.Text;
    console.log(text);
    currentText = text.attrs.text;
    input.value = currentText;
    appStore.activeTransform = new Konva.Transformer({
      anchorSize: 10,
      borderStroke: "black",
      borderDash: [3, 3],
    });
    layer.add(appStore.activeTransform as Konva.Transformer);
    appStore.activeTransform.nodes([text]);
    layer.draw();
    requestAnimationFrame(() => {
      input.focus();
    });
  };

  /* @description 更新文本 */
  const updateText = (e: Event) => {
    if (!text) return;
    currentText = (e.target as HTMLInputElement).value;
    text.text(currentText);
    layer.draw();
  };

  /* @description 编辑结束 */
  const enterEvent = () => {
    if (!appStore.activeTransform) return;
    // if (!input) return;
    appStore.isEdit = false;
    // input.remove();
    appStore.activeTransform.destroy();
    layer.draw();
  };

  /**
   * @description 监听键盘事件
   */
  const keyDownListenter = (e: KeyboardEvent) => {
    if (!text) return;
    if (e.key === "Enter") {
      enterEvent();
    }
    if (e.key === "Escape") {
      currentText = ""; // 按下ESC清空输入
      text.text("   "); // 重置文本
      layer.draw();
    }
    if (e.key === "Backspace") {
      if (currentText.length > 0) {
        currentText = currentText.slice(0, -1);
        text.text(currentText);
        layer.draw();
      }
    }
  };

  document.addEventListener("keydown", keyDownListenter);
  stage.on("click", createeditArea);

  watch(
    () => appStore.tool,
    () => {
      enterEvent();
      document.removeEventListener("keydown", keyDownListenter);
      if (input) {
        input.removeEventListener("input", updateText);
      }
      stage.off("click", createeditArea);
    }
  );
}
