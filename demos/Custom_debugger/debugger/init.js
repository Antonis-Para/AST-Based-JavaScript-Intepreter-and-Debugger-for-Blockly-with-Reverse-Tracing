import Generator from '../AST_generator/AST_generator.js'

export var Debuggee_Worker = {
    instance    : undefined,
    workspace   : undefined,

    getInstance : function (){
        if (this.instance === undefined) {
            try{
                this.instance = new Worker("http://127.0.0.1:5500/debuggee/debuggee.js",{
                    type: 'module'
                });
            }catch(e){
                try{
                    this.instance = new Worker("http://localhost:5500/debuggee/debuggee.js",{
                        type: 'module'
                    });
                }catch(e){}
            }
            this.instance.onmessage = function (msg) {
                let obj = msg.data;
            
                switch(obj.type){
                    case "highlight_block":
                        Debuggee_Worker.workspace.highlightBlock(obj.data.id)
                        break;
                       
                }
            }
        }

        return this.instance
    },

    initWorkspace : function (ws){
        this.workspace = ws;
    },

    blocklyXmlToJson : function(xml){
        return Generator(xml)
    }
}

