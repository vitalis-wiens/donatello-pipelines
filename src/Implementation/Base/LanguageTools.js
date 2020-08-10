import { validIRI } from "./globalHelper";
export default class LanguageTools {
  static textInLanguage = (textObject, preferredLanguage) => {
    if (typeof textObject === "undefined") {
      return undefined;
    }

    if (typeof textObject === "string") {
      if (validIRI(textObject)) {
        let suffix = textObject.split("#")[1];
        if (!suffix) {
          const tokens = textObject.split("/");
          suffix = tokens[tokens.length - 1];
        }
        return suffix;
      }
      return textObject;
    }

    if (preferredLanguage && textObject.hasOwnProperty(preferredLanguage)) {
      return textObject[preferredLanguage][0];
    }

    let textForLanguage = this.searchLanguage(textObject, "en");
    if (textForLanguage) {
      return textForLanguage[0];
    }
    textForLanguage = this.searchLanguage(textObject, "default");
    if (textForLanguage) {
      return textForLanguage[0];
    }
    return null;
  };

  static IRI2Label(prefixMap, IRI) {
    let suffix = IRI.split("#")[1];
    let pref = "";
    if (!suffix) {
      const tokens = IRI.split("/");
      suffix = tokens[tokens.length - 1];
      for (let i = 0; i < tokens.length - 1; i++) {
        pref += tokens[i];
      }
      pref += "/";
    } else {
      pref = IRI.split("#")[0];
      pref += "#";
    }
    let output = "";
    const prName = prefixMap[pref];
    if (prName) {
      output = prName + ":" + suffix;
    } else {
      output = suffix;
    }
    return output;
  }

  static searchLanguage = (textObject, preferredLanguage) => {
    for (const language in textObject) {
      if (
        language === preferredLanguage &&
        textObject.hasOwnProperty(language)
      ) {
        return textObject[language];
      }
    }
  };
}
