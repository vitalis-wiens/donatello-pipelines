import BaseComponent from "../Base/BaseComponent";

import ResourceRelationModel from "../Models/ResourceRelationModel";
import Resource from "../Models/Resource";
import Relation from "../Models/Relation";

export default class ORKGParser extends BaseComponent {
  constructor() {
    super();
    this.type = "ORKGParser";

    this.definitionMap = {
      // assertions
      "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "assertion",
      "rdf:type": "assertion",
      //axioms
      "http://www.w3.org/2000/01/rdf-schema#subClassOf": "axiom",
      "http://www.w3.org/2000/01/rdf-schema#subPropertyOf": "axiom",
      "http://www.w3.org/2002/07/owl#equivalentClass": "axiom",

      // annotations
      "http://www.w3.org/2000/01/rdf-schema#comment": "annotation",
      "http://www.w3.org/2000/01/rdf-schema#label": "annotation",
      "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": "annotation",

      // relational assertions:
      "owl:ObjectProperty": "relationalAssertion",
      "owl:DatatypeProperty": "relationalAssertion"
    };
  }

  /** -------------- Must OVERWRITE FUNCTIONS --------------**/
  __run__ = async () => {
    const m = new ResourceRelationModel();
    const processedData = this._preProcess();
    this._processData(m, processedData);
  };

  _processData(model, dataObject) {
    dataObject.forEach(statement => {
      // create resources for subjects and objects;
      const subjectResource = new Resource();
      subjectResource.resourceIdentifier(statement.subject.id);
      subjectResource.addSemanticType("Resource");
      subjectResource.addAnnotation(
        "http://www.w3.org/2000/01/rdf-schema#label",
        statement.subject.label
      );

      const objectResource = new Resource();
      objectResource.resourceIdentifier(statement.object.id);
      if (statement.object._class === "literal") {
        objectResource.addSemanticType("Literal");
      } else {
        objectResource.addSemanticType("Resource");
      }
      objectResource.addAnnotation(
        "http://www.w3.org/2000/01/rdf-schema#label",
        statement.object.label
      );

      const propertyRelation = new Relation();
      propertyRelation.resourceIdentifier(statement.predicate.id);
      propertyRelation.addSemanticType("Property");
      propertyRelation.addAnnotation(
        "http://www.w3.org/2000/01/rdf-schema#label",
        statement.predicate.label
      );
      propertyRelation.addDomain(statement.object.id);
      propertyRelation.addRange(statement.object.id);
      propertyRelation.addDomainRangePair(
        statement.subject.id,
        statement.object.id
      );

      model.addResource(subjectResource);
      model.addRelation(propertyRelation);
      model.addResource(objectResource);
    });

    this.resultObject.resultingModel = model;
  }

  /** -------------- INTERNAL FUNCTIONS -------------- **/

  _preProcess = () => {
    return this.inputDataAsJsonObject;
  };
}
