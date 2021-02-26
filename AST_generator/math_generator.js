var Blockly_gen = require('./AST_Init.js')

/*----------------------------------------------*/
AST_dispatch["math_number"] = function(block) {
    var num_name = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).getAttribute('name');
    Blockly_gen.addToJSON('"type": "number",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');

    if (num_name == "NUM") {
        var num = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
        Blockly_gen.addToJSON('"value": ' + num + '\n');
    }
}

/*----------------------------------------------*/
AST_dispatch["math_arithmetic"] = function(block) {
    Blockly_gen.addToJSON('"type": "arithm_expr",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');

    var operation = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
    Blockly_gen.addToJSON('"op": "' + operation + '",\n');

    var lval_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1)
    Blockly_gen.addToJSON('"lval": ');
    Blockly_gen.createAllBlocks(lval_value);
    Blockly_gen.addToJSON(',\n');

    var rval_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 2)
    Blockly_gen.addToJSON('"rval": ');
    Blockly_gen.createAllBlocks(rval_value);
}

/*----------------------------------------------*/
AST_dispatch["math_single"] = function(block) {
    Blockly_gen.addToJSON('"type": "func_call",\n');
    Blockly_gen.addToJSON('"name": "Math.sqrt",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');

    var root_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);

    Blockly_gen.addToJSON('"arg": ');
    Blockly_gen.createAllBlocks(root_value)
}

/*----------------------------------------------*/
AST_dispatch["math_trig"] = function(block) {
    Blockly_gen.addToJSON('"type": "func_call",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');

    var func = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
    Blockly_gen.addToJSON('"name": "Math.' + func.toLowerCase() + '",\n');

    var trig_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);

    Blockly_gen.addToJSON('"arg": ');
    Blockly_gen.createAllBlocks(trig_value)
}

/*----------------------------------------------*/
AST_dispatch["math_constant"] = function(block) {
    var constant = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
    Blockly_gen.addToJSON('"type": "math_const",\n');
    Blockly_gen.addToJSON('"value": "' + constant.toLowerCase() + '",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '"\n');
}

/*----------------------------------------------*/
AST_dispatch["math_number_property"] = function(block) {
    Blockly_gen.addToJSON('"type": "math_property",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');

    var property = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
    Blockly_gen.addToJSON('"property": "' + property + '",\n');

    var num_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    Blockly_gen.addToJSON('"value": ');
    Blockly_gen.createAllBlocks(num_value)
}

/*----------------------------------------------*/
AST_dispatch["math_round"] = function(block) {
    Blockly_gen.addToJSON('"type": "func_call",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');

    var func = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
    if (func == "ROUNDUP") {
        Blockly_gen.addToJSON('"name": "Math.ceil",\n');
    } else if (func == "ROUNDDOWN") {
        Blockly_gen.addToJSON('"name": "Math.floor",\n');
    } else if (func == "ROUND") {
        Blockly_gen.addToJSON('"name": "Math.round",\n');
    }

    var round_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);

    Blockly_gen.addToJSON('"arg": ');
    Blockly_gen.createAllBlocks(round_value)
}

/*----------------------------------------------*/
AST_dispatch["math_on_list"] = function(block) {
    Blockly_gen.addToJSON('"type": "list_math_expr",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');
	
    var op = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
    Blockly_gen.addToJSON('"op": "' + op.toLowerCase() + '",\n');

    var list_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    Blockly_gen.addToJSON('"list": ')
    if (Blockly_gen.createAllBlocks(list_value) === null) { //no list provided -> default is empty list
        Blockly_gen.addToJSON('{\n');
        Blockly_gen.addToJSON('"type": "list_create",\n');
		Blockly_gen.addToJSON('"id": null,\n');
        Blockly_gen.addToJSON('"items": []\n');
        Blockly_gen.addToJSON('}\n');
    }
}

/*----------------------------------------------*/
AST_dispatch["math_modulo"] = function(block) {
    Blockly_gen.addToJSON('"type": "arithm_expr",\n');
    Blockly_gen.addToJSON('"op": "MOD",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');

    Blockly_gen.addToJSON('"lval": ');
    var lval_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1)
    Blockly_gen.createAllBlocks(lval_value);
    Blockly_gen.addToJSON(',\n');

    Blockly_gen.addToJSON('"rval": ');
    var rval_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 2)
    Blockly_gen.createAllBlocks(rval_value);
}

/*----------------------------------------------*/
AST_dispatch["math_constrain"] = function(block) {
    //will look like: Math.min(Math.max(num1, num2), num3)
    Blockly_gen.addToJSON('"type": "math_constraint",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');

    Blockly_gen.addToJSON('"value": ');
    var constraint_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1)
    Blockly_gen.createAllBlocks(constraint_value)
    Blockly_gen.addToJSON(',\n');

    Blockly_gen.addToJSON('"low": ');
    var low_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 2)
    Blockly_gen.createAllBlocks(low_value)
    Blockly_gen.addToJSON(',\n');

    Blockly_gen.addToJSON('"high": ');
    var high_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 3)
    Blockly_gen.createAllBlocks(high_value)
}

/*----------------------------------------------*/
AST_dispatch["math_random_int"] = function(block) {
    Blockly_gen.addToJSON('"type": "math_rand_int",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');

    Blockly_gen.addToJSON('"from": ');
    var random_from_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1)
    Blockly_gen.createAllBlocks(random_from_value)
    Blockly_gen.addToJSON(',\n');

    Blockly_gen.addToJSON('"to": ');
    var random_to_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 2)
    Blockly_gen.createAllBlocks(random_to_value)
}

/*----------------------------------------------*/
AST_dispatch["math_random_float"] = function(block) {
    Blockly_gen.addToJSON('"type": "func_call",\n');
    Blockly_gen.addToJSON('"name": "Math.random",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '"\n');
}

/*----------------------------------------------*/
AST_dispatch["math_atan2"] = function(block) {
    Blockly_gen.addToJSON('"type": "func_atan2",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');

    var x_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    Blockly_gen.addToJSON('"x": ');
    Blockly_gen.createAllBlocks(x_value)
    Blockly_gen.addToJSON(',\n');

    var y_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 2);
    Blockly_gen.addToJSON('"y": ');
    Blockly_gen.createAllBlocks(y_value)
}