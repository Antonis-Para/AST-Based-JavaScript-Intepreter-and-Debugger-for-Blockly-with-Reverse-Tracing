import {Blockly_gen, AST_dispatch} from './AST_Init.js';

/*----------------------------------------------*/
AST_dispatch.install("lists_create_with", function(block) {
    Blockly_gen.GetJsonText().add('"type": "list_create",\n');
	Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');
    Blockly_gen.GetJsonText().add('"items": [\n');

    var list_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    var item_count = parseInt(Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "mutation", 1).getAttribute("items"));

    var occ = 1;
    var i = 0;
    while (i < item_count){
        if (list_value === null || list_value.getAttribute("name") != "ADD" + i){
            Blockly_gen.GetJsonText().add('{\n')
            Blockly_gen.GetJsonText().add('"type": "null_const",\n');
            Blockly_gen.GetJsonText().add('"value": null,\n');
            Blockly_gen.GetJsonText().add('"id": null\n');
            Blockly_gen.GetJsonText().add('}')
        }else{
            Blockly_gen.createAllBlocks(list_value);
            list_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", ++occ);
        }
        Blockly_gen.GetJsonText().add(',\n');
        i++;
    }
    if (item_count > 0){ //if i added at least one item
        Blockly_gen.GetJsonText().remove_chars(2); //remove the last ','
    }
    Blockly_gen.GetJsonText().add(']\n');
})

/*----------------------------------------------*/
AST_dispatch.install("lists_repeat", function(block) {
    Blockly_gen.GetJsonText().add('"type": "libfunc_call",\n');
    Blockly_gen.GetJsonText().add('"name": "list_invoke",\n');
    Blockly_gen.GetJsonText().add('"param": "repeat",\n');
	Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');

    Blockly_gen.GetJsonText().add('"args": [');
    var item_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    if (item_value.getAttribute("name") == "NUM") { //no item provided as first value-> default is null
        Blockly_gen.GetJsonText().add('{\n')
        Blockly_gen.GetJsonText().add('"type": "null_const",\n');
        Blockly_gen.GetJsonText().add('"value": null,\n');
		Blockly_gen.GetJsonText().add('"id": null\n');
        Blockly_gen.GetJsonText().add('}')
    } else {
        Blockly_gen.createAllBlocks(item_value);
    }
    Blockly_gen.GetJsonText().add(',\n')

    var repeat_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 2);
    if (repeat_value === null) { //no first value provided -> second value gets shifted to first
        repeat_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    }
    Blockly_gen.createAllBlocks(repeat_value);
    Blockly_gen.GetJsonText().add(']');
})

/*----------------------------------------------*/
AST_dispatch.install("lists_length", function(block) {
    Blockly_gen.GetJsonText().add('"type": "property",\n');
    Blockly_gen.GetJsonText().add('"name": ".length",\n');
	Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');

    Blockly_gen.GetJsonText().add('"item": ');
    var item_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    if (Blockly_gen.createAllBlocks(item_value) === null) { //no list provided-> default empty list
        Blockly_gen.GetJsonText().add('{\n');
        Blockly_gen.GetJsonText().add('"type": "list_create",\n');
		Blockly_gen.GetJsonText().add('"id": null,\n');
        Blockly_gen.GetJsonText().add('"items": []\n');
        Blockly_gen.GetJsonText().add('}\n');
    }
})

/*----------------------------------------------*/
AST_dispatch.install("lists_isEmpty", function(block) { //list.length == 0
    Blockly_gen.GetJsonText().add('"type": "logic_expr",\n');
    Blockly_gen.GetJsonText().add('"op": "EQ",\n');
	Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');

    Blockly_gen.GetJsonText().add('"lval": {\n');
    Blockly_gen.GetJsonText().add('"type": "property",\n');
    Blockly_gen.GetJsonText().add('"name": ".length",\n');
    Blockly_gen.GetJsonText().add('"item": ');
    var item_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    if (Blockly_gen.createAllBlocks(item_value) === null) { //no list provided -> default is empty list
        Blockly_gen.GetJsonText().add('{\n');
        Blockly_gen.GetJsonText().add('"type": "list_create",\n');
		Blockly_gen.GetJsonText().add('"id": null,\n');
        Blockly_gen.GetJsonText().add('"items": []\n');
        Blockly_gen.GetJsonText().add('}\n');
    }
    Blockly_gen.GetJsonText().add('},\n');

    Blockly_gen.GetJsonText().add('"rval": {\n');
		Blockly_gen.GetJsonText().add('"type": "number",\n');
		Blockly_gen.GetJsonText().add('"value": 0,\n');
		Blockly_gen.GetJsonText().add('"id": null\n');
    Blockly_gen.GetJsonText().add('}\n');

})

/*----------------------------------------------*/
AST_dispatch.install("lists_indexOf", function(block) {
    Blockly_gen.GetJsonText().add('"type": "arithm_expr",\n');
    Blockly_gen.GetJsonText().add('"op": "ADD",\n');
	Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');

    Blockly_gen.GetJsonText().add('"lval": {\n');
    Blockly_gen.GetJsonText().add('"type": "property",\n');
    if (Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue == "FIRST") {
        Blockly_gen.GetJsonText().add('"name": ".indexOf",\n');
    } else {
        Blockly_gen.GetJsonText().add('"name": ".lastIndexOf",\n');
    }
    Blockly_gen.GetJsonText().add('"item": ');
    var child_no = 1;
    var item_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", child_no);
    if (item_value === null || item_value === undefined || item_value.getAttribute("name") != "VALUE") { //no list provided -> default is empty list
        Blockly_gen.GetJsonText().add('{\n');
        Blockly_gen.GetJsonText().add('"type": "list_create",\n');
		Blockly_gen.GetJsonText().add('"id": null,\n');
        Blockly_gen.GetJsonText().add('"items": []\n');
        Blockly_gen.GetJsonText().add('}\n');
    } else {
        Blockly_gen.createAllBlocks(item_value);
        child_no++;
    }

    Blockly_gen.GetJsonText().add(',\n');
    Blockly_gen.GetJsonText().add('"arg": ');
    var arg_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", child_no);
    if (Blockly_gen.createAllBlocks(arg_value) === null) { //no item to search for provided -> default is empty string
        Blockly_gen.GetJsonText().add('{\n');
        Blockly_gen.GetJsonText().add('"type": "text_const",\n');
		Blockly_gen.GetJsonText().add('"id": null,\n');
        Blockly_gen.GetJsonText().add('"value": ""\n');
        Blockly_gen.GetJsonText().add('}\n');
    }
    Blockly_gen.GetJsonText().add('},\n');

    Blockly_gen.GetJsonText().add('"rval": {\n');
		Blockly_gen.GetJsonText().add('"type": "number",\n');
		Blockly_gen.GetJsonText().add('"value": 1,\n');
		Blockly_gen.GetJsonText().add('"id": null\n');
    Blockly_gen.GetJsonText().add('}\n');

})

/*----------------------------------------------*/
AST_dispatch.install("lists_getIndex", function(block) {
    var mode_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue.toLowerCase();
    var where_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 2).childNodes[0].nodeValue.toLowerCase();
    var child_no = 1;
    var item_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", child_no);


    if(where_value == "random"){
        Blockly_gen.GetJsonText().add('"type": "libfunc_call",\n');
        Blockly_gen.GetJsonText().add('"name": "list_invoke",\n');
        Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');
        Blockly_gen.GetJsonText().add('"param": "random",\n');
        Blockly_gen.GetJsonText().add('"args": [\n');
            if (item_value === null || item_value === undefined || item_value.getAttribute("name") != "VALUE") { //no list to search in provided -> default is empty list
                Blockly_gen.GetJsonText().add('{\n');
                Blockly_gen.GetJsonText().add('"type": "list_create",\n');
                Blockly_gen.GetJsonText().add('"id": null,\n');
                Blockly_gen.GetJsonText().add('"items": []\n');
                Blockly_gen.GetJsonText().add('}\n');
            } else {
                Blockly_gen.createAllBlocks(item_value);
                child_no++;
            }
            Blockly_gen.GetJsonText().add(',\n');
            if (mode_value == "get") {
                Blockly_gen.GetJsonText().add('{\n');
                Blockly_gen.GetJsonText().add('"type": "bool_const",\n');
                Blockly_gen.GetJsonText().add('"value": false,\n');
                Blockly_gen.GetJsonText().add('"id": null\n');
                Blockly_gen.GetJsonText().add('}');
            }else{
                Blockly_gen.GetJsonText().add('{\n');
                Blockly_gen.GetJsonText().add('"type": "bool_const",\n');
                Blockly_gen.GetJsonText().add('"value": true,\n');
                Blockly_gen.GetJsonText().add('"id": null\n');
                Blockly_gen.GetJsonText().add('}');
            }
        Blockly_gen.GetJsonText().add(']\n');
        return;
    }else if(mode_value == "get" && (where_value == 'from_start' || where_value == 'first')){
        Blockly_gen.GetJsonText().add('"type": "list_index",\n');
        Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');
        Blockly_gen.GetJsonText().add('"list": \n');
        if (item_value === null || item_value === undefined || item_value.getAttribute("name") != "VALUE") { //no list to search in provided -> default is empty list
            Blockly_gen.GetJsonText().add('{\n');
            Blockly_gen.GetJsonText().add('"type": "list_create",\n');
            Blockly_gen.GetJsonText().add('"id": null,\n');
            Blockly_gen.GetJsonText().add('"items": []\n');
            Blockly_gen.GetJsonText().add('}\n');
        } else {
            Blockly_gen.createAllBlocks(item_value);
            child_no++;
        }

        Blockly_gen.GetJsonText().add(',\n');
        
        Blockly_gen.GetJsonText().add('"index": \n');
        var pos_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", child_no);
        if (Blockly_gen.createAllBlocks(pos_value) === null) { //no item to search for -> default is 1
            Blockly_gen.GetJsonText().add('{\n');
            Blockly_gen.GetJsonText().add('"type": "number",\n');
            Blockly_gen.GetJsonText().add('"value": 1,\n');
            Blockly_gen.GetJsonText().add('"id": null\n');
            Blockly_gen.GetJsonText().add('}\n');
        }
        return;
    }

    Blockly_gen.GetJsonText().add('"type": "libfunc_call",\n');
    Blockly_gen.GetJsonText().add('"name": "list_invoke",\n');
    Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');
    switch(mode_value){
        case "get":
            if (where_value == 'from_end' || where_value == 'last'){
                Blockly_gen.GetJsonText().add('"param": "getIndex_fromEnd",\n');

                Blockly_gen.GetJsonText().add('"args": [\n');
                    if (item_value === null || item_value === undefined || item_value.getAttribute("name") != "VALUE") { //no list to search in provided -> default is empty list
                        Blockly_gen.GetJsonText().add('{\n');
                        Blockly_gen.GetJsonText().add('"type": "list_create",\n');
                        Blockly_gen.GetJsonText().add('"id": null,\n');
                        Blockly_gen.GetJsonText().add('"items": []\n');
                        Blockly_gen.GetJsonText().add('}\n');
                    } else {
                        Blockly_gen.createAllBlocks(item_value);
                        child_no++;
                    }
                    Blockly_gen.GetJsonText().add(',\n');
                    var pos_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", child_no);
                    if (Blockly_gen.createAllBlocks(pos_value) === null) { //no item to search for -> default is 1
                        Blockly_gen.GetJsonText().add('{\n');
                        Blockly_gen.GetJsonText().add('"type": "number",\n');
                        Blockly_gen.GetJsonText().add('"value": 1,\n');
                        Blockly_gen.GetJsonText().add('"id": null\n');
                        Blockly_gen.GetJsonText().add('}\n');
                    }
                Blockly_gen.GetJsonText().add(']\n');

            }
            break;
        case "get_remove":
            if (where_value == 'from_start'){
                Blockly_gen.GetJsonText().add('"param": "popIndex_fromStart",\n');

                Blockly_gen.GetJsonText().add('"args": [\n');
                    if (item_value === null || item_value === undefined || item_value.getAttribute("name") != "VALUE") { //no list to search in provided -> default is empty list
                        Blockly_gen.GetJsonText().add('{\n');
                        Blockly_gen.GetJsonText().add('"type": "list_create",\n');
                        Blockly_gen.GetJsonText().add('"id": null,\n');
                        Blockly_gen.GetJsonText().add('"items": []\n');
                        Blockly_gen.GetJsonText().add('}\n');
                    } else {
                        Blockly_gen.createAllBlocks(item_value);
                        child_no++;
                    }
                    Blockly_gen.GetJsonText().add(',\n');
                    var pos_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", child_no);
                    if (Blockly_gen.createAllBlocks(pos_value) === null) { //no item to search for -> default is 0 (1-1=0 because 0based)
                        Blockly_gen.GetJsonText().add('{\n');
                        Blockly_gen.GetJsonText().add('"type": "number",\n');
                        Blockly_gen.GetJsonText().add('"value": 1,\n');
                        Blockly_gen.GetJsonText().add('"id": null\n');
                        Blockly_gen.GetJsonText().add('}\n');
                    }
                Blockly_gen.GetJsonText().add(']\n');

            }
            else if (where_value == 'first'){
                Blockly_gen.GetJsonText().add('"param": "popIndex_first",\n');

                Blockly_gen.GetJsonText().add('"args": [\n');
                    if (item_value === null || item_value === undefined || item_value.getAttribute("name") != "VALUE") { //no list to search in provided -> default is empty list
                        Blockly_gen.GetJsonText().add('{\n');
                        Blockly_gen.GetJsonText().add('"type": "list_create",\n');
                        Blockly_gen.GetJsonText().add('"id": null,\n');
                        Blockly_gen.GetJsonText().add('"items": []\n');
                        Blockly_gen.GetJsonText().add('}\n');
                    } else {
                        Blockly_gen.createAllBlocks(item_value);
                        child_no++;
                    }
                Blockly_gen.GetJsonText().add(']\n');

            }
            else if (where_value == 'from_end'){
                Blockly_gen.GetJsonText().add('"param": "popIndex_fromEnd",\n');

                Blockly_gen.GetJsonText().add('"args": [\n');
                    if (item_value === null || item_value === undefined || item_value.getAttribute("name") != "VALUE") { //no list to search in provided -> default is empty list
                        Blockly_gen.GetJsonText().add('{\n');
                        Blockly_gen.GetJsonText().add('"type": "list_create",\n');
                        Blockly_gen.GetJsonText().add('"id": null,\n');
                        Blockly_gen.GetJsonText().add('"items": []\n');
                        Blockly_gen.GetJsonText().add('}\n');
                    } else {
                        Blockly_gen.createAllBlocks(item_value);
                        child_no++;
                    }
                    Blockly_gen.GetJsonText().add(',\n');
                    var pos_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", child_no);
                    if (Blockly_gen.createAllBlocks(pos_value) === null) { //no item to search for -> default is 1
                        Blockly_gen.GetJsonText().add('{\n');
                        Blockly_gen.GetJsonText().add('"type": "number",\n');
                        Blockly_gen.GetJsonText().add('"value": 1,\n');
                        Blockly_gen.GetJsonText().add('"id": null\n');
                        Blockly_gen.GetJsonText().add('}\n');
                    }
                Blockly_gen.GetJsonText().add(']\n');
            }
            else if (where_value == 'last'){
                Blockly_gen.GetJsonText().add('"param": "popIndex_last",\n');

                Blockly_gen.GetJsonText().add('"args": [\n');
                    if (item_value === null || item_value === undefined || item_value.getAttribute("name") != "VALUE") { //no list to search in provided -> default is empty list
                        Blockly_gen.GetJsonText().add('{\n');
                        Blockly_gen.GetJsonText().add('"type": "list_create",\n');
                        Blockly_gen.GetJsonText().add('"id": null,\n');
                        Blockly_gen.GetJsonText().add('"items": []\n');
                        Blockly_gen.GetJsonText().add('}\n');
                    } else {
                        Blockly_gen.createAllBlocks(item_value);
                        child_no++;
                    }
                Blockly_gen.GetJsonText().add(']\n');
            }
            break;
        case "remove":
            if (where_value == 'from_start'){
                Blockly_gen.GetJsonText().add('"param": "popIndex_fromStart",\n');

                Blockly_gen.GetJsonText().add('"args": [\n');
                    if (item_value === null || item_value === undefined || item_value.getAttribute("name") != "VALUE") { //no list to search in provided -> default is empty list
                        Blockly_gen.GetJsonText().add('{\n');
                        Blockly_gen.GetJsonText().add('"type": "list_create",\n');
                        Blockly_gen.GetJsonText().add('"id": null,\n');
                        Blockly_gen.GetJsonText().add('"items": []\n');
                        Blockly_gen.GetJsonText().add('}\n');
                    } else {
                        Blockly_gen.createAllBlocks(item_value);
                        child_no++;
                    }
                    Blockly_gen.GetJsonText().add(',\n');
                    var pos_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", child_no);
                    if (Blockly_gen.createAllBlocks(pos_value) === null) { //no item to search for -> default is 0
                        Blockly_gen.GetJsonText().add('{\n');
                        Blockly_gen.GetJsonText().add('"type": "number",\n');
                        Blockly_gen.GetJsonText().add('"value": 0,\n');
                        Blockly_gen.GetJsonText().add('"id": null\n');
                        Blockly_gen.GetJsonText().add('}\n');
                    }
                Blockly_gen.GetJsonText().add(']\n');
            }
            else if (where_value == 'first'){
                Blockly_gen.GetJsonText().add('"param": "popIndex_first",\n');

                Blockly_gen.GetJsonText().add('"args": [\n');
                    if (item_value === null || item_value === undefined || item_value.getAttribute("name") != "VALUE") { //no list to search in provided -> default is empty list
                        Blockly_gen.GetJsonText().add('{\n');
                        Blockly_gen.GetJsonText().add('"type": "list_create",\n');
                        Blockly_gen.GetJsonText().add('"id": null,\n');
                        Blockly_gen.GetJsonText().add('"items": []\n');
                        Blockly_gen.GetJsonText().add('}\n');
                    } else {
                        Blockly_gen.createAllBlocks(item_value);
                        child_no++;
                    }
                Blockly_gen.GetJsonText().add(']\n');

            }
            else if (where_value == 'from_end'){
                Blockly_gen.GetJsonText().add('"param": "popIndex_fromEnd",\n');

                Blockly_gen.GetJsonText().add('"args": [\n');
                    if (item_value === null || item_value === undefined || item_value.getAttribute("name") != "VALUE") { //no list to search in provided -> default is empty list
                        Blockly_gen.GetJsonText().add('{\n');
                        Blockly_gen.GetJsonText().add('"type": "list_create",\n');
                        Blockly_gen.GetJsonText().add('"id": null,\n');
                        Blockly_gen.GetJsonText().add('"items": []\n');
                        Blockly_gen.GetJsonText().add('}\n');
                    } else {
                        Blockly_gen.createAllBlocks(item_value);
                        child_no++;
                    }
                    Blockly_gen.GetJsonText().add(',\n');
                    var pos_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", child_no);
                    if (Blockly_gen.createAllBlocks(pos_value) === null) { //no item to search for -> default is 1
                        Blockly_gen.GetJsonText().add('{\n');
                        Blockly_gen.GetJsonText().add('"type": "number",\n');
                        Blockly_gen.GetJsonText().add('"value": 1,\n');
                        Blockly_gen.GetJsonText().add('"id": null\n');
                        Blockly_gen.GetJsonText().add('}\n');
                    }
                Blockly_gen.GetJsonText().add(']\n');
            }
            else if (where_value == 'last'){
                Blockly_gen.GetJsonText().add('"param": "popIndex_last",\n');

                Blockly_gen.GetJsonText().add('"args": [\n');
                    if (item_value === null || item_value === undefined || item_value.getAttribute("name") != "VALUE") { //no list to search in provided -> default is empty list
                        Blockly_gen.GetJsonText().add('{\n');
                        Blockly_gen.GetJsonText().add('"type": "list_create",\n');
                        Blockly_gen.GetJsonText().add('"id": null,\n');
                        Blockly_gen.GetJsonText().add('"items": []\n');
                        Blockly_gen.GetJsonText().add('}\n');
                    } else {
                        Blockly_gen.createAllBlocks(item_value);
                        child_no++;
                    }
                Blockly_gen.GetJsonText().add(']\n');
            }
            break;

    }
})


/*----------------------------------------------*/
AST_dispatch.install("lists_setIndex", function(block) {
    var child_no = 1;
    Blockly_gen.GetJsonText().add('"type": "libfunc_call",\n');
    Blockly_gen.GetJsonText().add('"name": "list_invoke",\n');
	Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');

    var mode_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue.toLowerCase();
    var where_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 2).childNodes[0].nodeValue.toLowerCase();
    var param = mode_value + "_" + where_value;
    Blockly_gen.GetJsonText().add('"param": "' + param + '",\n');

    Blockly_gen.GetJsonText().add('"args": [');
    var item_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    if (item_value === null || item_value === undefined || item_value.getAttribute("name") != "LIST") { //no list to search in provided -> default is empty list
        Blockly_gen.GetJsonText().add('{\n');
        Blockly_gen.GetJsonText().add('"type": "list_create",\n');
		Blockly_gen.GetJsonText().add('"id": null,\n');
        Blockly_gen.GetJsonText().add('"items": []\n');
        Blockly_gen.GetJsonText().add('}\n');
    } else {
        Blockly_gen.createAllBlocks(item_value);
        child_no++;
    }
    Blockly_gen.GetJsonText().add(',\n');

    if (where_value == "from_start" || where_value == "from_end") {
        var pos_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", child_no);
        if (pos_value === null || pos_value === undefined || pos_value.getAttribute("name") != "AT") { //no item to search for -> default is 1 (1 for blockly, 0 for js)
            Blockly_gen.GetJsonText().add('{\n');
            Blockly_gen.GetJsonText().add('"type": "number",\n');
            Blockly_gen.GetJsonText().add('"value": 1,\n');
			Blockly_gen.GetJsonText().add('"id": null\n');
            Blockly_gen.GetJsonText().add('}\n');
        } else {
            Blockly_gen.createAllBlocks(pos_value);
            child_no++;
        }
        Blockly_gen.GetJsonText().add(',\n');
    }

    var item_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", child_no);
    if (item_value === null || item_value === undefined || item_value.getAttribute("name") != "TO") { //no item to create -> default is null
        Blockly_gen.GetJsonText().add('{\n');
        Blockly_gen.GetJsonText().add('"type": "null_const",\n');
        Blockly_gen.GetJsonText().add('"value": null,\n');
		Blockly_gen.GetJsonText().add('"id": null\n');
        Blockly_gen.GetJsonText().add('}\n');
    } else {
        Blockly_gen.createAllBlocks(item_value);
        child_no++;
    }
    Blockly_gen.GetJsonText().add(']');
})

/*----------------------------------------------*/
AST_dispatch.install("lists_getSublist", function(block) {
    var child_no = 1;
    var where1_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue.toLowerCase();
    var where2_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 2).childNodes[0].nodeValue.toLowerCase();
    var param = "get_" + where1_value + "_" + where2_value;

    Blockly_gen.GetJsonText().add('"type": "libfunc_call",\n');
    Blockly_gen.GetJsonText().add('"name": "list_invoke",\n');
    Blockly_gen.GetJsonText().add('"param": "' + param + '",\n');
	Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');

    Blockly_gen.GetJsonText().add('"args": [');
    var item_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    if (item_value === null || item_value === undefined || item_value.getAttribute("name") != "LIST") { //no list to search in provided -> default is empty list
        Blockly_gen.GetJsonText().add('{\n');
        Blockly_gen.GetJsonText().add('"type": "list_create",\n');
		Blockly_gen.GetJsonText().add('"id": null,\n');
        Blockly_gen.GetJsonText().add('"items": []\n');
        Blockly_gen.GetJsonText().add('}\n');
    } else {
        Blockly_gen.createAllBlocks(item_value);
        child_no++;
    }

    if (where1_value != "first") { //first doesnt require an argument (its 0)
        Blockly_gen.GetJsonText().add(',\n');
        //Blockly_gen.GetJsonText().add('"pos1": \n');
        var pos_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", child_no);
        if (pos_value === null || pos_value === undefined || pos_value.getAttribute("name") != "AT1") { //no item to search for -> default is 0
            Blockly_gen.GetJsonText().add('{\n');
            Blockly_gen.GetJsonText().add('"type": "number",\n');
            Blockly_gen.GetJsonText().add('"value": 0,\n');
			Blockly_gen.GetJsonText().add('"id": null\n');
            Blockly_gen.GetJsonText().add('}\n');
        } else {
            Blockly_gen.createAllBlocks(pos_value);
            child_no++;
        }
    }

    if (where2_value != "last") { //first doesnt require an argument (its the last)
        Blockly_gen.GetJsonText().add(',\n');
        //Blockly_gen.GetJsonText().add('"pos2": \n');
        var item_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", child_no);
        if (item_value === null || item_value === undefined || item_value.getAttribute("name") != "AT2") { //no item to search for -> default is 0
            Blockly_gen.GetJsonText().add('{\n');
            Blockly_gen.GetJsonText().add('"type": "number",\n');
            Blockly_gen.GetJsonText().add('"value": 1,\n');
			Blockly_gen.GetJsonText().add('"id": null\n');
            Blockly_gen.GetJsonText().add('}\n');
        } else {
            Blockly_gen.createAllBlocks(item_value);
            child_no++;
        }
    }
    Blockly_gen.GetJsonText().add(']');
})

/*----------------------------------------------*/
AST_dispatch.install("lists_split", function(block) {
    Blockly_gen.GetJsonText().add('"type": "libfunc_call",\n');
    Blockly_gen.GetJsonText().add('"name": "list_invoke",\n');
	Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');
    var mode_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
    Blockly_gen.GetJsonText().add('"param": "' + mode_value.toLowerCase() + '",\n');

    Blockly_gen.GetJsonText().add('"args":[\n');
    var child_no = 1;
    var item_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    if (item_value === null || item_value === undefined || item_value.getAttribute("name") == "DELIM") {
        if (mode_value == "SPLIT") { //no text provided-> default empty string
            Blockly_gen.GetJsonText().add('{\n');
            Blockly_gen.GetJsonText().add('"type": "text_const",\n');
            Blockly_gen.GetJsonText().add('"value": "",\n');
			Blockly_gen.GetJsonText().add('"id": null\n');
            Blockly_gen.GetJsonText().add('}\n');
        } else { //no list provided-> default empty list
            Blockly_gen.GetJsonText().add('{\n');
            Blockly_gen.GetJsonText().add('"type": "list_create",\n');
			Blockly_gen.GetJsonText().add('"id": null,\n');
            Blockly_gen.GetJsonText().add('"items": []\n');
            Blockly_gen.GetJsonText().add('}\n');
        }
    } else {
        Blockly_gen.createAllBlocks(item_value);
        child_no++;
    }
    Blockly_gen.GetJsonText().add(',\n');

    var delim_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", child_no);
    Blockly_gen.createAllBlocks(delim_value);
    Blockly_gen.GetJsonText().add(']');

})

/*----------------------------------------------*/
AST_dispatch.install("lists_sort", function(block) {
    Blockly_gen.GetJsonText().add('"type": "libfunc_call",\n');
    Blockly_gen.GetJsonText().add('"name": "list_invoke",\n');
    Blockly_gen.GetJsonText().add('"param": "sort",\n');
	Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');

    var sort_type_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
    Blockly_gen.GetJsonText().add('"sort_type": "' + sort_type_value + '",\n');
	
	var direction_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 2).childNodes[0].nodeValue;
    Blockly_gen.GetJsonText().add('"direction": "' + direction_value + '",\n');

    Blockly_gen.GetJsonText().add('"args": [');
    var item_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    if (Blockly_gen.createAllBlocks(item_value) === null) { //no list provided-> default empty list
		Blockly_gen.GetJsonText().add('{\n');
		Blockly_gen.GetJsonText().add('"type": "list_create",\n');
		Blockly_gen.GetJsonText().add('"id": null,\n');
		Blockly_gen.GetJsonText().add('"items": []\n');
		Blockly_gen.GetJsonText().add('}\n');
    }
    Blockly_gen.GetJsonText().add(']');
})