//Template example
var xmlText = `<xml xmlns="https://developers.google.com/blockly/xml">
<block type="text_print" id="a4UhA}qi]*v+f^@xR|(0" x="113" y="37">
  <value name="TEXT">
    <shadow type="text" id="Y8I@iQlmvh^=z/9sgqS?">
      <field name="TEXT">abc</field>
    </shadow>
    <block type="math_atan2" id="b+vCx$hTgg_vipk=Mxn5">
      <value name="X">
        <shadow type="math_number" id="SR}7aUccCH@j|gear!,Q">
          <field name="NUM">1</field>
        </shadow>
      </value>
      <value name="Y">
        <shadow type="math_number" id="c6:}Jcj,@I5?[52QxvhI">
          <field name="NUM">1</field>
        </shadow>
      </value>
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
	createAllBlocks(elements);

	addToJSON('}\n');
	
	return JSON;
	//-----------------------------------------------//

	function createValue(blocks){
	  var name = blocksExist(blocks)
	  if (name === null){ //no blocks or shadow block exist
		return;
	  }

	  var occ = 1;
	  while ( (block = getElement(blocks, ELEMENT_NODE, name, occ++)) != null ){ //while there are more blocks..
		var type = block.getAttribute('type');

		switch (type){
		  case "logic_boolean":
			makeLogicBoolean(block);
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
		  default:
			console.log("Error in 'createValue'. Case doesn't exist")
			exit();
		}
	  }
	}
	/*----------------------------------------------------*/
	function createAllBlocks(blocks){
	  addToJSON('"data": [\n{\n');
	  var block;

	  var name = blocksExist(blocks)
	  if (name === null){ //no blocks or shadow block exist
		addToJSON('}\n]\n');
		return;
	  }

	  var occ = 1;
	  while ( (block = getElement(blocks, ELEMENT_NODE, name, occ++)) !== null ){ //while there are more blocks..
		var type = block.getAttribute('type');

		switch (type){
		  case "controls_if":
			makeIf(block);
			break;
		  case "variables_set":
			makeVariableSet(block);
			break;
		  case "controls_repeat_ext":
			makeRepeat(block);
			break;
		  case "text_print":
			makeTextPrint(block);
			break;
		  case "": //TODO
			make(block);
			break;
		  case "":
			make(block);
			break;
		  case "":
			make(block);
			break;
		  case "":
			make(block);
			break;

		}

		addToJSON('}'); //data
		nextBlock(block);
	  }

	  addToJSON(']\n'); //data
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
		if (block.getElementsByTagName("next")[0] == undefined){ //if there is no next block
		  addToJSON('\n');
		  return;
		}

		var next = getElement(block, ELEMENT_NODE, "next");

		if (next == null){
		  addToJSON('\n');
		  return;
		}

		var next_block = getElement(next, ELEMENT_NODE, "block");

		addToJSON(',\n');
		//var next_block = block.getElementsByTagName("next")[0].getElementsByTagName("block")[0];
		var next_type = next_block.getAttribute('type');

		addToJSON('{\n');
		if (next_type == "text_print"){
		  makeTextPrint(next_block);
		}
		addToJSON('}\n');
	  }

	  /*----------------------------------------------------*/
	  function makeIf(block){
		addToJSON('"type": "if_stmt",\n');
		addToJSON('"cond": {\n');

		var if_value = block.getElementsByTagName("value")[0];
		createValue(if_value)
		addToJSON('},\n'); //cond


		addToJSON('"do": {\n');
		addToJSON('"type": "stmts",\n');
		
		var do_statement = block.getElementsByTagName("statement")[0];

		createAllBlocks(do_statement)

		//nextBlock(do_block);
		addToJSON('}\n'); //do
	  }

	 /*----------------------------------------------------*/
	 function makeRepeat(block){
	  addToJSON('"type": "repeat_stmt",\n');
	  addToJSON('"times": {\n');

	  var times_value = block.getElementsByTagName("value")[0];
	  createValue(times_value)
	  addToJSON('},\n');
	  

	  addToJSON('"do": {\n');
	  addToJSON('"type": "stmts",\n');
	  var do_statement = block.getElementsByTagName("statement")[0];
	  
	  createAllBlocks(do_statement)
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
		  addToJSON('"rval": {\n');
		  createValue(rvalue_value)
		  addToJSON('}\n');
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
	  function makeLogicBoolean(block){
		addToJSON('"type": "const_bool",\n');
		var field = block.getElementsByTagName("field")[0];
		var field_name = field.getAttribute("name");
		if (field_name == "BOOL"){
		  var val = field.childNodes[0].nodeValue;
		  addToJSON('"value": ' + val + '\n');
		}else{
		  console.log("\nError inside makeLogicBoolean")
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

	  addToJSON('"lval": {\n');
	  var lval_value = getElement(block, ELEMENT_NODE, "value", 1)
	  createValue(lval_value);
	  addToJSON('},\n');

	  addToJSON('"rval": {\n');
	  var rval_value = getElement(block, ELEMENT_NODE, "value", 2)
	  createValue(rval_value);
	  addToJSON('}\n');
	}

	 /*----------------------------------------------*/
	function makeTextPrint(block){
	  addToJSON('"type": "func_call",\n');
	  addToJSON('"name": "alert",\n');

	  var print_value = block.getElementsByTagName("value")[0];
	  //addToJSON("\nPrint ");

	  addToJSON('"arg": {\n');
	  createValue(print_value)
	  addToJSON('}\n');
	}

	 /*----------------------------------------------*/
	 function makeRoot(block){
	  addToJSON('"type": "func_call",\n');
	  addToJSON('"name": "Math.sqrt",\n');

	  var root_value = block.getElementsByTagName("value")[0];
	  //addToJSON("\nPrint ");

	  addToJSON('"arg": {\n');
	  createValue(root_value)
	  addToJSON('}\n');
	}

	 /*----------------------------------------------*/
	 function makeMathTrig(block){
	  addToJSON('"type": "func_call",\n');

	  var func = block.getElementsByTagName("field")[0].childNodes[0].nodeValue;
	  addToJSON('"name": "Math.' + func.toLowerCase() +'",\n');

	  var trig_value = block.getElementsByTagName("value")[0];

	  addToJSON('"arg": {\n');
	  createValue(trig_value)
	  addToJSON('}\n');
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
	  addToJSON('"property": "' + property + '"\n');

	  var num_value = block.getElementsByTagName("value")[0];
	  addToJSON('"value": {\n');
	  createValue(num_value)
	  addToJSON('}\n');
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

	  addToJSON('"arg": {\n');
	  createValue(round_value)
	  addToJSON('}\n');
	}

	 /*----------------------------------------------*/
	 function makeMathModulo(block){
	  addToJSON('"type": "arithm_expr",\n');

	  addToJSON('"op": "MOD",\n');

	  addToJSON('"lval": {\n');
	  var lval_value = getElement(block, ELEMENT_NODE, "value", 1)
	  createValue(lval_value);
	  addToJSON('},\n');

	  addToJSON('"rval": {\n');
	  var rval_value = getElement(block, ELEMENT_NODE, "value", 2)
	  createValue(rval_value);
	  addToJSON('}\n');
	}

	 /*----------------------------------------------*/
	 function makeMathConstrain(block){
	   //will look like: Math.min(Math.max(num1, num2), num3)
	  addToJSON('"type": "math_constraint",\n');

	  addToJSON('"value": {\n');
	  var constraint_value = block.getElementsByTagName("value")[0];
	  createValue(constraint_value)
	  addToJSON('},\n');

	  addToJSON('"low": {\n');
	  constraint_value = block.getElementsByTagName("value")[1];
	  createValue(constraint_value)
	  addToJSON('},\n');

	  addToJSON('"high": {\n');
	  constraint_value = block.getElementsByTagName("value")[2];
	  createValue(constraint_value)
	  addToJSON('}\n');

	  /*addToJSON('"type": "func_call",\n');
	  addToJSON('"name": "Math.min",\n');


	  addToJSON('"arg1": {\n'); //arg1 of min
	  addToJSON('"type": "func_call",\n');
	  addToJSON('"name": "Math.max",\n');

	  addToJSON('"arg1": {\n'); //arg1 of max
	  var constraint_value = block.getElementsByTagName("value")[0];
	  createValue(constraint_value)
	  addToJSON('},\n');

	  addToJSON('"arg2": {\n'); //arg2 of max
	  constraint_value = block.getElementsByTagName("value")[1];
	  createValue(constraint_value)
	  addToJSON('}\n');
	  addToJSON('},\n'); //max is done

	  addToJSON('"arg2": {\n'); //arg2 of min
	  constraint_value = block.getElementsByTagName("value")[2];
	  createValue(constraint_value)
	  addToJSON('}\n');*/
	}

	 /*----------------------------------------------*/
	 function makeMathRandomInt(block){
	  addToJSON('"type": "math_rand_int",\n');

	  addToJSON('"from": {\n');
	  var random_value = block.getElementsByTagName("value")[0];
	  createValue(random_value)
	  addToJSON('},\n');

	  addToJSON('"to": {\n');
	  random_value = block.getElementsByTagName("value")[1];
	  createValue(random_value)
	  addToJSON('}\n');
	}

	 /*----------------------------------------------*/
	 function makeMathRandomFloat(block){
	  addToJSON('"type": "func_call",\n');
	  addToJSON('"name": "Math.random"\n');
	}

	 /*----------------------------------------------*/
	 function makeMathAtan2(block){
	  addToJSON('"type": "func_atan2",\n');

	  var x_value = block.getElementsByTagName("value")[0];
	  addToJSON('"x": {\n');
	  createValue(x_value)
	  addToJSON('},\n');

	  var y_value = block.getElementsByTagName("value")[1];
	  addToJSON('"y": {\n');
	  createValue(y_value)
	  addToJSON('}\n');
	}

	function getElement(blocks, type, name, occurance=1){
	  if (blocks === undefined)
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