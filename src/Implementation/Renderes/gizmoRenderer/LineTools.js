import ShapeTools from "./ShapeTools";

export default class LineTools {
  constructor() {
    this.shapeTools = new ShapeTools();
  }

  computeCenterPoint(domain, range, offset) {
    const cx = 0.5 * (range.x + domain.x) + offset;
    const cy = 0.5 * (range.y + domain.y) + offset;
    return { cx: cx, cy: cy };
  }

  computeShapeBasedCenterPoint(domain, range, offset) {
    const domainOffset = 0.5 * parseInt(domain.renderingShape.attr("width"));
    const rangeOffset = 0.5 * parseInt(range.renderingShape.attr("width"));

    const cx =
      domain.x +
      domainOffset +
      0.5 * (range.x - rangeOffset - domain.x + domainOffset);

    const cy = 0.5 * (range.y + domain.y) + offset;

    return { cx: cx, cy: cy };
  }

  computeIntersectionPointsWithProperty = (domain, range, link, offset) => {
    let distOffset = 0;
    if (offset) {
      distOffset = offset;
    }

    const parentShape = link.renderingShape;
    parentShape.data()[0].updateRenderingPosition();

    const iP_Src = { x: domain.x, y: domain.y };
    const iP_Prop = { x: parentShape.data()[0].x, y: parentShape.data()[0].y };
    const iP_Tar = { x: range.x, y: range.y };

    if (link.__internalType !== "loop") {
      let offsetDirection = this.__computeNormalizedOffsetDirection(
        iP_Src,
        iP_Prop
      );
      this.__shapeBasedIntersection(
        iP_Src,
        domain,
        offsetDirection,
        distOffset
      );

      offsetDirection = this.__computeNormalizedOffsetDirection(
        iP_Tar,
        iP_Prop
      );
      this.__shapeBasedIntersection(iP_Tar, range, offsetDirection, distOffset);
    } else {
      let divisor = 2;
      if (domain.numberOfLoops() > 0) {
        divisor = domain.numberOfLoops();
      }
      const fairShareLoopAngle = 360 / divisor,
        fairShareLoopAngleWithMargin = fairShareLoopAngle * 0.8,
        loopAngle = Math.min(60, fairShareLoopAngleWithMargin);

      const dx = iP_Prop.x - domain.x,
        dy = iP_Prop.y - domain.y,
        labelRadian = Math.atan2(dy, dx),
        labelAngle = this.__calculateAngle(labelRadian);
      const startAngle = labelAngle - loopAngle / 2;
      const endAngle = labelAngle + loopAngle / 2;

      // TODO UPDATE BASED ON SHAPE DEFINITIONS (rect, circle[x], ellipse )

      const radius =
        this.shapeTools.getShapeRadius(domain.renderingShape) + distOffset;
      const width =
        this.shapeTools.getShapeWidth(domain.renderingShape) + distOffset;
      const height =
        this.shapeTools.getShapeHeight(domain.renderingShape) + distOffset;

      let usedRadius = Math.min(0.5 * width, 0.5 * height);
      if (width === height) {
        usedRadius = radius;
      }

      const arcFrom = this.__calculateRadian(startAngle),
        arcTo = this.__calculateRadian(endAngle),
        x1 = Math.cos(arcFrom) * usedRadius,
        y1 = Math.sin(arcFrom) * usedRadius,
        x2 = Math.cos(arcTo) * usedRadius,
        y2 = Math.sin(arcTo) * usedRadius;

      return [
        [domain.x + x1, domain.y + y1],
        [iP_Prop.x, iP_Prop.y],
        [domain.x + x2, domain.y + y2]
      ];
    }
    return [
      [iP_Src.x, iP_Src.y],
      [iP_Prop.x, iP_Prop.y],
      [iP_Tar.x, iP_Tar.y]
    ];
  };

  __calculateRadian(angle) {
    angle = angle % 360;
    if (angle < 0) {
      angle = angle + 360;
    }
    return (Math.PI * angle) / 180;
  }

  __calculateAngle(radian) {
    return radian * (180 / Math.PI);
  }

  computeIntersectionPoints = (domain, range, offset) => {
    // get the shape parameter for domain;
    let distOffset = 0;
    if (offset) {
      distOffset = offset;
    }
    const iP_Src = { x: domain.x, y: domain.y };
    const iP_Tar = { x: range.x, y: range.y };
    let offsetDirection = this.__computeNormalizedOffsetDirection(
      domain,
      range
    );
    this.__shapeBasedIntersection(iP_Src, domain, offsetDirection, distOffset);

    offsetDirection = this.__computeNormalizedOffsetDirection(range, domain);
    this.__shapeBasedIntersection(iP_Tar, range, offsetDirection, distOffset);
    return [
      [iP_Src.x, iP_Src.y],
      [iP_Tar.x, iP_Tar.y]
    ];
  };

  __computeNormalizedOffsetDirection(source, target) {
    const x = target.x - source.x;
    const y = target.y - source.y;

    const len = Math.sqrt(x * x + y * y);
    return { x: x / len, y: y / len };
  }

  __shapeBasedIntersection(IntPoint, node, offsetDirection, distOffset) {
    const cfg = node.renderingConfig();
    if (cfg.style.renderingType === "circle") {
      const distanceToBorder =
        this.shapeTools.getShapeRadius(node.renderingShape) + distOffset;
      IntPoint.x = node.x + distanceToBorder * offsetDirection.x;
      IntPoint.y = node.y + distanceToBorder * offsetDirection.y;
      // return;
    } else if (
      cfg.style.renderingType === "rect" ||
      cfg.style.renderingType === "ellipse"
    ) {
      const width =
        this.shapeTools.getShapeWidth(node.renderingShape) + distOffset;

      const height =
        this.shapeTools.getShapeHeight(node.renderingShape) + distOffset;

      const distanceToBorderX = 0.5 * parseFloat(width);
      const distanceToBorderY = 0.5 * parseFloat(height);
      let scale;
      if (Math.abs(offsetDirection.x) >= Math.abs(offsetDirection.y)) {
        scale = 1.0 / Math.abs(offsetDirection.x);
      } else {
        scale = 1.0 / Math.abs(offsetDirection.y);
      }
      IntPoint.x = node.x + scale * distanceToBorderX * offsetDirection.x;
      IntPoint.y = node.y + scale * distanceToBorderY * offsetDirection.y;
      return IntPoint;
    } else {
      // default >> center of the node
      IntPoint.x = node.x;
      IntPoint.y = node.y;
    }
  }
}
