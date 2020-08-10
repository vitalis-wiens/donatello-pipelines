import { validIRI } from "../../Implementation/Base/globalHelper";

export default class Resource {
  constructor() {
    this._resourceURI = undefined;
    this._semanticType = [];
    this._annotations = {};
    this._axioms = {};
    this.__resourceIdentifier = undefined;

    this.prefixMapperL2S = {
      "http://www.w3.org/2000/01/rdf-schema#": "rdfs"
    };
  }

  resourceIdentifier(val) {
    if (!arguments.length) {
      return this.__resourceIdentifier;
    }
    this.__resourceIdentifier = val;
  }

  addSemanticType(t) {
    if (this._semanticType.indexOf(t) === -1) {
      this._semanticType.push(t);
    }
  }

  addAnnotation = (name, value, lang) => {
    // annotations are literals with optional language tags;

    let inputName = name;
    if (validIRI(name)) {
      let suffix = name.split("#")[1];
      let pref = "";
      if (!suffix) {
        const tokens = name.split("/");
        suffix = tokens[tokens.length - 1];
        for (let i = 0; i < tokens.length - 1; i++) {
          pref += tokens[i];
        }
        pref += "/";
      } else {
        pref = name.split("#")[0];
        pref += "#";
      }

      const prName = this.prefixMapperL2S[pref];
      if (prName) {
        inputName = prName + ":" + suffix;
      }
    }
    if (!this._annotations[inputName]) {
      this._annotations[inputName] = {};
    }

    let languageSelector = "default";
    if (lang && lang !== "undefined") {
      languageSelector = lang;
    }
    const tm = this._annotations[inputName];
    if (!tm[languageSelector]) {
      tm[languageSelector] = []; // array of strings for given language
    }
    tm[languageSelector].push(value);
  };

  addAxiom(subject, axiom, object) {
    // subject for now ignored;
    if (!this._axioms.hasOwnProperty(axiom)) {
      this._axioms[axiom] = [];
    }
    this._axioms[axiom].push(object);
  }

  integrateResource(src) {
    // adds stuff to this resource;
    // semantic type?
    src._semanticType.forEach(t => {
      this.addSemanticType(t); // no need for checking, it is done in the function itself;
    });
    // annotations is an object;
    for (const name in src._annotations) {
      if (src._annotations.hasOwnProperty(name)) {
        const annoType = src._annotations[name];
        // check if this name exist in this ;
        if (!this._annotations[name]) {
          this._annotations[name] = {};
        }
        //
        for (const langType in annoType) {
          if (annoType.hasOwnProperty(langType)) {
            // check if this object has it;
            const value = annoType[langType]; // value is an array
            const tm = this._annotations[name];
            if (!tm[langType]) {
              tm[langType] = []; // array of strings for given language
            }
            value.forEach(str => {
              if (tm[langType].indexOf(str) === -1) {
                tm[langType].push(str);
              }
            });
          }
        }
      }
    }

    // check for axioms merging
    for (const name in src._axioms) {
      if (src._axioms.hasOwnProperty(name)) {
        if (!this._axioms[name]) {
          this._axioms[name] = [];
        }
        // get array of axioms holders;
        const axAr = src._axioms[name];
        axAr.forEach(ax => {
          // check if exists;
          if (this._axioms[name].indexOf(ax) === -1) {
            this._axioms[name].push(ax);
          }
        });
      }
    }
  }
}
