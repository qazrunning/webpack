//排放标准核对信息
<template>
  <div class="emission-main">
    <Modal v-model="EmissionModel" draggable title="车辆排放标准核对" width="1000">
      <Tabs size="small" @on-click="tabChange" v-model="selectTab" name='tabChildren'>
        <TabPane label="方式一(根据车型审核)" name="name1" tab='tabChildren'>
          <div style="margin-bottom:10px;">
            <Form :model="cart_model">
              <Input v-model="cart_model.IUVTYPE" placeholder="车辆型号" style="width: 140px;margin-right:10px;" clearable />
              <Input v-model="cart_model.FactoryPlateModel" placeholder="车辆品牌" style="width: 140px;margin-right:10px;" clearable />
              <Input v-model="cart_model.IUETYPE" placeholder="发动机型号" style="width: 140px;margin-right:10px;" clearable />
              <Button type="primary" shape="circle" icon="ios-search" style="margin-right:10px;" @click="loadData()">检索</Button>
              <!-- <Button type="primary" shape="circle" style="margin-right:10px;" @click.stop="showCarTypeModel">获取更多车型</Button> -->
              <Button type="text" to="http://219.141.229.198/ovehicle/queryOvehicle.jsp" target="_blank" style="margin-right:10px;">环保部车型检索</Button>
              <Button type="text" to="http://xpl.vecc-mep.org.cn/ics/queryOvehicle.jsp" target="_blank">进口车环保达标检索</Button>
            </Form>
          </div>
          <Table class="cartType_div" :loading="loading" size="small" border :columns="columns1" :data="cartTypeList" highlight-row :height="280" @on-row-click='clickTableOne'></Table>
          <Page :total="dataCount" show-total @on-change='changePageTableOne' :page-size="pageSize" />
        </TabPane>
        <TabPane label="方式二(根据排放标准审核)" name="name2" tab='tabChildren'>
          <div style="height:300px;">
            <Form ref="formValidate" :model="cart_model2" :rules="ruleValidate" :label-width="120">
              <Row>
                <Col span='6'>
                <FormItem label="公安车类型" prop="GAVType">
                  <Select clearable style="width:120px;margin-right:10px;" placeholder="公安车辆类型" v-model="cart_model2.GAVType">
                    <Option v-for="item in initform.GAVTypeList" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
                  </Select>
                </FormItem>
                <FormItem label="燃油种类" prop="FuelType">
                  <Select clearable style="width:120px;margin-right:10px;" placeholder="燃油种类" v-model="cart_model2.FuelType">
                    <Option v-for="item in initform.FuelTypeList" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
                  </Select>
                </FormItem>
                </Col>
                <Col span='6'>
                <FormItem label="是否装有OBD">
                  <Select clearable style="width:120px;margin-right:10px;" v-model="cart_model2.HasOBD">
                    <Option v-for="item in HasOBD" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
                  </Select>
                </FormItem>
                <FormItem label="登记日期" prop="VRDATE">
                  <DatePicker v-model="cart_model2.VRDATE" type="date" placeholder="登记日期" style="width: 120px;margin-right:10px;"></DatePicker>
                </FormItem>
                </Col>
                <Col span='6'>
                <FormItem label="座位数" prop="RatedSeats">
                  <Input v-model.number="cart_model2.RatedSeats" style="width: 120px;margin-right:10px;" />
                </FormItem>
                <FormItem>
                  <Button type="primary" shape="circle" icon="ios-search" style="margin-right:6px;" @click="loadData2('formValidate')">审核</Button>
                  <span style="font-size:16px;font-weight:800;margin-top:2px">{{returncodenames(this.initform.EmissionStandard,cart_model2.EmissionStandard)}}</span>
                </FormItem>
                </Col>
                <Col span='6'>
                <FormItem label="最大总质量(kg)" prop="VML">
                  <Input v-model.number="cart_model2.VML" style="width: 120px;margin-right:10px;" />
                </FormItem>
                </Col>
              </Row>
            </Form>
          </div>
        </TabPane>
      </Tabs>
      <div slot="footer">
        <Button type="primary" @click="postEmissionStandard" v-show="hasAuthority">确定</Button>
        <Button type="warning" @click="EmissionModel = false;">取消</Button>
      </div>
    </Modal>
    <!-- 更多车型 -->
    <Modal v-model="CarTypeModel" draggable scrollable width="80" title="查询车型型式核准信息(数据来源于中国环境保护部机动车排污监控中心)">
      <div style="margin-bottom:10px;">
        <Input v-model="cart_model3.strVehicleModel" placeholder="模糊条件关键字" style="width: 140px;margin-right:10px;" />
        <Button type="primary" shape="circle" icon="ios-search" style="margin-right:10px;" @click="loadData3()">检索</Button>
      </div>
      <p style="color:#f00;">(说明：模糊条件支持车辆型号、名称、生产企业、商标，关键字至少二位字符，区分大小写；进口车可以使用车架号的前8位作为关键字查询)</p>
      <Table size="small" border :columns="columns2" :data="[]" :height="280"></Table>
      <div slot="footer">
        <Button type="primary" size="large" v-show="hasAuthority">确定</Button>
        <Button type="warning" size="large" @click="CarTypeModel=false">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { formatDates } from "./../../../utils/utils";
export default {
  props: {
    hasAuthority: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loading: true,
      selectTab: "",
      dataCount: 0,
      pageSize: 20,
      currentPage: 1,
      EmissionModel: false,
      CarTypeModel: false,
      checkedEmissionModel: "", //审核得到的排放阶段
      initform: {}, //cd表数据
      HasOBD: [
        { CodeName: "否", CodeValue: "0" },
        { CodeName: "是", CodeValue: "1" }
      ], //
      cart_model: {
        IUVTYPE: "",
        FactoryPlateModel: "",
        IUETYPE: ""
      },
      cart_model2: {
        VML: "",
        RatedSeats: "",
        VRDATE: "",
        FuelType: "",
        GAVType: "",
        HasOBD: ""
      },
      cart_model3: {
        strVehicleModel: "",
        op: "like"
      },
      columns1: [
        {
          title: "车辆型号",
          key: "CLXH",
          minWidth: 140
        },
        {
          title: "排放阶段",
          key: "PF",
          render: (h, param) => {
            let PF =
              param.row.PF && param.row.PF.length == 1
                ? "0" + param.row.PF
                : param.row.PF;
            let name = this.returncodenames(this.initform.EmissionStandard, PF);
            return h("span", {}, name);
          },
          minWidth: 90
        },
        {
          title: "目录日期",
          key: "FILENAME",
          minWidth: 140
        },
        {
          title: "发动机型号",
          key: "FDJXH",
          minWidth: 120
        },
        {
          title: "车辆品牌",
          key: "CLSB",
          minWidth: 100
        },
        {
          title: "车辆制造企业名称",
          key: "MANUF",
          minWidth: 220
        },
        {
          title: "发动机生产厂家",
          key: "FDJSCC",
          minWidth: 200
        },
        {
          title: "车辆名称",
          key: "CLMC",
          minWidth: 100
        },
        {
          title: "车辆类别",
          key: "CLLB",
          minWidth: 100
        }
      ],
      columns2: [
        {
          title: "车辆型号",
          key: "CLXH"
        },
        {
          title: "排放阶段",
          key: "PF"
        },
        {
          title: "目录日期",
          key: "FILENAME"
        },
        {
          title: "发动机型号",
          key: "FDJXH"
        },
        {
          title: "车辆品牌",
          key: "CLSB"
        }
      ],
      cartTypeList: [],
      ruleValidate: {
        GAVType: [{ required: true, message: "必填项", trigger: "blur" }],
        VML: [{ required: true, message: "必填项", type: "number", trigger: "blur" }],
        RatedSeats: [
          { required: true, message: "必填项", type: "number", trigger: "blur" }
        ],
        FuelType: [{ required: true, message: "必填项", trigger: "blur" }],
        VRDATE: [
          { required: true, message: "必填项", type: "date", trigger: "blur" }
        ],
        HasOBD: [{ required: true, message: "必填项", trigger: "blur" }]
      }
    };
  },
  methods: {
    openModel() {
      this.EmissionModel = true;
    },
    tabChange(name) {
      this.selectTab = name;
      if (name == "name1") {
        this.loadData();
      } else if (name == "name2") {
      }
    },
    async loadData() {
      const param = {
        CLXH: this.cart_model.IUVTYPE || "",
        FDJXH: this.cart_model.IUETYPE || "",
        CLSB: this.cart_model.FactoryPlateModel || "",
        pageSize: this.pageSize,
        currentPage: this.currentPage
      };
      const res = await this.$curl.get("api/hj/getCartTypeList", { param: JSON.stringify(param) });
      if (res.state) {
        this.cartTypeList = res.data.cartTypeList;
        this.dataCount = res.data.count.zs;
      } else {
        this.$Message.error("查询失败!");
      }
      this.loading = false;
    },
    loadData2(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$curl
            .post("api/hj/getEmissionStandard", {
              VML: this.cart_model2.VML,
              RatedSeats: this.cart_model2.RatedSeats,
              VRDATE: formatDates(this.cart_model2.VRDATE, "yyyy-MM-dd"),
              FuelType: this.cart_model2.FuelType,
              GAVType: this.cart_model2.GAVType,
              HasOBD: this.cart_model2.HasOBD
            })
            .then(res => {
              if (res.state == 0) {
                this.$Message.error(res.msg);
              }
              this.checkedEmissionModel = res.emissionStandard;
              this.cart_model2.EmissionStandard = res.emissionStandard;
            });
        } else {
          this.$Message.error("*为必填项!");
        }
      });
    },
    loadData3() {
      if (
        this.cart_model3.strVehicleModel == "" ||
        this.cart_model3.strVehicleModel == undefined ||
        this.cart_model3.strVehicleModel.length < 2
      ) {
        this.$Notice.warning({
          title: "模糊查询条件关键字最少二位字符！"
        });
        return;
      }
    },
    showCarTypeModel() {
      this.CarTypeModel = true;
    },
    closeModel2() {
      this.CarTypeModel = false;
    },
    childMethods(data) {
      this.cart_model = {
        IUVTYPE: data.IUVTYPE,
        FactoryPlateModel: data.FactoryPlateModel,
        IUETYPE: data.IUETYPE
      };
      this.cart_model2 = {
        VML: data.VML,
        RatedSeats: data.RatedSeats,
        VRDATE: new Date(data.VRDATE),
        FuelType: data.FuelType,
        GAVType: data.GAVType,
        EmissionStandard: data.EmissionStandard,
        HasOBD: data.HasOBD
      };
      this.loadData();
    },
    //直接从浏览器缓存获取CD表或者从reids
    async getDBinfoByMultipte() {
      const self = this;
      const list = [
        {
          tableName: "CD_GAVType",
          columns: "CodeValue,CodeName",
          where: "where IsAvailable=1",
        },
        {
          tableName: "CD_FuelType",
          columns: "CodeValue,CodeName",
          where: "where IsAvailable=1",
        },
        {
          tableName: "CD_EmissionStandard",
          columns: "CodeValue,CodeName",
          where: "where IsAvailable=1",
        }
      ];
      const tabName = list.map(l => l.tableName);
      const keyList = ['GAVTypeList', 'FuelTypeList', 'EmissionStandard']
      if (self.$getDBTable) {
        self.$getDBTable(tabName).then(res => {
          let data = [];
          res.forEach((item, index) => {
            data = JSON.parse(item);
            if (data[0].hasOwnProperty('IsAvailable')) data = data.filter(d => d.IsAvailable == 1);
            self.initform[keyList[index]] = data;
          })
        })
      } else {
        let res = await this.$curl.get("api/hj/getCDData", { CDDataList: JSON.stringify(list) });
        if (res.state) {
          res.data.forEach((item, index) => {
            if (item[0].hasOwnProperty('IsAvailable')) item = item.filter(i => i.IsAvailable == 1);
            self.initform[keyList[index]] = item;
          })
        }
      }
      self.showModel = !self.showModel;
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

    //方式一点击某一行
    clickTableOne(row) {
      this.checkedEmissionModel =
        row.PF && row.PF.length == 1 ? "0" + row.PF : row.PF;
    },
    //确定
    postEmissionStandard() {
     if(this.selectTab=='name1'){
        this.$emit("getEmissionStandard", this.checkedEmissionModel);
     }
      this.EmissionModel = false;
      if (this.selectTab == "name2") {
        this.$emit("changeAllInfo", this.cart_model2);
        this.$Message.success("审核成功！");
      }
    },
    //切换页数
    async changePageTableOne(index) {
      this.currentPage = index;
      const param = {
        CLXH: this.cart_model.IUVTYPE || "",
        FDJXH: this.cart_model.IUETYPE || "",
        CLSB: this.cart_model.FactoryPlateModel || "",
        pageSize: this.pageSize,
        currentPage: this.currentPage
      };
      const res = await this.$curl.get("api/hj/getCartTypeList", { param: JSON.stringify(param) });
      if (res.state) {
        this.cartTypeList = res.data.cartTypeList;
        this.dataCount = res.data.count.zs;
      } else {
        this.$Message.error("查询失败!");
      }
    }
  },
  mounted() { },
  created() {
    this.getDBinfoByMultipte();
  }
};
</script>
<style scoped>
.emission-main /deep/ .ivu-form-item-label {
  color: #a0a0a0;
  width: 1000px;
}
</style>

