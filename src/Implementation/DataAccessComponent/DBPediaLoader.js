import * as $CONST from "../Base/BaseComponentConstants";
import BaseComponent from "../Base/BaseComponent";
import { get } from "../Base/globalHelper";

export default class DBpediaProxyLoader extends BaseComponent {
  constructor() {
    super();
    this.resultingDataObject = null;
    this.type = $CONST.TYPE_DBPEDIA_PROXY;
    this.dbPediaURL = "https://live.dbpedia.org/sparql/";
    this.dbPediaGraph = "http://dbpedia.org";
    this.suffix =
      "&format=application%2Fsparql-results%2Bjson&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on&run=+Run+Query+";
    this.exampleQuery =
      "select ?subject ?predicate ?object where { ?subject ?predicate ?object} Limit 10";
    this.teslaExample =
      "PREFIX dbr: <http://dbpedia.org/resource/>\n" +
      "PREFIX dbo: <http://dbpedia.org/ontology/>\n" +
      "PREFIX owl: <http://www.w3.org/2002/07/owl#>\n" +
      "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
      "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n" +
      "select distinct ?subject ?predicate ?object where { \n" +
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
      "Limit 100";
    this.query = this.teslaExample;
  }

  getResult = () => {
    return this.dataHandlerObject.theData;
  };

  execute = async () => {
    await this.__run__();
  };

  __run__ = async () => {
    this.dataHandlerObject = {};
    this.dataHandlerObject.theData = await this.executePromisedQuery(
      this.query
    );
  };

  /** -------------- Exposed Functions --------------**/
  setQuery = query => {
    this.query = query;
  };

  setGraph = graph => {
    this.dbPediaGraph = graph;
  };

  setDBPediaURL = url => {
    this.dbPediaURL = url;
  };

  executePromisedQuery = async fullQuery => {
    const that = this;
    let res = "";
    const queryPromise = new Promise(function(resolve) {
      const requestPath =
        that.dbPediaURL +
        "?default-graph-uri=" +
        encodeURIComponent(that.dbPediaGraph) +
        "&query=" +
        encodeURIComponent(fullQuery) +
        that.suffix;

      get(requestPath).then(result => {
        res = result;
        resolve();
      });
    });
    await queryPromise;
    return JSON.parse(res);
  };
}
