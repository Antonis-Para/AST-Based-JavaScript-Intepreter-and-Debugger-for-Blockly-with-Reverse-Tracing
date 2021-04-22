import {Blockly_gen} from './AST_Init.js';
//import {DOMParser as DOM_Parser} from 'xmldom';
import './logic_generator.js';
import './loop_generator.js';
import './math_generator.js';
import './text_generator.js';
import './list_generator.js';
import './colour_generator.js';
import './variable_generator.js';
import './function_generator.js';
function Generator(xmlText) {


    //--------------------MAIN-----------------------//
    var xmlDoc = jQuery.parseXML(xmlText)

    Blockly_gen.addToJSON("{\n");
		Blockly_gen.addToJSON('"type": "stmts",\n');
		var elements = xmlDoc.childNodes[0];
		Blockly_gen.addToJSON('"data": [\n');
		Blockly_gen.createAllVariables(elements);
		Blockly_gen.createAllBlocks(elements);
		Blockly_gen.addToJSON(']\n');
    Blockly_gen.addToJSON('}\n');


    //return Blockly_gen.getJSON();
    return JSON.parse(Blockly_gen.getJSON());
    //-----------------------------------------------//
}

//module.exports = { Generator }
export default Generator