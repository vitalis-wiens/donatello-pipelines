// data handler is a base class;

import * as $CONST from "../Base/BaseComponentConstants";
import BaseNodeLinkMapper from "./BaseNodeLinkMapper";

export default class NodeLinkMapper extends BaseNodeLinkMapper {
  constructor() {
    super();
    this.type = $CONST.TYPE_VERTEX_EDGE_MAPPER; // default type;

    this.requestedInputType = $CONST.TYPE_VERTEX_EDGE_MODEL;
    this.hasCompatibleInput = false;

    this.prefixMapperL2S = {
      "http://www.w3.org/1999/02/22-rdf-syntax-ns#": "rdf",
      "http://www.w3.org/2000/01/rdf-schema#": "rdfs",
      "http://www.w3.org/2002/07/owl#": "owl",
      "http://www.w3.org/2001/XMLSchema#": "xsd",
      "http://purl.org/dc/elements/1.1/": "dc",
      "http://www.w3.org/XML/1998/namespace": "xml",
      "http://xmlns.com/wot/0.1/": "wot",
      "http://www.w3.org/2003/06/sw-vocab-status/ns#": "vs",
      "http://xmlns.com/foaf/0.1/": "foaf",
      "http://www.w3.org/2004/02/skos/core#": "skos"
    };

    this.definitionMap = {
      nodeMapper: {
        __nodeType: "__vertexType",
        __nodeLinkIdentifier: "__vertexEdgeIdentifier",
        __displayName: "__displayName"
      },
      linkMapper: {
        __linkType: "__edgeType",
        __nodeLinkIdentifier: "__vertexEdgeIdentifier",
        __displayName: "__displayName",
        __linkAxiom: "__edgeAxiom",
        __source: "__source",
        __target: "__target"
      },
      nodeMerge: [
        {
          __linkType: "axiomLink",
          __displayName: "owl:equivalentClass"
        }
      ],
      nodeSplit: [
        {
          constraints: "none",
          type: ["rdfs:Literal"]
          // there could be more types like xsd:datatype or so
        }
      ],
      auxiliaryNodes: [] // here empty
    };
  }
}
