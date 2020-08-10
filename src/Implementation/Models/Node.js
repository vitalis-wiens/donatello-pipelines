export default class Node {
  constructor() {
    this.resourceReference = null;
    this.__outgoingLinks = [];
    this.__incomingLinks = [];
    this.__nodeType = [];
    this.__aggregatedLink = [];
  }

  addAggregatedLink(link) {
    this.__aggregatedLink.push(link);
  }

  addOutgoingLink(link) {
    this.__outgoingLinks.push(link);
  }

  addIncomingLink(link) {
    this.__incomingLinks.push(link);
  }

  isNodeOfType(type) {
    if (Array.isArray(this.__nodeType)) {
      for (let i = 0; i < this.__nodeType.length; i++) {
        if (this.__nodeType[i] === type) {
          return true;
        }
      }
      return false;
    } else {
      if (this.__nodeType && this.__nodeType === type) {
        return true;
      }
    }
    return false;
  }
}
