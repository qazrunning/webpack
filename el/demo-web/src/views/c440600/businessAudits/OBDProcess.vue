<template>
  <div>
    <!-- 柴油OBD -->
    <table v-if="!QY_CY" border="1" class="fld-container" style="
                                width:100%;
                                margin: auto auto;
                                border-collapse: collapse !important;
                            ">
      <tr>
        <td colspan="6">
          <span style="font-weight: bold">OBD检查</span>
        </td>
      </tr>
      <tr>
        <td rowspan="5">OBD故障指示器</td>
        <td colspan="2" rowspan="3">通讯</td>
        <td style="border-right: none">
          <img :src="
                                            newprints.txcg
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        " style="width: 12px; height: 12px" />
          <span>&nbsp;通讯成功</span>
        </td>
        <td colspan="2" style="border-left: none">
          <img :src="
                                            newprints.txsb
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        " style="width: 12px; height: 12px" />
          <span>&nbsp;通讯不成功</span>
        </td>
      </tr>
      <tr>
        <td colspan="3" style="border-bottom: none">通讯不成功的（填写以下原因）</td>
      </tr>
      <tr>
        <td style="border-top: none; border-right: none">
          <img :src="
                                            newprints.jksh
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        " style="width: 12px; height: 12px" />
          <span>&nbsp;接口损坏</span>
        </td>
        <td style="
                                        border-top: none;
                                        border-right: none;
                                        border-left: none;
                                    ">
          <img :src="
                                            newprints.zbdjk
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        " style="width: 12px; height: 12px" />
          <span>&nbsp;找不到接口</span>
        </td>
        <td style="border-top: none; border-left: none">
          <img :src="
                                            newprints.ljhbntx
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        " style="width: 12px; height: 12px" />
          <span>&nbsp;连接后不能通讯</span>
        </td>
      </tr>
      <tr>
        <td colspan="2">OBD系统故障指示器报警及故障码</td>
        <td style="border-right: none">
          <img :src="
                                            newprints.ygz
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        " style="width: 12px; height: 12px" />
          <span>&nbsp;有</span>
        </td>
        <td style="border-left: none" colspan="2">
          <img :src="
                                            newprints.wgz
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        " style="width: 12px; height: 12px" />
          <span>&nbsp;无</span>
        </td>
      </tr>
      <tr>
        <td colspan="2" v-show="
                                        InsDataInfo.InspectionKind !=
                                        '06'
                                    ">故障代码及故障信息（若故障指示器报警）</td>
        <td colspan="3" v-show="
                                        InsDataInfo.InspectionKind !=
                                        '06'
                                    ">{{ this.newprints.obdgzxx }}</td>
      </tr>
      <tr class="readyStatus" v-show="
                                    InsDataInfo.InspectionKind != '06'
                                ">
        <td rowspan="4">就绪状态</td>
        <td colspan="2" rowspan="4">就绪状态未完成项目</td>
        <td style="border-right: none">
          <img :src="
                                            newprints.jxw
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        " style="width: 12px; height: 12px" />
          <span>&nbsp;无</span>
        </td>
        <td colspan="2" style="border-left: none">
          <img :src="
                                            newprints.jxy
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        " style="width: 12px; height: 12px" />
          <span>&nbsp;有</span>
        </td>
      </tr>
      <tr class="readyStatus" v-show="
                                    InsDataInfo.InspectionKind != '06'
                                ">
        <td colspan="3">如有就绪未完成的，填写以下项目</td>
      </tr>
      <tr class="readyStatus" v-show="
                                    InsDataInfo.InspectionKind != '06'
                                ">
        <td style="border-right: none">
          <img :src="
                                            newprints.scr
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        " style="width: 12px; height: 12px" />
          <span>&nbsp;SCR</span>
        </td>
        <td style="
                                        border-right: none;
                                        border-left: none;
                                    ">
          <img :src="
                                            newprints.poc
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        " style="width: 12px; height: 12px" />
          <span>&nbsp;POC</span>
        </td>
        <td style="border-left: none">
          <img :src="
                                            newprints.doc
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        " style="width: 12px; height: 12px" />
          <span>&nbsp;DOC</span>
        </td>
      </tr>
      <tr class="readyStatus" v-show="
                                    InsDataInfo.InspectionKind != '06'
                                ">
        <td style="
                                        border-top: none;
                                        border-right: none;
                                        border-left: none;
                                    ">
          <img :src="
                                            newprints.dpf
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        " style="width: 12px; height: 12px" />
          <span>&nbsp;DPF</span>
        </td>
        <td style="
                                        border-top: none;
                                        border-right: none;
                                        border-left: none;
                                    ">
          <img :src="
                                            newprints.egr
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        " style="width: 12px; height: 12px" />
          <span>&nbsp;废气再循环（EGR）</span>
        </td>
        <td style="border-top: none; border-left: none"></td>
      </tr>
      <tr id="otherInfo" v-show="
                                    InsDataInfo.InspectionKind != '06'
                                ">
        <td>其他信息</td>
        <td colspan="2" style="border-right: none">MIL灯点亮后的行驶里程（km）：</td>
        <td colspan="3" style="border-left: none">
          <span>{{ newprints.ODO }}</span>
        </td>
      </tr>
      <tr>
        <td rowspan="3">CALID/CVN信息</td>
        <td>发动机控制单元</td>
        <td>CALID</td>
        <td>
          <span>
            {{
            newprints.ECU_CALID
            }}
          </span>
        </td>
        <td>CVN</td>
        <td>
          <span>{{ newprints.ECU_CVN }}</span>
        </td>
      </tr>
      <tr>
        <td>后处理控制单元（如适用）</td>
        <td>CALID</td>
        <td>
          <span>
            {{
            newprints.ACU_CALID
            }}
          </span>
        </td>
        <td>CVN</td>
        <td>
          <span>{{ newprints.ACU_CVN }}</span>
        </td>
      </tr>
      <tr>
        <td>其他控制单元（如适用）</td>
        <td>CALID</td>
        <td>
          <span>
            {{
            newprints.OCU_CALID
            }}
          </span>
        </td>
        <td>CVN</td>
        <td>
          <span>{{ newprints.OCU_CVN }}</span>
        </td>
      </tr>
      <tr>
        <td style="font-weight: bold">OBD检查结果</td>
        <td style="border-right: none">
          <img :src="
                                            newprints.hg
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        " style="width: 12px; height: 12px" />
          <span>&nbsp;合格</span>&nbsp;&nbsp;&nbsp;
          <img :src="
                                            newprints.bhg
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        " style="width: 12px; height: 12px" />
          <span>&nbsp;不合格</span>
        </td>
        <td colspan="2" style="border-left: none"></td>
        <td style="border-right: none">检测员：</td>
        <td style="border-left: none">
          <span>
            {{
            newprints.CheckPerson
            }}
          </span>
        </td>
      </tr>
    </table>
    <!-- 汽油OBD -->
    <table v-else border="1" class="fld-container" style="
                                width: 100%;
                                margin: auto auto;
                                border-collapse: collapse !important;
                            " data-bind="with: obdInfo">
      <tr>
        <td colspan="6">
          <span style="font-weight: bold">OBD检查</span>
        </td>
      </tr>
      <tr>
        <td rowspan="6">OBD故障指示器</td>
        <td colspan="2" v-show="
                                        InsDataInfo.InspectionKind !=
                                        '06'
                                    ">OBD系统故障指示器</td>
        <td style="border-right: none" v-show="
                                        InsDataInfo.InspectionKind !=
                                        '06'
                                    ">
          <img :src="
                                            newprints.gzhg
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        " style="width: 12px; height: 12px" />
          <span>&nbsp;合格</span>
        </td>
        <td colspan="2" style="border-left: none" v-show="
                                        InsDataInfo.InspectionKind !=
                                        '06'
                                    ">
          <img :src="
                                            newprints.gzbhg
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        " style="width: 12px; height: 12px" />
          <span>&nbsp;不合格</span>
        </td>
      </tr>
      <tr>
        <td colspan="2" rowspan="3">通讯</td>
        <td style="border-right: none">
          <img :src="
                                            newprints.txcg
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        " style="width: 12px; height: 12px" />
          <span>&nbsp;通讯成功</span>
        </td>
        <td colspan="2" style="border-left: none">
          <img :src="
                                            newprints.txsb
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        " style="width: 12px; height: 12px" />
          <span>&nbsp;通讯不成功</span>
        </td>
      </tr>
      <tr>
        <td colspan="3" style="border-bottom: none">通讯不成功的（填写以下原因）</td>
      </tr>
      <tr id="item">
        <td style="border-top: none; border-right: none">
          <img :src="
                                            newprints.jksh
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        " style="width: 12px; height: 12px" />
          <span>&nbsp;接口损坏</span>
        </td>
        <td style="
                                        border-top: none;
                                        border-right: none;
                                        border-left: none;
                                    ">
          <img :src="
                                            newprints.zbdjk
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        " style="width: 12px; height: 12px" />
          <span>&nbsp;找不到接口</span>
        </td>
        <td style="border-top: none; border-left: none">
          <img :src="
                                            newprints.ljhbntx
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        " style="width: 12px; height: 12px" />
          <span>&nbsp;连接后不能通讯</span>
        </td>
      </tr>
      <tr>
        <td colspan="2">OBD系统故障指示器报警</td>
        <td style="border-right: none">
          <img :src="
                                            newprints.ygz
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        " style="width: 12px; height: 12px" />
          <span>&nbsp;有</span>
        </td>
        <td style="border-left: none" colspan="2">
          <img :src="
                                            newprints.wgz
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        " style="width: 12px; height: 12px" />
          <span>&nbsp;无</span>
        </td>
      </tr>
      <tr>
        <td colspan="2" v-show="
                                        InsDataInfo.InspectionKind !=
                                        '06'
                                    ">故障代码及故障信息（若故障指示器报警）</td>
        <td colspan="3" v-show="
                                        InsDataInfo.InspectionKind !=
                                        '06'
                                    ">{{ this.newprints.obdgzxx }}</td>
      </tr>
      <tr class="readyStatus" v-show="
                                    InsDataInfo.InspectionKind != '06'
                                ">
        <td rowspan="4">就绪状态</td>
        <td colspan="2" rowspan="4">就绪状态未完成项目</td>
        <td style="border-right: none">
          <img :src="
                                            newprints.jxw
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        " style="width: 12px; height: 12px" />
          <span>&nbsp;无</span>
        </td>
        <td colspan="2" style="border-left: none">
          <img :src="
                                            newprints.jxy
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        " style="width: 12px; height: 12px" />
          <span>&nbsp;有</span>
        </td>
      </tr>
      <tr class="readyStatus" v-show="
                                    InsDataInfo.InspectionKind != '06'
                                ">
        <td colspan="3">如有就绪未完成的，填写以下项目</td>
      </tr>
      <tr class="readyStatus" v-show="
                                    InsDataInfo.InspectionKind != '06'
                                ">
        <td style="border-right: none">
          <img :src="
                                            newprints.chq
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        " style="width: 12px; height: 12px" />
          <span>&nbsp;催化器</span>
        </td>
        <td style="
                                        border-right: none;
                                        border-left: none;
                                    ">
          <img :src="
                                            newprints.ycgq
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        " style="width: 12px; height: 12px" />
          <span>&nbsp;氧传感器</span>
        </td>
        <td style="border-left: none">
          <img :src="
                                            newprints.ycgqjr
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        " style="width: 12px; height: 12px" />
          <span>&nbsp;氧传感器加热器</span>
        </td>
      </tr>
      <tr class="readyStatus" v-show="
                                    InsDataInfo.InspectionKind != '06'
                                ">
        <td colspan="2" style="
                                        border-right: none;
                                        border-left: none;
                                    ">
          <img :src="
                                            newprints.egr
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        " style="width: 12px; height: 12px" />
          <span>&nbsp;废气再循环(EGR)/可变气门VVT</span>
        </td>
        <td style="border-left: none"></td>
      </tr>
      <tr id="otherInfo" v-show="
                                    InsDataInfo.InspectionKind != '06'
                                ">
        <td>其他信息</td>
        <td colspan="2" style="border-right: none">MIL灯点亮后的行驶里程（km）：</td>
        <td colspan="3" style="border-left: none">
          <span data-bind="text:ODO.value"></span>
        </td>
      </tr>
      <tr>
        <td rowspan="3">CALID/CVN信息</td>
        <td>发动机控制单元</td>
        <td>CALID</td>
        <td>
          <span>
            {{
            newprints.ECU_CALID
            }}
          </span>
        </td>
        <td>CVN</td>
        <td>
          <span>{{ newprints.ECU_CVN }}</span>
        </td>
      </tr>
      <tr>
        <td>后处理控制单元（如适用）</td>
        <td>CALID</td>
        <td>
          <span>
            {{
            newprints.ACU_CALID
            }}
          </span>
        </td>
        <td>CVN</td>
        <td>
          <span>{{ newprints.ACU_CVN }}</span>
        </td>
      </tr>
      <tr>
        <td>其他控制单元（如适用）</td>
        <td>CALID</td>
        <td>
          <span>
            {{
            newprints.OCU_CALID
            }}
          </span>
        </td>
        <td>CVN</td>
        <td>
          <span>{{ newprints.OCU_CVN }}</span>
        </td>
      </tr>
      <tr>
        <td style="font-weight: bold">OBD检查结果</td>
        <td style="border-right: none">
          <img :src="
                                            newprints.hg
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        " style="width: 12px; height: 12px" />
          <span>&nbsp;合格</span>&nbsp;&nbsp;&nbsp;
          <img :src="
                                            newprints.bhg
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        " style="width: 12px; height: 12px" />
          <span>&nbsp;不合格</span>
        </td>
        <td colspan="2" style="border-left: none"></td>
        <td style="border-right: none">检测员：</td>
        <td style="border-left: none">
          <span>
            {{
            newprints.CheckPerson
            }}
          </span>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    OBDInfo: {
      type: Object,
      default: () => { return {} }
    },
    InsDataInfo: {
      type: Object,
      default: () => { return {} }
    }
  },
  data() {
    return {
      QY_CY: false,
      newprints: {},
      iutype: '',
    }
  },
  watch: {
    OBDInfo: {
      handler(newval) {
        this.newprints = JSON.parse(JSON.stringify(newval));
        this.FaultIndicator(this.newprints.FaultIndicator);
        this.IsCommunicated(
          this.newprints.IsCommunicated,
          this.newprints.CommFailReason
        ); //
        this.IsHaveFaultCode(
          this.newprints.IsHaveFaultCode,
          this.newprints.FaultInfo
        );
        this.ProjectSelected(
          this.newprints.UnDoneReadyStatus,
          this.newprints.UnFinifishedItem
        ); 
        this.OBDResults(this.newprints.OBDInspectResult);
      },
      immediate: true,


    },
    InsDataInfo: {
     handler(news, oldVal) {
        this.iutype = news.IUTYPE;
        if (this.iutype) {
          if (this.iutype.indexOf('A') > -1 || this.iutype.indexOf('B') > -1 || this.iutype.indexOf('C') > -1) {
            this.QY_CY = true;
          } else if (this.iutype.indexOf('G') > -1 || this.iutype.indexOf('F') > -1 || this.iutype.indexOf('J') > -1) {
            this.QY_CY = false;
          }
        }
      },
      immediate: true,
    }
  },
  methods: {
    //通讯是否成功，0表示不成功，1表示成功 通讯不成功原因：01表示接口损坏，02 表示找不到接口，03 连接后不能通讯
    IsCommunicated(value, item) {
      if (value == 0) {
        this.newprints.txsb = true;
        if (item) {
          item = item.split(",");
          if (item.length > 0 && item != "") {
            for (var i = 0; i < item.length; i++) {
              if (item[i] == "01") {
                this.newprints.jksh = true;
              }
              if (item[i] == "02") {
                this.newprints.zbdjk = true;
              }
              if (item[i] == "03") {
                this.newprints.ljhbntx = true;
              }
            }
          }
        }
        return;
      } else if (value == 1) {
        this.newprints.txcg = true;
        return;
      }
    },
    //OBD故障指示器是否合格（0 不合格，1 合格）
    FaultIndicator(value) {
      if (value == 1) {
        this.newprints.gzhg = true;
      } else if (value == 0) {
        this.newprints.gzbhg = true;
      }
    },
    //是否有OBD系统故障指示器报警及故障码,0 表示无，1 表示有
    //故障代码及故障信息（若故障码指示器报警），故障信息按附件上报、

    IsHaveFaultCode(FaultCode, Fault) {
      if (FaultCode == 0) {
        this.newprints.wgz = true;
        this.newprints.obdgzxx = "没有故障信息";
      } else if (FaultCode == 1) {
        this.newprints.ygz = true;
        this.newprints.obdgzxx = Fault;
      }
    },

    //就绪状态未完成项目，0 无，1 有
    //就绪未完成项目，01 SCR,02 POC,03 DOC,04 DPF, 05废气再循环EGR,  06催化器 ,07氧传感器 ,08氧传感器加热器 ,09可变气门VVT
    //OBD就绪未完成项目字典表
    ProjectSelected(UD, UItem) {
      if (UD == 1 && UItem) {
        UItem = UItem.split("|");
        this.newprints.jxy = true;
        if (UItem.length > 0) {
          for (var i = 0; i < UItem.length; i++) {
            if (UItem[i] == "01") {
              this.newprints.scr = true;
            }
            if (UItem[i] == "02") {
              this.newprints.poc = true;
            }

            if (UItem[i] == "03") {
              this.newprints.doc = true;
            }

            if (UItem[i] == "04") {
              this.newprints.dpf = true;
            }

            if (UItem[i] == "05" || UItem[i] == "09") {
              this.newprints.egr = true;
            }
            if (UItem[i] == "06") {
              this.newprints.chq = true;
            }

            if (UItem[i] == "07") {
              this.newprints.ycgq = true;
            }

            if (UItem[i] == "08") {
              this.newprints.ycgqjr = true;
            }

            // if (UItem[i] == "09") {
            //   this.newprints.dpf = true;
            // }
          }
        } else {
          this.newprints.jxw = true;
        }
        return;
      }

      if (UD == 1 && !UItem) {
        this.newprints.jxy = true;
      }

      if (UD == 0 && !UItem) {
        this.newprints.jxw = true;
        return;
      }
    },

    OBDResults(Result) {
      if (Result == 1) {
        this.newprints.hg = true;
      }
      if (Result == 0) {
        this.newprints.bhg = true;
      }
    },
  },
  mounted() { }
}
</script>

<style lang="less" scoped>
</style>