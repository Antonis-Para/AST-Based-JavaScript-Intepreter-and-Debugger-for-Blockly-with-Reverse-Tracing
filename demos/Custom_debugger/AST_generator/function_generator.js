import {Blockly_gen, AST_dispatch} from './AST_Init.js';

/*----------------------------------------------*/
AST_dispatch.install("procedures_defnoreturn", function(block) {
    Blockly_gen.GetJsonText().add('"type": "userfunc_decl",\n');
	Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');

    Blockly_gen.GetJsonText().add('"args": [\n');
    var mutation = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "mutation", 1)
    if (mutation !== null) {
        var occ = 1;
        var arg = Blockly_gen.getElement(mutation, Blockly_gen.ELEMENT_NODE, "arg", occ++);
        while (arg !== null) {
            Blockly_gen.GetJsonText().add('"' + arg.getAttribute("name") + '",');
            arg = Blockly_gen.getElement(mutation, Blockly_gen.ELEMENT_NODE, "arg", occ++);
        }
    } else {
        Blockly_gen.GetJsonText().add(','); //for consistency. will delete later
    }
    Blockly_gen.GetJsonText().remove_chars(1);
    Blockly_gen.GetJsonText().add('],\n');

    var name = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
    Blockly_gen.GetJsonText().add('"name": "' + name + '",\n');

    var statements = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "statement", 1);

    Blockly_gen.GetJsonText().add('"do": {\n');
		Blockly_gen.GetJsonText().add('"type": "stmts",\n');
		Blockly_gen.GetJsonText().add('"data": [\n');
			Blockly_gen.createAllBlocks(statements)
		Blockly_gen.GetJsonText().add(']\n');
    Blockly_gen.GetJsonText().add('}\n'); //do
})

/*----------------------------------------------*/
AST_dispatch.install("procedures_ifreturn", function(block) { 
    Blockly_gen.GetJsonText().add('"type": "if_stmt",\n');
	Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');

    var child_no = 1;
    var if_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1)
    Blockly_gen.GetJsonText().add('"cond": [');
    if (if_value === null || if_value === undefined || if_value.getAttribute("name") != "CONDITION") { //no condition in the if statement. Default is false
        Blockly_gen.GetJsonText().add('{\n');
        Blockly_gen.GetJsonText().add('"type": "bool_const",\n');
        Blockly_gen.GetJsonText().add('"value": false,\n');
		Blockly_gen.GetJsonText().add('"id": null\n');
        Blockly_gen.GetJsonText().add('}');
    } else {
        Blockly_gen.createAllBlocks(if_value);
        child_no++;
    }
    Blockly_gen.GetJsonText().add('],\n');

    var ret_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", child_no);
    Blockly_gen.GetJsonText().add('"do": [{\n');
		Blockly_gen.GetJsonText().add('"type": "stmts",\n');
		Blockly_gen.GetJsonText().add('"data": [\n');
			Blockly_gen.GetJsonText().add('{\n');
			Blockly_gen.GetJsonText().add('"type": "keyword",\n');
			Blockly_gen.GetJsonText().add('"name": "return",\n');
			Blockly_gen.GetJsonText().add('"value": ');
			if (Blockly_gen.createAllBlocks(ret_value) === null) {
				Blockly_gen.GetJsonText().add('{\n');
					Blockly_gen.GetJsonText().add('"type": "null_const",\n');
					Blockly_gen.GetJsonText().add('"value": null,\n');
					Blockly_gen.GetJsonText().add('"id": null\n');
				Blockly_gen.GetJsonText().add('}\n');
			}
			Blockly_gen.GetJsonText().add('}\n');
		Blockly_gen.GetJsonText().add(']\n');
    Blockly_gen.GetJsonText().add('}],\n'); //do

    //default (always empty, used for consistency)
    Blockly_gen.GetJsonText().add('"default":{\n');
    Blockly_gen.GetJsonText().add('"type": "stmts",\n');
    Blockly_gen.GetJsonText().add('"data": []\n');
    Blockly_gen.GetJsonText().add('}\n');
})


/*----------------------------------------------*/
AST_dispatch.install("procedures_defreturn", function(block) {
    Blockly_gen.GetJsonText().add('"type": "userfunc_decl",\n');
	Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');

    Blockly_gen.GetJsonText().add('"args": [\n');
    var mutation = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "mutation", 1)
    if (mutation !== null) {
        var occ = 1;
        var arg = Blockly_gen.getElement(mutation, Blockly_gen.ELEMENT_NODE, "arg", occ++);
        while (arg !== null) {
            Blockly_gen.GetJsonText().add('"' + arg.getAttribute("name") + '",');
            arg = Blockly_gen.getElement(mutation, Blockly_gen.ELEMENT_NODE, "arg", occ++);
        }
    } else {
        Blockly_gen.GetJsonText().add(','); //for consistency. will delete later
    }
    Blockly_gen.GetJsonText().remove_chars(1);
    Blockly_gen.GetJsonText().add('],\n');

    var name = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
    Blockly_gen.GetJsonText().add('"name": "' + name + '",\n');

    var statements = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "statement", 1);

    Blockly_gen.GetJsonText().add('"do": {\n');
		Blockly_gen.GetJsonText().add('"type": "stmts",\n');
		Blockly_gen.GetJsonText().add('"data": [\n');
			var return_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
			if (Blockly_gen.createAllBlocks(statements) !== null && return_value !== null) {
				Blockly_gen.GetJsonText().add(',\n')
			}
			if (return_value !== null) {
				Blockly_gen.GetJsonText().add('{\n');
					Blockly_gen.GetJsonText().add('"type": "keyword",\n');
					Blockly_gen.GetJsonText().add('"name": "return",\n');
					Blockly_gen.GetJsonText().add('"value": ');
					Blockly_gen.createAllBlocks(return_value);
				Blockly_gen.GetJsonText().add('}\n');
			}
		Blockly_gen.GetJsonText().add(']\n');
    Blockly_gen.GetJsonText().add('}\n'); //do		
})

/*----------------------------------------------*/
AST_dispatch.install("procedures_callnoreturn", function(block) {
    Blockly_gen.GetJsonText().add('"type": "userfunc_call",\n');
	Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');

    var funcname = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "mutation", 1).getAttribute("name");
    Blockly_gen.GetJsonText().add('"name": "' + funcname + '",\n');


    var mutation = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "mutation", 1);
    var arg_len = 1;
    var tmp, arg_names =[];
    if (mutation !== null) {
        while ((tmp=Blockly_gen.getElement(mutation, Blockly_gen.ELEMENT_NODE, "arg", arg_len++)) !== null){ //find amount of args
            arg_names.push(tmp.getAttribute("name"))
        }
        arg_len += -2; //start counting from 0 (-1) and remove the extra ++ in the last iteration (-1) == -2
    }
    Blockly_gen.GetJsonText().add('"arg_names": [');
    for(arg in arg_names){
        Blockly_gen.GetJsonText().add('"' + arg_names[arg] + '",');
    }
    if (arg_names.length != 0)
        Blockly_gen.GetJsonText().remove_chars(1);
    Blockly_gen.GetJsonText().add('],\n');

    Blockly_gen.GetJsonText().add('"args": [\n');
    var occ = 0,
    i = 0;
    var arg = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", ++occ);
    while (i < arg_len) {
        if (arg !== null && arg.getAttribute("name") == ("ARG" + i.toString())) { //first arg should be ARG0. If we skip an arg make it null
            Blockly_gen.createAllBlocks(arg);
        } else {
            Blockly_gen.GetJsonText().add('{\n');
            Blockly_gen.GetJsonText().add('"type": "null_const",\n');
            Blockly_gen.GetJsonText().add('"value": null,\n');
			Blockly_gen.GetJsonText().add('"id": null\n');
            Blockly_gen.GetJsonText().add('}\n');
            occ--;
        }
        arg = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", ++occ);
        i++
        if (i != arg_len)
            Blockly_gen.GetJsonText().add(',\n');
        else
            Blockly_gen.GetJsonText().add('\n');
    }

    Blockly_gen.GetJsonText().add(']\n');
})

/*----------------------------------------------*/
AST_dispatch.install("procedures_callreturn", function(block) {
    Blockly_gen.GetJsonText().add('"type": "userfunc_call",\n');
	Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');

    var funcname = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "mutation", 1).getAttribute("name");
    Blockly_gen.GetJsonText().add('"name": "' + funcname + '",\n');


    var mutation = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "mutation", 1);
    var arg_len = 1;
    var tmp, arg_names =[];
    if (mutation !== null) {
        while ((tmp=Blockly_gen.getElement(mutation, Blockly_gen.ELEMENT_NODE, "arg", arg_len++)) !== null){ //find amount of args
            arg_names.push(tmp.getAttribute("name"))
        }
        arg_len += -2; //start counting from 0 (-1) and remove the extra ++ in the last iteration (-1) == -2
    }
    Blockly_gen.GetJsonText().add('"arg_names": [');
    for(arg in arg_names){
        Blockly_gen.GetJsonText().add('"' + arg_names[arg] + '",');
    }
    if (arg_names.length != 0)
        Blockly_gen.GetJsonText().remove_chars(1);
    Blockly_gen.GetJsonText().add('],\n');

    Blockly_gen.GetJsonText().add('"args": [\n');
    var occ = 0,
    i = 0;
    var arg = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", ++occ);
    while (i < arg_len) {
        if (arg !== null && arg.getAttribute("name") == ("ARG" + i.toString())) { //first arg should be ARG0. If we skip an arg make it null
            Blockly_gen.createAllBlocks(arg);
        } else {
            Blockly_gen.GetJsonText().add('{\n');
            Blockly_gen.GetJsonText().add('"type": "null_const",\n');
            Blockly_gen.GetJsonText().add('"value": null,\n');
			Blockly_gen.GetJsonText().add('"id": null\n');
            Blockly_gen.GetJsonText().add('}\n');
            occ--;
        }
        arg = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", ++occ);
        i++
        if (i != arg_len)
            Blockly_gen.GetJsonText().add(',\n');
        else
            Blockly_gen.GetJsonText().add('\n');
    }

    Blockly_gen.GetJsonText().add(']\n');
})