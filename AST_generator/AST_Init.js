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

    if (next === null) {
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
}