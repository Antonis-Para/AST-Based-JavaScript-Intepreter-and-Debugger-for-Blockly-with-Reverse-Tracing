import Generator from '../AST_generator/AST_generator.js'

function blocklyXmlToJson(xml){
    return Generator(xml)
}

export var Debuggee_Worker = (function (xml) {
	var instance = new Worker("http://127.0.0.1:5500/debuggee/debuggee.js");
    var json = blocklyXmlToJson(xml)
    instance.postMessage(json)
})