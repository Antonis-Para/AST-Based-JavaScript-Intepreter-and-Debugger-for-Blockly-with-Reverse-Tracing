//Template example
var xmlText = `<xml xmlns="https://developers.google.com/blockly/xml">
  <variables>
    <variable id="lpT]K~WM=*MgHiuvf3V7">j</variable>
    <variable id=",W+i;k!qO]%8_FMka#pU">item</variable>
    <variable id="V2Nrx[;,4-qtrG3J2{1g">i</variable>
    <variable id="XJ]27c9I:/MNoT+PYwn*">text</variable>
    <variable id="N*w;-595o#*dc4w45gyi">list</variable>
  </variables>
  <block type="controls_if" id="ATrrZn$C;J4[_Qiv%DIv" x="-412" y="-288"></block>
  <block type="logic_operation" id="66wVR?+NKugpXl{5LM]*" x="-437" y="-212">
    <field name="OP">AND</field>
  </block>
  <block type="logic_compare" id="%}ZD#Mr+Arn3_))IOv9f" x="-412" y="-163">
    <field name="OP">EQ</field>
  </block>
  <block type="logic_negate" id="!{i][ie$%CrFewt!jU.n" x="-413" y="-113"></block>
  <block type="logic_boolean" id="HDLM?fj)$%CLfs=got@u" x="-413" y="-87">
    <field name="BOOL">TRUE</field>
  </block>
  <block type="logic_null" id="g?#fb[uk|*2zDt3c}gML" x="-412" y="-37"></block>
  <block type="logic_ternary" id="]|i3FY!RSqkA#k#^(L/U" x="-413" y="13"></block>
  <block type="controls_repeat_ext" id="3|Jb3NGTCd%M=yl8!}aC" x="-412" y="137">
    <value name="TIMES">
      <shadow type="math_number" id="XdLOcc0OGNV@%nKED^?g">
        <field name="NUM">10</field>
      </shadow>
    </value>
  </block>
  <block type="controls_whileUntil" id="FpK3p+[zs5BNX=dTcy2;" x="-412" y="262">
    <field name="MODE">WHILE</field>
    <next>
      <block type="controls_for" id="J4q{qwWC(_]~pwOnB{2X">
        <field name="VAR" id="V2Nrx[;,4-qtrG3J2{1g">i</field>
        <value name="FROM">
          <shadow type="math_number" id="OA(l)?XT@*aF^9M@XW*d">
            <field name="NUM">1</field>
          </shadow>
        </value>
        <value name="TO">
          <shadow type="math_number" id="(.Sp!8~5V+11=6wFd8.d">
            <field name="NUM">10</field>
          </shadow>
        </value>
        <value name="BY">
          <shadow type="math_number" id="u#mUk7}vv4FIU~e{C_kK">
            <field name="NUM">1</field>
          </shadow>
        </value>
      </block>
    </next>
  </block>
  <block type="controls_forEach" id="npNw%bLf#:4/qg$]!S2V" x="-413" y="438">
    <field name="VAR" id="lpT]K~WM=*MgHiuvf3V7">j</field>
    <statement name="DO">
      <block type="controls_flow_statements" id="i?*VNVmT6th/asI+.4=+">
        <field name="FLOW">BREAK</field>
      </block>
    </statement>
  </block>
  <block type="math_number" id="_ENwzvCZLk{G[(cf6F75" x="-412" y="537">
    <field name="NUM">123</field>
  </block>
  <block type="math_arithmetic" id="DRvm?%joQa[7{Z|a5wb:" x="-413" y="587">
    <field name="OP">ADD</field>
    <value name="A">
      <shadow type="math_number" id=":eaUa.n-uuf=G2YzIu+6">
        <field name="NUM">1</field>
      </shadow>
    </value>
    <value name="B">
      <shadow type="math_number" id="TMIm76RZ8Cb]_(cw?wpz">
        <field name="NUM">1</field>
      </shadow>
    </value>
  </block>
  <block type="math_single" id="k9Ii#YmAXk3=Q{#-ukPe" x="-412" y="662">
    <field name="OP">ROOT</field>
    <value name="NUM">
      <shadow type="math_number" id=".ZAL7A*iZGa~L;cp7Gq_">
        <field name="NUM">9</field>
      </shadow>
    </value>
  </block>
  <block type="math_trig" id="P7w/R9~bwpa%HRA18.hw" x="-437" y="713">
    <field name="OP">SIN</field>
    <value name="NUM">
      <shadow type="math_number" id="Yp/hL;EIrjO{73:{$sWm">
        <field name="NUM">45</field>
      </shadow>
    </value>
  </block>
  <block type="math_constant" id="e2ZD7_/4tPQJJsf^*n{," x="-413" y="763">
    <field name="CONSTANT">PI</field>
  </block>
  <block type="math_number_property" id="HOCHgwju~4=wDVN/Vsc[" x="-437" y="813">
    <mutation divisor_input="false"></mutation>
    <field name="PROPERTY">EVEN</field>
    <value name="NUMBER_TO_CHECK">
      <shadow type="math_number" id="duw3:3HKM5MQdS,_O@1E">
        <field name="NUM">0</field>
      </shadow>
    </value>
  </block>
  <block type="math_round" id=".IC-EA%YPEQY@jD;G5p[" x="-438" y="888">
    <field name="OP">ROUND</field>
    <value name="NUM">
      <shadow type="math_number" id="1^4=/uHLTIu8%p90zHG/">
        <field name="NUM">3.1</field>
      </shadow>
    </value>
  </block>
  <block type="math_on_list" id="4a,ssN(HAP-?2v0Cj3qH" x="-437" y="937">
    <mutation op="SUM"></mutation>
    <field name="OP">SUM</field>
  </block>
  <block type="math_modulo" id="7wSxk_Vje;Zh)D{1{ZHp" x="-438" y="987">
    <value name="DIVIDEND">
      <shadow type="math_number" id="{i:yQjF@kCd-nr{J@!~H">
        <field name="NUM">64</field>
      </shadow>
    </value>
    <value name="DIVISOR">
      <shadow type="math_number" id="Cx+jHt*_SHp1yo:A]V:0">
        <field name="NUM">10</field>
      </shadow>
    </value>
  </block>
  <block type="math_constrain" id="euAm;l!k;hh/$HJ^[V=j" x="-437" y="1063">
    <value name="VALUE">
      <shadow type="math_number" id="Y*{sS~8a%o!qUBJeI[mb">
        <field name="NUM">50</field>
      </shadow>
    </value>
    <value name="LOW">
      <shadow type="math_number" id="M*sr|VMd%7?T7N{kY@2,">
        <field name="NUM">1</field>
      </shadow>
    </value>
    <value name="HIGH">
      <shadow type="math_number" id="*Y!]gwm4[z7!$-*d7R~S">
        <field name="NUM">100</field>
      </shadow>
    </value>
  </block>
  <block type="math_random_int" id="]-dttS(0y[Q|ApRXZxTO" x="-438" y="1138">
    <value name="FROM">
      <shadow type="math_number" id="8NHn$?{g[wrr=c(u+d^$">
        <field name="NUM">1</field>
      </shadow>
    </value>
    <value name="TO">
      <shadow type="math_number" id="QK=~~Eottu7ZWFB{)gtF">
        <field name="NUM">100</field>
      </shadow>
    </value>
  </block>
  <block type="math_random_float" id="@P3w$)GC_{vCu*QXe7}G" x="-413" y="1212"></block>
  <block type="math_atan2" id="vwjD3xz,a%Mm6ca~Dt[5" x="-437" y="1238">
    <value name="X">
      <shadow type="math_number" id="E/0dY?4E3-0:Sd46}FJR">
        <field name="NUM">1</field>
      </shadow>
    </value>
    <value name="Y">
      <shadow type="math_number" id="u{:=]vO)$=S5[$T53.1)">
        <field name="NUM">1</field>
      </shadow>
    </value>
  </block>
  <block type="text" id=")P3Sf4spnYt{|1yTkA:A" x="-438" y="1313">
    <field name="TEXT"></field>
  </block>
  <block type="text_join" id="_6_ML6NLz!o~bh-gRZdI" x="-437" y="1338">
    <mutation items="2"></mutation>
  </block>
  <block type="text_append" id="cQYK/!{tik:iFG^8n:z!" x="-462" y="1437">
    <field name="VAR" id=",W+i;k!qO]%8_FMka#pU">item</field>
    <value name="TEXT">
      <shadow type="text" id="(P+JP]rWan~3n0!3qwo=">
        <field name="TEXT"></field>
      </shadow>
    </value>
  </block>
  <block type="text_length" id="*zX47T?[xi}69)_k/t^2" x="-463" y="1512">
    <value name="VALUE">
      <shadow type="text" id="sz0)jlT_pSGU{Zmd)_R3">
        <field name="TEXT">abc</field>
      </shadow>
    </value>
  </block>
  <block type="text_isEmpty" id="FV_en!k%jW+#!^|V|$t0" x="-462" y="1588">
    <value name="VALUE">
      <shadow type="text" id="fAi]hNDba6]h~$z[]Qk{">
        <field name="TEXT"></field>
      </shadow>
    </value>
  </block>
  <block type="text_indexOf" id="?R$_t;YU%:*0~zmGD|;," x="-487" y="1663">
    <field name="END">FIRST</field>
    <value name="VALUE">
      <block type="variables_get" id="vMLD~pmGwjtX)LbGec*B">
        <field name="VAR" id="XJ]27c9I:/MNoT+PYwn*">text</field>
      </block>
    </value>
    <value name="FIND">
      <shadow type="text" id="iCA9)l;RZs3w7fiVm$Dp">
        <field name="TEXT">abc</field>
      </shadow>
    </value>
  </block>
  <block type="text_charAt" id="n-iitlPgg$cW*^lggR;g" x="-13" y="1663">
    <mutation at="true"></mutation>
    <field name="WHERE">FROM_START</field>
    <value name="VALUE">
      <block type="variables_get" id="nZ:nF4f|hx!lwcHu.1E+">
        <field name="VAR" id="XJ]27c9I:/MNoT+PYwn*">text</field>
      </block>
    </value>
  </block>
  <block type="text_getSubstring" id="d{fFNdh3Yf_O$%wX5Epz" x="288" y="1662">
    <mutation at1="true" at2="true"></mutation>
    <field name="WHERE1">FROM_START</field>
    <field name="WHERE2">FROM_START</field>
    <value name="STRING">
      <block type="variables_get" id="M[,U!MU}ih$+Id09e_aK">
        <field name="VAR" id="XJ]27c9I:/MNoT+PYwn*">text</field>
      </block>
    </value>
  </block>
  <block type="text_changeCase" id="?:L%%Ve4nUCezV?7Ff@2" x="-463" y="1738">
    <field name="CASE">UPPERCASE</field>
    <value name="TEXT">
      <shadow type="text" id="Vg-O#|+hZsL}$==fv(Cm">
        <field name="TEXT">abc</field>
      </shadow>
    </value>
  </block>
  <block type="text_trim" id="Zm-3(._V{mTPhB=ZUj)T" x="-462" y="1787">
    <field name="MODE">BOTH</field>
    <value name="TEXT">
      <shadow type="text" id="o_NG@pZOVe1x;{LZ^ay7">
        <field name="TEXT">abc</field>
      </shadow>
    </value>
  </block>
  <block type="text_print" id="tZ*fp5n*wRA]Bv^~9nXW" x="-462" y="1838">
    <value name="TEXT">
      <shadow type="text" id=";;1Kwv!3Zz^7b|S!=}c1">
        <field name="TEXT">abc</field>
      </shadow>
    </value>
  </block>
  <block type="text_prompt_ext" id="cWw^VP[FMqWVlmwdUfO%" x="-463" y="1887">
    <mutation type="TEXT"></mutation>
    <field name="TYPE">TEXT</field>
    <value name="TEXT">
      <shadow type="text" id="2hf,KpEYh_8]6x{BDc4B">
        <field name="TEXT">abc</field>
      </shadow>
    </value>
  </block>
  <block type="lists_create_with" id="@hSJ=VtyJB-.h=6?28Pz" x="-462" y="1938">
    <mutation items="0"></mutation>
  </block>
  <block type="lists_create_with" id="xd#{aIW})Chs_zv6OvDH" x="-488" y="1988">
    <mutation items="3"></mutation>
  </block>
  <block type="lists_repeat" id="{_(7(H{#axzQsxAsL$u," x="-487" y="2112">
    <value name="NUM">
      <shadow type="math_number" id="9xv;0]xT:5KHJo(a[AXM">
        <field name="NUM">5</field>
      </shadow>
    </value>
  </block>
  <block type="lists_length" id="GgT[{k2s4F[o;g(vRC;w" x="-488" y="2187"></block>
  <block type="lists_isEmpty" id="Gx_@!Ol8luwD+@K+mZm?" x="-487" y="2263"></block>
  <block type="lists_indexOf" id="$ji+|ClB65O;(O3Qg#{-" x="-487" y="2337">
    <field name="END">FIRST</field>
    <value name="VALUE">
      <block type="variables_get" id="-Zd([I473S9uN=rJvq|3">
        <field name="VAR" id="N*w;-595o#*dc4w45gyi">list</field>
      </block>
    </value>
  </block>
  <block type="lists_getIndex" id="q*OZ=(oN(1PYe]p6#(*I" x="-488" y="2413">
    <mutation statement="false" at="true"></mutation>
    <field name="MODE">GET</field>
    <field name="WHERE">FROM_START</field>
    <value name="VALUE">
      <block type="variables_get" id="o,mru@b}^oCuu6bgl[8w">
        <field name="VAR" id="N*w;-595o#*dc4w45gyi">list</field>
      </block>
    </value>
  </block>
  <block type="lists_setIndex" id="4Zv4a$hKw~%L;]F?b#o9" x="-487" y="2463">
    <mutation at="true"></mutation>
    <field name="MODE">SET</field>
    <field name="WHERE">FROM_START</field>
    <value name="LIST">
      <block type="variables_get" id="w#UWJ}7XXoK2G#+I1^Y3">
        <field name="VAR" id="N*w;-595o#*dc4w45gyi">list</field>
      </block>
    </value>
  </block>
  <block type="lists_getSublist" id="S4#!)@$KR%Nv1?2^G*[#" x="-487" y="2537">
    <mutation at1="true" at2="true"></mutation>
    <field name="WHERE1">FROM_START</field>
    <field name="WHERE2">FROM_START</field>
    <value name="LIST">
      <block type="variables_get" id="Ggj7wuuAYL-U:wsC@0YW">
        <field name="VAR" id="N*w;-595o#*dc4w45gyi">list</field>
      </block>
    </value>
  </block>
  <block type="lists_split" id="nv~}Da3|mAA]pUXPcj5-" x="-488" y="2612">
    <mutation mode="SPLIT"></mutation>
    <field name="MODE">SPLIT</field>
    <value name="DELIM">
      <shadow type="text" id="~:h)Wm0%Jt4brpN_=nGL">
        <field name="TEXT">,</field>
      </shadow>
    </value>
  </block>
  <block type="lists_sort" id="I)iK@PHPv?H)K:S;Kj7s" x="-488" y="2688">
    <field name="TYPE">NUMERIC</field>
    <field name="DIRECTION">1</field>
  </block>
  <block type="colour_picker" id="dg|jBn6g^JDRzFOh6-L$" x="-462" y="2737">
    <field name="COLOUR">#ff0000</field>
  </block>
  <block type="colour_random" id=";},yLcSK|5wwLG8;X.u6" x="-488" y="2788"></block>
  <block type="colour_rgb" id="Cf!i5}Dky3%5;vHegAc6" x="-488" y="2838">
    <value name="RED">
      <shadow type="math_number" id="+lOwN0,vrX$(mQPv(O)}">
        <field name="NUM">100</field>
      </shadow>
    </value>
    <value name="GREEN">
      <shadow type="math_number" id="*.VeFtE;SU{=CS^S)|kn">
        <field name="NUM">50</field>
      </shadow>
    </value>
    <value name="BLUE">
      <shadow type="math_number" id="8@$Y]/@UqeS3Cw2RZ9p3">
        <field name="NUM">0</field>
      </shadow>
    </value>
  </block>
  <block type="colour_blend" id="{#4,keKM@xO63oM[x!Ww" x="-488" y="2938">
    <value name="COLOUR1">
      <shadow type="colour_picker" id="7IQmhz[ubWF5FEgdfz*b">
        <field name="COLOUR">#ff0000</field>
      </shadow>
    </value>
    <value name="COLOUR2">
      <shadow type="colour_picker" id="v#6)]mzNpaole=18arqU">
        <field name="COLOUR">#3333ff</field>
      </shadow>
    </value>
    <value name="RATIO">
      <shadow type="math_number" id="-lcesNLnKIQ4ZFBv0E@t">
        <field name="NUM">0.5</field>
      </shadow>
    </value>
  </block>
  <block type="variables_set" id="NThn-A/A]p||}FJdwP}Q" x="-488" y="3088">
    <field name="VAR" id="XJ]27c9I:/MNoT+PYwn*">text</field>
  </block>
  <block type="math_change" id="2w8)%f#05+cWT+w~67#v" x="-487" y="3163">
    <field name="VAR" id="XJ]27c9I:/MNoT+PYwn*">text</field>
    <value name="DELTA">
      <shadow type="math_number" id="Un=g-)eny!)bZnnX:2@Z">
        <field name="NUM">1</field>
      </shadow>
    </value>
  </block>
  <block type="variables_get" id="Y7^puAt_5=$zZD5I]T[Q" x="-487" y="3238">
    <field name="VAR" id="V2Nrx[;,4-qtrG3J2{1g">i</field>
  </block>
  <block type="procedures_defnoreturn" id="ay}@rKd0}NPT$y]HQFU0" x="-513" y="3288">
    <field name="NAME">do something</field>
    <comment pinned="false" h="80" w="160">Describe this function...</comment>
    <statement name="STACK">
      <block type="procedures_ifreturn" id="zB0jtub_Kx[i$Vpi.{lO">
        <mutation value="0"></mutation>
      </block>
    </statement>
  </block>
  <block type="procedures_defreturn" id="s*j-*QnYN.c$fJ6;|Sr}" x="-512" y="3388">
    <field name="NAME">do something2</field>
    <comment pinned="false" h="80" w="160">Describe this function...</comment>
    <statement name="STACK">
      <block type="procedures_callnoreturn" id="h3(zlfI*lnN{2F}Wu2F_">
        <mutation name="do something"></mutation>
      </block>
    </statement>
  </block>
  <block type="procedures_callreturn" id="{pob5a.|swuNj2Ho:WYD" x="-537" y="3538">
    <mutation name="do something2"></mutation>
  </block>
</xml>`


var Blockly_genarator = require('./AST_generator.js')
var ast = Blockly_genarator.Generator(xmlText)
console.log(ast)