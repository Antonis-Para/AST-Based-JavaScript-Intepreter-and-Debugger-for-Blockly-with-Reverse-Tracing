import {Blockly_gen, AST_dispatch} from './AST_Init.js';

/*----------------------------------------------*/
AST_dispatch["variables_set"] = function(block) {
    Blockly_gen.addToJSON('"type": "assign_expr",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');

	var variable = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
	Blockly_gen.addToJSON('"lval": "' + variable + '",\n');

	
	Blockly_gen.addToJSON('"rval": ');
	var rvalue_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    if (Blockly_gen.createAllBlocks(rvalue_value) === null) { //no value to set it to -> default is 0
		Blockly_gen.addToJSON('{\n');
		Blockly_gen.addToJSON('"type": "number",\n');
		Blockly_gen.addToJSON('"value": 0,\n');
		Blockly_gen.addToJSON('"id": null\n');
		Blockly_gen.addToJSON('}\n');        
    }
}

/*----------------------------------------------*/
AST_dispatch["variables_get"] = function(block) {
    Blockly_gen.addToJSON('"type": "var",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');
	
    var lvalue = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).getAttribute('name');

    if (lvalue == "VAR") {
        variable = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
        Blockly_gen.addToJSON('"name": "' + variable + '"\n');
    } else {
        console.log("Error in makeVariabelGet")
        exit();
    }
}

/*----------------------------------------------*/
AST_dispatch["math_change"] = function(block) {
    Blockly_gen.addToJSON('"type": "var_change",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');
	
    var var_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
    Blockly_gen.addToJSON('"var_name": "' + var_value + '",\n');


    Blockly_gen.addToJSON('"value": \n');
    var change_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    Blockly_gen.createAllBlocks(change_value);
}