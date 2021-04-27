export var blockly_debuggee = {
    
}

blockly_debuggee.state = {
    debugMode   : false,
    isStopped   : false,
    flag        : true,
}


var TraceCommandHandler = {
    is_stopped : () => blockly_debuggee.state.isStopped,

    wait : async function(node){
        if (blockly_debuggee.state.debugMode && node.id !== null && node.id !== undefined)
            await this.wait_command(node)
    },

    wait_command : async function(node) {
        function highlightBlock (blockId) {
            postMessage(
                {type:"highlight_block", data:{ id : blockId } }
            );
        }

        var sleep = (ms)  => new Promise(resolve => setTimeout(resolve, ms));

        async function wait (node) {

            
            //console.log(blockly_debuggee.state.flag)

            
            while (blockly_debuggee.state.flag){
                await sleep(0);
            }
            highlightBlock(node.id)
            blockly_debuggee.state.flag = true;
            
        }

        return wait(node);
    }
};

blockly_debuggee.TraceCommandHandler = TraceCommandHandler