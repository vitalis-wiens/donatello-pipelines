import * as $CONST from "../Base/BaseComponentConstants";
import BaseComponent from "../Base/BaseComponent";

import ResourceRelationModel from "../Models/ResourceRelationModel";
import Resource from "../Models/Resource";
import Relation from "../Models/Relation";

export default class WikiDataExampleParser extends BaseComponent {
  constructor() {
    super();
    this.type = $CONST.TYPE_SPARQL_PARSER;

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
    dataObject.forEach((statement, index) => {
      const subject = statement.subject;
      const predicate = statement.predicate;
      const object = statement.object;

      // needs to be processed as a whole triple
      // subject resource
      const subjectResource = new Resource();
      const propertyRelation = new Relation();
      const objectResource = new Resource();

      // handling the identifier;
      subjectResource.resourceIdentifier(subject.value);
      if (this.validIRI(subject.value)) {
        subjectResource._resourceURI = subject.value;
      }

      propertyRelation.resourceIdentifier(predicate.value);
      if (this.validIRI(predicate.value)) {
        propertyRelation._resourceURI = predicate.value;
      }

      objectResource.resourceIdentifier(object.value);
      if (this.validIRI(object.value)) {
        objectResource._resourceURI = object.value;
      }

      let ignoreSubjectResource = false;
      let ignoreObjectResource = false;
      let ignorePropertyRelation = false;

      if (this.definitionMap[predicate.value] === "assertion") {
        if (this.definitionMap[object.value] !== "relationalAssertion") {
          subjectResource.addSemanticType(object.value);
        } else {
          console.log("TODO: add sematic type to the relation");
        }
        model.addResource(subjectResource);
        return;
      }

      /** axioms **/
      switch (this.definitionMap[predicate.value]) {
        case "axiom":
          subjectResource.addAxiom(
            subject.value,
            predicate.value,
            object.value
          );
          ignoreObjectResource = true;
          break;
        case "annotation":
          if (object["xml:lang"]) {
            subjectResource.addAnnotation(
              predicate.value,
              object.value,
              object["xml:lang"]
            );
          } else {
            subjectResource.addAnnotation(predicate.value, object.value);
          }

          ignoreObjectResource = true;
          ignorePropertyRelation = true;
          break;
        default:
          propertyRelation.addDomain(subject.value);
          propertyRelation.addRange(object.value);
          propertyRelation.addDomainRangePair(subject.value, object.value);

          ignoreObjectResource = true;
          ignoreSubjectResource = true;
      }

      if (!ignoreSubjectResource) {
        model.addResource(subjectResource);
      }
      if (!ignorePropertyRelation) {
        model.addRelation(propertyRelation);
      }
      if (!ignoreObjectResource) {
        model.addResource(objectResource);
      }
    });
    this.resultObject.resultingModel = model;
  }

  /** -------------- INTERNAL FUNCTIONS -------------- **/

  _preProcess = () => {
    console.log(
      "WIKIDATA PREPROCESSING SPARQL PARSER PREPROCESS",
      this.inputDataAsJsonObject
    );

    const output = []; // array holding the statements;
    const input = this.inputDataAsJsonObject;
    // assumptions;
    // we always have a head and a results object

    const binds = input.results.bindings;

    const subject = "h";
    const subjectLabel = "hLabel";
    const predicateDeath = "causeOfDeath";
    const causeOfDeathObject = "cause";
    const causeOfDeathObjectLabel = "causeLabel";
    const predicateDeathYear = "deathYear";

    binds.forEach(res => {
      // create statements:

      // map the variable names here; *NOTE* THIS ONE IS FIXED FOR THE DEMO !!!

      const aStatement = {};
      aStatement.subject = res[subject];
      aStatement.predicate = {
        type: "uri",
        value: "http://www.w3.org/2000/01/rdf-schema#label"
      };
      aStatement.object = res[subjectLabel];

      // add statment for the causeOfDeath;
      const bStatement = {};
      bStatement.subject = res[subject];
      bStatement.predicate = {
        type: "uri",
        value: "http://example.org/" + predicateDeath
      };
      bStatement.object = res[causeOfDeathObject];

      const cStatement = {};
      cStatement.subject = res[causeOfDeathObject];
      cStatement.predicate = {
        type: "uri",
        value: "http://www.w3.org/2000/01/rdf-schema#label"
      };
      cStatement.object = res[causeOfDeathObjectLabel];

      const dStatement = {};
      dStatement.subject = res[subject];
      dStatement.predicate = {
        type: "uri",
        value: "http://example.org/" + predicateDeathYear
      };
      dStatement.object = res["year"];

      output.push(aStatement);
      output.push(bStatement);
      output.push(cStatement);
      output.push(dStatement);
    });

    this.allStatements = [].concat(this.allStatements, output);
    return output; // this can be useful for batch processing;
  };

  validIRI(str) {
    const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return urlregex.test(str);
  }
}
