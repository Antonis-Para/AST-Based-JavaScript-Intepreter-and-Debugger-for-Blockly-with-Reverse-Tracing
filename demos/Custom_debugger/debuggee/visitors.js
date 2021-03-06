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
    var functions           = {};
    var functions_pc        = [];
    var variables           = [];
    const if_false_offset   = "if_false_offset";
    const if_true_offset    = "if_true_offset";
    const true_jump         = "true_jump";
    const break_jump        = "break_jump";
    const cont_jump         = "cont_jump";
    const tbd               = -0;

    function create_jump_and_continue(before_cond, after_cond){
        for (var i = after_cond; i < instructions.length; i++){
            if (instructions[i].type == break_jump){ 
                instructions[i].pc_offset = instructions.length - i;
                instructions[i].type = 'jump'
            }else if (instructions[i].type == cont_jump){
                instructions[i].pc_offset = before_cond - i;
                instructions[i].type = 'jump'
            }
        }
    }

    function fix_functions(){
        for (var func in functions_pc){
            let node = instructions[functions_pc[func]];
            instructions[functions_pc[func]].start_pc = functions[node.name]
        }
    }

    var funcs = {
        "visit" : function(node){
            return this["visit_" + node.type](node)
        },

        "visit_if_stmt" : function(node){
            //push this instruction so i can highlight it if i want later
            instructions.push({type : 'if_stmt', id : node.id, blockNesting : node.blockNesting})
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

            //push this instruction so i can highlight it if i want later
            instructions.push({type : 'while_stmt', id : node.id, blockNesting : node.blockNesting})

            this.visit(node.cond)
            let after_cond = instructions.length;
            instructions.push({type : 'jump', func: if_false_offset, pc_offset : tbd})
            this.visit(node.do);

            instructions[after_cond].pc_offset = instructions.length - after_cond + 1 //+1 for the next jump
            instructions.push({type : 'jump', func: true_jump, pc_offset : -(instructions.length - before_cond)})

            create_jump_and_continue(before_cond, after_cond);
            
        },

        "visit_repeat_stmt" : function(node){
            let before_cond = instructions.length;

            //push this instruction so i can highlight it if i want later
            instructions.push({type : 'repeat_stmt', id : node.id, blockNesting : node.blockNesting})

            var cond_node = {
                'lval' : {
                    'type' : 'tmp_var'
                },
                'rval' : node.cond,
                'type' : 'logic_expr',
                'op'   : 'LT'
            }

            this.visit(cond_node)
            let after_cond = instructions.length;
            instructions.push({type : 'jump', func: if_false_offset, pc_offset : tbd})
            this.visit(node.do)

            instructions[after_cond].pc_offset = instructions.length - after_cond + 1//+1 for the next jump
            instructions.push({type : 'jump', func: true_jump, pc_offset : -(instructions.length - before_cond)})

            create_jump_and_continue(before_cond, after_cond);
        },

        "visit_untill_stmt" : function(node){
            let before_cond = instructions.length;

            //push this instruction so i can highlight it if i want later
            instructions.push({type : 'untill_stmt', id : node.id, blockNesting : node.blockNesting})

            this.visit(node.cond)
            let after_cond = instructions.length;
            instructions.push({type : 'jump', func: if_true_offset, pc_offset : tbd})
            this.visit(node.do)

            instructions[after_cond].pc_offset = instructions.length - after_cond + 1//+1 for the next jump
            instructions.push({type : 'jump', func: true_jump, pc_offset : -(instructions.length - before_cond)})

            create_jump_and_continue(before_cond, after_cond);
        },

        "visit_forEach_stmt" : function(node){

            function create_tmp_var(pre){
                var name = pre + '_index';
                while(name in variables){
                    name += '.';
                }
                return name;
            }

            var index_var = create_tmp_var(node.var_name);

            //create custom assign expr (init list)
            var init_list_node = {
                'lval' : index_var,
                'rval' : {
                    'type'  : 'number',
                    'value' : 1,
                    'id'    : null
                },
                'type' : 'assign_expr'
            }; 
            this.visit(init_list_node);


            let before_cond = instructions.length;
            //push this instruction so i can highlight it if i want later
            instructions.push({type : 'forEach_stmt', id : node.id, blockNesting : node.blockNesting})

            //create custom logic (LessThan) expr
            var cond_node = {
                'type'  : 'logic_expr',
                'lval'  : {
                    'type' : 'var',
                    'name' : index_var
                },
                'rval'  : {
                    'type' : 'tmp_list', //interpreter will compute length
                    'item' : node.in
                },
                'op'    : 'LTE'
            }
            this.visit(cond_node);

            let after_cond = instructions.length;

            instructions.push({type : 'jump', func: if_false_offset, pc_offset : tbd})
            instructions.push({type : 'jump', func: true_jump, pc_offset : tbd})

            let before_cont_list = instructions.length;

            //create custom assign expr f.e. i = i + 1
            var continue_list_node = {
                'type'  : 'assign_expr',
                'lval' : index_var,
                'rval'  : {
                    'type'  : 'arithm_expr',
                    'lval'  : {
                        'type' : 'var',
                        'name' : index_var
                    },
                    'rval'  : {
                        'type'  : 'number',
                        'value' : 1,
                        'id'    : null
                    },
                    'op'    : 'ADD'
                }
            } 
            this.visit(continue_list_node);

            let after_cont_list = instructions.length;
            instructions.push({type : 'jump', func: true_jump, pc_offset : tbd})

            var continue_list2_node = {
                'type' : 'assign_expr',
                'lval' : node.var_name,
                'rval':{
                    'type'  : 'list_index',
                    'index' : {
                        'type' : 'var',
                        'name' : index_var
                    },
                    'list'  : node.in
                }
            } 
            this.visit(continue_list2_node);

            this.visit(node.do);

            instructions.push({type : 'jump', func: true_jump, pc_offset : tbd})

            //fix the missing labels
            instructions[after_cond].pc_offset = instructions.length - after_cond 
            instructions[before_cont_list - 1].pc_offset = (after_cont_list + 1) - (before_cont_list - 1) //+1 so we skip the jump
            instructions[after_cont_list].pc_offset = -(after_cont_list - before_cond)
            instructions[instructions.length - 1].pc_offset = -(instructions.length - 1 - before_cont_list)

            create_jump_and_continue(before_cont_list, after_cond);
        },

        "visit_for_stmt" : function(node){
            //create custom assign expr
            var init_list_node = {
                'lval'          : node.var_name,
                'rval'          : node.from,
                'id'            : node.from.id,
                'blockNesting'  : node.from.blockNesting,
                'type'          : 'assign_expr'
            }; 
            this.visit(init_list_node);

            let before_cond = instructions.length;

            //push this instruction so i can highlight it if i want later
            instructions.push({type : 'for_stmt', id : node.id, blockNesting : node.blockNesting})

            //create custom logic (LessThan) expr
            var cond_node = {
                'type'  : 'logic_expr',
                'lval'  : {
                    'type' : 'var',
                    'name' : node.var_name,
                    'blockNesting' : node.blockNesting
                },
                'rval'  : node.to,
                'blockNesting' : node.blockNesting,
                'op'    : 'LTE'
            }
            this.visit(cond_node);

            let after_cond = instructions.length;

            instructions.push({type : 'jump', func: if_false_offset, pc_offset : tbd})
            instructions.push({type : 'jump', func: true_jump, pc_offset : tbd})

            let before_cont_list = instructions.length;

            //create custom assign expr f.e. i = i + 1
            var cont_node = {
                'type'  : 'assign_expr',
                'lval'  : node.var_name,
                'rval'  : {
                    'type'  : 'arithm_expr',
                    'lval'  : {
                        'type' : 'var',
                        'name' : node.var_name,
                        'blockNesting' : node.blockNesting,
                    },
                    'rval'  : node.by,
                    'op'    : 'ADD',
                    'blockNesting' : node.blockNesting,
                },
                'blockNesting' : node.blockNesting,
            } 
            this.visit(cont_node);


            let after_cont_list = instructions.length;
            instructions.push({type : 'jump', func: true_jump, pc_offset : tbd})

            this.visit(node.do);

            instructions.push({type : 'jump', func: true_jump, pc_offset : tbd})

            //fix the missing labels
            instructions[after_cond].pc_offset = instructions.length - after_cond 
            instructions[before_cont_list - 1].pc_offset = (after_cont_list + 1) - (before_cont_list - 1) //+1 so we skip the jump
            instructions[after_cont_list].pc_offset = -(after_cont_list - before_cond)
            instructions[instructions.length - 1].pc_offset = -(instructions.length - 1 - before_cont_list)

            create_jump_and_continue(before_cont_list, after_cond);
        },

        "visit_tenary_expr"       : function (node) {
            //push this instruction so i can highlight it if i want later
            instructions.push({type : 'tenary_expr', id : node.id, blockNesting : node.blockNesting})

            this.visit(node.if);
            let len1 = instructions.length
            instructions.push({type : 'jump', func: if_false_offset, pc_offset : tbd})
            this.visit(node.then);
            instructions[len1].pc_offset = instructions.length - len1 + 1 //+1 to skip the next jump

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

            var new_node = {
                'blockNesting'  : node.blockNesting,
                'id'            : node.id,
                'type'          : node.type,
                'op'            : node.op,
            };

            instructions.push(new_node);
        },

        "visit_arithm_expr"       : function (node) {
            this.visit(node.lval);
            this.visit(node.rval);

            var new_node = {
                'blockNesting'  : node.blockNesting,
                'id'            : node.id,
                'type'          : node.type,
                'op'            : node.op,
            };

            instructions.push(new_node);
        },

        "visit_assign_expr"       : function (node) {
            this.visit(node.rval);

            var new_node = {
                'blockNesting'  : node.blockNesting,
                'id'            : node.id,
                'type'          : node.type,
                'lval'          : node.lval,
            };

            instructions.push(new_node);
        },

        "visit_var_change"       : function (node) {
            this.visit(node.value);

            var new_node = {
                'var_name'      : node.var_name,
                'blockNesting'  : node.blockNesting,
                'id'            : node.id,
                'type'          : node.type
            };

            instructions.push(new_node);
        },

        "visit_func_call"       : function (node) {
            for (var arg in node.args)
                this.visit(node.args[arg]);
            
            //we dont need the args, they will be pushed in the value_stack later
            var new_node = {
                'name'          : node.name,
                'blockNesting'  : node.blockNesting,
                'id'            : node.id,
                'type'          : node.type,
                'arg_count'     : node.args.length
            };

            instructions.push(new_node)
        },

        "visit_libfunc_call"       : function (node) {
            for (var arg in node.args)
                this.visit(node.args[arg]);
            
            //we dont need the args, they will be pushed in the value_stack later
            
            var new_node = {
                'name'      : node.name,
                'blockNesting'  : node.blockNesting,
                'id'            : node.id,
                'type'          : node.type,
                'param'         : node.param
            };
            if (node.args === undefined){
                new_node.arg_count = 0;
            }else{
                new_node.arg_count = node.args.length;
            }

            instructions.push(new_node)
        },

        "visit_func_decl"       :  function (node) {
            let before_func = instructions.length

            instructions.push({type : 'jump', func: true_jump, pc_offset : tbd})

            this.visit(node.do);

            instructions.push({type : 'userfunc_exit'})

            instructions[before_func].pc_offset = instructions.length - before_func;

            functions[node.name] = before_func + 1 //go after the jump
        },

        "visit_userfunc_call"       : function (node) {
            for (var arg in node.args)
                this.visit(node.args[arg]);
            
            functions_pc.push(instructions.length) //save the func call, im going to fix the 'start_pc' in the end

            //we dont need the args, they will be pushed in the value_stack later
            var new_node = {
                'name'          : node.name,
                'blockNesting'  : node.blockNesting,
                'id'            : node.id,
                'type'          : node.type,
                'arg_names'     : node.arg_names,
                'start_pc'      : undefined //undefined for now
            };

            instructions.push(new_node)
        },
        

        "visit_list_create"       : function (node) {
            for (var item in node.items)
                this.visit(node.items[item]);
            
            var new_node = {
                'blockNesting'  : node.blockNesting,
                'id'            : node.id,
                'type'          : node.type,
                'items_count'   : node.items.length
            };

            instructions.push(new_node)
        },

        "visit_list_index"       : function (node) {
            this.visit(node.index);
            this.visit(node.list);

            var new_node = {
                'id'            :node.id,
                'type'          :node.type,
                'blockNesting'  :node.blockNesting
            }
            instructions.push(new_node)
        },

        "visit_property"       : function (node) {
            this.visit(node.item);

            var new_node = {
                'id'            : node.id,
                'type'          : node.type,
                'blockNesting'  : node.blockNesting,
                'name'          : node.name
            }
            instructions.push(new_node)
        },
        "visit_keyword"         : function (node) {
            if ('value' in node) //return
                this.visit(node.value)
            else if (node.name == 'break'){ //break 
                instructions.push({type : break_jump, func: true_jump, pc_offset : tbd})
            }else if (node.name == 'continue'){ //continue
                instructions.push({type : cont_jump, func: true_jump, pc_offset : tbd})
            }
        },

        "visit_bool_const"      : (node) => instructions.push(node),
        "visit_null_const"      : (node) => instructions.push(node),
        "visit_text_const"      : (node) => instructions.push(node),
        "visit_colour_const"    : (node) => instructions.push(node),
        "visit_number"          : (node) => instructions.push(node),
        "visit_var"             : (node) => instructions.push(node),
        "visit_var_decl"        : (node) => {variables[node.name]=true; instructions.push(node)}, //insert the name as key so i can "while (name in variables)"
        "visit_tmp_var"         : (node) => instructions.push(node),
        "visit_tmp_list"        : (node) => {
            funcs.visit(node.item);
            var new_node = {
                'type' : node.type
            }
            instructions.push(new_node)
        }
    }
    
    funcs.visit(ast);
    fix_functions();
    return instructions;
}

astVisitor.install("serializeAST_visitor", serializeAST_visitor);