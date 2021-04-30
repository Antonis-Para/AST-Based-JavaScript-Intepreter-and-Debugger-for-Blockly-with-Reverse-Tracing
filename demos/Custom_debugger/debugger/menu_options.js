import {BreakpointHolder} from './breakpoints.js'

export function registerMenuOptions(worker){
  /** @type {!Blockly.ContextMenuRegistry.RegistryItem} */
  var add_breakpoint = {
    displayText: function(/** @type {!Blockly.ContextMenuRegistry.Scope} */ scope) {
        let blockid = scope.block.id;
        return BreakpointHolder.has(blockid) ? "Remove Breakpoint" : "Add Breakpoint";
    },

    preconditionFn: function(/** @type {!Blockly.ContextMenuRegistry.Scope} */ scope) {
      return 'enabled'
    },

    callback: function(/** @type {!Blockly.ContextMenuRegistry.Scope} */ scope) {
        let blockid = scope.block.id;
        if (BreakpointHolder.has(blockid)){
          BreakpointHolder.remove(blockid)
          worker.getInstance().postMessage({type : "breakpoint", data : {id : blockid, op : 'remove'}})
        } else {
            BreakpointHolder.add(blockid)
            worker.getInstance().postMessage({type : "breakpoint", data : {id : blockid, op : 'add'}})
        }
    },
    scopeType: Blockly.ContextMenuRegistry.ScopeType.BLOCK,
    id: 'add_breakpoint',
    weight: 6,
  };
  
  
  /** @type {!Blockly.ContextMenuRegistry.RegistryItem} */
  var enable_breakpoint = {
    displayText: function(/** @type {!Blockly.ContextMenuRegistry.Scope} */ scope) {
        let blockid = scope.block.id;
        return BreakpointHolder.has_enabled(blockid) ? "Disable Breakpoint" : "Enable Breakpoint";
    },

    preconditionFn: function(/** @type {!Blockly.ContextMenuRegistry.Scope} */ scope) {
      let blockid = scope.block.id;
      return BreakpointHolder.has(blockid) ? "enabled" : "hidden";
    },

    callback: function(/** @type {!Blockly.ContextMenuRegistry.Scope} */ scope) {
        let blockid = scope.block.id;
        if (BreakpointHolder.has_enabled(blockid)){
          BreakpointHolder.disable(blockid)
          worker.getInstance().postMessage({type : "breakpoint", data : {id : blockid, op : 'disable'}})
        } else {
            BreakpointHolder.enable(blockid)
            worker.getInstance().postMessage({type : "breakpoint", data : {id : blockid, op : 'enable'}})
        }
    },
    scopeType: Blockly.ContextMenuRegistry.ScopeType.BLOCK,
    id: 'enable_breakpoint',
    weight: 6,
  };

  /** @type {!Blockly.ContextMenuRegistry.RegistryItem} */
  var run_to = {
    displayText: function(/** @type {!Blockly.ContextMenuRegistry.Scope} */ scope) {
        return "Run to cursor"
    },

    preconditionFn: function(/** @type {!Blockly.ContextMenuRegistry.Scope} */ scope) {
      return 'enabled'
    },

    callback: function(/** @type {!Blockly.ContextMenuRegistry.Scope} */ scope) {
        let blockid = scope.block.id;
        worker.getInstance().postMessage({type : "trace", data : {id : blockid, op : 'run_to'}})

    },
    scopeType: Blockly.ContextMenuRegistry.ScopeType.BLOCK,
    id: 'run_to',
    weight: 6,
  };
    
  Blockly.ContextMenuRegistry.registry.register(add_breakpoint);
  Blockly.ContextMenuRegistry.registry.register(enable_breakpoint);
  Blockly.ContextMenuRegistry.registry.register(run_to);
}