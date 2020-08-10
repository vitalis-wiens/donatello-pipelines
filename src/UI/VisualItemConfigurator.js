import React, { Component } from "react";
import PropTypes from "prop-types";

export default class RenderingModuleConfig extends Component {
  componentDidMount() {}
  componentDidUpdate = () => {};

  render() {
    return <div>Hello</div>;
  }
}

RenderingModuleConfig.propTypes = {
  store: PropTypes.object,
  nodeLinkModel: PropTypes.object
};
