<template>
  <div>
    <div style="height: 100%">
      <div style="text-align: center">
        <div
          ref="skyfew"
          class="skyfew"
          style="
                        overflow: hidden auto;
                        height: 100%;
                        width: 900px;
                        margin: 0 auto;
                    "
        >
          <div id="fjkwosf" ref="fjkwosf">
            <div
              style="
                                width: 520pt;
                                margin: 0 auto;
                                text-align: center;
                                position: relative;
                            "
            >
              <div
                style="
                                    margin: auto auto;
                                    font-size: 18pt;
                                    font-family: 黑体;
                                    display: inline-block;
                                    clear: both;
                                    text-align: center;
                                "
              >
                <p
                  style="
                                        width: 100%;
                                        text-align: center;
                                        margin: 0 auto;
                                    "
                >
                  <!-- <span style="text-align: center;" id="reportTitle">机动车排气污染物检测报告单</span> -->
                  <span style="text-align: center" id="reportTitle">{{ reportTitle }}</span>
                  <span
                    id="testuse"
                    style="
                                            font-size: 18pt;
                                            font-family: 黑体;
                                            border: 1pt solid rgb(17, 17, 17);
                                            color: red;
                                            display: none;
                                        "
                  ></span>
                </p>
              </div>
              <div
                v-if="newprints.InsDataInfo.InspectionKind == '99'"
                style="position: absolute;top: 4px;right: -15px;font-size: 18pt;font-family: 黑体;border: 2pt solid red; color: red;text-align: center;"
              >测试专用</div>
            </div>
            <div style="width: 510pt; margin: 8px auto" data-bind="with: inspectionEnt">
              <div class="report-info" style="width: 40%">
                <span style="width: 6%; padding: 2px 0 1px 2px">检测报告编号:</span>
                <span
                  class="mySpan-fld"
                  style="
                                        width: 60%;
                                        text-align: left;
                                        margin: 2px 2px 0px 0px;
                                        padding: 2px 2px 1px 0;
                                    "
                >
                  {{
                  newprints.InsDataInfo.InspectionReportNo
                  }}
                </span>
              </div>
              <div class="report-info" style="width: 30%">
                <span
                  style="
                                        width: 8%;
                                        text-align: left;
                                        padding: 2px 0 1px 2px;
                                    "
                >
                  检测日期
                  <sup>1)</sup>：
                </span>
                <span
                  style="
                                        width: 10%;
                                        text-align: left;
                                        margin: 2px 2px 0px 0px;
                                        padding: 2px 2px 1px 0;
                                    "
                >
                  {{
                  newprints.InsDataInfo.DetectEndTime
                  | dataFormat("yyyyMMdd")
                  }}
                </span>
              </div>
              <div class="report-info" style="width: 30%">
                <span
                  style="
                                        width: 10%;
                                        text-align: left;
                                        padding: 2px 0 1px 2px;
                                    "
                >
                  计量认证号
                  <sup>2)</sup>：
                </span>
                <span
                  style="
                                        width: 10%;
                                        text-align: left;
                                        margin: 2px 2px 0px 0px;
                                        padding: 2px 2px 1px 0;
                                    "
                >
                  {{
                  newprints.StationInfo &&
                  newprints.StationInfo.CertificateNo
                  }}
                </span>
              </div>
            </div>
            <table
              style="
                                border: 1px solid black;
                                width: 550.5pt;
                                margin: auto auto;
                                border-collapse: collapse !important;
                            "
              class="fld-container"
              data-bind="with: inspectionEnt"
            >
              <tr>
                <td class="myFld-title" colspan="6" style="font-weight: bold">基本信息</td>
              </tr>
              <tr>
                <td class="myFld-title" colspan="6">
                  检验机构名称：
                  <span>
                    {{
                    newprints.InsDataInfo
                    .StationShortName ||
                    returncodenames(
                    StationInfo,
                    newprints.InsDataInfo.StationCode
                    )
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td class="myFld-title" style="width: 94pt">号牌号码</td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.InsDataInfo.VLPN
                    }}
                  </span>
                </td>
                <td class="myFld-title" style="width: 90pt">车辆型号</td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.InsDataInfo.IUVTYPE
                    }}
                  </span>
                </td>
                <td class="myFld-title" style="width: 90pt">基准质量/kg</td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.InsDataInfo.BenchmarkMass
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td class="myFld-title" style="width: 94pt">车辆识别代码（VIN）</td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.InsDataInfo.VIN
                    }}
                  </span>
                </td>
                <td class="myFld-title" style="width: 90pt">最大设计总质量/kg</td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.InsDataInfo.VML
                    }}
                  </span>
                </td>
                <td class="myFld-title" style="width: 90pt">发动机型号</td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.InsDataInfo.IUETYPE
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td class="myFld-title" style="width: 94pt">发动机号码</td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.InsDataInfo.EngineNum
                    }}
                  </span>
                </td>
                <td class="myFld-title" style="width: 90pt">发动机排量/L</td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.InsDataInfo.EDSPL
                    ? saveNumber(
                    newprints.InsDataInfo.EDSPL,
                    2
                    )
                    : ""
                    }}
                  </span>
                </td>
                <td class="myFld-title" style="width: 90pt">额定转速/（r/min）</td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.InsDataInfo.EngineRatedSpeed
                    }}
                  </span>
                </td>
              </tr>
              <tr v-show="!QY_CY">
                <td class="myFld-title" style="width: 90pt">发动机额定功率/kW</td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.InsDataInfo.EnginePower
                    }}
                  </span>
                </td>
                <td class="myFld-title" style="width: 90pt">DPF</td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.InsDataInfo.DPF == null
                    ? "-"
                    : newprints.InsDataInfoDPF == 1
                    ? "有"
                    : "无"
                    }}
                  </span>
                </td>
                <td class="myFld-title" style="width: 90pt">DPF型号</td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.InsDataInfo.DPFType == null
                    ? "-"
                    : newprints.InsDataInfo.DPFType == 1
                    ? "有"
                    : "无"
                    }}
                  </span>
                </td>
              </tr>
              <tr v-show="!QY_CY">
                <td class="myFld-title" style="width: 90pt">SCR</td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.InsDataInfo.SCR == null
                    ? "-"
                    : newprints.InsDataInfo.SCR == 1
                    ? "有"
                    : "无"
                    }}
                  </span>
                </td>
                <td class="myFld-title" style="width: 90pt">SCR型号</td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.InsDataInfo.SCRType == null
                    ? "-"
                    : newprints.InsDataInfo.SCRType == 1
                    ? "有"
                    : "无"
                    }}
                  </span>
                </td>
                <td class="myFld-title" style="width: 90pt">气缸数</td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.InsDataInfo.CylinderCount
                    }}
                  </span>
                </td>
              </tr>
              <tr v-show="!QY_CY">
                <td class="myFld-title" style="width: 90pt">
                  驱动电机型号
                  <sup>3)</sup>
                </td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.InsDataInfo.MotorType
                    }}
                  </span>
                </td>
                <td class="myFld-title" style="width: 90pt">
                  储能装置型号
                  <sup>3)</sup>
                </td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.InsDataInfo.ESDType
                    }}
                  </span>
                </td>
                <td class="myFld-title" style="width: 90pt">
                  电池容量
                  <sup>3)</sup>
                </td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.InsDataInfo.BatteryCapacity
                    }}
                  </span>
                </td>
              </tr>

              <tr v-show="QY_CY">
                <td class="myFld-title" style="width: 90pt">
                  驱动电机型号
                  <sup>3)</sup>
                </td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.InsDataInfo.MotorType
                    }}
                  </span>
                </td>
                <td class="myFld-title" style="width: 90pt">
                  储能装置型号
                  <sup>3)</sup>
                </td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.InsDataInfo.ESDType
                    }}
                  </span>
                </td>
                <td class="myFld-title" style="width: 90pt">
                  电池容量
                  <sup>3)</sup>
                </td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.InsDataInfo.BatteryCapacity
                    }}
                  </span>
                </td>
              </tr>
              <tr v-show="QY_CY">
                <td class="myFld-title" style="width: 90pt">催化转化器型号</td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.InsDataInfo
                    .CatalyticConvertersAndCorp
                    }}
                  </span>
                </td>
                <td class="myFld-title" style="width: 90pt">气缸数</td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.InsDataInfo.CylinderCount
                    }}
                  </span>
                </td>
                <td class="myFld-title" style="width: 90pt">座位数（人）</td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.InsDataInfo.RatedSeats
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td class="myFld-title" style="width: 90pt">车辆生产企业</td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.InsDataInfo.IUVMANU
                    }}
                  </span>
                </td>
                <td class="myFld-title" style="width: 90pt">车辆出厂日期</td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.InsDataInfo.ProductDate
                    | dataFormat("yyyyMMdd")
                    }}
                  </span>
                </td>
                <td class="myFld-title" style="width: 90pt">累计行驶里程(km)</td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.InsDataInfo.Mileage
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td class="myFld-title" style="width: 90pt">车主姓名（单位）</td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.InsDataInfo.OwnerName
                    }}
                  </span>
                </td>
                <td class="myFld-title" style="width: 90pt">联系电话（手机）</td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.InsDataInfo.Tel
                    }}
                  </span>
                </td>
                <td class="myFld-title" style="width: 90pt">
                  车牌颜色
                  <sup>4)</sup>
                </td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    returncodenames(
                    this.CD_VLPNColor,
                    newprints.InsDataInfo.VLPNColor
                    )
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td class="myFld-title" style="width: 90pt">燃料类型</td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    returnMultiple(
                    this.CD_FuelType,
                    newprints.InsDataInfo.FuelType
                    )
                    }}
                  </span>
                </td>
                <td class="myFld-title" style="width: 90pt">燃油型式</td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.InsDataInfo
                    .FuelSpecification == "" ||
                    newprints.InsDataInfo
                    .FuelSpecification == null
                    ? "-"
                    : newprints.InsDataInfo
                    .FuelSpecification
                    }}
                  </span>
                </td>
                <td class="myFld-title" style="width: 90pt">驱动方式</td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.InsDataInfo.DriveForm
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td class="myFld-title" style="width: 90pt">品牌/型号</td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.InsDataInfo.FactoryPlateModel
                    }}
                  </span>
                </td>
                <td class="myFld-title" style="width: 90pt">变速器型式</td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.InsDataInfo.VariableForm
                    }}
                  </span>
                </td>
                <td class="myFld-title" style="width: 90pt">使用性质</td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    returncodenames(
                    this.CD_UseOfAuto,
                    newprints.InsDataInfo.UseOfAuto
                    )
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td class="myFld-title" style="width: 90pt">初次登记日期</td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.InsDataInfo.VRDATE
                    | dataFormat("yyyyMMdd")
                    }}
                  </span>
                </td>
                <td class="myFld-title" style="width: 90pt">检测方法</td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    returnMethodnames(
                    this.CD_InspectionMethod,
                    newprints.InsDataInfo.IUTYPE
                    )
                    }}
                  </span>
                </td>
                <td class="myFld-title" style="width: 90pt">OBD</td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.InsDataInfo.HasOBD == null
                    ? ""
                    : newprints.InsDataInfo.HasOBD == 1
                    ? "有"
                    : "无"
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td class="myFld-title" colspan="6" style="font-weight: bold">环境参数</td>
              </tr>
              <tr>
                <td class="myFld-title" style="width: 90pt">环境温度/°C</td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.InsDataInfo.Temperature
                    ? saveNumber(
                    newprints.InsDataInfo
                    .Temperature,
                    2
                    )
                    : ""
                    }}
                  </span>
                </td>
                <td class="myFld-title" style="width: 90pt">大气压/kPa</td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.InsDataInfo.Pressure
                    ? saveNumber(
                    newprints.InsDataInfo
                    .Pressure,
                    2
                    )
                    : ""
                    }}
                  </span>
                </td>
                <td class="myFld-title" style="width: 90pt">相对湿度/%</td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.InsDataInfo.Humidity
                    ? saveNumber(
                    newprints.InsDataInfo
                    .Humidity,
                    2
                    )
                    : ""
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td class="myFld-title" colspan="6" style="font-weight: bold">检测设备信息</td>
              </tr>
              <tr>
                <td class="myFld-title" style="width: 90pt">分析仪生产企业</td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.jcsb.AnalyzerProduction
                    }}
                  </span>
                </td>
                <td class="myFld-title" style="width: 90pt">分析仪名称</td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.jcsb.AnalyzerName
                    }}
                  </span>
                </td>
                <td class="myFld-title" style="width: 90pt">分析仪检定日期</td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.jcsb.AnalyzerDate
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td class="myFld-title" style="width: 90pt">底盘测功机生产企业</td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.jcsb.ChassisProduction
                    }}
                  </span>
                </td>
                <td class="myFld-title" style="width: 90pt">底盘测功机型号</td>
                <td class="tdText" colspan="3">
                  <span class="mySpan-fld">
                    {{
                    newprints.jcsb.ChassisType
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td class="myFld-title" style="width: 90pt">OBD诊断仪生产企业</td>
                <td class="tdText">
                  <span class="mySpan-fld">
                    {{
                    newprints.OBDInfo.DeviceMANU
                    }}
                  </span>
                </td>
                <td class="myFld-title" style="width: 90pt">OBD诊断仪型号</td>
                <td class="tdText" colspan="3">
                  <span class="mySpan-fld">
                    {{
                    newprints.OBDInfo.DeviceType
                    }}
                  </span>
                </td>
              </tr>
            </table>
            <!-- 柴油外观检 -->
            <table
              v-if="!QY_CY"
              style="
                                width: 550.5pt;
                                margin: auto auto;
                                border-collapse: collapse !important;
                            "
              class="fld-container"
              data-bind="with: appearanceinfo"
            >
              <tr>
                <td colspan="6" style="border-top: none" class="myFld-title">
                  <span style="font-weight: bold">外观检验</span>
                </td>
              </tr>
              <tr>
                <td colspan="2" style="text-align: center; width: 90px" class="myFld-title">检查项目</td>
                <td style="text-align: center" class="myFld-title">是</td>
                <td style="text-align: center" class="myFld-title">否</td>
                <td style="text-align: center" colspan="2" class="myFld-title">备注</td>
              </tr>
              <tr>
                <td colspan="2" class="myFld-title">车辆机械状况是否良好</td>
                <td style="text-align: center" class="myFld-title">{{ newprints.wgj.IsCondition1 }}</td>
                <td style="text-align: center" class="myFld-title">{{ newprints.wgj.IsCondition2 }}</td>
                <td style="text-align: center" colspan="2" class="myFld-title">
                  <span class="mySpan-fld myFld-title">
                    {{
                    newprints.Remark1
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td colspan="2">排气污染控制装置是否齐全，正常</td>
                <td style="text-align: center">{{ newprints.wgj.IsControl1 }}</td>
                <td style="text-align: center">{{ newprints.wgj.IsControl2 }}</td>

                <td style="text-align: center" colspan="2">
                  <span />否决项目
                </td>
              </tr>
              <tr>
                <td colspan="2">发动机燃油系统采用电控泵</td>
                <td style="text-align: center">{{ newprints.wgj.IsEnginefuel1 }}</td>
                <td style="text-align: center">{{ newprints.wgj.IsEnginefuel2 }}</td>
                <td colspan="2">
                  <span class="mySpan-fld">
                    {{
                    newprints.Remark17
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td colspan="2">车上仪表工作是否正常</td>
                <td style="text-align: center">{{ newprints.wgj.IsMeter1 }}</td>
                <td style="text-align: center">{{ newprints.wgj.IsMeter2 }}</td>
                <td colspan="2">
                  <span class="mySpan-fld">
                    {{
                    newprints.Remark6
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td colspan="2">车辆是否存在明显烧机油或者严重冒黑烟现象</td>
                <td style="text-align: center">{{ newprints.wgj.IsBurningOilAndSmoke1 }}</td>
                <td style="text-align: center">{{ newprints.wgj.IsBurningOilAndSmoke2 }}</td>

                <td style="text-align: center" colspan="2">
                  <span />否决项目
                </td>
              </tr>
              <tr>
                <td colspan="2">有无可能影响安全或引起测试偏差的机械故障</td>
                <td style="text-align: center">{{ newprints.wgj.IsMechanical1 }}</td>
                <td style="text-align: center">{{ newprints.wgj.IsMechanical2 }}</td>
                <td colspan="2">
                  <span class="mySpan-fld">
                    {{
                    newprints.Remark7
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td colspan="2">车辆进、排气系统是否有任何泄漏</td>
                <td style="text-align: center">{{ newprints.wgj.IsMechanicalFault1 }}</td>
                <td style="text-align: center">{{ newprints.wgj.IsMechanicalFault2 }}</td>
                <td colspan="2">
                  <span class="mySpan-fld">
                    {{
                    newprints.Remark8
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td colspan="2">车辆的发动机、变速箱和冷却系统等有无明显的液体渗漏</td>
                <td style="text-align: center">{{ newprints.wgj.IsLiquidLeakage1 }}</td>
                <td style="text-align: center">{{ newprints.wgj.IsLiquidLeakage2 }}</td>
                <td colspan="2">
                  <span class="mySpan-fld">
                    {{
                    newprints.Remark9
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td colspan="2">是否带OBD系统</td>
                <td style="text-align: center">{{ newprints.wgj.IsIsHaveOBD1 }}</td>
                <td style="text-align: center">{{ newprints.wgj.IsIsHaveOBD2 }}</td>
                <td colspan="2">
                  <span class="mySpan-fld">
                    {{
                    newprints.Remark10
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td colspan="2">轮胎气压是否正常</td>
                <td style="text-align: center">{{ newprints.wgj.IsTirePressure1 }}</td>
                <td style="text-align: center">{{ newprints.wgj.IsTirePressure2 }}</td>
                <td colspan="2">
                  <span class="mySpan-fld">
                    {{
                    newprints.Remark11
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td colspan="2">轮胎是否干燥、清洁</td>
                <td style="text-align: center">{{ newprints.wgj.IsIsTireClear1 }}</td>
                <td style="text-align: center">{{ newprints.wgj.IsIsTireClear2 }}</td>
                <td colspan="2">
                  <span class="mySpan-fld">
                    {{
                    newprints.Remark12
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td colspan="2">是否关闭车上空调、暖风等附属设备</td>
                <td style="text-align: center">{{ newprints.wgj.IsCloseAirAirHeater1 }}</td>
                <td style="text-align: center">{{ newprints.wgj.IsCloseAirAirHeater2 }}</td>
                <td colspan="2">
                  <span class="mySpan-fld">
                    {{
                    newprints.Remark13
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td class="myFld-title" colspan="2">是否已经中断车辆上可能影响测试正常进行的功能,如ARS、ESP、EPC牵引力控制或自动制动系统等</td>
                <td style="text-align: center">
                  {{
                  newprints.wgj
                  .IsInterruptInfluenceFunction1
                  }}
                </td>
                <td style="text-align: center">
                  {{
                  newprints.wgj
                  .IsInterruptInfluenceFunction2
                  }}
                </td>
                <td colspan="2">
                  <span class="mySpan-fld">
                    {{
                    newprints.Remark14
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td colspan="2">车辆油箱和油品是否异常</td>
                <td style="text-align: center">{{ newprints.wgj.IsVehicleFuelTank1 }}</td>
                <td style="text-align: center">{{ newprints.wgj.IsVehicleFuelTank2 }}</td>
                <td colspan="2">
                  <span class="mySpan-fld">
                    {{
                    newprints.Remark15
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td colspan="2">是否适合工况法检测</td>
                <td style="text-align: center">{{ newprints.wgj.IsSuitGKInspect1 }}</td>
                <td style="text-align: center">{{ newprints.wgj.IsSuitGKInspect2 }}</td>
                <td colspan="2">
                  <span class="mySpan-fld">
                    {{
                    newprints.Remark16
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td>外检检测结果</td>
                <td style="border-right: none">
                  <span>
                    <img
                      :src="
                                                newprints.wgj
                                                    .IsAppearanceResult1
                                                    ? '/exhaust/img/ok.png'
                                                    : '/exhaust/img/nook.png'
                                            "
                      style="width: 12px; height: 12px"
                    />&nbsp;合格
                  </span>
                  <span>
                    <img
                      :src="
                                                newprints.wgj
                                                    .IsAppearanceResult2
                                                    ? '/exhaust/img/ok.png'
                                                    : '/exhaust/img/nook.png'
                                            "
                      style="width: 12px; height: 12px"
                    />&nbsp;不合格
                  </span>
                </td>
                <td colspan="2" style="border-right: none">检验员：</td>
                <td colspan="2" style="border-left: none">
                  <span class="mySpan-fld">
                    {{
                    newprints.wgj.CheckPerson
                    }}
                  </span>
                </td>
              </tr>
            </table>
            <!-- 汽油外观检 -->
            <table
              v-else
              style="
                                width: 550.5pt;
                                margin: auto auto;
                                border-collapse: collapse !important;
                            "
              class="fld-container"
              data-bind="with:appearanceinfo"
            >
              <tr>
                <td colspan="6" style="border-top: none">
                  <span style="font-weight: bold">外观检验</span>
                </td>
              </tr>
              <tr>
                <td colspan="2" style="text-align: center; width: 90px">检查项目</td>
                <td style="text-align: center">是</td>
                <td style="text-align: center">否</td>
                <td style="text-align: center" colspan="2">备注</td>
              </tr>
              <tr>
                <td colspan="2">车辆机械状况是否良好</td>
                <td style="text-align: center">{{ newprints.wgj.IsCondition1 }}</td>
                <td style="text-align: center">{{ newprints.wgj.IsCondition2 }}</td>
                <td colspan="2">
                  <span class="mySpan-fld">
                    {{
                    newprints.Remark1
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td colspan="2">排气污染控制装置是否齐全，正常</td>
                <td style="text-align: center">{{ newprints.wgj.IsControl1 }}</td>
                <td style="text-align: center">{{ newprints.wgj.IsControl2 }}</td>
                <td colspan="2">
                  <span class="mySpan-fld" />否决项目
                </td>
              </tr>
              <tr>
                <td colspan="2">车辆是否存在严重烧机油或者严重冒黑烟现象</td>
                <td style="text-align: center">{{ newprints.wgj.IsBurningOilAndSmoke1 }}</td>
                <td style="text-align: center">{{ newprints.wgj.IsBurningOilAndSmoke2 }}</td>
                <td colspan="2">
                  <span class="mySpan-fld" />否决项目
                </td>
              </tr>
              <tr>
                <td colspan="2">曲轴箱通风系统是否正常</td>
                <td style="text-align: center">{{ newprints.wgj.IsCrankcaseVentSystem1 }}</td>
                <td style="text-align: center">{{ newprints.wgj.IsCrankcaseVentSystem2 }}</td>
                <td colspan="2">
                  <span class="mySpan-fld">
                    {{
                    newprints.Remark4
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td colspan="2">燃油蒸发控制系统是否正常</td>
                <td style="text-align: center">{{ newprints.wgj.IsEVAP1 }}</td>
                <td style="text-align: center">{{ newprints.wgj.IsEVAP2 }}</td>
                <td colspan="2">
                  <span class="mySpan-fld" />否决项目
                </td>
              </tr>
              <tr>
                <td colspan="2">车上仪表工作是否正常</td>
                <td style="text-align: center">{{ newprints.wgj.IsMeter1 }}</td>
                <td style="text-align: center">{{ newprints.wgj.IsMeter2 }}</td>
                <td colspan="2">
                  <span class="mySpan-fld">
                    {{
                    newprints.Remark6
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td colspan="2">有无可能影响安全或引起测试偏差的机械故障</td>
                <td style="text-align: center">{{ newprints.wgj.IsMechanical1 }}</td>
                <td style="text-align: center">{{ newprints.wgj.IsMechanical2 }}</td>
                <td colspan="2">
                  <span class="mySpan-fld">
                    {{
                    newprints.Remark7
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td colspan="2">车辆进、排气系统是否有任何泄漏</td>
                <td style="text-align: center">{{ newprints.wgj.IsMechanicalFault1 }}</td>
                <td style="text-align: center">{{ newprints.wgj.IsMechanicalFault2 }}</td>
                <td colspan="2">
                  <span class="mySpan-fld">
                    {{
                    newprints.Remark8
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td colspan="2">车辆的发动机、变速箱和冷却系统等有无明显的液体渗漏</td>
                <td style="text-align: center">{{ newprints.wgj.IsLiquidLeakage1 }}</td>
                <td style="text-align: center">{{ newprints.wgj.IsLiquidLeakage2 }}</td>
                <td colspan="2">
                  <span class="mySpan-fld">
                    {{
                    newprints.Remark9
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td colspan="2">是否带OBD系统</td>
                <td style="text-align: center">{{ newprints.wgj.IsIsHaveOBD1 }}</td>
                <td style="text-align: center">{{ newprints.wgj.IsIsHaveOBD2 }}</td>
                <td colspan="2">
                  <span class="mySpan-fld">
                    {{
                    newprints.Remark10
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td colspan="2">轮胎气压是否正常</td>
                <td style="text-align: center">{{ newprints.wgj.IsTirePressure1 }}</td>
                <td style="text-align: center">{{ newprints.wgj.IsTirePressure2 }}</td>
                <td colspan="2">
                  <span class="mySpan-fld">
                    {{
                    newprints.Remark11
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td colspan="2">轮胎是否干燥、清洁</td>
                <td style="text-align: center">{{ newprints.wgj.IsIsTireClear1 }}</td>
                <td style="text-align: center">{{ newprints.wgj.IsIsTireClear2 }}</td>
                <td colspan="2">
                  <span class="mySpan-fld">
                    {{
                    newprints.Remark12
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td colspan="2">是否关闭车上空调、暖风等附属设备</td>
                <td style="text-align: center">{{ newprints.wgj.IsCloseAirAirHeater1 }}</td>
                <td style="text-align: center">{{ newprints.wgj.IsCloseAirAirHeater2 }}</td>
                <td colspan="2">
                  <span class="mySpan-fld">
                    {{
                    newprints.Remark13
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td class="myFld-title" colspan="2">是否已经中断车辆上可能影响测试正常进行的功能,如ARS、ESP、EPC牵引力控制或自动制动系统等</td>
                <td style="text-align: center">
                  {{
                  newprints.wgj
                  .IsInterruptInfluenceFunction1
                  }}
                </td>
                <td style="text-align: center">
                  {{
                  newprints.wgj
                  .IsInterruptInfluenceFunction2
                  }}
                </td>
                <td colspan="2">
                  <span class="mySpan-fld">
                    {{
                    newprints.Remark14
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td colspan="2">车辆油箱和油品是否异常</td>
                <td style="text-align: center">{{ newprints.wgj.IsVehicleFuelTank1 }}</td>
                <td style="text-align: center">{{ newprints.wgj.IsVehicleFuelTank2 }}</td>
                <td colspan="2">
                  <span class="mySpan-fld">
                    {{
                    newprints.Remark15
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td colspan="2">是否适合工况法检测</td>
                <td style="text-align: center">{{ newprints.wgj.IsSuitGKInspect1 }}</td>
                <td style="text-align: center">{{ newprints.wgj.IsSuitGKInspect2 }}</td>
                <td colspan="2">
                  <span class="mySpan-fld">
                    {{
                    newprints.Remark16
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td>外检检测结果</td>
                <td style="border-right: none">
                  <span>
                    <img
                      :src="
                                                newprints.wgj
                                                    .IsAppearanceResult1
                                                    ? '/exhaust/img/ok.png'
                                                    : '/exhaust/img/nook.png'
                                            "
                      style="width: 12px; height: 12px"
                    />&nbsp;合格
                  </span>&nbsp;
                  <span>
                    <img
                      :src="
                                                newprints.wgj
                                                    .IsAppearanceResult2
                                                    ? '/exhaust/img/ok.png'
                                                    : '/exhaust/img/nook.png'
                                            "
                      style="width: 12px; height: 12px"
                    />&nbsp;不合格
                  </span>
                </td>
                <td colspan="2" style="border-right: none">检验员：</td>
                <td colspan="2" style="border-left: none">
                  <span class="mySpan-fld">
                    {{
                    newprints.wgj.CheckPerson
                    }}
                  </span>
                </td>
              </tr>
            </table>
          </div>
          <div id="prints_twe" ref="prints_twe" style="page-break-before: always">
            <table
              class="fld-container"
              style="
                                width: 550.5pt;
                                margin: 5px auto;
                                border-collapse: collapse !important;
                            "
              data-bind="with: inspectionEnt"
            >
              <tr>
                <td style="border: none">车牌号码:</td>
                <td style="border: none; padding-right: 10px">
                  <span>
                    {{
                    newprints.InsDataInfo.VLPN
                    }}
                  </span>
                </td>
                <td style="border: none">车架号:</td>
                <td style="border: none; padding-right: 10px">
                  <span>{{ newprints.InsDataInfo.VIN }}</span>
                </td>
                <td style="border: none">检测报告编号:</td>
                <td style="border: none">
                  <span>
                    {{
                    newprints.InsDataInfo.InspectionReportNo
                    }}
                  </span>
                </td>
              </tr>
            </table>
            <!-- 柴油OBD -->
            <table
              v-if="!QY_CY"
              ref="tableContent_OBD"
              class="fld-container"
              style="
                                width: 550.5pt;
                                margin: auto auto;
                                border-collapse: collapse !important;
                            "
              data-bind="with: obdInfo"
            >
              <tr>
                <td colspan="6">
                  <span style="font-weight: bold">OBD检查</span>
                </td>
              </tr>
              <tr>
                <td rowspan="5">OBD故障指示器</td>
                <td colspan="2" rowspan="3">通讯</td>
                <td style="border-right: none">
                  <img
                    :src="
                                            newprints.txcg
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span>&nbsp;通讯成功</span>
                </td>
                <td colspan="2" style="border-left: none">
                  <img
                    :src="
                                            newprints.txsb
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span>&nbsp;通讯不成功</span>
                </td>
              </tr>
              <tr>
                <td colspan="3" style="border-bottom: none">通讯不成功的（填写以下原因）</td>
              </tr>
              <tr>
                <td style="border-top: none; border-right: none">
                  <img
                    :src="
                                            newprints.jksh
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span>&nbsp;接口损坏</span>
                </td>
                <td
                  style="
                                        border-top: none;
                                        border-right: none;
                                        border-left: none;
                                    "
                >
                  <img
                    :src="
                                            newprints.zbdjk
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span>&nbsp;找不到接口</span>
                </td>
                <td style="border-top: none; border-left: none">
                  <img
                    :src="
                                            newprints.ljhbntx
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span>&nbsp;连接后不能通讯</span>
                </td>
              </tr>
              <tr>
                <td colspan="2">OBD系统故障指示器报警及故障码</td>
                <td style="border-right: none">
                  <img
                    :src="
                                            newprints.ygz
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span>&nbsp;有</span>
                </td>
                <td style="border-left: none" colspan="2">
                  <img
                    :src="
                                            newprints.wgz
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span>&nbsp;无</span>
                </td>
              </tr>
              <tr>
                <td
                  colspan="2"
                  v-show="
                                        newprints.InsDataInfo.InspectionKind !=
                                        '06'
                                    "
                >故障代码及故障信息（若故障指示器报警）</td>
                <td
                  colspan="3"
                  v-show="
                                        newprints.InsDataInfo.InspectionKind !=
                                        '06'
                                    "
                >{{ this.newprints.obdgzxx }}</td>
              </tr>
              <tr
                class="readyStatus"
                v-show="
                                    newprints.InsDataInfo.InspectionKind != '06'
                                "
              >
                <td rowspan="4">就绪状态</td>
                <td colspan="2" rowspan="4">就绪状态未完成项目</td>
                <td style="border-right: none">
                  <img
                    :src="
                                            newprints.jxw
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span>&nbsp;无</span>
                </td>
                <td colspan="2" style="border-left: none">
                  <img
                    :src="
                                            newprints.jxy
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span>&nbsp;有</span>
                </td>
              </tr>
              <tr
                class="readyStatus"
                v-show="
                                    newprints.InsDataInfo.InspectionKind != '06'
                                "
              >
                <td colspan="3">如有就绪未完成的，填写以下项目</td>
              </tr>
              <tr
                class="readyStatus"
                v-show="
                                    newprints.InsDataInfo.InspectionKind != '06'
                                "
              >
                <td style="border-right: none">
                  <img
                    :src="
                                            newprints.scr
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span>&nbsp;SCR</span>
                </td>
                <td
                  style="
                                        border-right: none;
                                        border-left: none;
                                    "
                >
                  <img
                    :src="
                                            newprints.poc
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span>&nbsp;POC</span>
                </td>
                <td style="border-left: none">
                  <img
                    :src="
                                            newprints.doc
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span>&nbsp;DOC</span>
                </td>
              </tr>
              <tr
                class="readyStatus"
                v-show="
                                    newprints.InsDataInfo.InspectionKind != '06'
                                "
              >
                <td
                  style="
                                        border-top: none;
                                        border-right: none;
                                        border-left: none;
                                    "
                >
                  <img
                    :src="
                                            newprints.dpf
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span>&nbsp;DPF</span>
                </td>
                <td
                  style="
                                        border-top: none;
                                        border-right: none;
                                        border-left: none;
                                    "
                >
                  <img
                    :src="
                                            newprints.egr
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span>&nbsp;废气再循环（EGR）</span>
                </td>
                <td style="border-top: none; border-left: none"></td>
              </tr>
              <tr
                id="otherInfo"
                v-show="
                                    newprints.InsDataInfo.InspectionKind != '06'
                                "
              >
                <td>其他信息</td>
                <td colspan="2" style="border-right: none">MIL灯点亮后的行驶里程（km）：</td>
                <td colspan="3" style="border-left: none">
                  <span>{{ newprints.OBDInfo.ODO }}</span>
                </td>
              </tr>
              <tr>
                <td rowspan="3">CALID/CVN信息</td>
                <td>发动机控制单元</td>
                <td>CALID</td>
                <td>
                  <span>
                    {{
                    newprints.OBDInfo.ECU_CALID
                    }}
                  </span>
                </td>
                <td>CVN</td>
                <td>
                  <span>{{ newprints.OBDInfo.ECU_CVN }}</span>
                </td>
              </tr>
              <tr>
                <td>后处理控制单元（如适用）</td>
                <td>CALID</td>
                <td>
                  <span>
                    {{
                    newprints.OBDInfo.ACU_CALID
                    }}
                  </span>
                </td>
                <td>CVN</td>
                <td>
                  <span>{{ newprints.OBDInfo.ACU_CVN }}</span>
                </td>
              </tr>
              <tr>
                <td>其他控制单元（如适用）</td>
                <td>CALID</td>
                <td>
                  <span>
                    {{
                    newprints.OBDInfo.OCU_CALID
                    }}
                  </span>
                </td>
                <td>CVN</td>
                <td>
                  <span>{{ newprints.OBDInfo.OCU_CVN }}</span>
                </td>
              </tr>
              <tr>
                <td style="font-weight: bold">OBD检查结果</td>
                <td style="border-right: none">
                  <img
                    :src="
                                            newprints.hg
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span>&nbsp;合格</span>&nbsp;&nbsp;&nbsp;
                  <img
                    :src="
                                            newprints.bhg
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span>&nbsp;不合格</span>
                </td>
                <td colspan="2" style="border-left: none"></td>
                <td style="border-right: none">检测员：</td>
                <td style="border-left: none">
                  <span>
                    {{
                    newprints.OBDInfo.CheckPerson
                    }}
                  </span>
                </td>
              </tr>
            </table>

            <!-- 汽油OBD -->
            <table
              v-else
              class="fld-container"
              style="
                                width: 550.5pt;
                                margin: auto auto;
                                border-collapse: collapse !important;
                            "
              data-bind="with: obdInfo"
            >
              <tr>
                <td colspan="6">
                  <span style="font-weight: bold">OBD检查</span>
                </td>
              </tr>
              <tr>
                <td rowspan="6">OBD故障指示器</td>
                <td
                  colspan="2"
                  v-show="
                                        newprints.InsDataInfo.InspectionKind !=
                                        '06'
                                    "
                >OBD系统故障指示器</td>
                <td
                  style="border-right: none"
                  v-show="
                                        newprints.InsDataInfo.InspectionKind !=
                                        '06'
                                    "
                >
                  <img
                    :src="
                                            newprints.gzhg
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span>&nbsp;合格</span>
                </td>
                <td
                  colspan="2"
                  style="border-left: none"
                  v-show="
                                        newprints.InsDataInfo.InspectionKind !=
                                        '06'
                                    "
                >
                  <img
                    :src="
                                            newprints.gzbhg
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span>&nbsp;不合格</span>
                </td>
              </tr>
              <tr>
                <td colspan="2" rowspan="3">通讯</td>
                <td style="border-right: none">
                  <img
                    :src="
                                            newprints.txcg
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span>&nbsp;通讯成功</span>
                </td>
                <td colspan="2" style="border-left: none">
                  <img
                    :src="
                                            newprints.txsb
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span>&nbsp;通讯不成功</span>
                </td>
              </tr>
              <tr>
                <td colspan="3" style="border-bottom: none">通讯不成功的（填写以下原因）</td>
              </tr>
              <tr id="item">
                <td style="border-top: none; border-right: none">
                  <img
                    :src="
                                            newprints.jksh
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span>&nbsp;接口损坏</span>
                </td>
                <td
                  style="
                                        border-top: none;
                                        border-right: none;
                                        border-left: none;
                                    "
                >
                  <img
                    :src="
                                            newprints.zbdjk
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span>&nbsp;找不到接口</span>
                </td>
                <td style="border-top: none; border-left: none">
                  <img
                    :src="
                                            newprints.ljhbntx
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span>&nbsp;连接后不能通讯</span>
                </td>
              </tr>
              <tr>
                <td colspan="2">OBD系统故障指示器报警</td>
                <td style="border-right: none">
                  <img
                    :src="
                                            newprints.ygz
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span>&nbsp;有</span>
                </td>
                <td style="border-left: none" colspan="2">
                  <img
                    :src="
                                            newprints.wgz
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span>&nbsp;无</span>
                </td>
              </tr>
              <tr>
                <td
                  colspan="2"
                  v-show="
                                        newprints.InsDataInfo.InspectionKind !=
                                        '06'
                                    "
                >故障代码及故障信息（若故障指示器报警）</td>
                <td
                  colspan="3"
                  v-show="
                                        newprints.InsDataInfo.InspectionKind !=
                                        '06'
                                    "
                >{{ this.newprints.obdgzxx }}</td>
              </tr>
              <tr
                class="readyStatus"
                v-show="
                                    newprints.InsDataInfo.InspectionKind != '06'
                                "
              >
                <td rowspan="4">就绪状态</td>
                <td colspan="2" rowspan="4">就绪状态未完成项目</td>
                <td style="border-right: none">
                  <img
                    :src="
                                            newprints.jxw
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span>&nbsp;无</span>
                </td>
                <td colspan="2" style="border-left: none">
                  <img
                    :src="
                                            newprints.jxy
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span>&nbsp;有</span>
                </td>
              </tr>
              <tr
                class="readyStatus"
                v-show="
                                    newprints.InsDataInfo.InspectionKind != '06'
                                "
              >
                <td colspan="3">如有就绪未完成的，填写以下项目</td>
              </tr>
              <tr
                class="readyStatus"
                v-show="
                                    newprints.InsDataInfo.InspectionKind != '06'
                                "
              >
                <td style="border-right: none">
                  <img
                    :src="
                                            newprints.chq
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span>&nbsp;催化器</span>
                </td>
                <td
                  style="
                                        border-right: none;
                                        border-left: none;
                                    "
                >
                  <img
                    :src="
                                            newprints.ycgq
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span>&nbsp;氧传感器</span>
                </td>
                <td style="border-left: none">
                  <img
                    :src="
                                            newprints.ycgqjr
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span>&nbsp;氧传感器加热器</span>
                </td>
              </tr>
              <tr
                class="readyStatus"
                v-show="
                                    newprints.InsDataInfo.InspectionKind != '06'
                                "
              >
                <td
                  colspan="2"
                  style="
                                        border-right: none;
                                        border-left: none;
                                    "
                >
                  <img
                    :src="
                                            newprints.egr
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span>&nbsp;废气再循环(EGR)/可变气门VVT</span>
                </td>
                <td style="border-left: none"></td>
              </tr>
              <tr
                id="otherInfo"
                v-show="
                                    newprints.InsDataInfo.InspectionKind != '06'
                                "
              >
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
                    newprints.OBDInfo.ECU_CALID
                    }}
                  </span>
                </td>
                <td>CVN</td>
                <td>
                  <span>{{ newprints.OBDInfo.ECU_CVN }}</span>
                </td>
              </tr>
              <tr>
                <td>后处理控制单元（如适用）</td>
                <td>CALID</td>
                <td>
                  <span>
                    {{
                    newprints.OBDInfo.ACU_CALID
                    }}
                  </span>
                </td>
                <td>CVN</td>
                <td>
                  <span>{{ newprints.OBDInfo.ACU_CVN }}</span>
                </td>
              </tr>
              <tr>
                <td>其他控制单元（如适用）</td>
                <td>CALID</td>
                <td>
                  <span>
                    {{
                    newprints.OBDInfo.OCU_CALID
                    }}
                  </span>
                </td>
                <td>CVN</td>
                <td>
                  <span>{{ newprints.OBDInfo.OCU_CVN }}</span>
                </td>
              </tr>
              <tr>
                <td style="font-weight: bold">OBD检查结果</td>
                <td style="border-right: none">
                  <img
                    :src="
                                            newprints.hg
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span>&nbsp;合格</span>&nbsp;&nbsp;&nbsp;
                  <img
                    :src="
                                            newprints.bhg
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span>&nbsp;不合格</span>
                </td>
                <td colspan="2" style="border-left: none"></td>
                <td style="border-right: none">检测员：</td>
                <td style="border-left: none">
                  <span>
                    {{
                    newprints.OBDInfo.CheckPerson
                    }}
                  </span>
                </td>
              </tr>
            </table>
            <!-- 柴油车检测项 -->
            <table
              v-if="!QY_CY"
              ref="tableContent_ASM"
              style="
                                width: 550.5pt;
                                margin: auto auto;
                                border-collapse: collapse !important;
                            "
              class="fld-container"
            >
              <tr>
                <td colspan="16" style="border-top: none">
                  <span style="font-weight: bold">排气污染物检测</span>
                </td>
              </tr>
              <tr>
                <td colspan="4" style="border-top: none">
                  <span style="font-weight: bold">检测方法</span>
                </td>
                <td
                  colspan="4"
                  style="
                                        border-top: none;
                                        border-right: none;
                                        text-align: center;
                                    "
                >
                  <img
                    :src="
                                            newprints.zyjs
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span style>&nbsp;自由加速法</span>
                </td>
                <td
                  colspan="4"
                  style="
                                        border-top: none;
                                        border-right: none;
                                        border-left: none;
                                        text-align: center;
                                    "
                >
                  <img
                    :src="
                                            newprints.jzjs
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span style>&nbsp;加载减速法</span>
                </td>
                <td colspan="4" style="border-top: none; border-left: none">
                  <img
                    :src="
                                            newprints.hgl
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span style>&nbsp;林格曼黑度法</span>
                </td>
              </tr>
              <tr>
                <td colspan="16" style="border-top: none">
                  <span style="font-weight: bold">
                    检验结果内容
                    <sup>5)</sup>
                  </span>
                </td>
              </tr>
              <tr>
                <td
                  rowspan="17"
                  colspan="4"
                  style="
                                        width: 10.5pt;
                                        margin: 0 auto;
                                        line-height: 24px;
                                        border-top-style: none;
                                    "
                >排气污染物检测</td>
              </tr>
              <tr>
                <td
                  colspan="12"
                  style="
                                        border-top-style: none;
                                        text-align: center;
                                        font-weight: bold;
                                    "
                >自由加速</td>
              </tr>
              <tr>
                <td rowspan="2" style="text-align: center">
                  额定转速/
                  <br />(r/min)
                </td>
                <td rowspan="2" style="text-align: center">
                  实测转速/
                  <br />(r/min)
                </td>
                <td colspan="6" style="text-align: center">
                  最后三次测量值，
                  <span>
                    m
                    <sup>-1</sup>
                  </span>
                </td>
                <td
                  colspan="2"
                  style="
                                        text-align: center;
                                        border-bottom-style: none;
                                    "
                >
                  平均值(
                  <span>
                    m
                    <sup>-1</sup>
                  </span>)
                </td>
                <td
                  colspan="2"
                  style="
                                        text-align: center;
                                        border-bottom-style: none;
                                    "
                >
                  限值(
                  <span>
                    m
                    <sup>-1</sup>
                  </span>)
                </td>
              </tr>
              <tr>
                <td colspan="2" style="text-align: center">1</td>
                <td colspan="2" style="text-align: center">2</td>
                <td colspan="2" style="text-align: center">3</td>
                <td
                  colspan="2"
                  style="
                                        text-align: center;
                                        border-top-style: none;
                                        border-bottom-style: none;
                                    "
                ></td>
                <td
                  colspan="2"
                  style="
                                        text-align: center;
                                        border-top-style: none;
                                        border-left-style: none;
                                        border-bottom-style: none;
                                    "
                ></td>
              </tr>
              <tr>
                <td style="text-align: center">
                  <span class="mySpan-fld" style="text-align: center">{{ newprints.spRateSpeed }}</span>
                </td>
                <td style="text-align: center">
                  <span
                    class="mySpan-fld"
                    style="text-align: center"
                  >{{ newprints.spRealRateSpeed }}</span>
                </td>
                <td colspan="2" style="text-align: center">
                  <span>
                    {{
                    newprints.Method_f.ER1 == null
                    ? "-"
                    : newprints.Method_f.ER1 <= 0
                    ? "未检出"
                    : saveNumber(
                    newprints.Method_f.ER1,
                    2
                    )
                    }}
                  </span>
                </td>
                <td colspan="2" style="text-align: center">
                  <span>
                    {{
                    newprints.Method_f.ER2 == null
                    ? "-"
                    : newprints.Method_f.ER2 <= 0
                    ? "未检出"
                    : saveNumber(
                    newprints.Method_f.ER2,
                    2
                    )
                    }}
                  </span>
                </td>
                <td colspan="2" style="text-align: center">
                  <span>
                    {{
                    newprints.Method_f.ER3 == null
                    ? "-"
                    : newprints.Method_f.ER3 <= 0
                    ? "未检出"
                    : saveNumber(
                    newprints.Method_f.ER3,
                    2
                    )
                    }}
                  </span>
                </td>
                <td colspan="2" style="text-align: center">
                  <span>
                    {{
                    newprints.Method_f.ERA == null
                    ? "-"
                    : newprints.Method_f.ERA <= 0
                    ? "未检出"
                    : saveNumber(
                    newprints.Method_f.ERA,
                    2
                    )
                    }}
                  </span>
                </td>
                <td colspan="2" style="text-align: center">
                  <span>
                    {{
                    newprints.Method_f.EL == null
                    ? "-"
                    : saveNumber(
                    newprints.Method_f.EL,
                    2
                    )
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td
                  colspan="12"
                  style="
                                        text-align: center;
                                        font-weight: bold;
                                    "
                >
                  <span>加载减速</span>
                </td>
              </tr>
              <tr>
                <td colspan="6" style="text-align: center">转速</td>
                <td colspan="6" style="text-align: center">最大轮边功率</td>
              </tr>
              <tr>
                <td colspan="3" style="text-align: center">额定转速</td>
                <td colspan="3" style="text-align: center">实测（修正）VelMaxHP</td>
                <td colspan="3" style="text-align: center">实测kW</td>
                <td colspan="3" style="text-align: center">限值kW</td>
              </tr>
              <tr>
                <td colspan="3" style="text-align: center">
                  <span class="mySpan-fld" style="text-align: center">{{ newprints.ldRateSpeed }}</span>
                </td>
                <td colspan="3" style="text-align: center">
                  <span
                    class="mySpan-fld"
                    style="text-align: center"
                  >{{ newprints.ldRealRateSpeed }}</span>
                </td>
                <td colspan="3" style="text-align: center">
                  <span style="text-align: center" class="mySpan-fld">
                    {{
                    newprints.Method_g.MWP == null
                    ? "-"
                    : saveNumber(
                    newprints.Method_g.MWP,
                    2
                    )
                    }}
                  </span>
                </td>
                <td colspan="3" style="text-align: center">
                  <span style="text-align: center" class="mySpan-fld">
                    {{
                    newprints.Method_g.MWPEL == null
                    ? "-"
                    : saveNumber(
                    newprints.Method_g.MWPEL,
                    2
                    )
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td colspan="6" style="text-align: center">烟度</td>
                <td colspan="6" style="text-align: center">氮氧化物NOx</td>
              </tr>
              <tr>
                <td colspan="2"></td>
                <td colspan="2" style="text-align: center">100%点</td>
                <td
                  colspan="2"
                  style="
                                        text-align: center;
                                        border-bottom: none;
                                    "
                >80%点</td>
                <td
                  colspan="2"
                  style="
                                        text-align: center;
                                        border-bottom: none;
                                    "
                ></td>
                <td
                  colspan="5"
                  style="
                                        text-align: center;
                                        border-bottom: none;
                                    "
                >80%点</td>
              </tr>
              <tr></tr>
              <tr>
                <td colspan="2" style="text-align: center">实测值</td>
                <td colspan="2" style="text-align: center">
                  <span>
                    {{
                    newprints.Method_g.ER100 == null
                    ? "-"
                    : newprints.Method_g.ER100 <= 0
                    ? "未检出"
                    : saveNumber(
                    newprints.Method_g.ER100,
                    2
                    )
                    }}
                  </span>
                </td>
                <td colspan="2" style="text-align: center">
                  <span>
                    {{
                    newprints.Method_g.ER80 == null
                    ? "-"
                    : newprints.Method_g.ER80 <= 0
                    ? "未检出"
                    : saveNumber(
                    newprints.Method_g.ER80,
                    2
                    )
                    }}
                  </span>
                </td>
                <td colspan="2" style="text-align: center">实测值</td>
                <td colspan="5" style="text-align: center">
                  <span>
                    {{
                    newprints.Method_g.NOX80 == null
                    ? "-"
                    : newprints.Method_g.NOX80 <= 0
                    ? "未检出"
                    : saveNumber(
                    newprints.Method_g.NOX80,
                    2
                    )
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td colspan="2" style="text-align: center">限值</td>
                <td colspan="2" style="text-align: center">
                  <span>
                    {{
                    newprints.Method_g.EL == null
                    ? "-"
                    : saveNumber(
                    newprints.Method_g.EL,
                    2
                    )
                    }}
                  </span>
                </td>
                <td colspan="2" style="text-align: center">
                  <span>
                    {{
                    newprints.Method_g.EL == null
                    ? "-"
                    : saveNumber(
                    newprints.Method_g.EL,
                    2
                    )
                    }}
                  </span>
                </td>
                <td colspan="2" style="text-align: center">限值</td>
                <td colspan="5" style="text-align: center">
                  <span>
                    {{
                    newprints.Method_g.NOXEL == null
                    ? "-"
                    : saveNumber(
                    newprints.Method_g.NOXEL,
                    2
                    )
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td
                  colspan="12"
                  style="
                                        text-align: center;
                                        font-weight: bold;
                                    "
                >
                  <span>林格曼黑度法</span>
                </td>
              </tr>
              <tr>
                <td colspan="3" style="text-align: center">明显可见烟度</td>
                <td colspan="3" style="text-align: center">
                  <span>
                    {{
                    !newprints.Method_j || newprints.Method_j.VisibleSmoke == null
                    ? "-"
                    : newprints.Method_j.VisibleSmoke ==
                    1
                    ? "是"
                    : "否"
                    }}
                  </span>
                </td>
                <td colspan="3" style="text-align: center">林格曼黑度（级）</td>
                <td colspan="3" style="text-align: center">
                  <span>
                    {{
                    !newprints.Method_j || newprints.Method_j.LingmanRank == null
                    ? "-"
                    : newprints.Method_j.LingmanRank
                    }}
                  </span>
                </td>
              </tr>
            </table>
            <!-- 汽油车检测项 -->
            <table
              v-else
              style="
                                width: 550.5pt;
                                margin: auto auto;
                                border-collapse: collapse !important;
                            "
              class="fld-container"
            >
              <tr>
                <td colspan="18" style="border-top: none">
                  <span style="font-weight: bold">排气污染物检测</span>
                </td>
              </tr>
              <tr>
                <td colspan="3" style="border-top: none">
                  <span style="font-weight: bold">检测方法</span>
                </td>
                <td
                  colspan="3"
                  style="
                                        border-top: none;
                                        border-right: none;
                                        text-align: center;
                                    "
                >
                  <img
                    :src="
                                            newprints.sds
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span style>&nbsp;双怠速</span>
                </td>
                <td
                  colspan="4"
                  style="
                                        border-top: none;
                                        border-right: none;
                                        border-left: none;
                                    "
                >
                  <img
                    :src="
                                            newprints.wt
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span style>&nbsp;稳态工况法</span>
                </td>
                <td
                  colspan="4"
                  style="
                                        border-top: none;
                                        border-right: none;
                                        border-left: none;
                                    "
                >
                  <img
                    :src="
                                            newprints.st
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span style>&nbsp;瞬态工况法</span>
                </td>
                <td colspan="4" style="border-top: none; border-left: none">
                  <img
                    :src="
                                            newprints.jyst
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span style>&nbsp;简易瞬态工况法</span>
                </td>
              </tr>
              <tr>
                <td colspan="18" style="border-top: none">
                  <span style="font-weight: bold">
                    检验结果内容
                    <sup>5)</sup>
                  </span>
                </td>
              </tr>
              <tr>
                <td
                  rowspan="21"
                  colspan="4"
                  style="
                                        width: 10.5pt;
                                        margin: 0 auto;
                                        line-height: 24px;
                                        border-top: none;
                                        border-bottom: none;
                                    "
                >排气污染物检测</td>
              </tr>
              <tr>
                <td
                  colspan="14"
                  style="
                                        text-align: center;
                                        border-top: none;
                                        font-weight: bold;
                                    "
                >双怠速</td>
              </tr>
              <tr>
                <td rowspan="2" style="width: 60px; border-top-style: none"></td>
                <td
                  rowspan="2"
                  style="
                                        border-top-style: none;
                                        text-align: center;
                                    "
                >过量空气系数（λ）</td>
                <td
                  colspan="6"
                  style="
                                        border-top-style: none;
                                        text-align: center;
                                    "
                >低怠速</td>
                <td
                  colspan="6"
                  style="
                                        border-top-style: none;
                                        text-align: center;
                                    "
                >高怠速</td>
              </tr>
              <tr>
                <td colspan="3" style="text-align: center">CO(%)</td>
                <td colspan="3" style="text-align: center">
                  HC(
                  <span>
                    10
                    <sup>-6</sup>
                  </span>)
                </td>
                <td colspan="3" style="text-align: center">CO(%)</td>
                <td colspan="3" style="text-align: center">
                  HC(
                  <span>
                    10
                    <sup>-6</sup>
                  </span>)
                </td>
              </tr>
              <tr>
                <td style="width: 60px; text-align: center">实测值</td>
                <td style="text-align: center">
                  <span style="text-align: center">
                    {{
                    newprints.Method_a.EACR == null
                    ? "-"
                    : newprints.Method_a.EACR <= 0
                    ? "未检出"
                    : saveNumber(
                    newprints.Method_a.EACR,
                    2
                    )
                    }}
                  </span>
                </td>
                <td colspan="3" style="text-align: center">
                  <span style="text-align: center">
                    {{
                    newprints.Method_a.LICOR == null
                    ? "-"
                    : newprints.Method_a.LICOR <= 0
                    ? "未检出"
                    : saveNumber(
                    newprints.Method_a.LICOR,
                    2
                    )
                    }}
                  </span>
                </td>
                <td colspan="3" style="text-align: center">
                  <span style="text-align: center">
                    {{
                    newprints.Method_a.LIHCR == null
                    ? "-"
                    : newprints.Method_a.LIHCR <= 0
                    ? "未检出"
                    : saveNumber(
                    newprints.Method_a.LIHCR,
                    2
                    )
                    }}
                  </span>
                </td>
                <td colspan="3" style="text-align: center">
                  <span style="text-align: center">
                    {{
                    newprints.Method_a.HICOR == null
                    ? "-"
                    : newprints.Method_a.HICOR <= 0
                    ? "未检出"
                    : saveNumber(
                    newprints.Method_a.HICOR,
                    2
                    )
                    }}
                  </span>
                </td>
                <td colspan="3" style="text-align: center">
                  <span style="text-align: center">
                    {{
                    newprints.Method_a.HIHCR == null
                    ? "-"
                    : newprints.Method_a.HIHCR <= 0
                    ? "未检出"
                    : saveNumber(
                    newprints.Method_a.HIHCR,
                    2
                    )
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="width: 60px; text-align: center">限值</td>
                <td style="text-align: center">
                  <span style="text-align: center">
                    {{
                    newprints.eacl_s
                    }}
                  </span>
                </td>
                <td colspan="3" style="text-align: center">
                  <span style="text-align: center">
                    {{
                    newprints.Method_a.LICOL == null
                    ? "-"
                    : saveNumber(
                    newprints.Method_a.LICOL,
                    2
                    )
                    }}
                  </span>
                </td>
                <td colspan="3" style="text-align: center">
                  <span style="text-align: center">
                    {{
                    newprints.Method_a.LIHCL == null ||
                    newprints.Method_a.IsCheckHC == 0
                    ? "-"
                    : saveNumber(
                    newprints.Method_a.LIHCL,
                    2
                    )
                    }}
                  </span>
                </td>
                <td colspan="3" style="text-align: center">
                  <span style="text-align: center">
                    {{
                    newprints.Method_a.HICOL == null
                    ? "-"
                    : saveNumber(
                    newprints.Method_a.HICOL,
                    2
                    )
                    }}
                  </span>
                </td>
                <td colspan="3" style="text-align: center">
                  <span style="text-align: center">
                    {{
                    newprints.Method_a.HIHCL == null ||
                    newprints.Method_a.IsCheckHC == 0
                    ? "-"
                    : saveNumber(
                    newprints.Method_a.HIHCL,
                    2
                    )
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td
                  colspan="14"
                  style="
                                        border-top-style: none;
                                        text-align: center;
                                        font-weight: bold;
                                    "
                >瞬态工况法</td>
              </tr>
              <tr>
                <td colspan="2" style="width: 60px"></td>
                <td colspan="6" style="text-align: center">CO/（g/km）</td>
                <td colspan="6" style="text-align: center">HC+NOx/（g/km）</td>
              </tr>
              <tr>
                <td
                  colspan="2"
                  style="
                                        width: 60px;
                                        line-height: 120%;
                                        text-align: center;
                                    "
                >实测值</td>
                <td colspan="6" style="text-align: center">
                  <span style="text-align: center">-</span>
                </td>
                <td colspan="6" style="text-align: center">
                  <span style="text-align: center">-</span>
                </td>
              </tr>
              <tr>
                <td
                  colspan="2"
                  style="
                                        width: 60px;
                                        line-height: 120%;
                                        text-align: center;
                                    "
                >限值</td>
                <td colspan="6" style="text-align: center">
                  <span style="text-align: center" />-
                </td>
                <td colspan="6" style="text-align: center">
                  <span style="text-align: center" />-
                </td>
              </tr>
              <tr>
                <td
                  colspan="14"
                  style="
                                        border-top-style: none;
                                        text-align: center;
                                        font-weight: bold;
                                    "
                >简易瞬态工况法</td>
              </tr>
              <tr>
                <td colspan="2" style="width: 60px"></td>
                <td colspan="4" style="text-align: center">HC/（g/km）</td>
                <td colspan="4" style="text-align: center">CO/（g/km）</td>
                <td colspan="4" style="text-align: center">NOx/（g/km）</td>
              </tr>
              <tr>
                <td
                  colspan="2"
                  style="
                                        width: 60px;
                                        line-height: 120%;
                                        text-align: center;
                                    "
                >实测值</td>
                <td colspan="4" style="text-align: center">
                  <span style="text-align: center">
                    {{
                    newprints.Method_c.HCER == null
                    ? "-"
                    : newprints.Method_c.HCER <= 0
                    ? "未检出"
                    : saveNumber(
                    newprints.Method_c.HCER,
                    2
                    )
                    }}
                  </span>
                </td>
                <td colspan="4" style="text-align: center">
                  <span style="text-align: center">
                    {{
                    newprints.Method_c.COER == null
                    ? "-"
                    : newprints.Method_c.COER <= 0
                    ? "未检出"
                    : saveNumber(
                    newprints.Method_c.COER,
                    2
                    )
                    }}
                  </span>
                </td>
                <td colspan="4" style="text-align: center">
                  <span style="text-align: center">
                    {{
                    newprints.Method_c.NOXER == null
                    ? "-"
                    : newprints.Method_c.NOXER <= 0
                    ? "未检出"
                    : saveNumber(
                    newprints.Method_c.NOXER,
                    2
                    )
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td
                  colspan="2"
                  style="
                                        width: 60px;
                                        line-height: 120%;
                                        text-align: center;
                                    "
                >限值</td>
                <td colspan="4" style="text-align: center">
                  <span style="text-align: center">
                    {{
                    newprints.Method_c.HCEL == null
                    ? "-"
                    : saveNumber(
                    newprints.Method_c.HCEL,
                    2
                    )
                    }}
                  </span>
                </td>
                <td colspan="4" style="text-align: center">
                  <span style="text-align: center">
                    {{
                    newprints.Method_c.COEL == null
                    ? "-"
                    : saveNumber(
                    newprints.Method_c.COEL,
                    2
                    )
                    }}
                  </span>
                </td>
                <td colspan="4" style="text-align: center">
                  <span style="text-align: center">
                    {{
                    newprints.Method_c.NOXEL == null
                    ? "-"
                    : saveNumber(
                    newprints.Method_c.NOXEL,
                    2
                    )
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td
                  colspan="14"
                  style="
                                        border-top-style: none;
                                        text-align: center;
                                        font-weight: bold;
                                    "
                >稳态工况法</td>
              </tr>
              <tr>
                <td colspan="2" style="width: 60px"></td>
                <td colspan="6" style="text-align: center">ASM5025</td>
                <td colspan="6" style="text-align: center">ASM2540</td>
              </tr>

              <tr>
                <td colspan="2" style="width: 60px"></td>
                <td colspan="2" style="text-align: center">
                  HC/
                  <span>
                    10
                    <sup>-6</sup>
                  </span>
                </td>
                <td colspan="2" style="text-align: center">CO/%</td>
                <td colspan="2" style="text-align: center">
                  NO/
                  <span>
                    10
                    <sup>-6</sup>
                  </span>
                </td>
                <td colspan="2" style="text-align: center">
                  HC/
                  <span>
                    10
                    <sup>-6</sup>
                  </span>
                </td>
                <td colspan="2" style="text-align: center">CO/%</td>
                <td colspan="2" style="text-align: center">
                  NO/
                  <span>
                    10
                    <sup>-6</sup>
                  </span>
                </td>
              </tr>

              <tr>
                <td
                  colspan="2"
                  style="
                                        width: 60px;
                                        line-height: 120%;
                                        text-align: center;
                                    "
                >实测值</td>
                <td colspan="2" style="text-align: center">
                  <span style="text-align: center">
                    {{
                    newprints.Method_b.HCER5025 == null
                    ? "-"
                    : newprints.Method_b.HCER5025 <= 0
                    ? "未检出"
                    : saveNumber(
                    newprints.Method_b.HCER5025,
                    2
                    )
                    }}
                  </span>
                </td>
                <td colspan="2" style="text-align: center">
                  <span style="text-align: center">
                    {{
                    newprints.Method_b.COER5025 == null
                    ? "-"
                    : newprints.Method_b.COER5025 <= 0
                    ? "未检出"
                    : saveNumber(
                    newprints.Method_b.COER5025,
                    2
                    )
                    }}
                  </span>
                </td>
                <td colspan="2" style="text-align: center">
                  <span style="text-align: center">
                    {{
                    newprints.Method_b.NOER5025 == null
                    ? "-"
                    : newprints.Method_b.NOER5025 <= 0
                    ? "未检出"
                    : saveNumber(
                    newprints.Method_b.NOER5025,
                    2
                    )
                    }}
                  </span>
                </td>

                <td colspan="2" style="text-align: center">
                  <span style="text-align: center">
                    {{
                    newprints.Method_b.HCER2540 == null
                    ? "-"
                    : newprints.Method_b.HCER2540 <= 0
                    ? "未检出"
                    : saveNumber(
                    newprints.Method_b.HCER2540,
                    2
                    )
                    }}
                  </span>
                </td>
                <td colspan="2" style="text-align: center">
                  <span style="text-align: center">
                    {{
                    newprints.Method_b.COER2540 == null
                    ? "-"
                    : newprints.Method_b.COER2540 <= 0
                    ? "未检出"
                    : saveNumber(
                    newprints.Method_b.COER2540,
                    2
                    )
                    }}
                  </span>
                </td>
                <td colspan="2" style="text-align: center">
                  <span style="text-align: center">
                    {{
                    newprints.Method_b.NOER2540 == null
                    ? "-"
                    : newprints.Method_b.NOER2540 <= 0
                    ? "未检出"
                    : saveNumber(
                    newprints.Method_b.NOER2540,
                    2
                    )
                    }}
                  </span>
                </td>
              </tr>

              <tr>
                <td
                  colspan="2"
                  style="
                                        width: 60px;
                                        line-height: 120%;
                                        text-align: center;
                                    "
                >限值</td>
                <td colspan="2" style="text-align: center">
                  <span style="text-align: center">
                    {{
                    newprints.Method_b.HCEL5025 == null ||
                    newprints.Method_b.IsCheckHC == 0
                    ? "-"
                    : saveNumber(
                    newprints.Method_b.HCEL5025,
                    2
                    )
                    }}
                  </span>
                </td>
                <td colspan="2" style="text-align: center">
                  <span style="text-align: center">
                    {{
                    newprints.Method_b.COEL5025 == null
                    ? "-"
                    : saveNumber1(
                    newprints.Method_b.COEL5025,
                    2
                    )
                    }}
                  </span>
                </td>
                <td colspan="2" style="text-align: center">
                  <span style="text-align: center">
                    {{
                    newprints.Method_b.NOEL5025 == null
                    ? "-"
                    : saveNumber(
                    newprints.Method_b.NOEL5025,
                    2
                    )
                    }}
                  </span>
                </td>
                <td colspan="2" style="text-align: center">
                  <span style="text-align: center">
                    {{
                    newprints.Method_b.HCEL2540 == null ||
                    newprints.Method_b.IsCheckHC == 0
                    ? "-"
                    : saveNumber(
                    newprints.Method_b.HCEL2540,
                    2
                    )
                    }}
                  </span>
                </td>
                <td colspan="2" style="text-align: center">
                  <span style="text-align: center">
                    {{
                    newprints.Method_b.COEL2540 == null
                    ? "-"
                    : saveNumber1(
                    newprints.Method_b.COEL2540,
                    2
                    )
                    }}
                  </span>
                </td>
                <td colspan="2" style="text-align: center">
                  <span style="text-align: center">
                    {{
                    newprints.Method_b.NOEL2540 == null
                    ? "-"
                    : saveNumber(
                    newprints.Method_b.NOEL2540,
                    2
                    )
                    }}
                  </span>
                </td>
              </tr>

              <tr>
                <td colspan="2" style="width: 60px; line-height: 120%">结果判定</td>
                <td colspan="4" style="border-right: none">
                  <img
                    :src="
                                            newprints.newJcjg
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span>合格</span> &nbsp;&nbsp;&nbsp;
                  <img
                    :src="
                                            !newprints.newJcjg
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span>不合格</span>
                </td>
                <td
                  colspan="4"
                  style="
                                        border-left: none;
                                        border-right: none;
                                    "
                ></td>
                <td colspan="4" style="border-left: none"></td>
              </tr>
              <tr>
                <td
                  colspan="2"
                  style="
                                        width: 60px;
                                        line-height: 120%;
                                        border-right: none;
                                        border-bottom: none;
                                    "
                >
                  检验员：&nbsp;
                  <span style="text-align: center">
                    {{
                    newprints.InsDataInfo.ICheck
                    }}
                  </span>
                </td>
                <td
                  colspan="4"
                  style="
                                        border-left: none;
                                        border-right: none;
                                        border-bottom: none;
                                    "
                ></td>
                <td
                  colspan="4"
                  style="
                                        border-left: none;
                                        border-right: none;
                                        border-bottom: none;
                                    "
                ></td>
                <td
                  colspan="4"
                  style="
                                        border-left: none;
                                        border-bottom: none;
                                    "
                ></td>
              </tr>
            </table>
            <table
              v-if="QY_CY"
              class="fld-container"
              style="
                                width: 550.5pt;
                                margin: auto auto;
                                border-collapse: collapse !important;
                            "
            >
              <tr>
                <td
                  rowspan="3"
                  colspan="4"
                  style="
                                        width: 13.25%;
                                        margin: 0 auto;
                                        line-height: 24px;
                                        border-bottom: none;
                                    "
                >燃油蒸发测试</td>
                <td colspan="3">进油口测试</td>
                <td colspan="3">
                  <img
                    id="jyhg"
                    :src="
                                            newprints.jyhg
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span>合格</span> &nbsp; &nbsp;
                  <img
                    id="jybhg"
                    :src="
                                            newprints.jybhg
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span>不合格</span>
                </td>
                <td colspan="5">油箱盖测试</td>
                <td colspan="3">
                  <img
                    id="yxhg"
                    :src="
                                            newprints.yxhg
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span>合格</span> &nbsp; &nbsp;
                  <img
                    id="yxbhg"
                    :src="
                                            newprints.yxbhg
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span>不合格</span>
                </td>
              </tr>
              <tr>
                <td colspan="3">结果判定</td>
                <td colspan="11">
                  <img
                    id="ryhg"
                    :src="
                                            newprints.ryhg
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span>合格</span> &nbsp; &nbsp;
                  <img
                    id="rybhg"
                    :src="
                                            newprints.rybhg
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="width: 12px; height: 12px"
                  />
                  <span>不合格</span>
                </td>
              </tr>
              <tr>
                <td
                  colspan="3"
                  style="
                                        border-right: none;
                                        border-bottom: none;
                                    "
                >
                  <span>检验员:</span>
                  <span>{{newprints.ryjcy}}</span>
                </td>
                <td
                  colspan="11"
                  style="
                                        border-left: none;
                                        border-bottom: none;
                                    "
                ></td>
              </tr>
            </table>
            <table
              id="tableContent_Sign"
              class="fld-container"
              style="
                                width: 550.5pt;
                                margin: auto auto;
                                border-collapse: collapse !important;
                            "
            >
              <tr v-show="!QY_CY">
                <td style="border-top-style: none; width: 12%">检测结果</td>
                <td
                  colspan="5"
                  style="
                                        border-top-style: none;
                                        border-right-style: none;
                                    "
                >
                  <img
                    :src="
                                            newprints.jchg
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="
                                            margin-left: 6px;
                                            width: 12px;
                                            height: 12px;
                                        "
                  />
                  <span>合格</span>&nbsp;&nbsp;&nbsp;
                  <img
                    :src="
                                            newprints.jcbhg
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="
                                            margin-left: 6px;
                                            width: 12px;
                                            height: 12px;
                                        "
                  />
                  <span>不合格</span>
                </td>
                <td
                  colspan="2"
                  style="
                                        border-top-style: none;
                                        border-left-style: none;
                                        border-right-style: none;
                                        width: 100px;
                                    "
                >
                  检验员：&nbsp;
                  <span>
                    {{
                    newprints.InsDataInfo.ICheck
                    }}
                  </span>
                </td>
                <td
                  colspan="4"
                  style="
                                        border-top-style: none;
                                        border-left-style: none;
                                    "
                ></td>
              </tr>
              <tr v-show="QY_CY">
                <td style="width: 13.25%">排气污染物检测结果</td>
                <td
                  colspan="4"
                  style="
                                        width: 30%;
                                        border-left: none;
                                        border-right: none;
                                    "
                >
                  <img
                    :src="
                                            newprints.jchg
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="
                                            width: 12px;
                                            height: 12px;
                                            margin-left: 15px;
                                        "
                  />
                  <span>合格</span>
                  <img
                    :src="
                                            newprints.jcbhg
                                                ? '/exhaust/img/ok.png'
                                                : '/exhaust/img/nook.png'
                                        "
                    style="
                                            width: 12px;
                                            height: 12px;
                                            margin-left: 15px;
                                        "
                  />
                  <span>不合格</span>
                </td>
                <td
                  style="
                                        width: 90px;
                                        border-left: none;
                                        border-right: none;
                                    "
                  colspan="2"
                ></td>
                <td colspan="4" style="width: 30%; border-left: none"></td>
              </tr>
              <tr>
                <td style="width: 13.25%">授权签字人</td>
                <td
                  colspan="4"
                  style="
                                        width: 30%;
                                        border-left: none;
                                        border-right: none;
                                    "
                ></td>
                <td
                  style="
                                        width: 90px;
                                        border-left: none;
                                        border-right: none;
                                    "
                  colspan="2"
                ></td>
                <td colspan="4" style="width: 30%; border-left: none"></td>
              </tr>
              <tr>
                <td>批准人</td>
                <td colspan="4"></td>
                <td style="border-top-style: none">单位盖章</td>
                <td colspan="4"></td>
              </tr>
            </table>

            <table
              id="tableContent_Declare"
              style="
                                width: 550.5pt;
                                margin: auto auto;
                                border-collapse: collapse !important;
                            "
              class="fld-container"
              data-bind="with: inspectionEnt"
            >
              <tr>
                <td
                  style="
                                        border-top-style: none;
                                        border-right-style: none;
                                        border-bottom-style: none;
                                    "
                >注：</td>
                <td
                  colspan="5"
                  style="
                                        text-align: left;
                                        border-top-style: none;
                                        border-left-style: none;
                                        border-bottom-style: none;
                                    "
                >
                  1）8位数，年份（4位）+ 月份（2位）+
                  日期（2位）
                </td>
              </tr>

              <tr>
                <td
                  style="
                                        border-top-style: none;
                                        border-right-style: none;
                                        border-bottom-style: none;
                                    "
                ></td>
                <td
                  colspan="5"
                  style="
                                        text-align: left;
                                        border-top-style: none;
                                        border-left-style: none;
                                        border-bottom-style: none;
                                    "
                >2）按照计量认证证书填写</td>
              </tr>
              <tr>
                <td
                  style="
                                        border-top-style: none;
                                        border-right-style: none;
                                        border-bottom-style: none;
                                    "
                ></td>
                <td
                  colspan="5"
                  style="
                                        text-align: left;
                                        border-top-style: none;
                                        border-left-style: none;
                                        border-bottom-style: none;
                                    "
                >3）仅适用混合动力车辆</td>
              </tr>
              <tr>
                <td
                  style="
                                        border-top-style: none;
                                        border-right-style: none;
                                        border-bottom-style: none;
                                    "
                ></td>
                <td
                  colspan="5"
                  style="
                                        text-align: left;
                                        border-top-style: none;
                                        border-left-style: none;
                                        border-bottom-style: none;
                                    "
                >4）0-蓝牌，1-黄牌，2-白牌，3-黑牌，4-新能源，5-其他</td>
              </tr>
              <tr>
                <td
                  style="
                                        border-top-style: none;
                                        border-right-style: none;
                                    "
                ></td>
                <td
                  colspan="5"
                  style="
                                        text-align: left;
                                        border-top-style: none;
                                        border-left-style: none;
                                    "
                >5）污染物检测结果为负数或者零时，应记录为“未检出”</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getLodop,
  getCDData,
  saveNumber,
  formatDates
} from "../../../utils/utils";
export default {
  name: "printContent",
  data() {
    //测试车辆粤C23500  MAG1100 粤Y846E0
    return {
      FuelEvaporationInfo: [],
      reportTitle: "",
      prints: false,
      QY_CY: false,
      table_height: 70,
      //字典表
      StationInfo: [],
      CD_InspectionMethod: [],
      CD_VLPNColor: [],
      CD_FuelType: [],
      CD_OCHA: [],
      CD_UseOfAuto: [],
      loading: false,
      printdata: [],
      isLDUseVelMaxHP: false,
      newprints: {
        InsDataInfo: {}, //检测数据
        jcsb: {}, //检测设备信息
        OBDInfo: {}, //obd检测信息
        wgj: {}, //外检
        Method_g: {},
        Method_f: {},
        Method_a: {},
        Method_b: {},
        Method_c: {},
        Method_j: {}
      },

      trBodyStyle: `

<style>
td {
  border: 1px solid #000000;
  text-align: left;
  margin: 0px;
  padding: 3px;
  font-family: 宋体;
  font-size: 9pt;
  /*height:3mm;
                line-height:3mm;*/
}

tr {
  line-height: 3mm;
}

.myTable {
  border-collapse: collapse;
}

.myTd {
  border: #000 1px solid;
  text-align: center;
}

.tdText {
  text-align: center;
}

.myFld-title {
  /*border-bottom: 0px solid #C0C0C0;*/
  text-align: left;
  vertical-align: middle;
  /*background-color: blueviolet;*/
  /*color: white;*/
  margin: 2px;
  padding: 2px 5px 2px 5px;
}

.mySpan-fld {
  /*border-style: solid;
                    border-width: 0px 0px 1px 0px;
                    border-color: #6694cf;*/
  text-align: left;
  vertical-align: bottom;
  margin: 2px 5px 0px 0px;
  padding: 2px 5px 2px 5px;
  width: 100%;
  /*text-decoration:underline;*/
  display: -moz-inline-box;
  display: inline-block;
  /* 使span支持设置宽度*/
  /*min-width: 3cm;*/
}

.nc-info p {
  margin: 0;
  padding: 2px 0;
  font-size: 7pt;
}

.report-info {
  display: inline-block;
  padding: 1px 5px;
}

.report-info span {
  font-family: 宋体;
  font-size: 9pt;
}
</style>`
    };
  },
  props: {
    giveReport: {
      type: Object
    }
  },
  components: {},
  mounted() {
    let self = this;
    self.saveNumber = saveNumber;

    self.getReportTitle();
    self.getDBinfoByMultipte();
  },
  methods: {
    // 返回结果保留两位小数
    saveNumber1(value, num) {
      return Number(value).toFixed(num);
    },
    //从缓存中读取cd表或者库中
    getDBinfoByMultipte() {
      const self = this;
      let cdname = [
        {
          tableName: "StationInfo",
          columns: "StationCode as CodeValue,IUSTA as CodeName"
        },
        {
          tableName: "CD_InspectionMethod",
          columns: "CodeValue,CodeName"
        },
        {
          tableName: "CD_VLPNColor",
          columns: "CodeValue,CodeName"
        },
        {
          tableName: "CD_FuelType",
          columns: "CodeValue,CodeName"
        },
        {
          tableName: "CD_OCHA",
          columns: "CodeValue,CodeName"
        },
        {
          tableName: "CD_UseOfAuto",
          columns: "CodeValue,CodeName"
        }
      ];
      const tableList = cdname.map(c => c.tableName);
      let data = [];
      if (self.$getDBTable) {
        self.$getDBTable(tableList).then(res => {
          data = res.map((item, index) => {
            item = JSON.parse(item);
            if (item[0].hasOwnProperty("IsAvailable"))
              item = item.filter(d => d.IsAvailable == 1);
            return item;
          });
          // [self.StationInfo ,self.CD_InspectionMethod,self.CD_VLPNColor ,self.CD_FuelType,self.CD_OCHA]=[...data];
          self.StationInfo = data[0];
          self.CD_InspectionMethod = data[1];
          self.CD_VLPNColor = data[2];
          self.CD_FuelType = data[3];
          self.CD_OCHA = data[4];
          self.CD_UseOfAuto = data[5];
        });
      } else {
        getCDData(this, cdname).then(e => {
          if (e.state) {
            data = e.data.map(item => {
              if (item[0].hasOwnProperty("IsAvailable"))
                item = item.filter(i => i.IsAvailable == 1);
              return item;
            });
            // [self.StationInfo, self.CD_InspectionMethod, self.CD_VLPNColor, self.CD_FuelType, self.CD_OCHA] = [...data];
            self.StationInfo = data[0];
            self.CD_InspectionMethod = data[1];
            self.CD_VLPNColor = data[2];
            self.CD_FuelType = data[3];
            self.CD_OCHA = data[4];
            self.CD_UseOfAuto = data[5];
          }
        });
      }
    },
    printaction() {
      let self = this;
      // const data = this.giveReport;
      const data = Object.assign({}, this.giveReport);
      self.newprints = {
        InsDataInfo: {},
        jcsb: {},
        OBDInfo: {},
        wgj: {},
        Method_g: {},
        Method_f: {},
        Method_a: {},
        Method_b: {},
        Method_c: {},
        Method_j: {}
      };
      let params = {
        inspectionDataID: data.InspectionDataID,
        vehicleID: data.VehicleID,
        inspectionMethod: data.IUTYPE,
        InspectionNum: data.InspectionNum,
        ifName: data.ifName
      };
      this.$curl
        .get("api/hj/getSysConfig", {
          params: {
            FieldKey: ["IsLDUseVelMaxHP"]
          }
        })
        .then(res => {
          if (res.state && res.data)
            this.isLDUseVelMaxHP =
              res.data[0].FieldValue == "true" ? true : false;
        });
      this.$curl
        .get("api/hj/GetInspectionResultNew", {
          params: JSON.stringify(params)
        })
        .then(res => {
          if (res) {
            if (!res.state) return;
            self.newprints.InsDataInfo = res.InsDataInfo[0];
            self.newprints.VehicleInfo = res.VehicleInfo[0];
            self.newprints.StationInfo = res.StationInfo[0];
            if (res.OBDInfo[0]) self.newprints.OBDInfo = res.OBDInfo[0];
            self.newprints.eacl_s = "-";
            let typeList = data.IUTYPE.split(",");

            if (typeList.length > 1) {
              typeList.forEach(type => {
                let newJcjg = true;
                switch (type) {
                  case "A":
                    self.QY_CY = true;
                    let indexA = res.MethodDataInfo.findIndex(
                      item => item.IUTYPE == type
                    );
                    if (indexA !== -1) {
                      self.newprints.Method_a = res.MethodDataInfo[indexA].data;
                      if (
                        self.newprints.Method_a.TSIED == 0 ||
                        self.newprints.Method_a.TSIED == 1
                      ) {
                        if (self.newprints.Method_a.TSIED == 0) newJcjg = false;
                      } else if (data.VDCT == 0 || data.VDCT == 1) {
                        if (data.VDCT == 0) newJcjg = false;
                      }
                    }
                    self.newprints.eacl_s =
                      ((self.newprints.Method_a.EACLD &&
                        self.saveNumber(self.newprints.Method_a.EACLD, 2)) ||
                        "0.95") +
                      " ～ " +
                      ((self.newprints.Method_a.EACLU &&
                        self.saveNumber(self.newprints.Method_a.EACLU, 2)) ||
                        "1.05");
                    break;
                  case "B":
                    self.QY_CY = true;
                    let indexB = res.MethodDataInfo.findIndex(
                      item => item.IUTYPE == type
                    );
                    if (indexB !== -1) {
                      self.newprints.Method_b = res.MethodDataInfo[indexB].data;
                      if (
                        self.newprints.Method_b.ASMED == 0 ||
                        self.newprints.Method_b.ASMED == 1
                      ) {
                        if (self.newprints.Method_b.ASMED == 0) newJcjg = false;
                      } else if (data.VDCT == 0 || data.VDCT == 1) {
                        if (data.VDCT == 0) newJcjg = false;
                      }
                    }
                    break;
                  case "C":
                    self.QY_CY = true;
                    let indexC = res.MethodDataInfo.findIndex(
                      item => item.IUTYPE == type
                    );
                    if (indexC !== -1) {
                      self.newprints.Method_c = res.MethodDataInfo[indexC].data;
                      if (
                        self.newprints.Method_c.IMED == 0 ||
                        self.newprints.Method_c.IMED == 1
                      ) {
                        if (self.newprints.Method_c.IMED == 0) newJcjg = false;
                      } else if (data.VDCT == 0 || data.VDCT == 1) {
                        if (data.VDCT == 0) newJcjg = false;
                      }
                    }
                    break;
                  case "G":
                    self.QY_CY = false;
                    let indexG = res.MethodDataInfo.findIndex(
                      item => item.IUTYPE == type
                    );
                    if (indexG !== -1) {
                      self.newprints.Method_g = res.MethodDataInfo[indexG].data;
                      self.newprints.ldRateSpeed =
                        self.newprints.InsDataInfo.EngineRatedSpeed == null
                          ? "-"
                          : self.saveNumber(
                              self.newprints.InsDataInfo.EngineRatedSpeed,
                              2
                            );
                      if (self.isLDUseVelMaxHP) {
                        self.newprints.ldRealRateSpeed =
                          self.newprints.Method_g.VelMaxHP == null
                            ? self.newprints.Method_g.RotateSpeed == null
                              ? "-"
                              : self.saveNumber(
                                  self.newprints.Method_g.RotateSpeed,
                                  2
                                )
                            : self.saveNumber(
                                self.newprints.Method_g.VelMaxHP,
                                2
                              );
                      } else {
                        self.newprints.ldRealRateSpeed =
                          self.newprints.Method_g.VelMaxEnginePower == null
                            ? self.newprints.Method_g.RotateSpeed == null
                              ? "-"
                              : self.saveNumber(
                                  self.newprints.Method_g.RotateSpeed,
                                  2
                                )
                            : self.saveNumber(
                                self.newprints.Method_g.VelMaxEnginePower,
                                2
                              );
                      }
                    }
                    break;
                  case "F":
                    self.QY_CY = false;
                    let indexF = res.MethodDataInfo.findIndex(
                      item => item.IUTYPE == type
                    );
                    if (indexF !== -1) {
                      self.newprints.Method_f = res.MethodDataInfo[indexF].data;
                    }
                    //实测转速
                    self.newprints.spRealRateSpeed =
                      self.newprints.Method_f.ActualRotateSpeed == null
                        ? self.newprints.Method_f.RotateSpeed == null
                          ? "-"
                          : self.saveNumber(
                              self.newprints.Method_f.RotateSpeed,
                              2
                            )
                        : self.saveNumber(
                            self.newprints.Method_f.ActualRotateSpeed,
                            2
                          );

                    //额定转速
                    self.newprints.spRateSpeed =
                      self.newprints.InsDataInfo.EngineRatedSpeed == null
                        ? "-"
                        : self.saveNumber(
                            self.newprints.InsDataInfo.EngineRatedSpeed,
                            2
                          );
                    break;
                  case "J":
                    self.QY_CY = false;
                    let indexJ = res.MethodDataInfo.findIndex(
                      item => item.IUTYPE == type
                    );
                    if (indexJ !== -1) {
                      self.newprints.Method_j = res.MethodDataInfo[indexJ].data;
                    }
                    break;
                  default:
                    break;
                }
                self.newprints.newJcjg = newJcjg;
              });
            } else {
              switch (data.IUTYPE) {
                case "A":
                  self.QY_CY = true;
                  if (res.MethodDataInfo[0]) {
                    self.newprints.Method_a = res.MethodDataInfo[0];
                    if (
                      self.newprints.Method_a.TSIED == 0 ||
                      self.newprints.Method_a.TSIED == 1
                    ) {
                      self.newprints.newJcjg = Boolean(
                        self.newprints.Method_a.TSIED
                      );
                    } else if (data.VDCT == 0 || data.VDCT == 1) {
                      self.newprints.newJcjg = Boolean(data.VDCT);
                    }
                  }
                  self.newprints.eacl_s =
                    ((self.newprints.Method_a.EACLD &&
                      self.saveNumber(self.newprints.Method_a.EACLD, 2)) ||
                      "0.95") +
                    " ～ " +
                    ((self.newprints.Method_a.EACLU &&
                      self.saveNumber(self.newprints.Method_a.EACLU, 2)) ||
                      "1.05");

                  break;
                case "B":
                  self.QY_CY = true;
                  if (res.MethodDataInfo[0]) {
                    self.newprints.Method_b = res.MethodDataInfo[0];
                    if (
                      self.newprints.Method_b.ASMED == 0 ||
                      self.newprints.Method_b.ASMED == 1
                    ) {
                      self.newprints.newJcjg = Boolean(
                        self.newprints.Method_b.ASMED
                      );
                    } else if (data.VDCT == 0 || data.VDCT == 1) {
                      self.newprints.newJcjg = Boolean(data.VDCT);
                    }
                  }
                  break;
                case "C":
                  self.QY_CY = true;
                  if (res.MethodDataInfo[0]) {
                    self.newprints.Method_c = res.MethodDataInfo[0];
                    if (
                      self.newprints.Method_c.IMED == 0 ||
                      self.newprints.Method_c.IMED == 1
                    ) {
                      self.newprints.newJcjg = Boolean(
                        self.newprints.Method_c.IMED
                      );
                    } else if (data.VDCT == 0 || data.VDCT == 1) {
                      self.newprints.newJcjg = Boolean(data.VDCT);
                    }
                  }

                  break;
                case "G":
                  self.QY_CY = false;
                  if (res.MethodDataInfo[0])
                    self.newprints.Method_g = res.MethodDataInfo[0];
                  self.newprints.ldRateSpeed =
                    self.newprints.InsDataInfo.EngineRatedSpeed == null
                      ? "-"
                      : self.saveNumber(
                          self.newprints.InsDataInfo.EngineRatedSpeed,
                          2
                        );
                  if (self.isLDUseVelMaxHP) {
                    self.newprints.ldRealRateSpeed =
                      self.newprints.Method_g.VelMaxHP == null
                        ? self.newprints.Method_g.RotateSpeed == null
                          ? "-"
                          : self.saveNumber(
                              self.newprints.Method_g.RotateSpeed,
                              2
                            )
                        : self.saveNumber(self.newprints.Method_g.VelMaxHP, 2);
                  } else {
                    self.newprints.ldRealRateSpeed =
                      self.newprints.Method_g.VelMaxEnginePower == null
                        ? self.newprints.Method_g.RotateSpeed == null
                          ? "-"
                          : self.saveNumber(
                              self.newprints.Method_g.RotateSpeed,
                              2
                            )
                        : self.saveNumber(
                            self.newprints.Method_g.VelMaxEnginePower,
                            2
                          );
                  }

                  break;
                case "F":
                  self.QY_CY = false;
                  if (res.MethodDataInfo[0])
                    self.newprints.Method_f = res.MethodDataInfo[0];

                  //实测转速
                  self.newprints.spRealRateSpeed =
                    self.newprints.Method_f.ActualRotateSpeed == null
                      ? self.newprints.Method_f.RotateSpeed == null
                        ? "-"
                        : self.saveNumber(
                            self.newprints.Method_f.RotateSpeed,
                            2
                          )
                      : self.saveNumber(
                          self.newprints.Method_f.ActualRotateSpeed,
                          2
                        );

                  //额定转速
                  self.newprints.spRateSpeed =
                    self.newprints.InsDataInfo.EngineRatedSpeed == null
                      ? "-"
                      : self.saveNumber(
                          self.newprints.InsDataInfo.EngineRatedSpeed,
                          2
                        );
                  break;
                case "J":
                  self.QY_CY = false;
                  if (res.MethodDataInfo[0])
                    self.newprints.Method_j = res.MethodDataInfo[0];
                  break;
                default:
                  break;
              }
            }

            //  }
            self.loadDevice(res.StationDeviceInfo, data.IUTYPE);
            self.AppearanceInfoList(res.Appearan[0]);
            if (this.newprints.InsDataInfo.FuelType == "A") {
              self.AppearanceInfoList(res.Appearan[0]);
            } else if (this.newprints.InsDataInfo.FuelType == "B") {
              self.AppearanceInfoList_CY(res.Appearan[0]);
            }
            if (res.OBDInfo.length > 0) {
              self.FaultIndicator(res.OBDInfo[0].FaultIndicator);
              self.IsCommunicated(
                res.OBDInfo[0].IsCommunicated,
                res.OBDInfo[0].CommFailReason
              ); //
              self.IsHaveFaultCode(
                res.OBDInfo[0].IsHaveFaultCode,
                res.OBDInfo[0].FaultInfo
              );
              self.ProjectSelected(
                res.OBDInfo[0].UnDoneReadyStatus,
                res.OBDInfo[0].UnFinifishedItem
              ); //
              self.OBDResults(res.OBDInfo[0].OBDInspectResult);
            } else {
              self.OBDResults();
            }
            if (res.FuelEvaporationInfo.length > 0) {
              res.FuelEvaporationInfo[0] = Object.assign(
                res.FuelEvaporationInfo[0],
                {
                  CheckPerson: this.newprints.wgj.CheckPerson,
                  InspectionReportNo: this.newprints.InsDataInfo
                    .InspectionReportNo
                }
              );
              this.FuelEvaporationInfo = res.FuelEvaporationInfo;
              if (res.FuelEvaporationInfo[0].OilFillerTestResult == 1)
                self.newprints.jyhg = true;
              else self.newprints.jybhg = true;
              if (res.FuelEvaporationInfo[0].FueltankCoverTestResult == 1)
                self.newprints.yxhg = true;
              else self.newprints.yxbhg = true;
              if (res.FuelEvaporationInfo[0].FuelEvaporationResult)
                self.newprints.ryhg = true;
              else self.newprints.rybhg = true;
              self.newprints.ryjcy = res.FuelEvaporationInfo[0].Checker;
            }
          }
          // this.showResult(data.VDCT, data.IUTYPE);
          this.showResult(data);
        });
    },
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
                            `
        });

        return;
      }
      if (LODOP.CVERSION < "3.0.0.0") {
        this.$Modal.warning({
          // title: title,
          content: ` 
                            Web打印服务CLodop需升级!点击这里<a href='http://www.c-lodop.com/download.html' target='_black'>执行升级</a>,升级后请刷新页面。
                            `
        });
        return;
      }
      let self = this;
      let params = {
        useName: self.$store.state.core.user.username,
        InspectionDataID: self.newprints.InsDataInfo.InspectionDataID
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
      LODOP.ADD_PRINT_TEXT("280mm", "80mm", 100, 20, "第1页/共2页");
      LODOP.NewPage();
      LODOP.ADD_PRINT_HTM(
        20,
        0,
        "207mm",
        "297mm",
        "<!DOCTYPE html>" +
          this.trBodyStyle +
          "<body>" +
          this.$refs.prints_twe.innerHTML +
          "</body>"
      );
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 30);
      LODOP.ADD_PRINT_TEXT("280mm", "80mm", 100, 20, "第2页/共2页"); //普通文本项，只在第一页输出
      LODOP.SET_PRINT_MODE("PRINT_DUPLEX", 1); //设置打印模式
      LODOP.PREVIEW();
      this.$curl
        .post("api/hj/AddChangeLog", {
          params: params
        })
        .then(res => {});
    },
    //过滤得检定日期
    getAnalyzerDate(date) {
      let resDate = "";
      if (date) {
        let year = Number(formatDates(date, "yyyy"));
        let n = 365 - 1;
        if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) n = 366 - 1;
        resDate = new Date(new Date(date).getTime() - n * 24 * 60 * 60 * 1000);
      }
      return formatDates(resDate, "yyyy-MM-dd");
    },

    //检测设备
    loadDevice(jsonData, IUTYPE) {
      var type = 0;
      let data = {};

      for (var i in jsonData) {
        if (IUTYPE.indexOf("A") !== -1) {
          if (jsonData[i].StationDeviceType == "02") {
            data.AnalyzerProduction = jsonData[i].DeviceMANU;
            data.AnalyzerName = jsonData[i].Name;
            data.AnalyzerDate = this.getAnalyzerDate(
              jsonData[i].CalValidityPeriod
            );
          }
        }
        if (IUTYPE.indexOf("B") !== -1) {
          if (jsonData[i].StationDeviceType == "01") {
            data.ChassisProduction = jsonData[i].DeviceMANU;
            data.ChassisType = jsonData[i].Type;
          } else if (jsonData[i].StationDeviceType == "02") {
            data.AnalyzerProduction = jsonData[i].DeviceMANU;
            data.AnalyzerName = jsonData[i].Name;
            // data.AnalyzerDate = formatDates(
            //   jsonData[i].CalValidityPeriod,
            //   "yyyy-MM-dd"
            // );
            data.AnalyzerDate = this.getAnalyzerDate(
              jsonData[i].CalValidityPeriod
            );
          }
        }
        if (IUTYPE.indexOf("C") !== -1) {
          if (jsonData[i].StationDeviceType == "01") {
            data.ChassisProduction = jsonData[i].DeviceMANU;
            data.ChassisType = jsonData[i].Type;
          } else if (jsonData[i].StationDeviceType == "02") {
            data.AnalyzerProduction = jsonData[i].DeviceMANU;
            data.AnalyzerName = jsonData[i].Name;
            data.AnalyzerDate = this.getAnalyzerDate(
              jsonData[i].CalValidityPeriod
            );
          }
        }
        if (IUTYPE.indexOf("G") !== -1) {
          if (jsonData[i].StationDeviceType == "01") {
            data.ChassisProduction = jsonData[i].DeviceMANU;
            data.ChassisType = jsonData[i].Type;
          } else if (
            jsonData[i].StationDeviceType == "04" ||
            jsonData[i].StationDeviceType == "02" ||
            jsonData[i].StationDeviceType == "06"
          ) {
            data.AnalyzerProduction = jsonData[i].DeviceMANU;
            data.AnalyzerName = jsonData[i].Name;
            data.AnalyzerDate = this.getAnalyzerDate(
              jsonData[i].CalValidityPeriod
            );
          }
        }
        if (IUTYPE.indexOf("F") !== -1) {
          if (jsonData[i].StationDeviceType == "04") {
            data.AnalyzerProduction = jsonData[i].DeviceMANU;
            data.AnalyzerName = jsonData[i].Name;
            data.AnalyzerDate = this.getAnalyzerDate(
              jsonData[i].CalValidityPeriod
            );

            type = 1;
          } else {
            if (type == 1) continue;
            data.AnalyzerProduction = jsonData[i].DeviceMANU;
            data.AnalyzerName = jsonData[i].Name;
            data.AnalyzerDate = this.getAnalyzerDate(
              jsonData[i].CalValidityPeriod
            );
          }
        }
      }
      this.newprints.jcsb = data;
    },
    //外观检
    AppearanceInfoList(rest) {
      if (rest) {
        let data = {};
        if (rest.VehicleMechanicalCondition == "是") {
          data.IsCondition1 = "✓";
        } else if (rest.VehicleMechanicalCondition == "否") {
          data.IsCondition2 = "✓";
        }

        if (rest.ExhaustPollutionDevice == "是") {
          data.IsControl1 = "✓";
        } else if (rest.ExhaustPollutionDevice == "否") {
          data.IsControl2 = "✓";
        }
        if (rest.BurningOilAndSmoke == "是") {
          data.IsBurningOilAndSmoke1 = "✓";
        } else if (rest.BurningOilAndSmoke == "否") {
          data.IsBurningOilAndSmoke2 = "✓";
        }

        if (rest.VehicleMeter == "是") {
          data.IsMeter1 = "✓";
        } else if (rest.VehicleMeter == "否") {
          data.IsMeter2 = "✓";
        }

        if (rest.CrankcaseVentSystem == "是") {
          data.IsCrankcaseVentSystem1 = "✓";
        } else if (rest.CrankcaseVentSystem == "否") {
          data.IsCrankcaseVentSystem2 = "✓";
        }
        if (rest.EVAP == "是") {
          data.IsEVAP1 = "✓";
        } else if (rest.EVAP == "否") {
          data.IsEVAP2 = "✓";
        }

        if (rest.MechanicalFault == "是") {
          data.IsMechanical1 = "✓";
        } else if (rest.MechanicalFault == "否") {
          data.IsMechanical2 = "✓";
        }

        if (rest.InOrOutputSystemLeaking == "是") {
          data.IsMechanicalFault1 = "✓";
        } else if (rest.InOrOutputSystemLeaking == "否") {
          data.IsMechanicalFault2 = "✓";
        }

        if (rest.LiquidLeakage == "是") {
          data.IsLiquidLeakage1 = "✓";
        } else if (rest.LiquidLeakage == "否") {
          data.IsLiquidLeakage2 = "✓";
        }

        if (rest.IsHaveOBD == "是") {
          data.IsIsHaveOBD1 = "✓";
        } else if (rest.IsHaveOBD == "否") {
          data.IsIsHaveOBD2 = "✓";
        }

        if (rest.TirePressure == "是") {
          data.IsTirePressure1 = "✓";
        } else if (rest.TirePressure == "否") {
          data.IsTirePressure2 = "✓";
        }

        if (rest.IsTireClear == "是") {
          data.IsIsTireClear1 = "✓";
        } else if (rest.IsTireClear == "否") {
          data.IsIsTireClear2 = "✓";
        }

        if (rest.CloseAirAirHeater == "是") {
          data.IsCloseAirAirHeater1 = "✓";
        } else if (rest.CloseAirAirHeater == "否") {
          data.IsCloseAirAirHeater2 = "✓";
        }

        if (rest.InterruptInfluenceFunction == "是") {
          data.IsInterruptInfluenceFunction1 = "✓";
        } else if (rest.InterruptInfluenceFunction == "否") {
          data.IsInterruptInfluenceFunction2 = "✓";
        }

        if (rest.VehicleFuelTank == "是") {
          data.IsVehicleFuelTank1 = "✓";
        } else if (rest.VehicleFuelTank == "否") {
          data.IsVehicleFuelTank2 = "✓";
        }

        if (rest.IsSuitGKInspect == "是") {
          data.IsSuitGKInspect1 = "✓";
        } else if (rest.IsSuitGKInspect == "否") {
          data.IsSuitGKInspect2 = "✓";
        }

        if (rest.AppearanceResult == 1) {
          data.IsAppearanceResult1 = true;
        } else if (rest.AppearanceResult == 0) {
          data.IsAppearanceResult2 = true;
        }
        data.CheckPerson = rest.CheckPerson;
        this.newprints.wgj = data;
      }

      //this.newprints.wgj.IsAppearanceResult1=true;
      // this.newprints.wgj.IsAppearanceResult2=true;
    },
    AppearanceInfoList_CY(rest) {
      if (rest) {
        let data = {};
        if (rest.VehicleMechanicalCondition == "是") {
          data.IsCondition1 = "✓";
        } else if (rest.VehicleMechanicalCondition == "否") {
          data.IsCondition2 = "✓";
        }

        if (rest.ExhaustPollutionDevice == "是") {
          data.IsControl1 = "✓";
        } else if (rest.ExhaustPollutionDevice == "否") {
          data.IsControl2 = "✓";
        }

        if (rest.EngineSystemECP == "是") {
          data.IsEnginefuel1 = "✓";
        } else if (rest.EngineSystemECP == "否") {
          data.IsEnginefuel2 = "✓";
        }

        if (rest.VehicleMeter == "是") {
          data.IsMeter1 = "✓";
        } else if (rest.VehicleMeter == "否") {
          data.IsMeter2 = "✓";
        }

        if (rest.BurningOilAndSmoke == "是") {
          data.IsBurningOilAndSmoke1 = "✓";
        } else if (rest.BurningOilAndSmoke == "否") {
          data.IsBurningOilAndSmoke2 = "✓";
        }

        if (rest.MechanicalFault == "是") {
          data.IsMechanical1 = "✓";
        } else if (rest.MechanicalFault == "否") {
          data.IsMechanical2 = "✓";
        }
        if (rest.InOrOutputSystemLeaking == "是") {
          data.IsMechanicalFault1 = "✓";
        } else if (rest.InOrOutputSystemLeaking == "否") {
          data.IsMechanicalFault2 = "✓";
        }

        if (rest.LiquidLeakage == "是") {
          data.IsLiquidLeakage1 = "✓";
        } else if (rest.LiquidLeakage == "否") {
          data.IsLiquidLeakage2 = "✓";
        }

        if (rest.IsHaveOBD == "是") {
          data.IsIsHaveOBD1 = "✓";
        } else if (rest.IsHaveOBD == "否") {
          data.IsIsHaveOBD2 = "✓";
        }

        if (rest.TirePressure == "是") {
          data.IsTirePressure1 = "✓";
        } else if (rest.TirePressure == "否") {
          data.IsTirePressure2 = "✓";
        }

        if (rest.IsTireClear == "是") {
          data.IsIsTireClear1 = "✓";
        } else if (rest.IsTireClear == "否") {
          data.IsIsTireClear2 = "✓";
        }

        if (rest.CloseAirAirHeater == "是") {
          data.IsCloseAirAirHeater1 = "✓";
        } else if (rest.CloseAirAirHeater == "否") {
          data.IsCloseAirAirHeater2 = "✓";
        }

        if (rest.InterruptInfluenceFunction == "是") {
          data.IsInterruptInfluenceFunction1 = "✓";
        } else if (rest.InterruptInfluenceFunction == "否") {
          data.IsInterruptInfluenceFunction2 = "✓";
        }

        if (rest.VehicleFuelTank == "是") {
          data.IsVehicleFuelTank1 = "✓";
        } else if (rest.VehicleFuelTank == "否") {
          data.IsVehicleFuelTank2 = "✓";
        }

        if (rest.IsSuitGKInspect == "是") {
          data.IsSuitGKInspect1 = "✓";
        } else if (rest.IsSuitGKInspect == "否") {
          data.IsSuitGKInspect2 = "✓";
        }
        if (rest.AppearanceResult == 1) {
          data.IsAppearanceResult1 = true;
        } else if (rest.AppearanceResult == 0) {
          data.IsAppearanceResult2 = true;
        }
        data.CheckPerson = rest.CheckPerson;
        this.newprints.wgj = data;
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

    //勾选各项检测的结果
    showResult(data) {
      if (data.VDCT == 1) {
        this.newprints.jchg = true;
      } else {
        this.newprints.jcbhg = true;
      }
      let typeList = data.IUTYPE.split(",");
      if (typeList.length > 1) {
        typeList.forEach(item => {
          switch (item) {
            case "F":
              this.newprints.zyjs = true;
              break;
            case "G":
              this.newprints.jzjs = true;
              break;
            case "J":
              this.newprints.hgl = true;
              break;
            case "A":
              this.newprints.sds = true;
              break;
            case "B":
              this.newprints.wt = true;
              break;
            case "C":
              this.newprints.jyst = true;
              break;
          }
        });
      } else {
        if (data.IUTYPE == "F") {
          this.newprints.zyjs = true;
        } else if (data.IUTYPE == "G") {
          this.newprints.jzjs = true;
        } else if (data.IUTYPE == "J") {
          this.newprints.hgl = true;
        } else if (data.IUTYPE == "A") {
          this.newprints.sds = true;
        } else if (data.IUTYPE == "B") {
          this.newprints.wt = true;
        } else if (data.IUTYPE == "C") {
          this.newprints.jyst = true;
        }
      }
    },
    returncodenames(namelist, codevalue) {
      if (namelist) {
        let CodeName = "";
        namelist.forEach(item => {
          if (item.CodeValue == codevalue) CodeName = item.CodeName;
        });
        return CodeName;
      }
    },
    returnMethodnames(namelist, codevalue) {
      if (namelist) {
        let CodeName = "";
        if (codevalue) {
          let arr = codevalue.split(",");
          if (arr.length > 1) {
            let typeList = [];
            arr.forEach(item => {
              let index = namelist.findIndex(aitem => item == aitem.CodeValue);
              if (index != -1) {
                typeList.push(namelist[index].CodeName);
              }
            });
            CodeName = typeList.join(",");
          } else {
            namelist.forEach(item => {
              if (item.CodeValue == codevalue) CodeName = item.CodeName;
            });
          }
        }
        return CodeName;
      }
    },
    returnMultiple(namelist, codevalue) {
      if (codevalue) {
        let arrs = String(codevalue).split("");
        if (namelist) {
          let CodeName = [];
          namelist.forEach(item => {
            arrs.forEach(aitem => {
              if (item.CodeValue == aitem) CodeName.push(item.CodeName);
            });
          });
          return CodeName.join(",");
        }
      }
    },
    getReportTitle() {
      this.$curl
        .get("api/hj/getSysConfig", {
          params: {
            FieldKey: ["InspectionReportTitle"]
          }
        })
        .then(res => {
          if (res.state && res.data) this.reportTitle = res.data[0].FieldValue;
        });
    }
  },
  watch: {
    giveReport(curVal, oldVal) {
      if (
        curVal &&
        curVal.InspectionNum &&
        curVal.InspectionNum !== oldVal.InspectionNum
      ) {
        this.giveReport = curVal;
        this.printaction();
      }
    }
  }
};
</script>
<style scoped>
td {
  border: 1px solid #000000;
  text-align: left;
  margin: 0px;
  padding: 3px;
  font-family: 宋体;
  font-size: 9pt;
  /*height:3mm;
    line-height:3mm;*/
}

/* tr {
  line-height: 3mm;
} */

.myTable {
  border-collapse: collapse;
}

.myTd {
  border: #000 1px solid;
  text-align: center;
}

.tdText {
  text-align: center;
}

.myFld-title {
  /*border-bottom: 0px solid #C0C0C0;*/
  text-align: left;
  vertical-align: middle;
  /*background-color: blueviolet;*/
  /*color: white;*/
  margin: 2px;
  padding: 4px 5px 4px 5px;
}

.mySpan-fld {
  /*border-style: solid;
        border-width: 0px 0px 1px 0px;
        border-color: #6694cf;*/
  text-align: left;
  vertical-align: bottom;
  margin: 2px 5px 0px 0px;
  padding: 2px 5px 2px 5px;
  width: 100%;
  /*text-decoration:underline;*/
  display: -moz-inline-box;
  display: inline-block; /* 使span支持设置宽度*/
  /*min-width: 3cm;*/
}

.nc-info p {
  margin: 0;
  padding: 2px 0;
  font-size: 7pt;
}

.report-info {
  display: inline-block;
  padding: 1px 5px;
}

.report-info span {
  font-family: 宋体;
  font-size: 9pt;
}
</style>
