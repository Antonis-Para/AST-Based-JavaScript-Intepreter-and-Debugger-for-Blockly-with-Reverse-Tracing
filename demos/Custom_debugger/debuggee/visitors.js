export var astVisitor = {
    "visitors" : {},
    "install"  : function (visitor_tag, callback){
        this.visitors[visitor_tag] = callback;
    },
    "accept" : function(visitorTag, ast){
        var f = this.visitors[visitorTag]
        if(f)
            return f(ast);
    }
}

function serializeAST_visitor (ast) {
    var instructions        = [];
    const if_false_offset   = "if_false_offset";
    const if_true_offset   = "if_true_offset";
    const true_jump         = "true_jump";
    const tbd               = -0;

    var funcs = {
        "visit" : function(node){
            try{
                this["visit_" + node.type](node)
            }catch(e){
                console.log("ERROR ----> ")
                console.log(e)
            }

        },

        "visit_if_stmt" : function(node){
            var end_of_if_true = []
            for(var i = 0; i < node.cond.length; i++){
                this.visit(node.cond[i])
                let len = instructions.length
                instructions.push({type : 'jump', func: if_false_offset, pc_offset : tbd})
                this.visit(node.do[i])

                end_of_if_true.push(instructions.length) //if true get out of the if_else
                instructions.push({type : 'jump', func: true_jump, pc_offset : tbd})

                instructions[len].pc_offset = instructions.length - len;                
            }

            this.visit(node.default) //else stmt
            
            for (var i in end_of_if_true){ //if true get out of the if_else
                instructions[end_of_if_true[i]].pc_offset = instructions.length - end_of_if_true[i];
            }

        },

        "visit_while_stmt" : function(node){

            let before_cond = instructions.length;
            this.visit(node.cond)
            let after_cond = instructions.length;
            instructions.push({type : 'jump', func: if_false_offset, pc_offset : tbd})
            this.visit(node.do)

            instructions[after_cond].pc_offset = instructions.length - after_cond + 1//+1 for the next jump
            instructions.push({type : 'jump', func: true_jump, pc_offset : -(instructions.length - before_cond)})
        },

        "visit_repeat_stmt" : function(node){
            
            let before_cond = instructions.length;

            var new_node = {
                'lval' : {
                    'type' : 'tmp_var'
                },
                'rval' : node.cond,
                'type' : 'logic_expr',
                'op'   : 'LT'
            }

            this.visit(new_node)
            let after_cond = instructions.length;
            instructions.push({type : 'jump', func: if_false_offset, pc_offset : tbd})
            this.visit(node.do)

            instructions[after_cond].pc_offset = instructions.length - after_cond + 1//+1 for the next jump
            instructions.push({type : 'jump', func: true_jump, pc_offset : -(instructions.length - before_cond)})
        },

        "visit_untill_stmt" : function(node){

            let before_cond = instructions.length;
            this.visit(node.cond)
            let after_cond = instructions.length;
            instructions.push({type : 'jump', func: if_true_offset, pc_offset : tbd})
            this.visit(node.do)

            instructions[after_cond].pc_offset = instructions.length - after_cond + 1//+1 for the next jump
            instructions.push({type : 'jump', func: true_jump, pc_offset : -(instructions.length - before_cond)})

            
        },

        "visit_for_stmt" : function(node){

            //create custom assign expr
            var new_node = {
                'lval' : node.var_name,
                'rval' : node.from,
                'type' : 'assign_expr'
            }; 
            this.visit(new_node);

            let before_cond = instructions.length;

            //create custom logic (LessThan) expr
            var new_node2 = {
                'type'  : 'logic_expr',
                'lval'  : {
                    'type' : 'var',
                    'name' : node.var_name
                },
                'rval'  : node.to,
                'op'    : 'LTE'
            }
            this.visit(new_node2);
            //this.visit(new_node);
            //this.visit(node.to);
            //instructions.push(new_node2);

            let after_cond = instructions.length;

            instructions.push({type : 'jump', func: if_false_offset, pc_offset : tbd})
            instructions.push({type : 'jump', func: true_jump, pc_offset : tbd})

            let before_cont_list = instructions.length;

            //create custom assign expr f.e. i = i + 1
            var new_node3 = {
                'type'  : 'assign_expr',
                'lval'  : node.var_name,
                'rval'  : {
                    'type'  : 'arithm_expr',
                    'lval'  : {
                        'type' : 'var',
                        'name' : node.var_name
                    },
                    'rval'  : node.by,
                    'op'    : 'ADD'
                }
            } 
            this.visit(new_node3);


            let after_cont_list = instructions.length;
            instructions.push({type : 'jump', func: true_jump, pc_offset : tbd})

            this.visit(node.do);

            instructions.push({type : 'jump', func: true_jump, pc_offset : tbd})

            //fix the missing labels
            instructions[after_cond].pc_offset = instructions.length - after_cond 
            instructions[before_cont_list - 1].pc_offset = (after_cont_list + 1) - (before_cont_list - 1) //+1 so we skip the jump
            instructions[after_cont_list].pc_offset = -(after_cont_list - before_cond)
            instructions[instructions.length - 1].pc_offset = -(instructions.length - 1 - before_cont_list)
        },

        "visit_tenary_expr"       : function (node) {
            this.visit(node.if);
            let len1 = instructions.length
            instructions.push({type : 'jump', func: if_false_offset, pc_offset : tbd})
            this.visit(node.then);
            instructions[len1].pc_offset = instructions.length - len1

            let len2 = instructions.length
            instructions.push({type : 'jump', func: true_jump, pc_offset : tbd})
            this.visit(node.else);
            instructions[len2].pc_offset = instructions.length - len2
        },

        "visit_stmts" : function (node) {
            for (var stmt in node.data){
                this.visit(node.data[stmt]);
            }
        },
        
        "visit_logic_expr"       : function (node) {
            this.visit(node.lval);
            this.visit(node.rval);

            let new_node = {};
            new_node.op = node.op
            new_node.type = node.type

            instructions.push(new_node);
        },

        "visit_arithm_expr"       : function (node) {
            this.visit(node.lval);
            this.visit(node.rval);

            let new_node = {};
            new_node.op = node.op
            new_node.type = node.type

            instructions.push(new_node);
        },

        "visit_assign_expr"       : function (node) {
            this.visit(node.rval);

            var new_node = {};
            new_node.type = node.type;
            new_node.lval = node.lval

            instructions.push(new_node);
        },

        "visit_var_change"       : function (node) {
            this.visit(node.value);

            var new_node = node;
            delete new_node.value;

            instructions.push(new_node);
        },

        "visit_func_call"       : function (node) {
            for (var arg in node.args)
                this.visit(node.args[arg]);
            
            //we dont need the args, they will be pushed in the value_stack later
            var new_node = node;
            new_node.arg_count = node.args.length
            delete new_node["args"]

            instructions.push(new_node)
        },

        "visit_libfunc_call"       : function (node) {
            for (var arg in node.args)
                this.visit(node.args[arg]);
            
            //we dont need the args, they will be pushed in the value_stack later
            var new_node = node;
            new_node.arg_count = node.args.length
            delete new_node["args"]

            instructions.push(new_node)
        },

        // "visit_userfunc_call"       : function (node) {
        //     for (var arg in node.args)
        //         this.visit(node.args[arg]);
            
        //     //we dont need the args, they will be pushed in the value_stack later
        //     var new_node = node;
        //     new_node.arg_count = node.args.length
        //     delete new_node["args"]

        //     instructions.push(new_node)
        // },
        

        "visit_list_create"       : function (node) {
            for (var arg in node.args)
                this.visit(node.args[arg]);
            
            //we dont need the args, they will be pushed in the value_stack later
            var new_node = node;
            new_node.arg_count = node.args.length
            delete new_node["args"]

            instructions.push(new_node)
        },

        "visit_bool_const"      : (node) => instructions.push(node),
        "visit_null_const"      : (node) => instructions.push(node),
        "visit_text_const"      : (node) => instructions.push(node),
        "visit_colour_const"    : (node) => instructions.push(node),
        "visit_number"          : (node) => instructions.push(node),
        "visit_keyword"         : (node) => instructions.push(node),
        "visit_var"             : (node) => instructions.push(node),
        "visit_var_decl"            : (node) => instructions.push(node),
        "visit_tmp_var"         : (node) => instructions.push(node)
        
    }
    
    funcs.visit(ast);
    return instructions;
}

astVisitor.install("serializeAST_visitor", serializeAST_visitor);