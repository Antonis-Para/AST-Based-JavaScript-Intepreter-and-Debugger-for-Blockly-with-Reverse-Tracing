import Generator from '../AST_generator/AST_generator.js'
import {BreakpointHolder} from './breakpoints.js'

export var Debuggee_Worker = {
    instance    : undefined,
    workspace   : undefined,

    getInstance : function (){
        if (Debuggee_Worker.instance === undefined) {
            try{
                Debuggee_Worker.instance = new Worker("http://127.0.0.1:5500/debuggee/debuggee.js",{
                    type: 'module'
                });
            }catch(e){
                try{
                    Debuggee_Worker.instance = new Worker("http://localhost:5500/debuggee/debuggee.js",{
                        type: 'module'
                    });
                }catch(e){}
            }
            Debuggee_Worker.instance.onmessage = function (msg) {
                let obj = msg.data;
            
                switch(obj.type){
                    case "highlight_block":
                        Debuggee_Worker.workspace.highlightBlock(obj.data.id)
                        break;
                       
                }
            }
        }

        return Debuggee_Worker.instance
    },

    init    : function(ws){
        function initWorkspace(ws){
            Debuggee_Worker.workspace = ws;
        }

        function initBreakpoints(){ //send all the breakpoints again. If the worker was stopped once he doesn't have the breakpoints any more
            console.assert(Debuggee_Worker.instance !== undefined, {number : 0, errorMsg : "Debuggee hasn't been instanciated yet"})
            for (var breakpoint in BreakpointHolder.breakpoints){
                Debuggee_Worker.instance.postMessage({type : "breakpoint", data : {id : breakpoint, op : 'add'}})
            }
        }

        Debuggee_Worker.getInstance(); //create it
        initWorkspace(ws)   //or Blockly.mainWorkspace
        initBreakpoints()
    },

    kill : function (){
        if (this.instance !== undefined){
            this.instance.terminate();
            this.instance = undefined;
            Debuggee_Worker.workspace.highlightBlock(null)
        }
    },

    blocklyXmlToJson : function(xml){
        return Generator(xml)
    }
}

