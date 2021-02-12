var Blockly_gen = require('./AST_Init.js')

/*----------------------------------------------*/
AST_dispatch["variables_set"] = function(block) {
    Blockly_gen.addToJSON('"type": "assign_expr",\n');

    var lvalue = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).getAttribute('name');
    var rvalue = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1).getAttribute('name');
    var rvalue_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);

    if (lvalue == "VAR") {
        variable = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
        Blockly_gen.addToJSON('"lval": "' + variable + '",\n');
    }

    if (rvalue == "VALUE") {
        Blockly_gen.addToJSON('"rval": ');
        Blockly_gen.createAllBlocks(rvalue_value)
    }
}

/*----------------------------------------------*/
AST_dispatch["variables_get"] = function(block) {
    Blockly_gen.addToJSON('"type": "var",\n');
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
    var var_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
    Blockly_gen.addToJSON('"var_name": "' + var_value + '",\n');


    Blockly_gen.addToJSON('"value": \n');
    var change_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    Blockly_gen.createAllBlocks(change_value);
}