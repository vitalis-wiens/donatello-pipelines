import * as $CONST from "../Base/BaseComponentConstants";
import BaseModel from "../Base/BaseModel";

export default class ResourceRelationModel extends BaseModel {
  constructor() {
    super();

    this.type = $CONST.TYPE_RESOURCE_RELATION_MODEL; // default type;

    // initialize the model with array of resources and relations;
    this.modelAsJsonObject = { resources: [], relations: [] };

    // create mappers for resources and relations;
    this.resourceMap = {};
    this.relationMap = {};

    this.__resourceIdentifier = "__resourceIdentifier"; // default, assume forced ids from outside;
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

  __isEqual__ = (a, b) => {
    // input a and b are objects with properties where some are maybe equal
    return false;
  };

  __resourceIdentifier__ = resourceObject => {
    return resourceObject[this.__resourceIdentifier];
  };

  /** -------------- Exposed Functions --------------**/

  addResource = resource => {
    if (
      !this.__isInMap__(this.resourceMap, this.__resourceIdentifier__(resource))
    ) {
      this.__integrateResourceItem(
        this.modelAsJsonObject.resources,
        this.resourceMap,
        resource
      );
    } else {
      // Has seen this resource >>> Merge <<<;
      this.__mergeItem(
        this.resourceMap[this.__resourceIdentifier__(resource)],
        resource
      );
    }
  };

  __mergeItem = (r1, r2) => {
    // r1 is our target resource where we append stuff to it
    r1.integrateResource(r2);
  };

  __integrateResourceItem = (target, map, resource) => {
    target.push(resource);
    map[this.__resourceIdentifier__(resource)] = resource;
  };

  addRelation = relation => {
    if (
      !this.__isInMap__(this.relationMap, this.__resourceIdentifier__(relation))
    ) {
      this.__integrateResourceItem(
        this.modelAsJsonObject.relations,
        this.relationMap,
        relation
      );
    } else {
      // Has seen this relation >>> Merge <<<;

      this.__mergeItem(
        this.relationMap[this.__resourceIdentifier__(relation)],
        relation
      );
    }
  };
}
