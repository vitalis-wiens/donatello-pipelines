import React, { Component } from "react";
import PropTypes from "prop-types";
import { Container } from "reactstrap";

import styled, { keyframes } from "styled-components";
//
// const expandButtonAnimation = ({ expanded, initialRendering }) => {
//   if (!initialRendering) {
//     return keyframes`
//   from {
//     transform: rotate(${expanded ? -180 : 0}deg);
//   }
//   to {
//     transform: rotate(${expanded ? 0 : 180}deg);
//
//   }
// `;
//   }
//   if (initialRendering) {
//     return keyframes`
//   from {
//     transform: rotate(0deg);
//   }
//   to {
//     transform: rotate(0deg);
//
//   }
// `;
//   }
// };
//
// const ButtonContainer = styled.div`
//   animation-name: ${expandButtonAnimation};
//   animation-duration: 1000ms;
//   transform: rotate(${props => (props.expanded ? 0 : 180)}deg);
// `;

const expandContentContainerAnimation = ({ expanded, width }) => {
  return keyframes`
  from {
    right: ${expanded ? -(width - 10) : 8}px;
  }
  to {
    right: ${expanded ? 8 : -(width - 10)}px;
   
  }
`;
};

const ContentContainer = styled.aside`
  animation-name: ${expandContentContainerAnimation};
  animation-duration: 400ms;
  right: ${props => (props.expanded ? 8 : -(props.width - 10))}px;
`;

export default class RightSideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      minHeight: 200,
      title: props.title,
      initialRendering: true
    };
  }

  componentDidMount() {
    document.body.style.overflowX = "hidden";
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.expanded !== this.state.expanded) {
      this.setState({ initialRendering: false });
    }

    // check required height TODO
    this.props.heightUpdateEvent();
  };

  componentWillUnmount() {
    document.body.style.overflowX = "auto";
  }

  collapseSidebar = () => {
    this.props.updateEvent(!this.state.expanded);
    this.setState({ expanded: !this.state.expanded });
  };

  render() {
    return (
      <ContentContainer
        id="RightSidebarContainer"
        expanded={this.state.expanded}
        width={this.props.width}
        initialRendering={this.state.initialRendering}
        style={{
          width: this.props.width,
          position: "absolute",
          height: window.innerHeight - 40,
          display: "none"
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
        {/*<ButtonContainer*/}
        {/*  size="sm"*/}
        {/*  expanded={this.state.expanded}*/}
        {/*  duration={500}*/}
        {/*  style={{*/}
        {/*    backgroundColor: "#2184cc",*/}
        {/*    margin: "0 0",*/}
        {/*    flexGrow: "1",*/}
        {/*    display: "flex",*/}
        {/*    alignSelf: "center",*/}
        {/*    width: "30px",*/}
        {/*    height: "30px",*/}
        {/*    borderRadius: "30px",*/}
        {/*    padding: 0,*/}
        {/*    border: "solid 1px",*/}
        {/*    borderColor: "#383838",*/}
        {/*    float: "left",*/}
        {/*    position: "relative",*/}
        {/*    top: "-15px",*/}
        {/*    left: "-8px",*/}
        {/*    zIndex: 100*/}
        {/*  }}*/}
        {/*  onClick={this.collapseSidebar}*/}
        {/*>*/}
        {/*  <Icon*/}
        {/*    icon={faAngleLeft}*/}
        {/*    rotation={180}*/}
        {/*    className="align-self-center"*/}
        {/*    style={{ marginLeft: "7px", fontSize: "28px", color: "white" }}*/}
        {/*  />*/}
        {/*</ButtonContainer>*/}
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
            height: "90%",
            position: "relative"
            // zIndex: -500
          }}
        >
          <div style={{ width: this.props.width - 10, textAlign: "center" }}>
            RightSide
          </div>
        </Container>
      </ContentContainer>
    );
  }
}

RightSideBar.propTypes = {
  title: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  updateEvent: PropTypes.func.isRequired,
  heightUpdateEvent: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired
};
