<template>
  <div>
    <div v-if="JSON.stringify(InspectData) != '{}'" style="overflow:auto">
      <div v-show="isShow.showTSI">
        <table border="1" class="table">
          <tr>
            <td colspan="6">双怠速</td>
          </tr>
          <tr>
            <td rowspan="2"></td>
            <td rowspan="2">过量空气系数（λ）</td>
            <td colspan="2">低怠速</td>
            <td colspan="2">高怠速</td>
          </tr>
          <tr>
            <td>CO/%</td>
            <td>HC/10-6</td>
            <td>CO/%</td>
            <td>HC/10-6</td>
          </tr>
          <tr>
            <td>实测值</td>
            <td>{{ dataTSI.EACR | numFilter }}</td>
            <td>{{ dataTSI.LICOR | numFilter }}</td>
            <td>{{ dataTSI.LIHCR | numFilter }}</td>
            <td>{{ dataTSI.HICOR | numFilter }}</td>
            <td>{{ dataTSI.HIHCR | numFilter }}</td>
          </tr>
          <tr>
            <td>限值</td>
            <td>
              {{
              ((dataTSI.EACLD && dataTSI.EACLD.toFixed(2)) || "0.95") +
              " ～ " +
              ((dataTSI.EACLU && dataTSI.EACLU.toFixed(2)) || "1.05")
              }}
            </td>
            <td>{{ dataTSI.LICOL | numFilter }}</td>
            <td>{{ dataTSI.LIHCL | numFilter }}</td>
            <td>{{ dataTSI.HICOL | numFilter }}</td>
            <td>{{ dataTSI.HIHCL | numFilter }}</td>
          </tr>
        </table>
      </div>

      <div v-show="isShow.showIM">
        <table border="1" class="table">
          <tr>
            <td colspan="6">简易瞬态工况法</td>
          </tr>
          <tr>
            <td></td>
            <td>HC/(g/km)</td>
            <td>CO/(g/km)</td>
            <td>NOX/(g/km)</td>
          </tr>
          <tr>
            <td>实测值</td>
            <td>{{ dataIM.HCER | numFilter }}</td>
            <td>{{ dataIM.COER | numFilter }}</td>
            <td>{{ dataIM.NOXER | numFilter }}</td>
          </tr>
          <tr>
            <td>限值</td>
            <td>{{ dataIM.HCEL | numFilter }}</td>
            <td>{{ dataIM.COEL | numFilter }}</td>
            <td>{{ dataIM.NOXEL | numFilter }}</td>
          </tr>
        </table>
      </div>

      <div v-show="isShow.showASM && dataASM">
        <table border="1" class="table">
          <tr>
            <td colspan="7">稳态工况法</td>
          </tr>
          <tr>
            <td></td>
            <td colspan="3">ASM5025</td>
            <td colspan="3">ASM2540</td>
          </tr>
          <tr>
            <td></td>
            <td>HC/10-6</td>
            <td>CO/%</td>
            <td>NO/10-6</td>
            <td>HC/10-6</td>
            <td>CO/%</td>
            <td>NO/10-6</td>
          </tr>
          <tr>
            <td>实测值</td>
            <td>{{ dataASM.HCER5025 | numFilter }}</td>
            <td>{{ dataASM.COER5025 | numFilter }}</td>
            <td>{{ dataASM.NOER5025 | numFilter }}</td>
            <td>{{ dataASM.HCER2540 | numFilter }}</td>
            <td>{{ dataASM.COER2540 | numFilter }}</td>
            <td>{{ dataASM.NOER2540 | numFilter }}</td>
          </tr>
          <tr>
            <td>限值</td>
            <td>{{ dataASM.HCEL5025 | numFilter }}</td>
            <td>{{ dataASM.COEL5025 | numFilter }}</td>
            <td>{{ dataASM.NOEL5025 | numFilter }}</td>
            <td>{{ dataASM.HCEL2540 | numFilter }}</td>
            <td>{{ dataASM.COEL2540 | numFilter }}</td>
            <td>{{ dataASM.NOEL2540 | numFilter }}</td>
          </tr>
        </table>
      </div>

      <div v-show="isShow.showLightProofSmoke">
        <table border="1" class="table">
          <tr>
            <td colspan="5">自由加速法</td>
          </tr>
          <tr>
            <td colspan="3">三次测量烟度值/m-1</td>
            <td rowspan="2">平均值/m-1</td>
            <td rowspan="2">限值/m-1</td>
          </tr>
          <tr>
            <td>1</td>
            <td>2</td>
            <td>3</td>
          </tr>
          <tr>
            <td>{{ dataLightProofSmoke.ER1 | numFilter }}</td>
            <td>{{ dataLightProofSmoke.ER2 | numFilter }}</td>
            <td>{{ dataLightProofSmoke.ER3 | numFilter }}</td>
            <td>{{ dataLightProofSmoke.ERA | numFilter }}</td>
            <td>{{ dataLightProofSmoke.EL | numFilter }}</td>
          </tr>
        </table>
      </div>

      <div v-show="isShow.showLD">
        <table border="1" class="table">
          <tr>
            <td colspan="5">加载减速法</td>
          </tr>
          <tr>
            <td colspan="3">转速</td>
            <td colspan="2">最大轮边功率</td>
          </tr>
          <tr>
            <td>额定转速</td>
            <td colspan="2">实测（修正）VelMaxHP</td>
            <td>实测kW</td>
            <td>限值kW</td>
          </tr>
          <tr>
            <td>{{ InspectData.EngineRatedSpeed | numFilter }}</td>
            <td colspan="2">{{ dataLD.VelMaxEnginePower | numFilter }}</td>
            <td>{{ dataLD.MWP | numFilter }}</td>
            <td>{{ dataLD.MWPEL | numFilter }}</td>
          </tr>
          <tr>
            <td colspan="3">烟度</td>
            <td colspan="2">氮氧化物NOx</td>
          </tr>
          <tr>
            <td></td>
            <td>100%点</td>
            <td>80%点</td>
            <td></td>
            <td>80%点</td>
          </tr>
          <tr>
            <td>实测值</td>
            <td>{{ dataLD.ER100 | numFilter }}</td>
            <td>{{ dataLD.ER80 | numFilter }}</td>
            <td>实测值</td>
            <td>{{ dataLD.NOX80 | numFilter }}</td>
          </tr>
          <tr>
            <td>限值</td>
            <td>{{ dataLD.EL | numFilter }}</td>
            <td>{{ dataLD.EL | numFilter }}</td>
            <td>限值</td>
            <td>{{ dataLD.NOXEL | numFilter }}</td>
          </tr>
        </table>
      </div>

      <Form label-position="right" :label-width="100" class="formInfo">
        <Row>
          <i-col span="8">
            <FormItem label="开始时间:">
              {{
              InspectData.DetectStartTime
              | dataFormat("yyyy-MM-dd hh:mm:ss")
              }}
            </FormItem>
          </i-col>
          <i-col span="8">
            <FormItem label="结束时间:">
              {{
              InspectData.DetectEndTime | dataFormat("yyyy-MM-dd hh:mm:ss")
              }}
            </FormItem>
          </i-col>
          <i-col span="8">
            <FormItem label="检测结果:" :style="{ color: InspectData.VDCT == 1 ? '#009bff' : '#f00' }">
              {{
              InspectData.VDCT == null
              ? ""
              : InspectData.VDCT == 1
              ? "通过"
              : "不通过"
              }}
            </FormItem>
          </i-col>
        </Row>
      </Form>
    </div>
    <div v-else style="text-align:center;">暂无数据</div>
  </div>
</template>

<script>
export default {
  props: {
    processData: {
      default: () => { },
    },
  },
  data() {
    return {
      isShow: {
        showTSI: false,
        showASM: false,
        showIM: false,
        showLD: false,
        showLightProofSmoke: false,
      },
      dataTSI: {},
      dataASM: {},
      dataIM: {},
      dataLD: {},
      dataLightProofSmoke: {},
      InspectData: {}
    }
  },
  filters: {
    numFilter(value) {
      if (value == null) {
        return "-";
      } else if (value == 0 || !value) {
        return value;
      } else {
        // 截取当前数据到小数点后两位
        let realVal = Number(value).toFixed(2);
        return realVal;
      }
    },
  },
  watch: {
    processData: {
      handler(newData, oldData) {
        if (!newData||JSON.stringify(newData) == '{}') return;
        this.isShow = newData.isShow;
        this.dataTSI = newData.dataTSI;
        this.dataASM = newData.dataASM;
        this.dataIM = newData.dataIM;
        this.dataLD = newData.dataLD;
        this.dataLightProofSmoke = newData.dataLightProofSmoke;
        this.InspectData = newData.InspectData;
      },
      immediate: true
    }
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
.formInfo /deep/ .ivu-form-item-content {
  line-height: 3 !important;
}
table {
  border-collapse: collapse;
  margin: 0 auto;
  text-align: center;
  width: 100%;
}
table td,
table th {
  border: 1px solid #e8eaec;
  height: 24px;
  font-size: 12px;
}
table td {
  padding: 0px;
}

table thead th {
  background-color: #e8eaec;
  width: 100px;
}
</style>