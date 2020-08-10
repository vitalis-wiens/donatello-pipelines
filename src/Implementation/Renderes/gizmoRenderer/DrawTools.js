import * as d3 from "d3";
import LineTools from "./LineTools";

export default class DrawTools {
  constructor(graph) {
    // default one;
    this.lineTools = new LineTools();
    this.renderingConfigHandler = graph.getRenderingHandler();
  }

  renderShadowNode(groupContainer, renderingConfig, node) {
    // node is used to get its data when we need to render it;
    // the rendering order is the following
    // 1) Shape
    const renderingShape = groupContainer.append("rect");
    const shapeConfig = renderingConfig.style;
    this.renderBaseShape(renderingShape, shapeConfig);
    this.applyShapeStyle(renderingShape, shapeConfig);
    const displayName = this.drawDisplayName(
      groupContainer,
      node.__displayName,
      renderingConfig
    );

    this.applyAdditionalOptions(
      groupContainer,
      renderingShape,
      displayName,
      renderingConfig,
      node
    );
    // handle options;
    // 3 Additional Icons provided by extensions [TODO];
    return { renderingShape: renderingShape, renderingText: displayName };
  }

  renderNode(groupContainer, renderingConfig, node) {
    // node is used to get its data when we need to render it;
    // the rendering order is the following
    // 1) Shape
    const renderingShape = groupContainer.append("rect");
    const shapeConfig = renderingConfig.style;
    this.renderBaseShape(renderingShape, shapeConfig);
    this.applyShapeStyle(renderingShape, shapeConfig);
    const displayName = this.drawDisplayName(
      groupContainer,
      node.displayName(),
      renderingConfig
    );

    this.applyAdditionalOptions(
      groupContainer,
      renderingShape,
      displayName,
      renderingConfig,
      node
    );
    // handle options;
    // 3 Additional Icons provided by extensions [TODO];
    return { renderingShape: renderingShape, renderingText: displayName };
  }

  renderLink(
    groupContainer,
    propertyContainer,
    arrowContainer,
    renderingConfig,
    link
  ) {
    const renderingLine = this.__createLinkLine(
      groupContainer,
      renderingConfig
    );

    let renderingShape = null;
    let renderingText = null;
    // we dont care about the arrows, they handle them selfs;
    if (renderingConfig.options.drawArrowHead) {
      this.__drawArrowHead(
        groupContainer,
        arrowContainer,
        "arrowHead_" + link.id(),
        renderingConfig.style.arrowHead
      );
    }
    if (renderingConfig.options.drawArrowTail) {
      this.__drawArrowTail(
        groupContainer,
        arrowContainer,
        "arrowTail_" + link.id(),
        renderingConfig.style.arrowTail
      );
    }
    if (renderingConfig.options.drawPropertyNode) {
      const groupContainer = null;
      const renderingElements = this.__createRenderingShapeForPropertyNode(
        propertyContainer,
        groupContainer,
        renderingConfig.style.propertyNode,
        link
      );
      renderingShape = renderingElements.renderingShape;
      renderingText = renderingElements.displayName;
    }

    return {
      renderingLine: renderingLine,
      renderingShape: renderingShape,
      renderingText: renderingText
    };
  }

  __createRenderingShapeForPropertyNode(
    propertyContainer,
    groupContainer,
    cfg,
    link
  ) {
    // create a group container for that thing
    groupContainer = propertyContainer.append("g");
    const itemId =
      "PROPERTY_NODE_" +
      link.sourceNode.id() +
      "_" +
      link.id() +
      "_" +
      link.targetNode.id();
    groupContainer.node().id = itemId;

    // groupContainer.attr('id', 'PROPERTY_NODE_' + 0 + '_' + 1);
    const dataObj = {
      x: link.x,
      y: link.y,
      __id: itemId,
      ref: link,
      groupRoot: groupContainer
    };
    groupContainer.node().__data__ = dataObj;
    dataObj.id = function() {
      return this.__id;
    };
    dataObj.updateRenderingPosition = function() {
      this.groupRoot.attr(
        "transform",
        "translate(" + this.x + "," + this.y + ")"
      );
    };
    dataObj.setPosition = function(x, y) {
      this.x = x;
      this.y = y;
    };
    const elements = this.renderNode(groupContainer, cfg, link); // just reuse of the node rendering function
    return {
      renderingShape: elements.renderingShape,
      displayName: elements.displayName
    };
  }

  __createLinkLine(group, config) {
    const linkLine = group.append("path"); // default if not found
    this._addStrokeElements(linkLine, config.style.link, "line");
    linkLine.style("fill", "none");
    return linkLine;
  }

  __drawArrowHead(parent, container, identifier, cfg) {
    this.__drawArrowPrimitive(parent, container, identifier, cfg, "marker-end");
  }
  __drawArrowTail(parent, container, identifier, cfg) {
    this.__drawArrowPrimitive(
      parent,
      container,
      identifier,
      cfg,
      "marker-start"
    );
  }

  __drawArrowPrimitive(parent, container, identifier, cfg, makerType) {
    const scale = parseFloat(cfg.scaleFactor);
    const v1 = scale * -14;
    const v2 = scale * -10;
    const v3 = scale * 28;
    const v4 = scale * 20;

    const vB_String = v1 + " " + v2 + " " + v3 + " " + v4;
    const arrowHead = container
      .append("marker")
      // .datum(property)
      .attr("id", identifier)
      .attr("viewBox", vB_String)
      .attr("markerWidth", scale * 10)
      .attr("markerHeight", scale * 10)
      //.attr("markerUnits", "userSpaceOnUse")
      .attr("orient", "auto");

    parent.attr(makerType, "url(#" + identifier + ")");
    const renderingShape = arrowHead.append("path");
    if (cfg.renderingType === "triangle") {
      const m1X = -12 * scale;
      const m1Y = 8 * scale;
      const m2X = -12 * scale;
      const m2Y = -8 * scale;
      renderingShape.attr(
        "d",
        "M0,0L " + m1X + "," + m1Y + "L" + m2X + "," + m2Y + "L" + 0 + "," + 0
      );
    }
    if (cfg.renderingType === "diamond") {
      const p0 = 0;
      const p1 = -8 * scale;
      const p2 = 8 * scale;
      const pathString =
        "M" +
        p0 +
        "," +
        p1 +
        "L" +
        p2 +
        "," +
        p0 +
        "L" +
        p0 +
        "," +
        p2 +
        "L" +
        p1 +
        "," +
        p0 +
        "L" +
        p0 +
        "," +
        p1 +
        "L" +
        p2 +
        "," +
        p0 +
        "";
      renderingShape.attr("d", pathString);
    }

    renderingShape.style("stroke", cfg.strokeColor);
    renderingShape.style("stroke-width", cfg.strokeWidth);
    renderingShape.style("fill", cfg.fillColor);
    if (cfg.strokeStyle !== "solid") {
      if (cfg.strokeStyle === "dashed") {
        renderingShape.style("stroke-dasharray", 8);
      }
      if (cfg.strokeStyle === "dotted") {
        renderingShape.style("stroke-dasharray", 3);
      }
    }
  }

  updateLinePosition(link, line, src, tar, linkType, curve) {
    // handling internal type overwrites;
    if (linkType === "loop" || linkType === "multiLink") {
      curve = true;
    }

    if (curve === false) {
      const controlPoints = this.lineTools.computeIntersectionPoints(
        src,
        tar,
        1
      );
      line.attr("d", this.__directLineFunction(controlPoints));
    } else {
      const controlPoints = this.lineTools.computeIntersectionPointsWithProperty(
        src,
        tar,
        link,
        1
      );
      if (linkType === "loop") {
        line.attr("d", this.__loopLineFunction(controlPoints));
      } else {
        line.attr("d", this.__curveLineFunction(controlPoints));
      }
    }
  }

  updatePropertyPosition(link, shape, src, tar, linkType, curve) {
    if (linkType === "loop" || linkType === "multiLink") {
      curve = true;
    }
    if (curve) {
      if (shape) {
        const parentGroup = shape.node().parentNode;
        const x = d3.select(parentGroup).data()[0].x;
        const y = d3.select(parentGroup).data()[0].y;

        return { x, y };
      }
      return; // nothing to do here
    }
    if (shape) {
      const parentGroup = shape.node().parentNode;
      if (parentGroup) {
        if (curve === false) {
          const controlPoints = this.lineTools.computeIntersectionPointsWithProperty(
            src,
            tar,
            link,
            1
          );
          // const centerPoint = this.lineTools.computeCenterPoint(src, tar, 1);
          const centerPoint = {
            cx: 0.5 * (controlPoints[2][0] + controlPoints[0][0]),
            cy: 0.5 * (controlPoints[2][1] + controlPoints[0][1])
          };

          d3.select(parentGroup)
            .data()[0]
            .setPosition(centerPoint.cx, centerPoint.cy);
          d3.select(parentGroup)
            .data()[0]
            .updateRenderingPosition();
        }
      }
    }
  }

  __directLineFunction = d3.svg.line();
  __curveLineFunction = d3.svg.line().interpolate("cardinal");
  __loopLineFunction = d3.svg
    .line()
    .interpolate("cardinal")
    .tension(-1);

  drawDisplayName = (group, text, cfg) => {
    // 2) Label

    if (cfg.options.drawDisplayName === true) {
      return this._drawText(group, text, cfg.fontStyle);
    }
    // will return undefined when does not fit
  };

  measureTextWidth(text, fontFamily, fontSize) {
    const d = d3.select("body").append("text");
    d.attr("id", "width-test");
    d.attr(
      "style",
      "position:absolute; float:left; white-space:nowrap; font-family:" +
        fontFamily +
        ";font-size: " +
        fontSize
    );

    d.text(text);
    const w = document.getElementById("width-test").offsetWidth;
    d.remove();
    return w;
  }
  measureTextHeight(text, fontFamily, fontSize) {
    const d = d3.select("body").append("text");
    d.attr("id", "width-test");
    d.attr(
      "style",
      "position:absolute; float:left; white-space:nowrap; font-family:" +
        fontFamily +
        ";font-size: " +
        fontSize
    );

    d.text(text);
    const w = document.getElementById("width-test").offsetHeight;
    d.remove();
    return w;
  }

  applyAdditionalOptions = (group, shape, label, config, node) => {
    const options = config.options;
    if (options.addTitleForDisplayName) {
      group.append("title").text(label.text());
    }

    // apply position changes after the whole stuff;
    if (options.fontSizeOverWritesShapeSize === true) {
      const labelBBWidth = this.measureTextWidth(
        label.text(),
        config.fontStyle.fontFamily,
        config.fontStyle.fontSize
      );

      shape.attr("x", -0.5 * (labelBBWidth + options.overwriteOffset));
      // shape.attr("y", -0.5 * labelBB.height);
      shape.attr("width", labelBBWidth + options.overwriteOffset);

      // shape.attr("height", labelBB.height);
    }

    if (options.cropLongText) {
      if (
        this.measureTextWidth(
          label.text(),
          config.fontStyle.fontFamily,
          config.fontStyle.fontSize
        ) > parseFloat(shape.attr("width"))
      ) {
        // crop that thing;
        const croppedText = this.cropText(
          label.text(),
          config.fontStyle,
          parseFloat(shape.attr("width"))
        );

        label.text(croppedText);
      }
    }

    if (
      options.drawNestedAttributes === true &&
      node.refereceResource &&
      node.refereceResource.__aggregatedLink &&
      node.refereceResource.__aggregatedLink.length > 0
    ) {
      // fetch aggregated links from resource;
      const nestedLinks = node.refereceResource.__aggregatedLink;

      const width = 220;
      const height = parseFloat(shape.attr("height")) + nestedLinks.length * 35;

      shape.attr("x", -0.5 * width);
      shape.attr("y", -0.5 * height);
      shape.attr("width", width);
      shape.attr("height", height);
      // precompute the shapesize based on the types;

      const labelBBHeight = this.measureTextHeight(
        label.text(),
        config.fontStyle.fontFamily,
        config.fontStyle.fontSize
      );
      // this is height align CENTER;
      // it sets the center of the labelBB into the center (0,0) of the rendering group;
      const offset = -0.5 * height + labelBBHeight;
      label.attr("dy", offset + "px");

      // draw headerline;
      const line = group.append("line");

      const x = shape.attr("x");
      const y = shape.attr("y");
      const w = shape.attr("width");

      const fontSizeProperty = window
        .getComputedStyle(label.node())
        .getPropertyValue("font-size");
      const fontSize = parseFloat(fontSizeProperty);
      const linePosY = parseFloat(y) + 8 + fontSize;
      const linePosX = parseFloat(x) + parseFloat(w);
      line
        .attr("x1", x)
        .attr("y1", linePosY)
        .attr("x2", linePosX)
        .attr("y2", linePosY);
      line.style("stroke", "black");
      const nestedGroup = group.append("g");
      nestedGroup.attr("id", "NestedGroupForNode" + node.id());

      let offsetVal = 0;

      // TODO: proper computation of element distances and uml styled height
      const shift = 24 - nestedLinks.length * 15;

      nestedLinks.forEach(link => {
        // do crop the text;
        const subGroupProperty = nestedGroup.append("g");
        const subGroupNode = nestedGroup.append("g");

        // get the rendering config for the link property;
        const linkCFG = this.renderingConfigHandler.getLinkConfigFromType(
          link.__linkType
        );

        const nodeCFG = this.renderingConfigHandler.getNodeConfigFromType(
          link.__target.__nodeType
        );

        this.renderShadowNode(
          subGroupProperty,
          linkCFG.style.propertyNode,
          link
        );

        // shift to left side;
        subGroupProperty.attr(
          "transform",
          "translate(" + -55 + "," + (shift + offsetVal) + ")"
        );

        this.renderShadowNode(subGroupNode, nodeCFG, link.__target);

        subGroupNode.attr(
          "transform",
          "translate(" + 55 + "," + (shift + offsetVal) + ")"
        );

        offsetVal += 35;
        // just reuse of the node rendering function

        // link.__displayName = this.cropText(
        //   link.__displayName,
        //   config.fontStyle,
        //   100
        // );
        // link.__target.__displayName = this.cropText(
        //   link.__target.__displayName,
        //   config.fontStyle,
        //   100
        // );
        //computeWidth and Height
      });
    }

    if (
      (!options.drawNestedAttributes ||
        (node.refereceResource &&
          node.refereceResource.__aggregatedLink &&
          node.refereceResource.__aggregatedLink.length === 0)) &&
      options.fontPositionV &&
      options.fontPositionV === "center"
    ) {
      this._text_vAlignCenter(label, shape, config);
    }

    if (options.fontPositionH && options.fontPositionH === "center") {
      this._text_hAlignCenter(label, shape, config);
    }
  };

  _text_vAlignCenter = (label, shape, config) => {
    const labelBBHeight = this.measureTextHeight(
      label.text(),
      config.fontStyle.fontFamily,
      config.fontStyle.fontSize
    );

    // this is height align CENTER;
    // it sets the center of the labelBB into the center (0,0) of the rendering group;
    const offset = 0.25 * labelBBHeight;
    label.attr("dy", offset + "px");
  };

  _text_hAlignCenter = (label, shape, config) => {
    const labelBBWidth = this.measureTextWidth(
      label.text(),
      config.fontStyle.fontFamily,
      config.fontStyle.fontSize
    );
    const offset = -0.5 * labelBBWidth;
    label.attr("dx", offset + "px");
  };

  _drawText(container, text, cfg) {
    const renderingTextElement = container.append("text").text(text);

    // apply different styles that are provided by the config
    renderingTextElement.style("font-family", cfg.fontFamily);
    renderingTextElement.style("font-size", cfg.fontSize);
    renderingTextElement.style("fill", cfg.fontColor);
    renderingTextElement.style("pointer-events", "none");
    return renderingTextElement;
  }

  _addStrokeElements = (element, cfg, selector) => {
    const color = cfg[selector + "Color"];
    const width = cfg[selector + "Width"];
    const style = cfg[selector + "Style"];

    element.style("stroke", color);
    element.style("stroke-width", width);
    if (style !== "solid") {
      if (style === "dashed") {
        element.style("stroke-dasharray", 8);
      }
      if (style === "dotted") {
        element.style("stroke-dasharray", 3);
      }
    }
  };

  applyShapeStyle = (targetPrimitive, renderingConfig) => {
    targetPrimitive.attr("fill", renderingConfig.bgColor);
    this._addStrokeElements(targetPrimitive, renderingConfig, "stroke");
  };

  renderBaseShape = (targetPrimitive, renderingConfig) => {
    const radius = parseInt(renderingConfig.radius);
    const width = parseInt(renderingConfig.width);
    const height = parseInt(renderingConfig.height);

    // check if is uml style << TODO;
    /**  render a pure circle **/
    if (renderingConfig.renderingType === "circle") {
      targetPrimitive.attr("x", -radius);
      targetPrimitive.attr("y", -radius);
      targetPrimitive.attr("width", 2 * radius);
      targetPrimitive.attr("height", 2 * radius);
      targetPrimitive.attr("rx", radius);
      targetPrimitive.attr("ry", radius);
    }

    /**  render a rectangle with possible rounded corners provided by config **/
    if (renderingConfig.renderingType === "rect") {
      targetPrimitive.attr("x", -0.5 * width);
      targetPrimitive.attr("y", -0.5 * height);
      targetPrimitive.attr("width", width);
      targetPrimitive.attr("height", height);
      if (renderingConfig.roundedCorner) {
        const tok = renderingConfig.roundedCorner.split(",");
        targetPrimitive.attr("rx", parseFloat(tok[0]));
        targetPrimitive.attr("ry", parseFloat(tok[1]));
      }
    }

    /**  render an ellipse **/
    if (renderingConfig.renderingType === "ellipse") {
      targetPrimitive.attr("x", -0.5 * width);
      targetPrimitive.attr("y", -0.5 * height);
      targetPrimitive.attr("width", width);
      targetPrimitive.attr("height", height);
      targetPrimitive.attr("rx", width);
      targetPrimitive.attr("ry", height);
    }
  };

  // crop functions;

  cropText(input, config, width) {
    let truncatedText = input;
    let textWidth;
    let ratio;
    let newTruncatedTextLength;
    while (true) {
      textWidth = this.measureTextWidth(
        truncatedText,
        config.fontFamily,
        config.fontSize
      );
      if (textWidth <= width) {
        break;
      }
      ratio = textWidth / width;
      newTruncatedTextLength = Math.floor(truncatedText.length / ratio);
      if (truncatedText.length === newTruncatedTextLength) {
        break;
      }
      truncatedText = truncatedText.substring(0, newTruncatedTextLength);
    }
    if (input.length > truncatedText.length) {
      return input.substring(0, truncatedText.length - 6) + "...";
    }
    return input;
  }
}
