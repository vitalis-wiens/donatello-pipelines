export default class ShapeTools {
  // we use the attributes of the shape to render it ;)
  getShapeRadius = shape => {
    // get the shape radius based on shape parameters;
    return parseFloat(shape.attr("rx"));
  };

  getShapeWidth = shape => {
    // get the shape radius based on shape parameters;
    return parseFloat(shape.attr("width"));
  };

  getShapeHeight = shape => {
    // get the shape radius based on shape parameters;
    return parseFloat(shape.attr("height"));
  };
}
