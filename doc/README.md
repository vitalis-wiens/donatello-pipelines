# Documentation 
This document provides a documentation of the source code.

__WORK IN PROGRESS__ 

# Implementation

### Base
The base folder contains the basic components from which we derive other specialized components.

* BaseComponentContants.js 
    * Defines enum like types 
*   BaseComponent.js 
    * The core component provide basic functions for components.
        *  getResult(): returns output data from executed component 
        *  setInputData(): provides input data (as JSON object)
        *  execute():  async function that calls internal functions \__run__() and \__postRun__().
        
            __Typically__  derived components overwrite the \__run__() function and can also optionally overwrite the \__postRun\__() function
                    
             __Data__  is accessed using this object whereas input is given as member variable 'inputDataAsJsonObject'

*   BaseModel.js 
    * The core data model. 
        *  getResult(): returns output model as JSON object 
        
            This is an __abstract model__.  
             
            
*   globalHelper.js 
    * A helper component for functions that are frequently used in different components 
        *  validIRI(string): returns __true__ if regex is satisfied.
        *  get(string): sends a promised XMLHttpRequest() to the URL provided by the string parameter. Return value is a string in JSON fromat.
        
           
*   LanguageTools.js 
    * helper functions to convert iris to labels or getting labels in different languages based on label tag. 
        *  searchLanguage(textObject, preferredLanguage): returns label in preferred Language if (language === preferredLanguage && textObject.hasOwnProperty(language))
          This helps to access for example language tags stored in rdfs:label.
        *  IRI2Label(prefixMap, iri): returns a shortend label e.g. 'http://examle.org/resourceLabel' -> ex:resourceLabel if prefix map has the correct mapping, otherwise it will return just the suffix of the iri (here 'resourceLabel').
        *  textInLanguage(prefixMap, iri): uses searchLanguage() function with the order to try to fetch the en tag, then the default tag. If input is a string and is a validIRI, it will return the suffix of IRI. 
        default 
        
            
