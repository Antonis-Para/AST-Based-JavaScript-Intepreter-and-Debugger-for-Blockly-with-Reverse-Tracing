# JSON Types of blocks generated

## Statements
- stmts
    + Has a `data [{}, {}, ...]` tag that can contain any of the other types.
- if_stmt
    + Has a `cond` : any type leading to bool (condition of the if)
    + Has a `do` : `stmts` (if cond true, do will be executed)
- while_stmt
    + Has a `cond` : any type leading to bool (condition of the if)
    + Has a `do` : `stmts` (if cond is true, do will be executed)
- for_stmt
    + Has a `var_name` : var type (must be a variable. i.e "i")
    + Has a `from` : any type leading to number (where the for starts from)
    + Has a `to` : any type leading to number (where the for ends)  
    + Has a `by` : any type leading to number (step),  
    + Has a `do` : `stmts` (if cond is true, do will be executed)
- forEach_stmt
    + Has a `var_name` : var type (must be a variable. i.e "i")
    + Has an `in` : list type (the list we are about to go through)
    + Has a `do` : `stmts` (if cond is true, do will be executed)
- repeat_stmt
    + Has a `cond` : any type leading to number (a number specifying how many times it will execute)  
    + Has a `do` : `stmts` (if cond is true, do will be executed)
    
## Const
- bool_const
    + Has a `value`
- null_const
    + Has a `value` equal to `null` 
- math_const
    + Has a `value`
- text_const
    + Has a `value`
- colour_const
    + Has a `value`
- number
    + Has a `value`
- keyword
    + Has a `name` (i.e "return")
    + *Might* have a `value`. (i.e. return 1; has a value of 1)
     
## Expresions
- logic_expr
    + Has an `op` : (and, or, eq, neq, lt, lte, gt, gte)
    + Has a `lval` : any type
    + Has a `rval` : any type
- tenary_expr
    + Has an `if` : any type leading to bool
    + Has a `then` : any type
    + Has an `else` : any type
- assign_expr
    + Has a `lval` : var
    + Has a `rval` : any type
- arithm_expr
    + Has an `op` : (add, minus, multiply, divide, power)
    + Has a `lval` : any type
    + Has a `rval` : any type
- list_math_expr
    + Has an `op` : (sum, min, max, averege, median, mode, std_dev, random)
    + Has a `list` : any type of list (The opperation will be performed on this list)
     
## Variables
- var_decl
    + Has a `name` : (string with the variable's name)
- var
    + Has a `name` : (string with the variable's name)
- var_change
    + Has a `var_name` : (string with the variable's name)
    + Has a `value` : any type (variable's new value)
    
## Functions
- func_call
    + Has a `name` : (string with the function's name i.e. "Math.sqrt")
    + Has an `arg` : any type (the argument of the function)
- func_decl
    + Has `args[]` : array of text (the argument names of the function)
    + Has a `name` : (string with the function's name i.e. "NewFunction")
    + Has a `do` : `stmts` (what will be executed when the func is called)
- userfunc_call
    + Has `args[]` : array of any types (the arguments passed)
    + Has a `name` : (string with the function's name i.e. "NewFunction")
        
## Lists
- list_create_repeat
    + Has an `item` : any type (This item will be placed in the list)
    + Has a `repeat` : number (How many times the item will be created)
- list_get
    + Has a `mode` : (get, get and remove, remove)
    + Has a `where` : (from_start, from_end, first, last, random)
    + Has a `list` : list (Search is going to be conducted inside this list)
    + *Might* have a `pos` : any type leadint to number (this many positions from the 'where'. If where==first or last, pos is skipped)
- list_set
    + Has a `mode` : (set, insert at)
    + Has a `where` : (from_start, from_end, first, last, random)
    + Has a `list` : list (the item will be set in this list)
    + *Might* have a `pos` : any type leading to number (this many positions from the 'where'. If where!=FROM_START or FROM_END, pos is skipped)
        + Has an `item` : any type leading to number (Will insert this item)
- list_sublist
    + Has a `where1` : (from_start, from_end or first)
    + Has a `where2` : (from_start, from_end or last)
    + Has a `list` : list (the sublist will come from this list)
    + *Might* have a `pos1` : any type leading to number (this many positions from the 'where1'. If where1==first pos1 is skipped)
    + *Might* have a `pos2` : any type leading to number (this many positions from the 'where1'. If where2==last pos2 is skipped)
- list_split
    + Has a `mode` : (split or join)
    + Has an `item` : text (the operation will be performed on that item)
    + Has a `delim` : (string spesifying the delimeter)
- list_create
    + Has an `items[]` : array of any types (items of the list)
    
## Colours
- colour_const
    + Has a `value` : any type (variable's new value)
- colour_random
- colour_rgb
    + Has a `red` : number
    + Has a `green` : number
    + Has a `blue` : number
- colour_blend
    + Has a `colour1` : colour_const
    + Has a `colour2` : colour_const
    + Has a `ratio` : number
    
## Properties
- property_join
    + Has `items[]` : array of text (Will combine items into one text)
- property
    + Has a `name` : (i.e. ".length")
    + Has an `item` : text (the 'name' will be performed on this item)
- property_charAt
    + Has a `where` : (from_start, from_end, first, last or random)
    + Has a `item` : text (search in this item)
    + *Might* have a `at` : number (this many positions from the 'where'. If where!=from_start or from_end, pos is skipped)
- property_substr
    + Has a `where1` : (from_start, from_end or first)
    + Has a `where2` : (from_start, from_end or last)
    + Has a `item` : text (the substring will come from this itme)
    + *Might* have a `pos1` : number (this many positions from the 'where1'. If where1==first pos1 is skipped)
    + *Might* have a `pos2` : number (this many positions from the 'where1'. If where2==last pos2 is skipped)
- property_changeCase
    + Has a `case` : (lowercase, uppercase, titlecase)
    + Has an `item` : text (the 'case' will be performed on this item)
- property_trim
    + Has a `side` : (both, left, right)
    + Has an `item` : text (the trim will be performed on this item)
    
## Math
- math_property
    + Has a `property` (even, odd, prime, while, positive, negative, divisible_by)
    + Has a `value` : any type leading to number (the 'property' will be performed on this value)
- math_constraint
    + Has a `value` : any type leading to number (the number to be constrained)
    + Has a `low` : any type leading to number (the lowest possible number)
    + Has a `high` : any type leading to number (the highest possible number)
- math_rand_int
    + Has a `from` : any type leading to number (the lowest possible number)
    + Has a `to` : any type leading to number (the highest possible number)
- func_atan2
    + Has a `x` : any type leading to number
    + Has a `y` : any type leading to number

    
    

    

    