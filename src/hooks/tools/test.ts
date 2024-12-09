import Konva from "konva"


export const test = (stage: Konva.Stage) => {
  /* 立即触发 */
  console.log('test')
  /* 需要点击第2次才触发 */
  stage.on('mousedown', (event) => {
    console.log('down test', event)
  })
  /* 立即触发 */
  stage.on('mouseup', () => {
    console.log('up test')
  })
  /* 立即触发 */
  stage.on('click', () => {
    console.log('click test')
  })

}