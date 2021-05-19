export var blockly_debuggee = { }
export var Interpreter = { 
    "userVars"         : [],
    "userFuncs"        : [],
    install            : function(name, callback){
        this[name] = callback
    }
}

const NO_COMMAND        = 'undef';
const UNDEF_STRING      = 'undef';
const TRACE_TYPE        = "trace"

const CONTINUE_COMMAND  = "continue";
const STEP_OVER_COMMAND = "step_over";
const STEP_IN_COMMAND   = "step_in";
const STEP_OUT_COMMAND  = "step_out";
const RUN_TO_COMMAND    = "run_to";
const BREAK_COMMAND     = "break";
const EXIT_COMMAND      = "exit";

var BreakpointHolder = {
    breakpoints : [],
    add         : function(blockId) { this.breakpoints[blockId] = true; },
    remove      : function(blockId) { delete this.breakpoints[blockId]; },
    enable      : function(blockId) { this.breakpoints[blockId] = true; },
    disable     : function(blockId) { this.breakpoints[blockId] = false; },
    has         : function(blockId) { return this.breakpoints[blockId] == true; },
    clear       : function ()       { for (var bpt in this.breakpoints) delete this.breakpoints[bpt]; }
  };

blockly_debuggee = {
    matches_to_stop_dispatcher : function (command, block){
        var commands = {}
        //blockly_debuggee.state.currCallNesting
        commands[STEP_OUT_COMMAND]  = () => blockly_debuggee.state.currCallNesting < blockly_debuggee.state.stopNodeCallNesting ||
                                                (block.blockNesting < blockly_debuggee.state.stopNodeBlockNesting && blockly_debuggee.state.currCallNesting == blockly_debuggee.state.stopNodeCallNesting);
        commands[STEP_OVER_COMMAND] = () => block.blockNesting <= blockly_debuggee.state.stopNodeBlockNesting && blockly_debuggee.state.currCallNesting <= blockly_debuggee.state.stopNodeCallNesting;
        commands[STEP_IN_COMMAND]   = () => true; //we seem to always stop with step-in. Always true?
        commands[NO_COMMAND]        = () => false;

        return commands[command]();
    },

    matches_to_stop : (block)   => blockly_debuggee.matches_to_stop_dispatcher(blockly_debuggee.state.traceCommand, block),

    has_command     : ()        => blockly_debuggee.state.traceCommand != NO_COMMAND,
    set_command     : function (cmd, blockid){
        if (cmd == RUN_TO_COMMAND){
            this.state.reset();
            this.state.explicitTargetBlock = blockid;
        }
        else if (cmd == CONTINUE_COMMAND)
            this.state.reset();
        else
            this.state.traceCommand = cmd;
    },  

    reset           : function (){
        blockly_debuggee.state.reset();
        blockly_debuggee.currCallNesting        = -1;
        blockly_debuggee.stopNodeBlockNesting   = -1;
    }
}

blockly_debuggee.state = {
    currCallNesting     : -1,
    traceCommand        : NO_COMMAND,
    explicitTargetBlock : UNDEF_STRING,
    stopNodeBlockNesting: -1,
    stopNodeCallNesting : 0,
    debugMode           : false,
    isStopped           : false,

    set_stopped         : function(block){
        this.reset();
        this.isStopped  = true;
        this.stopNodeBlockNesting = block.blockNesting;
        this.stopNodeCallNesting  = this.currCallNesting;
    },

    reset               : function(){
        this.traceCommand           = NO_COMMAND;
        this.isStopped              = false;
        this.stopNodeBlockNesting   = -1;
        this.explicitTargetBlock    = UNDEF_STRING
    }
}


var TraceCommandHandler = {
    is_stopped  : () => blockly_debuggee.state.isStopped,
    should_stop : function (block){
        if (!this.is_stopped()){
            return  BreakpointHolder.has(block.id)                           ||
                    blockly_debuggee.state.explicitTargetBlock == block.id
            //
        }else{
            return blockly_debuggee.matches_to_stop(block);
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

        function updateWatches (vars) {
            postMessage(
                {type:"watches_variables", data:{ variables : vars } }
            );
        }

        function set_stopped (block){
            highlightBlock(block.id);
            blockly_debuggee.state.set_stopped(block)
        }

        var sleep = (ms)  => new Promise(resolve => setTimeout(resolve, ms));

        async function wait (node) {

            updateWatches(Interpreter.userVars)

            if (TraceCommandHandler.should_stop(node))
                set_stopped(node)

             //stoped state can change while in busy loop, we can't use "TraceCommandHandler.is_stopped()" on outer if stmt
            while (!blockly_debuggee.has_command() && TraceCommandHandler.is_stopped()){
                await sleep(0);
            }
            
        }

        return wait(node);
    }
};

TraceCommandHandler.handle_message = function (type, cmd){
    if (type == TRACE_TYPE){
        blockly_debuggee.set_command(cmd.op, cmd.id);
    }else if (type == "breakpoint"){
        let func = cmd.op;
        BreakpointHolder[func](cmd.id)
    }
}

blockly_debuggee.TraceCommandHandler = TraceCommandHandler