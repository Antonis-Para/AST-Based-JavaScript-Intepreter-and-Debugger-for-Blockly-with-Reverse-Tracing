import {blockly_debuggee, Interpreter, astVisitor} from "./init.js";
import {LibraryFuncs} from "./libfuncs.js"
export {blockly_debuggee};

var interpreter_vars = {
    instructions    : [],
    value_stack     : [],
    pc              : 0,
    offset          : 0
}

function nextPc(){
    if (interpreter_vars.offset != 0){
        interpreter_vars.pc += interpreter_vars.offset
        interpreter_vars.offset = 0;
    }
    else
        interpreter_vars.pc++;
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
    while (interpreter_vars.pc < interpreter_vars.instructions.length){
        var n = interpreter_vars.instructions[interpreter_vars.pc]
        await this.eval(n);
        nextPc();
    }
})

Interpreter.install("eval" , async function (node) {
    await blockly_debuggee.TraceCommandHandler.wait(node)

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


//All these stmts have been turned into instruction. Howeven I want to be able to highlight 
//the blocks so I simply install them and do nothing with them
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
    var rhs = interpreter_vars.value_stack.pop()
    var lhs = interpreter_vars.value_stack.pop()
    switch(node.op){
        case "AND":
            interpreter_vars.value_stack.push(lhs && rhs);
            break;
        case "OR":
            interpreter_vars.value_stack.push(lhs || rhs);
            break;
        case "EQ":
            interpreter_vars.value_stack.push(lhs == rhs);
            break;
        case "NEQ":
            interpreter_vars.value_stack.push(lhs != rhs);
            break;
        case "LT":
            interpreter_vars.value_stack.push(lhs < rhs);
            break;
        case "LTE":
            interpreter_vars.value_stack.push(lhs <= rhs);
            break;
        case "GT":
            interpreter_vars.value_stack.push(lhs > rhs);
            break;
        case "GTE":
            interpreter_vars.value_stack.push(lhs >= rhs);
            break;
    }
})

Interpreter.install("eval_assign_expr" , async function (node) {
    this.userVars[node.lval] = interpreter_vars.value_stack.pop()
})

Interpreter.install("eval_arithm_expr" , async function (node) {
    var rhs = interpreter_vars.value_stack.pop()
    var lhs = interpreter_vars.value_stack.pop()
    switch(node.op){
        case 'ADD':
            interpreter_vars.value_stack.push(lhs + rhs);
            break;
        case 'MINUS':
            interpreter_vars.value_stack.push(lhs - rhs);
            break;
        case 'MULTIPLY':
            interpreter_vars.value_stack.push(lhs * rhs);
            break;
        case 'DIVIDE':
            interpreter_vars.value_stack.push(lhs / rhs);
            break;
        case 'POWER':
            interpreter_vars.value_stack.push(Math.pow(lhs, rhs));
            break;
    }
})

Interpreter.install("eval_var_decl" , function (node) {
    this.userVars[node.name] = undefined;
})

Interpreter.install("eval_var" , function (node) {
    interpreter_vars.value_stack.push(this.userVars[node.name]);
})

//tmp var used only from the reapeat stmt
Interpreter.install("eval_tmp_var" , function (node) {
    if (node.name === undefined){
        var name = 'count';
        while (name in this.userVars){
            name += '.' //create a var that doesn't exist
        }
        this.userVars[name] = -1;
        node.name = name
    }
    this.userVars[node.name]++;
    interpreter_vars.value_stack.push(this.userVars[node.name]);
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
    if (this.userVars[node.var_name] === undefined)
        this.userVars[node.var_name] = 0;
    this.userVars[node.var_name] += interpreter_vars.value_stack.pop();
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
        old_vars[arg_name] = this.userVars[arg_name];
        this.userVars[arg_name] = interpreter_vars.value_stack.pop();
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
        this.userVars[arg_name] = old_vars[arg_name];
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
    var list    = interpreter_vars.value_stack.pop();
    var index   = interpreter_vars.value_stack.pop();

    interpreter_vars.value_stack.push(list[index - 1]);
})

Interpreter.install("eval_property" , async function (node) {
    var item = interpreter_vars.value_stack.pop();

    var command = "'" + item + "'" + node.name
    var res = eval(command)

    interpreter_vars.value_stack.push(res)
})

blockly_debuggee.Interpreter = Interpreter;