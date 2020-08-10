import GraphInteractions from "./graphInteractions";
import NodeInteractions from "./nodeInteractions";
import LinkInteractions from "./linkInteractions";

export default class Interactions {
  constructor() {
    this.graphInteractions = null;
    this.nodeInteractions = null;
    this.linkInteractions = null;
  }

  initializeInteractions(graph) {
    this.graphInteractions = new GraphInteractions(graph);
    this.nodeInteractions = new NodeInteractions(graph);
    this.linkInteractions = new LinkInteractions(graph);
  }

  applyInteractions(graph, redrawCall) {
    /** GRAPH INTERACTION **/
    if (!this.graphInteractions) {
      console.warn(
        "NO GRAPH INTERACTIONS DEFINED!  << Creating default ones >> "
      );
      this.graphInteractions = new GraphInteractions(graph);
    }
    this.graphInteractions.applyGraphInteractions(redrawCall);

    /** NODE INTERACTION **/
    if (!this.nodeInteractions) {
      console.warn(
        "NO NODE INTERACTIONS DEFINED!  << Creating default ones >> "
      );
      this.nodeInteractions = new NodeInteractions(graph);
    }
    this.nodeInteractions.applyNodeInteractions(redrawCall);

    /** LINK INTERACTION **/
    if (!this.linkInteractions) {
      console.warn(
        "NO LINK INTERACTIONS DEFINED!  << Creating default ones >> "
      );
      this.linkInteractions = new LinkInteractions(graph);
    }
    this.linkInteractions.applyLinkInteractions(redrawCall);
  }
}
