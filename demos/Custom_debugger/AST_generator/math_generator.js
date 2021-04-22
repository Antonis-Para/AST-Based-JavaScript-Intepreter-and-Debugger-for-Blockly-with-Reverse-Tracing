import {Blockly_gen, AST_dispatch} from './AST_Init.js';

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
    var op = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue.toLowerCase();
    Blockly_gen.addToJSON('"type": "libfunc_call",\n');
    Blockly_gen.addToJSON('"name": "math_invoke",\n');
    Blockly_gen.addToJSON('"param": "' + op + '",\n');
    Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');
    Blockly_gen.addToJSON('"args": [\n');

    var value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    Blockly_gen.createAllBlocks(value);

    Blockly_gen.addToJSON(']\n');
}

/*----------------------------------------------*/
AST_dispatch["math_trig"] = function(block) {
    Blockly_gen.addToJSON('"type": "libfunc_call",\n');
    Blockly_gen.addToJSON('"name": "math_invoke",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');

    var func = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue.toLowerCase();
    Blockly_gen.addToJSON('"param": "' + func + '",\n');

    var trig_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);

    Blockly_gen.addToJSON('"args": [\n');
    Blockly_gen.createAllBlocks(trig_value);
    Blockly_gen.addToJSON(']\n');
}

/*----------------------------------------------*/
AST_dispatch["math_constant"] = function(block) {
    var constant = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
    Blockly_gen.addToJSON('"type": "libfunc_call",\n');
    Blockly_gen.addToJSON('"name": "math_invoke",\n');
    Blockly_gen.addToJSON('"param": "' + constant.toLowerCase() + '",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '"\n');
}

/*----------------------------------------------*/
AST_dispatch["math_number_property"] = function(block) {
    var property = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue.toLowerCase();
    Blockly_gen.addToJSON('"type": "libfunc_call",\n');
    Blockly_gen.addToJSON('"name": "math_invoke",\n');
    Blockly_gen.addToJSON('"param": "' + property + '",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');


    Blockly_gen.addToJSON('"args": [\n');
        var num_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
        Blockly_gen.createAllBlocks(num_value)
    Blockly_gen.addToJSON(']\n');
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

    Blockly_gen.addToJSON('"args": [\n');
    Blockly_gen.createAllBlocks(round_value)
    Blockly_gen.addToJSON(']\n');
}

/*----------------------------------------------*/
AST_dispatch["math_on_list"] = function(block) {
    Blockly_gen.addToJSON('"type": "libfunc_call",\n');
    Blockly_gen.addToJSON('"name": "math_invoke",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');
	
    var op = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
    Blockly_gen.addToJSON('"param": "' + op.toLowerCase() + '",\n');

    var list_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    Blockly_gen.addToJSON('"args": [')
    if (Blockly_gen.createAllBlocks(list_value) === null) { //no list provided -> default is empty list
        Blockly_gen.addToJSON('{\n');
        Blockly_gen.addToJSON('"type": "list_create",\n');
		Blockly_gen.addToJSON('"id": null,\n');
        Blockly_gen.addToJSON('"items": []\n');
        Blockly_gen.addToJSON('}\n');
    }
    Blockly_gen.addToJSON(']\n')
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
    Blockly_gen.addToJSON('"type": "libfunc_call",\n');
    Blockly_gen.addToJSON('"name": "math_invoke",\n');
    Blockly_gen.addToJSON('"param": "constraint",\n');
    Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');

    Blockly_gen.addToJSON('"args": [\n');

    var constraint_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1)
    var low_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 2)
    var high_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 3)
    
    //value
    Blockly_gen.createAllBlocks(constraint_value)
    Blockly_gen.addToJSON(',\n');

    //low
    Blockly_gen.createAllBlocks(low_value)
    Blockly_gen.addToJSON(',\n');

    //high
    Blockly_gen.createAllBlocks(high_value)

    Blockly_gen.addToJSON(']\n');
}

/*----------------------------------------------*/
AST_dispatch["math_random_int"] = function(block) {
    Blockly_gen.addToJSON('"type": "libfunc_call",\n');
    Blockly_gen.addToJSON('"name": "math_invoke",\n');
    Blockly_gen.addToJSON('"param": "randomInt",\n');
    Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');

    Blockly_gen.addToJSON('"args": [\n');

    var from_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1)
    var to_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 2)

    Blockly_gen.createAllBlocks(from_value)
    Blockly_gen.addToJSON(',\n');    
    Blockly_gen.createAllBlocks(to_value)

    Blockly_gen.addToJSON(']\n');
}

/*----------------------------------------------*/
AST_dispatch["math_random_float"] = function(block) {
    Blockly_gen.addToJSON('"type": "func_call",\n');
    Blockly_gen.addToJSON('"name": "Math.random",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '"\n');
    Blockly_gen.addToJSON('"args": []\n');
}

/*----------------------------------------------*/
AST_dispatch["math_atan2"] = function(block) {
    Blockly_gen.addToJSON('"type": "libfunc_call",\n');
    Blockly_gen.addToJSON('"name": "math_invoke",\n');
    Blockly_gen.addToJSON('"param": "atan2",\n');
    Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');
    Blockly_gen.addToJSON('"args": [\n');

    var x_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    var y_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 2)
    
    Blockly_gen.createAllBlocks(x_value)
    Blockly_gen.addToJSON(',\n');
    Blockly_gen.createAllBlocks(y_value)

    Blockly_gen.addToJSON(']\n');
}