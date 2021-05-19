import {Blockly_gen, AST_dispatch} from './AST_Init.js';

/*----------------------------------------------------*/
AST_dispatch.install("controls_if", function(block) {
    Blockly_gen.GetJsonText().add('"type": "if_stmt",\n');
	Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');

    var if_else_count;
    try{
        if_else_count = Number(Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "mutation", 1).getAttribute("elseif"));
    }catch(e){
        if_else_count = 0;
    }
    var occ_else = 1
    var if_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", occ_else++);
    Blockly_gen.GetJsonText().add('"cond": [');
    for (var i = 0; i <= if_else_count; i++){
        if (Blockly_gen.createAllBlocks(if_value) === null || if_value.getAttribute('name') != 'IF' + i) { //no condition in the if statement. Default is false
            Blockly_gen.GetJsonText().add('{\n');
            Blockly_gen.GetJsonText().add('"type": "bool_const",\n');
            Blockly_gen.GetJsonText().add('"value": false,\n');
            Blockly_gen.GetJsonText().add('"id": null\n');
            Blockly_gen.GetJsonText().add('}');
            occ_else--;
        }
        Blockly_gen.GetJsonText().add(',');
        if_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", occ_else++);
    }
    Blockly_gen.GetJsonText().remove_chars(1)
    Blockly_gen.GetJsonText().add('],\n');

    var occ_do = 1
    Blockly_gen.GetJsonText().add('"do": [\n');
    for (var i = 0; i <= if_else_count; i++){
        Blockly_gen.GetJsonText().add('{\n');
        Blockly_gen.GetJsonText().add('"type": "stmts",\n');

        var do_statement = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "statement", occ_do++);
        if (do_statement === null || do_statement.getAttribute("name") != 'DO' + i){
            occ_do--;
            Blockly_gen.GetJsonText().add('"data": []\n');
            Blockly_gen.GetJsonText().add('},\n');
            continue;
        }

        Blockly_gen.GetJsonText().add('"data": [\n');
        Blockly_gen.createAllBlocks(do_statement)
        Blockly_gen.GetJsonText().add(']\n');
        Blockly_gen.GetJsonText().add('},\n'); //do
    }
    Blockly_gen.GetJsonText().remove_chars(2)
    Blockly_gen.GetJsonText().add('],\n');

    var else_count
    try{
        else_count = Number(Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "mutation", 1).getAttribute("else"));
    }catch(e){
        else_count = 0;
    }
    
    Blockly_gen.GetJsonText().add('"default":{\n');
    if (else_count == 1){
        Blockly_gen.GetJsonText().add('"type": "stmts",\n');
        var do_statement = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "statement", occ_do++);
        Blockly_gen.GetJsonText().add('"data": [\n');
        Blockly_gen.createAllBlocks(do_statement)
        Blockly_gen.GetJsonText().add(']\n');
    }else{
        Blockly_gen.GetJsonText().add('"type": "stmts",\n');
        Blockly_gen.GetJsonText().add('"data": []\n');
    }
    Blockly_gen.GetJsonText().add('}\n');
    //var else_if_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 2);
})

AST_dispatch.install("logic_compare", function(block) {
    Blockly_gen.GetJsonText().add('"type": "logic_expr",\n');
	Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');

    var op = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
    Blockly_gen.GetJsonText().add('"op": "' + op + '",\n');

    var child_no = 1;
    Blockly_gen.GetJsonText().add('"lval": ');
    var lval_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1)
    if (lval_value === null || lval_value === undefined || lval_value.getAttribute("name") != "A") { //no value provided, default is 0
        Blockly_gen.GetJsonText().add('{\n');
        Blockly_gen.GetJsonText().add('"type": "number",\n');
        Blockly_gen.GetJsonText().add('"value": 0,\n');
		Blockly_gen.GetJsonText().add('"id": null\n');
        Blockly_gen.GetJsonText().add('}');
    } else {
        Blockly_gen.createAllBlocks(lval_value);
        child_no++;
    }
    Blockly_gen.GetJsonText().add(',\n');

    Blockly_gen.GetJsonText().add('"rval": ');
    var rval_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", child_no);
    if (Blockly_gen.createAllBlocks(rval_value) === null) { //no value provided, default is 0
        Blockly_gen.GetJsonText().add('{\n');
        Blockly_gen.GetJsonText().add('"type": "number",\n');
        Blockly_gen.GetJsonText().add('"value": 0,\n');
		Blockly_gen.GetJsonText().add('"id": null\n');
        Blockly_gen.GetJsonText().add('}\n');
    }
})

/*----------------------------------------------*/
AST_dispatch.install("logic_operation", function(block) {
    Blockly_gen.GetJsonText().add('"type": "logic_expr",\n');
	Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');
	
    var op = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
    Blockly_gen.GetJsonText().add('"op": "' + op + '",\n');

    Blockly_gen.GetJsonText().add('"lval": ');
    var lval_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1)
    if (Blockly_gen.createAllBlocks(lval_value) === null) { //no value provided, default is true
        Blockly_gen.GetJsonText().add('{\n');
        Blockly_gen.GetJsonText().add('"type": "bool_const",\n');
        Blockly_gen.GetJsonText().add('"value": true,\n');
		Blockly_gen.GetJsonText().add('"id": null\n');
        Blockly_gen.GetJsonText().add('}');
    }
    Blockly_gen.GetJsonText().add(',\n');

    Blockly_gen.GetJsonText().add('"rval": ');
    var rval_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 2);
    if (Blockly_gen.createAllBlocks(rval_value) === null) { //no value provided, default is true
        Blockly_gen.GetJsonText().add('{\n');
        Blockly_gen.GetJsonText().add('"type": "bool_const",\n');
        Blockly_gen.GetJsonText().add('"value": true,\n');
		Blockly_gen.GetJsonText().add('"id": null\n');
        Blockly_gen.GetJsonText().add('}\n');
    }
})

/*----------------------------------------------*/
AST_dispatch.install("logic_negate", function(block) {
    Blockly_gen.GetJsonText().add('"type": "logic_expr",\n');
    Blockly_gen.GetJsonText().add('"op": "NOT",\n');
	Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');

    Blockly_gen.GetJsonText().add('"val": ');
    var val_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    if (Blockly_gen.createAllBlocks(val_value) === null) { //no value provided, default is true
        Blockly_gen.GetJsonText().add('{\n');
        Blockly_gen.GetJsonText().add('"type": "bool_const",\n');
        Blockly_gen.GetJsonText().add('"value": true,\n');
		Blockly_gen.GetJsonText().add('"id": null\n');
        Blockly_gen.GetJsonText().add('}\n');
    }
})

/*----------------------------------------------*/
AST_dispatch.install("logic_boolean", function(block) {
    Blockly_gen.GetJsonText().add('"type": "bool_const",\n');
	Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');
	
    var field = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1);
    var field_name = field.getAttribute("name");
    if (field_name == "BOOL") {
        var val = field.childNodes[0].nodeValue;
        Blockly_gen.GetJsonText().add('"value": ' + val.toLowerCase() + '\n');
    } else {
        console.log("\nError inside makeLogicBoolean")
        exit();
    }
})

/*----------------------------------------------*/
AST_dispatch.install("logic_null", function(block) {
    Blockly_gen.GetJsonText().add('"type": "null_const",\n');
	Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');
    Blockly_gen.GetJsonText().add('"value": null\n');
})

/*----------------------------------------------*/
AST_dispatch.install("logic_ternary", function(block) {
    Blockly_gen.GetJsonText().add('"type": "tenary_expr",\n');
	Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');

    var child_no = 1;
    var if_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    Blockly_gen.GetJsonText().add('"if": ');
    if (if_value === null || if_value === undefined || if_value.getAttribute("name") != "IF") { //no condition in the if statement. Default is false
        Blockly_gen.GetJsonText().add('{\n');
        Blockly_gen.GetJsonText().add('"type": "bool_const",\n');
        Blockly_gen.GetJsonText().add('"value": false,\n');
		Blockly_gen.GetJsonText().add('"id": null\n');
        Blockly_gen.GetJsonText().add('}');
    } else {
        Blockly_gen.createAllBlocks(if_value)
        child_no++;
    }
    Blockly_gen.GetJsonText().add(',\n');

    Blockly_gen.GetJsonText().add('"then": ');
    var then_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", child_no);
    if (then_value === null || then_value === undefined || then_value.getAttribute("name") != "THEN") {
        Blockly_gen.GetJsonText().add('{\n');
        Blockly_gen.GetJsonText().add('"type": "null_const",\n');
        Blockly_gen.GetJsonText().add('"value": null,\n');
		Blockly_gen.GetJsonText().add('"id": null\n');
        Blockly_gen.GetJsonText().add('}');
    } else {
        child_no++;
        Blockly_gen.createAllBlocks(then_value);
    }
    Blockly_gen.GetJsonText().add(',\n');

    Blockly_gen.GetJsonText().add('"else": ');
    var else_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", child_no);
    if (Blockly_gen.createAllBlocks(else_value) === null) {
        Blockly_gen.GetJsonText().add('{\n');
        Blockly_gen.GetJsonText().add('"type": "null_const",\n');
        Blockly_gen.GetJsonText().add('"value": null,\n');
		Blockly_gen.GetJsonText().add('"id": null\n');
        Blockly_gen.GetJsonText().add('}\n');
    }
})