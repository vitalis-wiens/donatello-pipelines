export default class Vertex {
  constructor() {
    this.resourceReference = null;
    this.__outgoingEdges = [];
    this.__incomingEdges = [];
  }

  addOutgoingEdge(edge) {
    this.__outgoingEdges.push(edge);
  }

  addIncomingEdge(edge) {
    this.__incomingEdges.push(edge);
  }
}
