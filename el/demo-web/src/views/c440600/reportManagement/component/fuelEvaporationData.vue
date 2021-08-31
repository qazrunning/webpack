<template>
  <div>
    <Tabs>
      <TabPane label="检测报告" icon="ios-chatboxes-outline" name="InspectionReport">
        <div ref="fjkwosf">
          <div style=" width: 520pt; margin: 0 auto;text-align: center;">
            <div style="
                                    margin: auto auto;
                                    font-size: 18pt;
                                    font-family: 黑体;
                                    display: inline-block;
                                    clear: both;
                                    text-align: center;
                                    font-weight: bold;
                                ">
              <p style="
                                        width: 100%;
                                        text-align: center;
                                        margin: 0 auto;
                                    ">
                <!-- <span style="text-align: center;" id="reportTitle">机动车排气污染物检测报告单</span> -->
                <span style="text-align: center" id="reportTitle">燃油蒸发排放控制系统检验报告</span>
                <span id="testuse" style="
                                            font-size: 18pt;
                                            font-family: 黑体;
                                            border: 1pt solid rgb(17, 17, 17);
                                            color: red;
                                            display: none;
                                        "></span>
              </p>
            </div>
          </div>
          <div style="display: flex;justify-content:space-around;flex-wrap:nowrap;padding: 27px 19px 10px 19px;font-size: 15px;font-weight: bold;">
            <div class="report-info">
              <span style="width: 6%; padding: 2px 0 1px 2px">检测机构名称:</span>
              <span style="
                                        width: 60%;
                                        text-align: left;
                                        margin: 2px 2px 0px 0px;
                                        padding: 2px 2px 1px 0;
                                    ">{{returncodenames(cddata.StationInfo,FuelEvaporationData.StationCode)}}</span>
            </div>
            <div style="margin: 0px 60px;">
              <span style="
                                        width: 8%;
                                        text-align: left;
                                        padding: 2px 0 1px 2px;
                                    ">检测时间:</span>
              <span style="
                                        width: 10%;
                                        text-align: left;
                                        margin: 2px 2px 0px 0px;
                                        padding: 2px 2px 1px 0;
                                    ">
                {{
                FuelEvaporationData.EndTime
                | dataFormat("yyyyMMdd")
                }}
              </span>
            </div>
            <div class="report-info">
              <span style="width: 6%; padding: 2px 0 1px 2px">报告编号:</span>
              <span style="
                                        width: 60%;
                                        text-align: left;
                                        margin: 2px 2px 0px 0px;
                                        padding: 2px 2px 1px 0;
                                    ">{{FuelEvaporationData.InspectionReportNo}}</span>
            </div>
          </div>
          <table class="fld-container" style="width: 620.5pt; margin: auto auto; border-collapse: collapse !important;">
            <thead>
              <tr>
                <td rowspan="4" colspan="1" style="width: 25pt; margin: 0 auto; line-height: 50px;text-align: center;">基本信息</td>
                <td colspan="2" style="text-align: center;">车牌号码</td>
                <td colspan="3" style="text-align: center;">{{VehicleInfo.VLPN}}</td>
                <td colspan="2" style="text-align: center;">车辆品牌</td>
                <td colspan="3" style="text-align: center;">{{VehicleInfo.FactoryPlateModel}}</td>
              </tr>

              <tr>
                <td colspan="2">车辆识别代号（VIN）</td>
                <td colspan="3" style="text-align: center;">{{VehicleInfo.VIN}}</td>
                <td colspan="2" style="text-align: center;"></td>
                <td colspan="3" style="text-align: center;"></td>
              </tr>
              <tr>
                <td colspan="2" style="text-align: center;">行驶里程</td>
                <td colspan="3" style="text-align: center;">{{VehicleInfo.Mileage}}</td>
                <td colspan="2" style="text-align: center;">车辆型号</td>
                <td colspan="3" style="text-align: center;">{{VehicleInfo.IUVTYPE}}</td>
              </tr>
              <tr>
                <td colspan="2" style="text-align: center;">初次登记日期</td>
                <td colspan="3" style="text-align: center;">{{VehicleInfo.VRDATE}}</td>
                <td colspan="2" style="text-align: center;">车辆类型</td>
                <td colspan="3" style="text-align: center;">{{returncodenames(cddata.CD_VehicleType,VehicleInfo.VehicleType)}}</td>
              </tr>
              <tr>
                <td colspan="11" style="text-align: center;line-height: 25px;">
                  <div style="display: flex;margin: 5px;justify-content: space-between;">
                    <div>
                      <span>环境参数：</span>
                      <span>{{FuelEvaporationData.hjcs}}</span>
                    </div>
                    <div>
                      <span>温度（℃）：</span>
                      <span>{{FuelEvaporationData.Temperature}}</span>
                    </div>
                    <div>
                      <span>大气压（kPa）：</span>
                      <span>{{FuelEvaporationData.Pressure}}</span>
                    </div>
                    <div>
                      <span>相对湿度（%）：</span>
                      <span>{{FuelEvaporationData.Humidity}}</span>
                    </div>
                  </div>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td rowspan="4" colspan="1" style="width: 25pt; margin: 0 auto; line-height: 50px;text-align: center;">外观检验</td>
                <td colspan="2" style="text-align: center;">管路连接状况</td>
                <td colspan="7" style="text-align: center;"></td>
                <td rowspan="4" colspan="1" style="text-align: center; width: 55pt;font-weight:bold; font-family: 黑体;">外观判定：{{returncodenames(vdct,FuelEvaporationData.ARESULT)}}</td>
              </tr>
              <tr>
                <td colspan="2" style="text-align: center;">管路连接有效性</td>
                <td colspan="7" style="text-align: center;"></td>
              </tr>
              <tr>
                <td colspan="2" style="text-align: center;">活性炭罐状况</td>
                <td colspan="7" style="text-align: center;"></td>
              </tr>
              <tr>
                <td colspan="2" style="text-align: center;">油箱盖状况</td>
                <td colspan="7" style="text-align: center;"></td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td rowspan="3" colspan="1" style="width: 25pt; margin: 0 auto; line-height: 50px;text-align: center;">测试结果判定</td>
                <td colspan="2" style="text-align: left;padding-left:5px;">油箱盖测试</td>
                <td colspan="3" style="text-align: left;padding-left:5px; ">实测压力损失(Pa)：{{FuelEvaporationData.PressureLoss}}</td>
                <td colspan="2" style="text-align: left;padding-left:5px;">限值(Pa) 1500</td>
                <td colspan="2" style="text-align: left;padding-left:5px;">判定：{{returncodenames(vdct,FuelEvaporationData.FueltankCoverTestResult)}}</td>
                <td rowspan="3" colspan="1" style="text-align: center; width: 55pt;font-weight:bold; font-family: 黑体;">测试判定：{{returncodenames(vdct,FuelEvaporationData.FuelEvaporationResult)}}</td>
              </tr>
              <tr>
                <td colspan="2" style="text-align: left;padding-left:5px;">加油口稳定性测试</td>
                <td colspan="3" style="text-align: left;padding-left:5px;">实测压力损失(Pa)：{{FuelEvaporationData.StabilityPressureLoss}}</td>
                <td colspan="2" style="text-align: left;padding-left:5px;">限值(Pa) 1250</td>
                <td colspan="2" style="text-align: left;padding-left:5px;">判定：{{returncodenames(vdct,FuelEvaporationData.OilFillerTestResult)}}</td>
              </tr>
              <tr>
                <td colspan="2" style="text-align: left;padding-left:5px;">加油口压力测试</td>
                <td colspan="3" style="text-align: left;padding-left:5px;">实测压力损失(Pa)：{{FuelEvaporationData.OilFillerTestFiller}}</td>
                <td colspan="2" style="text-align: left;padding-left:5px;">限值(Pa) 1500</td>
                <td colspan="2" style="text-align: left;padding-left:5px;">判定：{{returncodenames(vdct,FuelEvaporationData.OilFillerTestFastPass)}}</td>
              </tr>
              <tr>
                <td colspan="8" style="text-align: left;line-height: 35px;font-weight:bold;font-family: 黑体;padding-left:5px;">燃油蒸发排放控制系统检验判定：{{returncodenames(vdct,FuelEvaporationData.FERESULT)}}</td>
                <td colspan="3" style="text-align: left;line-height: 35px;">（单位盖章）</td>
              </tr>
            </tfoot>
          </table>
          <div style="display: flex;justify-content: space-between;margin: 2px auto;width: 77%;">
            <div>
              <span>外观检验员：</span>
              <span>{{FuelEvaporationData.CheckPerson ?FuelEvaporationData.CheckPerson:'' }}</span>
            </div>
            <div>
              <span>检测操作员：</span>
              <span>{{FuelEvaporationData.Checker}}</span>
            </div>
            <div>
              <span>报告批准员：</span>
              <span></span>
            </div>
          </div>
        </div>
        <div style="margin-top:17px;">
          <Button size="large" long @click="print_stat">打印报告</Button>
        </div>
      </TabPane>
      <TabPane label="加油口过程数据" icon="ios-stats" name="OilFillerProcess">
        <div>
          <Table stripe :columns="OilFillerTable" :data="OilFillerProcessData" :loading="loading"></Table>
        </div>
      </TabPane>
      <TabPane label="油箱盖过程数据" icon="ios-stats" name="TankCoverProcess">
        <div>
          <Table stripe :columns="TankCovertable" :data="TankCoverProcessData" :loading="loading"></Table>
        </div>
      </TabPane>
    </Tabs>
    <!-- 燃油蒸发报告 -->
  </div>
</template>

<script>
import {
  getLodop
} from "../../../utils/utils";
export default {
  props: {
    FuelEvaporationData: {
      type: Object,
      default: () => { }
    },
    VehicleInfo: {
      type: Object,
      default: () => { }
    },
    cddata: {
      type: Object
    }
  },
  data() {
    return {
      loading: false,
      vdct: [{ CodeName: '合格', CodeValue: 1 }, { CodeName: '不合格', CodeValue: 0 }, { CodeName: '免检', CodeValue: 2 }],
      TankCoverProcessData: [],
      OilFillerProcessData: [],
      TankCovertable: [
        {
          title: '秒数流水号',
          key: 'Second_NO',
          align: 'center'
        },
        {
          title: '工况类型',
          key: 'GKLX',
          align: 'center',
        },
        {
          title: '测试压力值(Pa)',
          key: 'Pressure'
          , align: 'center',
      
        },
        {
          title: '压力损失(Pa)',
          key: 'PressureLoss'
          , align: 'center',
      
        },
        {
          title: '油箱盖测试项',
          key: 'FueltankCoverItem'
          , align: 'center',
      
        },
        {
          title: '泄露速率(ml/min)',
          key: 'LeakageRate',
          align: 'center',
      
        },
        {
          title: '检测时间',
          key: 'ProcessTime',
          align: 'center',
        },
      ],
      OilFillerTable: [
        {
          title: '秒数流水号',
          key: 'Second_NO'

          , align: 'center',
        },
        {
          title: '工况类型',
          key: 'GKLX',
          align: 'center',
        },
        {
          title: '测试压力值(Pa)',
          key: 'Pressure',
          align: 'center',
      
        },
        {
          title: '压力损失(Pa)',
          key: 'PressureLoss',
          align: 'center',
      
        },
        {
          title: '加油口检测是否使用夹子',
          key: 'UseTongs',
          align: 'center'
        },
        {
          title: '检测时间',
          key: 'ProcessTime',
          align: 'center'
        },
      ],
      trBodyStyle: `
      <style >
table {
  width:550pt !important;
  border-collapse: collapse;
  margin: 0 auto;
  text-align: center;
}

table td,
table th {
  border: 1px solid #000;
  height: 24px;
  font-size: 13px;
}
table td {
  padding: 0px;
}

table thead th {
  background-color: #e8eaec;
  width: 100px;
}
</style>
      `
    }
  },
  methods: {
    //打印
    print_stat() {
      let LODOP = getLodop();
      if (!LODOP) {
        this.$Modal.warning({
          // title: title,
          content: ` 
                            Web打印服务CLodop未安装启动，点击这里<a href='http://www.c-lodop.com/download.html' target='_black'>下载执行安装</a>
                            若此前已安装过，可<a href='CLodop.protocol:setup' target='_self'>点这里直接再次启动</a>
                            成功后请刷新本页面
                            `,
        });

        return;
      }
      if (LODOP.CVERSION < "3.0.0.0") {
        this.$Modal.warning({
          // title: title,
          content: ` 
                            Web打印服务CLodop需升级!点击这里<a href='http://www.c-lodop.com/download.html' target='_black'>执行升级</a>,升级后请刷新页面。
                            `,
        });
        return;
      }
      let self = this;
      let params = {
        useName: self.$store.state.core.user.username,
        InspectionDataID: self.FuelEvaporationData.InspectionDataID,
      };
      LODOP.PRINT_INIT("打印控件功能演示_Lodop功能_设置预览窗口界面");
      LODOP.SET_PRINT_PAGESIZE(1, "210mm", "297mm", "");
      LODOP.ADD_PRINT_HTM(
        20,
        0,
        "207mm",
        "297mm",
        "<!DOCTYPE html>" +
        this.trBodyStyle +
        "<body>" +
        this.$refs.fjkwosf.innerHTML +
        "</body>"
      );
      LODOP.ADD_PRINT_TEXT("280mm", "80mm", 100, 20, "第1页/共1页");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 30);
      LODOP.SET_PRINT_MODE("PRINT_DUPLEX", 1); //设置打印模式
      LODOP.PREVIEW();
      this.$curl
        .post("api/hj/AddChangeLog", {
          params: params,
        })
        .then((res) => { });
    },
    // 过程数据
    getProcessData(InspectionNum, StartTime) {
      this.loading = true;
      const params = {
        InspectionNum,
        StartTime
      }
      this.$curl.get('api/hj/getFuelProcessData', params).then(res => {
        if (res.code == 1) {
          this.TankCoverProcessData = res.TankCoverProcessData;
          this.OilFillerProcessData = res.OilFillerProcessData;
        }
      });
      this.loading = false;
    },
    // 过滤数据
    returncodenames(namelist, codevalue) {
      let CodeName = ''
      if(!namelist||!codevalue) return;
      namelist.forEach(item => {
        if (item.CodeValue == codevalue) CodeName = item.CodeName
      })
      return CodeName
    },
  },
  watch: {
    FuelEvaporationData(newval, oldval) {
      if (!newval) return;
      const { InspectionNum, StartTime } = newval;
      this.getProcessData(InspectionNum, StartTime);
    }
  },
  mounted() {
  }
}
</script>

<style lang="less" scoped>
table {
  border-collapse: collapse;
  margin: 0 auto;
  text-align: center;
}

table td,
table th {
  border: 1px solid #000;
  height: 24px;
  font-size: 13px;
}
table td {
  padding: 0px;
}

table thead th {
  background-color: #e8eaec;
  width: 100px;
}
</style>