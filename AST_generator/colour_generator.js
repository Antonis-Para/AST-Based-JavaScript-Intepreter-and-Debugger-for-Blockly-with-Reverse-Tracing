var Blockly_gen = require('./AST_Init.js')

/*----------------------------------------------*/
AST_dispatch["colour_picker"] = function(block) {
    Blockly_gen.addToJSON('"type": "colour_const",\n');
    var colour = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "field", 1).childNodes[0].nodeValue;
    Blockly_gen.addToJSON('"value": "' + colour + '"\n');
}

/*----------------------------------------------*/
AST_dispatch["colour_random"] = function(block) {
    Blockly_gen.addToJSON('"type": "colour_random"\n');
}

/*----------------------------------------------*/
AST_dispatch["colour_rgb"] = function(block) {
    Blockly_gen.addToJSON('"type": "colour_rgb",\n');

    var red_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1)
    Blockly_gen.addToJSON('"red": ');
    Blockly_gen.createAllBlocks(red_value)
    Blockly_gen.addToJSON(',\n');

    var green_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 2)
    Blockly_gen.addToJSON('"green": ');
    Blockly_gen.createAllBlocks(green_value)
    Blockly_gen.addToJSON(',\n');

    var blue_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 3)
    Blockly_gen.addToJSON('"blue": ');
    Blockly_gen.createAllBlocks(blue_value)
}

/*----------------------------------------------*/
AST_dispatch["colour_blend"] = function(block) {
    Blockly_gen.addToJSON('"type": "colour_blend",\n');

    var red_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 1)
    Blockly_gen.addToJSON('"colour1": ');
    Blockly_gen.createAllBlocks(red_value)
    Blockly_gen.addToJSON(',\n');

    var green_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 2)
    Blockly_gen.addToJSON('"colour2": ');
    Blockly_gen.createAllBlocks(green_value)
    Blockly_gen.addToJSON(',\n');

    var blue_value = Blockly_gen.getElement(block, Blockly_gen.ELEMENT_NODE, "value", 3)
    Blockly_gen.addToJSON('"ratio": ');
    Blockly_gen.createAllBlocks(blue_value)
}