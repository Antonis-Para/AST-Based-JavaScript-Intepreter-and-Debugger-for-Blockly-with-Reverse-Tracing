JSON = ""

AST_dispatch = []

function addToJSON(str) {
    JSON += str;
}

function getJSON(str) {
    return JSON;
}

function JSONremoveChars(amount) {
    JSON = JSON.slice(0, -amount);
}

const ELEMENT_NODE = 1;

var fs = require('fs');
const {
    exit
} = require('process');


function createAllVariables(blocks) {
    var variables = getElement(blocks, Blockly_gen.ELEMENT_NODE, "variables", 1);
    if (variables === null) return;

    var occ = 1;
    var variable = getElement(variables, Blockly_gen.ELEMENT_NODE, "variable", occ++);
    while (variable !== null) {
        if (variable.childNodes.length != 0) {
            Blockly_gen.addToJSON("{\n")
            Blockly_gen.addToJSON('"type": "var_decl",\n');
            Blockly_gen.addToJSON('"name": "' + variable.childNodes[0].nodeValue + '"\n');
            Blockly_gen.addToJSON("},\n")
        }
        variable = getElement(variables, Blockly_gen.ELEMENT_NODE, "variable", occ++);
    }
}

/*----------------------------------------------------*/
function createAllBlocks(blocks) {
    var name = blocksExist(blocks)
    if (name === null) //no blocks or shadow block exist
        return null;

    var block, occ = 1;
    block = getElement(blocks, Blockly_gen.ELEMENT_NODE, name, occ++);
    while (block !== null) { //while there are more blocks..
        Blockly_gen.addToJSON("{\n")

        var type = block.getAttribute('type');
        Blockly_gen.AST_dispatch[type](block); //

        Blockly_gen.addToJSON('}'); //data
        nextBlock(block);
        block = getElement(blocks, Blockly_gen.ELEMENT_NODE, name, occ++)
        if (block !== null) {
            Blockly_gen.addToJSON(',\n');
        }
    }
}


/*----------------------------------------------------*/
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

/*----------------------------------------------------*/
function nextBlock(block) {
    var next = getElement(block, Blockly_gen.ELEMENT_NODE, "next");

    if (next == null) {
        Blockly_gen.addToJSON('\n');
        return;
    }

    Blockly_gen.addToJSON(',\n');
    createAllBlocks(next)
}

/*----------------------------------------------------*/
function getElement(blocks, type, name, occurance = 1) {
    if (blocks === undefined || blocks === null)
        return null;

    var occ = 0;
    var elements = blocks.childNodes;

    for (var i = 0; i < elements.length; i++) {
        var block = elements[i];
        if (block.nodeType == type && block.nodeName == name) {
            if (++occ == occurance)
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
    JSONremoveChars
}