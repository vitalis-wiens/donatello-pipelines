export default class BasePrimitive {
  constructor() {
    this.__id = undefined;
    this.__displayName = undefined;
    this.__renderingConfig = undefined;
    this.__drawTools = undefined;

    this.__visible = true;

    this.groupRoot = undefined;
  }

  visible(visible) {
    if (!arguments.length) {
      return this.__visible;
    }
    this.__visible = visible;
  }

  id(id) {
    if (!arguments.length) {
      return this.__id;
    }
    this.__id = id;
  }

  drawTools(drawTools) {
    if (!arguments.length) {
      return this.__drawTools;
    }
    this.__drawTools = drawTools;
  }

  displayName(nameStr) {
    if (!arguments.length) {
      return this.__displayName;
    }
    this.__displayName = nameStr;
  }

  renderingConfig = cfgObj => {
    if (!cfgObj) {
      return this.__renderingConfig;
    }
    // using deepCopy
    this.__renderingConfig = JSON.parse(JSON.stringify(cfgObj));
    // this will allow a primitive to overwrite the global definitions;
  };

  render() {
    console.log("This is abstract function!");
  }
}
