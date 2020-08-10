import BasePrimitive from "./BasePrimitive";

export default class LinkPrimitive extends BasePrimitive {
  constructor() {
    super();
    this.x = 0;
    this.y = 0;
    this.sourceNode = null;
    this.targetNode = null;
    this.__internalType = "singleLink";
    this.propertyNodePostion = null;
    this.__internalObjectType = "link";
  }

  setInternalType(type) {
    this.__internalType = type;
    // type can be loop, singleLink, multiLink ;
  }

  setTargetNode(node) {
    this.targetNode = node;
    node.addIncomingLink(this);
  }
  setSourceNode(node) {
    this.sourceNode = node;
    node.addOutgoingLink(this);
  }

  setPosition = (x, y) => {
    this.x = x;
    this.y = y;
  };

  getForceNode() {
    if (
      this.__internalType === "loop" ||
      this.__internalType === "multiLink" ||
      this.__internalType === "singleLink"
    ) {
      // get the data for the force node;
      // based on the internal type we can decide if we want a force node
      // here we return always a force node
      return this.renderingShape.data();
    }
    return []; // if we dont want a force node for a property link then return empty array
  }

  getForceLink() {
    if (this.__internalType === "loop") {
      return [
        {
          source: this.sourceNode,
          target: this.renderingShape.data()[0],
          type: "loop"
        }
      ];
    }
    // if (this.__internalType === "multiLink" ) {
    return [
      {
        source: this.sourceNode,
        target: this.renderingShape.data()[0],
        type: "mlPart"
      },
      {
        source: this.renderingShape.data()[0],
        target: this.targetNode,
        type: "mlPart"
      }
    ];
    // }
    // *Force links can be done as a direct link or as multipart link // here we use always mutlipart links
    // return [
    //   {
    //     source: this.sourceNode,
    //     target: this.targetNode,
    //     type: "direct"
    //   }
    // ];
  }

  updateRenderingPosition = () => {
    // based on config; choose attribute selector;

    if (this.renderingLine) {
      // set its attributes based on the source and target nodes;
      this.drawTools().updateLinePosition(
        this,
        this.renderingLine,
        this.sourceNode,
        this.targetNode,
        this.__internalType,
        this.renderingConfig().options.link_renderingType === "curve" ||
          this.__internalType === "loop"
      );

      this.propertyNodePostion = this.drawTools().updatePropertyPosition(
        this,
        this.renderingShape,
        this.sourceNode,
        this.targetNode,
        this.__internalType,
        this.renderingConfig().options.link_renderingType === "curve"
      );
    }
  };

  resetPropertyPosition() {}

  initializePropertyNodePosition() {
    const pos = this.drawTools().lineTools.computeShapeBasedCenterPoint(
      this.sourceNode,
      this.targetNode,
      1
    );

    this.propertyNodePostion = { x: pos.cx, y: pos.cy };
  }

  setPropertyNodePosition(pos) {
    this.propertyNodePostion = pos;
    if (this.renderingShape) {
      this.renderingShape.data()[0].x = this.propertyNodePostion.x;
      this.renderingShape.data()[0].px = this.propertyNodePostion.x;
      this.renderingShape.data()[0].y = this.propertyNodePostion.y;
      this.renderingShape.data()[0].py = this.propertyNodePostion.y;
    }
  }

  // this one will get the draw Functions replacement!
  render = (groupRoot, propertyContainer, arrowContainer) => {
    this.groupRoot = groupRoot;
    this.propertyContainer = propertyContainer;
    this.arrowContainer = arrowContainer;

    //rendering the link

    let reloadPos = false;
    if (this.renderingShape) {
      reloadPos = true;
      const oldPos = [
        this.renderingShape.data()[0].x,
        this.renderingShape.data()[0].y
      ];

      this.propertyNodePostion = { x: oldPos[0], y: oldPos[1] };
    }

    // handle rendering based on the config;
    const renderingElements = this.drawTools().renderLink(
      this.groupRoot,
      this.propertyContainer,
      this.arrowContainer,
      this.renderingConfig(),
      this
    );
    this.renderingLine = renderingElements.renderingLine;
    this.renderingShape = renderingElements.renderingShape;
    this.renderingText = renderingElements.renderingText;

    if (this.__internalType !== "loop" && this.__internalType !== "multiLink") {
      // CHECK THE CURVE ATTRIBUTE
      if (this.renderingConfig().options.link_renderingType === "line") {
        this.setInternalType("singleLink");
      } else {
        if (
          this.renderingConfig().options.link_renderingType === "curve" &&
          this.__internalType !== "loop"
        ) {
          this.setInternalType("multiLink");
        }
      }
    }

    if (reloadPos) {
      this.renderingShape.data()[0].x = this.propertyNodePostion.x;
      this.renderingShape.data()[0].px = this.propertyNodePostion.x;
      this.renderingShape.data()[0].y = this.propertyNodePostion.y;
      this.renderingShape.data()[0].py = this.propertyNodePostion.y;
    }

    this.updateRenderingPosition();
  };
}
