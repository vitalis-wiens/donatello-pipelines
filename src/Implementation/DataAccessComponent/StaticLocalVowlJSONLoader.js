import * as $CONST from "../Base/BaseComponentConstants";
import * as ontologyFile from "../../demoRequests/ontologyFile";
import BaseComponent from "../Base/BaseComponent";

export default class StaticLocalVowlJSONLoader extends BaseComponent {
  constructor() {
    super();
    this.type = $CONST.TYPE_VOWL_STATIC_LOCAL;
  }

  execute = async () => {
    await this.__run__();
  };

  getResult = () => {
    return this.dataHandlerObject.theData;
  };

  __run__ = async () => {
    if (!this.dataHandlerObject) {
      this.dataHandlerObject = {};
    }
    this.dataHandlerObject.theData = JSON.parse(
      JSON.stringify(ontologyFile.default)
    );
  };
}
