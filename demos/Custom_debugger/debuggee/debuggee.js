import {blockly_debuggee} from './interpreter.js'

onmessage = function (msg) {
    let obj = msg.data;

    switch(obj.type){
        case "code":
            let json = obj.data.code
            blockly_debuggee.state.debugMode = true;
            blockly_debuggee.Interpreter.init(json);
            blockly_debuggee.Interpreter.eval(json);
            
            break;
        case "stepIn":
            blockly_debuggee.state.flag = false;
            //console.log(Interpreter.flag)
            break;
           
    }
}