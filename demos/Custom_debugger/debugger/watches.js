export var Watches = {
    expressions     : [],
    add             : (expr)    => Watches.expressions.push(expr),
    getAll          : ()        => Watches.expressions,
    clear           : function(){
        Watches.expressions = []
        Watches.reset_watches(document.getElementById("watches_expr"))
    },     

    //will keep the table header
    reset_watches   : function(table){
        table.innerHTML = `<tr> 
        <th width="100/3%">Name</th>
        <th width="100/3%">Value</th>
        <th width="100/3%">Type</th>
      </tr>`;
    },

    print    : function(document, table, var_name, var_value, var_type){
        let row=document.createElement("tr");
        let cell1 = document.createElement("td");
        let cell2 = document.createElement("td");
        let cell3 = document.createElement("td");
        cell1.width ="100/3%"
        cell2.width ="100/3%"
        cell3.width ="100/3%"

        let textnode1=document.createTextNode(var_name);
        let textnode2=document.createTextNode(var_value);
        let textnode3=document.createTextNode(var_type);
        cell1.appendChild(textnode1);
        cell2.appendChild(textnode2);
        cell3.appendChild(textnode3);
        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);
        row.align = "center"
        table.appendChild(row)
    }
}