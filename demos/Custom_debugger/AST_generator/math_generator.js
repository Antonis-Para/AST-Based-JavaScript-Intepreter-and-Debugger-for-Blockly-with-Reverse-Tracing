import {Blockly_gen, AST_dispatch} from './AST_Init.js';

/*----------------------------------------------*/
AST_dispatch.install("math_number", function(block) {
    var num_name = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).getAttribute('name');
    Blockly_gen.GetJsonText().add('"type": "number",\n');
	Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');

    if (num_name == "NUM") {
        var num = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
        Blockly_gen.GetJsonText().add('"value": ' + num + '\n');
    }
})

/*----------------------------------------------*/
AST_dispatch.install("math_arithmetic", function(block) {
    Blockly_gen.GetJsonText().add('"type": "arithm_expr",\n');
	Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');

    var operation = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
    Blockly_gen.GetJsonText().add('"op": "' + operation + '",\n');

    var lval_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1)
    Blockly_gen.GetJsonText().add('"lval": ');
    Blockly_gen.createAllBlocks(lval_value);
    Blockly_gen.GetJsonText().add(',\n');

    var rval_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 2)
    Blockly_gen.GetJsonText().add('"rval": ');
    Blockly_gen.createAllBlocks(rval_value);
})

/*----------------------------------------------*/
AST_dispatch.install("math_single", function(block) {
    var op = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue.toLowerCase();
    Blockly_gen.GetJsonText().add('"type": "libfunc_call",\n');
    Blockly_gen.GetJsonText().add('"name": "math_invoke",\n');
    Blockly_gen.GetJsonText().add('"param": "' + op + '",\n');
    Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');
    Blockly_gen.GetJsonText().add('"args": [\n');

    var value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    Blockly_gen.createAllBlocks(value);

    Blockly_gen.GetJsonText().add(']\n');
})

/*----------------------------------------------*/
AST_dispatch.install("math_trig", function(block) {
    Blockly_gen.GetJsonText().add('"type": "libfunc_call",\n');
    Blockly_gen.GetJsonText().add('"name": "math_invoke",\n');
	Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');

    var func = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue.toLowerCase();
    Blockly_gen.GetJsonText().add('"param": "' + func + '",\n');

    var trig_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);

    Blockly_gen.GetJsonText().add('"args": [\n');
    Blockly_gen.createAllBlocks(trig_value);
    Blockly_gen.GetJsonText().add(']\n');
})

/*----------------------------------------------*/
AST_dispatch.install("math_constant", function(block) {
    var constant = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
    Blockly_gen.GetJsonText().add('"type": "libfunc_call",\n');
    Blockly_gen.GetJsonText().add('"name": "math_invoke",\n');
    Blockly_gen.GetJsonText().add('"param": "' + constant.toLowerCase() + '",\n');
	Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '"\n');
})

/*----------------------------------------------*/
AST_dispatch.install("math_number_property", function(block) {
    var property = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue.toLowerCase();
    Blockly_gen.GetJsonText().add('"type": "libfunc_call",\n');
    Blockly_gen.GetJsonText().add('"name": "math_invoke",\n');
    Blockly_gen.GetJsonText().add('"param": "' + property + '",\n');
	Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');


    Blockly_gen.GetJsonText().add('"args": [\n');
        var num_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
        Blockly_gen.createAllBlocks(num_value)
    Blockly_gen.GetJsonText().add(']\n');
})

/*----------------------------------------------*/
AST_dispatch.install("math_round", function(block) {
    Blockly_gen.GetJsonText().add('"type": "func_call",\n');
	Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');

    var func = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
    if (func == "ROUNDUP") {
        Blockly_gen.GetJsonText().add('"name": "Math.ceil",\n');
    } else if (func == "ROUNDDOWN") {
        Blockly_gen.GetJsonText().add('"name": "Math.floor",\n');
    } else if (func == "ROUND") {
        Blockly_gen.GetJsonText().add('"name": "Math.round",\n');
    }

    var round_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);

    Blockly_gen.GetJsonText().add('"args": [\n');
    Blockly_gen.createAllBlocks(round_value)
    Blockly_gen.GetJsonText().add(']\n');
})

/*----------------------------------------------*/
AST_dispatch.install("math_on_list", function(block) {
    Blockly_gen.GetJsonText().add('"type": "libfunc_call",\n');
    Blockly_gen.GetJsonText().add('"name": "math_invoke",\n');
	Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');
	
    var op = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
    Blockly_gen.GetJsonText().add('"param": "' + op.toLowerCase() + '",\n');

    var list_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    Blockly_gen.GetJsonText().add('"args": [')
    if (Blockly_gen.createAllBlocks(list_value) === null) { //no list provided -> default is empty list
        Blockly_gen.GetJsonText().add('{\n');
        Blockly_gen.GetJsonText().add('"type": "list_create",\n');
		Blockly_gen.GetJsonText().add('"id": null,\n');
        Blockly_gen.GetJsonText().add('"items": []\n');
        Blockly_gen.GetJsonText().add('}\n');
    }
    Blockly_gen.GetJsonText().add(']\n')
})

/*----------------------------------------------*/
AST_dispatch.install("math_modulo", function(block) {
    Blockly_gen.GetJsonText().add('"type": "arithm_expr",\n');
    Blockly_gen.GetJsonText().add('"op": "MOD",\n');
	Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');

    Blockly_gen.GetJsonText().add('"lval": ');
    var lval_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1)
    Blockly_gen.createAllBlocks(lval_value);
    Blockly_gen.GetJsonText().add(',\n');

    Blockly_gen.GetJsonText().add('"rval": ');
    var rval_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 2)
    Blockly_gen.createAllBlocks(rval_value);
})

/*----------------------------------------------*/
AST_dispatch.install("math_constrain", function(block) {
    //will look like: Math.min(Math.max(num1, num2), num3)
    Blockly_gen.GetJsonText().add('"type": "libfunc_call",\n');
    Blockly_gen.GetJsonText().add('"name": "math_invoke",\n');
    Blockly_gen.GetJsonText().add('"param": "constraint",\n');
    Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');

    Blockly_gen.GetJsonText().add('"args": [\n');

    var constraint_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1)
    var low_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 2)
    var high_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 3)
    
    //value
    Blockly_gen.createAllBlocks(constraint_value)
    Blockly_gen.GetJsonText().add(',\n');

    //low
    Blockly_gen.createAllBlocks(low_value)
    Blockly_gen.GetJsonText().add(',\n');

    //high
    Blockly_gen.createAllBlocks(high_value)

    Blockly_gen.GetJsonText().add(']\n');
})

/*----------------------------------------------*/
AST_dispatch.install("math_random_int", function(block) {
    Blockly_gen.GetJsonText().add('"type": "libfunc_call",\n');
    Blockly_gen.GetJsonText().add('"name": "math_invoke",\n');
    Blockly_gen.GetJsonText().add('"param": "randomInt",\n');
    Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');

    Blockly_gen.GetJsonText().add('"args": [\n');

    var from_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1)
    var to_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 2)

    Blockly_gen.createAllBlocks(from_value)
    Blockly_gen.GetJsonText().add(',\n');    
    Blockly_gen.createAllBlocks(to_value)

    Blockly_gen.GetJsonText().add(']\n');
})

/*----------------------------------------------*/
AST_dispatch.install("math_random_float", function(block) {
    Blockly_gen.GetJsonText().add('"type": "func_call",\n');
    Blockly_gen.GetJsonText().add('"name": "Math.random",\n');
	Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '"\n');
    Blockly_gen.GetJsonText().add('"args": []\n');
})

/*----------------------------------------------*/
AST_dispatch.install("math_atan2", function(block) {
    Blockly_gen.GetJsonText().add('"type": "libfunc_call",\n');
    Blockly_gen.GetJsonText().add('"name": "math_invoke",\n');
    Blockly_gen.GetJsonText().add('"param": "atan2",\n');
    Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');
    Blockly_gen.GetJsonText().add('"args": [\n');

    var x_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    var y_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 2)
    
    Blockly_gen.createAllBlocks(x_value)
    Blockly_gen.GetJsonText().add(',\n');
    Blockly_gen.createAllBlocks(y_value)

    Blockly_gen.GetJsonText().add(']\n');
})