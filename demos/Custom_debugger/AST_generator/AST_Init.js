//require('chai').assert(typeof(text) == 'undefined');    // make sure no conflict with aglobal var

export var AST_dispatch = {
    install : function (type, callback){
        AST_dispatch[type] = callback
    }
}

// var fs = require('fs');
// const {
//     exit
// } = require('process');

var json_text;

export var Blockly_gen = {
    ELEMENT_NODE : 1,
    blockNesting : -1,

    reset : function (){
        this.GetJsonText().reset();
        json_text = undefined;
        Blockly_gen.blockNesting = -1;
        Blockly_gen.nextBlock_flag = false;
    },

    // This is just one way  you make it a singleton;
    // then invoke as GetJsonText().<method>(<args>)
    GetJsonText: function  () {

        if (typeof json_text == 'undefined') {    // guarantee one initialisation
            json_text = {}
            json_text.text      = "";
            var self            = {}
            self.add            = (s)   => json_text.text += s
            self.get            = ()    => json_text.text
            self.remove_chars   = (n)   => json_text.text = json_text.text.slice(0, -n)
            self.reset          = ()    => json_text.text = ""
            json_text.self      = self
        }

        return json_text.self;
    },

    /* --------------------------------------------------------------------------------
        Will create all the variable declarations that are inside the <variables> tag.
        Assumes that the tag is in the outer blocks
    -----------------------------------------------------------------------------------*/	
    createAllVariables: function (blocks) {
        var variables = this.getElement(blocks, Blockly_gen.ELEMENT_NODE, "variables", 1);
        if (variables === null) return;

        var occ = 1;
        var variable = this.getElement(variables, Blockly_gen.ELEMENT_NODE, "variable", occ++);
        while (variable !== null) {
            if (variable.childNodes.length != 0) {
                Blockly_gen.GetJsonText().add("{\n")
                Blockly_gen.GetJsonText().add('"type": "var_decl",\n');
                Blockly_gen.GetJsonText().add('"id": "' + variable.getAttribute("id") + '",\n');
                Blockly_gen.GetJsonText().add('"name": "' + variable.childNodes[0].nodeValue + '"\n');
                Blockly_gen.GetJsonText().add("},\n")
            }
            variable = this.getElement(variables, Blockly_gen.ELEMENT_NODE, "variable", occ++);
        }
    },

    /* -----------------------------------------------------------------------------
        Will create all the blocks recursively. Nested blocks will also be created.
        Calls a dispatch table
    --------------------------------------------------------------------------------*/
    createAllBlocks: function (blocks) {
        var name = this.blocksExist(blocks)
        if (name === null) //no blocks or shadow block exist
            return null;

        var flag = Blockly_gen.nextBlock_flag;
        if (Blockly_gen.nextBlock_flag)
            Blockly_gen.nextBlock_flag = false;
        else
            Blockly_gen.blockNesting++;
        var block, occ = 1;
        block = this.getElement(blocks, Blockly_gen.ELEMENT_NODE, name, occ++);
        while (block !== null) { //while there are more blocks..
            Blockly_gen.GetJsonText().add("{\n")
            Blockly_gen.GetJsonText().add('"blockNesting": ' + Blockly_gen.blockNesting + ',\n');
            var type = block.getAttribute('type');
            try {
                AST_dispatch[type](block); // Dispatch
            }catch(e){
                console.log("Error with type " + type)
                console.log("-------------------------------")
                console.log(e)
                return;
                //exit()
            }

            Blockly_gen.GetJsonText().add('}'); //data
            this.nextBlock(block);
            block = this.getElement(blocks, Blockly_gen.ELEMENT_NODE, name, occ++)
            if (block !== null) {
                Blockly_gen.GetJsonText().add(',\n');
            }
        }
        if (flag == false)
            Blockly_gen.blockNesting--
    },


    /* ------------------------------------------------------------------------------
        Checks if a block or shadow block exists within the sub-block named 'blocks'
    ---------------------------------------------------------------------------------*/
    blocksExist: function (blocks) {
        var block = this.getElement(blocks, Blockly_gen.ELEMENT_NODE, "block", 1);
        var name = "block"

        if (block === null) { //if there aren't any blocks, check for shadow blocks
            name = "shadow"
            block = this.getElement(blocks, Blockly_gen.ELEMENT_NODE, "shadow", 1);
            if (block === null) { //no blocks or shadow blocks == 0 statements inside
                return null;
            }
        }
        return name;
    },

    /* ------------------------------------------------------------------------------
        Blockly keeps the blocks connected to a previous block inside a <next> TAG.
        This function will check if such a block exist and will create it.
        Assums that there is at MOST one <next> tag in every block	
    ---------------------------------------------------------------------------------*/
    nextBlock_flag : false,
    nextBlock: function (block) {
        var next = this.getElement(block, Blockly_gen.ELEMENT_NODE, "next");

        if (next === null) {
            Blockly_gen.GetJsonText().add('\n');
            return;
        }

        Blockly_gen.GetJsonText().add(',\n');
        this.nextBlock_flag = true;
        this.createAllBlocks(next)
    },

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
    getElement: function (blocks, type, name, child_no = 1) {
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
}