import * as d3 from "d3";

export default class NodeInteractions {
  constructor(graph) {
    this.graphObject = graph;
    this.dragBehaviour = null;
    this.hasNodeClick = false;
    this.hasNodeDobleClick = false;
    this.hasNodeHover = true;
  }

  setHoverEnabled = val => {
    this.hasNodeHover = val;
  };
  setNodeClickEnabled = val => {
    this.hasNodeClick = val;
  };
  setNodeDoubleClickEnabled = val => {
    this.hasNodeDobleClick = val;
  };
  setDragEnabled = val => {
    this.hasNodeDragEnabeld = val;
  };

  applyNodeInteractions = () => {
    if (!this.graphObject) {
      console.error("NO GRAPH OBJECT FOUND");
      return;
    }

    // Node Interactions are:
    // Drag,
    this.dragBehaviour = d3.behavior
      .drag()
      .origin(function(d) {
        return d;
      })
      .on("dragstart", this.dragStart)
      .on("drag", this.drag)
      .on("dragend", this.dragEnd);

    /** DEFINING OWN INTERNAL HOVER BEHAVIOR -- DO NOT OVERWRITE **/
    const that = this;
    this.hoverBehaviour = function(d) {
      if (that.hasNodeHover) {
        d.on("mouseover", that.nodeHoverIn);
        d.on("mouseout", that.nodeHoverOut);
      }
    };

    /** DEFINING OWN INTERNAL CLICK BEHAVIOR -- DO NOT OVERWRITE **/
    this.clickBehaviour = function(d) {
      if (that.hasNodeClick) {
        d.on("click", that.nodeClick);
      }
    };
    this.doubleClickBehavoir = function(d) {
      if (that.hasNodeDobleClick) {
        d.on("click", that.nodeDoubleClick);
      }
    };

    // apply the node behavoir on the nodes;
    const nodes = this.graphObject.nodes;
    if (nodes.length > 0) {
      nodes.forEach(n => {
        if (n.groupRoot) {
          n.groupRoot.call(this.dragBehaviour);
          n.groupRoot.call(this.hoverBehaviour);
          n.groupRoot.call(this.clickBehaviour);
          n.groupRoot.call(this.doubleClickBehavoir);
        }
      });
    }
  };

  nodeHoverIn(d) {
    const shape = d.renderingShape;
    shape.style("fill", "green");
  }

  nodeHoverOut(d) {
    const shape = d.renderingShape;
    shape.style("fill", d.renderingConfig().style.bgColor);
  }

  nodeDoubleClick(d) {
    // add Handlers
    d3.event.stopPropagation(); // Prevent panning
    d3.event.preventDefault();
  }
  nodeClick(d) {
    // add handers; >> this is where we want to overwrite something;
  }

  // split the dragger functions for better reuse;
  dragStart = d => {
    if (this.hasNodeDragEnabeld) {
      d3.event.sourceEvent.stopPropagation(); // Prevent panning
      d.fixed = true;
      d.groupRoot.style("cursor", "pointer");
    }
  };

  drag = d => {
    if (this.hasNodeDragEnabeld) {
      d3.event.sourceEvent.stopPropagation(); // Prevent panning
      d.setPosition(d3.event.x, d3.event.y);
      d.px = d3.event.x;
      d.py = d3.event.y;
      d.updateRenderingPosition();

      if (d.layoutHandlerReference && d.layoutHandlerReference.force) {
        d.layoutHandlerReference.resumeForce();
      }
    }
  };

  dragEnd = d => {
    if (this.hasNodeDragEnabeld) {
      d.fixed = false;
      d.groupRoot.style("cursor", "auto");
      if (d.layoutHandlerReference && d.layoutHandlerReference.force) {
        d.layoutHandlerReference.resumeForce();
      }
    }
  };
}
