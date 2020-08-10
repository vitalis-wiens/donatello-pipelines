import React, { Component } from "react";
import PropTypes from "prop-types";

import { Button, FormGroup, Label, Input } from "reactstrap";
import { connect } from "react-redux";
import WikiDataLoader from "../Implementation/DataAccessComponent/WikiDataLoader";

class DataAccessConfigurator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endpointURL: "https://query.wikidata.org/",
      query:
        "SELECT ?h ?hLabel ?cause ?causeLabel (YEAR(?date) AS ?year) WHERE {\n" +
        "?h wdt:P39 wd:Q11696;\n" +
        "   wdt:P509 ?cause;\n" +
        "   wdt:P570 ?date\n" +
        'SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }\n' +
        "} ORDER BY ?year",
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
    const accessHandler = new WikiDataLoader();
    accessHandler.setEndPointURL(this.state.endpointURL);
    accessHandler.setQuery(this.state.query);
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

            <div>
              <b> QUERY: </b> <br />
              <b>
                <i>*Note*</i>
              </b>
              This is an example query that also has a <b>SPECIFIC</b> parser
              for the variable names selection .
              <textarea
                rows="10"
                cols="50"
                style={{ width: "100%", height: "100%" }}
                value={this.state.query}
                onChange={e => {
                  this.setState({ query: e.target.value });
                }}
              />
            </div>
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
