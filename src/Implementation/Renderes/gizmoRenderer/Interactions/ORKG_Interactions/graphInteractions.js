import * as d3 from "d3";

export default class GraphInteractions {
  constructor(graph) {
    this.graphObject = graph;
    this.zoom = undefined;
    this.graphTranslation = [0, 0];
    this.zoomFactor = 1.0;
    this.transformAnimation = false;

    this.zoomEnabled = true;
    this.dragEnabled = true;
  }

  enableMouseZoom = val => {
    this.zoomEnabled = val;
  };
  enableMouseDrag = val => {
    this.dragEnabled = val;
  };

  applyGraphInteractions = redrawCall => {
    if (redrawCall) {
      return;
    }
    if (!this.graphObject) {
      return;
    }
    // graph interactions are zoom and drag operations
    const that = this;

    // Apply the zooming factor.
    this.zoom = d3.behavior
      .zoom()
      .duration(150)
      .scaleExtent([0.02, 5])
      .on("zoom", this.zoomed)
      .on("zoomstart", function() {
        if (
          d3.event.sourceEvent &&
          d3.event.sourceEvent.buttons &&
          d3.event.sourceEvent.buttons === 1
        ) {
          that.graphObject.svgRoot.style("cursor", "all-scroll");
        }
      })
      .on("zoomend", function() {
        that.graphObject.svgRoot.style("cursor", "auto");
      });

    this.graphObject.svgRoot.call(this.zoom);
    this.zoom = this.zoom.scaleExtent([0.02, 5]);
    if (this.graphObject.graphRoot) {
      this.zoom.event(this.graphObject.graphRoot);
    }
  };

  resetUserLayout = () => {
    const graph = this.graphObject;
    const graphContainer = graph.graphRoot;
    graphContainer.attr(
      "transform",
      "translate(" + this.graphTranslation + ")scale(" + this.zoomFactor + ")"
    );
  };

  zoomed = () => {
    if (d3.event.sourceEvent) {
      d3.event.sourceEvent.preventDefault();
      d3.event.sourceEvent.stopPropagation();
    }

    const that = this;
    const graph = this.graphObject;
    const graphContainer = graph.graphRoot;
    let zoomEventByMWheel = false;
    if (d3.event.sourceEvent) {
      if (d3.event.sourceEvent.deltaY) {
        zoomEventByMWheel = true;
      }
    }
    if (zoomEventByMWheel === false) {
      if (this.transformAnimation === true) {
        return;
      }
      this.zoomFactor = d3.event.scale;
      this.graphTranslation = d3.event.translate;
      graphContainer.attr(
        "transform",
        "translate(" + this.graphTranslation + ")scale(" + this.zoomFactor + ")"
      );
      return;
    }
    /** animate the transition **/
    this.zoomFactor = d3.event.scale;
    this.graphTranslation = d3.event.translate;
    graphContainer
      .transition()
      .tween("attr.translate", function() {
        return function() {
          // need the that ptr to the object
          that.transformAnimation = true;
          const tr = d3.transform(graphContainer.attr("transform"));
          that.graphTranslation[0] = tr.translate[0];
          that.graphTranslation[1] = tr.translate[1];
          that.zoomFactor = tr.scale[0];
        };
      })
      .each("end", function() {
        that.transformAnimation = false;
      })
      .attr(
        "transform",
        "translate(" + that.graphTranslation + ")scale(" + that.zoomFactor + ")"
      )
      .ease("linear")
      .duration(250);
  };
}
