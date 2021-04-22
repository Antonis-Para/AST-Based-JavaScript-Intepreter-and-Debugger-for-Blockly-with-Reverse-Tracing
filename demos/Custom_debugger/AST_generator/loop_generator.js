import {Blockly_gen, AST_dispatch} from './AST_Init.js';

AST_dispatch.install("controls_repeat_ext", function(block) {
    Blockly_gen.addToJSON('"type": "repeat_stmt",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');
    
    var cond_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    Blockly_gen.addToJSON('"cond": ');
    Blockly_gen.createAllBlocks(cond_value)
    Blockly_gen.addToJSON(',\n');

    Blockly_gen.addToJSON('"do": {\n');
		Blockly_gen.addToJSON('"type": "stmts",\n');
		var do_statement = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "statement", 1);
		Blockly_gen.addToJSON('"data": [\n');
		Blockly_gen.createAllBlocks(do_statement)
		Blockly_gen.addToJSON(']\n');
    Blockly_gen.addToJSON('}\n'); //do
})

/*----------------------------------------------------*/
AST_dispatch.install("controls_whileUntil", function(block) {
    var mode = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
    if (mode == 'WHILE')
        Blockly_gen.addToJSON('"type": "while_stmt",\n');
    else if (mode == 'UNTIL')
        Blockly_gen.addToJSON('"type": "untill_stmt",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');

    var times_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    Blockly_gen.addToJSON('"cond": ');
    if (Blockly_gen.createAllBlocks(times_value) === null) { //no value provided -> default false
        Blockly_gen.addToJSON('{\n');
        Blockly_gen.addToJSON('"type": "bool_const",\n');
        Blockly_gen.addToJSON('"value": false,\n');
		Blockly_gen.addToJSON('"id": null\n');
        Blockly_gen.addToJSON('}');
    }
    Blockly_gen.addToJSON(',\n');

    Blockly_gen.addToJSON('"do": {\n');
    Blockly_gen.addToJSON('"type": "stmts",\n');
    var do_statement = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "statement", 1);

    Blockly_gen.addToJSON('"data": [\n');
    Blockly_gen.createAllBlocks(do_statement)
    Blockly_gen.addToJSON(']\n');
    Blockly_gen.addToJSON('}\n'); //do
})

/*----------------------------------------------------*/
AST_dispatch.install("controls_for", function(block) {
    Blockly_gen.addToJSON('"type": "for_stmt",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');
	
    var var_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue; //can not be empty
    Blockly_gen.addToJSON('"var_name": "' + var_value + '",\n');

    var from_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1)
    Blockly_gen.addToJSON('"from": ');
    Blockly_gen.createAllBlocks(from_value)
    Blockly_gen.addToJSON(',\n');

    var to_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 2)
    Blockly_gen.addToJSON('"to": ');
    Blockly_gen.createAllBlocks(to_value)
    Blockly_gen.addToJSON(',\n');

    var by_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 3)
    Blockly_gen.addToJSON('"by": ');
    Blockly_gen.createAllBlocks(by_value)
    Blockly_gen.addToJSON(',\n');

    Blockly_gen.addToJSON('"do": {\n');
		Blockly_gen.addToJSON('"type": "stmts",\n');
		var do_statement = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "statement", 1);
		Blockly_gen.addToJSON('"data": [\n');
			Blockly_gen.createAllBlocks(do_statement)
		Blockly_gen.addToJSON(']\n');
    Blockly_gen.addToJSON('}\n'); //do
})


/*----------------------------------------------------*/
AST_dispatch.install("controls_forEach", function(block) {
    Blockly_gen.addToJSON('"type": "forEach_stmt",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');
	
    var var_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue; //can not be empty
    Blockly_gen.addToJSON('"var_name": "' + var_value + '",\n');

    var in_list_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    Blockly_gen.addToJSON('"in": ');
    if (Blockly_gen.createAllBlocks(in_list_value) === null) { //no list provided-> default empty list
        Blockly_gen.addToJSON('{\n');
        Blockly_gen.addToJSON('"type": "list_create",\n');
		Blockly_gen.addToJSON('"id": null,\n');
        Blockly_gen.addToJSON('"items": []\n');
        Blockly_gen.addToJSON('}\n');
    }
    Blockly_gen.addToJSON(",\n");

    Blockly_gen.addToJSON('"do": {\n');
		Blockly_gen.addToJSON('"type": "stmts",\n');
		var do_statement = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "statement", 1);
		Blockly_gen.addToJSON('"data": [\n');
		Blockly_gen.createAllBlocks(do_statement)
		Blockly_gen.addToJSON(']\n');
	Blockly_gen.addToJSON('}\n'); //do
})

/*----------------------------------------------------*/
AST_dispatch.install("controls_flow_statements", function(block) {
    Blockly_gen.addToJSON('"type": "keyword",\n');
    var key_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue; //can not be empty
    Blockly_gen.addToJSON('"name": "' + key_value.toLowerCase() + '",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '"\n');
})