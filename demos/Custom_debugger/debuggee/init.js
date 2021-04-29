export var blockly_debuggee = { }

blockly_debuggee.state = {
    currNest        : 0,
    traceCommand    : "",
    stopNodeNesting : -1,
    debugMode       : false,
    isStopped       : false,
    flag            : true,

    set_stopped     : function(){
        this.reset();
        this.isStopped = true;
        this.stopNodeNesting = this.currNest
    },

    matches_to_stop_dispatcher : {
        "stepOut"   : () => blockly_debuggee.state.currNest < blockly_debuggee.state.stopNodeNesting,
        "stepIn"    : () => true,
        ""          : () => false
    },

    matches_to_stop : ()   => blockly_debuggee.state.matches_to_stop_dispatcher[blockly_debuggee.state.traceCommand](),

    has_command     : ()   => blockly_debuggee.state.traceCommand != "",
    set_command     : function (cmd){
        //
        //
        this.traceCommand = cmd;
    },

    reset           : function(){
        this.traceCommand = "";
        this.isStopped = false;
        //
        //
    }
}


var TraceCommandHandler = {
    is_stopped  : () => blockly_debuggee.state.isStopped,
    should_stop : function (){
        if (!this.is_stopped()){
            //
            //
            //
        }else{
            return blockly_debuggee.state.matches_to_stop();
        }
    },

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

        function set_stopped (blockid){
            highlightBlock(blockid);
            blockly_debuggee.state.set_stopped()
        }

        var sleep = (ms)  => new Promise(resolve => setTimeout(resolve, ms));

        async function wait (node) {

            if (TraceCommandHandler.should_stop())
                set_stopped(node.id)
            
            if (TraceCommandHandler.is_stopped()){
                while (!blockly_debuggee.state.has_command()){
                    await sleep(0);
                }
            }

            
            //highlightBlock(node.id)
            //blockly_debuggee.state.reset();
            //blockly_debuggee.state.traceCommand = '';
            //blockly_debuggee.state.flag = true;
            
        }

        return wait(node);
    }
};

TraceCommandHandler.handle_message = function (type, cmd){
    if (type == "trace"){
        blockly_debuggee.state.set_command(cmd);
    }
}

blockly_debuggee.TraceCommandHandler = TraceCommandHandler