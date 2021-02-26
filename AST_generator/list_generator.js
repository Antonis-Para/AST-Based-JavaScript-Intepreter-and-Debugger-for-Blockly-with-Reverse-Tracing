var Blockly_gen = require('./AST_Init.js')

/*----------------------------------------------*/
AST_dispatch["lists_create_with"] = function(block) {
    Blockly_gen.addToJSON('"type": "list_create",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');
    Blockly_gen.addToJSON('"items": [\n');

    var list_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    if (list_value === null) {
        Blockly_gen.addToJSON(']\n');
        return;
    }

    var occ = 1;
    while (list_value !== null) {
        Blockly_gen.createAllBlocks(list_value);
        list_value = getElement(block, Blockly_gen.ELEMENT_NODE, "value", ++occ);
        Blockly_gen.addToJSON(',\n');
    }
    Blockly_gen.JSONremoveChars(2); //remove the last ','
    Blockly_gen.addToJSON(']\n');
}

/*----------------------------------------------*/
AST_dispatch["lists_repeat"] = function(block) {
    Blockly_gen.addToJSON('"type": "list_create_repeat",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');

    Blockly_gen.addToJSON('"item": ');
    var item_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    if (item_value.getAttribute("name") == "NUM") { //no item provided as first value-> default is null
        Blockly_gen.addToJSON('{\n')
        Blockly_gen.addToJSON('"type": "null_const",\n');
        Blockly_gen.addToJSON('"value": null,\n');
		Blockly_gen.addToJSON('"id": null\n');
        Blockly_gen.addToJSON('}')
    } else {
        Blockly_gen.createAllBlocks(item_value);
    }
    Blockly_gen.addToJSON(',\n')

    Blockly_gen.addToJSON('"repeat": ');
    var repeat_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 2);
    if (repeat_value === null) { //no first value provided -> second value gets shifted to first
        repeat_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    }
    Blockly_gen.createAllBlocks(repeat_value);
}

/*----------------------------------------------*/
AST_dispatch["lists_length"] = function(block) {
    Blockly_gen.addToJSON('"type": "property",\n');
    Blockly_gen.addToJSON('"name": ".length",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');

    Blockly_gen.addToJSON('"item": ');
    var item_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    if (Blockly_gen.createAllBlocks(item_value) === null) { //no list provided-> default empty list
        Blockly_gen.addToJSON('{\n');
        Blockly_gen.addToJSON('"type": "list_create",\n');
		Blockly_gen.addToJSON('"id": null,\n');
        Blockly_gen.addToJSON('"items": []\n');
        Blockly_gen.addToJSON('}\n');
    }
}

/*----------------------------------------------*/
AST_dispatch["lists_isEmpty"] = function(block) { //list.length == 0
    Blockly_gen.addToJSON('"type": "logic_expr",\n');
    Blockly_gen.addToJSON('"op": "EQ",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');

    Blockly_gen.addToJSON('"lval": {\n');
    Blockly_gen.addToJSON('"type": "property",\n');
    Blockly_gen.addToJSON('"name": ".length",\n');
    Blockly_gen.addToJSON('"item": ');
    var item_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    if (Blockly_gen.createAllBlocks(item_value) === null) { //no list provided -> default is empty list
        Blockly_gen.addToJSON('{\n');
        Blockly_gen.addToJSON('"type": "list_create",\n');
		Blockly_gen.addToJSON('"id": null,\n');
        Blockly_gen.addToJSON('"items": []\n');
        Blockly_gen.addToJSON('}\n');
    }
    Blockly_gen.addToJSON('},\n');

    Blockly_gen.addToJSON('"rval": {\n');
		Blockly_gen.addToJSON('"type": "number",\n');
		Blockly_gen.addToJSON('"value": 0,\n');
		Blockly_gen.addToJSON('"id": null\n');
    Blockly_gen.addToJSON('}\n');

}

/*----------------------------------------------*/
AST_dispatch["lists_indexOf"] = function(block) {
    Blockly_gen.addToJSON('"type": "arithm_expr",\n');
    Blockly_gen.addToJSON('"op": "ADD",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');

    Blockly_gen.addToJSON('"lval": {\n');
    Blockly_gen.addToJSON('"type": "property",\n');
    if (Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue == "FIRST") {
        Blockly_gen.addToJSON('"name": ".indexOf",\n');
    } else {
        Blockly_gen.addToJSON('"name": ".lastIndexOf",\n');
    }
    Blockly_gen.addToJSON('"item": ');
    var child_no = 1;
    var item_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", child_no);
    if (item_value === null || item_value === undefined || item_value.getAttribute("name") != "VALUE") { //no list provided -> default is empty list
        Blockly_gen.addToJSON('{\n');
        Blockly_gen.addToJSON('"type": "list_create",\n');
		Blockly_gen.addToJSON('"id": null,\n');
        Blockly_gen.addToJSON('"items": []\n');
        Blockly_gen.addToJSON('}\n');
    } else {
        Blockly_gen.createAllBlocks(item_value);
        child_no++;
    }

    Blockly_gen.addToJSON(',\n');
    Blockly_gen.addToJSON('"arg": ');
    var arg_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", child_no);
    if (Blockly_gen.createAllBlocks(arg_value) === null) { //no item to search for provided -> default is empty string
        Blockly_gen.addToJSON('{\n');
        Blockly_gen.addToJSON('"type": "text_const",\n');
		Blockly_gen.addToJSON('"id": null,\n');
        Blockly_gen.addToJSON('"value": ""\n');
        Blockly_gen.addToJSON('}\n');
    }
    Blockly_gen.addToJSON('},\n');

    Blockly_gen.addToJSON('"rval": {\n');
		Blockly_gen.addToJSON('"type": "number",\n');
		Blockly_gen.addToJSON('"value": 1,\n');
		Blockly_gen.addToJSON('"id": null\n');
    Blockly_gen.addToJSON('}\n');

}

/*----------------------------------------------*/
AST_dispatch["lists_getIndex"] = function(block) {
    Blockly_gen.addToJSON('"type": "list_get",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');

    var mode_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
    Blockly_gen.addToJSON('"mode": "' + mode_value.toLowerCase() + '",\n');

    var where_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 2).childNodes[0].nodeValue;
    Blockly_gen.addToJSON('"where": "' + where_value.toLowerCase() + '",\n');

    Blockly_gen.addToJSON('"list": \n');
    var child_no = 1;
    var item_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", child_no);
    if (item_value === null || item_value === undefined || item_value.getAttribute("name") != "VALUE") { //no list to search in provided -> default is empty list
        Blockly_gen.addToJSON('{\n');
        Blockly_gen.addToJSON('"type": "list_create",\n');
		Blockly_gen.addToJSON('"id": null,\n');
        Blockly_gen.addToJSON('"items": []\n');
        Blockly_gen.addToJSON('}\n');
    } else {
        Blockly_gen.createAllBlocks(item_value);
        child_no++;
    }

    if (where_value == "FROM_START" || where_value == "FROM_END") {
        Blockly_gen.addToJSON(',\n');

        Blockly_gen.addToJSON('"pos": \n');
        var pos_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", child_no);
        if (Blockly_gen.createAllBlocks(pos_value) === null) { //no item to search for -> default is 0
            Blockly_gen.addToJSON('{\n');
            Blockly_gen.addToJSON('"type": "number",\n');
            Blockly_gen.addToJSON('"value": 0,\n');
			Blockly_gen.addToJSON('"id": null\n');
            Blockly_gen.addToJSON('}\n');
        }
    }

}


/*----------------------------------------------*/
AST_dispatch["lists_setIndex"] = function(block) {
    var child_no = 1;
    Blockly_gen.addToJSON('"type": "list_set",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');

    var mode_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
    Blockly_gen.addToJSON('"mode": "' + mode_value.toLowerCase() + '",\n');

    var where_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 2).childNodes[0].nodeValue;
    Blockly_gen.addToJSON('"where": "' + where_value.toLowerCase() + '",\n');

    Blockly_gen.addToJSON('"list": \n');
    var item_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    if (item_value === null || item_value === undefined || item_value.getAttribute("name") != "LIST") { //no list to search in provided -> default is empty list
        Blockly_gen.addToJSON('{\n');
        Blockly_gen.addToJSON('"type": "list_create",\n');
		Blockly_gen.addToJSON('"id": null,\n');
        Blockly_gen.addToJSON('"items": []\n');
        Blockly_gen.addToJSON('}\n');
    } else {
        Blockly_gen.createAllBlocks(item_value);
        child_no++;
    }
    Blockly_gen.addToJSON(',\n');

    if (where_value == "FROM_START" || where_value == "FROM_END") {
        Blockly_gen.addToJSON('"pos": \n');
        var pos_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", child_no);
        if (pos_value === null || pos_value === undefined || pos_value.getAttribute("name") != "AT") { //no item to search for -> default is 0
            Blockly_gen.addToJSON('{\n');
            Blockly_gen.addToJSON('"type": "number",\n');
            Blockly_gen.addToJSON('"value": 0,\n');
			Blockly_gen.addToJSON('"id": null\n');
            Blockly_gen.addToJSON('}\n');
        } else {
            Blockly_gen.createAllBlocks(pos_value);
            child_no++;
        }
        Blockly_gen.addToJSON(',\n');
    }

    Blockly_gen.addToJSON('"item": \n');
    var item_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", child_no);
    if (item_value === null || item_value === undefined || item_value.getAttribute("name") != "TO") { //no item to create -> default is null
        Blockly_gen.addToJSON('{\n');
        Blockly_gen.addToJSON('"type": "null_const",\n');
        Blockly_gen.addToJSON('"value": null,\n');
		Blockly_gen.addToJSON('"id": null\n');
        Blockly_gen.addToJSON('}\n');
    } else {
        Blockly_gen.createAllBlocks(item_value);
        child_no++;
    }
}

/*----------------------------------------------*/
AST_dispatch["lists_getSublist"] = function(block) {
    var child_no = 1;
    Blockly_gen.addToJSON('"type": "list_sublist",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');

    var where1_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
    Blockly_gen.addToJSON('"where1": "' + where1_value.toLowerCase() + '",\n');

    var where2_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 2).childNodes[0].nodeValue;
    Blockly_gen.addToJSON('"where2": "' + where2_value.toLowerCase() + '",\n');

    Blockly_gen.addToJSON('"list": \n');
    var item_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    if (item_value === null || item_value === undefined || item_value.getAttribute("name") != "LIST") { //no list to search in provided -> default is empty list
        Blockly_gen.addToJSON('{\n');
        Blockly_gen.addToJSON('"type": "list_create",\n');
		Blockly_gen.addToJSON('"id": null,\n');
        Blockly_gen.addToJSON('"items": []\n');
        Blockly_gen.addToJSON('}\n');
    } else {
        Blockly_gen.createAllBlocks(item_value);
        child_no++;
    }

    if (where1_value != "FIRST") { //first doesnt require an argument (its 0)
        Blockly_gen.addToJSON(',\n');
        Blockly_gen.addToJSON('"pos1": \n');
        var pos_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", child_no);
        if (pos_value === null || pos_value === undefined || pos_value.getAttribute("name") != "AT1") { //no item to search for -> default is 0
            Blockly_gen.addToJSON('{\n');
            Blockly_gen.addToJSON('"type": "number",\n');
            Blockly_gen.addToJSON('"value": 0,\n');
			Blockly_gen.addToJSON('"id": null\n');
            Blockly_gen.addToJSON('}\n');
        } else {
            Blockly_gen.createAllBlocks(pos_value);
            child_no++;
        }
    }

    if (where2_value != "LAST") { //first doesnt require an argument (its the last)
        Blockly_gen.addToJSON(',\n');
        Blockly_gen.addToJSON('"pos2": \n');
        var item_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", child_no);
        if (item_value === null || item_value === undefined || item_value.getAttribute("name") != "AT2") { //no item to search for -> default is 0
            Blockly_gen.addToJSON('{\n');
            Blockly_gen.addToJSON('"type": "number",\n');
            Blockly_gen.addToJSON('"value": 1,\n');
			Blockly_gen.addToJSON('"id": null\n');
            Blockly_gen.addToJSON('}\n');
        } else {
            Blockly_gen.createAllBlocks(item_value);
            child_no++;
        }
    }
}

/*----------------------------------------------*/
AST_dispatch["lists_split"] = function(block) {
    Blockly_gen.addToJSON('"type": "list_split",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');

    var mode_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
    Blockly_gen.addToJSON('"mode": "' + mode_value.toLowerCase() + '",\n');

    Blockly_gen.addToJSON('"item": ');
    var child_no = 1;
    var item_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    if (item_value === null || item_value === undefined || item_value.getAttribute("name") == "DELIM") {
        if (mode_value == "SPLIT") { //no text provided-> default empty string
            Blockly_gen.addToJSON('{\n');
            Blockly_gen.addToJSON('"type": "text_const",\n');
            Blockly_gen.addToJSON('"value": "",\n');
			Blockly_gen.addToJSON('"id": null\n');
            Blockly_gen.addToJSON('}\n');
        } else { //no list provided-> default empty list
            Blockly_gen.addToJSON('{\n');
            Blockly_gen.addToJSON('"type": "list_create",\n');
			Blockly_gen.addToJSON('"id": null,\n');
            Blockly_gen.addToJSON('"items": []\n');
            Blockly_gen.addToJSON('}\n');
        }
    } else {
        Blockly_gen.createAllBlocks(item_value);
        child_no++;
    }
    Blockly_gen.addToJSON(',\n');

    Blockly_gen.addToJSON('"delim": ');
    var delim_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", child_no);
    Blockly_gen.createAllBlocks(delim_value);
}

/*----------------------------------------------*/
AST_dispatch["lists_sort"] = function(block) {
    Blockly_gen.addToJSON('"type": "lists_sort",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');

    var sort_type_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
    Blockly_gen.addToJSON('"sort_type": "' + sort_type_value.toLowerCase() + '",\n');
	
	var direction_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 2).childNodes[0].nodeValue;
	if (direction_value == "-1"){
		Blockly_gen.addToJSON('"direction": "descending",\n');
	}else if(direction_value == "1"){
		Blockly_gen.addToJSON('"direction": "ascending",\n');
	}

    Blockly_gen.addToJSON('"item": ');
    var item_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    if (Blockly_gen.createAllBlocks(item_value) === null) { //no list provided-> default empty list
		Blockly_gen.addToJSON('{\n');
		Blockly_gen.addToJSON('"type": "list_create",\n');
		Blockly_gen.addToJSON('"id": null,\n');
		Blockly_gen.addToJSON('"items": []\n');
		Blockly_gen.addToJSON('}\n');
        
    }
}