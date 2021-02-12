//Template example
var xmlText = `<xml xmlns="https://developers.google.com/blockly/xml">
  <variables>
    <variable id="*+_rpJn.3x$3Z[*A3;qc">g</variable>
  </variables>
  <block type="controls_if" id="J(I!YtyNZSR?qOLa4PM" x="-987" y="-88"></block>
  <block type="controls_repeat_ext" id="{?2!];$CuIF|hM5|z3Ni" x="-1012" y="12">
    <value name="TIMES">
      <shadow type="math_number" id="%UV6wBaS^TX[O6IK89rp">
        <field name="NUM">10</field>
      </shadow>
    </value>
  </block>
  <block type="text_join" id="Hv-jwEzZb!EFXZ30^mp=" x="-1012" y="162">
    <mutation items="2"></mutation>
    <value name="ADD0">
      <block type="math_number" id="CtA21?d{%gt:o;NG_!E0">
        <field name="NUM">123</field>
      </block>
    </value>
  </block>
  <block type="lists_create_with" id="G*6WvHdow9b(q@SUHj:c" x="-987" y="287">
    <mutation items="0"></mutation>
  </block>
  <block type="colour_picker" id="t!~WO665~zKxbIYPUQJ/" x="-962" y="362">
    <field name="COLOUR">#ff0000</field>
  </block>
  <block type="variables_set" id="*~@GX@,ckN]@CPmD$%Sc" x="-987" y="412">
    <field name="VAR" id="*+_rpJn.3x$3Z[*A3;qc">g</field>
    <value name="VALUE">
      <block type="variables_get" id="cf0G6{1Z7Y~wC|w45vQ+">
        <field name="VAR" id="*+_rpJn.3x$3Z[*A3;qc">g</field>
      </block>
    </value>
  </block>
  <block type="procedures_defnoreturn" id="_%!F=^G7M:VF_zcB2Jt)" x="-987" y="438">
    <field name="NAME">do something</field>
    <comment pinned="false" h="80" w="160">Describe this function...</comment>
  </block>
</xml>`

var Blockly_genarator = require('./AST_generator.js')
var ast = Blockly_genarator.Generator(xmlText)
console.log(ast)