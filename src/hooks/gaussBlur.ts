import Konva from "konva";

/**
 * @description : 高斯模糊
 * @param {Konva.Image} konvaImage : konva图片对象
 * @param {imageData} image : 图片
 * @param {number} sigma : 标准差
 * @param {number} radius : 半径
 */
export const gaussBlur = (
  konvaImage: Konva.Image,
  image: ImageData,
  sigma: number = 10,
  radius: number = 10
) => {
  const stage = konvaImage.getStage()!;
  if (!stage) {
    console.error("Failed to get stage");
    return;
  }
  const pos = konvaImage.getRelativePointerPosition();

  if (!pos) return;

  const xCenter = pos.x;
  const yCenter = pos.y;

  const pixes = image.data;
  const width = image.width;
  const height = image.height;
  const gaussMatrix = [];
  const a = 1 / (Math.sqrt(2 * Math.PI) * sigma);
  const b = -1 / (2 * sigma * sigma);
  let gaussSum = 0;

  /* 生成高斯矩阵 */
  for (let i = 0, x = -radius; x <= radius; x++, i++) {
    const g = a * Math.exp(b * x * x);
    gaussMatrix[i] = g;
    gaussSum += g;
  }

  for (let i = 0, len = gaussMatrix.length; i < len; i++) {
    gaussMatrix[i] /= gaussSum;
  }

  const B_List_LENGTH = 3;

  /* 限定模糊的区域 */
  const xStart = Math.max(0, xCenter);
  const xEnd = Math.min(width, xCenter + 20);
  const yStart = Math.max(0, yCenter);
  const yEnd = Math.min(height, yCenter + 20);

  /* x方向 */
  for (let y = yStart; y < yEnd; y++) {
    for (let x = xStart; x < xEnd; x++) {
      const bList = new Array(B_List_LENGTH).fill(0);
      gaussSum = 0;

      /* 遍历邻居像素 */
      for (let j = -radius; j < radius; j++) {
        /* x轴坐标 */
        const k = x + j;
        if (k >= 0 && k < width) {
          const i = (y * width + k) * 4; /* 4通道 */
          for (let l = 0; l < bList.length; l++) {
            bList[l] += pixes[i + l] * gaussMatrix[j + radius];
          }
          gaussSum += gaussMatrix[j + radius];
        }
      }
      const i = (y * width + x) * 4;
      for (let l = 0; l < bList.length; l++) {
        pixes[i + l] = Math.round(bList[l] / gaussSum);
      }
    }
  }

  /* y方向 */
  for (let x = xStart; x < xEnd; x++) {
    for (let y = yStart; y < yEnd; y++) {
      const bList = new Array(B_List_LENGTH).fill(0);
      gaussSum = 0;

      for (let j = -radius; j < radius; j++) {
        const k = y + j;
        if (k >= 0 && k < height) {
          const i = (k * width + x) * 4;
          for (let l = 0; l < bList.length; l++) {
            bList[l] += pixes[i + l] * gaussMatrix[j + radius];
          }
          gaussSum += gaussMatrix[j + radius];
        }
      }
      const i = (y * width + x) * 4;
      for (let l = 0; l < bList.length; l++) {
        pixes[i + l] = Math.round(bList[l] / gaussSum);
      }
    }
  }

  const context = konvaImage.getLayer()!.getContext();
  if (!context) {
    console.error("Failed to get canvas context");
    return;
  }

  context.putImageData(image, konvaImage.x(), konvaImage.y());
};
