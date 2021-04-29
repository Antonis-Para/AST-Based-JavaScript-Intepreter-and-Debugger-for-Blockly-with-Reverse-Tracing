export var blockly_debuggee = { }

const NO_COMMAND        = 'undef';
const TRACE_TYPE        = "trace"

const CONTINUE_COMMAND  = "continue";
const STEP_OVER_COMMAND = "step_over";
const STEP_IN_COMMAND   = "step_in";
const STEP_OUT_COMMAND  = "step_out";
const RUN_TO_COMMAND    = "run_to";
const BREAK_COMMAND     = "break";
const EXIT_COMMAND      = "exit";



blockly_debuggee = {
    matches_to_stop_dispatcher : function (command){
        var commands = {}

        commands[STEP_OUT_COMMAND]  = () => blockly_debuggee.state.currNest < blockly_debuggee.state.stopNodeNesting;
        commands[STEP_OVER_COMMAND] = () => blockly_debuggee.state.currNest <= blockly_debuggee.state.stopNodeNesting;
        commands[NO_COMMAND]        = () => false;

        return commands[command]();
    },

    matches_to_stop : ()   => blockly_debuggee.matches_to_stop_dispatcher(blockly_debuggee.state.traceCommand),

    has_command     : ()   => blockly_debuggee.state.traceCommand != NO_COMMAND,
    set_command     : function (cmd){
        //
        //
        this.state.traceCommand = cmd;
    }
}

blockly_debuggee.state = {
    currNest        : 0,
    traceCommand    : NO_COMMAND,
    stopNodeNesting : -1,
    debugMode       : false,
    isStopped       : false,

    set_stopped     : function(){
        this.reset();
        this.isStopped = true;
        this.stopNodeNesting = this.currNest
    },

    reset           : function(){
        this.traceCommand = NO_COMMAND;
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
            return blockly_debuggee.matches_to_stop();
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
                while (!blockly_debuggee.has_command()){
                    await sleep(0);
                }
            }
            
        }

        return wait(node);
    }
};

TraceCommandHandler.handle_message = function (type, cmd){
    if (type == TRACE_TYPE){
        blockly_debuggee.set_command(cmd);
    }
}

blockly_debuggee.TraceCommandHandler = TraceCommandHandler