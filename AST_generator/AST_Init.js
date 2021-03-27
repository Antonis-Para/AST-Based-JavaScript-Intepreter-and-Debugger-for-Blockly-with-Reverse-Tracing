text = ""

AST_dispatch = []

function addToJSON(str) {
    text += str;
}

function getJSON(str) {
    return text;
}

function JSONremoveChars(amount) {
    text = text.slice(0, -amount);
}

const ELEMENT_NODE = 1;

var fs = require('fs');
const {
    exit
} = require('process');


var LibraryFuncs = {
    "list_methods":{
        "getIndex_fromEnd"          : (args) => args[0].slice(-args[1])[0] ,
        "popIndex_fromStart"        : (args) => args[0].splice(args[1]-1, 1)[0],
        "popIndex_first"            : (args) => args[0].shift(),
        "popIndex_fromEnd"          : (args) => args[0].splice(-args[1], 1)[0],
        "popIndex_last"             : (args) => args[0].pop(),
        "set_from_start"            : (args) => (args[0])[args[1] - 1] = args[2],
        "set_from_end"              : (args) => (args[0])[args[0].length - args[1]] = args[2],
        "set_first"                 : (args) => (args[0])[0] = args[1],
        "set_last"                  : (args) => (args[0])[args[0].length - 1] = args[1],
        "set_random"                : (args) => (args[0])[Math.floor(Math.random() * args[0].length)] = args[1],
        "insert_from_start"         : (args) => args[0].splice(args[1] - 1, 0, args[2]),
        "insert_from_end"           : (args) => args[0].splice(args[0].length - args[1], 0, args[2]),
        "insert_first"              : (args) => args[0].unshift(args[1]),
        "insert_last"               : (args) => args[0].push(args[1]),
        "insert_random"             : (args) => args[0].splice(Math.floor(Math.random() * args[0].length), 0, args[1]),
        "get_from_start_from_start" : (args) => args[0].slice(args[1] - 1, args[2]),
        "get_from_start_from_end"   : (args) => args[0].slice(args[1] - 1, args[0].length - args[2] - 1),
        "get_from_start_last"       : (args) => args[0].slice(args[1] - 1, args[0].length1),
        "get_from_end_from_start"   : (args) => args[0].slice(args[0].length - args[1], args[2]),
        "get_from_end_from_end"     : (args) => args[0].slice(args[0].length - args[1], args[0].length - args[2] - 1),
        "get_from_end_last"         : (args) => args[0].slice(args[0].length - args[1], args[0].length),
        "get_first_from_start"      : (args) => args[0].slice(0, args[1]),
        "get_first_from_end"        : (args) => args[0].slice(0, args[0].length - args[1] - 1),
        "get_first_last"            : (args) => args[0].slice(0),
        "split"                     : (args) => args[0].split(args[1]),
        "join"                      : (args) => args[0].join(args[1]),
        "random"                    : function (args) {
            function listsGetRandomItem(list, remove) {
                var x = Math.floor(Math.random() * list.length);
                if (remove) {
                  return list.splice(x, 1)[0];
                } else {
                  return list[x];
                }
            }    
    
            var list_arg = args[0];  
            var remove = args[1];
    
            return listsGetRandomItem(list_arg, remove);
        },
        "repeat"                    : function (args) {
            function listsRepeat(value, n) {
                var array = [];
                for (var i = 0; i < n; i++) {
                  array[i] = value;
                }
                return array;
            }      
    
            var list_arg = args[0];  
            var list_val = args[1];
    
            return listsRepeat(list_arg, list_val);
        },
        "sort"                      : function (args) {
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
              var list = args[0]
              var sort_type = args[1];
              var direction = args[2];
              
              list.slice().sort(listsGetSortCompare(sort_type, direction));
        }
    },

    "math_methods":{
        "atan2"         :  (args) => Math.atan2(args[1], args[0]) / Math.PI * 180, //y,x
        "constraint"    :  (args) => Math.min(Math.max(args[0], args[1]), args[2] ),
        "even"          : (args) => args[0] % 2 == 0 ,
        "odd"           : (args) => args[0] % 2 == 1,
        "whole"         : (args) => args[0] % 1 == 0,
        "positive"      : (args) => args[0] > 0,
        "negative"      : (args) => args[0] < 0,
        "divisible_by"  : (args) => args[0] % args[1] == 0,
        "root"          : (args) => Math.sqrt(args[0]),
        "abs"           : (args) => Math.abs(args[0]),
        "neg"           : (args) => -args[0],
        "ln"            : (args) => Math.log(args[0]),
        "log10"         : (args) => Math.log(args[0]) / Math.log(10),
        "exp"           : (args) => Math.exp(args[0]),
        "pow10"         : (args) => Math.pow(10,args[0]),
        "sin"           : (args) => Math.sin(args[0] / 180 * Math.PI),
        "cos"           : (args) => Math.cos(args[0] / 180 * Math.PI),
        "tan"           : (args) => Math.tan(args[0] / 180 * Math.PI),
        "asin"          : (args) => Math.asin(args[0]) / Math.PI * 180,
        "acos"          : (args) =>Math.acos(args[0]) / Math.PI * 180,
        "atan"          : (args) => Math.atan(args[0]) / Math.PI * 180,
        "pi"            : () => Math.PI,
        "e"             : () => Math.E,
        "golder_ratio"  : () => (1 + Math.sqrt(5)) / 2,
        "sqrt2"         : () => Math.SQRT2,
        "sqrt1_2"       : () => Math.SQRT1_2,
        "infinity"      : () => Infinity,
        "sum"           : (args) => args[0].reduce(function(x, y) {return x + y;}),
        "min"           : (args) => Math.min.apply(null, args[0]),
        "max"           : (args) => Math.max.apply(null, args[0]),
        "average"       : function(args) {
            function mathMean(myList) {
                return myList.reduce(function(x, y) {return x + y;}) / myList.length;
            }
            return mathMean(args[0]);
        },
        "median"        : function(args) {
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

            return mathMedian(args[0]);
        },
        "mode"          : function(args) {
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
              
            return mathModes(args[0]);
        },
        "std_dev"      : function(args) {
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

            return mathStandardDeviation(args[0]);
        },
        "random"      : function(args) {
            function mathRandomList(list) {
                var x = Math.floor(Math.random() * list.length);
                return list[x];
              }
              
            return mathRandomList(args[0]);
        },

        "prime"         : function (args) {
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
    
            return mathIsPrime(args[0]);
        },
        "randomInt" : function(args){
            function mathRandomInt(a, b) {
                if (a > b) {
                  // Swap a and b to ensure a is smaller.
                  var c = a;
                  a = b;
                  b = c;
                }
                return Math.floor(Math.random() * (b - a + 1) + a);
            }
            return mathRandomInt(args[0], args[1]);
        }
    
    },

    "text_methods":{
        "getLetter_from_start"          : (args) => args[0].charAt(args[1] - 1),
        "getLetter_from_end"            : (args) => args[0].slice(-args[1]).charAt(0),
        "getLetter_first"               : (args) => args[0].charAt(0),
        "getLetter_last"                : (args) => args[0].slice(-1),
        "substr_from_start_from_start"  : (args) => args[0].slice(args[1]-1, args[2]),
        "substr_from_start_from_end"    : (args) => args[0].slice(args[1]-1, args[0].length - args[2] - 1),
        "substr_from_start_last"        : (args) => args[0].slice(args[1]-1, args[0].length),
        "substr_from_end_from_start"    : (args) => args[0].slice(args[0].length - args[1], args[2]),
        "substr_from_end_from_end"      : (args) => args[0].slice(args[0].length - args[1], args[0].length - args[2] - 1),
        "substr_from_end_last"          : (args) => args[0].slice(args[0].length - args[1], args[0].length),
        "substr_last_from_start"        : (args) => args[0].slice(0, args[1]),
        "substr_last_from_end"          : (args) => args[0].slice(0, args[0].length - args[1] - 1),
        "substr_last_last"              : (args) => args[0],
        "trim_both"                     : (args) => args[0].trim(),
        "trim_left"                     : (args) => args[0].replace(/^[\s\xa0]+/, ''),
        "trim_right"                    : (args) => args[0].replace(/[\s\xa0]+$/, ''),
        "index_first"                   : (args) => args[0].indexOf(args[1]) + 1,
        "index_end"                     : (args) => args[0].lastIndexOf(args[1]) + 1,
        "textJoin"                      : (args) => args.join(''),
        "lowercase"                     : (args) => args[0].toLowerCase(),
        "uppercase"                     : (args) => args[0].toUpperCase(),
        "titlecase"                     : function (args) {
            function textToTitleCase(str) {
                return str.replace(/\S+/g,
                    function(txt) {return txt[0].toUpperCase() + txt.substring(1).toLowerCase();});
            }
            var str = args[0];
            return textToTitleCase(str);
        },
        "getLetter_random"              : function (args) {
            function textRandomLetter(text) {
                var x = Math.floor(Math.random() * text.length);
                return text[x];
            }
    
            var str = args[0];
            return textRandomLetter(str);
        }
    },

    "list_invoke": function (args){
        var methodName = args[0];
        var methodArgs = args.slice(1);
        return this.list_methods[methodName](methodArgs);
    },

    "math_invoke": function (args){
        var methodName = args[0];
        var methodArgs = args.slice(1);
        return this.math_methods[methodName](methodArgs);
    },

    "text_invoke": function (args){
        var methodName = args[0];
        var methodArgs = args.slice(1);
        return this.text_methods[methodName](methodArgs);
    },
    "colourRGB" : function (args) {
        function colourRgb(r, g, b) {
            r = Math.max(Math.min(Number(r), 100), 0) * 2.55;
            g = Math.max(Math.min(Number(g), 100), 0) * 2.55;
            b = Math.max(Math.min(Number(b), 100), 0) * 2.55;
            r = ('0' + (Math.round(r) || 0).toString(16)).slice(-2);
            g = ('0' + (Math.round(g) || 0).toString(16)).slice(-2);
            b = ('0' + (Math.round(b) || 0).toString(16)).slice(-2);
            return '#' + r + g + b;
          }
          
          return colourRgb(args[0], args[1], args[2]); //rgb
    },

    "colourBlend" : function (args) {
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
          
          return colourBlend(args[0], args[1], args[2]); //color 1, clolor 2, ratio
    },
}

/* --------------------------------------------------------------------------------
	Will create all the variable declarations that are inside the <variables> tag.
	Assumes that the tag is in the outer blocks
-----------------------------------------------------------------------------------*/	
function createAllVariables(blocks) {
    var variables = getElement(blocks, Blockly_gen.ELEMENT_NODE, "variables", 1);
    if (variables === null) return;

    var occ = 1;
    var variable = getElement(variables, Blockly_gen.ELEMENT_NODE, "variable", occ++);
    while (variable !== null) {
        if (variable.childNodes.length != 0) {
            Blockly_gen.addToJSON("{\n")
            Blockly_gen.addToJSON('"type": "var_decl",\n');
			Blockly_gen.addToJSON('"id": "' + variable.getAttribute("id") + '",\n');
            Blockly_gen.addToJSON('"name": "' + variable.childNodes[0].nodeValue + '"\n');
            Blockly_gen.addToJSON("},\n")
        }
        variable = getElement(variables, Blockly_gen.ELEMENT_NODE, "variable", occ++);
    }
}

/* -----------------------------------------------------------------------------
	Will create all the blocks recursively. Nested blocks will also be created.
	Calls a dispatch table
--------------------------------------------------------------------------------*/
function createAllBlocks(blocks) {
    var name = blocksExist(blocks)
    if (name === null) //no blocks or shadow block exist
        return null;

    var block, occ = 1;
    block = getElement(blocks, Blockly_gen.ELEMENT_NODE, name, occ++);
    while (block !== null) { //while there are more blocks..
        Blockly_gen.addToJSON("{\n")

        var type = block.getAttribute('type');
		try {
        Blockly_gen.AST_dispatch[type](block); // Dispatch
		}catch(e){
			console.log("Error with type " + type)
			console.log("-------------------------------")
			console.log(e)
			exit()
		}

        Blockly_gen.addToJSON('}'); //data
        nextBlock(block);
        block = getElement(blocks, Blockly_gen.ELEMENT_NODE, name, occ++)
        if (block !== null) {
            Blockly_gen.addToJSON(',\n');
        }
    }
}


/* ------------------------------------------------------------------------------
	Checks if a block or shadow block exists within the sub-block named 'blocks'
---------------------------------------------------------------------------------*/
function blocksExist(blocks) {
    var block = getElement(blocks, Blockly_gen.ELEMENT_NODE, "block", 1);
    var name = "block"

    if (block === null) { //if there aren't any blocks, check for shadow blocks
        name = "shadow"
        block = getElement(blocks, Blockly_gen.ELEMENT_NODE, "shadow", 1);
        if (block === null) { //no blocks or shadow blocks == 0 statements inside
            return null;
        }
    }
    return name;
}

/* ------------------------------------------------------------------------------
	Blockly keeps the blocks connected to a previous block inside a <next> TAG.
	This function will check if such a block exist and will create it.
	Assums that there is at MOST one <next> tag in every block	
---------------------------------------------------------------------------------*/
function nextBlock(block) {
    var next = getElement(block, Blockly_gen.ELEMENT_NODE, "next");

    if (next == null) {
        Blockly_gen.addToJSON('\n');
        return;
    }

    Blockly_gen.addToJSON(',\n');
    createAllBlocks(next)
}

/* ------------------------------------------------------------------------------
	Will search for a spesific 'type' of tag, with a 'name' inside the 'blocks'.
	If there are multiple children inside a tag that match these properties,
	the child after 'child_no'. ELEMENT_NODE contains the id of the 'Element
	It searches ONLY in the fist level of children
	
	Ex. <block>
			<value name="A"> ... </value>
				<value name="A.A"> ... </value>
			<value name="B"> ... </value>
			<value name="C"> ... </value>
		</block>
		
		value = getElement(blocks, ELEMENT_NODE, "value", 2)
		value will have name == "B"
---------------------------------------------------------------------------------*/
function getElement(blocks, type, name, child_no = 1) {
    if (blocks === undefined || blocks === null)
        return null;

    var occ = 0;
    var elements = blocks.childNodes;

    for (var i = 0; i < elements.length; i++) {
        var block = elements[i];
        if (block.nodeType == type && block.nodeName == name) {
            if (++occ == child_no)
                return block
        }
    }
    return null;
}

module.exports = {
    AST_dispatch,
    addToJSON,
    ELEMENT_NODE,
    createAllVariables,
    createAllBlocks,
    getElement,
    getJSON,
    JSONremoveChars,
    LibraryFuncs
}