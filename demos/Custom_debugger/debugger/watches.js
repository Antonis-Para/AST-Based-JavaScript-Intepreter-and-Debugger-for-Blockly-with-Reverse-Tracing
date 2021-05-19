export var Watches = {
    //will keep the table header
    reset_watches : function(table){
        table.innerHTML = `<tr> 
        <th>Name</th>
        <th>Value</th>
        <th>Type</th>
      </tr>`;
    },

    add_variable : function(document, table, var_name, var_value, var_type){
        let row=document.createElement("tr");
        let cell1 = document.createElement("td");
        let cell2 = document.createElement("td");
        let cell3 = document.createElement("td");
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