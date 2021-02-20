var Blockly_gen = require('./AST_Init.js')

/*----------------------------------------------*/
AST_dispatch["text_print"] = function(block) {
    Blockly_gen.addToJSON('"type": "func_call",\n');
    Blockly_gen.addToJSON('"name": "window.alert",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');

    var print_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);

    Blockly_gen.addToJSON('"arg": ');
    Blockly_gen.createAllBlocks(print_value);
}

/*----------------------------------------------*/
AST_dispatch["text"] = function(block) {
    Blockly_gen.addToJSON('"type": "text_const",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');

    if (Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes.length == 0) { //DO THIS FOR EVERY AST_dispatch[""] = function
        Blockly_gen.addToJSON('"value": ""\n');
    } else {
        var text = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
        Blockly_gen.addToJSON('"value": "' + text + '"\n');
    }
}

/*----------------------------------------------*/
AST_dispatch["text_join"] = function(block) {
    Blockly_gen.addToJSON('"type": "property_join",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');
    Blockly_gen.addToJSON('"items": [\n');


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
}

/*----------------------------------------------*/
AST_dispatch["text_append"] = function(block) {
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
}


/*----------------------------------------------*/
AST_dispatch["text_length"] = function(block) {
    Blockly_gen.addToJSON('"type": "property",\n');
    Blockly_gen.addToJSON('"name": ".length",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');
	
    Blockly_gen.addToJSON('"item": ');
    var len_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    Blockly_gen.createAllBlocks(len_value)
}

/*----------------------------------------------*/
AST_dispatch["text_isEmpty"] = function(block) {
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
}

/*----------------------------------------------*/
AST_dispatch["text_indexOf"] = function(block) {
    Blockly_gen.addToJSON('"type": "property",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');

    var property = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
    if (property == "LAST") {
        Blockly_gen.addToJSON('"name": ".lastIndexOf",\n');
    } else if (property == "FIRST") {
        Blockly_gen.addToJSON('"name": ".indexOf",\n');
    }

    var child_no = 1;
    var searchIn_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    Blockly_gen.addToJSON('"item": ');
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
    Blockly_gen.addToJSON('"arg": ');
    Blockly_gen.createAllBlocks(searchFor_value);
}

/*----------------------------------------------*/
AST_dispatch["text_charAt"] = function(block) {
    Blockly_gen.addToJSON('"type": "property_charAt",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');

    var where = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
    Blockly_gen.addToJSON('"where": "' + where.toLowerCase() + '",\n');

    var child_no = 1;
    Blockly_gen.addToJSON('"item": ');
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

    if (where == "RANDOM" || where == "FIRST" || where == "LAST") {
        return;
    }

    Blockly_gen.addToJSON(',\n');

    var at_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", child_no);
    if (at_value === null) {
        Blockly_gen.addToJSON('"at": {\n');
			Blockly_gen.addToJSON('"type": "number",\n');
			Blockly_gen.addToJSON('"value": 0,\n');
			Blockly_gen.addToJSON('"id": null\n');
        Blockly_gen.addToJSON('}\n');
    } else {
        Blockly_gen.addToJSON('"at": ');
        Blockly_gen.createAllBlocks(at_value);
    }
}


/*----------------------------------------------*/
AST_dispatch["text_getSubstring"] = function(block) {
    Blockly_gen.addToJSON('"type": "property_substr",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');

    var where1 = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
    Blockly_gen.addToJSON('"where1": "' + where1.toLowerCase() + '",\n');

    var where2 = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 2).childNodes[0].nodeValue;
    Blockly_gen.addToJSON('"where2": "' + where2.toLowerCase() + '",\n');

    var child_no = 1;
    Blockly_gen.addToJSON('"item": ');
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
        Blockly_gen.addToJSON('"pos1": \n');
        var pos1_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", child_no);
        if (pos1_value === null || pos1_value === undefined || pos1_value.getAttribute("name") != "AT1") { //no item to search for -> default is 0
            Blockly_gen.addToJSON('{\n');
            Blockly_gen.addToJSON('"type": "number",\n');
            Blockly_gen.addToJSON('"value": 0,\n');
			Blockly_gen.addToJSON('"id": null\n');
            Blockly_gen.addToJSON('}\n');
        } else {
            Blockly_gen.createAllBlocks(pos1_value);
            child_no++;
        }
    }

    if (where2 != "LAST") { //first doesnt require an argument (its the last)
        Blockly_gen.addToJSON(',\n');
        Blockly_gen.addToJSON('"pos2": \n');
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
}

/*----------------------------------------------*/
AST_dispatch["text_changeCase"] = function(block) {
    Blockly_gen.addToJSON('"type": "property_changeCase",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');

    var case_type = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
    Blockly_gen.addToJSON('"case": "' + case_type.toLowerCase() + '",\n');


    Blockly_gen.addToJSON('"item": ');
    var case_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    Blockly_gen.createAllBlocks(case_value);
}

/*----------------------------------------------*/
AST_dispatch["text_prompt_ext"] = function(block) {
    Blockly_gen.addToJSON('"type": "func_call",\n');
    Blockly_gen.addToJSON('"name": "window.prompt",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');

    Blockly_gen.addToJSON('"arg": ');
    var arg_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    Blockly_gen.createAllBlocks(arg_value);
}


/*----------------------------------------------*/
AST_dispatch["text_trim"] = function(block) {
    Blockly_gen.addToJSON('"type": "property_trim",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');
    var side = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
    Blockly_gen.addToJSON('"side": "' + side.toLowerCase() + '",\n');


    Blockly_gen.addToJSON('"item": ');
    var text_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    Blockly_gen.createAllBlocks(text_value);
}