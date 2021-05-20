export var Watch = {
    "expresions"    : [],
    set             : (exprs)   => Watch.expresions = exprs,
    add             : (expr)    => Watch.expresions.push(expr),
    getAll          : ()        => Watch.expresions,
    get             : (expr)    => Watch.expresions[expr],
    clear           : ()        => Watch.expresions = [],
    print           : function (vars){
        var watches_expresions  = {};
        var code_pre            = '';
        var exprs               = Watch.getAll();
        
        for (var var_name in vars){
            code_pre += 'var ' + var_name + ' = ' + vars[var_name] + ';'
        }

        for (var expr in exprs){
            var code = code_pre;

            code += exprs[expr]
            var res = undefined;
            try{
                res = eval(code);
            }
            catch(e){
                res = undefined;
            }

            watches_expresions[exprs[expr]] = res;
        }

        postMessage(
            {type:"watches_expresions", data:{ exprs : watches_expresions } }
        );
    }
}