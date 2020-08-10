import * as $CONST from "../Base/BaseComponentConstants";
import BaseModel from "../Base/BaseModel";

export default class VertexEdgeModel extends BaseModel {
  constructor() {
    super();
    this.type = $CONST.TYPE_VERTEX_EDGE_MODEL; // default type;

    // initialize the model with array of resources and relations;
    this.modelAsJsonObject = { vertices: [], edges: [] };

    // create mappers for resources and relations;
    this.vertexeMap = {};
    this.edgeMap = {};

    this.__resourceIdentifier = "__vertexEdgeIdentifier"; // default, assume forced ids from outside;
  }

  vertexInMap(name) {
    // this is for axioms checking;
    return this.__isInMap__(this.vertexeMap, name);
  }

  getVertexFromName(name) {
    return this.vertexeMap[name];
  }

  /** -------------- Must OVERWRITE FUNCTIONS --------------**/
  __isInMap__ = (map, identifier) => {
    if (!identifier) {
      console.error(
        "No Identifier Found in resource! give it unique ids as properties and set the resourceIdentifier name (setResourceIdentifier('ID'))"
      );
    } else {
      return !!map[identifier];
    }

    return true; // if is in map (per default this blocks to add items to model)!
  };

  __resourceIdentifier__ = resourceObject => {
    return resourceObject[this.__resourceIdentifier];
  };

  /** -------------- Exposed Functions --------------**/

  addVertex = vertex => {
    if (
      !this.__isInMap__(this.vertexeMap, this.__resourceIdentifier__(vertex))
    ) {
      this.__integrateVertexEdgeItem(
        this.modelAsJsonObject.vertices,
        this.vertexeMap,
        vertex
      );
    }
  };

  addEdge = edge => {
    if (!this.__isInMap__(this.edgeMap, this.__resourceIdentifier__(edge))) {
      this.__integrateVertexEdgeItem(
        this.modelAsJsonObject.edges,
        this.edgeMap,
        edge
      );
    }
  };

  __integrateVertexEdgeItem = (target, map, resource) => {
    target.push(resource);
    map[this.__resourceIdentifier__(resource)] = resource;
  };
}
