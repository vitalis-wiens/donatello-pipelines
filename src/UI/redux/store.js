import * as type from "./types";
const initialState = {
  selectedDataSource: "Ontology File",
  selectedDataSourceConfig: {},
  selectedVertexEdgeMapper: "Basic Mapper",
  selectedVertexEdgeMapperConfig: {},
  selectedNodeLinkMapper: "Basic Mapper",
  selectedNodeLinkMapperConfig: {},
  createPreviewVisualization: false,
  renderingModuleConfig: {
    // graph defs
    graph_mouseZoom: true,
    graph_mouseDrag: true,
    // node defs
    node_mouseDrag: true,
    node_mouseHover: true,
    node_mouseSingleClick: true,
    node_mouseDoubleClick: true,

    // graphBgColor
    graphBgColor: "white",

    configSelected: "Default",

    // links
    link_mouseDrag: true,
    link_mouseHover: true
    // TODO the clicking interactions
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case type.SELECT_DATASOURCE: {
      return {
        ...state,
        selectedDataSource: action.payload.selectedDataSource
      };
    }
    case type.SELECT_VERTEXEDGE_MAPPER: {
      return {
        ...state,
        selectedVertexEdgeMapper: action.payload.selectedVertexEdgeMapper
      };
    }
    case type.SELECT_NODELINK_MAPPER: {
      return {
        ...state,
        selectedNodeLinkMapper: action.payload.selectedNodeLinkMapper
      };
    }
    case type.CREATE_PREVIEW_VISUALIZATION: {
      return {
        ...state,
        createPreviewVisualization: action.payload.createPreviewVisualization
      };
    }
    case type.UPDATE_RENDERING_MODULE_CONFIG: {
      return {
        ...state,
        renderingModuleConfig: action.payload
      };
    }

    default: {
      return state;
    }
  }
};
