import {blockly_debuggee} from './interpreter.js'

onmessage = function (msg) {
    let obj = msg.data;

    switch(obj.type){
        case "eval":
            let json = obj.data.code
            blockly_debuggee.state.debugMode = true;
            blockly_debuggee.Interpreter.init(json);
            blockly_debuggee.Interpreter.eval(json).then( () => { //after execution finished..
                postMessage(
                    {type:"watches_variables", data:{ variables : [] } }
                ); //delete all watches once execution has finished

                postMessage(
                    {type:"terminate"}
                ); //execution has finished. If you want you can run it again now
            });
            
            blockly_debuggee.state.reset();
            break;
            
        default:
            blockly_debuggee.TraceCommandHandler.handle_message(obj.type, obj.data)
           
    }
}