import { s } from "vite/dist/node/types.d-aGj9QkWt";
import { useAppStore } from "../store/app";
import Konva from "konva";

type MenuItem = {
  id: number;
  label: string;
}
const item = [
  {id:1, label: "重置画布"},
  {id:2, label: "撤销"},
  {id:3, label: "恢复"},
  {id:4, label: "还原画布"}
]

export const contextMenu = () =>{
  const appStore = useAppStore();
  const layer = appStore.canvas.layer;
  const stage = appStore.canvas.stage;
  if(!stage ||!layer) return;
  const pos = stage.getPointerPosition();
  if(!pos) return;
  createContextMenu(pos.x, pos.y, item);


};


const createContextMenu = (x: number, y: number, items: MenuItem[]) => {
  const canvasMinipaint = document.getElementById("canvas_minipaint");
  document.createElement("div").setAttribute("id", "context-menu");
  const menuNode = document.getElementById("context-menu");
  console.log(canvasMinipaint)
  if(!menuNode) return;
  canvasMinipaint!.appendChild(menuNode);
  console.log(canvasMinipaint)
  menuNode.style.position = "absolute";
  menuNode.style.top = `${x}px`;
  menuNode.style.left = `${y}px`;
  menuNode.style.borderRadius = "5px";

}