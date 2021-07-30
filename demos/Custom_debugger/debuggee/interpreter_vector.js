import {blockly_debuggee, Interpreter, astVisitor} from "./init.js";
import {LibraryFuncs} from "./libfuncs.js"
export {blockly_debuggee};

var interpreter_vars = {
    instructions    : [],
    value_stack     : [],
    pc              : 0,
    offset          : 0,
    reverse_pc      : [[undefined, undefined]]
}

function nextPc(assign_val){ //assign val is an array of [var, value]. Exists only in the assign stmts, else undefined
    if (Interpreter.in_reverse){
        var arr;
        [interpreter_vars.pc, arr] = interpreter_vars.reverse_pc.pop();

        if (arr !== undefined){
            var variable, value;
            [variable, value] = arr
            Interpreter.userVars[variable] = [value, false];
        }
    }

    else if (interpreter_vars.offset != 0){
        interpreter_vars.reverse_pc.push([interpreter_vars.pc, assign_val]);
        interpreter_vars.pc += interpreter_vars.offset
        interpreter_vars.offset = 0;
    }

    else{
        interpreter_vars.reverse_pc.push([interpreter_vars.pc, assign_val]);
        interpreter_vars.pc++;
    }
    
    
}

Interpreter.install("init" , function(ast){
    interpreter_vars.instructions = astVisitor.accept("serializeAST_visitor" ,ast);
    for(var funcname in ast.data){ //uses the ast to find the func_decl. It is faster than the instructions[] as it only checks the first level
        var type = ast.data[funcname].type
        if (type == "func_decl"){
            var name = ast.data[funcname].name
            this.userFuncs[name] = ast.data[funcname].do;
            this.userFuncs[name].id = ast.data[funcname].id;
            this.userFuncs[name].blockNesting = 1;
            delete ast.data[funcname]
        }
    }
})


Interpreter.install("eval_instructions" , async function (node) {
    while (interpreter_vars.pc < interpreter_vars.instructions.length){ //or when pc === undefined
        var n = interpreter_vars.instructions[interpreter_vars.pc]
        let assign = await this.eval(n); //only assign expr will return something
        nextPc(assign);
    }
})

Interpreter.install("eval" , async function (node) {
    await blockly_debuggee.TraceCommandHandler.wait(node)
    
    if (Interpreter.in_reverse)
        return;

    return this["eval_" + node.type](node);
})

Interpreter.install("eval_stmts" , async function (node) {
    var res;

    for (var stmt in node.data){
        res = await this.eval(node.data[stmt]);
    }
    interpreter_vars.value_stack.push(res) //return the last command (used for userfuncs, for example return 5;)
})

Interpreter.install("eval_if_false_offset" , async function (node) {
    var val = interpreter_vars.value_stack.pop();
    if(!val)
        interpreter_vars.offset = node.pc_offset;
})

Interpreter.install("eval_if_true_offset" , async function (node) {
    var val = interpreter_vars.value_stack.pop();
    if(val)
        interpreter_vars.offset = node.pc_offset;
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
    interpreter_vars.value_stack.push(node.value)
})
Interpreter.install("eval_null_const" , function (node) {
    interpreter_vars.value_stack.push(node.value)
})
Interpreter.install("eval_text_const" , function (node) {
    interpreter_vars.value_stack.push(node.value)
})
Interpreter.install("eval_colour_const" , function (node) {
    interpreter_vars.value_stack.push(node.value)
})
Interpreter.install("eval_number" , function (node) {
    interpreter_vars.value_stack.push(node.value)
})

//return gets pushed in the stack, break and continue have turned into jumps
//we dont need the 'keyword' anymore
//Interpreter.install("eval_keyword" , async function (node) {}) 

Interpreter.install("eval_logic_expr" , async function (node) {

    var logic_funcs = {
        "AND" : function(){
            var rhs = interpreter_vars.value_stack.pop();
            var lhs = interpreter_vars.value_stack.pop();
            interpreter_vars.value_stack.push(lhs && rhs);
        },

        "OR" : function(){
            var rhs = interpreter_vars.value_stack.pop();
            var lhs = interpreter_vars.value_stack.pop();
            interpreter_vars.value_stack.push(lhs || rhs);
        },
        "EQ" : function(){
            var rhs = interpreter_vars.value_stack.pop();
            var lhs = interpreter_vars.value_stack.pop();
            interpreter_vars.value_stack.push(lhs == rhs);
        },
        "NEQ" : function(){
            var rhs = interpreter_vars.value_stack.pop();
            var lhs = interpreter_vars.value_stack.pop();
            interpreter_vars.value_stack.push(lhs != rhs);
        },
        "LT" : function(){
            var rhs = interpreter_vars.value_stack.pop();
            var lhs = interpreter_vars.value_stack.pop();
            interpreter_vars.value_stack.push(lhs < rhs);
        },
        "LTE" : function(){
            var rhs = interpreter_vars.value_stack.pop();
            var lhs = interpreter_vars.value_stack.pop();
            interpreter_vars.value_stack.push(lhs <= rhs);
        },
        "GT" : function(){
            var rhs = interpreter_vars.value_stack.pop();
            var lhs = interpreter_vars.value_stack.pop();
            interpreter_vars.value_stack.push(lhs > rhs);
        },
        "GTE" : function(){
            var rhs = interpreter_vars.value_stack.pop();
            var lhs = interpreter_vars.value_stack.pop();
            interpreter_vars.value_stack.push(lhs >= rhs);
        },
        "NOT" : function(){
            var lhs = interpreter_vars.value_stack.pop();
            interpreter_vars.value_stack.push(!lhs);
        }
    }

    logic_funcs[node.op]();
    
})

Interpreter.install("eval_assign_expr" , async function (node) {
    var old_val;
    if (this.userVars[node.lval] === undefined)
        old_val = undefined;
    else
        old_val = this.userVars[node.lval][0];

    this.userVars[node.lval] = [interpreter_vars.value_stack.pop(), false];
    return [node.lval, old_val]; //to save in the reverse stack
})

//used for the tmp vars inside the loop stmts
Interpreter.install("eval_assign_expr_tmp" , async function (node) {
    var old_val;
    if (this.userVars[node.lval] === undefined)
        old_val = undefined;
    else
        old_val = this.userVars[node.lval][0];
    this.userVars[node.lval] = [interpreter_vars.value_stack.pop(), true]; //true == dont show in the variables section
    return [node.lval, old_val]; //to save in the reverse stack
})

Interpreter.install("eval_assign_list_len" , async function (node) {
    var value = interpreter_vars.value_stack.pop();
    if (value === undefined)
        this.userVars[node.lval] = [0, true]
    else{
        this.userVars[node.lval] = [value.length, true]
    }
    
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
})

Interpreter.install("eval_var_decl" , function (node) {
    this.userVars[node.name] = [undefined, false];
})

Interpreter.install("eval_var" , function (node) {
    var val = this.userVars[node.name];
    if (val !== undefined)
        val = val[0] //0 is the value, 1 is true or false (tmp variable or not)
    interpreter_vars.value_stack.push(val);
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
})

//tmp list used only for the forEach stmt
Interpreter.install("eval_tmp_list" , function (node) {
    var list = interpreter_vars.value_stack.pop();
    if (node.length === undefined){
        try{
            node.length = list.length;
        }catch(e){
            node.length = 0
        }
    }
    interpreter_vars.value_stack.push(node.length);
})

Interpreter.install("eval_var_change" , async function (node) {
    if (this.userVars[node.var_name][0] === undefined)
        this.userVars[node.var_name][0] = 0;
    this.userVars[node.var_name][0] += interpreter_vars.value_stack.pop();
})

Interpreter.install("eval_func_call" , async function (node) {
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
})

//nothing needs to be done, we already declared this func in init
Interpreter.install("eval_func_decl" , async function (node) {})

var old_env = []
Interpreter.install("eval_userfunc_call" , async function (node) {
    var old_vars    = []

    for (var arg in node.arg_names.reverse()){ //in reverse, values are pushed the same way
        var arg_name = node.arg_names[arg]
        old_vars[arg_name] = this.userVars[arg_name][0];
        this.userVars[arg_name] = [interpreter_vars.value_stack.pop(), false];
    }
    old_env.push({'old_vars' : old_vars, 'pc' : interpreter_vars.pc})

    blockly_debuggee.state.currCallNesting++;

    interpreter_vars.offset = node.start_pc - interpreter_vars.pc;
})

Interpreter.install("eval_userfunc_exit" , async function (node) {
    var env = old_env.pop();
    var old_vars = env.old_vars;
    interpreter_vars.offset = env.pc - interpreter_vars.pc + 1; //restore pc and go to the next instruction

    for (var arg in node.arg_names){ //restore old user variables
        var arg_name = node.arg_names[arg]
        this.userVars[arg_name][0] = old_vars[arg_name];
    }
    blockly_debuggee.state.currCallNesting--;

})

Interpreter.install("eval_libfunc_call", async function(node){
    var func    = LibraryFuncs[node.name];
    var args    = []; // as an array

    var i = 0;
    while (i < node.arg_count){
        args.push(interpreter_vars.value_stack.pop())
        i++;
    }

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
})

Interpreter.install("eval_list_index" , async function (node) {
    var index  = interpreter_vars.value_stack.pop();
    var list   = interpreter_vars.value_stack.pop();

    interpreter_vars.value_stack.push(list[index - 1]);
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
})

blockly_debuggee.Interpreter = Interpreter;