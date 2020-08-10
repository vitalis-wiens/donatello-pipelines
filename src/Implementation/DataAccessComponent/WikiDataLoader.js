import BaseComponent from "../Base/BaseComponent";
import { get } from "../Base/globalHelper";

export default class WikiDataLoader extends BaseComponent {
  constructor() {
    super();

    this.resultingDataObject = null;
    this.type = "WIKI_DATA_LOADER";
    this.wikiDataEndpointURL = "https://query.wikidata.org/";
    this.suffix = "&format=json";
    this.exampleQuery =
      "SELECT ?h ?hLabel ?cause ?causeLabel (YEAR(?date) AS ?year) WHERE {\n" +
      "?h wdt:P39 wd:Q11696;\n" +
      "   wdt:P509 ?cause;\n" +
      "   wdt:P570 ?date\n" +
      'SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }\n' +
      "} ORDER BY ?year";
    this.query = this.exampleQuery;
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

  setEndPointURL = url => {
    this.wikiDataEndpointURL = url;
  };

  // add the query as parameter to be able to call this function from outside with modified queries
  executePromisedQuery = async fullQuery => {
    const that = this;
    let res = "";
    const queryPromise = new Promise(function(resolve) {
      const requestPath =
        that.wikiDataEndpointURL +
        "sparql" +
        "?query=" +
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
