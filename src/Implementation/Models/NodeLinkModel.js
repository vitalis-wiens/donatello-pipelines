import * as $CONST from "../Base/BaseComponentConstants";
import BaseModel from "../Base/BaseModel";

export default class NodeLinkModel extends BaseModel {
  constructor() {
    super();
    this.type = $CONST.TYPE_NODE_LINK_MODEL; // default type;

    // initialize the model with array of resources and relations;
    this.modelAsJsonObject = { nodes: [], links: [] };

    // create mappers for resources and relations;
    this.nodeMap = {};
    this.linkMap = {};

    this.__resourceIdentifier = "__nodeLinkIdentifier"; // default, assume forced ids from outside;
  }

  getNodeFromName(name) {
    return this.nodeMap[name];
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

  addNode = node => {
    if (!this.__isInMap__(this.nodeMap, this.__resourceIdentifier__(node))) {
      this.__integrateNodeLinkItem(
        this.modelAsJsonObject.nodes,
        this.nodeMap,
        node
      );
    }
  };

  addLink = link => {
    if (!this.__isInMap__(this.linkMap, this.__resourceIdentifier__(link))) {
      this.__integrateNodeLinkItem(
        this.modelAsJsonObject.links,
        this.linkMap,
        link
      );
    }
  };

  mergeNodes(src, tar) {
    tar.__SHADOWNODE = true;
    src.__displayName += ", " + tar.__displayName;
    if (!src.__hasEquivalentClasses) {
      src.__hasEquivalentClasses = [];
    }
    src.__hasEquivalentClasses.push(tar); // could be useful for later;

    // get its links and move them to the src node;
    tar.__incomingLinks.forEach(inLink => {
      if (!inLink.__SHADOWLINK) {
        console.error("TODO MERGE THE LINKS TO THE SRC NODE");
        console.log(inLink);
      }
    });

    tar.__outgoingLinks.forEach(outLink => {
      if (!outLink.__SHADOWLINK) {
        console.error("TODO MERGE THE LINKS TO THE SRC NODE");
        console.log(outLink);
      }
    });
  }

  removeShadowsFromModel() {
    const nodesToRemove = [];
    const linksToRemove = [];
    this.modelAsJsonObject.nodes.forEach(node => {
      if (node.__SHADOWNODE) {
        // remove from map;
        nodesToRemove.push(node);
        delete this.nodeMap[node[this.__resourceIdentifier]];
      }
    });
    this.modelAsJsonObject.links.forEach(link => {
      if (link.__SHADOWLINK) {
        // remove from map;
        linksToRemove.push(link);
        delete this.linkMap[link[this.__resourceIdentifier]];
      }
    });

    // remove them from array of vertices;
    nodesToRemove.forEach(n => {
      const idToRemove = this.modelAsJsonObject.nodes.indexOf(n);
      this.modelAsJsonObject.nodes.splice(idToRemove, 1);
    });

    linksToRemove.forEach(l => {
      const idToRemove = this.modelAsJsonObject.links.indexOf(l);
      this.modelAsJsonObject.links.splice(idToRemove, 1);
    });
  }

  __integrateNodeLinkItem = (target, map, resource) => {
    target.push(resource);
    map[this.__resourceIdentifier__(resource)] = resource;
  };
}
