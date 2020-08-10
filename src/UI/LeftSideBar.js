import React, { Component } from "react";
import PropTypes from "prop-types";
import { Container } from "reactstrap";

import TabLikeHeader from "./TabLikeHeader";
import styled, { keyframes } from "styled-components";
import { Button } from "reactstrap";
import * as dataSources from "../configs/datasources";
import { connect } from "react-redux";

import {
  selectDataSource,
  selectVertexEdgeMapper,
  selectNodeLinkMapper
} from "./redux/actions";

class LeftSideBar extends Component {
  constructor(props) {
    super(props);
    this.awailableSources = dataSources.default.availableSources;
    this.awailableVertexEdgeMappers =
      dataSources.default.availableVertexEdgeMappers;
    this.availableNodeLinkMappers =
      dataSources.default.availableNodeLinkMappers;
    this.state = {
      expanded: true,
      minHeight: 200,
      title: props.title,
      initialRendering: true,
      selectedDataSource: undefined,
      defaultDataSource: "Ontology File",
      selectedVertexEdgeMapper: undefined,
      defaultVertexEdgeMapper: "Basic Mapper",
      innerHeight: 300,
      selectedNodeLinkMapper: undefined,
      defaultNodeLinkMapper: "Basic Mapper"
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
    this.updateDimensions();
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.expanded !== this.state.expanded) {
      this.setState({ initialRendering: false });
    }
  };
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
    this.updateDimensions();
  }

  updateDimensions = () => {
    this.setState({ innerHeight: window.innerHeight });
  };

  collapseLeftSideBar = () => {
    this.props.updateEvent(!this.state.expanded);
    this.setState({ expanded: !this.state.expanded });
  };

  dataSourceSelected = name => {
    this.setState({ selectedDataSource: name });
    this.props.selectDataSource(name);
  };

  vertexEdgeMapperSelected = name => {
    this.setState({ selectedVertexEdgeMapper: name });
    this.props.selectVertexEdgeMapper(name);
  };

  nodeLinkMapperSelected = name => {
    this.setState({ selectedNodeLinkMapper: name });
    this.props.selectNodeLinkMapper(name);
  };

  render() {
    return (
      <ContentContainer
        id="LeftSidebarContainer"
        expanded={this.state.expanded}
        initialRendering={this.state.initialRendering}
        width={this.props.width}
        style={{
          width: this.props.width,
          height: this.state.innerHeight - 40,
          float: "left",
          position: "absolute"
        }}
      >
        <Container
          className="pr-md-5 pt-sm-2 pb-sm-2 pl-sm-2 pr-sm-2 clearfix"
          style={{
            borderRadius: "10px",
            borderWidth: "1px",
            borderColor: "rgb(219,221,229)",
            borderStyle: "solid",
            borderBottomRightRadius: "0",
            borderBottomLeftRadius: "0",
            height: "40px",
            marginLeft: "5px",
            color: "white",
            backgroundColor: "#ad2f38"
          }}
        >
          <div style={{ width: this.props.width - 10, textAlign: "center" }}>
            {this.state.title}
          </div>
        </Container>

        <Container
          className="pr-md-5 pt-sm-2 pb-sm-2 pl-sm-2 pr-sm-2 clearfix"
          style={{
            borderRadius: "10px",
            borderWidth: "1px",
            borderColor: "rgb(219,221,229)",
            borderStyle: "solid",
            borderTopRightRadius: "0",
            borderTopLeftRadius: "0",
            marginLeft: "5px",
            color: "black",
            backgroundColor: "#ffffff",
            marginTop: "-1px",
            position: "relative",
            height: "90%",
            overflowY: "scroll",
            overflowX: "hidden"
          }}
        >
          <div style={{ width: this.props.width - 20, textAlign: "center" }}>
            <TabLikeHeader
              title="Data Source "
              position="left"
              collapsable={false}
              width={"100%"}
            >
              <div style={{ padding: "10px", display: "grid" }}>
                {this.awailableSources.map((item, index) => {
                  let selectedName = this.state.selectedDataSource;
                  if (!selectedName) {
                    selectedName = this.state.defaultDataSource;
                  }
                  return (
                    <Button
                      key={"datasourceIte" + index}
                      style={{
                        margin: "5px",
                        borderRadius: "0px",
                        borderTopRightRadius: "10px",
                        borderBottomLeftRadius: "10px",
                        backgroundColor:
                          item === selectedName ? "#ad2f38" : "#1e68a5"
                      }}
                      onClick={() => {
                        this.dataSourceSelected(item);
                      }}
                    >
                      {item}
                    </Button>
                  );
                })}
              </div>
            </TabLikeHeader>
            <TabLikeHeader
              title="Vertex Edge Mapper "
              position="left"
              collapsable={false}
              width={"100%"}
            >
              <div style={{ padding: "10px", display: "grid" }}>
                {this.awailableVertexEdgeMappers.map((item, index) => {
                  let selectedName = this.state.selectedVertexEdgeMapper;
                  if (!selectedName) {
                    selectedName = this.state.defaultVertexEdgeMapper;
                  }
                  return (
                    <Button
                      key={"datasourceIte" + index}
                      style={{
                        margin: "5px",
                        borderRadius: "0px",
                        borderTopRightRadius: "10px",
                        borderBottomLeftRadius: "10px",
                        backgroundColor:
                          item === selectedName ? "#ad2f38" : "#1e68a5"
                      }}
                      onClick={() => {
                        this.vertexEdgeMapperSelected(item);
                      }}
                    >
                      {item}
                    </Button>
                  );
                })}
              </div>
            </TabLikeHeader>

            <TabLikeHeader
              title="Node Link Mapper "
              position="left"
              collapsable={false}
              width={"100%"}
            >
              <div style={{ padding: "10px", display: "grid" }}>
                {this.availableNodeLinkMappers.map((item, index) => {
                  let selectedName = this.state.selectedNodeLinkMapper;
                  if (!selectedName) {
                    selectedName = this.state.defaultNodeLinkMapper;
                  }
                  return (
                    <Button
                      key={"datasourceIte" + index}
                      style={{
                        margin: "5px",
                        borderRadius: "0px",
                        borderTopRightRadius: "10px",
                        borderBottomLeftRadius: "10px",
                        backgroundColor:
                          item === selectedName ? "#ad2f38" : "#1e68a5"
                      }}
                      onClick={() => {
                        this.nodeLinkMapperSelected(item);
                      }}
                    >
                      {item}
                    </Button>
                  );
                })}
              </div>
            </TabLikeHeader>
          </div>
        </Container>
      </ContentContainer>
    );
  }
}

LeftSideBar.propTypes = {
  title: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  updateEvent: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  selectDataSource: PropTypes.func.isRequired,
  selectVertexEdgeMapper: PropTypes.func.isRequired,
  selectNodeLinkMapper: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    store: state.store
  };
};

const mapDispatchToProps = dispatch => {
  // dispatch(selectDataSource());
  return {
    selectDataSource: payload => dispatch(selectDataSource(payload)),
    selectVertexEdgeMapper: payload =>
      dispatch(selectVertexEdgeMapper(payload)),
    selectNodeLinkMapper: payload => dispatch(selectNodeLinkMapper(payload))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LeftSideBar);

const expandContentContainerAnimation = ({ expanded, width }) => {
  return keyframes`
  from {
    left: ${expanded ? -width : 0}px;
  }
  to {
    left: ${expanded ? 0 : -width}px;
   
  }
`;
};

const ContentContainer = styled.div`
  animation-name: ${expandContentContainerAnimation};
  animation-duration: 400ms;
  left: ${props => (props.expanded ? 0 : -props.width)}px;
`;
