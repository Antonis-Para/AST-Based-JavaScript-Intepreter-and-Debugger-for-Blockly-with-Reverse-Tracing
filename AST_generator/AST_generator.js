function Generator(xmlText) {
    /*
    global.Blockly = require('./blockly_uncompressed.js');
    require('./blocks_compressed.js');
    require('./javascript_compressed.js');
    require('./msg/messages.js');
    */
    var Blockly_gen = require('./AST_Init.js')
    require('./logic_generator.js');
    require('./loop_generator.js');
    require('./math_generator.js');
    require('./text_generator.js');
    require('./list_generator.js');
    require('./colour_generator.js');
    require('./variable_generator.js');
    require('./function_generator.js');


    //--------------------MAIN-----------------------//
	global.DOMParser = require('xmldom').DOMParser;
    parser = new DOMParser();
    var xmlDoc = parser.parseFromString(xmlText, "text/xml");

    Blockly_gen.addToJSON("{\n");
		Blockly_gen.addToJSON('"type": "stmts",\n');
		var elements = xmlDoc.childNodes[0];
		Blockly_gen.addToJSON('"data": [\n');
			Blockly_gen.createAllVariables(elements);
			Blockly_gen.createAllBlocks(elements);
		Blockly_gen.addToJSON(']\n');
    Blockly_gen.addToJSON('}\n');

    return Blockly_gen.getJSON();
    //-----------------------------------------------//
}

module.exports = { Generator }