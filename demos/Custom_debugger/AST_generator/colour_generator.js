import {Blockly_gen, AST_dispatch} from './AST_Init.js';

/*----------------------------------------------*/
AST_dispatch["colour_picker"] = function(block) {
    Blockly_gen.addToJSON('"type": "colour_const",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');
    var colour = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
    Blockly_gen.addToJSON('"value": "' + colour + '"\n');
}

/*----------------------------------------------*/
AST_dispatch["colour_random"] = function(block) {
    Blockly_gen.addToJSON('"type": "libfunc_call",\n');
    Blockly_gen.addToJSON('"name": "colourRandom",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '"\n');
}

/*----------------------------------------------*/
AST_dispatch["colour_rgb"] = function(block) {
    Blockly_gen.addToJSON('"type": "libfunc_call",\n');
    Blockly_gen.addToJSON('"name": "colour_invoke",\n');
    Blockly_gen.addToJSON('"param": "colourRGB",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');

    Blockly_gen.addToJSON('"args": [\n');
        var red_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1)
        Blockly_gen.createAllBlocks(red_value)
        Blockly_gen.addToJSON(',\n');

        var green_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 2)
        Blockly_gen.createAllBlocks(green_value)
        Blockly_gen.addToJSON(',\n');

        var blue_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 3)
        Blockly_gen.createAllBlocks(blue_value)
    Blockly_gen.addToJSON(']');
}

/*----------------------------------------------*/
AST_dispatch["colour_blend"] = function(block) {
    Blockly_gen.addToJSON('"type": "libfunc_call",\n');
    Blockly_gen.addToJSON('"name": "colour_invoke",\n');
    Blockly_gen.addToJSON('"param": "colourBlend",\n');
	Blockly_gen.addToJSON('"id": "' + block.getAttribute("id") + '",\n');

    Blockly_gen.addToJSON('"args": [\n');
        var red_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1)
        Blockly_gen.createAllBlocks(red_value)
        Blockly_gen.addToJSON(',\n');

        var green_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 2)
        Blockly_gen.createAllBlocks(green_value)
        Blockly_gen.addToJSON(',\n');

        var blue_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 3)
        Blockly_gen.createAllBlocks(blue_value)
    Blockly_gen.addToJSON(']\n');
}