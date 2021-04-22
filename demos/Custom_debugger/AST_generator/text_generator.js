import {Blockly_gen, AST_dispatch} from './AST_Init.js';

/*----------------------------------------------*/
AST_dispatch.install("text_print", function(block) {
    Blockly_gen.addToJSON('"type": "func_call",\n');
    Blockly_gen.addToJSON('"name": "window.alert",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');

    var print_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);

    Blockly_gen.addToJSON('"args": [\n');
    Blockly_gen.createAllBlocks(print_value);
    Blockly_gen.addToJSON(']\n');
})

/*----------------------------------------------*/
AST_dispatch.install("text", function(block) {
    Blockly_gen.addToJSON('"type": "text_const",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');

    if (Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes.length == 0) { //DO THIS FOR EVERY AST_dispatch[""] = function
        Blockly_gen.addToJSON('"value": ""\n');
    } else {
        var text = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
        Blockly_gen.addToJSON('"value": "' + text + '"\n');
    }
})

/*----------------------------------------------*/
AST_dispatch.install("text_join", function(block) {
    Blockly_gen.addToJSON('"type": "libfunc_call",\n');
    Blockly_gen.addToJSON('"name": "text_invoke",\n');
    Blockly_gen.addToJSON('"param": "textJoin",\n');
    Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');
    Blockly_gen.addToJSON('"args": [\n');


    var join_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    if (join_value === null) {
        Blockly_gen.addToJSON(']\n');
        return;
    }

    var occ = 1;
    while (join_value !== null) {
        Blockly_gen.createAllBlocks(join_value);
        join_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", ++occ);
        Blockly_gen.addToJSON(',\n');
    }
    Blockly_gen.JSONremoveChars(2) //remove the last ','
    Blockly_gen.addToJSON(']\n');
})

/*----------------------------------------------*/
AST_dispatch.install("text_append", function(block) {
    Blockly_gen.addToJSON('"type": "arithm_expr",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');
    Blockly_gen.addToJSON('"op": "PLUS_EQ",\n');


    Blockly_gen.addToJSON('"lval": {\n');
    Blockly_gen.addToJSON('"type": "var",\n');
    var lvalue = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).getAttribute('name');
    if (lvalue == "VAR") {
        if (Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes.length == 0) {
            Blockly_gen.addToJSON('"value": ""\n');
        } else {
            var variable = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
            Blockly_gen.addToJSON('"name": "' + variable + '"\n');
        }
    } else {
        console.log("Error in makeTextAppend")
        exit();
    }
    Blockly_gen.addToJSON('},\n');


    Blockly_gen.addToJSON('"rval": ');
    var rval_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1)
    Blockly_gen.createAllBlocks(rval_value);
})


/*----------------------------------------------*/
AST_dispatch.install("text_length", function(block) {
    Blockly_gen.addToJSON('"type": "property",\n');
    Blockly_gen.addToJSON('"name": ".length",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');
	
    Blockly_gen.addToJSON('"item": ');
    var len_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    Blockly_gen.createAllBlocks(len_value)
})

/*----------------------------------------------*/
AST_dispatch.install("text_isEmpty", function(block) {
    Blockly_gen.addToJSON('"type": "logic_expr",\n');
    Blockly_gen.addToJSON('"op": "EQ",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');

    Blockly_gen.addToJSON('"lval": ');
    var lval_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1)
    Blockly_gen.createAllBlocks(lval_value);
    Blockly_gen.addToJSON(',\n');

    Blockly_gen.addToJSON('"rval": {\n');
		Blockly_gen.addToJSON('"type": "text_const",\n');
		Blockly_gen.addToJSON('"id": null,\n');
		Blockly_gen.addToJSON('"value": ""\n');
    Blockly_gen.addToJSON('}\n');
})

/*----------------------------------------------*/
AST_dispatch.install("text_indexOf", function(block) {
    var property = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue.toLowerCase();

    Blockly_gen.addToJSON('"type": "libfunc_call",\n');
    Blockly_gen.addToJSON('"name": "text_invoke",\n');
    Blockly_gen.addToJSON('"param": "' + "index_" + property + '",\n');
    Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');

    Blockly_gen.addToJSON('"args": [\n');

    var child_no = 1;
    var searchIn_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    if (searchIn_value === null || searchIn_value === undefined || searchIn_value.getAttribute("name") != "VALUE") {
        Blockly_gen.addToJSON('{\n');
        Blockly_gen.addToJSON('"type": "text_const",\n');
		Blockly_gen.addToJSON('"id": null,\n');
        Blockly_gen.addToJSON('"value": ""\n');
        Blockly_gen.addToJSON('}\n');
    } else {
        Blockly_gen.createAllBlocks(searchIn_value)
        child_no++;
    }

    Blockly_gen.addToJSON(',\n');

    var searchFor_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", child_no)
    Blockly_gen.createAllBlocks(searchFor_value);
    Blockly_gen.addToJSON(']\n');
})

/*----------------------------------------------*/
AST_dispatch.install("text_charAt", function(block) {
    
    var where = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue.toLowerCase();
    Blockly_gen.addToJSON('"type": "libfunc_call",\n');
    Blockly_gen.addToJSON('"name": "text_invoke",\n');
    Blockly_gen.addToJSON('"param": "' + "getLetter_" + where + '",\n');
    Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');

    Blockly_gen.addToJSON('"args": [\n');

    var child_no = 1;
    var inttext_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    if (inttext_value === null || inttext_value === undefined || inttext_value.getAttribute("name") != "VALUE") {
        Blockly_gen.addToJSON('{\n');
        Blockly_gen.addToJSON('"type": "text_const",\n');
		Blockly_gen.addToJSON('"id": null,\n');
        Blockly_gen.addToJSON('"value": ""\n');
        Blockly_gen.addToJSON('}\n');
    } else {
        Blockly_gen.createAllBlocks(inttext_value);
        child_no++;
    }

    //place all arguments even though im not going to use them
    /*if (where == "first" || where == "last" || where == "random") {
        Blockly_gen.addToJSON(']\n');
        return;
    }*/

    Blockly_gen.addToJSON(',\n');

    var at_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", child_no);
    if (at_value === null) {
        Blockly_gen.addToJSON('{\n');
			Blockly_gen.addToJSON('"type": "number",\n');
			Blockly_gen.addToJSON('"value": 1,\n'); //1 in blockly, 0 in js
			Blockly_gen.addToJSON('"id": null\n');
        Blockly_gen.addToJSON('}\n');
    } else {
        Blockly_gen.createAllBlocks(at_value);
    }
    Blockly_gen.addToJSON(']\n');
})


/*----------------------------------------------*/
AST_dispatch.install("text_getSubstring", function(block) {
    var where1 = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue.toLowerCase();
    var where2 = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 2).childNodes[0].nodeValue.toLowerCase();

    Blockly_gen.addToJSON('"type": "libfunc_call",\n');
    Blockly_gen.addToJSON('"name": "text_invoke",\n');
    Blockly_gen.addToJSON('"param": "' + "substr_" + where1 + "_" + where2 + '",\n');
    Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');

    var child_no = 1;
    Blockly_gen.addToJSON('"args": [\n');
    var item_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    if (item_value === null || item_value === undefined || item_value.getAttribute("name") != "STRING") { //no string to search in provided -> default is empty string
        Blockly_gen.addToJSON('{\n');
        Blockly_gen.addToJSON('"type": "text_const",\n');
        Blockly_gen.addToJSON('"value": "",\n');
		Blockly_gen.addToJSON('"id": null\n');
        Blockly_gen.addToJSON('}\n');
    } else {
        Blockly_gen.createAllBlocks(item_value);
        child_no++;
    }

    if (where1 != "FIRST") { //first doesnt require an argument (its 0)
        Blockly_gen.addToJSON(',\n');
        var pos1_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", child_no);
        if (pos1_value === null || pos1_value === undefined || pos1_value.getAttribute("name") != "AT1") { //no item to search for -> default is 0 (1 for blockly)
            Blockly_gen.addToJSON('{\n');
            Blockly_gen.addToJSON('"type": "number",\n');
            Blockly_gen.addToJSON('"value": 1,\n');
			Blockly_gen.addToJSON('"id": null\n');
            Blockly_gen.addToJSON('}\n');
        } else {
            Blockly_gen.createAllBlocks(pos1_value);
            child_no++;
        }
    }

    if (where2 != "LAST") { //first doesnt require an argument (its the last)
        Blockly_gen.addToJSON(',\n');
        var pos2_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", child_no);
        if (pos2_value === null || pos2_value === undefined || pos2_value.getAttribute("name") != "AT2") { //no item to search for -> default is 0
            Blockly_gen.addToJSON('{\n');
            Blockly_gen.addToJSON('"type": "number",\n');
            Blockly_gen.addToJSON('"value": 1,\n');
			Blockly_gen.addToJSON('"id": null\n');
            Blockly_gen.addToJSON('}\n');
        } else {
            Blockly_gen.createAllBlocks(pos2_value);
            child_no++;
        }
    }
    Blockly_gen.addToJSON(']\n');
})

/*----------------------------------------------*/
AST_dispatch.install("text_changeCase", function(block) {
    

    var case_type = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue.toLowerCase();

    Blockly_gen.addToJSON('"type": "libfunc_call",\n');
    Blockly_gen.addToJSON('"name": "text_invoke",\n');
    Blockly_gen.addToJSON('"param": "' + case_type + '",\n');
    Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');
    Blockly_gen.addToJSON('"args": [\n');

    var case_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    Blockly_gen.createAllBlocks(case_value);

    Blockly_gen.addToJSON(']\n');
})

/*----------------------------------------------*/
AST_dispatch.install("text_prompt_ext", function(block) {
    Blockly_gen.addToJSON('"type": "func_call",\n');
    Blockly_gen.addToJSON('"name": "window.prompt",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');

    Blockly_gen.addToJSON('"args": [\n');
    var arg_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    Blockly_gen.createAllBlocks(arg_value);
    Blockly_gen.addToJSON(']\n');
})


/*----------------------------------------------*/
AST_dispatch.install("text_trim", function(block) {
    var side = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue.toLowerCase();

    Blockly_gen.addToJSON('"type": "libfunc_call",\n');
    Blockly_gen.addToJSON('"name": "text_invoke",\n');
    Blockly_gen.addToJSON('"param": "' + "trim_" + side + '",\n');
    Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');

    Blockly_gen.addToJSON('"args": [\n');

    var text_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    Blockly_gen.createAllBlocks(text_value);

    Blockly_gen.addToJSON(']\n');
})