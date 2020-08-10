import React, { Component } from "react";
import PropTypes from "prop-types";

import { Button, FormGroup, Label, Input } from "reactstrap";
import { connect } from "react-redux";
import ORKGLoader from "../Implementation/DataAccessComponent/OrkgDataLoader";

class DataAccessConfigurator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endpointURL: "https://www.orkg.org/orkg/",
      requestParameters: "api/statements/subject/",
      requestResourceId: "R8186",
      suffix: "/?desc=true&items=9999&page=1&sortBy=created_at",

      queryResult: undefined
    };
  }

  componentDidMount() {}

  componentDidUpdate = () => {
    this.props.statePropagation(this.state);
  };

  handleInputChange = (name, target) => {
    const newEntry = target.target.value;
    this.setState({ [name]: newEntry });
  };

  executeQuery = () => {
    const accessHandler = new ORKGLoader();
    accessHandler.setEndPointURL(this.state.endpointURL);
    accessHandler.setRequestResourceId(this.state.requestResourceId);

    accessHandler.executePromisedQuery(this.state.query).then(res => {
      this.setState({ queryResult: res });
    });
  };

  render() {
    return (
      <div style={{ padding: "10px", display: "flex" }}>
        <div>
          <div>Configure Data AccessHandler for DBPedia</div>
          <div style={{ width: "50%" }}>
            <FormGroup>
              <Label style={{ display: "ruby" }}>
                <b>EndPoint URL:</b>
                <Input
                  type="text"
                  onChange={t => {
                    this.handleInputChange("endpointURL", t);
                  }}
                  value={this.state.endpointURL}
                />
              </Label>
            </FormGroup>
            <FormGroup>
              <Label style={{ display: "ruby" }}>
                <b>Paper Resource Id:</b>
                <Input
                  type="text"
                  onChange={t => {
                    this.handleInputChange("requestResourceId", t);
                  }}
                  value={this.state.requestResourceId}
                />
              </Label>
            </FormGroup>
          </div>
        </div>

        <div style={{ width: "40%" }}>
          <Button
            onClick={() => {
              this.executeQuery();
            }}
          >
            Test Query
          </Button>
          <br />
          Result
          <textarea
            rows="10"
            cols="50"
            style={{ width: "100%", height: "100%" }}
            value={JSON.stringify(this.state.queryResult, null, "\t")}
          />
        </div>
      </div>
    );
  }
}

DataAccessConfigurator.propTypes = {
  store: PropTypes.object,
  statePropagation: PropTypes.func
};

const mapStateToProps = state => {
  return {
    store: state.store
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DataAccessConfigurator);
