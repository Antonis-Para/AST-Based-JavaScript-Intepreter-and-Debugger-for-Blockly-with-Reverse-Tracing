import {Blockly_gen, AST_dispatch} from './AST_Init.js';

/*----------------------------------------------*/
AST_dispatch.install("variables_set", function(block) {
    Blockly_gen.GetJsonText().add('"type": "assign_expr",\n');
	Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');

	var variable = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
	Blockly_gen.GetJsonText().add('"lval": "' + variable + '",\n');

	
	Blockly_gen.GetJsonText().add('"rval": ');
	var rvalue_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    if (Blockly_gen.createAllBlocks(rvalue_value) === null) { //no value to set it to -> default is 0
		Blockly_gen.GetJsonText().add('{\n');
		Blockly_gen.GetJsonText().add('"type": "number",\n');
		Blockly_gen.GetJsonText().add('"value": 0,\n');
		Blockly_gen.GetJsonText().add('"id": null\n');
		Blockly_gen.GetJsonText().add('}\n');        
    }
})

/*----------------------------------------------*/
AST_dispatch.install("variables_get", function(block) {
    Blockly_gen.GetJsonText().add('"type": "var",\n');
	Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');
	
    var lvalue = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).getAttribute('name');

    if (lvalue == "VAR") {
        let variable = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
        Blockly_gen.GetJsonText().add('"name": "' + variable + '"\n');
    } else {
        console.log("Error in makeVariableGet")
        exit();
    }
})

/*----------------------------------------------*/
AST_dispatch.install("math_change", function(block) {
    Blockly_gen.GetJsonText().add('"type": "var_change",\n');
	Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');
	
    var var_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
    Blockly_gen.GetJsonText().add('"var_name": "' + var_value + '",\n');


    Blockly_gen.GetJsonText().add('"value": \n');
    var change_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    Blockly_gen.createAllBlocks(change_value);
})