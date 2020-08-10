import React, { Component } from "react";
import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";

import PipeLineVis from "./PipeLineVis";
import VisualizationPreview from "./VisualizationPreview";
const expandContentContainerAnimation = ({
  expandedLeft,
  oldLeftExpanded,
  newWidth,
  oldWidth,
  leftWidth
}) => {
  const needTransitionAnimation = !(expandedLeft === oldLeftExpanded);

  if (needTransitionAnimation) {
    return keyframes`
  from {
    left: ${expandedLeft ? 0 : leftWidth}px;
    width:${oldWidth}px
  }
  to {
    width: ${newWidth}px
    left: ${expandedLeft ? leftWidth : 0}px;
  }
  `;
  } else {
    return keyframes`
  from {
    width:${oldWidth}px
  }
  to {
    width: ${newWidth}px
  }
  `;
  }
};

const ContentContainer = styled.div`
    animation-name: ${expandContentContainerAnimation};
    animation-duration: 20ms;
    position: relative;
    width:${props => props.newWidth}px
    left: ${props => (props.expandedLeft ? props.leftWidth : 0)}px;
`;

export default class MainWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
      minWidth: 300,

      title: props.title,
      initialRendering: true,
      updateFlipFlop: false
    };
  }

  render() {
    return (
      <ContentContainer
        id="MainWidget"
        expandedLeft={this.props.leftSideBarExpanded}
        expandedRight={this.props.rightSideBarExpanded}
        oldWidth={this.props.oldWidth}
        newWidth={this.props.newWidth}
        leftWidth={this.props.leftSidebarWidth}
        rightWidth={this.props.rightSidebarWidth}
        oldLeftExpanded={this.props.oldLeftSidebarState}
        initialRendering={this.state.initialRendering}
        style={{
          height: "100%",
          width: window.innerWidth - 200,
          left: "200px"
        }}
      >
        <div
          style={{
            width: "80%",
            height: "100%",
            position: "relative",
            left: "10%"
          }}
        >
          <PipeLineVis title="Pipeline Visualization" /> <br />
          <VisualizationPreview
            style={{ marginTop: "10px" }}
            title="Visualization Preview"
          />
        </div>
      </ContentContainer>
    );
  }
}

MainWidget.propTypes = {
  title: PropTypes.string,
  oldWidth: PropTypes.number,
  newWidth: PropTypes.number,
  height: PropTypes.number,
  leftSidebarWidth: PropTypes.number.isRequired,
  rightSidebarWidth: PropTypes.number.isRequired,
  oldLeftSidebarState: PropTypes.bool.isRequired,
  leftSideBarExpanded: PropTypes.bool.isRequired,
  rightSideBarExpanded: PropTypes.bool.isRequired
};
