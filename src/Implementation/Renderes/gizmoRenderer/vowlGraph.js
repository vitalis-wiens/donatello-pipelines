import GraphRenderer from "./graph";
import Interactions from "./Interactions/interactions";
export default class VOWLRenderer extends GraphRenderer {
  constructor() {
    super();
    this.GRAPH_TYPE = "VOWL_RENDERING_TYPE";

    this.layoutHandler = null;
    this.renderingConfig = null;
    this.interactionHandler = new Interactions();
  }

  createRenderingElements() {
    super.createRenderingElements();

    this.createPrimitives();

    // some link positions init
    let i = 0;
    this.links.forEach(link => {
      this.updateMultiLinkTypes(link);
      link.setPosition(200, i * 50);
      i++;
    });
  }
}
