//Template example

const { create } = require('domain');

var xmlText = `<xml xmlns="https://developers.google.com/blockly/xml">
<variables>
  <variable id="go{Xyeurj$/g+c?WYf0">y</variable>
  <variable id="d*UZ,]?}?)}vJn]oSSNZ">a</variable>
  <variable id="VF~iBGr46^E?FP.L6@VY">b</variable>
  <variable id="SM)$F2!L,~SsFO|_}Z?}">z</variable>
  <variable id="Ef6eY,Ehoir}q,ZA,#q!">x</variable>
</variables>
<block type="procedures_defreturn" id="dMFm5YsC##y/=IbE+^Ig" x="-1012" y="-12">
  <mutation statements="false">
	<arg name="y" varid="go{Xyeurj$/g+c?WYf0"></arg>
	<arg name="a" varid="d*UZ,]?}?)}vJn]oSSNZ"></arg>
	<arg name="b" varid="VF~iBGr46^E?FP.L6@VY"></arg>
	<arg name="z" varid="SM)$F2!L,~SsFO|_}Z?}"></arg>
	<arg name="x" varid="Ef6eY,Ehoir}q,ZA,#q!"></arg>
  </mutation>
  <field name="NAME">do something</field>
  <comment pinned="false" h="80" w="160">Describe this function...</comment>
</block>
<block type="procedures_callreturn" id="uc=TtKH}9_(gZ5RcOd5n" x="-987" y="163">
  <mutation name="do something">
	<arg name="y"></arg>
	<arg name="a"></arg>
	<arg name="b"></arg>
	<arg name="z"></arg>
	<arg name="x"></arg>
  </mutation>
  <value name="ARG1">
	<block type="logic_boolean" id="R|BgLv[)pvLG#U^2sthm">
	  <field name="BOOL">TRUE</field>
	</block>
  </value>
  <value name="ARG3">
	<block type="math_number" id="pe:dA2LniZ#JziqL303w">
	  <field name="NUM">123</field>
	</block>
  </value>
</block>
</xml>`

var ast = Generator(xmlText)
console.log(ast)


function Generator(xmlText){
	global.DOMParser = require('xmldom').DOMParser;

	global.Blockly = require('./blockly_uncompressed.js');
	require('./blocks_compressed.js');
	require('./javascript_compressed.js');
	require('./msg/messages.js');

	var fs = require('fs');
	const { exit } = require('process');
	const ELEMENT_NODE = 1;
	var JSON = ""
	function addToJSON(str){
		JSON += str;
	}
	
	parser = new DOMParser();
	var xmlDoc = parser.parseFromString(xmlText, "text/xml");
	
	//--------------------MAIN-----------------------//
	addToJSON("{\n");
	addToJSON('"type": "stmts",\n');

	
	var elements = xmlDoc.childNodes[0];
	addToJSON('"data": [\n');
		createAllVariables(elements);
		createAllBlocks(elements);
	addToJSON(']\n');
	
	addToJSON('}\n');
	
	return JSON;
	//-----------------------------------------------//


	function createAllVariables(blocks){
		var variables = getElement(blocks, ELEMENT_NODE, "variables", 1);
		if (variables === null) return;

		var occ = 1;
		var variable = getElement(variables, ELEMENT_NODE, "variable", occ++);
		while (variable !== null){
			if (variable.childNodes.length != 0){
				addToJSON("{\n")
				addToJSON('"type": "var_decl",\n');
				addToJSON('"name": "' + variable.childNodes[0].nodeValue + '"\n');
				addToJSON("},\n")
			}
			variable = getElement(variables, ELEMENT_NODE, "variable", occ++);
		}
	}

	/*----------------------------------------------------*/
	function createAllBlocks(blocks){
	  var name = blocksExist(blocks)
	  if (name === null) //no blocks or shadow block exist
		return null;
	  
	  var block, occ = 1;
	  block = getElement(blocks, ELEMENT_NODE, name, occ++);
	  while ( block  !== null ){ //while there are more blocks..
		addToJSON("{\n")
		var type = block.getAttribute('type');

		switch (type){
		  case "controls_if":
			makeIf(block);
			break;
		  case "logic_compare":
			makeLogicCompare(block);
			break;
		  case "logic_operation":
			makeLogicOperation(block);
			break;
		  case "logic_negate":
			makeLogicNegate(block);
			break;
		  case "logic_boolean":
			makeLogicBoolean(block);
			break;
		  case "logic_null":
			makeLogicNull(block);
			break;
		  case "logic_ternary":
			makeLogicTenary(block);
			break;
		  case "controls_repeat_ext":
			makeRepeat(block);
			break;
		  case "controls_whileUntil":
			makeWhile(block);
			break;
		  case "controls_for":
			makeFor(block);
			break;
		  case "controls_forEach":
			makeForEach(block);
			break;
		  case "controls_flow_statements":
			makeControlFlowStmt(block);
			break;
		  case "math_number":
			makeMathNumber(block);
			break;
		  case "math_arithmetic":
			makeMathArithmetic(block);
			break;
		  case "math_single":
			makeRoot(block);
			break;
		  case "math_trig":
			makeMathTrig(block);
			break;
		  case "math_constant":
			makeMathConst(block);
			break;
		  case "math_number_property":
			makeMathNumberProperty(block);
			break;
		  case "math_round":
			makeMathRound(block);
			break;
		  case "math_on_list":
			makeMathOnList(block);
			break;
		  case "math_modulo":
			makeMathModulo(block);
			break;
		  case "math_constrain":
			makeMathConstrain(block);
			break;
		  case "math_random_int":
			makeMathRandomInt(block);
			break;
		  case "math_random_float":
			makeMathRandomFloat(block);
			break;
		  case "math_atan2":
			makeMathAtan2(block);
			break;
		  case "text_print":
			makeTextPrint(block);
			break;
		  case "text":
			makeText(block);
			break;
	   	  case "text_join":
			makeTextJoin(block);
			break;
		  case "text_append":
			makeTextAppend(block);
			break;
		  case "text_length":
			makeTextLength(block);
			break;
		  case "text_isEmpty":
			makeTextEmpty(block);
			break;
		  case "text_indexOf":
			makeTextIndexOf(block);
			break;
		  case "text_charAt":
			makeTextCharAt(block);
			break;
		  case "text_getSubstring":
			makeTextSubstring(block);
			break;
		  case "text_changeCase":
			makeTextChangeCase(block);
			break;
		  case "text_trim":
			makeTextTrim(block);
			break;
		  case "text_prompt_ext":
			makeTextPromt(block);
			break;
		  case "lists_create_with":
			makeListCreateWith(block);
			break;
		  case "lists_repeat":
			makeListRepeat(block);
			break;
		  case "lists_length":
			makeListLength(block);
			break;
		  case "lists_isEmpty":
			makeListIsEmpty(block);
			break;
		  case "lists_indexOf":
			makeListIndexOf(block);
			break;
		  case "lists_getIndex":
			makeListGetIndex(block);
			break;
		  case "lists_setIndex":
			makeListSetIndex(block);
			break;
		  case "lists_getSublist":
			makeSublist(block);
			break;
		  case "lists_split":
			makeListSplit(block);
			break;
		  case "colour_picker":
			makeColourPicker(block);
			break; 
		  case "colour_random":
			makeColourRandom(block);
			break; 
		  case "colour_rgb":
			makeColourRGB(block);
			break; 
		  case "colour_blend":
			makeColourBlend(block);
			break; 
		  case "variables_set":
			makeVariableSet(block);
			break;
		  case "variables_get":
			makeVariableGet(block);
			break;
		  case "math_change":
			makeVariableMathChange(block);
			break;
		  case "procedures_defnoreturn":
			makeVoidFunc(block);
			break;
		  case "procedures_ifreturn":
			makeReturn(block);
			break;
		  case "procedures_defreturn":
			makeFunc(block);
			break;
		  case "procedures_callnoreturn":
			makeVoidFuncCall(block);
			break;
		  case "procedures_callreturn":
			makeFuncCall(block);
			break;
		}

		addToJSON('}'); //data
		nextBlock(block);
		block = getElement(blocks, ELEMENT_NODE, name, occ++)
		if (block !== null){
			addToJSON(',\n');
		}
	  }

	 // addToJSON(']\n'); //data
	}

	function blocksExist(blocks){
	  var block = getElement(blocks, ELEMENT_NODE, "block", 1);
	  var name = "block"

	  if (block === null){ //if there aren't any blocks, check for shadow blocks
		name = "shadow"
		block = getElement(blocks, ELEMENT_NODE, "shadow", 1);
		if (block === null){ //no blocks or shadow blocks == 0 statements inside
		  return null;
		}
	  }
	  return name;
	}

	/*----------------------------------------------------*/
	  function nextBlock(block){ 
		var next = getElement(block, ELEMENT_NODE, "next");

		if (next == null){
		  addToJSON('\n');
		  return;
		}

		addToJSON(',\n');
		createAllBlocks(next)
	  }

	  /*----------------------------------------------------*/
	  function makeIf(block){
		addToJSON('"type": "if_stmt",\n');

		var if_value = block.getElementsByTagName("value")[0];
		addToJSON('"cond": ');
		if (createAllBlocks(if_value) === null){ //no condition in the if statement. Default is false
			addToJSON('{\n');
			addToJSON('"type": "bool_const",\n');
			addToJSON('"value": false\n');
			addToJSON('}');
		}
		addToJSON(',\n');

		addToJSON('"do": {\n');
		addToJSON('"type": "stmts",\n');
		
		var do_statement = block.getElementsByTagName("statement")[0];

		addToJSON('"data": [\n');
		createAllBlocks(do_statement)
		addToJSON(']\n');
		addToJSON('}\n'); //do
	  }

	  function makeLogicCompare(block){
		addToJSON('"type": "logic_expr",\n');

		var op = block.getElementsByTagName("field")[0].childNodes[0].nodeValue;
		addToJSON('"op": "' + op + '",\n');

		var child_no = 1;
		addToJSON('"lval": ');
		var lval_value = getElement(block, ELEMENT_NODE, "value", 1)
		if (lval_value === null || lval_value === undefined || lval_value.getAttribute("name") != "A"){ //no value provided, default is 0
			addToJSON('{\n');
			addToJSON('"type": "number",\n');
			addToJSON('"value": 0\n');
			addToJSON('}');
		}else{
			createAllBlocks(lval_value);
			child_no++;
		}
		addToJSON(',\n');

		addToJSON('"rval": ');
		var rval_value = getElement(block, ELEMENT_NODE, "value", child_no);
		if (createAllBlocks(rval_value) === null){ //no value provided, default is 0
			addToJSON('{\n');
			addToJSON('"type": "number",\n');
			addToJSON('"value": 0\n');
			addToJSON('}\n');
		}
	  }

	/*----------------------------------------------*/
	function makeLogicOperation(block){
		addToJSON('"type": "logic_expr",\n');
		var op = block.getElementsByTagName("field")[0].childNodes[0].nodeValue;
		addToJSON('"op": "' + op + '",\n');

		addToJSON('"lval": ');
		var lval_value = getElement(block, ELEMENT_NODE, "value", 1)
		if (createAllBlocks(lval_value) === null){ //no value provided, default is true
			addToJSON('{\n');
			addToJSON('"type": "bool_const",\n');
			addToJSON('"value": true\n');
			addToJSON('}');
		}
		addToJSON(',\n');

		addToJSON('"rval": ');
		var rval_value = getElement(block, ELEMENT_NODE, "value", 2);
		if (createAllBlocks(rval_value) === null){ //no value provided, default is true
			addToJSON('{\n');
			addToJSON('"type": "bool_const",\n');
			addToJSON('"value": true\n');
			addToJSON('}\n');
		}
	}

	/*----------------------------------------------*/
	function makeLogicNegate(block){
		addToJSON('"type": "logic_expr",\n');
		addToJSON('"op": "NOT",\n');

		addToJSON('"val": ');
		var val_value = getElement(block, ELEMENT_NODE, "value", 1);
		if (createAllBlocks(val_value) === null){ //no value provided, default is true
			addToJSON('{\n');
			addToJSON('"type": "bool_const",\n');
			addToJSON('"value": true\n');
			addToJSON('}\n');
		}
	}

	/*----------------------------------------------*/
	function makeLogicBoolean(block){
		addToJSON('"type": "bool_const",\n');
		var field = block.getElementsByTagName("field")[0];
		var field_name = field.getAttribute("name");
		if (field_name == "BOOL"){
		var val = field.childNodes[0].nodeValue;
		addToJSON('"value": ' + val.toLowerCase() + '\n');
		}else{
		console.log("\nError inside makeLogicBoolean")
		exit();
		}
	}

	/*----------------------------------------------*/
	function makeLogicNull(block){
		addToJSON('"type": "null_const",\n');
		addToJSON('"value": null\n');
	}

	/*----------------------------------------------*/
	function makeLogicTenary(block){
		addToJSON('"type": "tenary_expr",\n');

		var child_no = 1;
		var if_value = getElement(block, ELEMENT_NODE, "value", 1);
		addToJSON('"if": ');
		if (if_value === null || if_value === undefined || if_value.getAttribute("name") != "IF"){ //no condition in the if statement. Default is false
			addToJSON('{\n');
			addToJSON('"type": "bool_const",\n');
			addToJSON('"value": false\n');
			addToJSON('}');
		}else{
			createAllBlocks(if_value)
			child_no++;
		}
		addToJSON(',\n');

		addToJSON('"then": ');
		var then_value = getElement(block, ELEMENT_NODE, "value", child_no);
		if (then_value === null || then_value === undefined || then_value.getAttribute("name") != "THEN"){
			addToJSON('{\n');
			makeLogicNull()
			addToJSON('}');
		}else{
			child_no++;
			createAllBlocks(then_value);
		}
		addToJSON(',\n');

		addToJSON('"else": ');
		var else_value = getElement(block, ELEMENT_NODE, "value", child_no);
		if (createAllBlocks(else_value) === null){
			addToJSON('{\n');
			makeLogicNull()
			addToJSON('}\n');
		}
	}

	 /*----------------------------------------------------*/
	 function makeRepeat(block){
	  addToJSON('"type": "repeat_stmt",\n');
	  var mode_value = block.getElementsByTagName("field")[0].childNodes[0].nodeValue; //can not be empty
	  addToJSON('"mode": "' + mode_value.toLowerCase() + '",\n');

	  var cond_value = block.getElementsByTagName("value")[0];
	  addToJSON('"cond": ');
	  createAllBlocks(cond_value)
	  addToJSON(',\n');

	  addToJSON('"do": {\n');
	  addToJSON('"type": "stmts",\n');
	  var do_statement = block.getElementsByTagName("statement")[0];
	  
	  addToJSON('"data": [\n');
	  createAllBlocks(do_statement)
	  addToJSON(']\n');
	  addToJSON('}\n'); //do
	}

	/*----------------------------------------------------*/
	function makeWhile(block){
		addToJSON('"type": "while_stmt",\n');

		var times_value = block.getElementsByTagName("value")[0];
		addToJSON('"cond": ');
		if (createAllBlocks(times_value) === null){
			addToJSON('{\n');
			addToJSON('"type": "bool_const",\n');
			addToJSON('"value": false\n');
			addToJSON('}');
		}
		addToJSON(',\n');

		addToJSON('"do": {\n');
		addToJSON('"type": "stmts",\n');
		var do_statement = block.getElementsByTagName("statement")[0];
		
		addToJSON('"data": [\n');
		createAllBlocks(do_statement)
		addToJSON(']\n');
		addToJSON('}\n'); //do
	}

	/*----------------------------------------------------*/
	function makeFor(block){
		addToJSON('"type": "for_stmt",\n');
		var var_value = block.getElementsByTagName("field")[0].childNodes[0].nodeValue; //can not be empty
		addToJSON('"var_name": "' + var_value + '",\n');

		var from_value = getElement(block, ELEMENT_NODE, "value", 1)
		addToJSON('"from": ');
		createAllBlocks(from_value)
		addToJSON(',\n');

		var to_value = getElement(block, ELEMENT_NODE, "value", 2)
		addToJSON('"to": ');
		createAllBlocks(to_value)
		addToJSON(',\n');

		var by_value = getElement(block, ELEMENT_NODE, "value", 3)
		addToJSON('"by": ');
		createAllBlocks(by_value)
		addToJSON(',\n');

		addToJSON('"do": {\n');
		addToJSON('"type": "stmts",\n');
		var do_statement = block.getElementsByTagName("statement")[0];
		addToJSON('"data": [\n');
		createAllBlocks(do_statement)
		addToJSON(']\n');
		addToJSON('}\n'); //do
	}


	/*----------------------------------------------------*/
	function makeForEach(block){
		addToJSON('"type": "forEach_stmt",\n');
		var var_value = block.getElementsByTagName("field")[0].childNodes[0].nodeValue; //can not be empty
		addToJSON('"var_name": "' + var_value + '",\n');

		var in_list_value = getElement(block, ELEMENT_NODE, "value", 1);
		addToJSON('"in": ');
		if (createAllBlocks(in_list_value) === null){//no list provided-> default empty list
			addToJSON('{\n');
			addToJSON('"type": "list_create",\n');
			addToJSON('"items": []\n');
			addToJSON('}\n');
		}
		addToJSON(",\n");

		addToJSON('"do": {\n');
			addToJSON('"type": "stmts",\n');
			var do_statement = block.getElementsByTagName("statement")[0];
			addToJSON('"data": [\n');
				createAllBlocks(do_statement)
			addToJSON(']\n');
		addToJSON('}\n'); //do
	}

	/*----------------------------------------------------*/
	function makeControlFlowStmt(block){
		addToJSON('"type": "keyword",\n');
		var key_value = block.getElementsByTagName("field")[0].childNodes[0].nodeValue; //can not be empty
		addToJSON('"name": "' + key_value.toLowerCase() + '"\n');
	}


	 /*----------------------------------------------*/
	function makeMathNumber(block){
	  var num_name = block.getElementsByTagName("field")[0].getAttribute('name');
	  addToJSON('"type": "number",\n');

	  if (num_name == "NUM"){
		var num = block.getElementsByTagName("field")[0].childNodes[0].nodeValue;
		addToJSON('"value": ' + num + '\n');
	  }
	}

	 /*----------------------------------------------*/
	 function makeMathArithmetic(block){
	  addToJSON('"type": "arithm_expr",\n');

	  var operation = block.getElementsByTagName("field")[0].childNodes[0].nodeValue;
	  addToJSON('"op": "' + operation + '",\n');

	  var lval_value = getElement(block, ELEMENT_NODE, "value", 1)
	  addToJSON('"lval": ');
	  createAllBlocks(lval_value);
	  addToJSON(',\n');

	  var rval_value = getElement(block, ELEMENT_NODE, "value", 2)
	  addToJSON('"rval": ');
	  createAllBlocks(rval_value);
	}

	 /*----------------------------------------------*/
	function makeTextPrint(block){
	  addToJSON('"type": "func_call",\n');
	  addToJSON('"name": "window.alert",\n');

	  var print_value = block.getElementsByTagName("value")[0];

	  addToJSON('"arg": ');
	  createAllBlocks(print_value);
	}

	 /*----------------------------------------------*/
	 function makeRoot(block){
	  addToJSON('"type": "func_call",\n');
	  addToJSON('"name": "Math.sqrt",\n');

	  var root_value = block.getElementsByTagName("value")[0];

	  addToJSON('"arg": ');
	  createAllBlocks(root_value)
	}

	 /*----------------------------------------------*/
	 function makeMathTrig(block){
	  addToJSON('"type": "func_call",\n');

	  var func = block.getElementsByTagName("field")[0].childNodes[0].nodeValue;
	  addToJSON('"name": "Math.' + func.toLowerCase() +'",\n');

	  var trig_value = block.getElementsByTagName("value")[0];

	  addToJSON('"arg": ');
	  createAllBlocks(trig_value)
	}

	 /*----------------------------------------------*/
	 function makeMathConst(block){
	  var constant = block.getElementsByTagName("field")[0].childNodes[0].nodeValue;
	  addToJSON('"type": "math_const",\n');
	  addToJSON('"value": "' + constant + '"\n');
	}

	 /*----------------------------------------------*/
	 function makeMathNumberProperty(block){
	  addToJSON('"type": "math_property",\n');

	  var property = block.getElementsByTagName("field")[0].childNodes[0].nodeValue;
	  addToJSON('"property": "' + property + '",\n');

	  var num_value = block.getElementsByTagName("value")[0];
	  addToJSON('"value": ');
	  createAllBlocks(num_value)
	}

	 /*----------------------------------------------*/
	 function makeMathRound(block){
	  addToJSON('"type": "func_call",\n');

	  var func = block.getElementsByTagName("field")[0].childNodes[0].nodeValue;
	  if (func == "ROUNDUP"){
		addToJSON('"name": "Math.ceil",\n');
	  }else if (func == "ROUNDDOWN"){
		addToJSON('"name": "Math.floor",\n');
	  }else if (func == "ROUND"){
		addToJSON('"name": "Math.round",\n');
	  }

	  var round_value = block.getElementsByTagName("value")[0];

	  addToJSON('"arg": ');
	  createAllBlocks(round_value)
	}

	/*----------------------------------------------*/
	function makeMathOnList(block){
		addToJSON('"type": "list_math_expr",\n');
		var op = block.getElementsByTagName("field")[0].childNodes[0].nodeValue;
		addToJSON('"op": "' + op.toLowerCase() + '",\n');
  
		var list_value = getElement(block, ELEMENT_NODE, "value", 1);
		addToJSON('"list": ')
		if (createAllBlocks(list_value) === null){ //no list provided -> default is empty list
			addToJSON('{\n');
			addToJSON('"type": "list_create",\n');
			addToJSON('"items": []\n');
			addToJSON('}\n');
		}
	  }
  
	 /*----------------------------------------------*/
	 function makeMathModulo(block){
	  addToJSON('"type": "arithm_expr",\n');

	  addToJSON('"op": "MOD",\n');

	  addToJSON('"lval": ');
	  var lval_value = getElement(block, ELEMENT_NODE, "value", 1)
	  createAllBlocks(lval_value);
	  addToJSON(',\n');

	  addToJSON('"rval": ');
	  var rval_value = getElement(block, ELEMENT_NODE, "value", 2)
	  createAllBlocks(rval_value);
	}

	 /*----------------------------------------------*/
	 function makeMathConstrain(block){
	   //will look like: Math.min(Math.max(num1, num2), num3)
	  addToJSON('"type": "math_constraint",\n');

	  addToJSON('"value": ');
	  var constraint_value = getElement(block, ELEMENT_NODE, "value", 1)
	  createAllBlocks(constraint_value)
	  addToJSON(',\n');

	  addToJSON('"low": ');
	  var low_value = getElement(block, ELEMENT_NODE, "value", 2)
	  createAllBlocks(low_value)
	  addToJSON(',\n');

	  addToJSON('"high": ');
	  var high_value = getElement(block, ELEMENT_NODE, "value", 3)
	  createAllBlocks(high_value)
	}

	 /*----------------------------------------------*/
	 function makeMathRandomInt(block){
	  addToJSON('"type": "math_rand_int",\n');

	  addToJSON('"from": ');
	  var random_from_value = getElement(block, ELEMENT_NODE, "value", 1)
	  createAllBlocks(random_from_value)
	  addToJSON(',\n');

	  addToJSON('"to": ');
	  var random_to_value = getElement(block, ELEMENT_NODE, "value", 2)
	  createAllBlocks(random_to_value)
	}

	 /*----------------------------------------------*/
	 function makeMathRandomFloat(block){
	  addToJSON('"type": "func_call",\n');
	  addToJSON('"name": "Math.random"\n');
	}

	 /*----------------------------------------------*/
	 function makeMathAtan2(block){
	  addToJSON('"type": "func_atan2",\n');

	  var x_value = getElement(block, ELEMENT_NODE, "value", 1);
	  addToJSON('"x": ');
	  createAllBlocks(x_value)
	  addToJSON(',\n');

	  var y_value = getElement(block, ELEMENT_NODE, "value", 2);
	  addToJSON('"y": ');
	  createAllBlocks(y_value)
	}

	 /*----------------------------------------------*/
	function makeText(block){
		addToJSON('"type": "text_const",\n');
  
		if (block.getElementsByTagName("field")[0].childNodes.length == 0){ //DO THIS FOR EVERY FUNCTION
			addToJSON('"value": ""\n');
		}else{
			var text = block.getElementsByTagName("field")[0].childNodes[0].nodeValue;
			addToJSON('"value": "'+ text +'"\n');
		}
	}

	/*----------------------------------------------*/
	function makeTextJoin(block){
		addToJSON('"type": "property_join",\n');
		addToJSON('"items": [\n');


		var join_value = getElement(block, ELEMENT_NODE, "value", 1);
		if (join_value === null){
			addToJSON(']\n');
			return;
		}
		
		var occ = 1;
		while (join_value !== null){
			createAllBlocks(join_value);
			join_value = getElement(block, ELEMENT_NODE, "value", ++occ);
			addToJSON(',\n');
		}
		JSON = JSON.slice(0, -2); //remove the last ','
		addToJSON(']\n');
	}

	/*----------------------------------------------*/
	function makeTextAppend(block){
		addToJSON('"type": "arithm_expr",\n');
		addToJSON('"op": "PLUS_EQ",\n');
		

		addToJSON('"lval": {\n');
		addToJSON('"type": "var",\n');
		var lvalue = block.getElementsByTagName("field")[0].getAttribute('name');
		if (lvalue == "VAR"){
			if (block.getElementsByTagName("field")[0].childNodes.length == 0){
				addToJSON('"value": ""\n');
			}else{
				var variable = block.getElementsByTagName("field")[0].childNodes[0].nodeValue;
				addToJSON('"name": "' + variable + '"\n');
			}
		}else{
		  console.log("Error in makeTextAppend")
		  exit();
		}
		addToJSON('},\n');


		addToJSON('"rval": ');
		var rval_value = getElement(block, ELEMENT_NODE, "value", 1)
		createAllBlocks(rval_value);
	}


	/*----------------------------------------------*/
	function makeTextLength(block){
		addToJSON('"type": "property",\n');
		addToJSON('"name": ".length",\n');
		addToJSON('"item": ');

		var len_value = block.getElementsByTagName("value")[0];
		createAllBlocks(len_value)
	}

	/*----------------------------------------------*/
	function makeTextEmpty(block){
		addToJSON('"type": "logic_expr",\n');
		addToJSON('"op": "EQ",\n');

		addToJSON('"lval": ');
		var lval_value = getElement(block, ELEMENT_NODE, "value", 1)
		createAllBlocks(lval_value);
		addToJSON(',\n');

		addToJSON('"rval": {\n');
			addToJSON('"type": "text_const",\n');
			addToJSON('"value": ""\n');
		addToJSON('}\n');
	}

	/*----------------------------------------------*/
	function makeTextIndexOf(block){
		addToJSON('"type": "property",\n');

		var property = block.getElementsByTagName("field")[0].childNodes[0].nodeValue;
		if (property == "LAST"){
			addToJSON('"name": ".lastIndexOf",\n');
		}else if (property == "FIRST"){
			addToJSON('"name": ".indexOf",\n');
		}
		
		var child_no = 1;
		var searchIn_value = getElement(block, ELEMENT_NODE, "value", 1);
		addToJSON('"item": ');
		if (searchIn_value === null || searchIn_value === undefined || searchIn_value.getAttribute("name") != "VALUE"){
			addToJSON('{\n');
			addToJSON('"type": "text_const",\n');
			addToJSON('"value": ""\n');
			addToJSON('}\n');
		}else{
			createAllBlocks(searchIn_value)
			child_no++;
		}
		
		addToJSON(',\n');
		
		var searchFor_value = getElement(block, ELEMENT_NODE, "value", child_no)
		addToJSON('"arg": ');
		createAllBlocks(searchFor_value);
	}
	
	/*----------------------------------------------*/
	function makeTextCharAt(block){
		addToJSON('"type": "property_charAt",\n');

		var where = block.getElementsByTagName("field")[0].childNodes[0].nodeValue;
		addToJSON('"where": "' + where.toLowerCase() +'",\n');
		
		var child_no = 1;
		addToJSON('"item": ');
		var inttext_value =  getElement(block, ELEMENT_NODE, "value", 1);
		if (inttext_value === null || inttext_value === undefined || inttext_value.getAttribute("name") != "VALUE"){
			addToJSON('{\n');
			addToJSON('"type": "text_const",\n');
			addToJSON('"value": ""\n');
			addToJSON('}\n');
		}else{
			createAllBlocks(inttext_value);
			child_no++;
		}

		if (where == "RANDOM" || where == "FIRST" || where =="LAST") {
			return;
		}

		addToJSON(',\n');

		var at_value =  getElement(block, ELEMENT_NODE, "value", child_no);
		if (at_value === null){
			addToJSON('"at": {\n');
				addToJSON('"type": "number",\n');
				addToJSON('"value": 0\n');
			addToJSON('}\n');
		}else{
			addToJSON('"at": ');
			createAllBlocks(at_value);
		}
	}

	
	/*----------------------------------------------*/
	function makeTextSubstring(block){
		addToJSON('"type": "property_substr",\n');

		var where1 = block.getElementsByTagName("field")[0].childNodes[0].nodeValue;
		addToJSON('"where1": "' + where1.toLowerCase() +'",\n');

		var where2 = block.getElementsByTagName("field")[1].childNodes[0].nodeValue;
		addToJSON('"where2": "' + where2.toLowerCase() +'",\n');
		
		var child_no = 1;
		addToJSON('"item": ');
		var item_value =  getElement(block, ELEMENT_NODE, "value", 1);
		if (item_value === null || item_value === undefined || item_value.getAttribute("name") != "STRING"){ //no string to search in provided -> default is empty string
			addToJSON('{\n');
			addToJSON('"type": "text_const",\n');
			addToJSON('"value": ""\n');
			addToJSON('}\n');
		}else{
			createAllBlocks(item_value);
			child_no++;
		}

		if (where1 != "FIRST"){ //first doesnt require an argument (its 0)
			addToJSON(',\n');
			addToJSON('"pos1": \n');
			var pos1_value = getElement(block, ELEMENT_NODE, "value", child_no);
			if (pos1_value === null || pos1_value === undefined || pos1_value.getAttribute("name") != "AT1"){ //no item to search for -> default is 0
				addToJSON('{\n');
				addToJSON('"type": "number",\n');
				addToJSON('"value": 0\n');
				addToJSON('}\n');
			}else{
				createAllBlocks(pos1_value);
				child_no++;
			}
		}

		if (where2 != "LAST"){ //first doesnt require an argument (its the last)
			addToJSON(',\n');
			addToJSON('"pos2": \n');
			var pos2_value = getElement(block, ELEMENT_NODE, "value", child_no);
			if (pos2_value === null || pos2_value === undefined || pos2_value.getAttribute("name") != "AT2"){ //no item to search for -> default is 0
				addToJSON('{\n');
				addToJSON('"type": "number",\n');
				addToJSON('"value": 1\n');
				addToJSON('}\n');
			}else{
				createAllBlocks(pos2_value);
				child_no++;
			}
		}
	}

	/*----------------------------------------------*/
	function makeTextChangeCase(block){
		addToJSON('"type": "property_changeCase",\n');

		var case_type = block.getElementsByTagName("field")[0].childNodes[0].nodeValue;
		addToJSON('"case": "' + case_type.toLowerCase() +'",\n');
		

		addToJSON('"item": ');
		var case_value =  getElement(block, ELEMENT_NODE, "value", 1);
		createAllBlocks(case_value);
	}

	/*----------------------------------------------*/
	function makeTextPromt(block){
		addToJSON('"type": "func_call",\n');
		addToJSON('"name": "window.prompt",\n');

		addToJSON('"arg": ');
		var arg_value =  getElement(block, ELEMENT_NODE, "value", 1);
		createAllBlocks(arg_value);
	}


	/*----------------------------------------------*/
	function makeTextTrim(block){
		addToJSON('"type": "property_trim",\n');
		var side = block.getElementsByTagName("field")[0].childNodes[0].nodeValue;
		addToJSON('"side": "' + side.toLowerCase() +'",\n');
		

		addToJSON('"item": ');
		var text_value =  getElement(block, ELEMENT_NODE, "value", 1);
		createAllBlocks(text_value);
	}
	/*----------------------------------------------*/
	function makeListCreateWith(block){
		addToJSON('"type": "list_create",\n');
		addToJSON('"items": [\n');

		var list_value = getElement(block, ELEMENT_NODE, "value", 1);
		if (list_value === null){
			addToJSON(']\n');
			return;
		}
		
		var occ = 1;
		while (list_value !== null){
			createAllBlocks(list_value);
			list_value = getElement(block, ELEMENT_NODE, "value", ++occ);
			addToJSON(',\n');
		}
		JSON = JSON.slice(0, -2); //remove the last ','
		addToJSON(']\n');
	}

	/*----------------------------------------------*/
	function makeListRepeat(block){
		addToJSON('"type": "list_create_repeat",\n');

		addToJSON('"item": ');
		var item_value = getElement(block, ELEMENT_NODE, "value", 1);
		if (item_value.getAttribute("name") == "NUM"){ //no item provided as first value-> default is null
			addToJSON('{\n')
			makeLogicNull();
			addToJSON('}')
		}else{
			createAllBlocks(item_value);
		}
		addToJSON(',\n')

		addToJSON('"repeat": ');
		var repeat_value = getElement(block, ELEMENT_NODE, "value", 2);
		if (repeat_value === null){ //no first value provided -> second value gets shifted to first
			repeat_value = getElement(block, ELEMENT_NODE, "value", 1);
		}
		createAllBlocks(repeat_value);
	}

	/*----------------------------------------------*/
	function makeListLength(block){
		addToJSON('"type": "property",\n');
		addToJSON('"name": ".length",\n');

		addToJSON('"item": ');
		var item_value = getElement(block, ELEMENT_NODE, "value", 1);
		if (createAllBlocks(item_value) === null){ //no list provided-> default empty list
			addToJSON('{\n');
			addToJSON('"type": "list_create",\n');
			addToJSON('"items": []\n');
			addToJSON('}\n');
		}
	}

	/*----------------------------------------------*/
	function makeListIsEmpty(block){ //list.length == 0
		addToJSON('"type": "logic_expr",\n');
		addToJSON('"op": "EQ",\n');

		addToJSON('"lval": {\n');
			addToJSON('"type": "property",\n');
			addToJSON('"name": ".length",\n');
			addToJSON('"item": ');
			var item_value = getElement(block, ELEMENT_NODE, "value", 1);
			if (createAllBlocks(item_value) === null){ //no list provided -> default is empty list
				addToJSON('{\n');
				addToJSON('"type": "list_create",\n');
				addToJSON('"items": []\n');
				addToJSON('}\n');
			}
		addToJSON('},\n');

		addToJSON('"rval": {\n');
			addToJSON('"type": "number",\n');
			addToJSON('"value": 0\n');
		addToJSON('}\n');

	}

	/*----------------------------------------------*/
	function makeListIndexOf(block){
		addToJSON('"type": "arithm_expr",\n');
		addToJSON('"op": "ADD",\n');

		addToJSON('"lval": {\n');
			addToJSON('"type": "property",\n');
			if (getElement(block, ELEMENT_NODE, "field", 1).childNodes[0].nodeValue == "FIRST"){
				addToJSON('"name": ".indexOf",\n');
			}else{
				addToJSON('"name": ".lastIndexOf",\n');
			}
			addToJSON('"item": ');
			var child_no = 1;
			var item_value = getElement(block, ELEMENT_NODE, "value", child_no);
			if (item_value === null || item_value === undefined || item_value.getAttribute("name") != "VALUE"){ //no list provided -> default is empty list
				addToJSON('{\n');
				addToJSON('"type": "list_create",\n');
				addToJSON('"items": []\n');
				addToJSON('}\n');
			}else{
				createAllBlocks(item_value);
				child_no++;
			}

			addToJSON(',\n');
			addToJSON('"arg": ');
			var arg_value = getElement(block, ELEMENT_NODE, "value", child_no);
			if (createAllBlocks(arg_value) === null){ //no item to search for provided -> default is empty string
				addToJSON('{\n');
				addToJSON('"type": "text_const",\n');
				addToJSON('"value": ""\n');
				addToJSON('}\n');
			}
		addToJSON('},\n');

		addToJSON('"rval": {\n');
			addToJSON('"type": "number",\n');
			addToJSON('"value": 1\n');
		addToJSON('}\n');

	}

	/*----------------------------------------------*/
	function makeListGetIndex(block){ 
		addToJSON('"type": "list_get",\n');

		var mode_value = getElement(block, ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
		addToJSON('"mode": "' + mode_value.toLowerCase() + '",\n');

		var where_value = getElement(block, ELEMENT_NODE, "field", 2).childNodes[0].nodeValue;
		addToJSON('"where": "' + where_value.toLowerCase() + '",\n');

		addToJSON('"list": \n');
		var child_no = 1;
		var item_value = getElement(block, ELEMENT_NODE, "value", child_no);
		if (item_value === null || item_value === undefined || item_value.getAttribute("name") != "VALUE"){ //no list to search in provided -> default is empty list
			addToJSON('{\n');
			addToJSON('"type": "list_create",\n');
			addToJSON('"items": []\n');
			addToJSON('}\n');
		}else{
			createAllBlocks(item_value);
			child_no++;
		}

		if (where_value == "FROM_START" || where_value == "FROM_END"){
			addToJSON(',\n');

			addToJSON('"pos": \n');
			var pos_value = getElement(block, ELEMENT_NODE, "value", child_no);
			if (createAllBlocks(pos_value) === null){ //no item to search for -> default is 0
				addToJSON('{\n');
				addToJSON('"type": "number",\n');
				addToJSON('"value": 0\n');
				addToJSON('}\n');
			}
		}
		
	}


	/*----------------------------------------------*/
	function makeListSetIndex(block){
		var child_no = 1;
		addToJSON('"type": "list_set",\n');

		var mode_value = getElement(block, ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
		addToJSON('"mode": "' + mode_value.toLowerCase() + '",\n');

		var where_value = getElement(block, ELEMENT_NODE, "field", 2).childNodes[0].nodeValue;
		addToJSON('"where": "' + where_value.toLowerCase() + '",\n');

		addToJSON('"list": \n');
			var item_value = getElement(block, ELEMENT_NODE, "value", 1);
			if (item_value === null || item_value === undefined || item_value.getAttribute("name") != "LIST"){ //no list to search in provided -> default is empty list
				addToJSON('{\n');
				addToJSON('"type": "list_create",\n');
				addToJSON('"items": []\n');
				addToJSON('}\n');
			}else{
				createAllBlocks(item_value);
				child_no++;
			}
		addToJSON(',\n');

		if (where_value == "FROM_START" || where_value == "FROM_END"){
			addToJSON('"pos": \n');
			var pos_value = getElement(block, ELEMENT_NODE, "value", child_no);
			if (pos_value === null || pos_value === undefined || pos_value.getAttribute("name") != "AT"){ //no item to search for -> default is 0
				addToJSON('{\n');
				addToJSON('"type": "number",\n');
				addToJSON('"value": 0\n');
				addToJSON('}\n');
			}else{
				createAllBlocks(pos_value);
				child_no++;
			}
			addToJSON(',\n');
		}

		addToJSON('"item": \n');
		var item_value = getElement(block, ELEMENT_NODE, "value", child_no);
		if (item_value === null || item_value === undefined || item_value.getAttribute("name") != "TO"){ //no item to create -> default is null
			addToJSON('{\n');
			makeLogicNull();
			addToJSON('}\n');
		}else{
			createAllBlocks(item_value);
			child_no++;
		}
	}

	/*----------------------------------------------*/
	function makeSublist(block){
		var child_no = 1;
		addToJSON('"type": "list_sublist",\n');

		var where1_value = getElement(block, ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
		addToJSON('"where1": "' + where1_value.toLowerCase() + '",\n');

		var where2_value = getElement(block, ELEMENT_NODE, "field", 2).childNodes[0].nodeValue;
		addToJSON('"where2": "' + where2_value.toLowerCase() + '",\n');

		addToJSON('"list": \n');
		var item_value = getElement(block, ELEMENT_NODE, "value", 1);
		if (item_value === null || item_value === undefined || item_value.getAttribute("name") != "LIST"){ //no list to search in provided -> default is empty list
			addToJSON('{\n');
			addToJSON('"type": "list_create",\n');
			addToJSON('"items": []\n');
			addToJSON('}\n');
		}else{
			createAllBlocks(item_value);
			child_no++;
		}

		if (where1_value != "FIRST"){ //first doesnt require an argument (its 0)
			addToJSON(',\n');
			addToJSON('"pos1": \n');
			var pos_value = getElement(block, ELEMENT_NODE, "value", child_no);
			if (pos_value === null || pos_value === undefined || pos_value.getAttribute("name") != "AT1"){ //no item to search for -> default is 0
				addToJSON('{\n');
				addToJSON('"type": "number",\n');
				addToJSON('"value": 0\n');
				addToJSON('}\n');
			}else{
				createAllBlocks(pos_value);
				child_no++;
			}
		}

		if (where2_value != "LAST"){ //first doesnt require an argument (its the last)
			addToJSON(',\n');
			addToJSON('"pos2": \n');
			var item_value = getElement(block, ELEMENT_NODE, "value", child_no);
			if (item_value === null || item_value === undefined || item_value.getAttribute("name") != "AT2"){ //no item to search for -> default is 0
				addToJSON('{\n');
				addToJSON('"type": "number",\n');
				addToJSON('"value": 1\n');
				addToJSON('}\n');
			}else{
				createAllBlocks(item_value);
				child_no++;
			}
		}
	}

	/*----------------------------------------------*/
	function makeListSplit(block){
		addToJSON('"type": "list_split",\n');

		var mode_value = getElement(block, ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
		addToJSON('"mode": "' + mode_value.toLowerCase() + '",\n');

		addToJSON('"item": ');
		var child_no = 1;
		var item_value = getElement(block, ELEMENT_NODE, "value", 1);
		if (item_value === null || item_value === undefined || item_value.getAttribute("name") == "DELIM"){ 
			if (mode_value == "SPLIT"){ //no text provided-> default empty string
				addToJSON('{\n');
				addToJSON('"type": "text_const",\n');
				addToJSON('"value": ""\n');
				addToJSON('}\n');
			}else{ //no list provided-> default empty list
				addToJSON('{\n');
				addToJSON('"type": "list_create",\n');
				addToJSON('"items": []\n');
				addToJSON('}\n');
			}
		}else{
			createAllBlocks(item_value);
			child_no++;
		}
		addToJSON(',\n');

		addToJSON('"delim": ');
		var delim_value = getElement(block, ELEMENT_NODE, "value", child_no);
		createAllBlocks(delim_value);
	}

	/*----------------------------------------------*/
	function makeColourPicker(block){
		addToJSON('"type": "colour_const",\n');
		var colour = getElement(block, ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
		addToJSON('"value": "' + colour + '"\n');
	}

	/*----------------------------------------------*/
	function makeColourRandom(block){
		addToJSON('"type": "colour_random"\n');
	}

	/*----------------------------------------------*/
	function makeColourRGB(block){
		addToJSON('"type": "colour_rgb",\n');

		var red_value = getElement(block, ELEMENT_NODE, "value", 1)
		addToJSON('"red": ');
		createAllBlocks(red_value)
		addToJSON(',\n');

		var green_value = getElement(block, ELEMENT_NODE, "value", 2)
		addToJSON('"green": ');
		createAllBlocks(green_value)
		addToJSON(',\n');

		var blue_value = getElement(block, ELEMENT_NODE, "value", 3)
		addToJSON('"blue": ');
		createAllBlocks(blue_value)
	}

	/*----------------------------------------------*/
	function makeColourBlend(block){
		addToJSON('"type": "colour_blend",\n');

		var red_value = getElement(block, ELEMENT_NODE, "value", 1)
		addToJSON('"colour1": ');
		createAllBlocks(red_value)
		addToJSON(',\n');

		var green_value = getElement(block, ELEMENT_NODE, "value", 2)
		addToJSON('"colour2": ');
		createAllBlocks(green_value)
		addToJSON(',\n');

		var blue_value = getElement(block, ELEMENT_NODE, "value", 3)
		addToJSON('"ratio": ');
		createAllBlocks(blue_value)
	}

	 /*----------------------------------------------*/
	 function makeVariableSet(block){
		addToJSON('"type": "assign_expr",\n');

		var lvalue = block.getElementsByTagName("field")[0].getAttribute('name');
		var rvalue = block.getElementsByTagName("value")[0].getAttribute('name');
		var rvalue_value = block.getElementsByTagName("value")[0];

		if (lvalue == "VAR"){
		  variable = block.getElementsByTagName("field")[0].childNodes[0].nodeValue;
		  addToJSON('"lval": "' + variable + '",\n');
		}

		if (rvalue == "VALUE"){
		  addToJSON('"rval": ');
		  createAllBlocks(rvalue_value)
		}
	  }

	/*----------------------------------------------*/
	function makeVariableGet(block){
		addToJSON('"type": "var",\n');
		var lvalue = block.getElementsByTagName("field")[0].getAttribute('name');
	
		if (lvalue == "VAR"){
			variable = block.getElementsByTagName("field")[0].childNodes[0].nodeValue;
			//addToJSON(variable);
			addToJSON('"name": "' + variable + '"\n');
		}else{
			console.log("Error in makeVariabelGet")
			exit();
		}
	}

	/*----------------------------------------------*/
	function makeVariableMathChange(block){
		addToJSON('"type": "var_change",\n');
		var var_value = block.getElementsByTagName("field")[0].childNodes[0].nodeValue;
		addToJSON('"var_name": "' + var_value + '",\n');


		addToJSON('"value": \n');
		var change_value = block.getElementsByTagName("value")[0];
		createAllBlocks(change_value);
	}

	/*----------------------------------------------*/
	function makeVoidFunc(block){
		addToJSON('"type": "func_decl",\n');

		addToJSON('"args": [\n');
		var mutation = getElement(block, ELEMENT_NODE, "mutation", 1)
		if (mutation !== null){
			var occ = 1;
			var arg = getElement(mutation, ELEMENT_NODE, "arg", occ++);
			while (arg !== null){
				addToJSON('"' + arg.getAttribute("name") + '",');
				arg = getElement(mutation, ELEMENT_NODE, "arg", occ++);
			}
		}else{
			addToJSON(','); //for consistency. will delete later
		}
		JSON = JSON.slice(0, -1);
		addToJSON('],\n');

		var name = getElement(block, ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
		addToJSON('"name": "' + name + '",\n');

		var statements = getElement(block, ELEMENT_NODE, "statement", 1);

		addToJSON('"do": {\n');
			addToJSON('"type": "stmts",\n');
			addToJSON('"data": [\n');
				createAllBlocks(statements)
			addToJSON(']\n');
		addToJSON('}\n'); //do
	}

	/*----------------------------------------------*/
	function makeReturn(block){
		addToJSON('"type": "if_stmt",\n');

		var child_no = 1;
		var if_value = getElement(block, ELEMENT_NODE, "value", 1)
		addToJSON('"cond": ');
		if (if_value === null || if_value === undefined || if_value.getAttribute("name") != "CONDITION"){ //no condition in the if statement. Default is false
			addToJSON('{\n');
			addToJSON('"type": "bool_const",\n');
			addToJSON('"value": false\n');
			addToJSON('}');
		}else{
			createAllBlocks(if_value);
			child_no++;
		}
		addToJSON(',\n');

		var ret_value = getElement(block, ELEMENT_NODE, "value", child_no);
		addToJSON('"do": {\n');
			addToJSON('"type": "stmts",\n');
			addToJSON('"data": [\n');
				addToJSON('{\n');
					addToJSON('"type": "keyword",\n');
					addToJSON('"name": "return",\n');
					addToJSON('"value": ');
					if (createAllBlocks(ret_value) === null){
						addToJSON('{\n');
						makeLogicNull();
						addToJSON('}\n');
					}
				addToJSON('}\n');
			addToJSON(']\n');
		addToJSON('}\n'); //do
	}


	/*----------------------------------------------*/
	function makeFunc(block){
		addToJSON('"type": "func_decl",\n');

		addToJSON('"args": [\n');
		var mutation = getElement(block, ELEMENT_NODE, "mutation", 1)
		if (mutation !== null){
			var occ = 1;
			var arg = getElement(mutation, ELEMENT_NODE, "arg", occ++);
			while (arg !== null){
				addToJSON('"' + arg.getAttribute("name") + '",');
				arg = getElement(mutation, ELEMENT_NODE, "arg", occ++);
			}
		}else{
			addToJSON(','); //for consistency. will delete later
		}
		JSON = JSON.slice(0, -1);
		addToJSON('],\n');

		var name = getElement(block, ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
		addToJSON('"name": "' + name + '",\n');

		var statements = getElement(block, ELEMENT_NODE, "statement", 1);

		addToJSON('"do": {\n');
			addToJSON('"type": "stmts",\n');
			addToJSON('"data": [\n');
				var return_value = getElement(block, ELEMENT_NODE, "value", 1);
				if (createAllBlocks(statements) !== null && return_value !== null){
					addToJSON(',\n')
				}
				if (return_value !== null){
					addToJSON('{\n');
						addToJSON('"type": "keyword",\n');
						addToJSON('"name": "return",\n');
						addToJSON('"value": ');
						createAllBlocks(return_value);
					addToJSON('}\n');
				}

			addToJSON(']\n');
		addToJSON('}\n'); //do		
	}

	/*----------------------------------------------*/
	function makeVoidFuncCall(block){
		addToJSON('"type": "userfunc_call",\n');

		var funcname = getElement(block, ELEMENT_NODE, "mutation", 1).getAttribute("name");
		addToJSON('"name": "' + funcname + '",\n');
		addToJSON('"args": [ ]\n');
	}

	/*----------------------------------------------*/
	function makeFuncCall(block){
		addToJSON('"type": "userfunc_call",\n');

		var funcname = getElement(block, ELEMENT_NODE, "mutation", 1).getAttribute("name");
		addToJSON('"name": "' + funcname + '",\n');

		addToJSON('"args": [\n');

		var mutation = getElement(block, ELEMENT_NODE, "mutation", 1);
		var arg_len = 1;
		if (mutation !== null){
			while (getElement(mutation, ELEMENT_NODE, "arg", arg_len++) !== null); //find amount of args
			arg_len += -2; //start counting from 0 and remove the extra ++ in the last iteration
		}

		var occ = 0, i=0;
		var arg = getElement(block, ELEMENT_NODE, "value", ++occ);
		while (i < arg_len){
			if (arg !== null && arg.getAttribute("name") == ("ARG" + i.toString())){ //first arg should be ARG0. If we skip an arg make it null
				createAllBlocks(arg);
			}else{
				addToJSON('{\n');
				makeLogicNull();
				addToJSON('}\n');
				occ--;
			}
			arg = getElement(block, ELEMENT_NODE, "value", ++occ);
			i++
			if (i != arg_len)
				addToJSON(',\n');
			else
				addToJSON('\n');
		}

		addToJSON(']\n');
	}


	function getElement(blocks, type, name, occurance=1){
	  if (blocks === undefined || blocks === null)
		return null;

	  var occ = 0;
	  var elements = blocks.childNodes;

	  for (var i = 0; i < elements.length; i++){
		var block = elements[i];
		if (block.nodeType == type && block.nodeName == name){
		  if (++occ == occurance)
			return block
		}
	  }
	  return null;
	}
}