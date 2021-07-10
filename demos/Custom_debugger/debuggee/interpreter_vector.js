import {blockly_debuggee, Interpreter, astVisitor} from "./init.js";
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

    interpreter_vars.offset = node.pc - interpreter_vars.pc;
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

    func(args);
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


/* --------------------All library function------------------- */
var LibraryFuncs = {
    "list_methods":{
        "getIndex_fromEnd"          : (list, pos)           => list.slice(-pos)[0] ,
        "popIndex_fromStart"        : (list, pos)           => list.splice(pos-1, 1)[0],
        "popIndex_first"            : (list)                => list.shift(),
        "popIndex_fromEnd"          : (list, pos)           => list.splice(-pos, 1)[0],
        "popIndex_last"             : (list)                => list.pop(),
        "set_from_start"            : (list, pos, val)      => (list)[pos - 1] = val,
        "set_from_end"              : (list, pos, val)      => (list)[list.length - pos] = val,
        "set_first"                 : (list, val)           => (list)[0] = val,
        "set_last"                  : (list, val)           => (list)[list.length - 1] = val,
        "set_random"                : (list, val)           => (list)[Math.floor(Math.random() * list.length)] = val,
        "insert_from_start"         : (list, pos, val)      => list.splice(pos - 1, 0, val),
        "insert_from_end"           : (list, pos, val)      => list.splice(list.length - pos, 0, val),
        "insert_first"              : (list, val)           => list.unshift(val),
        "insert_last"               : (list, val)           => list.push(val),
        "insert_random"             : (list, val)           => list.splice(Math.floor(Math.random() * list.length), 0, val),
        "get_from_start_from_start" : (list, pos1, pos2)    => list.slice(pos1 - 1, pos2),
        "get_from_start_from_end"   : (list, pos1, pos2)    => list.slice(pos1 - 1, list.length - pos2 - 1),
        "get_from_start_last"       : (list, pos1)          => list.slice(pos1 - 1, list.length1),
        "get_from_end_from_start"   : (list, pos1, pos2)    => list.slice(list.length - pos1, pos2),
        "get_from_end_from_end"     : (list, pos1, pos2)    => list.slice(list.length - pos1, list.length - pos2 - 1),
        "get_from_end_last"         : (list, pos1)          => list.slice(list.length - pos1, list.length),
        "get_first_from_start"      : (list, pos2)          => list.slice(0, pos2),
        "get_first_from_end"        : (list, pos2)          => list.slice(0, list.length - pos2 - 1),
        "get_first_last"            : (list)                => list.slice(0),
        "split"                     : (text, delim)         => text.split(delim),
        "join"                      : (list, delim)         => list.join(delim),
        "random"                    : function (list, remove) {
            function listsGetRandomItem(list, remove) {
                var x = Math.floor(Math.random() * list.length);
                if (remove) {
                    return list.splice(x, 1)[0];
                } else {
                    return list[x];
                }
            }    
            return listsGetRandomItem(list, remove);
        },
        "repeat"                    : function (list, val) {
            function listsRepeat(value, n) {
                var array = [];
                for (var i = 0; i < n; i++) {
                    array[i] = value;
                }
                return array;
            }      
    
            return listsRepeat(list, val);
        },
        "sort"                      : function (list, sort_type, direction) {
            function listsGetSortCompare(type, direction) {
                var compareFuncs = {
                    "NUMERIC": function(a, b) {
                        return Number(a) - Number(b); },
                    "TEXT": function(a, b) {
                        return a.toString() > b.toString() ? 1 : -1; },
                    "IGNORE_CASE": function(a, b) {
                        return a.toString().toLowerCase() > b.toString().toLowerCase() ? 1 : -1; },
                };
                var compare = compareFuncs[type];
                return function(a, b) { return compare(a, b) * direction; }
                }
                
                list.slice().sort(listsGetSortCompare(sort_type, direction));
        }
    },

    "math_methods":{
        "atan2"         : (x, y)            => Math.atan2(y, x) / Math.PI * 180, //y,x
        "constraint"    : (arg1, arg2, arg3)=> Math.min(Math.max(arg1, arg2), arg3 ),
        "even"          : (arg)             => arg % 2 == 0 ,
        "odd"           : (arg)             => arg % 2 == 1,
        "whole"         : (arg)             => arg % 1 == 0,
        "positive"      : (arg)             => arg > 0,
        "negative"      : (arg)             => arg < 0,
        "divisible_by"  : (arg1, arg2)      => arg1 % arg2 == 0,
        "root"          : (arg)             => Math.sqrt(arg),
        "abs"           : (arg)             => Math.abs(arg),
        "neg"           : (arg)             => -arg,
        "ln"            : (arg)             => Math.log(arg),
        "log10"         : (arg)             => Math.log(arg) / Math.log(10),
        "exp"           : (arg)             => Math.exp(arg),
        "pow10"         : (arg)             => Math.pow(10,arg),
        "sin"           : (arg)             => Math.sin(arg / 180 * Math.PI),
        "cos"           : (arg)             => Math.cos(arg / 180 * Math.PI),
        "tan"           : (arg)             => Math.tan(arg / 180 * Math.PI),
        "asin"          : (arg)             => Math.asin(arg) / Math.PI * 180,
        "acos"          : (arg)             =>Math.acos(arg) / Math.PI * 180,
        "atan"          : (arg)             => Math.atan(arg) / Math.PI * 180,
        "pi"            : ()                => Math.PI,
        "e"             : ()                => Math.E,
        "golder_ratio"  : ()                => (1 + Math.sqrt(5)) / 2,
        "sqrt2"         : ()                => Math.SQRT2,
        "sqrt1_2"       : ()                => Math.SQRT1_2,
        "infinity"      : ()                => Infinity,
        "sum"           : (arg)             => arg.reduce(function(x, y) {return x + y;}),
        "min"           : (arg)             => Math.min.apply(null, arg),
        "max"           : (arg)             => Math.max.apply(null, arg),
        "average"       : function(list) {
            function mathMean(myList) {
                return myList.reduce(function(x, y) {return x + y;}) / myList.length;
            }
            return mathMean(list);
        },
        "median"        : function(list) {
            function mathMedian(myList) {
                var localList = myList.filter(function (x) {return typeof x == 'number';});
                if (!localList.length) return null;
                localList.sort(function(a, b) {return b - a;});
                if (localList.length % 2 == 0) {
                    return (localList[localList.length / 2 - 1] + localList[localList.length / 2]) / 2;
                } else {
                    return localList[(localList.length - 1) / 2];
                }
            }

            return mathMedian(list);
        },
        "mode"          : function(arg) {
            function mathModes(values) {
                var modes = [];
                var counts = [];
                var maxCount = 0;
                for (var i = 0; i < values.length; i++) {
                    var value = values[i];
                    var found = false;
                    var thisCount;
                    for (var j = 0; j < counts.length; j++) {
                        if (counts[j][0] === value) {
                            thisCount = ++counts[j][1];
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        counts.push([value, 1]);
                        thisCount = 1;
                    }
                    maxCount = Math.max(thisCount, maxCount);
                }
                for (var j = 0; j < counts.length; j++) {
                    if (counts[j][1] == maxCount) {
                        modes.push(counts[j][0]);
                    }
                }
                return modes;
            }
                
            return mathModes(arg);
        },
        "std_dev"      : function(arg) {
            function mathStandardDeviation(numbers) {
                var n = numbers.length;
                if (!n) return null;
                var mean = numbers.reduce(function(x, y) {return x + y;}) / n;
                var variance = 0;
                for (var j = 0; j < n; j++) {
                    variance += Math.pow(numbers[j] - mean, 2);
                }
                variance = variance / n;
                return Math.sqrt(variance);
            }

            return mathStandardDeviation(arg);
        },
        "random"      : function(list) {
            function mathRandomList(list) {
                var x = Math.floor(Math.random() * list.length);
                return list[x];
                }
                
            return mathRandomList(list);
        },

        "prime"         : function (arg) {
            function mathIsPrime(n) {
                // https://en.wikipedia.org/wiki/Primality_test#Naive_methods
                if (n == 2 || n == 3) {
                    return true;
                }
                // False if n is NaN, negative, is 1, or not whole.
                // And false if n is divisible by 2 or 3.
                if (isNaN(n) || n <= 1 || n % 1 != 0 || n % 2 == 0 || n % 3 == 0) {
                    return false;
                }
                // Check all the numbers of form 6k +/- 1, up to sqrt(n).
                for (var x = 6; x <= Math.sqrt(n) + 1; x += 6) {
                    if (n % (x - 1) == 0 || n % (x + 1) == 0) {
                    return false;
                    }
                }
                return true;
            }
    
            return mathIsPrime(arg);
        },
        "randomInt" : function(min, max){
            function mathRandomInt(a, b) {
                if (a > b) {
                    // Swap a and b to ensure a is smaller.
                    var c = a;
                    a = b;
                    b = c;
                }
                return Math.floor(Math.random() * (b - a + 1) + a);
            }
            return mathRandomInt(min, max);
        }
    
    },

    "text_methods":{
        "getLetter_from_start"          : (text, pos)           => text.charAt(pos - 1),
        "getLetter_from_end"            : (text, pos)           => text.slice(-pos).charAt(0),
        "getLetter_first"               : (text)                => text.charAt(0),
        "getLetter_last"                : (text)                => text.slice(-1),
        "substr_from_start_from_start"  : (text, pos1, pos2)    => text.slice(pos1-1, pos2),
        "substr_from_start_from_end"    : (text, pos1, pos2)    => text.slice(pos1-1, text.length - pos2 - 1),
        "substr_from_start_last"        : (text, pos1)          => text.slice(pos1-1, text.length),
        "substr_from_end_from_start"    : (text, pos1, pos2)    => text.slice(text.length - pos1, pos2),
        "substr_from_end_from_end"      : (text, pos1, pos2)    => text.slice(text.length - pos1, text.length - pos2 - 1),
        "substr_from_end_last"          : (text, pos1)          => text.slice(text.length - pos1, text.length),
        "substr_last_from_start"        : (text, pos2)          => text.slice(0, pos2),
        "substr_last_from_end"          : (text, pos2)          => text.slice(0, text.length - pos2 - 1),
        "substr_last_last"              : (text)                => text,
        "trim_both"                     : (text)                => text.trim(),
        "trim_left"                     : (text)                => text.replace(/^[\s\xa0]+/, ''),
        "trim_right"                    : (text)                => text.replace(/[\s\xa0]+$/, ''),
        "index_first"                   : (text, char)          => text.indexOf(char) + 1,
        "index_end"                     : (text, char)          => text.lastIndexOf(char) + 1,
        "textJoin"                      : (text)                => text.join(''),
        "lowercase"                     : (text)                => text.toLowerCase(),
        "uppercase"                     : (text)                => text.toUpperCase(),
        "titlecase"                     : function (text) {
            function textToTitleCase(str) {
                return str.replace(/\S+/g,
                    function(txt) {return txt[0].toUpperCase() + txt.substring(1).toLowerCase();});
            }

            return textToTitleCase(text);
        },
        "getLetter_random"              : function (text) {
            function textRandomLetter(text) {
                var x = Math.floor(Math.random() * text.length);
                return text[x];
            }
    
            return textRandomLetter(text);
        }
    },

    "colour_methods":{
        "colourRGB" : function (r,g,b) {
            function colourRgb(r, g, b) {
                r = Math.max(Math.min(Number(r), 100), 0) * 2.55;
                g = Math.max(Math.min(Number(g), 100), 0) * 2.55;
                b = Math.max(Math.min(Number(b), 100), 0) * 2.55;
                r = ('0' + (Math.round(r) || 0).toString(16)).slice(-2);
                g = ('0' + (Math.round(g) || 0).toString(16)).slice(-2);
                b = ('0' + (Math.round(b) || 0).toString(16)).slice(-2);
                return '#' + r + g + b;
            }
            return colourRgb(r, g, b); //rgb
        },
        "colourBlend" : function (c1, c2, ratio) {
            function colourBlend(c1, c2, ratio) {
                    ratio = Math.max(Math.min(Number(ratio), 1), 0);
                    var r1 = parseInt(c1.substring(1, 3), 16);
                    var g1 = parseInt(c1.substring(3, 5), 16);
                    var b1 = parseInt(c1.substring(5, 7), 16);
                    var r2 = parseInt(c2.substring(1, 3), 16);
                    var g2 = parseInt(c2.substring(3, 5), 16);
                    var b2 = parseInt(c2.substring(5, 7), 16);
                    var r = Math.round(r1 * (1 - ratio) + r2 * ratio);
                    var g = Math.round(g1 * (1 - ratio) + g2 * ratio);
                    var b = Math.round(b1 * (1 - ratio) + b2 * ratio);
                    r = ('0' + (r || 0).toString(16)).slice(-2);
                    g = ('0' + (g || 0).toString(16)).slice(-2);
                    b = ('0' + (b || 0).toString(16)).slice(-2);
                    return '#' + r + g + b;
                }
                return colourBlend(c1, c2, ratio); //color 1, clolor 2, ratio
        },
        "colourRandom" : function () {
            function colourRandom(){
                var num = Math.floor(Math.random() * Math.pow(2, 24));
                return '#' + ('00000' + num.toString(16)).substr(-6);
            }

            return colourRandom();
        }
    },

    "list_invoke": function (args){
        var methodName = args[0];
        var methodArgs = args.slice(1);
        var func = LibraryFuncs.list_methods[methodName]
        interpreter_vars.value_stack.push(func.apply(null, methodArgs))
    },

    "math_invoke": function (args){
        var methodName = args[0];
        var methodArgs = args.slice(1);
        var func = LibraryFuncs.math_methods[methodName]
        interpreter_vars.value_stack.push(func.apply(null, methodArgs))
    },

    "text_invoke": function (args){
        var methodName = args[0];
        var methodArgs = args.slice(1);
        var func = LibraryFuncs.text_methods[methodName]
        interpreter_vars.value_stack.push(func.apply(null, methodArgs))
    },
    
    "colour_invoke": function (args){
        var methodName = args[0];
        var methodArgs = args.slice(1);
        var func = LibraryFuncs.colour_methods[methodName]
        interpreter_vars.value_stack.push(func.apply(null, methodArgs))
    }
}

blockly_debuggee.Interpreter = Interpreter;