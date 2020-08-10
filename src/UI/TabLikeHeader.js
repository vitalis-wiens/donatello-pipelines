import React, { useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import styled, { keyframes } from "styled-components";

const expandButtonAnimation = ({ expanded, initialRendering }) => {
  if (!initialRendering) {
    return keyframes`
  from {
    transform: rotate(${expanded ? -90 : 90}deg);
  }
  to {
    transform: rotate(${expanded ? 90 : 270}deg);
   
  }
`;
  }
  if (initialRendering) {
    return keyframes`
  from {
    transform: rotate(90deg);
  }
  to {
    transform: rotate(90deg);
   
  }
`;
  }
};

const collapsableBodyContainerAnimation = ({
  expand,
  collapsable,
  minHeight,
  maxHeight
}) => {
  if (collapsable) {
    return keyframes`
  from {
    height: ${expand ? minHeight : maxHeight}px;
  }
  to {
    height: ${expand ? maxHeight : minHeight}px;
   
  }
`;
  }
  if (!collapsable) {
    return keyframes`
  from {
    height: ${minHeight}px;
  }
  to {
    height: ${minHeight}px;
   
  }
`;
  }
};

const indicatorItemAnimation = ({ expanded, initialRendering }) => {
  if (!initialRendering) {
    return keyframes`
  0% {
    opacity: ${expanded ? 1 : 0};
  }
  50% {
    opacity: ${expanded ? 1 : 0};
  }
  100% {
    opacity: ${expanded ? 0 : 1};
  }
 
`;
  }
};

const IndicatorItem = styled.div`
  animation-name: ${indicatorItemAnimation};
  animation-duration: 500ms;
  opacity: ${props => (props.collapsable ? (props.expand ? 0 : 1) : 1)};
`;

const CollapsableBodyContainer = styled.div`
  animation-name: ${collapsableBodyContainerAnimation};
  animation-duration: 400ms;
  height: ${props =>
    props.collapsable
      ? props.expand
        ? props.maxHeight
        : props.minHeight
      : props.minHeight}px;
`;

const ButtonContainer = styled.div`
  animation-name: ${expandButtonAnimation};
  animation-duration: 400ms;
  transform: rotate(${props => (props.expanded ? 90 : 270)}deg);
`;

const TabLikeHeader = props => {
  const [expand, setExpand] = useState(true);
  const toggle = () => setExpand(!expand);
  return (
    <div style={{ paddingRight: "10px" }}>
      {createHeader(
        props,
        props.position,
        props.title,
        props.collapsable,
        expand,
        toggle
      )}
      {createBody(
        props,
        props.title,
        props.position,
        props.children,
        props.collapsable,
        expand,
        props.minHeight,
        props.maxHeight
      )}
    </div>
  );
};

const createHeader = (
  props,
  pos,
  title,
  collapse = false,
  expand,
  toggleFunction
) => {
  return (
    <div
      style={{
        width: "200px",
        color: "#fff",
        backgroundColor: "#ad2f38",
        borderTopLeftRadius: "5px",
        borderTopRightRadius: "10px",
        marginLeft: pos === "left" ? 0 : "50%"
      }}
      key={"containerHeaderKey" + title}
    >
      {title}
      {collapse ? (
        <ButtonContainer
          key={"someKey" + title}
          size="sm"
          color="secondary"
          className="btn-secondary"
          expanded={expand}
          duration={500}
          style={{
            margin: "0 0",
            flexGrow: "1",
            display: "flex",
            alignSelf: "center",
            width: "20px",
            height: "20px",
            borderRadius: "20px",
            padding: 0,
            border: "solid 1px",
            borderColor: "#525252",
            float: "right",
            right: "10px",
            top: "2px",
            position: "relative",
            zIndex: 100
          }}
          onClick={toggleFunction}
        >
          <Icon
            icon={faAngleLeft}
            className="align-self-center"
            style={{ marginLeft: "4px", fontSize: "20px" }}
          />
        </ButtonContainer>
      ) : (
        ""
      )}
    </div>
  );
};
const createBody = (
  props,
  title,
  pos,
  children,
  collapseable,
  expand,
  minHeight,
  maxHeight
) => {
  return (
    <CollapsableBodyContainer
      id={"tlh_bodyOf" + title}
      collapsable={collapseable}
      expand={expand}
      minHeight={minHeight}
      maxHeight={maxHeight}
      style={{
        width: props.width ? props.width : "250px",
        backgroundColor: "white",
        marginBottom: "10px",
        border: "1px solid gray",
        borderTopLeftRadius: "0px",
        borderTopRightRadius: "10px",
        borderBottomLeftRadius: "10px",
        borderBottomRightRadius: 0,
        overflow: "hidden",
        color: "#505565"
      }}
    >
      {children}
      {collapseable && !expand && (
        <IndicatorItem
          expanded={expand}
          style={{
            position: "relative",
            float: "right",
            marginTop: -maxHeight + minHeight - 15 + 5,
            height: "15px",
            width: "100%",
            backgroundColor: "#c4c4c4",
            borderRadius: "15px"
          }}
        />
      )}
    </CollapsableBodyContainer>
  );
};

TabLikeHeader.propTypes = {
  title: PropTypes.string.isRequired,
  position: PropTypes.string,
  collapsable: PropTypes.bool,
  minHeight: PropTypes.number,
  maxHeight: PropTypes.number,
  children: PropTypes.any,
  width:PropTypes.any
};

export default TabLikeHeader;
