import React, { Component } from "react";
import PropTypes from "prop-types";

import { FormGroup, Label, Input } from "reactstrap";
import { updateRenderingModuleConfiguration } from "./redux/actions";
import { connect } from "react-redux";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import * as dataSources from "../configs/datasources";
import VisualItemConfiguration from "./VisualItemConfigurator";

class RenderingModuleConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graph_mouseZoom: true,
      graph_mouseDrag: true,
      node_mouseDrag: true,
      node_mouseHover: true,
      node_mouseSingleClick: true,
      node_mouseDoubleClick: true,
      link_mouseDrag: true,
      link_mouseHover: true,
      // todo: link clicks ;
      graphBgColor: "#FFFFFF",

      // internal state stuffl
      configSelectionOpen: false,
      configSelected: "Default"
    };

    this.availableConfigs = dataSources.default.availableRenderingConfigs;
  }

  componentDidMount() {
    this.setState({ ...this.props.initialState });
  }

  componentDidUpdate = () => {
    this.props.propagateState(this.state);
  };

  handleCheckChange = name => {
    this.setState(prevState => ({
      [name]: !prevState[name]
    }));
  };

  renderGraphInteractionsConfig = () => {
    return (
      <div style={{ padding: "5px", marginLeft: "10px" }}>
        <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              checked={this.state.graph_mouseZoom}
              onChange={() => {
                this.handleCheckChange("graph_mouseZoom");
              }}
            />{" "}
            Mouse Zoom
          </Label>
        </FormGroup>
        <FormGroup check style={{ paddingLeft: "40px" }}>
          <Label check>
            <Input
              type="checkbox"
              disabled={true}
              checked={this.state.graph_mouseZoom}
              onChange={() => {
                this.handleCheckChange("graph_mouseZoom");
              }}
            />
            Graph Double Click == Zoom
          </Label>
        </FormGroup>
        <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              checked={this.state.graph_mouseDrag}
              onChange={() => {
                this.handleCheckChange("graph_mouseDrag");
              }}
            />{" "}
            Mouse Drag
          </Label>
        </FormGroup>
      </div>
    );
  };
  renderNodeInteractionsConfig = () => {
    return (
      <div style={{ padding: "5px", marginLeft: "10px" }}>
        <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              checked={this.state.node_mouseDrag}
              onChange={() => {
                this.handleCheckChange("node_mouseDrag");
              }}
            />{" "}
            Node Drag
          </Label>
        </FormGroup>
        <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              checked={this.state.node_mouseHover}
              onChange={() => {
                this.handleCheckChange("node_mouseHover");
              }}
            />
            Node Hover
          </Label>
        </FormGroup>
        <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              checked={this.state.node_mouseSingleClick}
              onChange={() => {
                this.handleCheckChange("node_mouseSingleClick");
              }}
            />{" "}
            Node Single Mouse Click
          </Label>
        </FormGroup>
        <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              checked={this.state.node_mouseDoubleClick}
              onChange={() => {
                this.handleCheckChange("node_mouseDoubleClick");
              }}
            />
            Node Double Mouse Click
          </Label>
        </FormGroup>
      </div>
    );
  };

  renderLinkInteractionsConfig = () => {
    return (
      <div style={{ padding: "5px", marginLeft: "10px" }}>
        <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              checked={this.state.link_mouseDrag}
              onChange={() => {
                this.handleCheckChange("link_mouseDrag");
              }}
            />
            Link Drag
          </Label>
        </FormGroup>
        <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              checked={this.state.link_mouseHover}
              onChange={() => {
                this.handleCheckChange("link_mouseHover");
              }}
            />
            Link Hover
          </Label>
        </FormGroup>
      </div>
    );
  };

  createVisualAppearanceConfigDropDowns = () => {
    const items = this.availableConfigs.map((item, index) => {
      return (
        <DropdownItem
          key={"dropdownItemIndexKey" + index}
          onClick={() => {
            this.setState({ configSelected: item });
          }}
        >
          {item}
        </DropdownItem>
      );
    });

    return (
      <Dropdown
        color="darkblue"
        size="sm"
        //    className='mb-4 mt-4'
        style={{
          marginLeft: "10px",
          flexGrow: "1",
          display: "flex",
          height: "min-content",
          paddingTop: "-5px"
        }}
        isOpen={this.state.configSelectionOpen}
        toggle={() => {
          this.setState({
            configSelectionOpen: !this.state.configSelectionOpen
          });
        }}
      >
        <DropdownToggle
          caret
          color="darkblue"
          style={{
            padding: "0px",
            paddingLeft: "3px",
            border: "solid 1px black"
          }}
        >
          {this.state.configSelected}
        </DropdownToggle>
        <DropdownMenu>{items}</DropdownMenu>
      </Dropdown>
    );
  };

  render() {
    return (
      <>
        <div
          style={{
            width: "100%",
            display: "flex",
            marginLeft: "10px",
            paddingLeft: "30px"
          }}
        >
          <div style={{ border: "solid 1px grey", width: "30%" }}>
            <h2> Graph Interactions: </h2>
            {this.renderGraphInteractionsConfig()}
          </div>
          <div style={{ border: "solid 1px grey", width: "30%" }}>
            <h2> Node Interactions: </h2>
            {this.renderNodeInteractionsConfig()}
          </div>
          <div style={{ border: "solid 1px grey", width: "30%" }}>
            <h2> Link Interactions: </h2>
            {this.renderLinkInteractionsConfig()}
          </div>
        </div>

        <hr />

        <div style={{ display: "flex" }}>
          <div style={{ width: "100%", marginLeft: "10px" }}>
            <h2> Visualization Configuration </h2>
            <div style={{}}>
              <div>
                Layout: ForceDirected Active {"<<<"}{" "}
                <b> NOT CONFIGURABLE IN DEMO</b>
              </div>
              <div style={{ display: "flex" }}>
                Graph Background Color:
                <Input
                  type={"color"}
                  style={{
                    width: "40px",
                    marginLeft: "5px",
                    padding: "2px",
                    height: "25px"
                  }}
                  value={this.state.graphBgColor}
                  onChange={t => {
                    this.setState({ graphBgColor: t.target.value });
                  }}
                />
              </div>
            </div>
          </div>
          <div style={{ width: "100%", marginLeft: "10px" }}>
            <h2> Visual Appearance</h2>
            <div style={{ display: "flex" }}>
              <div>Visual Appearance Config</div>
              {this.createVisualAppearanceConfigDropDowns()}
            </div>
          </div>
        </div>
        <hr />
        <div style={{ display: "flex" }}>
          {this.props.nodeLinkModel ? (
            <div>
              Adjusting the item configs{" "}
              {this.state.configSelected !== "Customizable" ? (
                <b> READ ONLY </b>
              ) : (
                ""
              )}
              <VisualItemConfiguration
                nodeLinkModel={this.props.nodeLinkModel}
                readOnly={this.state.configSelected !== "Customizable"}
              />
            </div>
          ) : (
            <div>
              Please execute the pipeline modules to enable dynamic
              customizations
            </div>
          )}
        </div>
      </>
    );
  }
}

RenderingModuleConfig.propTypes = {
  store: PropTypes.object,
  nodeLinkModel: PropTypes.object,
  initialState: PropTypes.object,
  updateRenderingModuleConfiguration: PropTypes.func,
  propagateState: PropTypes.func
};

const mapStateToProps = state => {
  return {
    store: state.store
  };
};

const mapDispatchToProps = dispatch => {
  // dispatch(selectDataSource());
  return {
    updateRenderingModuleConfiguration: payload =>
      dispatch(updateRenderingModuleConfiguration(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RenderingModuleConfig);
