import Konva from "konva";
import { useAppStore } from "../../store/app";


/*
1.mousedown: 获取坐标 -> 判断坐标是否在图片内部 -> 创建图片蒙版 -> 显示cricle
2.mousemove: cricle跟随鼠标移动 -> group的clipFunc根据crilcle路径剪切图片 -> group图片模糊
*/

export const useBlur = (stage: Konva.Stage, layer: Konva.Layer) => {
  const appStore = useAppStore();
  if (appStore.tool !== "blur") return;
  let path: number[] = [];
  let cricle: Konva.Circle | null = null;
  let mousedown = false;
  let clipArea: Konva.Group | null = null;

  // for (const item of layer.children) {
  //   item.on("click", () => {
  //     if (item.getClassName() !== "Image") return;
  //     mousedown = true;
  //     item.draggable(false);
  //     const {x ,y} = appStore.info;
  //     cricle = new Konva.Circle({
  //       x,
  //       y,
  //       radius: 10,
  //       stroke:"red",
  //       draggable: true,
  //     });
  //     layer.add(cricle);
  //     layer.draw();
  //     cricle.on("dragmove", () => {
  //       if(!cricle) return;
  //       const pos = cricle.position();
  //       path.push(pos.x, pos.y);
  //       clipArea = new Konva.Group({
  //         clipFunc: function (ctx) {
  //           ctx.beginPath();
  //           ctx.moveTo(100,100)
  //           ctx.lineTo(400,100)
  //           ctx.lineTo(400,400)
  //           ctx.closePath();
  //           ctx.lineWidth = 10;
  //           ctx.stroke();
  //         }
  //       });
  //       const blurImage = new Image();
  //       blurImage.src = item.image().src;
  //       // console.log(item.image())
  //       blurImage.onload = () => {
  //         const filtersImage = new Konva.Image({
  //           image: blurImage,
  //           x:item.x(),
  //           y:item.y(),
  //           width: item.width(),
  //           height: item.height(),
  //           draggable: false,
  //         })
  //         filtersImage.cache();
  //         filtersImage.filters([Konva.Filters.Blur]);
  //         filtersImage.blurRadius(1);
  //         clipArea!.add(filtersImage);
  //         if (clipArea) {
  //           layer.add(clipArea);
  //           layer.batchDraw();
  //         }
          
         
  //       }
  //       // item.cache();
  //       // item.filters([Konva.Filters.Blur]);
  //       // item.blurRadius(10);
  //       // clipArea.add(item);
  //       // layer.add(clipArea);
  //       // layer.batchDraw();

  //     });
  //   })
  // }


  const imageObj = new Image();
  imageObj.src = "src/assets/test.png"
  imageObj.onload = () => {
    const image = new Konva.Image({
      x:0,
      y:0,
      image: imageObj,
      draggable: false,
      width: stage.width(),
      height: stage.height(),
    })
    layer.add(image)
    layer.draw()
  }
  let isDrawing  = false;


  let currentColor = 'black'; 
  stage.on("mousedown", (e) => {
    isDrawing  = true;
  
  })

  stage.on('mouseup', () => {
    isDrawing  = false;
  });

  stage.on('mousemove', (e) => {
    if (!isDrawing ) return;
    
    // 获取鼠标位置
    const pos = stage.getPointerPosition();
    if (!pos) return;
    const pixel = layer.getContext().getImageData(pos.x, pos.y, 1, 1).data;
    currentColor = `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]},0.3)`;
    
    // 创建模糊效果
    const blurCircle = new Konva.Circle({
      x: pos.x,
      y: pos.y,
      radius: 5,
      fill: currentColor, // 可以自定义颜色和透明度
      listening: false, // 不需要监听事件
    });
    
    layer.add(blurCircle);
    layer.batchDraw();
  });

 

 
};