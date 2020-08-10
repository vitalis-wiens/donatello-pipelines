import JSZip from "jszip";
import JSZipUtils from "jszip-utils";
import * as Bundle from "../demoBundle.zip";

import * as fileSaver from "file-saver";

export default class createZipBundle {
  constructor(param) {
    this.componentDefinitions = param;
  }
  execute = () => {
    console.log("Creating zip file ");
    console.log("Has param", this.componentDefinitions);
    const that = this;
    JSZipUtils.getBinaryContent(Bundle, function(err, data) {
      if (err) {
        throw err; // or handle err
      }
      JSZip.loadAsync(data).then(function(zip) {
        // create import definitions for the pipeline;

        const imports = [];
        const components = [];

        // define the imports for  the correct data handler and parser
        if (that.componentDefinitions.selectedDataSource === "Ontology File") {
          imports.push(
            'import StaticLocalVowlJSONLoader from "./Implementation/DataAccessComponent/StaticLocalVowlJSONLoader"; '
          );
          imports.push(
            'import VOWLParser from "./Implementation/Parsers/VOWLParser";'
          );
          components.push("const loader = new StaticLocalVowlJSONLoader()");
          components.push("const parser = new VOWLParser()");
        }
        if (that.componentDefinitions.selectedDataSource === "DBPedia") {
          imports.push(
            'import DBPediaLoader from "./Implementation/DataAccessComponent/DBPediaLoader";'
          );
          imports.push(
            'import SparqlParser from "./Implementation/Parsers/SparqlParser";'
          );

          components.push("const loader = new DBPediaLoader()");
          components.push("const parser = new SparqlParser()");
        }
        if (that.componentDefinitions.selectedDataSource === "WikiData") {
          // import WikiDataLoader from "./Implementation/DataAccessComponent/WikiDataLoader";
          // import WikiDataExampleParser from "./Implementation/Parsers/WikiDataParserExample";
          imports.push(
            'import WikiDataLoader from "./Implementation/DataAccessComponent/WikiDataLoader";'
          );
          imports.push(
            'import WikiDataExampleParser from "./Implementation/Parsers/WikiDataParserExample";'
          );
          components.push("const loader = new WikiDataLoader()");
          components.push("const parser = new WikiDataExampleParser()");
        }
        if (that.componentDefinitions.selectedDataSource === "ORKG") {
          imports.push(
            'import OrkgDataLoader from "./Implementation/DataAccessComponent/OrkgDataLoader";'
          );
          imports.push(
            'import ORKGParser from "./Implementation/Parsers/ORKGParser";'
          );
          components.push("const loader = new OrkgDataLoader()");
          components.push("const parser = new ORKGParser()");
        }

        // define the imports for  the correct vertex edge mapper // here default
        imports.push(
          'import BaseVertexEdgeMapper from "./Implementation/Mappers/BaseVertexEdgeMapper";'
        );

        components.push("const mapper1 = new BaseVertexEdgeMapper()");
        // define the imports for  the correct node-link mapper // here default

        if (
          that.componentDefinitions.selectedNodeLinkMapper === "Basic Mapper"
        ) {
          imports.push(
            'import BaseNodeLinkMapper from "./Implementation/Mappers/BaseNodeLinkMapper";'
          );
          components.push("const mapper2 = new BaseNodeLinkMapper()");
        }
        if (that.componentDefinitions.selectedNodeLinkMapper === "VOWL") {
          imports.push(
            'import VowlNodeLinkMapper from "./Implementation/Mappers/VowlNodeLinkMapper";'
          );
          components.push("const mapper2 = new VowlNodeLinkMapper()");
        }
        if (that.componentDefinitions.selectedNodeLinkMapper === "RDF") {
          imports.push(
            'import RDFNodeLinkMapper from "./Implementation/Mappers/RDFNodeLinkMapper";'
          );
          components.push("const mapper2 = new RDFNodeLinkMapper()");
        }
        if (that.componentDefinitions.selectedNodeLinkMapper === "UML") {
          imports.push(
            'import UMLNodeLinkMapper from "./Implementation/Mappers/UMLNodeLinkMapper";'
          );
          components.push("const mapper2 = new UMLNodeLinkMapper()");
        }

        // rendering module imports;
        if (
          that.componentDefinitions.renderingModuleConfig.configSelected ===
          "ORKG"
        ) {
          imports.push(
            'import OrkgGraph from "./Implementation/Renderes/gizmoRenderer/orkgGraph";'
          );
          components.push("const graph = new OrkgGraph()");
        } else {
          imports.push(
            'import VOWLRenderer from "./Implementation/Renderes/gizmoRenderer/vowlGraph";'
          );
          components.push("const graph = new VOWLRenderer()");
        }

        //
        // rendering handlers;
        if (
          that.componentDefinitions.renderingModuleConfig.configSelected ===
          "Default"
        ) {
          imports.push(
            'import BasicRenderingHandler from "./Implementation/Renderes/gizmoRenderer/renderingConfigs/BasicRenderingHandler";'
          );
          components.push(
            "const renderingConfig = new BasicRenderingHandler()"
          );
        }
        // rendering handlers;
        if (
          that.componentDefinitions.renderingModuleConfig.configSelected ===
          "VOWL"
        ) {
          imports.push(
            'import VOWLRenderingHandler from "./Implementation/Renderes/gizmoRenderer/renderingConfigs/VOWLRenderingHandler";'
          );
          components.push("const renderingConfig = new VOWLRenderingHandler()");
        }
        if (
          that.componentDefinitions.renderingModuleConfig.configSelected ===
          "RDF"
        ) {
          imports.push(
            'import RDFStyledRenderingHandler from "./Implementation/Renderes/gizmoRenderer/renderingConfigs/RDFStyledRenderingHandler";'
          );
          components.push(
            "const renderingConfig = new RDFStyledRenderingHandler()"
          );
        }
        if (
          that.componentDefinitions.renderingModuleConfig.configSelected ===
          "UML"
        ) {
          imports.push(
            'import UMLStyledRenderingHandler from "./Implementation/Renderes/gizmoRenderer/renderingConfigs/UMLStyledRenderingHandler";'
          );
          components.push(
            "const renderingConfig = new UMLStyledRenderingHandler()"
          );
        }

        // console.log(imports);
        // console.log(components);

        const renderingConfig = that.componentDefinitions.renderingModuleConfig;

        let execFunctionDef = "\n\n";
        execFunctionDef +=
          "export default class Pipeline {\n\n" +
          "executePipeline = () => {\n" +
          ' console.log("Executing pipeline");\n';

        // create the components from the components;

        components.forEach(item => {
          execFunctionDef += "  " + item + "\n";
        });

        execFunctionDef += "\n\n";
        execFunctionDef += "graph.setRenderingConfig(renderingConfig);\n";

        execFunctionDef +=
          "const config={" +
          JSON.stringify(renderingConfig, null, "\t") +
          " };\n";

        execFunctionDef +=
          'graph.setRenderingContainer("renderingContainer");\n' +
          "graph.configureGraphInteractions(config);\n";
        // exec the pipeline;

        execFunctionDef +=
          "  loader.execute().then(() => {\n" +
          "    parser.setInputData(loader.getResult());\n" +
          "    parser.execute().then(() => {});\n\n" +
          "    mapper1.setInputData(parser.getResult());\n" +
          "    mapper1.execute().then(() => {\n" +
          "      mapper2.setInputData(mapper1.getResult());\n" +
          "      mapper2.execute().then(() => {\n" +
          "        graph.setModel(mapper2.getResult().resultingModel.getResult());\n" +
          "        // do the rendering magic\n" +
          "        graph.initializeRenderingContainer();\n" +
          "        graph.createRenderingElements();\n" +
          "        graph.drawRenderingPrimitives();\n" +
          "      });\n" +
          "    });\n" +
          "  });\n" +
          "}";

        execFunctionDef += "};";

        let importDefs = "";
        imports.forEach(im => {
          importDefs += im + "\n";
        });

        // console.log(importDefs);
        // console.log(execFunctionDef);

        // overwrite the pipeline.js file in the zip;
        zip.file("src/pipeline.js", importDefs + execFunctionDef);

        // zip
        //   .file("src/pipeline.js")
        //   .async("string")
        //   .then(function(data) {
        //
        //   });
        // zip.generateAsync({ type: "base64" }).then(function(base64) {
        //   window.location = "data:application/zip;base64," + base64;
        // });

        zip.generateAsync({ type: "blob" }).then(function(blob) {
          // 1) generate the zip file
          fileSaver(blob, "donatello-demo-pipeline.zip");
        });
      });
    });
  };
}
