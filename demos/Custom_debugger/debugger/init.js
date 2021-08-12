import Generator from '../AST_generator/AST_generator.js'
import {BreakpointHolder} from './breakpoints.js'
import {Watches} from './watches.js'

export var Debuggee_Worker = {
    instance    : undefined,
    workspace   : undefined,
    active      : false,
    watches     : Watches,

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
            
                var messages = {
                    'highlight_block' : function(obj){
                        Debuggee_Worker.workspace.highlightBlock(obj.data.id)
                    },
                    'watches_variables' : function(obj){
                        var table = document.getElementById("watches")
                        Debuggee_Worker.watches.reset_watches(table)

                        var vars = obj.data.variables
                        for (var variable in vars){
                            let value = vars[variable][0]
                            if (vars[variable][1] == false) //if its not a tmp var
                                Debuggee_Worker.watches.print(document, table, variable, value, typeof value)
                        }
                    },
                    'watches_expresions' : function(obj){
                        var table = document.getElementById("watches_expr")
                        Debuggee_Worker.watches.reset_watches(table)

                        var exprs = obj.data.exprs
                        for (var expr in exprs){
                            let value = exprs[expr]
                            Debuggee_Worker.watches.print(document, table, expr, value, typeof value)
                        }
                    },
                    'window_alert' : function(obj){
                        window.alert('' + obj.data.args)
                    },
                    'window_prompt' : function(obj){
                        var input = window.prompt(obj.data.args)
                        Debuggee_Worker.instance.postMessage({type : "window_prompt", data : {'input' : input} });
                    },
                    'terminate' : function(obj){
                        Debuggee_Worker.kill();
                    }
                }

                messages[obj.type](obj);
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

                if (!BreakpointHolder.has_enabled(breakpoint)){
                    Debuggee_Worker.instance.postMessage({type : "breakpoint", data : {id : breakpoint, op : 'disable'}})
                }
                
            }
        }

        function initWatches(){ //send watches again. If the worker was stopped once he doesn't have the breakpoints any more
            Debuggee_Worker.getInstance().postMessage({type : "set_watches", data : {watches : Debuggee_Worker.watches.getAll()} });
        }

        Debuggee_Worker.getInstance(); //create it
        initWorkspace(ws)   //or Blockly.mainWorkspace
        initBreakpoints()
        initWatches()
    },

    kill : function (){
        if (this.instance !== undefined){
            this.instance.terminate();
            this.instance = undefined;
            Debuggee_Worker.workspace.highlightBlock(null) //unhighlight all blocks once execution has finished
            Debuggee_Worker.watches.reset_watches(document.getElementById("watches"))   //remove all variables from the bottom section
        }
        this.active = false;
    },

    blocklyXmlToJson : function(xml){
        return Generator(xml)
    }
}

