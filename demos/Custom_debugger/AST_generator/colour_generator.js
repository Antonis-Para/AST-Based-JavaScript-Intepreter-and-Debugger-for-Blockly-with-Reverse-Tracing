import {Blockly_gen, AST_dispatch} from './AST_Init.js';

/*----------------------------------------------*/
AST_dispatch.install("colour_picker", function(block) {
    Blockly_gen.GetJsonText().add('"type": "colour_const",\n');
	Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');
    var colour = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
    Blockly_gen.GetJsonText().add('"value": "' + colour + '"\n');
})

/*----------------------------------------------*/
AST_dispatch.install("colour_random", function(block) {
    Blockly_gen.GetJsonText().add('"type": "libfunc_call",\n');
    Blockly_gen.GetJsonText().add('"name": "colourRandom",\n');
	Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '"\n');
})

/*----------------------------------------------*/
AST_dispatch.install("colour_rgb", function(block) {
    Blockly_gen.GetJsonText().add('"type": "libfunc_call",\n'); 
    Blockly_gen.GetJsonText().add('"name": "colour_invoke",\n');
    Blockly_gen.GetJsonText().add('"param": "colourRGB",\n');
	Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');

    Blockly_gen.GetJsonText().add('"args": [\n');
        var red_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1)
        Blockly_gen.createAllBlocks(red_value)
        Blockly_gen.GetJsonText().add(',\n');

        var green_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 2)
        Blockly_gen.createAllBlocks(green_value)
        Blockly_gen.GetJsonText().add(',\n');

        var blue_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 3)
        Blockly_gen.createAllBlocks(blue_value)
    Blockly_gen.GetJsonText().add(']');
})

/*----------------------------------------------*/
AST_dispatch.install("colour_blend", function(block) {
    Blockly_gen.GetJsonText().add('"type": "libfunc_call",\n');
    Blockly_gen.GetJsonText().add('"name": "colour_invoke",\n');
    Blockly_gen.GetJsonText().add('"param": "colourBlend",\n');
	Blockly_gen.GetJsonText().add('"id": "' + block.getAttribute("id") + '",\n');

    Blockly_gen.GetJsonText().add('"args": [\n');
        var red_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1)
        Blockly_gen.createAllBlocks(red_value)
        Blockly_gen.GetJsonText().add(',\n');

        var green_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 2)
        Blockly_gen.createAllBlocks(green_value)
        Blockly_gen.GetJsonText().add(',\n');

        var blue_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 3)
        Blockly_gen.createAllBlocks(blue_value)
    Blockly_gen.GetJsonText().add(']\n');
})