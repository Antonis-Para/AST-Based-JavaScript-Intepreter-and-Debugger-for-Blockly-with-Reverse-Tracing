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
        case "add_watch":
            blockly_debuggee.Interpreter.Watches.add(obj.data.watch)
            blockly_debuggee.Interpreter.Watches.print(blockly_debuggee.Interpreter.userVars);
            postMessage( //also print the variables again. Values might have been changed with expresions
                {type:"watches_variables", data:{ variables : blockly_debuggee.Interpreter.userVars } }
            );
            break;
        case "set_watches":
            blockly_debuggee.Interpreter.Watches.set(obj.data.watches)
            blockly_debuggee.Interpreter.Watches.print(blockly_debuggee.Interpreter.userVars);
            break;
        case "set_variable":
            
            for (var variable in blockly_debuggee.Interpreter.userVars){ //if variable doesn't exist, don't create it
                if (variable == obj.data.variable){
                    blockly_debuggee.Interpreter.userVars[obj.data.variable] = obj.data.value;
                    blockly_debuggee.Interpreter.Watches.print(blockly_debuggee.Interpreter.userVars);
                    postMessage(
                        {type:"watches_variables", data:{ variables : blockly_debuggee.Interpreter.userVars } }
                    );
                    break;
                }
            }
            break;
        default:
            blockly_debuggee.TraceCommandHandler.handle_message(obj.type, obj.data)
           
    }
}