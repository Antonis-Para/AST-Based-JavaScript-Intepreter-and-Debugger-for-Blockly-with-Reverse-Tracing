Blockly_gen = require('./AST_Init.js')

/*----------------------------------------------------*/
AST_dispatch["controls_if"] = function(block) {
    Blockly_gen.addToJSON('"type": "if_stmt",\n');

    var if_value = block.getElementsByTagName("value")[0];
    Blockly_gen.addToJSON('"cond": ');
    if (Blockly_gen.createAllBlocks(if_value) === null) { //no condition in the if statement. Default is false
        Blockly_gen.addToJSON('{\n');
        Blockly_gen.addToJSON('"type": "bool_const",\n');
        Blockly_gen.addToJSON('"value": false\n');
        Blockly_gen.addToJSON('}');
    }
    Blockly_gen.addToJSON(',\n');

    Blockly_gen.addToJSON('"do": {\n');
    Blockly_gen.addToJSON('"type": "stmts",\n');

    var do_statement = block.getElementsByTagName("statement")[0];

    Blockly_gen.addToJSON('"data": [\n');
    Blockly_gen.createAllBlocks(do_statement)
    Blockly_gen.addToJSON(']\n');
    Blockly_gen.addToJSON('}\n'); //do
}

AST_dispatch["logic_compare"] = function(block) {
    Blockly_gen.addToJSON('"type": "logic_expr",\n');

    var op = block.getElementsByTagName("field")[0].childNodes[0].nodeValue;
    Blockly_gen.addToJSON('"op": "' + op + '",\n');

    var child_no = 1;
    Blockly_gen.addToJSON('"lval": ');
    var lval_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1)
    if (lval_value === null || lval_value === undefined || lval_value.getAttribute("name") != "A") { //no value provided, default is 0
        Blockly_gen.addToJSON('{\n');
        Blockly_gen.addToJSON('"type": "number",\n');
        Blockly_gen.addToJSON('"value": 0\n');
        Blockly_gen.addToJSON('}');
    } else {
        Blockly_gen.createAllBlocks(lval_value);
        child_no++;
    }
    Blockly_gen.addToJSON(',\n');

    Blockly_gen.addToJSON('"rval": ');
    var rval_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", child_no);
    if (Blockly_gen.createAllBlocks(rval_value) === null) { //no value provided, default is 0
        Blockly_gen.addToJSON('{\n');
        Blockly_gen.addToJSON('"type": "number",\n');
        Blockly_gen.addToJSON('"value": 0\n');
        Blockly_gen.addToJSON('}\n');
    }
}

/*----------------------------------------------*/
AST_dispatch["logic_operation"] = function(block) {
    Blockly_gen.addToJSON('"type": "logic_expr",\n');
    var op = block.getElementsByTagName("field")[0].childNodes[0].nodeValue;
    Blockly_gen.addToJSON('"op": "' + op + '",\n');

    Blockly_gen.addToJSON('"lval": ');
    var lval_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1)
    if (Blockly_gen.createAllBlocks(lval_value) === null) { //no value provided, default is true
        Blockly_gen.addToJSON('{\n');
        Blockly_gen.addToJSON('"type": "bool_const",\n');
        Blockly_gen.addToJSON('"value": true\n');
        Blockly_gen.addToJSON('}');
    }
    Blockly_gen.addToJSON(',\n');

    Blockly_gen.addToJSON('"rval": ');
    var rval_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 2);
    if (Blockly_gen.createAllBlocks(rval_value) === null) { //no value provided, default is true
        Blockly_gen.addToJSON('{\n');
        Blockly_gen.addToJSON('"type": "bool_const",\n');
        Blockly_gen.addToJSON('"value": true\n');
        Blockly_gen.addToJSON('}\n');
    }
}

/*----------------------------------------------*/
AST_dispatch["logic_negate"] = function(block) {
    Blockly_gen.addToJSON('"type": "logic_expr",\n');
    Blockly_gen.addToJSON('"op": "NOT",\n');

    Blockly_gen.addToJSON('"val": ');
    var val_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    if (Blockly_gen.createAllBlocks(val_value) === null) { //no value provided, default is true
        Blockly_gen.addToJSON('{\n');
        Blockly_gen.addToJSON('"type": "bool_const",\n');
        Blockly_gen.addToJSON('"value": true\n');
        Blockly_gen.addToJSON('}\n');
    }
}

/*----------------------------------------------*/
AST_dispatch["logic_boolean"] = function(block) {
    Blockly_gen.addToJSON('"type": "bool_const",\n');
    var field = block.getElementsByTagName("field")[0];
    var field_name = field.getAttribute("name");
    if (field_name == "BOOL") {
        var val = field.childNodes[0].nodeValue;
        Blockly_gen.addToJSON('"value": ' + val.toLowerCase() + '\n');
    } else {
        console.log("\nError inside makeLogicBoolean")
        exit();
    }
}

/*----------------------------------------------*/
AST_dispatch["logic_null"] = function(block) {
    Blockly_gen.addToJSON('"type": "null_const",\n');
    Blockly_gen.addToJSON('"value": null\n');
}

/*----------------------------------------------*/
AST_dispatch["logic_ternary"] = function(block) {
    Blockly_gen.addToJSON('"type": "tenary_expr",\n');

    var child_no = 1;
    var if_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1);
    Blockly_gen.addToJSON('"if": ');
    if (if_value === null || if_value === undefined || if_value.getAttribute("name") != "IF") { //no condition in the if statement. Default is false
        Blockly_gen.addToJSON('{\n');
        Blockly_gen.addToJSON('"type": "bool_const",\n');
        Blockly_gen.addToJSON('"value": false\n');
        Blockly_gen.addToJSON('}');
    } else {
        Blockly_gen.createAllBlocks(if_value)
        child_no++;
    }
    Blockly_gen.addToJSON(',\n');

    Blockly_gen.addToJSON('"then": ');
    var then_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", child_no);
    if (then_value === null || then_value === undefined || then_value.getAttribute("name") != "THEN") {
        Blockly_gen.addToJSON('{\n');
        Blockly_gen.addToJSON('"type": "null_const",\n');
        Blockly_gen.addToJSON('"value": null\n');
        Blockly_gen.addToJSON('}');
    } else {
        child_no++;
        Blockly_gen.createAllBlocks(then_value);
    }
    Blockly_gen.addToJSON(',\n');

    Blockly_gen.addToJSON('"else": ');
    var else_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", child_no);
    if (Blockly_gen.createAllBlocks(else_value) === null) {
        Blockly_gen.addToJSON('{\n');
        Blockly_gen.addToJSON('"type": "null_const",\n');
        Blockly_gen.addToJSON('"value": null\n');
        Blockly_gen.addToJSON('}\n');
    }
}