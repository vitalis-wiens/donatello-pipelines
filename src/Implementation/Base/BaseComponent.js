import * as $CONST from "./BaseComponentConstants";

export default class BaseComponent {
  constructor() {
    this.type = $CONST.TYPE_ABSTRACT_BASE_COMPONENT;
    this.inputDataAsJsonObject = null;
    this.resultObject = {};
  }

  /** -------------- EXPOSED FUNCTIONS -------------- DO NOT OVERWRITE **/
  getResult = () => {
    return this.resultObject;
  };

  setInputData = inputDataAsJsonObject => {
    this.inputDataAsJsonObject = inputDataAsJsonObject;
  };

  execute = async () => {
    if (!this.inputDataAsJsonObject) {
      console.log("No JSON object given as data input ");
      return;
    }

    await this.__run__();
    this._postRun_();
  };

  /** -------------- Must OVERWRITE FUNCTIONS --------------**/
  __run__ = () => {};

  /** -------------- INTERNAL FUNCTIONS -------------- **/
  _postRun_ = () => {
    // Options do define post execution functions,
  };
}
