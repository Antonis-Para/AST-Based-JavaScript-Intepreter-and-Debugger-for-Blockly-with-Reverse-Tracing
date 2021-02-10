//Template example

var xmlText = `<xml xmlns="https://developers.google.com/blockly/xml">
<block type="controls_if" id="{2z}?sL?_HKyq|4wHvhT" x="-38" y="63">
  <value name="IF0">
	<block type="logic_boolean" id="d#LF2~keLags0O.NM$6D">
	  <field name="BOOL">TRUE</field>
	</block>
  </value>
  <statement name="DO0">
	<block type="text_print" id="yk13VnE|+uTqQElT@w~F">
	  <value name="TEXT">
		<shadow type="text" id="2p4MJ$*!)kNTeR~w$DO0">
		  <field name="TEXT">abc</field>
		</shadow>
		<block type="math_number" id="{VupbQnS40v%1*ZYAuYx">
		  <field name="NUM">123</field>
		</block>
	  </value>
	  <next>
		<block type="controls_if" id="#~lNfE=/?3m1TA^_+1uH">
		  <value name="IF0">
			<block type="logic_boolean" id="4,+AK)n@$CCFs=qXcd}?">
			  <field name="BOOL">FALSE</field>
			</block>
		  </value>
		  <statement name="DO0">
			<block type="text_print" id="Vse;?em0f+Fl])P3L,$O">
			  <value name="TEXT">
				<shadow type="text" id="bHK}2HF($Ay[ZVj_]0?2">
				  <field name="TEXT">abc</field>
				</shadow>
			  </value>
			  <next>
				<block type="text_print" id=";!G;LZ+i2U;T71~kmPpf">
				  <value name="TEXT">
					<shadow type="text" id=",5+9UY}tYKCT!4C1Ft=%">
					  <field name="TEXT">5</field>
					</shadow>
				  </value>
				</block>
			  </next>
			</block>
		  </statement>
		</block>
	  </next>
	</block>
  </statement>
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
		createAllBlocks(elements);
	addToJSON(']\n');
	
	addToJSON('}\n');
	
	return JSON;
	//-----------------------------------------------//


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
			makeLogicTemary(block);
			break;
		  case "variables_set":
			makeVariableSet(block);
			break;
		  case "controls_repeat_ext":
			makeRepeat(block);
			break;
		  case "variables_get":
			makeVariableGet(block);
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
			makeMathOnList(block); //TODO
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

		//var next_block = getElement(next, ELEMENT_NODE, "block");

		addToJSON(',\n');
		createAllBlocks(next)
		//var next_block = block.getElementsByTagName("next")[0].getElementsByTagName("block")[0];
		// var next_type = next_block.getAttribute('type');

		// addToJSON('{\n');
		// if (next_type == "text_print"){
		//   makeTextPrint(next_block);
		// }
		// addToJSON('}\n');
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

		//nextBlock(do_block);
		addToJSON('}\n'); //do
	  }

	  function makeLogicCompare(block){
		addToJSON('"type": "logic_expr",\n');

		var op = block.getElementsByTagName("field")[0].childNodes[0].nodeValue;
		addToJSON('"op": "' + op + '",\n');

		addToJSON('"lval": ');
		var lval_value = getElement(block, ELEMENT_NODE, "value", 1)
		if (createAllBlocks(lval_value) === null){ //no value provided, default is 0
			addToJSON('{\n');
			addToJSON('"type": "number",\n');
			addToJSON('"value": 0\n');
			addToJSON('}');
		}
		addToJSON(',\n');

		addToJSON('"rval": ');
		var rval_value = getElement(block, ELEMENT_NODE, "value", 2);
		if (createAllBlocks(rval_value) === null){ //no value provided, default is 0
			addToJSON('{\n');
			addToJSON('"type": "number",\n');
			addToJSON('"value": 0\n');
			addToJSON('}\n');
		}
		createAllBlocks(rval_value);
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
	function makeLogicTemary(block){
		addToJSON('"type": "tenary_expr",\n');
		var if_value = getElement(block, ELEMENT_NODE, "value", 1);
		addToJSON('"if": ');
		if (createAllBlocks(if_value) === null){ //no condition in the if statement. Default is false
			addToJSON('{\n');
			addToJSON('"type": "bool_const",\n');
			addToJSON('"value": false\n');
			addToJSON('}');
		}
		addToJSON(',\n');

		addToJSON('"then": ');
		var then_value = getElement(block, ELEMENT_NODE, "value", 2);
		if (createAllBlocks(then_value) === null){
			addToJSON('{\n');
			makeLogicNull()
			addToJSON('}');
		}
		addToJSON(',\n');

		addToJSON('"else": ');
		var else_value = getElement(block, ELEMENT_NODE, "value", 3);
		if (createAllBlocks(else_value) === null){
			addToJSON('{\n');
			makeLogicNull()
			addToJSON('}\n');
		}
	}

	 /*----------------------------------------------------*/
	 function makeRepeat(block){
	  addToJSON('"type": "repeat_stmt",\n');
	  

	  var times_value = block.getElementsByTagName("value")[0];
	  addToJSON('"times": ');
	  createAllBlocks(times_value)
	  addToJSON(',\n');

	  addToJSON('"do": {\n');
	  addToJSON('"type": "stmts",\n');
	  var do_statement = block.getElementsByTagName("statement")[0];
	  
	  addToJSON('"data": [\n');
	  createAllBlocks(do_statement)
	  addToJSON(']\n');
	  addToJSON('}\n'); //do
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
		  //addToJSON(variable);
		  //addToJSON(" = ");
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
	  //addToJSON("\nPrint ");

	  addToJSON('"arg": ');
	  createAllBlocks(print_value);
	  //createValue(print_value)
	}

	 /*----------------------------------------------*/
	 function makeRoot(block){
	  addToJSON('"type": "func_call",\n');
	  addToJSON('"name": "Math.sqrt",\n');

	  var root_value = block.getElementsByTagName("value")[0];
	  //addToJSON("\nPrint ");

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
		
		var searchIn_value = getElement(block, ELEMENT_NODE, "value", 1);
		addToJSON('"item": ');
		createAllBlocks(searchIn_value)
		addToJSON(',\n');
		
		var searchFor_value = getElement(block, ELEMENT_NODE, "value", 2)
		addToJSON('"arg": ');
		createAllBlocks(searchFor_value);
	}
	
	/*----------------------------------------------*/
	function makeTextCharAt(block){
		addToJSON('"type": "property_charAt",\n');

		var where = block.getElementsByTagName("field")[0].childNodes[0].nodeValue;
		addToJSON('"where": "' + where.toLowerCase() +'",\n');
		

		addToJSON('"item": ');
		var inttext_value =  getElement(block, ELEMENT_NODE, "value", 1);
		createAllBlocks(inttext_value);

		var at_value =  getElement(block, ELEMENT_NODE, "value", 2);
		if (at_value !== null){
			addToJSON(',\n');
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
		
		addToJSON('"item": ');
		var item_value =  getElement(block, ELEMENT_NODE, "value", 1);
		createAllBlocks(item_value);
		addToJSON(',\n');

		addToJSON('"arg1": ');
		var arg1_value =  getElement(block, ELEMENT_NODE, "value", 2);
		createAllBlocks(arg1_value);
		addToJSON(',\n');

		addToJSON('"arg2": ');
		var arg2_value =  getElement(block, ELEMENT_NODE, "value", 3);
		createAllBlocks(arg2_value);
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