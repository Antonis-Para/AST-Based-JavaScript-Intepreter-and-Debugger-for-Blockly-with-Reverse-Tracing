global.DOMParser = require('xmldom').DOMParser;

global.Blockly = require('./blockly_uncompressed.js');
require('./blocks_compressed.js');
require('./javascript_compressed.js');
require('./msg/messages.js');

var fs = require('fs');
const { exit } = require('process');

const ELEMENT_NODE = 1;

//var xmlText = process.argv[2];

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

var xmlText3 = `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="controls_repeat_ext" id="HI}9JtnDr@Y)l.531z+" x="113" y="38">
    <value name="TIMES">
      <shadow type="math_number" id="lze(yw$Qp_0v5Y0k[-}@">
        <field name="NUM">10</field>
      </shadow>
      <block type="math_number" id="TX=YGl4nXBOOWrAZWud">
        <field name="NUM">123</field>
      </block>
    </value>
    <statement name="DO">
      <block type="text_print" id="4qr$m6JKqiIWF4cd%D3">
        <value name="TEXT">
          <shadow type="text" id="PC8e++,evd]IP1HxBp))">
            <field name="TEXT">abc</field>
          </shadow>
          <block type="variables_get" id=")aogRd,8_)!mN+t8u*Nk">
            <field name="VAR" id="l^?@nI?$rm_LAn~Nh,~{">x</field>
          </block>
        </value>
      </block>
    </statement>
  </block>
</xml>`

var xmlText2 = `<xml xmlns="https://developers.google.com/blockly/xml">
<variables>
  <variable id="=WC#,Wt~]whuQxnKGHQ.">x</variable>
</variables>
<block type="controls_if" id="=tr,K^c9,f^RiazP}nt/" x="88" y="38">
  <value name="IF0">
    <block type="logic_boolean" id="SU,(m:(M]:)N9WbxY:E-">
      <field name="BOOL">TRUE</field>
    </block>
  </value>
  <statement name="DO0">
    <block type="variables_set" id="E?E{Bjl6*}Ks}^Znw13Y">
      <field name="VAR" id="=WC#,Wt~]whuQxnKGHQ.">x</field>
      <value name="VALUE">
        <block type="math_number" id="w#3#HIBS.Wst]3.X$,ki">
          <field name="NUM">123</field>
        </block>
      </value>
      <next>
        <block type="text_print" id="9#00BC0+r47%4BKDS+EK">
          <value name="TEXT">
            <shadow type="text" id="$5wmwolmyUg|Zla2^W~D">
              <field name="TEXT">abc</field>
            </shadow>
            <block type="variables_get" id="PRe](Y+DL]NkXTW7F#iR">
              <field name="VAR" id="=WC#,Wt~]whuQxnKGHQ.">x</field>
            </block>
          </value>
        </block>
      </next>
    </block>
  </statement>
</block>
</xml>`;

try {
  var xml = Blockly.Xml.textToDom(xmlText);
  // Create a headless workspace.
  var workspace = new Blockly.Workspace();
  Blockly.Events.disable();
  Blockly.Xml.domToWorkspace(xml, workspace);
  var code = Blockly.JavaScript.workspaceToCode(workspace);

  parser = new DOMParser();
  xmlDoc = parser.parseFromString(xmlText, "text/xml");
  
  main()

//--------------------MAIN-----------------------//
function main(){
  process.stdout.write("{\n");
  process.stdout.write('"type": "stmts",\n');
  

  var elements = xmlDoc.childNodes[0];
  createAllBlocks(elements);

  process.stdout.write('}\n'); 
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
  process.stdout.write('"data": [\n{\n');
  var block;

  var name = blocksExist(blocks)
  if (name === null){ //no blocks or shadow block exist
    process.stdout.write('}\n]\n');
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

    process.stdout.write('}'); //data
    nextBlock(block);
  }

  process.stdout.write(']\n'); //data
}

/*----------------------------------------------------*/
  function nextBlock(block){ 
    if (block.getElementsByTagName("next")[0] == undefined){ //if there is no next block
      process.stdout.write('\n');
      return;
    }

    var next = getElement(block, ELEMENT_NODE, "next");

    if (next == null){
      process.stdout.write('\n');
      return;
    }

    var next_block = getElement(next, ELEMENT_NODE, "block");

    process.stdout.write(',\n');
    //var next_block = block.getElementsByTagName("next")[0].getElementsByTagName("block")[0];
    var next_type = next_block.getAttribute('type');

    process.stdout.write('{\n');
    if (next_type == "text_print"){
      makeTextPrint(next_block);
    }
    process.stdout.write('}\n');
  }

  /*----------------------------------------------------*/
  function makeIf(block){
    process.stdout.write('"type": "if_stmt",\n');
    process.stdout.write('"cond": {\n');

    var if_value = block.getElementsByTagName("value")[0];
    createValue(if_value)
    process.stdout.write('},\n'); //cond


    process.stdout.write('"do": {\n');
    process.stdout.write('"type": "stmts",\n');
    
    var do_statement = block.getElementsByTagName("statement")[0];

    createAllBlocks(do_statement)

    //nextBlock(do_block);
    process.stdout.write('}\n'); //do
  }

 /*----------------------------------------------------*/
 function makeRepeat(block){
  process.stdout.write('"type": "repeat_stmt",\n');
  process.stdout.write('"times": {\n');

  var times_value = block.getElementsByTagName("value")[0];
  createValue(times_value)
  process.stdout.write('},\n');
  

  process.stdout.write('"do": {\n');
  process.stdout.write('"type": "stmts",\n');
  var do_statement = block.getElementsByTagName("statement")[0];
  
  createAllBlocks(do_statement)
  process.stdout.write('}\n'); //do
}

  /*----------------------------------------------*/
  function makeVariableSet(block){
    process.stdout.write('"type": "assign_expr",\n');

    var lvalue = block.getElementsByTagName("field")[0].getAttribute('name');
    var rvalue = block.getElementsByTagName("value")[0].getAttribute('name');
    var rvalue_value = block.getElementsByTagName("value")[0];

    if (lvalue == "VAR"){
      variable = block.getElementsByTagName("field")[0].childNodes[0].nodeValue;
      process.stdout.write('"lval": "' + variable + '",\n');
      //process.stdout.write(variable);
      //process.stdout.write(" = ");
    }

    if (rvalue == "VALUE"){
      process.stdout.write('"rval": {\n');
      createValue(rvalue_value)
      process.stdout.write('}\n');
    }
  }

    /*----------------------------------------------*/
    function makeVariableGet(block){
      process.stdout.write('"type": "var",\n');
      var lvalue = block.getElementsByTagName("field")[0].getAttribute('name');
  
      if (lvalue == "VAR"){
        variable = block.getElementsByTagName("field")[0].childNodes[0].nodeValue;
        //process.stdout.write(variable);
        process.stdout.write('"name": "' + variable + '"\n');
      }else{
        console.log("Error in makeVariabelGet")
        exit();
      }
    }

/*----------------------------------------------*/
  function makeLogicBoolean(block){
    process.stdout.write('"type": "const_bool",\n');
    var field = block.getElementsByTagName("field")[0];
    var field_name = field.getAttribute("name");
    if (field_name == "BOOL"){
      var val = field.childNodes[0].nodeValue;
      process.stdout.write('"value": ' + val + '\n');
    }else{
      console.log("\nError inside makeLogicBoolean")
      exit();
    }
  }


 /*----------------------------------------------*/
function makeMathNumber(block){
  var num_name = block.getElementsByTagName("field")[0].getAttribute('name');
  process.stdout.write('"type": "number",\n');

  if (num_name == "NUM"){
    var num = block.getElementsByTagName("field")[0].childNodes[0].nodeValue;
    process.stdout.write('"value": ' + num + '\n');
  }
}

 /*----------------------------------------------*/
 function makeMathArithmetic(block){
  process.stdout.write('"type": "arithm_expr",\n');

  var operation = block.getElementsByTagName("field")[0].childNodes[0].nodeValue;
  process.stdout.write('"op": "' + operation + '",\n');

  process.stdout.write('"lval": {\n');
  var lval_value = getElement(block, ELEMENT_NODE, "value", 1)
  createValue(lval_value);
  process.stdout.write('},\n');

  process.stdout.write('"rval": {\n');
  var rval_value = getElement(block, ELEMENT_NODE, "value", 2)
  createValue(rval_value);
  process.stdout.write('}\n');
}

 /*----------------------------------------------*/
function makeTextPrint(block){
  process.stdout.write('"type": "func_call",\n');
  process.stdout.write('"name": "alert",\n');

  var print_value = block.getElementsByTagName("value")[0];
  //process.stdout.write("\nPrint ");

  process.stdout.write('"arg": {\n');
  createValue(print_value)
  process.stdout.write('}\n');
}

 /*----------------------------------------------*/
 function makeRoot(block){
  process.stdout.write('"type": "func_call",\n');
  process.stdout.write('"name": "Math.sqrt",\n');

  var root_value = block.getElementsByTagName("value")[0];
  //process.stdout.write("\nPrint ");

  process.stdout.write('"arg": {\n');
  createValue(root_value)
  process.stdout.write('}\n');
}

 /*----------------------------------------------*/
 function makeMathTrig(block){
  process.stdout.write('"type": "func_call",\n');

  var func = block.getElementsByTagName("field")[0].childNodes[0].nodeValue;
  process.stdout.write('"name": "Math.' + func.toLowerCase() +'",\n');

  var trig_value = block.getElementsByTagName("value")[0];

  process.stdout.write('"arg": {\n');
  createValue(trig_value)
  process.stdout.write('}\n');
}

 /*----------------------------------------------*/
 function makeMathConst(block){
  var constant = block.getElementsByTagName("field")[0].childNodes[0].nodeValue;
  process.stdout.write('"type": "math_const",\n');
  process.stdout.write('"value": "' + constant + '"\n');
}

 /*----------------------------------------------*/
 function makeMathNumberProperty(block){
  process.stdout.write('"type": "math_property",\n');

  var property = block.getElementsByTagName("field")[0].childNodes[0].nodeValue;
  process.stdout.write('"property": "' + property + '"\n');

  var num_value = block.getElementsByTagName("value")[0];
  process.stdout.write('"value": {\n');
  createValue(num_value)
  process.stdout.write('}\n');
}

 /*----------------------------------------------*/
 function makeMathRound(block){
  process.stdout.write('"type": "func_call",\n');

  var func = block.getElementsByTagName("field")[0].childNodes[0].nodeValue;
  if (func == "ROUNDUP"){
    process.stdout.write('"name": "Math.ceil",\n');
  }else if (func == "ROUNDDOWN"){
    process.stdout.write('"name": "Math.floor",\n');
  }else if (func == "ROUND"){
    process.stdout.write('"name": "Math.round",\n');
  }

  var round_value = block.getElementsByTagName("value")[0];

  process.stdout.write('"arg": {\n');
  createValue(round_value)
  process.stdout.write('}\n');
}

 /*----------------------------------------------*/
 function makeMathModulo(block){
  process.stdout.write('"type": "arithm_expr",\n');

  process.stdout.write('"op": "MOD",\n');

  process.stdout.write('"lval": {\n');
  var lval_value = getElement(block, ELEMENT_NODE, "value", 1)
  createValue(lval_value);
  process.stdout.write('},\n');

  process.stdout.write('"rval": {\n');
  var rval_value = getElement(block, ELEMENT_NODE, "value", 2)
  createValue(rval_value);
  process.stdout.write('}\n');
}

 /*----------------------------------------------*/
 function makeMathConstrain(block){
   //will look like: Math.min(Math.max(num1, num2), num3)
  process.stdout.write('"type": "math_constraint",\n');

  process.stdout.write('"value": {\n');
  var constraint_value = block.getElementsByTagName("value")[0];
  createValue(constraint_value)
  process.stdout.write('},\n');

  process.stdout.write('"low": {\n');
  constraint_value = block.getElementsByTagName("value")[1];
  createValue(constraint_value)
  process.stdout.write('},\n');

  process.stdout.write('"high": {\n');
  constraint_value = block.getElementsByTagName("value")[2];
  createValue(constraint_value)
  process.stdout.write('}\n');

  /*process.stdout.write('"type": "func_call",\n');
  process.stdout.write('"name": "Math.min",\n');


  process.stdout.write('"arg1": {\n'); //arg1 of min
  process.stdout.write('"type": "func_call",\n');
  process.stdout.write('"name": "Math.max",\n');

  process.stdout.write('"arg1": {\n'); //arg1 of max
  var constraint_value = block.getElementsByTagName("value")[0];
  createValue(constraint_value)
  process.stdout.write('},\n');

  process.stdout.write('"arg2": {\n'); //arg2 of max
  constraint_value = block.getElementsByTagName("value")[1];
  createValue(constraint_value)
  process.stdout.write('}\n');
  process.stdout.write('},\n'); //max is done

  process.stdout.write('"arg2": {\n'); //arg2 of min
  constraint_value = block.getElementsByTagName("value")[2];
  createValue(constraint_value)
  process.stdout.write('}\n');*/
}

 /*----------------------------------------------*/
 function makeMathRandomInt(block){
  process.stdout.write('"type": "math_rand_int",\n');

  process.stdout.write('"from": {\n');
  var random_value = block.getElementsByTagName("value")[0];
  createValue(random_value)
  process.stdout.write('},\n');

  process.stdout.write('"to": {\n');
  random_value = block.getElementsByTagName("value")[1];
  createValue(random_value)
  process.stdout.write('}\n');
}

 /*----------------------------------------------*/
 function makeMathRandomFloat(block){
  process.stdout.write('"type": "func_call",\n');
  process.stdout.write('"name": "Math.random"\n');
}

 /*----------------------------------------------*/
 function makeMathAtan2(block){
  process.stdout.write('"type": "func_atan2",\n');

  var x_value = block.getElementsByTagName("value")[0];
  process.stdout.write('"x": {\n');
  createValue(x_value)
  process.stdout.write('},\n');

  var y_value = block.getElementsByTagName("value")[1];
  process.stdout.write('"y": {\n');
  createValue(y_value)
  process.stdout.write('}\n');
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









  block_value = xmlDoc.getElementsByTagName("block")[0].getElementsByTagName("value")[0].getElementsByTagName("block")[0].getElementsByTagName("field")[0].childNodes[0].nodeValue;
  //console.log(block_value)

  //NOW RUN THE CODE
  //eval(code);
  //var myInterpreter = new Interpreter(code);
  //myInterpreter.run();
	
} catch (e) {
    console.log(e);
}