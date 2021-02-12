var Blockly_gen = require('./AST_Init.js')

/*----------------------------------------------*/
AST_dispatch["math_number"] = function(block) {
    var num_name = block.getElementsByTagName("field")[0].getAttribute('name');
    Blockly_gen.addToJSON('"type": "number",\n');

    if (num_name == "NUM") {
        var num = block.getElementsByTagName("field")[0].childNodes[0].nodeValue;
        Blockly_gen.addToJSON('"value": ' + num + '\n');
    }
}

/*----------------------------------------------*/
AST_dispatch["math_arithmetic"] = function(block) {
    Blockly_gen.addToJSON('"type": "arithm_expr",\n');

    var operation = block.getElementsByTagName("field")[0].childNodes[0].nodeValue;
    Blockly_gen.addToJSON('"op": "' + operation + '",\n');

    var lval_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1)
    Blockly_gen.addToJSON('"lval": ');
    createAllBlocks(lval_value);
    Blockly_gen.addToJSON(',\n');

    var rval_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 2)
    Blockly_gen.addToJSON('"rval": ');
    createAllBlocks(rval_value);
}

/*----------------------------------------------*/
AST_dispatch["math_single"] = function(block) {
    Blockly_gen.addToJSON('"type": "func_call",\n');
    Blockly_gen.addToJSON('"name": "Math.sqrt",\n');

    var root_value = block.getElementsByTagName("value")[0];

    Blockly_gen.addToJSON('"arg": ');
    createAllBlocks(root_value)
}

/*----------------------------------------------*/
AST_dispatch["math_trig"] = function(block) {
    Blockly_gen.addToJSON('"type": "func_call",\n');

    var func = block.getElementsByTagName("field")[0].childNodes[0].nodeValue;
    Blockly_gen.addToJSON('"name": "Math.' + func.toLowerCase() + '",\n');

    var trig_value = block.getElementsByTagName("value")[0];

    Blockly_gen.addToJSON('"arg": ');
    createAllBlocks(trig_value)
}

/*----------------------------------------------*/
AST_dispatch["math_constant"] = function(block) {
    var constant = block.getElementsByTagName("field")[0].childNodes[0].nodeValue;
    Blockly_gen.addToJSON('"type": "math_const",\n');
    Blockly_gen.addToJSON('"value": "' + constant + '"\n');
}

/*----------------------------------------------*/
AST_dispatch["math_number_property"] = function(block) {
    Blockly_gen.addToJSON('"type": "math_property",\n');

    var property = block.getElementsByTagName("field")[0].childNodes[0].nodeValue;
    Blockly_gen.addToJSON('"property": "' + property + '",\n');

    var num_value = block.getElementsByTagName("value")[0];
    Blockly_gen.addToJSON('"value": ');
    createAllBlocks(num_value)
}

/*----------------------------------------------*/
AST_dispatch["math_round"] = function(block) {
    Blockly_gen.addToJSON('"type": "func_call",\n');

    var func = block.getElementsByTagName("field")[0].childNodes[0].nodeValue;
    if (func == "ROUNDUP") {
        Blockly_gen.addToJSON('"name": "Math.ceil",\n');
    } else if (func == "ROUNDDOWN") {
        Blockly_gen.addToJSON('"name": "Math.floor",\n');
    } else if (func == "ROUND") {
        Blockly_gen.addToJSON('"name": "Math.round",\n');
    }

    var round_value = block.getElementsByTagName("value")[0];

    Blockly_gen.addToJSON('"arg": ');
    createAllBlocks(round_value)
}

/*----------------------------------------------*/
AST_dispatch["math_on_list"] = function(block) {
    Blockly_gen.addToJSON('"type": "list_math_expr",\n');
    var op = block.getElementsByTagName("field")[0].childNodes[0].nodeValue;
    Blockly_gen.addToJSON('"op": "' + op.toLowerCase() + '",\n');

    var list_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    Blockly_gen.addToJSON('"list": ')
    if (createAllBlocks(list_value) === null) { //no list provided -> default is empty list
        Blockly_gen.addToJSON('{\n');
        Blockly_gen.addToJSON('"type": "list_create",\n');
        Blockly_gen.addToJSON('"items": []\n');
        Blockly_gen.addToJSON('}\n');
    }
}

/*----------------------------------------------*/
AST_dispatch["math_modulo"] = function(block) {
    Blockly_gen.addToJSON('"type": "arithm_expr",\n');

    Blockly_gen.addToJSON('"op": "MOD",\n');

    Blockly_gen.addToJSON('"lval": ');
    var lval_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1)
    createAllBlocks(lval_value);
    Blockly_gen.addToJSON(',\n');

    Blockly_gen.addToJSON('"rval": ');
    var rval_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 2)
    createAllBlocks(rval_value);
}

/*----------------------------------------------*/
AST_dispatch["math_constrain"] = function(block) {
    //will look like: Math.min(Math.max(num1, num2), num3)
    Blockly_gen.addToJSON('"type": "math_constraint",\n');

    Blockly_gen.addToJSON('"value": ');
    var constraint_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1)
    createAllBlocks(constraint_value)
    Blockly_gen.addToJSON(',\n');

    Blockly_gen.addToJSON('"low": ');
    var low_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 2)
    createAllBlocks(low_value)
    Blockly_gen.addToJSON(',\n');

    Blockly_gen.addToJSON('"high": ');
    var high_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 3)
    createAllBlocks(high_value)
}

/*----------------------------------------------*/
AST_dispatch["math_random_int"] = function(block) {
    Blockly_gen.addToJSON('"type": "math_rand_int",\n');

    Blockly_gen.addToJSON('"from": ');
    var random_from_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1)
    createAllBlocks(random_from_value)
    Blockly_gen.addToJSON(',\n');

    Blockly_gen.addToJSON('"to": ');
    var random_to_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 2)
    createAllBlocks(random_to_value)
}

/*----------------------------------------------*/
AST_dispatch["math_random_float"] = function(block) {
    Blockly_gen.addToJSON('"type": "func_call",\n');
    Blockly_gen.addToJSON('"name": "Math.random"\n');
}

/*----------------------------------------------*/
AST_dispatch["math_atan2"] = function(block) {
    Blockly_gen.addToJSON('"type": "func_atan2",\n');

    var x_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    Blockly_gen.addToJSON('"x": ');
    createAllBlocks(x_value)
    Blockly_gen.addToJSON(',\n');

    var y_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 2);
    Blockly_gen.addToJSON('"y": ');
    createAllBlocks(y_value)
}