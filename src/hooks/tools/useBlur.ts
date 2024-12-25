import Konva from "konva";
import { useAppStore } from "../../store/app";
import { watch } from "vue";

/*
1.mousedown: 获取坐标 -> 判断坐标是否在图片内部 -> 创建图片蒙版 -> 显示cricle
2.mousemove: cricle跟随鼠标移动 -> group的clipFunc根据crilcle路径剪切图片 -> group图片模糊
*/

export const useBlur = (stage: Konva.Stage, layer: Konva.Layer) => {
  const appStore = useAppStore();
  if (appStore.tool !== "blur") return;
  let isDrawing  = false;
  let currentColor = 'black'; 
  // let blurCircle: Konva.Circle | null = null;
  let blurLine: Konva.Line | null = null;


  const averageRgb = (x:number,y:number) => {
    x = Math.floor(x);
    y = Math.floor(y);
    let totalR = 0;
    let totalG = 0;
    let totalB = 0;
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const pixel = layer.getContext().getImageData(x+i, y+j, 1, 1).data;
        totalR += pixel[0];
        totalG += pixel[1];
        totalB += pixel[2];
      }
    }
    let centerR = totalR / 100;
    let centerG = totalG / 100;
    let centerB = totalB / 100;
    return `rgba(${centerR}, ${centerG}, ${centerB},0.6)`;
  }


  const createBlur = () => {
    const pos = stage.getPointerPosition();
    if (!pos) return;
    const x = pos.x;
    const y = pos.y;
    currentColor = averageRgb(x,y);
    // const pixel = layer.getContext().getImageData(pos.x, pos.y, 1, 1).data;
    // currentColor = `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]},0.6)`;
    blurLine = new Konva.Line({
      points: [x, y],
      stroke: currentColor,
      strokeWidth: 20,
      lineCap: 'round',
    });
    layer.add(blurLine);
    layer.batchDraw();
  }


  for (const child of layer.children) {
    child.on('mousedown', (e) => {
     if (child.className !== 'Image' || isDrawing) return;
    //  e.cancelBubble = true;
     child.draggable(false);
     isDrawing  = true;
     createBlur();
    })

    // child.on('mouseup', (e) => {
    //   console.log('mouseup')
    //   // e.cancelBubble = true;
    //   isDrawing  = false;
    //   blurLine = null;
    // })

    child.on('mousemove', (e) => {
      if (!isDrawing ) return;
      console.log(isDrawing)
      // e.cancelBubble = true;
      // 获取鼠标位置
      const pos = stage.getPointerPosition();
      if (!pos || !blurLine) return;
      // const pixel = layer.getContext().getImageData(pos.x, pos.y, 1, 1).data;
      // currentColor = `rgba(255,255,255,0.6)`;
      currentColor = averageRgb(pos.x,pos.y);
      const newPoints = blurLine.points().concat([pos.x, pos.y]);
      blurLine.points(newPoints);
      blurLine.cache();
      blurLine.filters([Konva.Filters.Blur])
      blurLine.blurRadius(10)
      layer.batchDraw();
    })
    
  }


  stage.on('mouseup', () => {
    isDrawing  = false;
    blurLine = null;
  })

  const cancelListener = () => {
    for (const child of layer.children) {
      if (child.className !== 'Image') return;
      child.off("mousedown")
    }
  }

  watch(
    () => appStore.tool,
    () => {
      // cancelListener()
      
    }
  )


  // const imageObj = new Image();
  // imageObj.src = "src/assets/test.png"
  // imageObj.onload = () => {
  //   const image = new Konva.Image({
  //     x:0,
  //     y:0,
  //     image: imageObj,
  //     draggable: false,
  //     width: stage.width(),
  //     height: stage.height(),
  //   })
  //   layer.add(image)
  //   layer.draw()
  // }
  // let isDrawing  = false;


  // let currentColor = 'black'; 
  // stage.on("mousedown", (e) => {
  //   isDrawing  = true;
  
  // })

  // stage.on('mouseup', () => {
  //   isDrawing  = false;
  // });

  // stage.on('mousemove', (e) => {
  //   if (!isDrawing ) return;
    
  //   // 获取鼠标位置
  //   const pos = stage.getPointerPosition();
  //   if (!pos) return;
  //   const pixel = layer.getContext().getImageData(pos.x, pos.y, 1, 1).data;
  //   currentColor = `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]},0.3)`;
    
  //   // 创建模糊效果
  //   const blurCircle = new Konva.Circle({
  //     x: pos.x,
  //     y: pos.y,
  //     radius: 5,
  //     fill: currentColor, // 可以自定义颜色和透明度
  //     listening: false, // 不需要监听事件
  //   });
    
  //   layer.add(blurCircle);
  //   layer.batchDraw();
  // });

 

 
};