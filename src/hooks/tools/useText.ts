import { h, watch } from "vue";
import { useAppStore } from "../../store/app";
import Konva from "konva";
import { hsvToHex } from "../../utils/color";
import { KonvaEventObject } from "konva/lib/Node";

export function useText(stage: Konva.Stage, layer: Konva.Layer) {
  const appStore = useAppStore();
  if (appStore.tool !== "text") return;
  let currentText = "";
  let currentIndex = 0;
  let text: Konva.Text | null = null;
  let textarea: HTMLTextAreaElement | null = null;

  /**
   * @description 创建编辑区域
   */
  const createeditArea = (event: KonvaEventObject<MouseEvent, Konva.Stage>) => {
    const pos = stage.getPointerPosition();
    if (!pos) return;
    const x = pos.x;
    const y = pos.y;
    /* 清除上一次的编辑 */
    if (appStore.activeTransform && textarea) {
      enterEvent();
    }
    currentText = "";
    currentIndex = 0;
    text = new Konva.Text({
      x: x,
      y: y,
      text: currentText,
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

    /* 使用textarea记录输入文本,实现支持中文输入 */

    textarea = document.createElement("textarea");
    // textarea.type = "text";
    textarea.style.position = "absolute";
    textarea.style.left = `${event.evt.pageX}px`;
    textarea.style.top = `${event.evt.pageY}px`;
    textarea.style.fontSize = `${text.fontSize()}px`;
    textarea.style.fontFamily = `${text.fontFamily()}`;
    textarea.style.color = `${text.fill()}`;
    textarea.style.padding = "0";
    textarea.style.borderRadius = "0";
    textarea.style.backgroundColor = "transparent";
    textarea.style.border = "none";
    textarea.style.opacity = "0"; // 隐藏输入框
    textarea.style.zIndex = "-1";
    textarea.style.whiteSpace = "normal"; // 允许换行
    textarea.id = `${text._id}`;
    document.body.appendChild(textarea);
    requestAnimationFrame(() => {
      textarea!.focus();
    });
    textarea.addEventListener("keyup", updateText);
    text.on("click", selectText);

    appStore.isEdit = true;
  };

  /**
   * @description： 选定文本编辑，确定插入的位置index
   * @param {Konva.Text} text 被选中的文本
   **/
  const getInsertIndex = (text: Konva.Text) => {
    /* 创建透明文本 */
    const tempText = new Konva.Text({
      x: text.x(),
      y: text.y(),
      text: "",
      fontSize: text.fontSize(),
      fontFamily: text.fontFamily(),
      fill: "transparent",
    });
    /* 获取鼠标位置 */
    const pos = stage.getPointerPosition();
    if (!pos) return -1;

    /* 计算插入位置 */
    const lines = currentText.split("\n");
    const lineHeight = text.fontSize();
    const width = (line: string) => tempText.text(line).width();
    /* 当前行的y坐标 */
    let index = 0;
    for (let i = 0; i < lines.length; i++) {
      let currentHeight = i * lineHeight + text.y();
      /* 找到当前行 */
      if (pos.y > currentHeight && pos.y < currentHeight + lineHeight) {
        for (let j = 0; j < lines[i].length; j++) {
          const currentWidth = text.x() + width(lines[i].slice(0, j));
          if (
            pos.x > currentWidth &&
            pos.x < currentWidth + width(lines[i][j])
          ) {
            /* 计算index */
            index += j;
            return index;
          }
        }
      }
      index += lines[i].length + 1;
    }

    tempText.destroy();
    layer.draw();
    return -1;
  };

  /**
   * @description 选定文本编辑
   **/
  const selectText = (e: KonvaEventObject<MouseEvent, Konva.Text>) => {
    /* 清除上一次的编辑 */
    if (appStore.activeTransform && textarea) {
      enterEvent();
    }
    e.cancelBubble = true;
    textarea = document.getElementById(
      `${e.target._id}`
    ) as HTMLTextAreaElement;
    text = layer.children.find(
      (child) => child._id === e.target._id
    ) as Konva.Text;

    currentText = text.attrs.text;
    textarea.value = currentText;
    appStore.activeTransform = new Konva.Transformer({
      anchorSize: 10,
      borderStroke: "black",
      borderDash: [3, 3],
    });
    layer.add(appStore.activeTransform as Konva.Transformer);
    appStore.activeTransform.nodes([text]);
    currentIndex = getInsertIndex(text);
    layer.draw();
    requestAnimationFrame(() => {
      textarea!.focus();
    });
  };

  /* @description 更新文本 */
  const updateText = (e: KeyboardEvent) => {
    if (!text) return;
    /* 检测是否中文输入法输入 */
    if (e.isComposing) return;
    if (e.key === "Backspace") {
      if (currentIndex > 0) {
        currentText =
          currentText.slice(0, currentIndex - 1) +
          currentText.slice(currentIndex);
        currentIndex--;
        text.text(currentText);
      }
      return;
    }
    if (currentIndex === currentText.length) {
      /* 最后插入 */
      const target = e.target as HTMLTextAreaElement;
      const insertVal = target.value.slice(currentIndex);
      currentText += insertVal;
      currentIndex = currentText.length;
      text.text(currentText);
    } else {
      /* 非最后插入 */
      const target = e.target as HTMLTextAreaElement;
      const start = currentText.slice(0, currentIndex + 1);
      const insertVal = target.value.slice(target.value.length - 1);
      const end = currentText.slice(currentIndex + 1);

      currentText = start + insertVal + end;
      console.log(start, insertVal, end, currentText);
      currentIndex++;
      text.text(currentText);
    }

    layer.draw();
  };

  /* @description 编辑结束 */
  const enterEvent = () => {
    if (!appStore.activeTransform) return;
    // if (!textarea) return;
    appStore.isEdit = false;
    // textarea.remove();
    appStore.activeTransform.destroy();
    layer.draw();
  };

  /**
   * @description 监听键盘事件
   */
  const keyDownListenter = (e: KeyboardEvent) => {
    if (!text) return;

    if (e.key === "Escape") {
      currentText = ""; // 按下ESC清空输入
      text.text("   "); // 重置文本
      layer.draw();
    }
  };

  document.addEventListener("keyup", keyDownListenter);
  stage.on("click", createeditArea);

  watch(
    () => appStore.tool,
    () => {
      enterEvent();
      document.removeEventListener("keydown", keyDownListenter);
      if (textarea) {
        textarea.removeEventListener("keydown", updateText);
      }
      stage.off("click", createeditArea);
    }
  );
}
