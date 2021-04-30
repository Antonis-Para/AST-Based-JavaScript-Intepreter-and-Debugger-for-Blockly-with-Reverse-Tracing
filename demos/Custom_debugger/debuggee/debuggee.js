import {blockly_debuggee} from './interpreter.js'

onmessage = function (msg) {
    let obj = msg.data;

    switch(obj.type){
        case "eval":
            let json = obj.data.code
            blockly_debuggee.state.debugMode = true;
            blockly_debuggee.Interpreter.init(json);
            blockly_debuggee.Interpreter.eval(json);
            
            blockly_debuggee.state.reset();
            //blockly_debuggee.state.set_stopped(); //for testing always stop on the first command
            //blockly_debuggee.TraceCommandHandler.handle_message("trace", {op : "step_over"})

            break;
        default:
            blockly_debuggee.TraceCommandHandler.handle_message(obj.type, obj.data)
           
    }
}