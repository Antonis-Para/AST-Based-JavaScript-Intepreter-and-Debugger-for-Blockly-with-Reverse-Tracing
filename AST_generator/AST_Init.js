text = ""

AST_dispatch = []

function addToJSON(str) {
    text += str;
}

function getJSON(str) {
    return text;
}

function JSONremoveChars(amount) {
    text = text.slice(0, -amount);
}

const ELEMENT_NODE = 1;

var fs = require('fs');
const {
    exit
} = require('process');


var LibraryFuncs = {
    "list_methods":{
        "getIndex_fromEnd"          : (args) => args[0].slice(-args[1])[0] ,
        "popIndex_fromStart"        : (args) => args[0].splice(args[1]-1, 1)[0],
        "popIndex_first"            : (args) => args[0].shift(),
        "popIndex_fromEnd"          : (args) => args[0].splice(-args[1], 1)[0],
        "popIndex_last"             : (args) => args[0].pop(),
        "set_from_start"            : (args) => (args[0])[args[1] - 1] = args[2],
        "set_from_end"              : (args) => (args[0])[args[0].length - args[1]] = args[2],
        "set_first"                 : (args) => (args[0])[0] = args[1],
        "set_last"                  : (args) => (args[0])[args[0].length - 1] = args[1],
        "set_random"                : (args) => (args[0])[Math.floor(Math.random() * args[0].length)] = args[1],
        "insert_from_start"         : (args) => args[0].splice(args[1] - 1, 0, args[2]),
        "insert_from_end"           : (args) => args[0].splice(args[0].length - args[1], 0, args[2]),
        "insert_first"              : (args) => args[0].unshift(args[1]),
        "insert_last"               : (args) => args[0].push(args[1]),
        "insert_random"             : (args) => args[0].splice(Math.floor(Math.random() * args[0].length), 0, args[1]),
        "get_from_start_from_start" : (args) => args[0].slice(args[1] - 1, args[2]),
        "get_from_start_from_end"   : (args) => args[0].slice(args[1] - 1, args[0].length - args[2] - 1),
        "get_from_start_last"       : (args) => args[0].slice(args[1] - 1, args[0].length1),
        "get_from_end_from_start"   : (args) => args[0].slice(args[0].length - args[1], args[2]),
        "get_from_end_from_end"     : (args) => args[0].slice(args[0].length - args[1], args[0].length - args[2] - 1),
        "get_from_end_last"         : (args) => args[0].slice(args[0].length - args[1], args[0].length),
        "get_first_from_start"      : (args) => args[0].slice(0, args[1]),
        "get_first_from_end"        : (args) => args[0].slice(0, args[0].length - args[1] - 1),
        "get_first_last"            : (args) => args[0].slice(0),
        "split"                     : (args) => args[0].split(args[1]),
        "join"                      : (args) => args[0].join(args[1]),
        "random" : function (args) {
            function listsGetRandomItem(list, remove) {
                var x = Math.floor(Math.random() * list.length);
                if (remove) {
                  return list.splice(x, 1)[0];
                } else {
                  return list[x];
                }
            }    
    
            var list_arg = args[0];  
            var remove = args[1];
    
            return listsGetRandomItem(list_arg, remove);
        },
        "repeat" : function (args) {
            function listsRepeat(value, n) {
                var array = [];
                for (var i = 0; i < n; i++) {
                  array[i] = value;
                }
                return array;
            }      
    
            var list_arg = args[0];  
            var list_val = args[1];
    
            return listsRepeat(list_arg, list_val);
        },
        "sort" : function (args) {
            function listsGetSortCompare(type, direction) {
                var compareFuncs = {
                  "NUMERIC": function(a, b) {
                      return Number(a) - Number(b); },
                  "TEXT": function(a, b) {
                      return a.toString() > b.toString() ? 1 : -1; },
                  "IGNORE_CASE": function(a, b) {
                      return a.toString().toLowerCase() > b.toString().toLowerCase() ? 1 : -1; },
                };
                var compare = compareFuncs[type];
                return function(a, b) { return compare(a, b) * direction; }
              }
              var list = args[0]
              var sort_type = args[1];
              var direction = args[2];
              
              list.slice().sort(listsGetSortCompare(sort_type, direction));
        }
    },

    "list_invoke": function (args){
        var methodName = args[0];
        var methodArgs = args.slice(1);
        return this.list_methods[methodName](methodArgs);
    },


    "textToTitleCase" : function (args) {
        function textToTitleCase(str) {
            return str.replace(/\S+/g,
                function(txt) {return txt[0].toUpperCase() + txt.substring(1).toLowerCase();});
        }

        var str = args[0];
        return textToTitleCase(str);
    },

    "textRandomLetter" : function (args) {
        function textRandomLetter(text) {
            var x = Math.floor(Math.random() * text.length);
            return text[x];
          }

        var str = args[0];
        return textRandomLetter(str);
    }


}

/* --------------------------------------------------------------------------------
	Will create all the variable declarations that are inside the <variables> tag.
	Assumes that the tag is in the outer blocks
-----------------------------------------------------------------------------------*/	
function createAllVariables(blocks) {
    var variables = getElement(blocks, Blockly_gen.ELEMENT_NODE, "variables", 1);
    if (variables === null) return;

    var occ = 1;
    var variable = getElement(variables, Blockly_gen.ELEMENT_NODE, "variable", occ++);
    while (variable !== null) {
        if (variable.childNodes.length != 0) {
            Blockly_gen.addToJSON("{\n")
            Blockly_gen.addToJSON('"type": "var_decl",\n');
			Blockly_gen.addToJSON('"id": "' + variable.getAttribute("id") + '",\n');
            Blockly_gen.addToJSON('"name": "' + variable.childNodes[0].nodeValue + '"\n');
            Blockly_gen.addToJSON("},\n")
        }
        variable = getElement(variables, Blockly_gen.ELEMENT_NODE, "variable", occ++);
    }
}

/* -----------------------------------------------------------------------------
	Will create all the blocks recursively. Nested blocks will also be created.
	Calls a dispatch table
--------------------------------------------------------------------------------*/
function createAllBlocks(blocks) {
    var name = blocksExist(blocks)
    if (name === null) //no blocks or shadow block exist
        return null;

    var block, occ = 1;
    block = getElement(blocks, Blockly_gen.ELEMENT_NODE, name, occ++);
    while (block !== null) { //while there are more blocks..
        Blockly_gen.addToJSON("{\n")

        var type = block.getAttribute('type');
		try {
        Blockly_gen.AST_dispatch[type](block); // Dispatch
		}catch(e){
			console.log("Error with type " + type)
			console.log("-------------------------------")
			console.log(e)
			exit()
		}

        Blockly_gen.addToJSON('}'); //data
        nextBlock(block);
        block = getElement(blocks, Blockly_gen.ELEMENT_NODE, name, occ++)
        if (block !== null) {
            Blockly_gen.addToJSON(',\n');
        }
    }
}


/* ------------------------------------------------------------------------------
	Checks if a block or shadow block exists within the sub-block named 'blocks'
---------------------------------------------------------------------------------*/
function blocksExist(blocks) {
    var block = getElement(blocks, Blockly_gen.ELEMENT_NODE, "block", 1);
    var name = "block"

    if (block === null) { //if there aren't any blocks, check for shadow blocks
        name = "shadow"
        block = getElement(blocks, Blockly_gen.ELEMENT_NODE, "shadow", 1);
        if (block === null) { //no blocks or shadow blocks == 0 statements inside
            return null;
        }
    }
    return name;
}

/* ------------------------------------------------------------------------------
	Blockly keeps the blocks connected to a previous block inside a <next> TAG.
	This function will check if such a block exist and will create it.
	Assums that there is at MOST one <next> tag in every block	
---------------------------------------------------------------------------------*/
function nextBlock(block) {
    var next = getElement(block, Blockly_gen.ELEMENT_NODE, "next");

    if (next == null) {
        Blockly_gen.addToJSON('\n');
        return;
    }

    Blockly_gen.addToJSON(',\n');
    createAllBlocks(next)
}

/* ------------------------------------------------------------------------------
	Will search for a spesific 'type' of tag, with a 'name' inside the 'blocks'.
	If there are multiple children inside a tag that match these properties,
	the child after 'child_no'. ELEMENT_NODE contains the id of the 'Element
	It searches ONLY in the fist level of children
	
	Ex. <block>
			<value name="A"> ... </value>
				<value name="A.A"> ... </value>
			<value name="B"> ... </value>
			<value name="C"> ... </value>
		</block>
		
		value = getElement(blocks, ELEMENT_NODE, "value", 2)
		value will have name == "B"
---------------------------------------------------------------------------------*/
function getElement(blocks, type, name, child_no = 1) {
    if (blocks === undefined || blocks === null)
        return null;

    var occ = 0;
    var elements = blocks.childNodes;

    for (var i = 0; i < elements.length; i++) {
        var block = elements[i];
        if (block.nodeType == type && block.nodeName == name) {
            if (++occ == child_no)
                return block
        }
    }
    return null;
}

module.exports = {
    AST_dispatch,
    addToJSON,
    ELEMENT_NODE,
    createAllVariables,
    createAllBlocks,
    getElement,
    getJSON,
    JSONremoveChars,
    LibraryFuncs
}