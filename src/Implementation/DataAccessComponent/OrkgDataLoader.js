import BaseComponent from "../Base/BaseComponent";
import { get } from "../Base/globalHelper";

export default class WikiDataLoader extends BaseComponent {
  constructor() {
    super();
    this.resultingDataObject = null;
    this.type = "ORKG_DATA_LOADER";
    this.endpointURL = "https://www.orkg.org/orkg/";
    this.requestParameters = "api/statements/subject/";
    this.requestResourceId = "R8186";
    this.suffix = "/?desc=true&items=9999&page=1&sortBy=created_at";
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
  setRequestResourceId = id => {
    this.requestResourceId = id;
  };

  setEndPointURL = url => {
    this.endpointURL = url;
  };

  executePromisedQuery = async () => {
    const that = this;
    let res = "";
    const queryPromise = new Promise(function(resolve) {
      const requestPath =
        that.endpointURL +
        that.requestParameters +
        that.requestResourceId +
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
