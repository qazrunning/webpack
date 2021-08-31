<template>
  <div>
    <Card :padding="0" class="card_main">
      <div slot="title" style="font-size: 14px;font-weight: 700;">
        设备检查信息
      </div>
      <div class="condition">
        <Select v-model="selectTable" style="width:300px;margin-right:10px;" @on-select="selectTableName">
          <Option v-for="item in searchList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <DatePicker type="date" v-model="selectDate" placeholder="日期" style="width: 200px;" @on-change="Data_Process" filterable></DatePicker>
      </div>
      <Table :columns="columns" :data="tableData" height="530" :loading="tableLoading">
      </Table>
    </Card>
  </div>
</template>

<script>
export default {
  props: {
    //标题名称
    StationCode: {
      type: String,
      default: "0",
    },
    activeStep: {
      type: Number,
      default: 0,
    },
    curIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      selectDate: '',
      columns: [],
      tableData: [],
      isCur: false,
      searchList: [
        { value: "DeviceCheckQYHX", label: "汽油车底盘测功机滑行检查记录" },
        { value: "DeviceCheckQYFJSS", label: "汽油车底盘测功机附加损失测试记录" },
        { value: "DeviceCheckCYHX", label: "柴油车底盘测功机滑行检查记录" },
        { value: "DeviceCheckCYFJSS", label: "柴油车底盘测功机附加功率损失测试记录" },
        { value: "DeviceCheckDDDBQ", label: "单点检查(低标气)记录" },
        { value: "DeviceCheckDDGBQ", label: "单点检查(高标气)记录" },
        { value: "DeviceCheckDDLQ", label: "单点检查(零气)记录" },
        { value: "DeviceCheckFXYWD", label: "分析仪五点检查记录" },
        { value: "DeviceCheckGC", label: "设备检查过程记录" },
        { value: "DeviceCheckWXBY", label: "设备维修保养记录" },
        { value: "DeviceCheckXL", label: "泄漏检查记录" },
        { value: "DeviceCheckYDJ", label: "烟度计检查记录" },
        { value: "EnvParamsensorData", label: "环境参数感应器校准记录" },
      ],
      selectTable: '',
      tableLoading: false,
      culomnsObj: {
        "DeviceCheckQYHX": [
          {
            title: "检测线编号",
            key: "SceneCode",
            align: "center",
            width: 80
          },
          {
            title: "滑行检查开始时间",
            key: "SlideTimeStart",
            align: "center",
            width: 170
          },
          {
            title: "基本惯量(kg)",
            key: "DIW",
            align: "center",
            width: 100
          },
          {
            title: "IHP2540设置功率(kW)",
            key: "IHP2540",
            align: "center",
            width: 100
          },
          {
            title: "40km/h时的附加损失功率(kW)",
            key: "PLHP40",
            align: "center",
            width: 120
          },
          {
            title: "50-30km/h滑行",
            align: "center",
            children: [
              {
                title: "实际时间",
                key: "ACDT40",
                align: "center",
                width: 100
              },
              {
                title: "名义时间",
                key: "CCDT40",
                align: "center",
                width: 100
              },
              {
                title: "检测结果",
                key: "SlideCheckJudge40",
                align: "center",
                width: 100,
                render: (h, params) => {
                  let name = params.row.SlideCheckJudge40 == '1' ? '合格' : '不合格';
                  return h("span", name);
                }
              }
            ],
          },
          {
            title: "IHP5025设置功率(kW)",
            key: "IHP5025",
            align: "center",
            width: 100
          },
          {
            title: "25km/h时的附加损失功率(kW)",
            key: "PLHP25",
            align: "center",
            width: 120
          },
          {
            title: "35-15km/h滑行",
            align: "center",
            children: [
              {
                title: "实际时间",
                key: "ACDT25",
                align: "center",
                width: 100
              },
              {
                title: "名义时间",
                key: "CCDT25",
                align: "center",
                width: 100
              },
              {
                title: "检测结果",
                key: "SlideCheckJudge25",
                align: "center",
                width: 100,
                render: (h, params) => {
                  let name = params.row.SlideCheckJudge25 == '1' ? '合格' : '不合格';
                  return h("span", name);
                }
              }
            ],
          },
          {
            title: "检查判定结果",
            key: "CheckJudge",
            align: "center",
            fixed: "right",
            width: 120,
            render: (h, params) => {
              let name = params.row.CheckJudge == '1' ? '合格' : '不合格';
              return h("span", name);
            },
          },
          {
            title: "检查人员",
            key: "Checker",
            align: "center",
            fixed: "right",
            width: 100
          },
        ],
        "DeviceCheckQYFJSS": [
          {
            title: "检测线编号",
            key: "SceneCode",
            align: "center",
            width: 80
          },
          {
            title: "滑行检查开始时间",
            key: "SlideTimeStart",
            align: "center",
            width: 170
          },
          {
            title: "附加损失开始时间",
            key: "PLTimeStart",
            align: "center",
            width: 170
          },
          {
            title: "基本惯量(kg)",
            key: "DIW",
            align: "center",
            width: 100
          },
          {
            title: "40km/h时的附加损失功率(kW)",
            key: "PLHP40",
            align: "center",
            minWidth: 140
          },
          {
            title: "50-30km/h时的实际滑行时间(ms)",
            key: "ACDT40",
            align: "center",
            minWidth: 140
          },
          {
            title: "25km/h时的附加损失功率(kW)",
            key: "PLHP25",
            align: "center",
            minWidth: 140
          },
          {
            title: "35-15km/h时的实际滑行时间(ms)",
            key: "ACDT25",
            align: "center",
            minWidth: 140
          },
          {
            title: "检查判定结果",
            key: "CheckJudge",
            align: "center",
            fixed: "right",
            width: 120,
            render: (h, params) => {
              let name = params.row.CheckJudge == '1' ? '合格' : '不合格';
              return h("span", name);
            },
          },
          {
            title: "检查人员",
            key: "Checker",
            align: "center",
            fixed: "right",
            width: 100
          }
        ],
        "DeviceCheckCYHX": [
          {
            title: "检测线编号",
            key: "SceneCode",
            align: "center",
            width: 80
          },
          {
            title: "滑行检查开始时间",
            key: "SlideTimeStart",
            align: "center",
            width: 170
          },
          {
            title: "基本惯量(kg)",
            key: "DIW",
            align: "center",
            width: 100
          },
          {
            title: "IHP30kw 实际滑行时间(ms)",
            align: "center",
            children: [
              {
                title: "100-80km/h",
                key: "IHP30ACDT90",
                align: "center",
                width: 120,
              },
              {
                title: "90-70km/h",
                key: "IHP30ACDT80",
                align: "center",
                width: 120,
              },
              {
                title: "80-60km/h",
                key: "IHP30ACDT70",
                align: "center",
                width: 120,
              },
              {
                title: "70-50km/h",
                key: "IHP30ACDT60",
                align: "center",
                width: 120,
              },
              {
                title: "60-40km/h",
                key: "IHP30ACDT50",
                align: "center",
                width: 120,
              },
              {
                title: "50-30km/h",
                key: "IHP30ACDT40",
                align: "center",
                width: 120,
              },
              {
                title: "40-20km/h",
                key: "IHP30ACDT30",
                align: "center",
                width: 120,
              },
              {
                title: "30-10km/h",
                key: "IHP30ACDT20",
                align: "center",
                width: 120,
              }
            ]
          },
          {
            title: "IHP20kw 实际滑行时间(ms)",
            align: "center",
            children: [
              {
                title: "100-80km/h",
                key: "IHP20ACDT90",
                align: "center",
                width: 120,
              },
              {
                title: "90-70km/h",
                key: "IHP20ACDT80",
                align: "center",
                width: 120,
              },
              {
                title: "80-60km/h",
                key: "IHP20ACDT70",
                align: "center",
                width: 120,
              },
              {
                title: "70-50km/h",
                key: "IHP20ACDT60",
                align: "center",
                width: 120,
              },
              {
                title: "60-40km/h",
                key: "IHP20ACDT50",
                align: "center",
                width: 120,
              },
              {
                title: "50-30km/h",
                key: "IHP20ACDT40",
                align: "center",
                width: 120,
              },
              {
                title: "40-20km/h",
                key: "IHP20ACDT30",
                align: "center",
                width: 120,
              },
              {
                title: "30-10km/h",
                key: "IHP20ACDT20",
                align: "center",
                width: 120,
              }
            ]
          },
          {
            title: "IHP10kw 实际滑行时间(ms)",
            align: "center",
            children: [
              {
                title: "100-80km/h",
                key: "IHP10ACDT90",
                align: "center",
                width: 120,
              },
              {
                title: "90-70km/h",
                key: "IHP10ACDT80",
                align: "center",
                width: 120,
              },
              {
                title: "80-60km/h",
                key: "IHP10ACDT70",
                align: "center",
                width: 120,
              },
              {
                title: "70-50km/h",
                key: "IHP10ACDT60",
                align: "center",
                width: 120,
              },
              {
                title: "60-40km/h",
                key: "IHP10ACDT50",
                align: "center",
                width: 120,
              },
              {
                title: "50-30km/h",
                key: "IHP10ACDT40",
                align: "center",
                width: 120,
              },
              {
                title: "40-20km/h",
                key: "IHP10ACDT30",
                align: "center",
                width: 120,
              },
              {
                title: "30-10km/h",
                key: "IHP10ACDT20",
                align: "center",
                width: 120,
              }
            ]
          },
          {
            title: "附加损失功率(kW)",
            align: "center",
            children: [
              {
                title: "90km/h",
                key: "PLHP90",
                align: "center",
                width: 100,
              },
              {
                title: "80km/h",
                key: "PLHP80",
                align: "center",
                width: 100,
              },
              {
                title: "70km/h",
                key: "PLHP70",
                align: "center",
                width: 100,
              },
              {
                title: "60km/h",
                key: "PLHP60",
                align: "center",
                width: 100,
              },
              {
                title: "50km/h",
                key: "PLHP50",
                align: "center",
                width: 100,
              },
              {
                title: "40km/h",
                key: "PLHP40",
                align: "center",
                width: 100,
              },
              {
                title: "30km/h",
                key: "PLHP30",align: "center",
                width: 100,
              },
              {
                title: "20km/h",
                key: "PLHP20",
                align: "center",
                width: 100,
              }
            ]
          },
          {
            title: "滑行检查结果",
            align: "center",
            children: [
              {
                title: "100-10km/h",
                key: "SlideCheckJudge100",
                align: "center",
                width: 120,
                render: (h, params) => {
                  let name = params.row.SlideCheckJudge100 == '1' ? '合格' : '不合格';
                  return h("span", name);
                }
              },
              {
                title: "80-10km/h",
                key: "SlideCheckJudge80",
                align: "center",
                width: 120,
                render: (h, params) => {
                  let name = params.row.SlideCheckJudge80 == '1' ? '合格' : '不合格';
                  return h("span", name);
                }
              }
            ]
          },
          {
            title: "检查判定结果",
            key: "CheckJudge",
            align: "center",
            fixed: "right",
            width: 120,
            render: (h, params) => {
              let name = params.row.CheckJudge == '1' ? '合格' : '不合格';
              return h("span", name);
            },
          },
          {
            title: "检查人员",
            key: "Checker",
            align: "center",
            fixed: "right",
            width: 100
          }
        ],
        "DeviceCheckCYFJSS": [
          {
            title: "检测线编号",
            key: "SceneCode",
            align: "center",
            width: 80
          },
          {
            title: "滑行检查开始时间",
            key: "SlideTimeStart",
            align: "center",
            width: 170
          },
          {
            title: "附加损失开始时间",
            key: "PLTimeStart",
            align: "center",
            width: 170
          },
          {
            title: "基本惯量(kg)",
            key: "DIW",
            align: "center",
            width: 100
          },
          {
            title: "实际滑行时间(ms)",
            align: "center",
            children: [
              {
                title: "100-80km/h",
                key: "ACDT90",
                align: "center",
                width: 120,
              },
              {
                title: "90-70km/h",
                key: "ACDT80",
                align: "center",
                width: 120,
              },
              {
                title: "80-60km/h",
                key: "ACDT70",
                align: "center",
                width: 120,
              },
              {
                title: "70-50km/h",
                key: "ACDT60",
                align: "center",
                width: 120,
              },
              {
                title: "60-40km/h",
                key: "ACDT50",
                align: "center",
                width: 120,
              },
              {
                title: "50-30km/h",
                key: "ACDT40",
                align: "center",
                width: 120,
              },
              {
                title: "40-20km/h",
                key: "ACDT30",
                align: "center",
                width: 120,
              },
              {
                title: "30-10km/h",
                key: "ACDT20",
                align: "center",
                width: 120,
              }
            ]
          },
          {
            title: "附加损失功率(kW)",
            align: "center",
            children: [
              {
                title: "90km/h",
                key: "PLHP90",
                align: "center",
                width: 100,
              },
              {
                title: "80km/h",
                key: "PLHP80",
                align: "center",
                width: 100,
              },
              {
                title: "70km/h",
                key: "PLHP70",
                align: "center",
                width: 100,
              },
              {
                title: "60km/h",
                key: "PLHP60",
                align: "center",
                width: 100,
              },
              {
                title: "50km/h",
                key: "PLHP50",
                align: "center",
                width: 100,
              },
              {
                title: "40km/h",
                key: "PLHP40",
                align: "center",
                width: 100,
              },
              {
                title: "30km/h",
                key: "PLHP30",align: "center",
                width: 100,
              },
              {
                title: "20km/h",
                key: "PLHP20",
                align: "center",
                width: 100,
              }
            ]
          },
          {
            title: "检查结果",
            key: "CheckJudge",
            align: "center",
            fixed: "right",
            width: 100,
            render: (h, params) => {
              let name = params.row.CheckJudge == '1' ? '合格' : '不合格';
              return h("span", name);
            }
          },
          {
            title: "检查人员",
            key: "Checker",
            align: "center",
            fixed: "right",
            width: 100
          }
        ],
        "DeviceCheckDDDBQ": [
          {
            title: "检测线编号",
            key: "SceneCode",
            align: "center",
            width: 80
          },
          {
            title: "检查日期",
            key: "CheckDate",
            align: "center",
            width: 120,
            render: (h, params) => {
              let name = params.row.CheckDate.slice(0,10);
              return h("span", name);
            }
          },
          {
            title: "检查开始时间",
            key: "CheckTimeStart",
            align: "center",
            width: 170
          },
          {
            title: "检查结束时间",
            key: "CheckTimeEnd",
            align: "center",
            width: 170
          },
          {
            title: "类型",
            key: "CheckType",
            align: "center",
            width: 80
          },
          {
            title: "标准气浓度(%)",
            align: "center",
            children: [
              {
                title: "C3H8",
                key: "C3H8",
                align: "center",
                width: 80
              },
              {
                title: "CO",
                key: "CO",
                align: "center",
                width: 60
              },
              {
                title: "CO2",
                key: "CO2",
                align: "center",
                width: 80
              },
              {
                title: "NO",
                key: "NO",
                align: "center",
                width: 60
              },
              {
                title: "O2",
                key: "O2",
                align: "center",
                width: 60
              },
            ]
          },
          {
            title: "检查结果值(%)",
            align: "center",
            children: [
              {
                title: "HC",
                key: "HCER",
                align: "center",
                width: 80
              },
              {
                title: "CO",
                key: "COER",
                align: "center",
                width: 60
              },
              {
                title: "CO2",
                key: "CO2ER",
                align: "center",
                width: 80
              },
              {
                title: "NO",
                key: "NOER",
                align: "center",
                width: 60
              },
              {
                title: "O2",
                key: "O2ER",
                align: "center",
                width: 60
              },
            ]
          },
          {
            title: "NO2转化为NO的转化效率(%)",
            key: "NO2ToNOInversionRate",
            align: "center",
            width: 130
          },
          {
            title: "REF值",
            key: "PEF",
            align: "center",
            width: 80
          },
          {
            title: "检查结果",
            key: "CheckJudge",
            align: "center",
            fixed: "right",
            width: 100,
            render: (h, params) => {
              let name = params.row.CheckJudge == '1' ? '合格' : '不合格';
              return h("span", name);
            }
          },
          {
            title: "检查人员",
            key: "Checker",
            align: "center",
            fixed: "right",
            width: 100
          }
        ],
        "DeviceCheckDDGBQ": [
          {
            title: "检测线编号",
            key: "SceneCode",
            align: "center",
            width: 80
          },
          {
            title: "检查日期",
            key: "CheckDate",
            align: "center",
            width: 120,
            render: (h, params) => {
              let name = params.row.CheckDate.slice(0,10);
              return h("span", name);
            }
          },
          {
            title: "检查开始时间",
            key: "CheckTimeStart",
            align: "center",
            width: 170
          },
          {
            title: "检查结束时间",
            key: "CheckTimeEnd",
            align: "center",
            width: 170
          },
          {
            title: "类型",
            key: "CheckType",
            align: "center",
            width: 80
          },
          {
            title: "标准气浓度(%)",
            align: "center",
            children: [
              {
                title: "C3H8",
                key: "C3H8",
                align: "center",
                width: 80
              },
              {
                title: "CO",
                key: "CO",
                align: "center",
                width: 60
              },
              {
                title: "CO2",
                key: "CO2",
                align: "center",
                width: 80
              },
              {
                title: "NO",
                key: "NO",
                align: "center",
                width: 60
              },
              {
                title: "O2",
                key: "O2",
                align: "center",
                width: 60
              },
            ]
          },
          {
            title: "响应时间(T90)(s)",
            align: "center",
            children: [
              {
                title: "NO",
                key: "T90NO",
                align: "center",
                width: 80
              },
              {
                title: "CO",
                key: "T90CO",
                align: "center",
                width: 60
              },
              {
                title: "O2",
                key: "T90O2",
                align: "center",
                width: 80
              }
            ]
          },
          {
            title: "响应时间(T10)(s)",
            align: "center",
            children: [
              {
                title: "CO",
                key: "T10CO",
                align: "center",
                width: 80
              },
              {
                title: "O2",
                key: "T10O2",
                align: "center",
                width: 80
              }
            ]
          },
          {
            title: "检查结果",
            key: "CheckJudge",
            align: "center",
            fixed: "right",
            width: 100,
            render: (h, params) => {
              let name = params.row.CheckJudge == '1' ? '合格' : '不合格';
              return h("span", name);
            }
          },
          {
            title: "检查人员",
            key: "Checker",
            align: "center",
            fixed: "right",
            width: 100
          }
        ],
        "DeviceCheckDDLQ": [
          {
            title: "检测线编号",
            key: "SceneCode",
            align: "center",
            width: 80
          },
          {
            title: "检查日期",
            key: "CheckDate",
            align: "center",
            width: 120,
            render: (h, params) => {
              let name = params.row.CheckDate.slice(0,10);
              return h("span", name);
            }
          },
          {
            title: "检查开始时间",
            key: "CheckTimeStart",
            align: "center",
            width: 170
          },
          {
            title: "检查结束时间",
            key: "CheckTimeEnd",
            align: "center",
            width: 170
          },
          {
            title: "类型",
            key: "CheckType",
            align: "center",
            width: 80
          },
          {
            title: "标准气浓度(%)",
            align: "center",
            children: [
              {
                title: "C3H8",
                key: "C3H8",
                align: "center",
                width: 80
              },
              {
                title: "CO",
                key: "CO",
                align: "center",
                width: 60
              },
              {
                title: "CO2",
                key: "CO2",
                align: "center",
                width: 80
              },
              {
                title: "NO",
                key: "NO",
                align: "center",
                width: 60
              },
              {
                title: "O2",
                key: "O2",
                align: "center",
                width: 60
              },
            ]
          },
          {
            title: "检查结果值(%)",
            align: "center",
            children: [
              {
                title: "HC",
                key: "HCER",
                align: "center",
                width: 80
              },
              {
                title: "CO",
                key: "COER",
                align: "center",
                width: 60
              },
              {
                title: "CO2",
                key: "CO2ER",
                align: "center",
                width: 80
              },
              {
                title: "NO",
                key: "NOER",
                align: "center",
                width: 60
              },
              {
                title: "O2",
                key: "O2ER",
                align: "center",
                width: 60
              },
            ]
          },
          {
            title: "REF值",
            key: "PEF",
            align: "center",
            width: 80
          },
          {
            title: "检查结果",
            key: "CheckJudge",
            align: "center",
            fixed: "right",
            width: 100,
            render: (h, params) => {
              let name = params.row.CheckJudge == '1' ? '合格' : '不合格';
              return h("span", name);
            }
          },
          {
            title: "检查人员",
            key: "Checker",
            align: "center",
            fixed: "right",
            width: 100
          }
        ],
        "DeviceCheckFXYWD": [
          {
            title: "检测线编号",
            key: "SceneCode",
            align: "center",
            width: 80
          },
          {
            title: "检查日期",
            key: "CheckDate",
            align: "center",
            width: 120,
            render: (h, params) => {
              let name = params.row.CheckDate.slice(0,10);
              return h("span", name);
            }
          },
          {
            title: "检查开始时间",
            key: "CheckTimeStart",
            align: "center",
            width: 170
          },
          {
            title: "检查结束时间",
            key: "CheckTimeEnd",
            align: "center",
            width: 170
          },
          {
            title: "类型",
            key: "CheckType",
            align: "center",
            width: 80
          },
          {
            title: "标准气浓度(%)",
            align: "center",
            children: [
              {
                title: "C3H8",
                key: "C3H8",
                align: "center",
                width: 80
              },
              {
                title: "CO",
                key: "CO",
                align: "center",
                width: 60
              },
              {
                title: "CO2",
                key: "CO2",
                align: "center",
                width: 80
              },
              {
                title: "NO",
                key: "NO",
                align: "center",
                width: 60
              },
              {
                title: "O2",
                key: "O2",
                align: "center",
                width: 60
              },
            ]
          },
          {
            title: "检查结果值(%)",
            align: "center",
            children: [
              {
                title: "HC",
                key: "HCER",
                align: "center",
                width: 80
              },
              {
                title: "CO",
                key: "COER",
                align: "center",
                width: 60
              },
              {
                title: "CO2",
                key: "CO2ER",
                align: "center",
                width: 80
              },
              {
                title: "NO",
                key: "NOER",
                align: "center",
                width: 60
              },
              {
                title: "O2",
                key: "O2ER",
                align: "center",
                width: 60
              },
            ]
          },
          {
            title: "REF值",
            key: "PEF",
            align: "center",
            width: 80
          },
          {
            title: "检查结果",
            key: "CheckJudge",
            align: "center",
            fixed: "right",
            width: 100,
            render: (h, params) => {
              let name = params.row.CheckJudge == '1' ? '合格' : '不合格';
              return h("span", name);
            }
          },
          {
            title: "检查人员",
            key: "Checker",
            align: "center",
            fixed: "right",
            width: 100
          },
        ],
        "DeviceCheckGC": [
          {
            title: "检测线编号",
            key: "SceneCode",
            align: "center",
            minWidth: 110
          },
          {
            title: "检查日期",
            key: "CheckDate",
            align: "center",
            minWidth: 120,
            render: (h, params) => {
              let name = params.row.CheckDate.slice(0,10);
              return h("span", name);
            }
          },
          {
            title: "检查开始时间",
            key: "CheckTimeStart",
            align: "center",
            minWidth: 170
          },
          {
            title: "检查结束时间",
            key: "CheckTimeStart",
            align: "center",
            minWidth: 170
          },
          {
            title: "类型",
            key: "CheckType",
            align: "center",
            minWidth: 80
          },
          {
            title: "采样时序",
            key: "Second_NO",
            align: "center",
            minWidth: 100
          },
          {
            title: "转鼓转速(r/min)",
            key: "RotarySpeed",
            align: "center",
            minWidth: 140
          },
          {
            title: "测功机加载负荷(kW)",
            key: "PLHP",
            align: "center",
            minWidth: 140
          },
          {
            title: "HC浓度",
            key: "HC",
            align: "center",
            minWidth: 100
          },
          {
            title: "CO浓度",
            key: "CO",
            align: "center",
            minWidth: 100
          },
          {
            title: "NO浓度",
            key: "NO",
            align: "center",
            minWidth: 100
          },
          {
            title: "CO2浓度",
            key: "CO2",
            align: "center",
            minWidth: 100
          },
          {
            title: "O2浓度",
            key: "O2",
            align: "center",
            minWidth: 100
          },
        ],
        "DeviceCheckWXBY": [
          {
            title: "检测线编号",
            key: "SceneCode",
            align: "center",
            minWidth: 110
          },
          {
            title: "维修保养日期",
            key: "MaintenanceDate",
            align: "center",
            minWidth: 120
          },
          {
            title: "记录类型",
            key: "JLType",
            align: "center",
            minWidth: 100
          },
          {
            title: "维修原因",
            key: "MaintenanceCause",
            align: "center",
            minWidth: 120
          },
          {
            title: "更换或维修的部件",
            key: "PartChange",
            align: "center",
            minWidth: 120
          },
          {
            title: "操作人员",
            key: "Operator",
            align: "center",
            minWidth: 100
          }
        ],
        "DeviceCheckXL": [
          {
            title: "检测线编号",
            key: "SceneCode",
            align: "center",
            minWidth: 110
          },
          {
            title: "检查日期",
            key: "CheckDate",
            align: "center",
            minWidth: 100,
            render: (h, params) => {
              let name = params.row.CheckDate.slice(0,10);
              return h("span", name);
            }
          },
          {
            title: "检查开始时间",
            key: "CheckTimeStart",
            align: "center",
            minWidth: 120
          },
          {
            title: "检查结束时间",
            key: "CheckTimeStart",
            align: "center",
            minWidth: 120
          },
          {
            title: "检查结果",
            key: "CheckJudge",
            align: "center",
            minWidth: 100,
            render: (h, params) => {
              let name = params.row.CheckJudge == '1' ? '合格' : '不合格';
              return h("span", name);
            }
          },
          {
            title: "不合格说明",
            key: "BelowStandard",
            align: "center",
            minWidth: 120
          },
          {
            title: "检查人员",
            key: "Checker",
            align: "center",
            minWidth: 100
          },
        ],
        "DeviceCheckYDJ": [
          {
            title: "检测线编号",
            key: "SceneCode",
            align: "center",
            minWidth: 110
          },
          {
            title: "检查日期",
            key: "CheckDate",
            align: "center",
            minWidth: 100,
            render: (h, params) => {
              let name = params.row.CheckDate.slice(0,10);
              return h("span", name);
            }
          },
          {
            title: "检查开始时间",
            key: "CheckTimeStart",
            align: "center",
            minWidth: 120
          },
          {
            title: "检查结束时间",
            key: "CheckTimeStart",
            align: "center",
            minWidth: 120
          },
          {
            title: "光吸收系数差",
            key: "PLAC",
            align: "center",
            minWidth: 120
          },
          {
            title: "响应时间(ms)",
            key: "ResponseTime",
            align: "center",
            minWidth: 130
          },
          {
            title: "烟气温度示值误差(℃)",
            key: "TC",
            align: "center",
            minWidth: 160
          },
          {
            title: "检查结果",
            key: "CheckJudge",
            align: "center",
            minWidth: 100,
            render: (h, params) => {
              let name = params.row.CheckJudge == '1' ? '合格' : '不合格';
              return h("span", name);
            }
          },
          {
            title: "不合格说明",
            key: "BelowStandard",
            align: "center",
            minWidth: 120
          },
          {
            title: "检查人员",
            key: "Checker",
            align: "center",
            minWidth: 100
          },
        ],
        "EnvParamsensorData":[
            {
            title: "检测线编号",
            key: "SceneCode",
            align: "center",
            minWidth: 100
          },
                {
            title: "检测日期",
            key: "CheckDate",
            align: "center",
            minWidth: 100
          },
                {
            title: "检测开始时间",
            key: "CheckTimeStart",
            align: "center",
            minWidth: 110
          },
                {
            title: "检测结束时间",
            key: "CheckTimeEnd",
            align: "center",
            minWidth: 110
          },
                {
            title: "实际环境温度 ℃",
            key: "ActualTemperature",
            align: "center",
            minWidth: 100
          },
                {
            title: "测量环境温度数据 ℃",
            key: "Temperature",
            align: "center",
            minWidth: 100
          },
                {
            title: "实际环境相对湿度 %",
            key: "ActualHumidity",
            align: "center",
            minWidth: 100
          },
                {
            title: "测量环境相对湿度数据 %",
            key: "Humidity",
            align: "center",
            minWidth: 100
          },
                {
            title: "实际环境大气压力数据 kpa",
            key: "ActualAirpressure",
            align: "center",
            minWidth: 100
          },
                {
            title: "测量环境大气压力数据 kpa",
            key: "Airpressure",
            align: "center",
            minWidth: 100
          },
                {
            title: "检测结果",
            key: "CheckResult",
            align: "center",
            minWidth: 100
          },
                  {
            title: "备注",
            key: "Remark",
            align: "center",
            fixed:"right",
            minWidth: 100
          },
        ]
      }
    }
  },
  methods: {
    selectTableName(item){
      this.selectTable = item.value;
      this.Data_Process();
    },
    Data_Process() {
      if(!this.selectTable) {
        // this.$Message.warning('请选择自检查询内容!');
        return;
      }
      this.tableLoading = true;
      this.columns = this.culomnsObj[this.selectTable];
      let params = {
        selectTable: this.selectTable,
        StationCode: this.StationCode,
        selectDate: this.selectDate
      }
      this.$curl.get('api/hj/getSelfCheckData',{
        params: JSON.stringify(params)
      }).then(res => {
        if(res.code) {
          this.tableData = res.data.list;
        }
        this.tableLoading = false;
      })
    }
  },
  watch: {
    StationCode: {
      handler(newval, oldval) {
        if (!+newval || newval == oldval) return;
        // if (this.Permission == false) {
        //   this.columns_Cameras.pop();
        // }
        this.selectTable = '';
        this.columns = [];
        this.selectDate = '';
        if(this.activeStep != this.curIndex) {
          this.isCur = false;
          return;
        } 
        this.isCur = true;
        // this.Data_Process();
      },
      immediate: true,
    },
    activeStep: {
      handler(newVal, oldVal) {
        if (newVal == this.curIndex && !this.isCur) {
          this.isCur = true;
          this.Data_Process();
        }
      },
      deep: true
    }
  },
}
</script>
<style scoped>
.card_main /deep/ .ivu-card-head {
  padding: 12px 16px;
  height: 42px;
}
.card_main /deep/ .ivu-btn-ghost.ivu-btn-dashed,
.ivu-btn-ghost.ivu-btn-default {
  color: #747b8b;
  border-color: #e3e5e8;
}
.condition { 
  padding: 10px;
}
</style>