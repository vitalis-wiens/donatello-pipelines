import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import store from "./store";

export default history =>
  combineReducers({
    router: history ? connectRouter(history) : null,
    store
  });
