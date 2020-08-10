import * as $CONST from "./BaseComponentConstants";

export default class BaseModel {
  constructor() {
    this.type = $CONST.TYPE_ABSTRACT_MODEL; // default type;
    this.modelAsJsonObject = null;
    this.__resourceIdentifier = "baseModelResourceIdentifier"; //MUST CHANGE in derived models
  }

  /** -------------- EXPOSED FUNCTIONS -------------- DO NOT OVERWRITE **/
  getResult = () => {
    return this.modelAsJsonObject;
  };

  getResourceIdentifier = () => {
    return this.__resourceIdentifier;
  };

  setResourceIdentifier = id => {
    // this specifies the property name in the object  to which we look up in the map ;
    this.__resourceIdentifier = id;
  };

  /** -------------- Must OVERWRITE FUNCTIONS --------------**/
  __isInMap__ = (map, identifier) => {
    return true; // if is in map (per default this blocks to add items to model)!
  };

  __resourceIdentifier__ = resourceObject => {
    // returns a string for resourceIdentifier, should be unique;
  };

  __isEqual__ = (a, b) => {
    // input a and b are objects with properties where some are maybe equal
    return false;
  };
}
