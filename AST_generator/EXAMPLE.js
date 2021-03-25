//Template example
var xmlText = `<xml xmlns="https://developers.google.com/blockly/xml">
<variables>
  <variable id="+qJ9;kSAj_q%xS,:T2{">item</variable>
  <variable id="$vmZ.vAD#755}r.#ox{+">text</variable>
</variables>
<block type="text_join" id="4ISn(N(ajyZrnm|2V:yh" x="-1488" y="-87">
  <mutation items="2"></mutation>
  <value name="ADD0">
    <block type="text" id="4qM/(t:dvPC}_r7]NAhB">
      <field name="TEXT"></field>
    </block>
  </value>
  <value name="ADD1">
    <block type="text" id="n|6_URFLY~IwEg*eC2G;">
      <field name="TEXT"></field>
    </block>
  </value>
</block>
<block type="text_append" id="+X},nDRO|MUs+27LdYii" x="-1462" y="-12">
  <field name="VAR" id="+qJ9;kSAj_q%xS,:T2{">item</field>
  <value name="TEXT">
    <shadow type="text" id="@cLro99u[8eEF2sF/dkK">
      <field name="TEXT"></field>
    </shadow>
  </value>
</block>
<block type="text_length" id="*,kfLff^AB29#(1:BDQj" x="-1463" y="38">
  <value name="VALUE">
    <shadow type="text" id="N8-)Npu!k.4DVXV}{C{_">
      <field name="TEXT">abc</field>
    </shadow>
  </value>
</block>
<block type="text_isEmpty" id="v(.E|OGD4uP/O@ns|)4I" x="-1487" y="87">
  <value name="VALUE">
    <shadow type="text" id=";pL.S=2x}}tA]3cDb)UG">
      <field name="TEXT"></field>
    </shadow>
  </value>
</block>
<block type="text_indexOf" id="Wq93f~Zd.9[V=OmMZGcs" x="-1462" y="162">
  <field name="END">FIRST</field>
  <value name="VALUE">
    <block type="variables_get" id="PKA$9#ShO4O(C*,IP(nb">
      <field name="VAR" id="$vmZ.vAD#755}r.#ox{+">text</field>
    </block>
  </value>
  <value name="FIND">
    <shadow type="text" id="tM=~sLqbu0]Sah2VIA-i">
      <field name="TEXT">abc</field>
    </shadow>
  </value>
</block>
<block type="text_indexOf" id="otp_SH[}t*A=AC3USH9" x="-1463" y="213">
  <field name="END">LAST</field>
  <value name="VALUE">
    <block type="variables_get" id="112JDLg?vw#XJ8n3zH">
      <field name="VAR" id="$vmZ.vAD#755}r.#ox{+">text</field>
    </block>
  </value>
  <value name="FIND">
    <shadow type="text" id="bXppoN!fJ6Uf}uYK7gX;">
      <field name="TEXT">abc</field>
    </shadow>
  </value>
</block>
<block type="text_charAt" id=",eBHT3y$[Cu=xspU^@eG" x="-1462" y="263">
  <mutation at="true"></mutation>
  <field name="WHERE">FROM_START</field>
  <value name="VALUE">
    <block type="variables_get" id="d|8O~=fymTF?%xtQd|c7">
      <field name="VAR" id="$vmZ.vAD#755}r.#ox{+">text</field>
    </block>
  </value>
</block>
<block type="text_charAt" id="xf.bwkPbpt(attxZck;z" x="-1462" y="312">
  <mutation at="true"></mutation>
  <field name="WHERE">FROM_END</field>
  <value name="VALUE">
    <block type="variables_get" id="Io_qvXImAeB/fJTtFY|b">
      <field name="VAR" id="$vmZ.vAD#755}r.#ox{+">text</field>
    </block>
  </value>
</block>
<block type="text_charAt" id="(NAHZ1J)O~*b$*ufPe5)" x="-1463" y="363">
  <mutation at="false"></mutation>
  <field name="WHERE">FIRST</field>
  <value name="VALUE">
    <block type="variables_get" id="1.8K[wLoXYhIOac{s?*j">
      <field name="VAR" id="$vmZ.vAD#755}r.#ox{+">text</field>
    </block>
  </value>
</block>
<block type="text_charAt" id="0qO|RY_6}|%o)K%knhz?" x="-1462" y="413">
  <mutation at="false"></mutation>
  <field name="WHERE">LAST</field>
  <value name="VALUE">
    <block type="variables_get" id="mC%Xim-XYvS@]cv-EEi:">
      <field name="VAR" id="$vmZ.vAD#755}r.#ox{+">text</field>
    </block>
  </value>
</block>
<block type="text_charAt" id="jhC)ve,li=k4sN6%]ZB3" x="-1462" y="438">
  <mutation at="false"></mutation>
  <field name="WHERE">RANDOM</field>
  <value name="VALUE">
    <block type="variables_get" id="NxTO)Y!tqt59oavPyTkE">
      <field name="VAR" id="$vmZ.vAD#755}r.#ox{+">text</field>
    </block>
  </value>
</block>
<block type="text_getSubstring" id="[=D,V9QVB8FrD9^}NCLz" x="-1537" y="488">
  <mutation at1="true" at2="true"></mutation>
  <field name="WHERE1">FROM_START</field>
  <field name="WHERE2">FROM_START</field>
  <value name="STRING">
    <block type="variables_get" id="o1-j6w~n!qv1GLG*j,Ge">
      <field name="VAR" id="$vmZ.vAD#755}r.#ox{+">text</field>
    </block>
  </value>
</block>
<block type="text_getSubstring" id="nAl5wukM4,7|%p3]/Po0" x="-1537" y="537">
  <mutation at1="true" at2="true"></mutation>
  <field name="WHERE1">FROM_START</field>
  <field name="WHERE2">FROM_END</field>
  <value name="STRING">
    <block type="variables_get" id="1aKC.J^s+rqWbFhch;rZ">
      <field name="VAR" id="$vmZ.vAD#755}r.#ox{+">text</field>
    </block>
  </value>
</block>
<block type="text_getSubstring" id=",D:ju}CR,9:+OfW@g+Ie" x="-1438" y="587">
  <mutation at1="true" at2="false"></mutation>
  <field name="WHERE1">FROM_START</field>
  <field name="WHERE2">LAST</field>
  <value name="STRING">
    <block type="variables_get" id="]YG.PxNa?uY~xc,JNXGV">
      <field name="VAR" id="$vmZ.vAD#755}r.#ox{+">text</field>
    </block>
  </value>
</block>
<block type="text_getSubstring" id="T~cYP~h(FU8mT$(KzKW_" x="-1487" y="637">
  <mutation at1="true" at2="true"></mutation>
  <field name="WHERE1">FROM_END</field>
  <field name="WHERE2">FROM_START</field>
  <value name="STRING">
    <block type="variables_get" id="o:xsJ[rL8sHxJu=|v%am">
      <field name="VAR" id="$vmZ.vAD#755}r.#ox{+">text</field>
    </block>
  </value>
</block>
<block type="text_getSubstring" id="u:kP%eF;@QHfA2nB-T_" x="-1512" y="687">
  <mutation at1="true" at2="true"></mutation>
  <field name="WHERE1">FROM_END</field>
  <field name="WHERE2">FROM_END</field>
  <value name="STRING">
    <block type="variables_get" id="T83isHz+cOcHTXRY@[{">
      <field name="VAR" id="$vmZ.vAD#755}r.#ox{+">text</field>
    </block>
  </value>
</block>
<block type="text_getSubstring" id="N~{9=kpKWoDU{#8[i}!n" x="-1512" y="737">
  <mutation at1="true" at2="false"></mutation>
  <field name="WHERE1">FROM_END</field>
  <field name="WHERE2">LAST</field>
  <value name="STRING">
    <block type="variables_get" id="vm$4bL~(~;.:3)!o+wM1">
      <field name="VAR" id="$vmZ.vAD#755}r.#ox{+">text</field>
    </block>
  </value>
</block>
<block type="text_getSubstring" id="LI*NEt,{fiwNoL]]E;Ll" x="-1487" y="787">
  <mutation at1="false" at2="true"></mutation>
  <field name="WHERE1">FIRST</field>
  <field name="WHERE2">FROM_START</field>
  <value name="STRING">
    <block type="variables_get" id="QkWizo_#[SkmX_.D^nNW">
      <field name="VAR" id="$vmZ.vAD#755}r.#ox{+">text</field>
    </block>
  </value>
</block>
<block type="text_getSubstring" id="1|SqX8xSmwQ8kh3j[L%b" x="-1513" y="837">
  <mutation at1="false" at2="true"></mutation>
  <field name="WHERE1">FIRST</field>
  <field name="WHERE2">FROM_END</field>
  <value name="STRING">
    <block type="variables_get" id="$-==].0x7fj%G22A.e@n">
      <field name="VAR" id="$vmZ.vAD#755}r.#ox{+">text</field>
    </block>
  </value>
</block>
<block type="text_getSubstring" id="f};@s?Uy3C,f/v-5O_g(" x="-1537" y="887">
  <mutation at1="false" at2="false"></mutation>
  <field name="WHERE1">FIRST</field>
  <field name="WHERE2">LAST</field>
  <value name="STRING">
    <block type="variables_get" id="aK8{NHmHuL@|]62BuY2B">
      <field name="VAR" id="$vmZ.vAD#755}r.#ox{+">text</field>
    </block>
  </value>
</block>
<block type="text_changeCase" id="G$60@EQ):[:E3V5WY6!;" x="-1537" y="938">
  <field name="CASE">UPPERCASE</field>
  <value name="TEXT">
    <shadow type="text" id="h|,7#mVZvhIL+Aw;f5Ju">
      <field name="TEXT">abc</field>
    </shadow>
  </value>
</block>
<block type="text_changeCase" id="L%K7u2K!$^muGvY:0%[" x="-1537" y="963">
  <field name="CASE">LOWERCASE</field>
  <value name="TEXT">
    <shadow type="text" id="OX,!saC9B8f-otAMONWp">
      <field name="TEXT">abc</field>
    </shadow>
  </value>
</block>
<block type="text_changeCase" id="Z-]%{{^lnHw(FRkpfZX)" x="-1538" y="987">
  <field name="CASE">TITLECASE</field>
  <value name="TEXT">
    <shadow type="text" id="Z$V.*l-J.X[EBu75+;i=">
      <field name="TEXT">abc</field>
    </shadow>
  </value>
</block>
<block type="text_trim" id="lA8cScn=b0EiHdZ,CnR" x="-1538" y="1012">
  <field name="MODE">BOTH</field>
  <value name="TEXT">
    <shadow type="text" id="^e0wtHLoOiTD$=p#;Ja#">
      <field name="TEXT">abc</field>
    </shadow>
  </value>
</block>
<block type="text_trim" id="#WYLU3P~n{K(k}=ryxpV" x="-1537" y="1037">
  <field name="MODE">LEFT</field>
  <value name="TEXT">
    <shadow type="text" id="HXWZ]T{0p$#iqGr]l,0R">
      <field name="TEXT">abc</field>
    </shadow>
  </value>
</block>
<block type="text_trim" id="yi_XwIarciBlic_8_!US" x="-1538" y="1062">
  <field name="MODE">RIGHT</field>
  <value name="TEXT">
    <shadow type="text" id="]tfbk?T)nw3S%.6})9g]">
      <field name="TEXT">abc</field>
    </shadow>
  </value>
</block>
<block type="text_print" id="fE|cZ40e@dt2GgxUW{%" x="-1512" y="1088">
  <value name="TEXT">
    <shadow type="text" id="{YpB--#D}azV+J+LLeVz">
      <field name="TEXT">abc</field>
    </shadow>
  </value>
</block>
<block type="text_prompt_ext" id="q)ou$M5~0:1Q6=c+CsS-" x="-1538" y="1137">
  <mutation type="TEXT"></mutation>
  <field name="TYPE">TEXT</field>
  <value name="TEXT">
    <shadow type="text" id="Rwu@w1KauVG;2PU0eLPE">
      <field name="TEXT">abc</field>
    </shadow>
  </value>
</block>
</xml>`


var Blockly_genarator = require('./AST_generator.js')
var ast = Blockly_genarator.Generator(xmlText)
console.log(ast)