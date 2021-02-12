var Blockly_gen = require('./AST_Init.js')

/*----------------------------------------------*/
AST_dispatch["variables_set"] = function(block) {
    Blockly_gen.addToJSON('"type": "assign_expr",\n');

    var lvalue = block.getElementsByTagName("field")[0].getAttribute('name');
    var rvalue = block.getElementsByTagName("value")[0].getAttribute('name');
    var rvalue_value = block.getElementsByTagName("value")[0];

    if (lvalue == "VAR") {
        variable = block.getElementsByTagName("field")[0].childNodes[0].nodeValue;
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
    var lvalue = block.getElementsByTagName("field")[0].getAttribute('name');

    if (lvalue == "VAR") {
        variable = block.getElementsByTagName("field")[0].childNodes[0].nodeValue;
        Blockly_gen.addToJSON('"name": "' + variable + '"\n');
    } else {
        console.log("Error in makeVariabelGet")
        exit();
    }
}

/*----------------------------------------------*/
AST_dispatch["math_change"] = function(block) {
    Blockly_gen.addToJSON('"type": "var_change",\n');
    var var_value = block.getElementsByTagName("field")[0].childNodes[0].nodeValue;
    Blockly_gen.addToJSON('"var_name": "' + var_value + '",\n');


    Blockly_gen.addToJSON('"value": \n');
    var change_value = block.getElementsByTagName("value")[0];
    Blockly_gen.createAllBlocks(change_value);
}