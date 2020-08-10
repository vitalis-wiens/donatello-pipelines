import GraphRenderer from "./graph";
import Interactions from "./Interactions/ORKG_Interactions/interactions";
import "./Interactions/ORKG_Interactions/nodeLoaderAnimation.css";
import OrkgDataLoader from "../../DataAccessComponent/OrkgDataLoader";
import ORKGParser from "../../Parsers/ORKGParser";
import BaseVertexEdgeMapper from "../../Mappers/BaseVertexEdgeMapper";
import BaseNodeLinkMapper from "../../Mappers/BaseNodeLinkMapper";

export default class VOWLRenderer extends GraphRenderer {
  constructor() {
    super();
    this.GRAPH_TYPE = "ORKG_RENDERING_TYPE";

    this.layoutHandler = null;
    this.renderingConfig = null;
    this.interactionHandler = new Interactions();
    this.interactionHandler.initializeInteractions(this);

    this.orkgDataLoader = new OrkgDataLoader();
  }

  /** Exposed functions >> DO NOT OVERWRITE **/
  setExploreAnimation(node, val) {
    if (val === true) {
      const renderingGroup = node.groupRoot;
      node.renderingAnimationGroup = renderingGroup.append("rect");
      const radius = 43;
      node.renderingAnimationGroup.attr("x", -radius);
      node.renderingAnimationGroup.attr("y", -radius);
      node.renderingAnimationGroup.attr("width", 2 * radius);
      node.renderingAnimationGroup.attr("height", 2 * radius);
      node.renderingAnimationGroup.attr("rx", radius);
      node.renderingAnimationGroup.attr("ry", radius);

      node.renderingAnimationGroup.style("stroke-width", "7px");
      node.renderingAnimationGroup.classed("loadingAnimation", true);
    } else {
      if (this.renderingAnimationGroup) {
        this.renderingAnimationGroup.remove();
      }
    }
  }

  getStatementsBySubject = async idObj => {
    this.orkgDataLoader.setRequestResourceId(idObj.id);

    //* ------------- NOTE --------------------*//
    // this is  quick and dirty approach to handle exploration
    // the graph renderer creates a pipeline and processes it to add new input to the model
    // this will be adjusted when component communication is introduced

    const parser = new ORKGParser();
    const resourceModel = parser.getResult();
    const mapper_1 = new BaseVertexEdgeMapper();
    const mapper_2 = new BaseNodeLinkMapper();

    await this.orkgDataLoader.execute();
    parser.setInputData(this.orkgDataLoader.getResult());
    parser.execute().then(() => {});
    mapper_1.setInputData(resourceModel);
    mapper_1.execute().then(() => {});
    mapper_2.setInputData(mapper_1.getResult());
    mapper_2.execute().then(() => {});
    return mapper_2.getResult().resultingModel.getResult();
  };

  getDataFromApi = async resourceId => {
    try {
      const newModel = await this.getStatementsBySubject({ id: resourceId });
      if (newModel.nodes.length === 0 && newModel.link === 0) {
        return {}; // we dont have incremental data
      } else {
        // result is the incremental data we get;
        return newModel;
      }
    } catch (error) {
      return {};
    }
  };

  async singleNodeExploration(node) {
    const idToFetch = node.__id;
    node.nodeHasBeenExplored = true;
    const incrementalData = await this.getDataFromApi(idToFetch);

    if (!incrementalData.nodes) {
      this.setExploreAnimation(node, false);
      node.status = "leafNode";
    } else {
      // create the new nodes;
      incrementalData.nodes.forEach(node => {
        if (!this.nodeMap[node.__nodeLinkIdentifier]) {
          this.createNodePrimitive(node);
        }
      });

      incrementalData.links.forEach(link => {
        if (!this.linkMap[link.__nodeLinkIdentifier]) {
          this.createLinkPrimitive(link);
        } else {
          link.__nodeLinkIdentifier += "$$Clone";
          this.createLinkPrimitive(link);
        }
      });
      node.status = "expanded";
    }
    this.drawNewElements();
  }

  exploreSingleNode(node) {
    this.setExploreAnimation(node, true);
    this.singleNodeExploration(node).then(() => {});
  }

  drawNewElements() {
    this.graphRoot.selectAll("defs").remove();
    this.graphRoot.selectAll("g").remove();

    this._createLayers();
    this.renderedNodes = [];
    this.renderedLinks = [];
    this.redrawRenderingPrimitives();

    if (this.interactionHandler) {
      this.interactionHandler.applyInteractions(this, true);
    } else {
      console.log("No Interaction Handler set, the graph will be static!");
    }
    //
    if (this.layoutHandler) {
      this.layoutHandler.initializeLayoutEngine();
      this.layoutHandler.resumeForce();
    } else {
      console.log("No Layout Handler set, the graph will be static!");
    }
  }

  createRenderingElements() {
    super.createRenderingElements();
    // can be adjusted
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
