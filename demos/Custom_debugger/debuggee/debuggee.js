import {blockly_debuggee} from './interpreter.js'

onmessage = function (msg) {
    let obj = msg.data;

    switch(obj.type){
        case "eval":
            let json = obj.data.code
            blockly_debuggee.state.debugMode = true;
            blockly_debuggee.Interpreter.init(json);
            blockly_debuggee.Interpreter.eval(json).then( () => {
                postMessage(
                    {type:"highlight_block", data:{ id : null } }
                ); //unhighlight all blocks once execution has finished
            });
            
            blockly_debuggee.state.reset();
            break;
            
        default:
            blockly_debuggee.TraceCommandHandler.handle_message(obj.type, obj.data)
           
    }
}