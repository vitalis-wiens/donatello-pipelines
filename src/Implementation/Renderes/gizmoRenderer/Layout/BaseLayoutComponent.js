export default class BaseLayoutComponent {
  constructor(graph) {
    this.graph = graph;

    this.renderedNodes = graph.nodes;
    this.renderedLinks = graph.links;
  }
}
