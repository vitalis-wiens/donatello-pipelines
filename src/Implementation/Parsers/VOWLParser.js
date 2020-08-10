import * as $CONST from "../Base/BaseComponentConstants";
import BaseComponent from "../Base/BaseComponent";

import ResourceRelationModel from "../Models/ResourceRelationModel";
import Resource from "../Models/Resource";
import Relation from "../Models/Relation";

export default class VOWLParser extends BaseComponent {
  constructor() {
    super();
    this.type = $CONST.TYPE_VOWL_PARSER;
    this.resultingModelObject = null;
  }

  /** -------------- Must OVERWRITE FUNCTIONS --------------**/
  __run__ = async () => {
    const m = new ResourceRelationModel();
    const processedData = this._preProcess();
    this._processData(m, processedData);
  };

  _processData(model, dataObject) {
    this.__processResources(model, dataObject);
    this.__processRelations(model, dataObject);
    this.resultObject.resultingModel = model;
  }

  /** -------------- INTERNAL FUNCTIONS -------------- **/
  __processLabels(resource, modelResource) {
    // unroll the labels as rdfs:labels;
    if (resource.label) {
      // label can be an object or a string?
      if (typeof resource.label === "string") {
        modelResource.addAnnotation("rdfs:label", resource.label);
      } else {
        for (const name in resource.label) {
          if (resource.label.hasOwnProperty(name)) {
            if (name !== "IRI-based") {
              modelResource.addAnnotation(
                "rdfs:label",
                resource.label[name],
                name
              );
            }
          }
        }
      }
    }
  }

  __processComments(resource, modelResource) {
    if (resource.comment) {
      // label can be an object or a string?
      if (typeof resource.comment === "string") {
        modelResource.addAnnotation("rdfs:comment", resource.comment);
      } else {
        for (const name in resource.comment) {
          if (resource.comment.hasOwnProperty(name)) {
            if (name !== "IRI-based") {
              modelResource.addAnnotation(
                "rdfs:comment",
                resource.comment[name],
                name
              );
            }
          }
        }
      }
    }
  }

  __processResourceAxioms(resource, modelResource) {
    if (resource.equivalent) {
      resource.equivalent.forEach(eq => {
        modelResource.addAxiom(modelResource, "owl:equivalentClass", eq);
      });
    }
    if (resource.superClasses) {
      resource.superClasses.forEach(sc => {
        modelResource.addAxiom(modelResource, "rdfs:subClassOf", sc);
      });
    }
  }

  __processRelationAxioms(relation, modelResource) {
    //  ignore for now;
  }

  __processRelationAttributes(relation, modelRelation) {
    // vowl has max one domain and one range ( if not given it will be owl:THING in VOWL )
    if (relation.domain) {
      modelRelation.addDomain(relation.domain);
    }
    if (relation.range) {
      modelRelation.addRange(relation.range);
    }

    if (relation.domain && relation.range) {
      modelRelation.addDomainRangePair(relation.domain, relation.range);
    }
  }

  __processResources(model, dataObject) {
    dataObject.resources.forEach(resource => {
      // if there is no IRI FOR THIS ONE check the type of VOWL;
      if (!resource.iri) {
        resource.__resourceIdentifier = resource.type; // kindOF processing type as IRI (e.g. OWL:THING or so)
      } else {
        resource.__resourceIdentifier = resource.iri;
      }

      const modelResource = new Resource();
      // fetch info from it;
      modelResource.resourceIdentifier(resource.__resourceIdentifier);
      modelResource._resourceURI = resource.iri;
      modelResource.addSemanticType(resource.type);

      this.__processLabels(resource, modelResource);
      this.__processComments(resource, modelResource);
      this.__processResourceAxioms(resource, modelResource);
      model.addResource(modelResource);
    });
  }

  __processRelations(model, dataObject) {
    dataObject.relations.forEach(relation => {
      if (!relation.iri) {
        relation.__resourceIdentifier = relation.type; // kindOF processing type as IRI (e.g. OWL:THING or so)
      } else {
        relation.__resourceIdentifier = relation.iri;
      }

      // VOWL provides axioms directly as relations, here ignore.
      if (relation.type === "rdfs:SubClassOf") {
        return;
      }

      const modelRelation = new Relation();
      // fetch info from it;
      modelRelation.resourceIdentifier(relation.__resourceIdentifier);
      modelRelation._resourceURI = relation.iri;
      modelRelation.addSemanticType(relation.type);

      this.__processLabels(relation, modelRelation);
      this.__processComments(relation, modelRelation);
      this.__processRelationAxioms(relation, modelRelation);
      this.__processRelationAttributes(relation, modelRelation);

      model.addRelation(modelRelation);
    });
  }
  _preProcess = () => {
    // we merge the vowl json data ;
    const classArray = this.inputDataAsJsonObject.class;
    const propArray = this.inputDataAsJsonObject.property;

    // how to merge that;
    let resourceMap = new Map(classArray.map(d => [d.id, d]));
    let relationMap = new Map(propArray.map(d => [d.id, d]));

    const cAttr = this.inputDataAsJsonObject.classAttribute;
    const pAttr = this.inputDataAsJsonObject.propertyAttribute;

    cAttr.forEach(item => {
      item.type = resourceMap.get(item.id).type;
    });

    // now use the new attributes array as map input
    resourceMap = new Map(cAttr.map(d => [d.id, d]));

    cAttr.forEach(item => {
      if (item.superClasses) {
        for (let i = 0; i < item.superClasses.length; i++) {
          item.superClasses[i] = resourceMap.get(item.superClasses[i]).iri;
        }
      }
      if (item.equivalent) {
        for (let i = 0; i < item.equivalent.length; i++) {
          item.equivalent[i] = resourceMap.get(item.equivalent[i]).iri;
        }
      }
    });

    pAttr.forEach(item => {
      item.type = relationMap.get(item.id).type;
      if (item.domain) {
        // overwrite it to be an uri;
        item.domain = resourceMap.get(item.domain).iri;
      }
      if (item.range) {
        // overwrite it to be an uri;
        item.range = resourceMap.get(item.range).iri;
      }
    });

    // now use the new attributes array as map input
    relationMap = new Map(pAttr.map(d => [d.id, d]));
    pAttr.forEach(item => {
      if (item.subproperty) {
        for (let i = 0; i < item.subproperty.length; i++) {
          item.subproperty[i] = relationMap.get(item.subproperty[i]).iri;
        }
      }
      if (item.equivalent) {
        for (let i = 0; i < item.equivalent.length; i++) {
          item.equivalent[i] = relationMap.get(item.equivalent[i]).iri;
        }
      }
      if (item.inverse) {
        item.inverse = relationMap.get(item.inverse).iri;
      }
    });
    return { resources: cAttr, relations: pAttr };
  };
}
