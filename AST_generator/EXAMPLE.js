//Template example
var xmlText = `<xml xmlns="https://developers.google.com/blockly/xml">
<block type="procedures_defreturn" id="pKbV;WHTxpTjsKCX~+c" x="313" y="137">
  <field name="NAME">do something2</field>
  <comment pinned="false" h="80" w="160">Describe this function...</comment>
  <statement name="STACK">
    <block type="procedures_ifreturn" id="j~KYNP|oONSRB*@6mt6[">
      <mutation value="1"></mutation>
      <value name="CONDITION">
        <block type="logic_boolean" id="oI#3L+m9yBObd5o|bytp">
          <field name="BOOL">TRUE</field>
        </block>
      </value>
      <value name="VALUE">
        <block type="math_number" id="1(3R/HWlbprQAO2@@v6">
          <field name="NUM">123</field>
        </block>
      </value>
    </block>
  </statement>
  <value name="RETURN">
    <block type="math_number" id="Eqad6tc|:UldKV(kvaiS">
      <field name="NUM">123</field>
    </block>
  </value>
</block>
<block type="text" id="5Dd6R)GWgYM^h30zb}C2" x="338" y="288">
  <field name="TEXT"></field>
</block>
<block type="procedures_defreturn" id="!#5TG@wGn:2Mj^;JuovF" x="313" y="363">
  <field name="NAME">do something3</field>
  <comment pinned="false" h="80" w="160">Describe this function...</comment>
  <statement name="STACK">
    <block type="procedures_ifreturn" id="t=KkVJ=?=ifyES@Ka#I">
      <mutation value="1"></mutation>
      <value name="CONDITION">
        <block type="logic_boolean" id="jhyH^:.}%Qdm]WOur[,">
          <field name="BOOL">TRUE</field>
        </block>
      </value>
      <value name="VALUE">
        <block type="math_number" id="DuRhEJv|.:osl9359{$N">
          <field name="NUM">123</field>
        </block>
      </value>
    </block>
  </statement>
  <value name="RETURN">
    <block type="math_number" id=":}%QNTL$$ffcKF2z**S(">
      <field name="NUM">123</field>
    </block>
  </value>
</block>
</xml>`

var Blockly_genarator = require('./AST_generator.js')
var ast = Blockly_genarator.Generator(xmlText)
//console.log(ast)

var inter = require('./interpreter.js').Interpreter(ast)
inter.eval(ast);