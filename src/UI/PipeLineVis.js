import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  createPreviewVisualization,
  updateRenderingModuleConfiguration
} from "./redux/actions";
import { connect } from "react-redux";
import TabLikeHeader from "./TabLikeHeader";
import { Button } from "reactstrap";

import createZip from "./createZip";
import VisModal from "./VisModal";
import StaticLocalVowlJSONLoader from "../Implementation/DataAccessComponent/StaticLocalVowlJSONLoader";
import VOWLParser from "../Implementation/Parsers/VOWLParser";
import SparqlParser from "../Implementation/Parsers/SparqlParser";
import BaseVertexEdgeMapper from "../Implementation/Mappers/BaseVertexEdgeMapper";
import BaseNodeLinkMapper from "../Implementation/Mappers/BaseNodeLinkMapper";
import RenderingModuleConfig from "./RenderingModuleConfig";
import DataAccessConfigurator from "./DataAccessConfigurator";
import WikiDataAccessConfigurator from "./WikiDataAccessConfigurator";

import DBPediaLoader from "../Implementation/DataAccessComponent/DBPediaLoader";
import WikiDataLoader from "../Implementation/DataAccessComponent/WikiDataLoader";
import RDFNodeLinkMapper from "../Implementation/Mappers/RDFNodeLinkMapper";
import WikiDataExampleParser from "../Implementation/Parsers/WikiDataParserExample";
import ORKGAccessConfigurator from "./ORKGAccessConfigurator";
import OrkgDataLoader from "../Implementation/DataAccessComponent/OrkgDataLoader";
import ORKGParser from "../Implementation/Parsers/ORKGParser";
import UMLNodeLinkMapper from "../Implementation/Mappers/UMLNodeLinkMapper";
import VowlNodeLinkMapper from "../Implementation/Mappers/VowlNodeLinkMapper";

class PipeLineVis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      selectedModule: undefined,
      selectionType: undefined,

      dataAccessHandlerExecuted: false,
      resourceRelationModel: undefined,

      vertexEdgeMapperExecuted: false,
      vertexEdgeModel: undefined,

      nodeLinkMapperExecuted: false,
      nodeLinkModel: undefined
    };

    this.basicVertexEdgeMapper = new BaseVertexEdgeMapper();
    this.basicNodeLinkMapper = new BaseNodeLinkMapper();

    this.childState = {
      graph_mouseZoom: true,
      graph_mouseDrag: true,
      node_mouseDrag: true,
      node_mouseHover: true,
      node_mouseSingleClick: true,
      node_mouseDoubleClick: true,
      link_mouseDrag: true,
      link_mouseHover: true,
      // todo: link clicks ;
      graphBgColor: "#FFFFFF",

      // internal state stuffl
      configSelectionOpen: false,
      configSelected: "Default"
    };

    this.dataAccessHandler_DBPediaState = {
      endpointURL: "http://live.dbpedia.org/sparql/",
      graphURL: "http://dbpedia.org",
      query:
        "PREFIX dbr: <http://dbpedia.org/resource/>\n" +
        "PREFIX dbo: <http://dbpedia.org/ontology/>\n" +
        "PREFIX owl: <http://www.w3.org/2002/07/owl#>\n" +
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
        "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n\n" +
        "SELECT  DISTINCT ?subject ?predicate ?object WHERE { \n" +
        "{dbr:Nikola_Tesla ?predicate ?object.\n" +
        "?object a owl:Class} \n" +
        "UNION {\n" +
        "dbr:Nikola_Tesla dbo:birthDate ?object.\n" +
        "BIND(dbo:birthDate as ?predicate)\n" +
        "}\n" +
        "UNION {\n" +
        "dbr:Nikola_Tesla dbo:deathDate ?object.\n" +
        "BIND(dbo:deathDate as ?predicate)\n" +
        "}\n" +
        "UNION {\n" +
        "dbr:Nikola_Tesla rdfs:label ?object.\n" +
        "BIND(rdfs:label as ?predicate)\n" +
        "}\n" +
        "UNION {\n" +
        "dbr:Nikola_Tesla rdfs:comment ?object.\n" +
        "BIND(rdfs:comment as ?predicate)\n" +
        "}\n" +
        "UNION {\n" +
        "dbr:Nikola_Tesla ?foafPredicate ?object.\n" +
        'FILTER(STRSTARTS(STR(?foafPredicate), "http://xmlns.com/foaf/0.1/"))\n' +
        "BIND(?foafPredicate as ?predicate)\n" +
        "}\n" +
        'FILTER(!isLiteral(?object) ||langMatches(lang(?object),"EN") || datatype(?object)=xsd:date)\n' +
        "BIND(dbr:Nikola_Tesla as ?subject)}\n" +
        "Limit 100",
      queryResult: ""
    };
  }

  componentDidMount() {}

  componentDidUpdate = prevProps => {
    if (
      prevProps.store.selectedDataSource !== this.props.store.selectedDataSource
    ) {
      this.props.createPreviewVisualization(false);
      this.setState({
        dataAccessHandlerExecuted: false,
        resourceRelationModel: undefined,
        vertexEdgeMapperExecuted: false,
        vertexEdgeModel: undefined
      });
    }

    if (
      prevProps.store.selectedNodeLinkMapper !==
      this.props.store.selectedNodeLinkMapper
    ) {
      this.props.createPreviewVisualization(false);
      this.setState({
        nodeLinkMapperExecuted: false,
        nodeLinkModel: undefined
      });
    }
  };

  exportPipeline = () => {
    // read a zip file

    const zipper = new createZip(this.props.store);
    zipper.execute();
  };

  propagate_DBPEdiaConfiguratorState = state => {
    this.dataAccessHandler_DBPediaState = state;
  };

  propagateState = state => {
    this.childState = state;
    if (this.props.store.createPreviewVisualization) {
      this.props.createPreviewVisualization(false);
    }
  };

  // node link mapper functions ;
  configureNodeLinkMapper = moduleName => {
    this.setState({
      showModal: true,
      selectedModule: "Node Link Mapper",
      selectionType: "configure"
    });
  };

  executeNodeLinkMapper = moduleName => {
    if (moduleName === "Basic Mapper") {
      // create a simple data access handler and execute it;
      if (this.state.vertexEdgeModel) {
        this.basicNodeLinkMapper.setInputData(this.state.vertexEdgeModel);

        this.basicNodeLinkMapper.execute().then(() => {
          const nodeLinkModel = this.basicNodeLinkMapper.getResult();
          this.setState({
            nodeLinkMapperExecuted: true,
            nodeLinkModel: nodeLinkModel
          });
        });
      }
    }
    if (moduleName === "VOWL") {
      if (this.state.vertexEdgeModel) {
        const vowlNodeLinkMapper = new VowlNodeLinkMapper();
        vowlNodeLinkMapper.setInputData(this.state.vertexEdgeModel);
        vowlNodeLinkMapper.execute().then(() => {
          const nodeLinkModel = vowlNodeLinkMapper.getResult();
          this.setState({
            nodeLinkMapperExecuted: true,
            nodeLinkModel: nodeLinkModel
          });
        });
      }
    }

    if (moduleName === "RDF") {
      if (this.state.vertexEdgeModel) {
        const rdfNodeLinkMapper = new RDFNodeLinkMapper();
        rdfNodeLinkMapper.setInputData(this.state.vertexEdgeModel);
        rdfNodeLinkMapper.execute().then(() => {
          const nodeLinkModel = rdfNodeLinkMapper.getResult();
          this.setState({
            nodeLinkMapperExecuted: true,
            nodeLinkModel: nodeLinkModel
          });
        });
      }
    }

    if (moduleName === "UML") {
      if (this.state.vertexEdgeModel) {
        const umlNodeLinkMapper = new UMLNodeLinkMapper();
        umlNodeLinkMapper.setInputData(this.state.vertexEdgeModel);
        umlNodeLinkMapper.execute().then(() => {
          const nodeLinkModel = umlNodeLinkMapper.getResult();
          this.setState({
            nodeLinkMapperExecuted: true,
            nodeLinkModel: nodeLinkModel
          });
        });
      }
    }
  };

  viewNodeLinkMapperOutput = moduleName => {
    this.setState({
      showModal: true,
      selectedModule: "Node Link Mapper",
      selectionType: "viewOutput"
    });
  };

  /** this function is just for previewing the output of individual modules **/
  replacer(key, value) {
    // Filtering out properties
    if (
      key === "__outgoingEdges" ||
      key === "__incomingEdges" ||
      key === "__outgoingLinks" ||
      key === "__incomingLinks" ||
      key === "resourceReference"
    ) {
      return undefined;
    }
    return value;
  }

  configureVertexEdgeMapper = moduleName => {
    this.setState({
      showModal: true,
      selectedModule: "Vertex Edge Mapper",
      selectionType: "configure"
    });
  };
  executeVertexEdgeMapper = moduleName => {
    if (moduleName === "Basic Mapper") {
      // create a simple data access handler and execute it;
      if (this.state.resourceRelationModel) {
        this.basicVertexEdgeMapper.setInputData(
          this.state.resourceRelationModel
        );

        this.basicVertexEdgeMapper.execute().then(() => {
          const vertexEdgeModel = this.basicVertexEdgeMapper.getResult();
          this.setState({
            vertexEdgeMapperExecuted: true,
            vertexEdgeModel: vertexEdgeModel
          });
        });
      }
    }
  };
  viewVertexEdgeMapperOutput = moduleName => {
    this.setState({
      showModal: true,
      selectedModule: "Vertex Edge Mapper",
      selectionType: "viewOutput"
    });
  };

  configureDataAccessHandler = moduleName => {
    this.setState({
      showModal: true,
      selectedModule: "Data Access Handler",
      selectionType: "configure"
    });
  };

  viewDataAccessHandlerOutput = moduleName => {
    this.setState({
      showModal: true,
      selectedModule: "Data Access Handler",
      selectionType: "viewOutput"
    });
  };

  executeDataAccessHandler = moduleName => {
    let dataAccess = undefined;
    let parser = undefined;

    switch (moduleName) {
      case "Ontology File":
        dataAccess = new StaticLocalVowlJSONLoader();
        parser = new VOWLParser();
        break;

      case "DBPedia":
        dataAccess = new DBPediaLoader();
        parser = new SparqlParser();
        break;

      case "WikiData":
        dataAccess = new WikiDataLoader();
        parser = new WikiDataExampleParser();
        break;

      case "ORKG":
        dataAccess = new OrkgDataLoader();
        parser = new ORKGParser();
        break;

      default: {
        console.log("UNKNOWN EXECUTION MODULE NAME");
        return;
      }
    }

    console.log(dataAccess);
    dataAccess.execute().then(() => {
      parser.setInputData(dataAccess.getResult());
      parser.execute().then(() => {
        const resourceModel = parser.getResult();
        this.setState({
          dataAccessHandlerExecuted: true,
          resourceRelationModel: resourceModel
        });
      });
    });
  };

  executeRenderingModule = () => {
    this.props.createPreviewVisualization(true);
    if (this.childState.hasOwnProperty("graph_mouseZoom")) {
      this.props.updateRenderingModuleConfiguration(this.childState);
    }
  };

  configureRenderingModule = () => {
    this.setState({
      showModal: true,
      selectedModule: "Rendering Module",
      selectionType: "configure"
    });
  };

  renderDataAccessHandler = () => {
    const moduleName = this.props.store.selectedDataSource;
    return (
      <TabLikeHeader
        title="Data Access Handler "
        position="left"
        width={330}
        collapsable={false}
      >
        {moduleName}
        <hr style={{ margin: "1px" }} />
        <div
          style={{
            textAlign: "left",
            display: "inline"
          }}
        >
          <Button
            style={{ padding: "2px", margin: "5px" }}
            onClick={() => {
              this.configureDataAccessHandler(moduleName);
            }}
          >
            Configure
          </Button>
          <Button
            style={{
              padding: "2px",
              margin: "5px",
              backgroundColor: this.state.dataAccessHandlerExecuted
                ? "#2f7d38"
                : "#6c757d"
            }}
            onClick={() => {
              this.executeDataAccessHandler(moduleName);
            }}
          >
            Execute
          </Button>
          <Button
            style={{
              padding: "2px",
              margin: "5px",
              backgroundColor: this.state.resourceRelationModel
                ? "#2f7d38"
                : "#6c757d"
            }}
            onClick={() => {
              this.viewDataAccessHandlerOutput(moduleName);
            }}
          >
            View Output
          </Button>
        </div>
      </TabLikeHeader>
    );
  };

  renderVertexEdgeMapper = () => {
    const moduleName = this.props.store.selectedVertexEdgeMapper;
    return (
      <TabLikeHeader
        title="Vertex Edge Mapper"
        position="left"
        width={320}
        collapsable={false}
      >
        {moduleName}
        <hr style={{ margin: "1px" }} />
        <div
          style={{
            textAlign: "left",
            display: "inline"
          }}
        >
          <Button
            style={{ padding: "2px", margin: "5px" }}
            onClick={() => {
              this.configureVertexEdgeMapper(moduleName);
            }}
          >
            Configure
          </Button>
          <Button
            style={{
              padding: "2px",
              margin: "5px",
              backgroundColor: this.state.vertexEdgeMapperExecuted
                ? "#2f7d38"
                : "#6c757d"
            }}
            onClick={() => {
              this.executeVertexEdgeMapper(moduleName);
            }}
          >
            Execute
          </Button>
          <Button
            style={{
              padding: "2px",
              margin: "5px",
              backgroundColor: this.state.vertexEdgeModel
                ? "#2f7d38"
                : "#6c757d"
            }}
            onClick={() => {
              this.viewVertexEdgeMapperOutput(moduleName);
            }}
          >
            View Output
          </Button>
        </div>
      </TabLikeHeader>
    );
  };

  renderNodeLinkMapper = () => {
    const moduleName = this.props.store.selectedNodeLinkMapper;
    return (
      <TabLikeHeader
        title="Node Link Mapper"
        position="left"
        width={320}
        collapsable={false}
      >
        {moduleName}
        <hr style={{ margin: "1px" }} />
        <div
          style={{
            textAlign: "left",
            display: "inline"
          }}
        >
          <Button
            style={{ padding: "2px", margin: "5px" }}
            onClick={() => {
              this.configureNodeLinkMapper(moduleName);
            }}
          >
            Configure
          </Button>
          <Button
            style={{
              padding: "2px",
              margin: "5px",
              backgroundColor: this.state.nodeLinkMapperExecuted
                ? "#2f7d38"
                : "#6c757d"
            }}
            onClick={() => {
              this.executeNodeLinkMapper(moduleName);
            }}
          >
            Execute
          </Button>
          <Button
            style={{
              padding: "2px",
              margin: "5px",
              backgroundColor: this.state.nodeLinkModel ? "#2f7d38" : "#6c757d"
            }}
            onClick={() => {
              this.viewNodeLinkMapperOutput(moduleName);
            }}
          >
            View Output
          </Button>
        </div>
      </TabLikeHeader>
    );
  };

  renderRenderingModule = () => {
    const moduleName = "Rendering ModuleTest";
    return (
      <TabLikeHeader
        title="Rendering Module"
        position="left"
        width={320}
        collapsable={false}
      >
        {moduleName}
        <hr style={{ margin: "1px" }} />
        <div
          style={{
            textAlign: "left",
            display: "inline"
          }}
        >
          <Button
            style={{ padding: "2px", margin: "5px" }}
            onClick={() => {
              this.executeRenderingModule(moduleName);
            }}
          >
            Execute
          </Button>
          <Button
            style={{ padding: "2px", margin: "5px" }}
            onClick={() => {
              this.configureRenderingModule(moduleName);
            }}
          >
            Configure
          </Button>
        </div>
      </TabLikeHeader>
    );
  };

  toggle = type => {
    this.setState(prevState => ({
      [type]: !prevState[type]
    }));
  };

  render() {
    return (
      <div style={{ width: "100%" }}>
        <div
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
          style={{
            borderRadius: "10px",
            padding: "10px",
            borderWidth: "1px",
            borderColor: "rgb(219,221,229)",
            borderStyle: "solid",
            borderTopRightRadius: "0",
            borderTopLeftRadius: "0",
            color: "black",
            backgroundColor: "#ffffff",
            marginTop: "-1px",
            position: "relative",
            height: "90%",
            width: "100%"
          }}
        >
          <div
            style={{
              width: "100%",
              height: "200px",
              textAlign: "center",
              display: "flex",
              flexFlow: "wrap",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {this.renderDataAccessHandler()}
            {this.renderVertexEdgeMapper()}
            {this.renderNodeLinkMapper()}
            {this.renderRenderingModule()}
          </div>
          <Button
            style={{ height: 50, width: "100%" }}
            onClick={() => this.exportPipeline()}
          >
            {" "}
            Export Pipeline{" "}
          </Button>
        </div>

        {this.state.selectedModule === "Data Access Handler" && (
          <VisModal
            title={
              this.state.selectedModule +
              ": " +
              this.props.store.selectedDataSource
            }
            toggle={() => this.toggle("showModal")}
            showDialog={this.state.showModal}
          >
            <div>
              {this.props.store.selectedDataSource === "Ontology File" &&
                this.state.selectionType === "configure" && (
                  <div style={{ padding: "5px" }}>
                    <div>This Module is not configurable in the demo.</div>
                    <div>
                      We are using an ontology file that has been converted
                      using OWL2VOWL (input is a JSON file)
                    </div>
                    <div>
                      You can find the file in{" "}
                      <b>"src/demoRequests/ontologyFile.json"</b>
                    </div>
                  </div>
                )}
              {this.props.store.selectedDataSource === "DBPedia" &&
                this.state.selectionType === "configure" && (
                  <DataAccessConfigurator
                    statePropagation={this.propagate_DBPEdiaConfiguratorState}
                  />
                )}

              {this.props.store.selectedDataSource === "WikiData" &&
                this.state.selectionType === "configure" && (
                  <WikiDataAccessConfigurator
                    statePropagation={() => {
                      console.log("TODO");
                    }}
                  />
                )}

              {this.props.store.selectedDataSource === "ORKG" &&
                this.state.selectionType === "configure" && (
                  <ORKGAccessConfigurator
                    statePropagation={() => {
                      console.log("TODO");
                    }}
                  />
                )}

              {this.state.selectionType === "viewOutput" &&
                this.state.selectedModule === "Data Access Handler" && (
                  <div style={{ padding: "5px" }}>
                    <div>
                      {" "}
                      Data Access Handler Output (Resource Relation Model)
                    </div>
                    {this.state.resourceRelationModel ? (
                      <textarea
                        rows="10"
                        cols="50"
                        style={{ width: "100%", height: "100%" }}
                        readOnly={true}
                        value={JSON.stringify(
                          this.state.resourceRelationModel.resultingModel
                            .modelAsJsonObject,
                          null,
                          " \t"
                        )}
                      />
                    ) : (
                      "Execute the module first."
                    )}
                  </div>
                )}
            </div>
          </VisModal>
        )}

        {/*RENDER CONFIG FUR VERTEX EDGE MAPPER */}
        {this.state.selectedModule === "Vertex Edge Mapper" && (
          <VisModal
            title={
              this.state.selectedModule +
              ": " +
              this.props.store.selectedVertexEdgeMapper
            }
            toggle={() => this.toggle("showModal")}
            showDialog={this.state.showModal}
          >
            <div>
              {this.props.store.selectedVertexEdgeMapper === "Basic Mapper" &&
                this.state.selectionType === "configure" && (
                  <div style={{ padding: "5px" }}>
                    <div>This Module is not configurable in the demo.</div>
                    <textarea
                      rows="10"
                      cols="50"
                      readOnly={true}
                      style={{ width: "100%", height: "100%" }}
                      value={JSON.stringify(
                        this.basicVertexEdgeMapper.definitionMap,
                        null,
                        " \t"
                      )}
                    />
                  </div>
                )}

              {this.state.selectionType === "viewOutput" && (
                <div>
                  <div>Vertex Edge Mapper Output (Vertex Edge Model)</div>
                  {this.state.vertexEdgeModel ? (
                    <textarea
                      rows="10"
                      cols="50"
                      readOnly={true}
                      style={{ width: "100%", height: "100%" }}
                      value={JSON.stringify(
                        this.state.vertexEdgeModel.resultingModel
                          .modelAsJsonObject,
                        this.replacer,
                        " \t"
                      )}
                    />
                  ) : (
                    "Execute the module first."
                  )}
                </div>
              )}
            </div>
          </VisModal>
        )}

        {/*RENDER CONFIG FOR NODE LINK  MAPPER */}
        {this.state.selectedModule === "Node Link Mapper" && (
          <VisModal
            title={
              this.state.selectedModule +
              ": " +
              this.props.store.selectedVertexEdgeMapper
            }
            toggle={() => this.toggle("showModal")}
            showDialog={this.state.showModal}
          >
            <div>
              {this.props.store.selectedVertexEdgeMapper === "Basic Mapper" &&
                this.state.selectionType === "configure" && (
                  <div style={{ padding: "5px" }}>
                    <div>This Module is not configurable in the demo.</div>
                    <textarea
                      rows="10"
                      cols="50"
                      readOnly={true}
                      style={{ width: "100%", height: "100%" }}
                      value={JSON.stringify(
                        this.basicNodeLinkMapper.definitionMap,
                        this.replacer,
                        " \t"
                      )}
                    />
                  </div>
                )}

              {this.state.selectionType === "viewOutput" && (
                <div>
                  <div>Node Link Mapper Output (Vertex Edge Model)</div>
                  {this.state.nodeLinkModel ? (
                    <textarea
                      rows="10"
                      cols="50"
                      readOnly={true}
                      style={{ width: "100%", height: "100%" }}
                      value={JSON.stringify(
                        this.state.nodeLinkModel.resultingModel
                          .modelAsJsonObject,
                        this.replacer,
                        " \t"
                      )}
                    />
                  ) : (
                    "Execute the module first."
                  )}
                </div>
              )}
            </div>
          </VisModal>
        )}
        {this.state.selectedModule === "Rendering Module" && (
          <VisModal
            title={this.state.selectedModule + "-- Configuration "}
            toggle={() => this.toggle("showModal")}
            showDialog={this.state.showModal}
          >
            <div>
              <RenderingModuleConfig
                propagateState={this.propagateState}
                nodeLinkModel={this.state.nodeLinkModel}
                initialState={this.childState}
              />
            </div>
          </VisModal>
        )}
      </div>
    );
  }
}

PipeLineVis.propTypes = {
  title: PropTypes.string,
  selectedDataSource: PropTypes.string,
  store: PropTypes.object,
  createPreviewVisualization: PropTypes.func,
  updateRenderingModuleConfiguration: PropTypes.func
};

const mapStateToProps = state => {
  return {
    store: state.store
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createPreviewVisualization: payload =>
      dispatch(createPreviewVisualization(payload)),
    updateRenderingModuleConfiguration: payload => {
      dispatch(updateRenderingModuleConfiguration(payload));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PipeLineVis);
