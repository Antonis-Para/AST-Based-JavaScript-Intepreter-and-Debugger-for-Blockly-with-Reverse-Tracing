export var BreakpointHolder = {
    breakpoints : [],
    add         : function(blockId) { this.breakpoints[blockId] = true; },
    remove      : function(blockId) { delete this.breakpoints[blockId]; },
    enable      : function(blockId) { this.breakpoints[blockId] = true; },
    disable     : function(blockId) { this.breakpoints[blockId] = false; },
    has         : function(blockId) { return this.breakpoints[blockId] !== undefined; },
    has_enabled : function(blockId) { return this.breakpoints[blockId] == true; },
    clear       : function ()       { for (var bpt in this.breakpoints) delete this.breakpoints[bpt]; }
  };