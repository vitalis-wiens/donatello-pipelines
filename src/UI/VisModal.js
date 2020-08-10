import React, { Component } from "react";
import { connect } from "react-redux";
import * as PropTypes from "prop-types";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

class VisModal extends Component {
  state = {
    windowHeight: 0
  };

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
    this.updateDimensions();
  }

  componentDidUpdate = () => {};

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions = () => {
    const offset = 28 * 2 + 65;
    this.setState({ windowHeight: window.innerHeight - offset });
  };

  render() {
    return (
      <Modal
        isOpen={this.props.showDialog}
        toggle={this.props.toggle}
        size="lg"
        onOpened={() => {}}
        style={{ maxWidth: "90%", marginBottom: 0 }}
      >
        <ModalHeader toggle={this.props.toggle}>
          <div className="d-flex" style={{ height: "40px" }}>
            <div style={{ width: "100%", height: "40px", paddingTop: "5px" }}>
              {this.props.title}
            </div>
          </div>
        </ModalHeader>
        <ModalBody
          style={{
            padding: "0",
            minHeight: "100px",
            height: this.state.windowHeight,
            overflow: "auto"
          }}
        >
          {this.props.children}
        </ModalBody>
      </Modal>
    );
  }
}

VisModal.propTypes = {
  showDialog: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.any
};

const mapStateToProps = state => ({
  store: state.store
});

export default connect(mapStateToProps)(VisModal);
