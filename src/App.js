import React, { Component } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import PropTypes from "prop-types";
import LeftSideBar from "./UI/LeftSideBar";
import RightSideBar from "./UI/RightSideBar";
import MainWidget from "./UI/MainWidget";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leftSidebarExpanded: true,
      rightSidebarExpanded: true,
      oldMainWidgetWidth: 500,
      newMainWidgetWidth: 500,
      windowWidth: 500,
      mainWidgetHeight: 200,
      componentInitialized: false,
      oldLeftSideState: true,
      leftSidebarWidth: 320,
      rightSidebarWidth: 300
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
    this.updateDimensions();
  }

  componentDidUpdate = (prevProps, prevState) => {
    this.updateMainWidgetSize();
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
    this.updateDimensions();
  }

  leftSideBarUpdateEvent = expanded => {
    let result = this.state.windowWidth;
    if (expanded) {
      result -= this.state.leftSidebarWidth + 300;
    }
    if (this.state.rightSidebarExpanded) {
      result -= this.state.rightSidebarWidth;
    }
    this.setState({
      leftSidebarExpanded: expanded,
      oldLeftSideState: this.state.leftSidebarExpanded,
      oldMainWidgetWidth: this.state.newMainWidgetWidth,
      newMainWidgetWidth: result
    });
  };

  rightSideBarUpdateEvent = expanded => {
    let result = this.state.windowWidth;
    if (expanded) {
      result -= this.state.rightSidebarWidth;
    }
    if (this.state.leftSidebarExpanded) {
      result -= this.state.leftSidebarWidth + 300;
    }
    this.setState({
      oldLeftSideState: this.state.leftSidebarExpanded,
      rightSidebarExpanded: expanded,
      oldMainWidgetWidth: this.state.newMainWidgetWidth,
      newMainWidgetWidth: result
    });
    this.updateMainWidgetSize();
  };

  updateDimensions = () => {
    let result = window.innerWidth;
    if (this.state.leftSidebarExpanded) {
      result -= this.state.leftSidebarWidth + 300;
    }
    if (this.state.rightSidebarExpanded) {
      result -= this.state.rightSidebarWidth;
    }

    this.setState({
      windowHeight: window.innerHeight,
      leftSidebarExpanded: this.state.leftSidebarExpanded,
      oldLeftSideState: this.state.leftSidebarExpanded,
      oldMainWidgetWidth: result,
      newMainWidgetWidth: result,
      windowWidth: window.innerWidth
    });
  };

  updateMainWidgetSize = () => {
    // get document by ids;
    const heightLeft = document
      .getElementById("LeftSidebarContainer")
      .getBoundingClientRect().height;
    const heightRight = document
      .getElementById("RightSidebarContainer")
      .getBoundingClientRect().height;

    const newHeight = Math.max(heightRight, heightLeft);
    if (newHeight !== this.state.mainWidgetHeight) {
      this.setState({ mainWidgetHeight: newHeight });
    }
  };

  render() {
    return (
      <div
        style={{
          width: "100%",
          height: this.state.windowHeight,
          backgroundColor: "#3f3a40",
          margin: "auto",
          padding: "10px"
        }}
      >
        <div style={{ display: "flex", marginTop: "5px" }}>
          <MainWidget
            leftSideBarExpanded={this.state.leftSidebarExpanded}
            rightSideBarExpanded={this.state.rightSidebarExpanded}
            leftSidebarWidth={this.state.leftSidebarWidth}
            rightSidebarWidth={this.state.rightSidebarWidth}
            oldWidth={this.state.oldMainWidgetWidth}
            newWidth={this.state.newMainWidgetWidth}
            oldLeftSidebarState={this.state.oldLeftSideState}
            height={this.state.mainWidgetHeight}
            title="MAIN"
          />
          <LeftSideBar
            width={this.state.leftSidebarWidth}
            title="Modules Selection"
            loading={false}
            updateEvent={this.leftSideBarUpdateEvent}
          />
          <RightSideBar
            width={this.state.rightSidebarWidth}
            title="Module Options"
            loading={false}
            updateEvent={this.rightSideBarUpdateEvent}
            heightUpdateEvent={this.updateMainWidgetSize}
          />
        </div>
      </div>
    );
  }
}

App.propTypes = {
  history: PropTypes.object
};

export default App;
