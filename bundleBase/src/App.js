import React, { Component } from "react";
import "./App.css";
import { Button } from "reactstrap";
import Pipeline from "./pipeline";
class App extends Component {
  constructor(props) {
    super(props);
    this.pipeline = new Pipeline();
  }

  componentDidMount() {
    // connect update stuff;
    window.addEventListener("resize", this.updateDimensions);
    this.updateDimensions();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("Calling style object recompute");
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions = () => {
    this.setState({
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth
    });
  };

  render() {
    return (
      <div style={{ backgroundColor: "#282c34" }}>
        <div
          className="App"
          style={{
            display: "inline-block",
            width: "100%",
            height: window.innerHeight,
            color: "white"
          }}
        >
          <h1> Generated Demo Application</h1>
          <Button
            style={{ marginBottom: "10px" }}
            onClick={this.pipeline.executePipeline}
          >
            Execute Pipeline
          </Button>
          <div
            id="renderingContainer"
            style={{
              width: 0.5 * window.innerWidth,
              height: 0.7 * window.innerHeight,
              backgroundColor: "gray",
              margin: "auto"
            }}
          >
            {" "}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
