import React, { Component } from "react";
import PropTypes from "prop-types";
import { selectDataSource } from "./redux/actions";
import { connect } from "react-redux";

import VOWLRenderer from "../Implementation/Renderes/gizmoRenderer/vowlGraph";
import OrkgGraph from "../Implementation/Renderes/gizmoRenderer/orkgGraph";
import BasicRenderingHandler from "../Implementation/Renderes/gizmoRenderer/renderingConfigs/BasicRenderingHandler";
import VOWLRenderingHandler from "../Implementation/Renderes/gizmoRenderer/renderingConfigs/VOWLRenderingHandler";
import StaticLocalVowlJSONLoader from "../Implementation/DataAccessComponent/StaticLocalVowlJSONLoader";
import BaseVertexEdgeMapper from "../Implementation/Mappers/BaseVertexEdgeMapper";
import BaseNodeLinkMapper from "../Implementation/Mappers/BaseNodeLinkMapper";
import VOWLParser from "../Implementation/Parsers/VOWLParser";
import SparqlParser from "../Implementation/Parsers/SparqlParser";
import RDFStyledRenderingHandler from "../Implementation/Renderes/gizmoRenderer/renderingConfigs/RDFStyledRenderingHandler";
import UMLStyledRenderingHandler from "../Implementation/Renderes/gizmoRenderer/renderingConfigs/UMLStyledRenderingHandler";
import DBPediaLoader from "../Implementation/DataAccessComponent/DBPediaLoader";
import VowlNodeLinkMapper from "../Implementation/Mappers/VowlNodeLinkMapper";
import RDFNodeLinkMapper from "../Implementation/Mappers/RDFNodeLinkMapper";
import WikiDataLoader from "../Implementation/DataAccessComponent/WikiDataLoader";
import WikiDataExampleParser from "../Implementation/Parsers/WikiDataParserExample";
import OrkgDataLoader from "../Implementation/DataAccessComponent/OrkgDataLoader";
import ORKGParser from "../Implementation/Parsers/ORKGParser";
import OrkgRenderingHandler from "../Implementation/Renderes/gizmoRenderer/renderingConfigs/OrkgRenderingHandler";
import UMLNodeLinkMapper from "../Implementation/Mappers/UMLNodeLinkMapper";

class VisualizationPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offset: 0
    };
    this.renderingModule = "null";
  }

  componentDidMount() {}

  componentDidUpdate = prevProps => {
    // compute the offsets;

    const bb = document
      .getElementById("visualizationPreviewContainer")
      .getBoundingClientRect();

    if (this.state.offset !== bb.y) {
      this.setState({ offset: bb.y });
    }

    if (
      this.props.store.createPreviewVisualization !==
        prevProps.store.createPreviewVisualization &&
      prevProps.store.createPreviewVisualization === true
    ) {
      // clear the visualizations
      this.renderingModule._clearRenderingContainers();
    }

    if (
      this.props.store.createPreviewVisualization !==
        prevProps.store.createPreviewVisualization &&
      this.props.store.createPreviewVisualization === true
    ) {
      // create the rendering modules;
      let renderingModule = new VOWLRenderer();

      let renderingConfig = new BasicRenderingHandler();
      // tell the renderer to use a specific rendering handler;

      if (this.props.store.renderingModuleConfig.configSelected === "VOWL") {
        renderingConfig = new VOWLRenderingHandler();
      }
      if (this.props.store.renderingModuleConfig.configSelected === "RDF") {
        console.log("Creating RDF Styled Rendering Handler");
        renderingConfig = new RDFStyledRenderingHandler();
      }
      if (this.props.store.renderingModuleConfig.configSelected === "UML") {
        console.log("Creating RDF Styled Rendering Handler");
        renderingConfig = new UMLStyledRenderingHandler();
      }
      if (this.props.store.renderingModuleConfig.configSelected === "ORKG") {
        renderingModule = new OrkgGraph();
        console.log("Creating ORKG Rendering Handler");
        renderingConfig = new OrkgRenderingHandler();
      }

      renderingModule.setRenderingConfig(renderingConfig);

      // initialize the pipeline;
      let dah = new StaticLocalVowlJSONLoader();
      let parser = new VOWLParser();
      const mapper_1 = new BaseVertexEdgeMapper();
      let mapper_2 = new BaseNodeLinkMapper();

      // DATA SOURCE AND THEIR PARSERS
      if (this.props.store.selectedDataSource === "DBPedia") {
        dah = new DBPediaLoader();
        parser = new SparqlParser();
      }
      if (this.props.store.selectedDataSource === "WikiData") {
        dah = new WikiDataLoader();
        parser = new WikiDataExampleParser();
      }
      if (this.props.store.selectedDataSource === "ORKG") {
        dah = new OrkgDataLoader();
        parser = new ORKGParser();
      }

      // NODE LINK MAPPERS
      if (this.props.store.selectedNodeLinkMapper === "VOWL") {
        mapper_2 = new VowlNodeLinkMapper();
      }
      if (this.props.store.selectedNodeLinkMapper === "RDF") {
        mapper_2 = new RDFNodeLinkMapper();
      }
      if (this.props.store.selectedNodeLinkMapper === "UML") {
        mapper_2 = new UMLNodeLinkMapper();
      }

      dah.execute().then(() => {
        console.log("DAH Output >> ", dah.getResult());
        parser.setInputData(dah.getResult());
        parser.execute().then(() => {});
        const resourceModel = parser.getResult();
        console.log(resourceModel);
        mapper_1.setInputData(resourceModel);
        mapper_1.execute().then(() => {
          mapper_2.setInputData(mapper_1.getResult());
          mapper_2.execute().then(() => {
            console.log(">>> EVERYTHING IS PREPARED ");
            console.log(mapper_2.getResult().resultingModel.getResult());
            renderingModule.setRenderingContainer("visualizationPreviewArea"); // set div for rendering
            renderingModule.configureGraphInteractions(
              this.props.store.renderingModuleConfig
            );
            renderingModule.setModel(
              mapper_2.getResult().resultingModel.getResult()
            );
            // do the rendering magic
            renderingModule.initializeRenderingContainer();
            renderingModule.createRenderingElements();
            renderingModule.drawRenderingPrimitives();
            this.renderingModule = renderingModule;
          });
        });
      });
    }
  };

  render() {
    return (
      <div style={{ width: "100%", height: "100px" }}>
        <div
          // className="pr-md-5 pt-sm-2 pb-sm-2 pl-sm-2 pr-sm-2 clearfix"
          style={{
            borderRadius: "10px",
            borderWidth: "1px",
            borderColor: "rgb(219,221,229)",
            borderStyle: "solid",
            borderBottomRightRadius: "0",
            borderBottomLeftRadius: "0",
            height: "40px",
            width: "100%",

            color: "white",
            backgroundColor: "#ad2f38"
          }}
        >
          <div style={{ width: "100%", textAlign: "left", padding: "5px" }}>
            {this.props.title}
          </div>
        </div>

        <div
          id="visualizationPreviewContainer"
          style={{
            paddingBottom: "5px",
            borderRadius: "10px",
            borderWidth: "1px",
            borderColor: "rgb(219,221,229)",
            borderStyle: "solid",
            borderTopRightRadius: "0",
            borderTopLeftRadius: "0",
            color: "black",
            backgroundColor: "#ffffff",
            marginTop: "-1px",
            position: "relative",

            width: "100%"
          }}
        >
          <div
            id="visualizationPreviewArea"
            style={{
              height: this.props.store.createPreviewVisualization
                ? window.innerHeight - this.state.offset - 50
                : "10px",
              width: "100%"
            }}
          />
        </div>
      </div>
    );
  }
}

VisualizationPreview.propTypes = {
  title: PropTypes.string,
  store: PropTypes.object
};

const mapStateToProps = state => {
  return {
    store: state.store
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectDataSource: payload => dispatch(selectDataSource(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VisualizationPreview);
