import * as d3 from "d3";
import "./nodeLoaderAnimation.css";
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

          this.addCollapseExpandButton(n);
        }
      });
    }
  };

  collapseButton_mouseHoverIn = node => {
    node.singleCirc.classed("collapseExpandButtonHovered", true);
  };
  collapseButton_mouseHoverOut = node => {
    node.singleCirc.classed("collapseExpandButtonHovered", false);
  };

  addCollapseExpandButton = d => {
    //  console.log(d);
    const that = this;
    if (d.collapseExapandGroup) {
      d.collapseExapandGroup.remove();
    }
    // create the hover thing;
    const offsetX = Math.sqrt(50 * 25);

    d.collapseExapandGroup = d.groupRoot.append("g");
    d.singleCirc = d.collapseExapandGroup.append("circle");
    const radius = 15;
    d.singleCirc.attr("r", radius);
    d.singleCirc.attr("cx", offsetX);
    d.singleCirc.attr("cy", -offsetX);
    d.singleCirc.classed("collapseExpandButton", true);

    d.collapseExapandGroup.on("mouseover", () => {
      that.collapseButton_mouseHoverIn(d);
    });
    d.collapseExapandGroup.on("mouseout", () => {
      that.collapseButton_mouseHoverOut(d);
    });

    if (!d.status && d.refereceResource.__nodeType.indexOf("Resource") !== -1) {
      d.status = "unknown";
    }
    // console.log("NODE STATUS", d.status);

    switch (d.status) {
      case "unknown":
        d.collapseExapandGroup.append("title").text("explore element");
        // create icon for that;
        const icon = d.collapseExapandGroup.append("path");
        icon.attr("id", "searchIcon");
        icon.style("fill", "#000");
        icon.style("stroke-width", "0");
        icon.attr(
          "d",
          "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
        );
        icon.attr("transform", "translate(24,-48)");

        d.collapseExapandGroup.on("click", function(e) {
          console.log("WANT TO GET MORE DATA FOR NODE (EXPLORE) !");
          console.log(e);
          that.graphObject.exploreSingleNode(e);
          console.log("Want to collapse a node ");
        });

        break;
      case "collapsed":
        d.collapseExapandGroup.append("title").text("expand node");
        d.collapseExapandGroup
          .append("polygon")
          .attr("points", "15.5,5 11,5 16,12 11,19 15.5,19 20.5,12 ")
          .attr("transform", "translate(25,-48)");
        d.collapseExapandGroup
          .append("polygon")
          .attr("points", "8.5,5 4,5 9,12 4,19 8.5,19 13.5,12 ")
          .attr("transform", "translate(25,-48)");

        d.collapseExapandGroup.on("click", function(e) {
          // that.graph.singleNodeExpansion(that);
          console.log(e);
          console.log("Want to collapse a node ");
        });
        break;
      case "expanded":
        d.collapseExapandGroup.append("title").text("collapse node");

        d.collapseExapandGroup
          .append("polygon")
          .attr("points", "15.5,5 11,5 16,12 11,19 15.5,19 20.5,12 ")
          .attr("transform", "translate(47,-48), scale(-1,1)");
        d.collapseExapandGroup
          .append("polygon")
          .attr("points", "8.5,5 4,5 9,12 4,19 8.5,19 13.5,12 ")
          .attr("transform", "translate(47,-48), scale(-1,1)");

        d.collapseExapandGroup.on("click", function() {
          console.log("want to expand a node ");
        });
        break;
      default:
        console.log("leaf node should not have hovers");
        d.collapseExapandGroup.classed("hidden", true);
    }
  };

  nodeHoverIn(d) {
    const shape = d.renderingShape;
    shape.style("fill", "red");
  }

  nodeHoverOut(d) {
    const shape = d.renderingShape;
    shape.style("fill", d.renderingConfig().style.bgColor);
  }

  nodeDoubleClick(d) {
    // add Handlers
    //  console.log("Node has been double clicked");
    d3.event.stopPropagation(); // Prevent panning
    d3.event.preventDefault();
  }
  nodeClick(d) {
    // add handers; >> this is where we want to overwrite something;
    //  console.log("Node has been single  clicked");
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
