import Konva from "konva";
class KonvaTransformer {
  private transformer: Konva.Transformer;
  /* 数组 */
  private selectedShapes: Konva.Node[] = [];
  /* 接受若干个shape */
  constructor(shape?: any) {
    this.selectedShapes = shape ? shape : [];
    this.transformer = new Konva.Transformer({
      lineCap: "round",
      anchorStroke: `black`,
      anchorSize: 8,
      borderStroke: `black`,
      borderStrokeWidth: 1,
      anchorCornerRadius: 5,
      keepRatio: false,
      ignoreStroke: true,
    });
    /* 初始化添加node */
    if (this.selectedShapes.length > 0) {
      this.nodes(this.selectedShapes);
    }
  }
  public nodes(shapes: Konva.Node[]) {
    if (shapes) {
      this.selectedShapes.push(...shapes);
      this.transformer.nodes(this.selectedShapes);
    }
    return this.selectedShapes;
  }
  public removeNodes(shape: Konva.Node) {
    this.selectedShapes = this.selectedShapes.filter((s) => s !== shape);
    this.transformer.nodes(this.selectedShapes);
  }
}
export default KonvaTransformer;
