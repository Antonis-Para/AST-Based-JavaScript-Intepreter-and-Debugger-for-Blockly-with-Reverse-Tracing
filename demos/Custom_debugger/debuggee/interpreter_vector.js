import {blockly_debuggee, Interpreter, astVisitor} from "./init.js";
import {LibraryFuncs} from "./libfuncs.js"
export {blockly_debuggee};

var interpreter_vars = {
    instructions     : [],
    value_stack      : [],
    pc               : 0,
    offset           : 0,
    reverse_pc       : [undefined], // undefined < instructions.length == false
    reverse_func_val : [] //used to save function arguments
}

function nextPc(){
    if (Interpreter.in_reverse){
        interpreter_vars.pc = interpreter_vars.reverse_pc.pop();
        interpreter_vars.offset = 0;
    }
    else if (interpreter_vars.offset != 0){
        interpreter_vars.reverse_pc.push(interpreter_vars.pc);
        interpreter_vars.pc += interpreter_vars.offset
        interpreter_vars.offset = 0;
    }
    else{
        interpreter_vars.reverse_pc.push(interpreter_vars.pc);
        interpreter_vars.pc++;
    }    
}

Interpreter.install("init" , function(ast){
    interpreter_vars.instructions = astVisitor.accept("serializeAST_visitor" ,ast);
    for(var funcname in ast.data){ //uses the ast to find the userfunc_decl. It is faster than the instructions[] as it only checks the first level
        var type = ast.data[funcname].type
        if (type == "userfunc_decl"){
            var name = ast.data[funcname].name
            this.userFuncs[name] = ast.data[funcname].do;
            this.userFuncs[name].id = ast.data[funcname].id;
            this.userFuncs[name].blockNesting = 1;
            delete ast.data[funcname];
        }
    }
})


Interpreter.install("eval_instructions" , async function (node) {
    while (interpreter_vars.pc < interpreter_vars.instructions.length){ //or when pc === undefined
        var n = interpreter_vars.instructions[interpreter_vars.pc]
        await this.eval(n);
        nextPc();
    }
})

Interpreter.install("eval" , async function (node) {
    if (Interpreter.in_reverse){
        if(node.undo && node.undo[0]){
            node.undo.pop()();
        }
    }
    await blockly_debuggee.TraceCommandHandler.wait(node)
    
    if (Interpreter.in_reverse) return;

    return this["eval_" + node.type](node);
})

Interpreter.install("eval_stmts" , async function (node) {
    var res;

    for (var stmt in node.data){
        res = await this.eval(node.data[stmt]);
    }
    interpreter_vars.value_stack.push(res) //return the last command (used for userfuncs, for example return 5;)

    node.undo.push(function(){
        interpreter_vars.value_stack.pop();
    })
})

Interpreter.install("eval_if_false_offset" , async function (node) {
    var val = interpreter_vars.value_stack.pop();
    if(!val)
        interpreter_vars.offset = node.pc_offset;

    node.undo.push( function(){
        interpreter_vars.value_stack.push(val);
    })
})

Interpreter.install("eval_if_true_offset" , async function (node) {
    var val = interpreter_vars.value_stack.pop();
    if(val)
        interpreter_vars.offset = node.pc_offset;

    node.undo.push( function(){
        interpreter_vars.value_stack.push(val);
    })
})

Interpreter.install("eval_true_jump" , async function (node) {
    interpreter_vars.offset = node.pc_offset;
})

Interpreter.install("eval_jump" , async function (node) {
    this["eval_" + node.func](node);
})

Interpreter.install("eval_highlight_node" , async function (node) {})


//All these stmts have been turned into instruction. Howeven I want to be able to highlight 
//the blocks so I simply install them and do nothing with them
Interpreter.install("eval_highlight_node" , async function (node) {})
Interpreter.install("eval_if_stmt" , async function (node) {})
Interpreter.install("eval_tenary_expr" , async function (node) {})
Interpreter.install("eval_while_stmt" , async function (node) {})
Interpreter.install("eval_untill_stmt" , async function (node) {})
Interpreter.install("eval_for_stmt" , async function (node) {})
Interpreter.install("eval_forEach_stmt" , async function (node) {})
Interpreter.install("eval_repeat_stmt" , async function (node) {})


Interpreter.install("eval_bool_const" , function (node) {
    interpreter_vars.value_stack.push(node.value);
    node.undo.push( () => interpreter_vars.value_stack.pop());
})
Interpreter.install("eval_null_const" , function (node) {
    interpreter_vars.value_stack.push(node.value);
    node.undo.push( () => interpreter_vars.value_stack.pop());
})
Interpreter.install("eval_text_const" , function (node) {
    interpreter_vars.value_stack.push(node.value);
    node.undo.push( () => interpreter_vars.value_stack.pop());
})
Interpreter.install("eval_colour_const" , function (node) {
    interpreter_vars.value_stack.push(node.value);
    node.undo.push( () => interpreter_vars.value_stack.pop());
})
Interpreter.install("eval_number" , function (node) {
    interpreter_vars.value_stack.push(node.value);
    node.undo.push( () => interpreter_vars.value_stack.pop());
})

//return gets pushed in the stack, break and continue have turned into jumps
//we dont need the 'keyword' anymore
//Interpreter.install("eval_keyword" , async function (node) {}) 

Interpreter.install("eval_logic_expr" , async function (node) {
    var logic_funcs = {
        "AND" : function(lhs, rhs){
            interpreter_vars.value_stack.push(lhs && rhs);
        },

        "OR" : function(lhs, rhs){
            interpreter_vars.value_stack.push(lhs || rhs);
        },
        "EQ" : function(lhs, rhs){
            interpreter_vars.value_stack.push(lhs == rhs);
        },
        "NEQ" : function(lhs, rhs){
            interpreter_vars.value_stack.push(lhs != rhs);
        },
        "LT" : function(lhs, rhs){
            interpreter_vars.value_stack.push(lhs < rhs);
        },
        "LTE" : function(lhs, rhs){
            interpreter_vars.value_stack.push(lhs <= rhs);
        },
        "GT" : function(lhs, rhs){
            interpreter_vars.value_stack.push(lhs > rhs);
        },
        "GTE" : function(lhs, rhs){
            interpreter_vars.value_stack.push(lhs >= rhs);
        },
        "NOT" : function(lhs){
            interpreter_vars.value_stack.push(!lhs);
        }
    }

    if (node.op == "NOT"){
        var lhs = interpreter_vars.value_stack.pop();
        logic_funcs[node.op](lhs);

        node.undo.push( function() {
            interpreter_vars.value_stack.pop();
            interpreter_vars.value_stack.push(lhs);
        })
    }else{
        var rhs = interpreter_vars.value_stack.pop();
        var lhs = interpreter_vars.value_stack.pop();

        logic_funcs[node.op](lhs, rhs);

        node.undo.push( function() {
            interpreter_vars.value_stack.pop();
            interpreter_vars.value_stack.push(lhs);
            interpreter_vars.value_stack.push(rhs);
        })
    }  
})

Interpreter.install("eval_assign_expr" , async function (node) {
    var old_val;
    if (this.userVars[node.lval] === undefined)
        old_val = undefined;
    else
        old_val = this.userVars[node.lval][0];

    var curr_val = interpreter_vars.value_stack.pop()
    this.userVars[node.lval] = [curr_val, false];

    node.undo.push( function() {
        interpreter_vars.value_stack.push(curr_val);
        Interpreter.userVars[node.lval] = [old_val, false];
    })
})

//used for the tmp vars inside the loop stmts
Interpreter.install("eval_assign_expr_tmp" , async function (node) {
    var old_val;
    if (this.userVars[node.lval] === undefined)
        old_val = undefined;
    else
        old_val = this.userVars[node.lval][0];

    var curr_val = interpreter_vars.value_stack.pop()
    this.userVars[node.lval] = [curr_val, true]; //true == dont show in the variables section

    node.undo.push( function() {
        interpreter_vars.value_stack.push(curr_val);
        Interpreter.userVars[node.lval] = [old_val, true];
    })
})

Interpreter.install("eval_assign_list_len" , async function (node) {
    var value = interpreter_vars.value_stack.pop();
    if (value === undefined)
        this.userVars[node.lval] = [0, true]
    else{
        this.userVars[node.lval] = [value.length, true]
    }

    interpreter_vars.value_stack.push(value);

    node.undo.push( function() {
        delete Interpreter.userVars[node.lval];
    })
})

Interpreter.install("eval_arithm_expr" , async function (node) {
    var rhs = interpreter_vars.value_stack.pop()
    var lhs = interpreter_vars.value_stack.pop()

    var arithm_funcs = {
        "ADD" : function(lhs, rhs){
            interpreter_vars.value_stack.push(lhs + rhs);
        },
        "MINUS" : function(lhs, rhs){
            interpreter_vars.value_stack.push(lhs - rhs);
        },
        "MULTIPLY" : function(lhs, rhs){
            interpreter_vars.value_stack.push(lhs * rhs);
        },
        "DIVIDE" : function(lhs, rhs){
            interpreter_vars.value_stack.push(lhs / rhs);
        },
        "POWER" : function(lhs, rhs){
            interpreter_vars.value_stack.push(Math.pow(lhs, rhs));
        }
    }

    arithm_funcs[node.op](lhs, rhs);
    node.undo.push( function(){
        interpreter_vars.value_stack.pop();
        interpreter_vars.value_stack.push(lhs);
        interpreter_vars.value_stack.push(rhs);
    })
})

Interpreter.install("eval_var_decl" , function (node) {
    this.userVars[node.name] = [undefined, false];
})

Interpreter.install("eval_var" , function (node) {
    var val = this.userVars[node.name];
    if (val !== undefined)
        val = val[0] //0 is the value, 1 is true or false (tmp variable or not)
    interpreter_vars.value_stack.push(val);

    node.undo.push( function() {
        interpreter_vars.value_stack.pop();
    })
})

//tmp var used only from the reapeat stmt
Interpreter.install("eval_tmp_var" , function (node) {
    if (node.name === undefined){
        var name = 'count';
        while (name in this.userVars){
            name += '.' //create a var that doesn't exist
        }
        this.userVars[name] = [-1, true];
        node.name = name
    }
    this.userVars[node.name][0]++;
    interpreter_vars.value_stack.push(this.userVars[node.name][0]);
    node.undo.push( function() {
        interpreter_vars.value_stack.pop();
        Interpreter.userVars[node.name][0]--; //if == -1 we should delete it, but its ok because we will have a faster exec time once run forwards
    })
})

// //tmp list used only for the forEach stmt
// Interpreter.install("eval_tmp_list" , function (node) {
//     var list = interpreter_vars.value_stack.pop();
//     if (node.length === undefined){
//         try{
//             node.length = list.length;
//         }catch(e){
//             node.length = 0
//         }
//     }
//     interpreter_vars.value_stack.push(node.length);

//     node.undo.push( function() {
//         interpreter_vars.value_stack.pop();
//         interpreter_vars.value_stack.push(list);
//     })
// })

Interpreter.install("eval_var_change" , async function (node) {
    var old_val;
    if (this.userVars[node.var_name][0] === undefined){
        this.userVars[node.var_name][0] = 0;
        old_val = undefined
    }else{
        old_val = this.userVars[node.var_name][0]
    }
    var change_val = interpreter_vars.value_stack.pop();
    this.userVars[node.var_name][0] += change_val;

    node.undo.push( function() {
        interpreter_vars.value_stack.push(change_val);
    })

    return [node.var_name, old_val];
})

Interpreter.install("eval_js_func_call" , async function (node) {
    var args = []
    var i = 0;
    while (i < node.arg_count){
        args.push(interpreter_vars.value_stack.pop())
        i++;
    }
    if (node.name == 'window.alert') //for testing. correct is window.alert no console.log
        console.log('' + args[0])
    else{
        var func = node.name + "(" + args + ")";
        eval(func)
    }

    node.undo.push( function() {
        var i = 0;
        while (i < node.arg_count){
            interpreter_vars.value_stack.push(args.pop()) //TODO: is it the right way or maybe reversed?
            i++;
        }
    })
    
})

//nothing needs to be done, we already declared this func in init
Interpreter.install("eval_userfunc_decl" , async function (node) {})

var old_env = []
Interpreter.install("eval_userfunc_call" , async function (node) {
    var old_vars    = []
    var args = []
 
    for (var arg in node.arg_names.reverse()){ //in reverse, values are pushed the same way
        var arg_name = node.arg_names[arg]
        old_vars[arg_name] = this.userVars[arg_name][0];

        var argument = interpreter_vars.value_stack.pop()
        args.push(argument)
        this.userVars[arg_name] = [argument, false];
    }
    node.arg_names.reverse() //once done reverse it again. We might use it in the future.

    old_env.push({'old_vars' : old_vars, 'pc' : interpreter_vars.pc})

    blockly_debuggee.state.currCallNesting++;

    interpreter_vars.offset = node.start_pc - interpreter_vars.pc;

    node.undo.push( function() { //TODO: like this or reversed?
        for (var i = 0; i < args.length; i++){
            interpreter_vars.value_stack.push(args[i]);
        }

        var env = old_env.pop();
        var old_vars = env.old_vars;

        for (var arg in node.arg_names){ //restore old user variables
            var arg_name = node.arg_names[arg]
            Interpreter.userVars[arg_name][0] = old_vars[arg_name];
        }
        blockly_debuggee.state.currCallNesting--;
    })

})

Interpreter.install("eval_userfunc_exit" , async function (node) {
    var env = old_env.pop();
    var old_vars = env.old_vars;
    interpreter_vars.offset = env.pc - interpreter_vars.pc + 1; //restore pc and go to the next instruction

    var last_values = []// for restoring while reversing 
    for (var arg in node.arg_names){ //restore old user variables
        var arg_name = node.arg_names[arg]
        last_values[arg_name] = this.userVars[arg_name][0]
        this.userVars[arg_name][0] = old_vars[arg_name];
    }
    blockly_debuggee.state.currCallNesting--;

    var exit_pc = interpreter_vars.pc + interpreter_vars.offset - 1; //will be used when entering a funcion while reversing
    if (interpreter_vars.reverse_func_val[node.name] === undefined){
        interpreter_vars.reverse_func_val[node.name] = [[exit_pc, last_values]];
    }else{
        interpreter_vars.reverse_func_val[node.name].push([exit_pc, last_values]);
    }

    node.undo.push( function() {
        var old_vars    = []
        var [exit_pc, curr_values] = interpreter_vars.reverse_func_val[node.name].pop();

        for (var arg in node.arg_names.reverse()){ //in reverse, values are pushed the same way
            var arg_name = node.arg_names[arg]
            old_vars[arg_name] = Interpreter.userVars[arg_name][0];
            Interpreter.userVars[arg_name] = [curr_values[arg_name], false];
            //Interpreter.userVars[arg_name] = [interpreter_vars.value_stack.pop(), false];
        }
        node.arg_names.reverse() //once done reverse it again. We might use it in the future.

        old_env.push({'old_vars' : old_vars, 'pc' : exit_pc})

        blockly_debuggee.state.currCallNesting++;
    })
    
})

Interpreter.install("eval_libfunc_call", async function(node){
    var func    = LibraryFuncs[node.name];
    var args    = []; // as an array

    var i = 0;
    while (i < node.arg_count){
        args.push(interpreter_vars.value_stack.pop())
        i++;
    }

    node.undo.push( function() {
        interpreter_vars.value_stack.pop();
        var i = 0;
        while (i < node.arg_count){
            interpreter_vars.value_stack.push(args.pop()) //TODO: is it the right way or maybe reversed?
            i++;
        }
    })

    args = args.reverse(); //because when poping from the stack, args are reversed

    args.unshift(node.param);

    interpreter_vars.value_stack.push(func(args));
})

Interpreter.install("eval_list_create" , async function (node) {
    var i = 0;
    var list = [];
    while (i < node.items_count){
        list.push(interpreter_vars.value_stack.pop());
        i++;
    }
    interpreter_vars.value_stack.push(list.reverse());

    node.undo.push( function() { //TODO: is it the right way or maybe reversed?
        interpreter_vars.value_stack.pop();

        var i = 0;
        list.reverse();
        while (i < node.items_count){
            interpreter_vars.value_stack.push(list.pop());
            i++;
        }
        
    })
})

Interpreter.install("eval_list_index" , async function (node) {
    var index  = interpreter_vars.value_stack.pop();
    var list   = interpreter_vars.value_stack.pop();

    interpreter_vars.value_stack.push(list[index - 1]);

    node.undo.push( function() {
        interpreter_vars.value_stack.pop();
        interpreter_vars.value_stack.push(list);
        interpreter_vars.value_stack.push(index);
    })
})

Interpreter.install("eval_property" , async function (node) {
    var args = []
    for (var i = 0; i < node.arg_count; i++){
        args.push(interpreter_vars.value_stack.pop())
    }

    var item = interpreter_vars.value_stack.pop();
    if (item === undefined){
        throw "Error: Cannot read property " + node.name +  " of undefined. List item is undefined.";
    }

    var command;
    if (typeof item === "object"){ //array (list)
        command = "[" + item + "]" + node.name
    }else { //string
        command = "'" + item + "'" + node.name
    }


    if (args.length > 0){
        command += '(';
        for (var i = 0; i < node.arg_count; i++){
            if (typeof args[i] === "string"){
                command += "'";
                command += args[i];
                command += "'"
            }else if(typeof args[i] === "object"){
                command += "[";
                command += args[i];
                command += "]"
            }else{ //number etc
                command += args[i];
            }

            if (i < node.arg_count){
                command += ', ';
            }
        }
        command += ')';
    }

    var res = eval(command)

    interpreter_vars.value_stack.push(res)

    node.undo.push( function() {
        interpreter_vars.value_stack.pop();
        interpreter_vars.value_stack.push(item);

        for (var i = 0; i < node.arg_count; i++){
            interpreter_vars.value_stack.push(args.pop()) //TODO: reverse or ok?
        }
    })
})

blockly_debuggee.Interpreter = Interpreter;