import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, FormGroup, Label, Input } from "reactstrap";
import { connect } from "react-redux";
import DBPediaLoader from "../Implementation/DataAccessComponent/DBPediaLoader";

class DataAccessConfigurator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endpointURL: "https://live.dbpedia.org/sparql/",
      graphURL: "http://dbpedia.org",
      query:
        "PREFIX dbr: <http://dbpedia.org/resource/>\n" +
        "PREFIX dbo: <http://dbpedia.org/ontology/>\n" +
        "PREFIX owl: <http://www.w3.org/2002/07/owl#>\n" +
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
        "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n\n" +
        "SELECT  DISTINCT ?subject ?predicate ?object WHERE { \n" +
        "{dbr:Nikola_Tesla ?predicate ?object.\n" +
        "?object a owl:Class} \n" +
        "UNION {\n" +
        "dbr:Nikola_Tesla dbo:birthDate ?object.\n" +
        "BIND(dbo:birthDate as ?predicate)\n" +
        "}\n" +
        "UNION {\n" +
        "dbr:Nikola_Tesla dbo:deathDate ?object.\n" +
        "BIND(dbo:deathDate as ?predicate)\n" +
        "}\n" +
        "UNION {\n" +
        "dbr:Nikola_Tesla rdfs:label ?object.\n" +
        "BIND(rdfs:label as ?predicate)\n" +
        "}\n" +
        "UNION {\n" +
        "dbr:Nikola_Tesla rdfs:comment ?object.\n" +
        "BIND(rdfs:comment as ?predicate)\n" +
        "}\n" +
        "UNION {\n" +
        "dbr:Nikola_Tesla ?foafPredicate ?object.\n" +
        'FILTER(STRSTARTS(STR(?foafPredicate), "http://xmlns.com/foaf/0.1/"))\n' +
        "BIND(?foafPredicate as ?predicate)\n" +
        "}\n" +
        'FILTER(!isLiteral(?object) ||langMatches(lang(?object),"EN") || datatype(?object)=xsd:date)\n' +
        "BIND(dbr:Nikola_Tesla as ?subject)}\n" +
        "Limit 100",
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
    const dbpediaHandler = new DBPediaLoader();
    dbpediaHandler.setGraph(this.state.graphURL);
    dbpediaHandler.setDBPediaURL(this.state.endpointURL);
    dbpediaHandler.setQuery(this.state.query);

    dbpediaHandler.executePromisedQuery(this.state.query).then(res => {
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
                <b>Graph URL:</b>
                <Input
                  type="text"
                  onChange={t => {
                    this.handleInputChange("graphURL", t);
                  }}
                  value={this.state.graphURL}
                />
              </Label>
            </FormGroup>

            <div>
              <b> QUERY: </b> <br />
              <b>
                {" "}
                <i>*Note*</i>{" "}
              </b>{" "}
              The select clause requires ?subject ?predicate ?object as variable
              selection <br />
              This is due to how the SPARQL results are parsed and transformed
              into a Resource Relation Model
              <textarea
                type="text"
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
