<template>
  <Form ref="formCustom" :model="formItem" :rules="ruleValidate" :label-width="isPc ? 140 : null" :label-position="isPc ? 'right' : 'top'" disabled>
    <Divider orientation="left">基本信息</Divider>
    <Row :gutter="16">
      <i-col :xs="24" :sm="12">
        <FormItem label="所属检测线" prop="SceneCode">
          <Select style="width:100%" v-model="formItem.SceneCode" clearable>
            <Option v-for="(item,index) in cdLineList" :value="item.value" :key="index">{{ item.label }}</Option>
          </Select>
        </FormItem>
      </i-col>
      <i-col :xs="24" :sm="12">
        <FormItem label="设备认证编号：" prop="IEAC">
          <i-input v-model="formItem.IEAC" placeholder="请输入" clearable></i-input>
        </FormItem>
      </i-col>
      <i-col :xs="24" :sm="12">
        <FormItem label="检测设备类型：" prop="StationDeviceType">
          <Select style="width:100%" v-model="formItem.StationDeviceType" clearable>
            <Option v-for="(item,index) in StationDeviceType" :value="item.CodeValue" :key="index">{{ item.CodeName }}</Option>
          </Select>
        </FormItem>
      </i-col>
      <i-col :xs="24" :sm="12">
        <FormItem label="型号：" prop="Type">
          <i-input v-model="formItem.Type" placeholder="请输入" clearable></i-input>
        </FormItem>
      </i-col>
      <i-col :xs="24" :sm="12">
        <FormItem label="设备名称：" prop="Name">
          <i-input v-model="formItem.Name" placeholder="请输入" clearable></i-input>
        </FormItem>
      </i-col>
      <i-col :xs="24" :sm="12">
        <FormItem label="状态：" prop="Status">
          <Select v-model="formItem.Status" clearable>
            <Option value="正在使用" key="正在使用">正在使用</Option>
            <Option value="废弃" key="废弃">废弃</Option>
          </Select>
        </FormItem>
      </i-col>
      <i-col :xs="24" :sm="12">
        <FormItem label="标定有效期：" prop="CalValidityPeriod">
          <DatePicker type="date" format="yyyy-MM-dd" v-model="formItem.CalValidityPeriod" style="width:100%" clearable />
        </FormItem>
      </i-col>
      <i-col :xs="24" :sm="12">
        <FormItem label="仪器设备管理员：">
          <i-input v-model="formItem.DeviceManager" placeholder="请输入" clearable></i-input>
        </FormItem>
      </i-col>
      <i-col :xs="24" :sm="12">
        <FormItem label="制造厂：">
          <i-input v-model="formItem.DeviceMANU" placeholder="请输入" clearable></i-input>
        </FormItem>
      </i-col>
      <i-col :xs="24" :sm="12">
        <FormItem label="设备精度：">
          <i-input v-model="formItem.DevicePrecision" placeholder="请输入" clearable></i-input>
        </FormItem>
      </i-col>
      <i-col :xs="24" :sm="12">
        <FormItem label="生产日期："  >
          <DatePicker type="date" format="yyyy-MM-dd" v-model="formItem.ProductionDate" style="width:100%" clearable></DatePicker>
        </FormItem>
      </i-col>
      <i-col :xs="24" :sm="12">
        <FormItem label="上线日期："  >
          <DatePicker type="date" format="yyyy-MM-dd" v-model="formItem.UseDate" style="width:100%" clearable></DatePicker>
        </FormItem>
      </i-col>
      <i-col :xs="24" :sm="12">
        <FormItem label="系统提供商：">
          <i-input v-model="formItem.SoftwareProvider" placeholder="请输入" clearable></i-input>
        </FormItem>
      </i-col>
      <i-col :xs="24" :sm="12">
        <FormItem label="出厂编号：">
          <i-input v-model="formItem.FactoryNo" placeholder="请输入" clearable></i-input>
        </FormItem>
      </i-col>
      <i-col :xs="24" :sm="12">
        <FormItem label="检测项目：">
          <i-input v-model="formItem.InspectionItem" placeholder="请输入" clearable></i-input>
        </FormItem>
      </i-col>
      <i-col :xs="24" :sm="12" v-if="formItem.StationDeviceType == '06'">
        <FormItem label="是否启动转化炉：">
          <Select v-model="formItem.IsStartReburner" clearable>
            <Option value="1" key="1">是</Option>
            <Option value="0" key="0">否</Option>
          </Select>
        </FormItem>
      </i-col>
      <!-- <i-col :xs="24" :sm="12">
        <FormItem label="设备所属检测线线号：">
          <i-input v-model="formItem.LineInfoID" placeholder="请输入"></i-input>
        </FormItem>
      </i-col> -->
    </Row>
  </Form>
</template>
<script>
import { formatDates, getCDData,setRemindAndInsertAudit,getStationConfig } from "../../../utils/utils";
export default {
  props: {
    cdLineList: {
      type: Array,
      default: []
    },
    StationCode: {
      type: String,
      default: "0"
    },
    ID: {
      type: Number,
      default: 0
    },
    formItemInfo: {
      type: Object
    },
    opera: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      changeData: ['SceneCode', 'IEAC', 'Status', 'CalValidityPeriod'], // 需要修改的数据监控
      saveData: {}, // 保存数据用于判断是否修改
      formItem: {},
      isPc: this.$app.helper.screen.isPC, //判断是pc还是手机
      StationDeviceType: [],
      ruleValidate: {
        SceneCode: [
          { required: true, message: "所属检测线不能为空", trigger: "blur" }
        ],
        IEAC: [
          { required: true, message: "设备认证编号不能为空", trigger: "blur" }
        ],
        StationDeviceType: [
          { required: true, message: "检测设备类型不能为空", trigger: "blur" }
        ],
        Type: [{ required: true, message: "型号不能为空", trigger: "blur" }],
        Name: [
          { required: true, message: "设备名称不能为空", trigger: "blur" }
        ],
        Status: [{ required: true, message: "状态不能为空", trigger: "blur" }],
        CalValidityPeriod: [
          {
            required: true,
            message: "标定有效期不能为空",
            trigger: "blur",
            type: "date"
          }
        ]
      },
      isOpenAudit:false
    };
  },
  methods: {
    async getconfig (){
      this.isOpenAudit=await getStationConfig(this)
    },
    async getOption() {
      const _this = this;
      let cdname = [
        {
          tableName: "CD_StationDeviceType",
          columns: "CodeValue,CodeName",
          where: "where IsAvailable=1"
        }
      ];
      if (_this.$getDBTable)  {
        let cdList = cdname.map(item => {
          return item.tableName;
        });
        await _this.$getDBTable(cdList).then(data => {
          
          _this.StationDeviceType = data.map(v => {
            return JSON.parse(v).filter(item => item.IsAvailable == 1)
          })[0]
        })
      }else {
        getCDData(this, cdname).then(res => {
          const { data, state, msg } = res;
          if (state) _this.StationDeviceType = data[0].filter(item => item.IsAvailable == 1);
        });
        
      }
    },
    HandleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.SaveStation();
          this.$emit("saveState", false);
        } else {
          this.$emit("saveState", true);
          this.$Notice.warning({
            title: "请完善基本信息！"
          });
          return;
        }
        this.judgeDataChange(this.saveData, true)
      });
    },
    judgeDataChange(value, post) {
      this.saveData = value;
      if(post)
        if (this.formItem) {
          let filterData = this.changeData.filter(item => {
            if (item == "CalValidityPeriod")
              return (
                formatDates(this.saveData.CalValidityPeriod, "yyyy-MM-dd") !=
                formatDates(this.formItem.CalValidityPeriod, "yyyy-MM-dd")
              );
            else return this.saveData[item] != this.formItem[item];
          });
          let DataSource = [];
          if (filterData.length) {
            filterData.forEach(item => {
              DataSource.push(
                `{old: ${this.saveData[item]}, new: ${this.formItem[item]}, field: ${item}}`
              );
            });
            let DataTable = "StationDevice";
            this.$curl.post("api/hj/dataChangeLog", {
              params: {
                DataSource,
                DataTable
              }
            });
          }
        }
    },
    async SaveStation() {
      
      this.formItem.StationCode = this.StationCode;
      // this.formItem.CalValidityPeriod = new Date(this.formItem.CalValidityPeriod);

      if (this.formItem.StationDeviceID) {
        //编辑保存
        this.formItem.isEditDeviceInfo ='1'
        if(!this.formItem.IsStartReburner) this.formItem.IsStartReburner = null;
        let params = {
          IDname: "StationDeviceID",
          IDvalue: this.formItem.StationDeviceID,
          tablename: "StationDevice",
          datalist: this.formItem,
          StationCode: this.StationCode,
          redis_key: "stationdevice",
        };
        if(!this.isOpenAudit){
          const { state, msg } = await this.$curl.post( "api/hj/SetTableRedis", params );
        }else{
          // 推送数据
          let remindData={
            msgChannel:'changeStationAudit', msgType:'检测设备信息编辑',msgTypeCode:'03', msgInfo:''
          }
          let parmaData={
            oldItem:this.saveData,
            params:params
          }
          setRemindAndInsertAudit(this,remindData,parmaData,'02')
        }
      } else {
        //新增保存
        this.formItem.isEditDeviceInfo='1'
        let params = {
          isRedis: true,
          tablename: "StationDevice",
          datalist: this.formItem,
          StationCode: this.StationCode,
          redis_key: "stationdevice"
        };
        if(!this.isOpenAudit){
          const { state, msg } = await this.$curl.post("api/hj/AddTableRedis",params);
        }else{
          let remindData={
            msgChannel:'changeStationAudit', msgType:'检测设备信息新增',msgTypeCode:'03', msgInfo:''
          }
          let parmaData={
            oldItem:null,
            params:params
          }
          setRemindAndInsertAudit(this,remindData,parmaData,'01')
        }
      }
      this.$emit("fatherMethod"); //晒新数据
      this.$emit("saveState"); //关闭弹窗
    }
  },
  mounted() {
    this.getOption();
    this.getconfig()
  },
  watch: {
    formItemInfo(newVal) {
      this.formItem = Object.assign({}, newVal);
      if(this.formItem.IsStartReburner == 0 || this.formItem.IsStartReburner == 1) this.formItem.IsStartReburner = this.formItem.IsStartReburner + '';
      this.formItem.CalValidityPeriod = new Date( this.formItem.CalValidityPeriod );
    },
    opera(newVal) {
      // console.log(this.formItemInfo);
      if(newVal == "xz") this.formItem = {} ;
      if(newVal == "bj") this.formItem = Object.assign({}, this.formItemInfo);
      if(this.formItem.IsStartReburner == 0 || this.formItem.IsStartReburner == 1) this.formItem.IsStartReburner = this.formItem.IsStartReburner + '';
      // console.log(this.formItem);
    }
  }
};
</script>