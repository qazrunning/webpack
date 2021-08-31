<template>
  <div>
    <Card :padding="0" class="card_main">
      <div slot="title" style="font-size: 14px;font-weight: 700;display:flex;justify-content:space-between;">
        检测线标定信息
        <DatePicker type="date" v-model="selectDate" placeholder="日期" style="width: 200px;margin-top: -7px;" @on-change="Data_Process"></DatePicker>
      </div>
      <Table :columns="columns_Petrol" :data="petrolData" height="350">
      </Table>
      <Table :columns="columns_Diesel" :data="dieselData" height="350">
      </Table>
    </Card>
  </div>
</template>
<script>
export default {
  data() {
    const self = this;
    return {
      isPc: this.$app.helper.screen.isPC, //判断是pc还是手机
      cdList: [], 
      petrolData: [], //数据源
      columns_Petrol: [
        {
          title: "序号",
          type: "index",
          width: 80,
          align: "center",
        },
        {
          title: "检测线编号",
          key: "SceneCode",
          minWidth: 120,
          align: "center",
          sortable: true,
        },
        {
          title: "标定结果",
          align: "center",
          children: [
            {
              title: "HC",
              key: "HCED",
              align: "center",
              render: (h, params) => {
                let name = params.row.HCED == '1' ? '合格' : '不合格';
                return h("span", name);
              }
            },
            {
              title: "CO",
              key: "COED",
              align: "center",
              render: (h, params) => {
                let name = params.row.COED == '1' ? '合格' : '不合格';
                return h("span", name);
              }
            },
            {
              title: "NO",
              key: "NOED",
              align: "center",
              render: (h, params) => {
                let name = params.row.NOED == '1' ? '合格' : '不合格';
                return h("span", name);
              }
            },
            {
              title: "CO2",
              key: "CO2ED",
              align: "center",
              render: (h, params) => {
                let name = params.row.CO2ED == '1' ? '合格' : '不合格';
                return h("span", name);
              }
            },
            {
              title: "O2",
              key: "O2ED",
              align: "center",
              render: (h, params) => {
                let name = params.row.O2ED == '1' ? '合格' : '不合格';
                return h("span", name);
              }
            }
          ]
        },
        {
          title: "标定日期",
          key: "AdjustTimeEnd",
          minWidth: 120,
          align: "center",
        },
      ],
      dieselData: [],
      columns_Diesel: [
        {
          title: "序号",
          type: "index",
          width: 80,
          align: "center",
        },
        {
          title: "检测线编号",
          key: "SceneCode",
          minWidth: 120,
          align: "center",
          sortable: true,
        },
        {
          title: "标称值",
          key: "EL",
          minWidth: 100,
          align: "center",
          sortable: true,
        },
        {
          title: "烟度测量值",
          key: "ER",
          minWidth: 100,
          align: "center",
          sortable: true,
        },
        {
          title: "标定结果",
          key: "ED",
          minWidth: 100,
          align: "center",
          render: (h, params) => {
            let name = params.row.ED == '1' ? '合格' : '不合格';
            return h("span", name);
          }
        },
        {
          title: "标定日期",
          key: "AdjustTimeEnd",
          minWidth: 120,
          align: "center",
        },
      ],
      isCur: false,
      selectDate: ''
    };
  },
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
  methods: {
    returncodename(namelist, codevalue) {
      let CodeName = "";
      namelist.forEach((item) => {
        if (item.value == codevalue) CodeName = item.label;
      });
      return CodeName;
    },
    async Data_Process() {
      const self = this;
      const params = { StationCode: this.StationCode, selectDate: this.selectDate };
      const { code, data } = await this.$curl.get(
        "api/hj/getLineCheckInfo",
        {
          params: JSON.stringify(params),
        }
      );
      if(code) {
        self.petrolData = data.petrolRes;
        self.dieselData = data.dieselRes;
      }
    },
  },
  watch: {
    StationCode: {
      handler(newval, oldval) {
        if (!+newval || newval == oldval) return;
        // if (this.Permission == false) {
        //   this.columns_Cameras.pop();
        // }
        this.selectDate = '';
        if(this.activeStep != this.curIndex) {
          this.isCur = false;
          return;
        } 
        this.isCur = true;
        this.Data_Process();
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
};
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
</style>