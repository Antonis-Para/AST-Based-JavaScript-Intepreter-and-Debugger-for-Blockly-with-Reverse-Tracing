import {blockly_debuggee} from './interpreter_vector.js'

onmessage = function (msg) {
    let obj = msg.data;

    var messages = {
        'eval' : function(obj){
            let json = obj.data.code
            blockly_debuggee.state.debugMode = true;
            try{
                blockly_debuggee.Interpreter.init(json);
                blockly_debuggee.Interpreter.eval_instructions(json).then( () => { //after execution finished..
                    postMessage(
                        {type:"watches_variables", data:{ variables : [] } }
                    ); //delete all watches once execution has finished

                    postMessage(
                        {type:"terminate"}
                    ); //execution has finished. If you want you can run it again now

                    blockly_debuggee.state.reset();
                });
            }catch(e){
                alert(e);
            }
        },
        'add_watch' : function(obj){
            blockly_debuggee.Interpreter.Watches.add(obj.data.watch)
            blockly_debuggee.Interpreter.Watches.print(blockly_debuggee.Interpreter.userVars);
            postMessage( //also print the variables again. Values might have been changed with expresions
                {type:"watches_variables", data:{ variables : blockly_debuggee.Interpreter.userVars } }
            );
        },
        'set_watches' : function(obj){
            blockly_debuggee.Interpreter.Watches.set(obj.data.watches)
            blockly_debuggee.Interpreter.Watches.print(blockly_debuggee.Interpreter.userVars);
        },
        'set_variable' : function(obj){
            for (var variable in blockly_debuggee.Interpreter.userVars){ //if variable doesn't exist, don't create it
                if (variable == obj.data.variable){
                    blockly_debuggee.Interpreter.userVars[obj.data.variable] = [obj.data.value, false];
                    blockly_debuggee.Interpreter.Watches.print(blockly_debuggee.Interpreter.userVars);
                    postMessage(
                        {type:"watches_variables", data:{ variables : blockly_debuggee.Interpreter.userVars } }
                    );
                    break;
                }
            }
        },
        'window_prompt' : function(obj){
            blockly_debuggee.interpreter_vars.value_stack.push(obj.data.input);
            blockly_debuggee.state.forcedStoped = false;
            blockly_debuggee.state.isStopped = false;
        },
        'reverse' : function(obj){
            blockly_debuggee.Interpreter.in_reverse = obj.data.value;
        }
    }

    try{
        messages[obj.type](obj);
    }catch(e){ //no function exist, handle the message
        blockly_debuggee.TraceCommandHandler.handle_message(obj.type, obj.data)
    }
}