import BaseComponent from "../Base/BaseComponent";
import * as $CONST from "../Base/BaseComponentConstants";
import VertexEdgeModel from "../Models/VertexEdgeModel";
import Edge from "../Models/Edge";
import Vertex from "../Models/Vertex";
import { validIRI } from "../Base/globalHelper";

export default class BaseVertexEdgeMapper extends BaseComponent {
  constructor() {
    super();
    this.type = $CONST.TYPE_VERTEX_EDGE_MAPPER; // default type;

    this.requestedInputType = $CONST.TYPE_RESOURCE_RELATION_MODEL;
    this.hasCompatibleInput = false;

    // default definition map!
    this.definitionMap = {
      // mapping definitions; // defines the mapping from resource to vertex
      vertexMapper: {
        __vertexType: "_semanticType", // how do we handle multiple vertex type? << we dont node link model does!
        __vertexEdgeIdentifier: "__resourceIdentifier",
        __displayName: "_annotations.rdfs:label" // will fetch the full object with language defs! node link model gets prefLanguage tag
      },

      edgeMapper: {
        __edgeType: "_semanticType", // how do we handle multiple vertex type? << we dont node link model does!
        __vertexEdgeIdentifier: "__resourceIdentifier",
        __displayName: "_annotations.rdfs:label", // will fetch the full object with language defs! node link model gets prefLanguage tag

        __domainRangePair: "domainRangePairs" // just renaming it
      }
    };
  }

  /** -------------- EXPOSED FUNCTIONS -------------- DO NOT OVERWRITE **/
  setInputData = inputDataAsJsonObject => {
    this.inputDataAsJsonObject = inputDataAsJsonObject;

    // check if type is compatible;
    if (this.requestedInputType === inputDataAsJsonObject.resultingModel.type) {
      this.hasCompatibleInput = true;
    } else {
      console.error(
        "INPUT MODEL IS OF TYPE " +
          inputDataAsJsonObject.resultingModel.type +
          "EXPECTED: " +
          this.requestedInputType
      );
    }
  };

  __run__ = () => {
    if (this.hasCompatibleInput) {
      this.__mapInputModel();
    } else {
      console.error("CANCELLED!");
      this.resultObject.resultingModel = null;
    }
  };

  __adjustEdgeDisplayName(relations) {
    relations.forEach(r => {
      if (!r.__displayName) {
        r.__displayName = r.__vertexEdgeIdentifier;
      }
    });
  }

  __mapInputModel = () => {
    // obtain the data items;
    const model = this.inputDataAsJsonObject.resultingModel;
    const modelData = model.getResult();

    const veModel = new VertexEdgeModel();
    veModel.setResourceIdentifier("__vertexEdgeIdentifier"); // lookup name
    this.__mapResourcesToVertex(veModel, modelData.resources);
    this.__mapRelationsToEdge(veModel, modelData.relations);
    this.__adjustEdgeDisplayName(veModel.modelAsJsonObject.edges);

    this.resultObject.resultingModel = veModel;
  };

  __mapResourcesToVertex(model, dataArray) {
    // note no arrow function, otherwise model will not be updated(call by ref)
    dataArray.forEach(item => {
      const mappedVertex = this._createVertexFromResource(item);
      model.addVertex(mappedVertex);
    });

    // ------------------------AXIOMS HANDLING -----------------------"

    // get model Vertices;
    const vertexList = model.modelAsJsonObject.vertices;
    vertexList.forEach(vertex => {
      // check if vertex._annotations exists;
      if (
        vertex.resourceReference._axioms &&
        Object.keys(vertex.resourceReference._axioms).length > 0
      ) {
        const axiomsArray = vertex.resourceReference._axioms;
        for (const name in axiomsArray) {
          if (axiomsArray.hasOwnProperty(name)) {
            // this a particular axiom;
            const pAx = axiomsArray[name];
            pAx.forEach(axiom => {
              if (!model.vertexInMap(axiom)) {
                console.error(
                  "VERTEX DOES NOT EXIST IN THE MAP: TODO CREATE ONE! "
                );
              }
              const targetVertex = model.getVertexFromName(axiom);
              const axiomEdge = this.__createAxiomEdge(
                vertex,
                name,
                targetVertex
              );
              model.addEdge(axiomEdge);
            });
          }
        }
      }
    });
  }

  __createAxiomEdge(srcVertex, axiomName, targetVertex) {
    const anEdge = new Edge();
    anEdge.resourceReference = axiomName;
    anEdge.__edgeType = "axiomEdge";
    anEdge.__edgeAxiom = axiomName;
    anEdge.__vertexEdgeIdentifier =
      srcVertex.__vertexEdgeIdentifier +
      "$$" +
      axiomName +
      "$$" +
      targetVertex.__vertexEdgeIdentifier;
    anEdge.__displayName = axiomName;
    anEdge.__source = srcVertex;
    anEdge.__target = targetVertex;

    srcVertex.addOutgoingEdge(anEdge);
    targetVertex.addIncomingEdge(anEdge);

    return anEdge;
  }

  _createVertexFromResource = item => {
    const aVertex = new Vertex();
    aVertex.resourceReference = item;

    // create the mappings;
    const vMapper = this.definitionMap.vertexMapper;
    for (const name in vMapper) {
      if (vMapper.hasOwnProperty(name)) {
        // fetch data;
        const dataPath = vMapper[name];
        if (dataPath.indexOf(".") !== -1) {
          // need to perform nested getter;
          const tokens = dataPath.split(".");
          let dataItem = item;
          for (let i = 0; i < tokens.length; i++) {
            dataItem = dataItem[tokens[i]];
          }
          aVertex[name] = dataItem;
        } else {
          // single data access in item
          aVertex[name] = item[dataPath];
        }
      }
    }
    return aVertex;
  };

  __mapRelationsToEdge(model, dataArray) {
    // note no arrow function, otherwise model will not be updated(call by ref)
    dataArray.forEach(item => {
      const mappedEdge = this._createEdgeFromRelation(item);
      for (let i = 0; i < mappedEdge.__domainRangePair.length; i++) {
        const newEdge = this._createEdgeFromRelation(item);
        const source = newEdge.__domainRangePair[i].domain;
        const target = newEdge.__domainRangePair[i].range;
        const src_vertex = model.getVertexFromName(source);
        const tar_vertex = model.getVertexFromName(target);

        if (src_vertex) {
          newEdge.__source = src_vertex;
          src_vertex.addOutgoingEdge(newEdge);
        } else {
          // console.warn("Could not find source vertex for name ", source);
        }

        if (tar_vertex) {
          newEdge.__target = tar_vertex;
          tar_vertex.addOutgoingEdge(newEdge);
        } else {
          if (
            model.getVertexFromName(
              newEdge.__vertexEdgeIdentifier + "$$" + target
            )
          ) {
            const tempVertex = model.getVertexFromName(
              newEdge.__vertexEdgeIdentifier + "$$" + target
            );
            newEdge.__target = tempVertex;
            tempVertex.addIncomingEdge(mappedEdge);
          } else {
            const aVertex = new Vertex();
            aVertex.resourceReference = target;
            if (validIRI(target)) {
              // create the id for this vertex;
              aVertex.__vertexEdgeIdentifier = target;
            } else {
              aVertex.__vertexType = "Literal";
              // its id is the full tripple;
              aVertex.__vertexEdgeIdentifier =
                newEdge.__vertexEdgeIdentifier + "$$" + target;
              aVertex.__displayName = target; // this is the literal value of something we have not identified
            }
            // we assume that all resources are created (the ones which could be created)
            // otherwise we point on a literal or a resource that has not been created>> means external resource or
            // not jet read any information about that;
            aVertex.addIncomingEdge(newEdge);
            model.addVertex(aVertex);
            newEdge.__target = aVertex;
          }
        }
        if (model.edgeMap[newEdge.__vertexEdgeIdentifier]) {
          const clonedEdge = new Edge();
          const sourceEdge = model.edgeMap[newEdge.__vertexEdgeIdentifier];
          for (const name in sourceEdge) {
            if (sourceEdge.hasOwnProperty(name)) {
              if (name !== "__domainRangePair") {
                clonedEdge[name] = sourceEdge[name];
              }
            }
          }
          clonedEdge.__source = newEdge.__source;
          clonedEdge.__target = newEdge.__target;

          if (!clonedEdge.__displayName) {
            clonedEdge.__displayName = clonedEdge.__vertexEdgeIdentifier;
          }
          clonedEdge.__vertexEdgeIdentifier += "$$ClonedEdge" + i;

          model.addEdge(clonedEdge);
        } else {
          model.addEdge(newEdge);
        }
      }
    });
  }

  _createEdgeFromRelation = item => {
    const anEdge = new Edge();
    anEdge.resourceReference = item;

    // create based on the mapping def;
    const eMapper = this.definitionMap.edgeMapper;
    for (const name in eMapper) {
      if (eMapper.hasOwnProperty(name)) {
        // fetch data;
        const dataPath = eMapper[name];
        if (dataPath.indexOf(".") !== -1) {
          // need to perform nested getter;
          const tokens = dataPath.split(".");
          let dataItem = item;
          for (let i = 0; i < tokens.length; i++) {
            dataItem = dataItem[tokens[i]];
          }
          anEdge[name] = dataItem;
        } else {
          // single data access in item
          anEdge[name] = item[dataPath];
        }
      }
    }
    return anEdge;
  };
}
