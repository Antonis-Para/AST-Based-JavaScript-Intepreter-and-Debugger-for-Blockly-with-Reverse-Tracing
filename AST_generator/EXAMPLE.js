//Template example
var xmlText = `<xml xmlns="https://developers.google.com/blockly/xml">
<variables>
  <variable id="rXW:z%D):AyBnLI4|6O">list</variable>
</variables>
<block type="variables_set" id="-6F{di*{#YFX9_fMUY5k" x="88" y="37">
  <field name="VAR" id="rXW:z%D):AyBnLI4|6O">list</field>
  <value name="VALUE">
    <block type="lists_repeat" id="|LIb.kDT}vPNFR^E6k)P">
      <value name="ITEM">
        <block type="math_number" id="GrNv!-632=n~v=de,3]o">
          <field name="NUM">5</field>
        </block>
      </value>
      <value name="NUM">
        <shadow type="math_number" id="01Lo{8DXQ@^-x)?c#{">
          <field name="NUM">50</field>
        </shadow>
      </value>
    </block>
  </value>
  <next>
    <block type="text_print" id="E]pWv*wY:!*e91sIHNVr">
      <value name="TEXT">
        <shadow type="text" id="7I3aGZ{lJ^EDIhVoMcWl">
          <field name="TEXT">abc</field>
        </shadow>
        <block type="lists_getSublist" id=";YZx?rt=IKUWd2s%,M6~">
          <mutation at1="true" at2="true"></mutation>
          <field name="WHERE1">FROM_START</field>
          <field name="WHERE2">FROM_START</field>
          <value name="LIST">
            <block type="variables_get" id="S2}#q_u7:-7):6BV}2$$">
              <field name="VAR" id="rXW:z%D):AyBnLI4|6O">list</field>
            </block>
          </value>
          <value name="AT1">
            <block type="math_number" id="xqd0c|x8E]Hf!+DD.)@">
              <field name="NUM">10</field>
            </block>
          </value>
          <value name="AT2">
            <block type="math_number" id=".y=lr-n*mu#Op4@G+CJH">
              <field name="NUM">20</field>
            </block>
          </value>
        </block>
      </value>
      <next>
        <block type="text_print" id="ZtiBk~BF}~~;MUrF@Om=">
          <value name="TEXT">
            <shadow type="text" id="k~tjPIX!yhN(5CCWKdVq">
              <field name="TEXT">abc</field>
            </shadow>
            <block type="lists_getSublist" id="*{/yjpuS~?4^AS|CUlJk">
              <mutation at1="true" at2="true"></mutation>
              <field name="WHERE1">FROM_START</field>
              <field name="WHERE2">FROM_END</field>
              <value name="LIST">
                <block type="variables_get" id="P(t$_F1@U5U!}5RpjY?$">
                  <field name="VAR" id="rXW:z%D):AyBnLI4|6O">list</field>
                </block>
              </value>
              <value name="AT1">
                <block type="math_number" id="MK8;c~.mIP9dIvFSD:BX">
                  <field name="NUM">10</field>
                </block>
              </value>
              <value name="AT2">
                <block type="math_number" id="[EAVooThR8;e:Yk@vK3-">
                  <field name="NUM">20</field>
                </block>
              </value>
            </block>
          </value>
          <next>
            <block type="text_print" id=")Tpn-i.bcYT[]0aJV=qb">
              <value name="TEXT">
                <shadow type="text" id="D?8-Jrt*=6}zx~gmV1W[">
                  <field name="TEXT">abc</field>
                </shadow>
                <block type="lists_getSublist" id="Y8;t)Qu5UR6lXWG((K.">
                  <mutation at1="true" at2="false"></mutation>
                  <field name="WHERE1">FROM_START</field>
                  <field name="WHERE2">LAST</field>
                  <value name="LIST">
                    <block type="variables_get" id="U~B!?i^_L7}:AKcK,a">
                      <field name="VAR" id="rXW:z%D):AyBnLI4|6O">list</field>
                    </block>
                  </value>
                  <value name="AT1">
                    <block type="math_number" id="G^%e3a(jAzwizs?i*Wms">
                      <field name="NUM">10</field>
                    </block>
                  </value>
                </block>
              </value>
              <next>
                <block type="text_print" id="GlV@cq_5JY,^gl!j+|rR">
                  <value name="TEXT">
                    <shadow type="text" id="MyR.#f;l]nvPH*TS04TF">
                      <field name="TEXT">abc</field>
                    </shadow>
                    <block type="lists_getSublist" id="^*qvpm@ip%*fCS$QT+~X">
                      <mutation at1="true" at2="true"></mutation>
                      <field name="WHERE1">FROM_END</field>
                      <field name="WHERE2">FROM_START</field>
                      <value name="LIST">
                        <block type="variables_get" id="pHlHVPcvYtlaj:o,P91/">
                          <field name="VAR" id="rXW:z%D):AyBnLI4|6O">list</field>
                        </block>
                      </value>
                      <value name="AT1">
                        <block type="math_number" id="1J|^uhzE6TDLznyx/BIg">
                          <field name="NUM">10</field>
                        </block>
                      </value>
                      <value name="AT2">
                        <block type="math_number" id="Z-tF{-rQQ_4yZnm4ASdw">
                          <field name="NUM">20</field>
                        </block>
                      </value>
                    </block>
                  </value>
                  <next>
                    <block type="text_print" id="0utYUkH*Guh(ws}qx,X)">
                      <value name="TEXT">
                        <shadow type="text" id="wyvL$(xDJ$fx%ai7286">
                          <field name="TEXT">abc</field>
                        </shadow>
                        <block type="lists_getSublist" id="@D~2|^$(n2910WIDg}6{">
                          <mutation at1="true" at2="true"></mutation>
                          <field name="WHERE1">FROM_END</field>
                          <field name="WHERE2">FROM_END</field>
                          <value name="LIST">
                            <block type="variables_get" id="Gr=dBaw[2bw%BbTt|[su">
                              <field name="VAR" id="rXW:z%D):AyBnLI4|6O">list</field>
                            </block>
                          </value>
                          <value name="AT1">
                            <block type="math_number" id="$w|bW/rQTS,U8H(,y[6[">
                              <field name="NUM">10</field>
                            </block>
                          </value>
                          <value name="AT2">
                            <block type="math_number" id="zrqYSAp0}TQiqNPSnZf%">
                              <field name="NUM">20</field>
                            </block>
                          </value>
                        </block>
                      </value>
                      <next>
                        <block type="text_print" id="T*%1Tp:SD//{d6rP+=Eq">
                          <value name="TEXT">
                            <shadow type="text" id="IVl3.LMMfbp(HO}Y*,rB">
                              <field name="TEXT">abc</field>
                            </shadow>
                            <block type="lists_getSublist" id="@913B+~/P+W:jMW-_q0O">
                              <mutation at1="true" at2="false"></mutation>
                              <field name="WHERE1">FROM_END</field>
                              <field name="WHERE2">LAST</field>
                              <value name="LIST">
                                <block type="variables_get" id="6Ry=CRma$rA;Nk[BPp1S">
                                  <field name="VAR" id="rXW:z%D):AyBnLI4|6O">list</field>
                                </block>
                              </value>
                              <value name="AT1">
                                <block type="math_number" id="LLaYdW?.z1GFAyb@3YN">
                                  <field name="NUM">10</field>
                                </block>
                              </value>
                            </block>
                          </value>
                          <next>
                            <block type="text_print" id="g@RPajz=wACR]_2Svuwy">
                              <value name="TEXT">
                                <shadow type="text" id="hP~v2:GR71k0,%C79KWH">
                                  <field name="TEXT">abc</field>
                                </shadow>
                                <block type="lists_getSublist" id="y9]XAWlh/1(6Y-x?s7w">
                                  <mutation at1="false" at2="true"></mutation>
                                  <field name="WHERE1">FIRST</field>
                                  <field name="WHERE2">FROM_START</field>
                                  <value name="LIST">
                                    <block type="variables_get" id="4D+SJR0o;2)A~{D[)K]T">
                                      <field name="VAR" id="rXW:z%D):AyBnLI4|6O">list</field>
                                    </block>
                                  </value>
                                  <value name="AT2">
                                    <block type="math_number" id="NVNV9P#fhff$:La1U8t!">
                                      <field name="NUM">20</field>
                                    </block>
                                  </value>
                                </block>
                              </value>
                              <next>
                                <block type="text_print" id="-vvF;K=5)pLkk^(y0iy">
                                  <value name="TEXT">
                                    <shadow type="text" id=".RPVE*G}oGPA[(#J)hgS">
                                      <field name="TEXT">abc</field>
                                    </shadow>
                                    <block type="lists_getSublist" id="W~9j]t]n8,[.MVfm[rL]">
                                      <mutation at1="false" at2="true"></mutation>
                                      <field name="WHERE1">FIRST</field>
                                      <field name="WHERE2">FROM_END</field>
                                      <value name="LIST">
                                        <block type="variables_get" id="r}]_:yA@],#pEY]COoPn">
                                          <field name="VAR" id="rXW:z%D):AyBnLI4|6O">list</field>
                                        </block>
                                      </value>
                                      <value name="AT2">
                                        <block type="math_number" id=":+86}1LP9dqsMu}iaeVq">
                                          <field name="NUM">20</field>
                                        </block>
                                      </value>
                                    </block>
                                  </value>
                                  <next>
                                    <block type="text_print" id="8H^U-oOJ@e(I|22zw,QI">
                                      <value name="TEXT">
                                        <shadow type="text" id="aZ){)A/fR8%Hn5]_tR}x">
                                          <field name="TEXT">abc</field>
                                        </shadow>
                                        <block type="lists_getSublist" id="b}@Gayv9W:klyt9{q1?[">
                                          <mutation at1="false" at2="false"></mutation>
                                          <field name="WHERE1">FIRST</field>
                                          <field name="WHERE2">LAST</field>
                                          <value name="LIST">
                                            <block type="variables_get" id="#ZfL;@rOEMM~%l#OCbzh">
                                              <field name="VAR" id="rXW:z%D):AyBnLI4|6O">list</field>
                                            </block>
                                          </value>
                                        </block>
                                      </value>
                                    </block>
                                  </next>
                                </block>
                              </next>
                            </block>
                          </next>
                        </block>
                      </next>
                    </block>
                  </next>
                </block>
              </next>
            </block>
          </next>
        </block>
      </next>
    </block>
  </next>
</block>
</xml>`

var Blockly_genarator = require('./AST_generator.js')
var ast = Blockly_genarator.Generator(xmlText)

var inter = require('./interpreter.js').Interpreter
inter.init(ast)
inter.eval(ast);