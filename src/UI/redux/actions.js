import * as type from "./types.js";
export const selectDataSource = sourceName => dispatch => {
  dispatch({
    type: type.SELECT_DATASOURCE,
    payload: { selectedDataSource: sourceName }
  });
};
export const selectVertexEdgeMapper = sourceName => dispatch => {
  dispatch({
    type: type.SELECT_VERTEXEDGE_MAPPER,
    payload: { selectedVertexEdgeMapper: sourceName }
  });
};
export const selectNodeLinkMapper = sourceName => dispatch => {
  dispatch({
    type: type.SELECT_NODELINK_MAPPER,
    payload: { selectedNodeLinkMapper: sourceName }
  });
};

export const createPreviewVisualization = val => dispatch => {
  dispatch({
    type: type.CREATE_PREVIEW_VISUALIZATION,
    payload: { createPreviewVisualization: val }
  });
};

export const updateRenderingModuleConfiguration = payload => dispatch => {
  dispatch({
    type: type.UPDATE_RENDERING_MODULE_CONFIG,
    payload: payload
  });
};
