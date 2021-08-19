import {Blockly_gen, AST_dispatch} from './AST_Init.js';

AST_dispatch.install("controls_repeat_ext", function(block) {
    Blockly_gen.GetJsonText().add('"type": "repeat_stmt",\n');
	Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');
    
    var cond_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    Blockly_gen.GetJsonText().add('"cond": ');
    Blockly_gen.createAllBlocks(cond_value)
    Blockly_gen.GetJsonText().add(',\n');

    Blockly_gen.GetJsonText().add('"do": {\n');
		Blockly_gen.GetJsonText().add('"type": "stmts",\n');
		var do_statement = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "statement", 1);
		Blockly_gen.GetJsonText().add('"data": [\n');
		Blockly_gen.createAllBlocks(do_statement)
		Blockly_gen.GetJsonText().add(']\n');
    Blockly_gen.GetJsonText().add('}\n'); //do
})

/*----------------------------------------------------*/
AST_dispatch.install("controls_whileUntil", function(block) {
    var mode = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
    if (mode == 'WHILE')
        Blockly_gen.GetJsonText().add('"type": "while_stmt",\n');
    else if (mode == 'UNTIL')
        Blockly_gen.GetJsonText().add('"type": "untill_stmt",\n');
	Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');

    var times_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    Blockly_gen.GetJsonText().add('"cond": ');
    if (Blockly_gen.createAllBlocks(times_value) === null) { //no value provided -> default false
        Blockly_gen.GetJsonText().add('{\n');
        Blockly_gen.GetJsonText().add('"type": "bool_const",\n');
        Blockly_gen.GetJsonText().add('"value": false,\n');
		Blockly_gen.GetJsonText().add('"id": null\n');
        Blockly_gen.GetJsonText().add('}');
    }
    Blockly_gen.GetJsonText().add(',\n');

    Blockly_gen.GetJsonText().add('"do": {\n');
    Blockly_gen.GetJsonText().add('"type": "stmts",\n');
    var do_statement = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "statement", 1);

    Blockly_gen.GetJsonText().add('"data": [\n');
    Blockly_gen.createAllBlocks(do_statement)
    Blockly_gen.GetJsonText().add(']\n');
    Blockly_gen.GetJsonText().add('}\n'); //do
})

/*----------------------------------------------------*/
AST_dispatch.install("controls_for", function(block) {
    Blockly_gen.GetJsonText().add('"type": "for_stmt",\n');
	Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');
	
    var var_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue; //can not be empty
    Blockly_gen.GetJsonText().add('"var_name": "' + var_value + '",\n');

    var from_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1)
    Blockly_gen.GetJsonText().add('"from": ');
    Blockly_gen.createAllBlocks(from_value)
    Blockly_gen.GetJsonText().add(',\n');

    var to_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 2)
    Blockly_gen.GetJsonText().add('"to": ');
    Blockly_gen.createAllBlocks(to_value)
    Blockly_gen.GetJsonText().add(',\n');

    var by_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 3)
    Blockly_gen.GetJsonText().add('"by": ');
    Blockly_gen.createAllBlocks(by_value)
    Blockly_gen.GetJsonText().add(',\n');

    Blockly_gen.GetJsonText().add('"do": {\n');
		Blockly_gen.GetJsonText().add('"type": "stmts",\n');
		var do_statement = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "statement", 1);
		Blockly_gen.GetJsonText().add('"data": [\n');
			Blockly_gen.createAllBlocks(do_statement)
		Blockly_gen.GetJsonText().add(']\n');
    Blockly_gen.GetJsonText().add('}\n'); //do
})


/*----------------------------------------------------*/
AST_dispatch.install("controls_forEach", function(block) {
    Blockly_gen.GetJsonText().add('"type": "forEach_stmt",\n');
	Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');
	
    var var_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue; //can not be empty
    Blockly_gen.GetJsonText().add('"var_name": "' + var_value + '",\n');

    var in_list_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    Blockly_gen.GetJsonText().add('"in": ');
    if (Blockly_gen.createAllBlocks(in_list_value) === null) { //no list provided-> default empty list
        Blockly_gen.GetJsonText().add('{\n');
        Blockly_gen.GetJsonText().add('"type": "list_create",\n');
		Blockly_gen.GetJsonText().add('"id": null,\n');
        Blockly_gen.GetJsonText().add('"items": []\n');
        Blockly_gen.GetJsonText().add('}\n');
    }
    Blockly_gen.GetJsonText().add(",\n");

    Blockly_gen.GetJsonText().add('"do": {\n');
		Blockly_gen.GetJsonText().add('"type": "stmts",\n');
		var do_statement = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "statement", 1);
		Blockly_gen.GetJsonText().add('"data": [\n');
		Blockly_gen.createAllBlocks(do_statement)
		Blockly_gen.GetJsonText().add(']\n');
	Blockly_gen.GetJsonText().add('}\n'); //do
})

/*----------------------------------------------------*/
AST_dispatch.install("controls_flow_statements", function(block) {
    Blockly_gen.GetJsonText().add('"type": "keyword",\n');
    var key_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue; //can not be empty
    Blockly_gen.GetJsonText().add('"name": "' + key_value.toLowerCase() + '",\n');
	Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '"\n');
})