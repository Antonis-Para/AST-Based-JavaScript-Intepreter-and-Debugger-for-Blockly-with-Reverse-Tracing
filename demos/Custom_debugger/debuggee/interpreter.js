import {blockly_debuggee, Interpreter} from "./init.js";
import {LibraryFuncs} from "./libfuncs.js"
export {blockly_debuggee};



Interpreter.install("init" , function(ast){
    for(var attributename in ast.data){
        var type = ast.data[attributename].type
        if (type == "func_decl"){
            var name = ast.data[attributename].name
            this.userFuncs[name] = ast.data[attributename].do;
            this.userFuncs[name].id = ast.data[attributename].id;
            this.userFuncs[name].blockNesting = 1;
            delete ast.data[attributename]
        }
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
    return res; //return the last command (used for userfuncs, for example return 5;)
})

Interpreter.install("eval_if_stmt" , async function (node) {
    var i = 0;
    for (var cond in node.cond){
        if (await this.eval(node.cond[cond])){
            await this.eval(node.do[i])
            return null;
        }
        i++
    }

    await this.eval(node.default)

    return null;
})
Interpreter.install("eval_if_else_stmt" , (node) => this.eval_if_stmt(node))

Interpreter.install("eval_while_stmt" , async function (node) {
    while (await this.eval(node.cond)){
        try {
            await this.eval(node.do)
        }catch (msg) {
            if (msg == 'break') break;
            //continue doesn't need a special case
        }
    }
})

Interpreter.install("eval_untill_stmt" , async function (node) {
    while (!await this.eval(node.cond)){
        try {
            await this.eval(node.do)
        }catch (msg) {
            if (msg == 'break') break;
            //continue doesn't need a special case
        }
    }
})

Interpreter.install("eval_for_stmt" , async function (node) {
    var from = await this.eval(node.from)
    //var to   = await this.eval(node.to)
    //var step = await this.eval(node.by)
    var i    = (this.userVars[node.var_name] = from);

    for (i = from; i <= await this.eval(node.to); i = (this.userVars[node.var_name] += await this.eval(node.by)) ){
        try {
            await this.eval(node.do)
        }catch (msg) {
            if (msg == 'break') break;
            //continue doesn't need a special case
        }
    }
})

Interpreter.install("eval_forEach_stmt" , async function (node) {
    var list = await this.eval(node.in)

    for (var i in list){
        this.userVars[node.var_name] = list[i]
        try {
            await this.eval(node.do)
        }catch (msg) {
            if (msg == 'break') break;
            //continue doesn't need a special case
        }
    }
    })

Interpreter.install("eval_repeat_stmt" , async function (node) { 

    for (var i = 0; i < await this.eval(node.cond); i++){
        try {
            await this.eval(node.do)
        }catch (msg) {
            if (msg == 'break') break;
            //continue doesn't need a special case
        }
    }
    })

Interpreter.install("eval_bool_const" , function (node) {
    return node.value;
})
Interpreter.install("eval_null_const" , function (node) {
    return node.value;
})
Interpreter.install("eval_text_const" , function (node) {
    return node.value;
})
Interpreter.install("eval_colour_const" , function (node) {
    return node.value;
})
Interpreter.install("eval_number" , function (node) {
    return node.value
})
Interpreter.install("eval_keyword" , async function (node) {
    switch(node.name){
        case 'return':
            return await this.eval(node.value)
        case 'break':
            throw 'break';
        case 'continue':
            throw 'continue';
    }
        
})

Interpreter.install("eval_logic_expr" , async function (node) {
    switch(node.op){
        case "AND":
            return await this.eval(node.lval) && await this.eval(node.rval);
        case "OR":
            return await this.eval(node.lval) || await this.eval(node.rval);
        case "EQ":
            return await this.eval(node.lval) == await this.eval(node.rval);
        case "NEQ":
            return await this.eval(node.lval) != await this.eval(node.rval);
        case "LT":
            return await this.eval(node.lval) < await this.eval(node.rval);
        case "LTE":
            return await this.eval(node.lval) <= await this.eval(node.rval);
        case "GT":
            return await this.eval(node.lval) > await this.eval(node.rval);
        case "GTE":
            return await this.eval(node.lval) >= await this.eval(node.rval);
    }
})

Interpreter.install("eval_tenary_expr" , async function (node) {
    return await this.eval(node.if) ? await this.eval(node.then): await this.eval(node.else);
})

Interpreter.install("eval_assign_expr" , async function (node) {
    this.userVars[node.lval] = await this.eval(node.rval)
})

Interpreter.install("eval_arithm_expr" , async function (node) {
    switch(node.op){
        case 'ADD':
            return await this.eval(node.lval) + await this.eval(node.rval)
        case 'MINUS':
            return await this.eval(node.lval.value) - await this.eval(node.rval.value)
        case 'MULTIPLY':
            return await this.eval(node.lval.value) * await this.eval(node.rval.value)
        case 'DIVIDE':
            return await this.eval(node.lval.value) / await this.eval(node.rval.value)
        case 'POWER':
            return Math.pow(this.eval(node.lval.value), await this.eval(node.rval.value));
    }
})

Interpreter.install("eval_var_decl" , function (node) {
    this.userVars[node.name] = undefined;
})

Interpreter.install("eval_var" , function (node) {
    return this.userVars[node.name];
})

Interpreter.install("eval_var_change" , async function (node) {
    if (this.userVars[node.var_name] === undefined)
        this.userVars[node.var_name] = 0;
    this.userVars[node.var_name] += await this.eval(node.value);
})

Interpreter.install("eval_func_call" , async function (node) {
    var args = []
    for (var arg in node.args){
        //await this.eval(node.args[arg]).then((val) =>args.push(val))
        args.push(await this.eval(node.args[arg]));
    }
    if (node.name == 'window.alert') //for testing. correct is window.alert
        console.log('' + args[0])
    else{
        var func = node.name + "(" + args + ")";
        eval(func)
    }
})

//"eval_func_decl" : function (node) {}, //nothing needs to be done, we already declared this func in init

Interpreter.install("eval_userfunc_call" , async function (node) {
    var func    = this.userFuncs[node.name];
    var old_vars    = []

    for (var arg in node.arg_names){
        var arg_name = node.arg_names[arg]
        old_vars[arg_name] = this.userVars[arg_name];
        this.userVars[arg_name] = await this.eval(node.args[arg])
    }

    blockly_debuggee.state.currCallNesting++;
    var result  = await this.eval(func);
    for (var arg in node.arg_names){ //restore old user variables
        var arg_name = node.arg_names[arg]
        this.userVars[arg_name] = old_vars[arg_name];
    }
    blockly_debuggee.state.currCallNesting--;
    return result
})

Interpreter.install("eval_libfunc_call", async function(node){
    var func    = LibraryFuncs[node.name];
    var args    = []; // as an array
    for (var arg in node.args){
        args.push(await this.eval(node.args[arg]));
    }
    args.unshift(node.param);

    var result  = func(args);
    return result;
})

Interpreter.install("eval_list_create" , async function (node) {
    var list = []
    for (var item in node.items){
        list.push(await this.eval(node.items[item]))
    }
    return list;
})
Interpreter.install("eval_list_index" , async function (node) {
    var list = await this.eval(node.list)
    return list[await this.eval(node.index) - 1];
})
Interpreter.install("eval_property" , async function (node) {
    var item = await this.eval(node.item)
    var arg;
    if (node.arg !== undefined){
        arg = await this.eval(node.arg)
    }

    if (item === undefined){
        throw "Error: Cannot read property " + node.name +  " of undefined. List item is undefined.";
    }

    var command;
    if (typeof item === "object"){ //array (list)
        command = "[" + item + "]" + node.name
    }else { //string
        command = "'" + item + "'" + node.name
    }

    if (arg !== undefined ){
        command += '(';
        if (typeof arg === "string"){
            command += "'";
            command += arg;
            command += "'"
        }else if(typeof arg === "object"){
            command += "[";
            command += arg;
            command += "]"
        }else{ //number etc
            command += arg;
        }
        command += ')';
    }

    var res = eval(command)
    return res;
})

blockly_debuggee.Interpreter = Interpreter;