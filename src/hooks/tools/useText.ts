import { watch } from "vue"
import { useAppStore } from "../../store/app"
import Konva from "konva"
import { hsvToHex } from "../../utils/color"

/**
 * 创建编辑区域
 * @param node
 */
export function useText(stage: Konva.Stage, layer: Konva.Layer) {
  const appStore = useAppStore()
  const { x, y } = appStore.info

  // stage.add(layer)
  /** 
   * @description 编辑文本区域
   */
  let tr: Konva.Transformer
  const editArea = () => {
    const text = new Konva.Text({
      x: x,
      y: y,
      text: "   ",
      fontSize: 24,
      fontFamily: "Arial",
      draggable: true,
      color: `${hsvToHex(appStore.hsv.h, appStore.hsv.s, appStore.hsv.v)}`
    })
    layer.add(text)
    tr = new Konva.Transformer({
      anchorSize: 10,
      borderStroke: 'black',
      borderDash: [3, 3]
    })
    layer.add(tr)
    tr.nodes([text])
    layer.draw()

    return text
  }
  const text = editArea()
  appStore.isEdit = true
  stage.add(layer)
  
  let currentText = ""
  /* 使用input记录输入文本,实现支持中文输入 */
  const input = document.createElement('input')
  input.type = 'text'
  input.style.position = 'absolute'
  input.style.left = `${x}px`
  input.style.top = `${y}px`
  input.style.fontSize = '24px'
  input.style.opacity = '0' // 隐藏输入框
  document.body.appendChild(input)


  requestAnimationFrame(() => {
    input.focus()
  })


  const updateText = (e:Event) => {
    currentText = (e.target as HTMLInputElement).value;
    text.text(currentText);
    layer.draw();
  }

  input.addEventListener('input', updateText);


  /** 
   * @description 监听键盘事件
    */

  const keyDownListenter = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      appStore.isEdit = false
      input.remove()
      tr.destroy()
      layer.draw()
    }
    if (e.key === "Escape") {
      input.value = '' // 按下ESC清空输入
      text.text('   ') // 重置文本
      layer.draw()
    }
    if (e.key === "Backspace") {
      if (currentText.length > 0) {
        currentText = currentText.slice(0, -1)
        text.text(currentText)
        layer.draw()
      }
    }
  }
  document.addEventListener("keydown", keyDownListenter)
  

  watch(() => appStore.tool, () => {
    document.removeEventListener("keydown", keyDownListenter);
    input.removeEventListener('input', updateText);
  })



}
