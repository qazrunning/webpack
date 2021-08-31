<template>
  <Form
    ref="formCustom"
    :model="formItem"
    :rules="ruleValidate"
    :label-width="isPc ? 140 : null"
    :label-position="isPc ? 'right' : 'top'"
  >
    <Divider orientation="left">基本信息</Divider>
    <Row :gutter="16">
      <i-col :xs="24" :sm="8">
        <FormItem label="姓名：" prop="Name">
          <i-input
            v-model="formItem.Name"
            placeholder="请输入"
            clearable
          ></i-input>
        </FormItem>
      </i-col>
      <i-col :xs="24" :sm="8">
        <FormItem label="登入账号：" prop="LoginAccount">
          <i-input
            v-model="formItem.LoginAccount"
            placeholder="请输入"
            clearable
          ></i-input>
        </FormItem>
      </i-col>
      <i-col :xs="24" :sm="8">
        <FormItem label="性别：">
          <Select style="width:100%" v-model="formItem.Sex" clearable>
            <Option
              v-for="item in sexList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
      </i-col>
      <i-col :xs="24" :sm="8">
        <FormItem label="出生日期：">
          <DatePicker
            type="date"
            format="yyyy-MM-dd"
            v-model="formItem.Birthday"
            style="width:100%"
            clearable
          ></DatePicker>
        </FormItem>
      </i-col>
      <i-col :xs="24" :sm="8">
        <FormItem label="年龄：">
          <i-input
            v-model="formItem.Age"
            placeholder="请输入"
            clearable
          ></i-input>
        </FormItem>
      </i-col>
      <i-col :xs="24" :sm="8">
        <FormItem label="身份证：" prop="IDCard">
          <i-input
            v-model="formItem.IDCard"
            placeholder="请输入"
            clearable
          ></i-input>
        </FormItem>
      </i-col>
      <i-col :xs="24" :sm="8">
        <FormItem label="学历：">
          <i-input
            v-model="formItem.Qualifications"
            placeholder="请输入"
            clearable
          ></i-input>
        </FormItem>
      </i-col>
      <i-col :xs="24" :sm="8">
        <FormItem label="所学专业：">
          <i-input
            v-model="formItem.discipline"
            placeholder="请输入"
            clearable
          ></i-input>
        </FormItem>
      </i-col>
      <i-col :xs="24" :sm="8">
        <FormItem label="职务：">
          <i-input
            v-model="formItem.Duty"
            placeholder="请输入"
            clearable
          ></i-input>
        </FormItem>
      </i-col>
      <i-col :xs="24" :sm="8">
        <FormItem label="职称：">
          <i-input
            v-model="formItem.Position"
            placeholder="请输入"
            clearable
          ></i-input>
        </FormItem>
      </i-col>
      <i-col :xs="24" :sm="8">
        <FormItem label="上岗证编号：">
          <i-input
            v-model="formItem.InductionCardCode"
            placeholder="请输入"
            clearable
          ></i-input>
        </FormItem>
      </i-col>
      <i-col :xs="24" :sm="8">
        <FormItem label="上岗证核发单位：">
          <i-input
            v-model="formItem.InductionCardUnit"
            placeholder="请输入"
            clearable
          ></i-input>
        </FormItem>
      </i-col>
      <i-col :xs="24" :sm="8">
        <FormItem label="状态：">
          <Select style="width:100%" v-model="formItem.Status" clearable>
            <Option
              v-for="item in stateList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
      </i-col>
      <i-col :xs="24" :sm="8">
        <FormItem label="是否停岗：">
          <i-input
            v-model="formItem.IsOnDuty"
            placeholder="请输入"
            clearable
          ></i-input>
        </FormItem>
      </i-col>
      <i-col :xs="24" :sm="8">
        <FormItem label="上岗时间：">
          <DatePicker
            type="date"
            format="yyyy-MM-dd"
            v-model="formItem.InductionDate"
            style="width:100%"
            clearable
          ></DatePicker>
        </FormItem>
      </i-col>
      <i-col :xs="24" :sm="8">
        <FormItem label="工作电话：" prop="WorkTel">
          <i-input
            v-model="formItem.WorkTel"
            placeholder="请输入"
            clearable
          ></i-input>
        </FormItem>
      </i-col>
      <i-col :xs="24" :sm="8">
        <FormItem label="移动电话：" prop="MobilePhone">
          <i-input
            v-model="formItem.MobilePhone"
            placeholder="请输入"
            clearable
          ></i-input>
        </FormItem>
      </i-col>
      <i-col :xs="24" :sm="8">
        <FormItem label="传真：">
          <i-input
            v-model="formItem.Fax"
            placeholder="请输入"
            clearable
          ></i-input>
        </FormItem>
      </i-col>
      <i-col :xs="24" :sm="8">
        <FormItem label="Email" prop="Email">
          <i-input
            v-model="formItem.Email"
            placeholder="请输入"
            clearable
          ></i-input>
        </FormItem>
      </i-col>
      <i-col :xs="24" :sm="8">
        <FormItem label="住址：">
          <i-input
            v-model="formItem.HomeAddress"
            placeholder="请输入"
            clearable
          ></i-input>
        </FormItem>
      </i-col>
      <i-col :xs="24" :sm="8">
        <FormItem label="邮编：" prop="PostCode">
          <i-input
            v-model="formItem.PostCode"
            placeholder="请输入"
            clearable
          ></i-input>
        </FormItem>
      </i-col>
      <i-col :xs="24" :sm="8">
        <FormItem label="是否是授权签字人：">
          <i-switch
            v-model="formItem.IsAuthorizedSignature"
            size="large"
            style="float:left;margin:5px 0;"
            clearable
          >
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
      </i-col>
      <i-col :xs="24" :sm="8">
        <FormItem label="是否是批准人：">
          <i-switch
            v-model="formItem.IsCertifier"
            size="large"
            style="float:left;margin:5px 0;"
            clearable
          >
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
      </i-col>
    </Row>
    <Divider orientation="left">资质认证</Divider>
    <Row>
      <i-col :xs="24" :sm="8">
        <FormItem label="证件编号:">
          <i-input
            v-model="formItem.CertificateNo"
            placeholder="请输入"
            clearable
          ></i-input>
        </FormItem>
      </i-col>
      <i-col :xs="24" :sm="8">
        <FormItem label="原件扫描:">
          <i-input
            v-model="formItem.OriginalScan"
            placeholder="请输入"
            clearable
          ></i-input>
        </FormItem>
      </i-col>
      <i-col :xs="24" :sm="8">
        <FormItem label="有效日期:">
          <DatePicker
            type="date"
            format="yyyy-MM-dd"
            v-model="formItem.ExpiryDate"
            style="width:100%"
            clearable
          ></DatePicker>
        </FormItem>
      </i-col>
      <i-col :xs="24" :sm="8">
        <FormItem label="发证日期:">
          <DatePicker
            type="date"
            format="yyyy-MM-dd"
            v-model="formItem.IssueDate"
            style="width:100%"
            clearable
          ></DatePicker>
        </FormItem>
      </i-col>
    </Row>
  </Form>
</template>
<script>
import { formatDates, getCDData,setRemindAndInsertAudit,getStationConfig } from "../../../utils/utils";
export default {
  props: {
    StationCode: {
      type: String,
      default: "0",
    },
    ID: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      isPc: this.$app.helper.screen.isPC, //判断是pc还是手机
      sexList: [
        { value: "男", label: "男" },
        { value: "女", label: "女" },
      ], //性别类型
      stateList: [
        { value: "在职", label: "在职" },
        { value: "离职", label: "离职" },
      ], //状态
      formItem: {},
      ruleValidate: {
        Name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        LoginAccount: [
          { required: true, message: "登入账号不能为空", trigger: "blur" },
        ],
        MobilePhone: [
          { required: true, message: "联系电话不能为空", trigger: "blur" },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "号码错误，请重新输入",
            trigger: "blur",
          },
        ],
        Email: [
          {
            pattern: /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
            message: "邮箱错误，请重新输入",
            trigger: "blur",
          },
        ],
        IDCard: [
          {
            pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
            message: "身份证错误，请重新输入",
            trigger: "blur",
          },
        ],
        WorkTel: [
          {
            pattern: /(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^((\(\d{3}\))|(\d{3}\-))?(1[358]\d{9})$)/,
            message: "号码错误，请重新输入",
            trigger: "blur",
          },
        ],
      },
      isOpenAudit:false,
      saveData: {},
    };
  },
  methods: {
    async getconfig (){
      this.isOpenAudit=await getStationConfig(this)
    },
    // 重置表单
    resetFormData() {
      for (let i in this.formItem) {
        if (i == "IsAuthorizedSignature" || i == "IsCertifier") {
          this.formItem[i] = false;
        } else {
          this.formItem[i] = "";
        }
      }
    },
    HandleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.SaveStation();
        } else {
          return this.$Notice.warning({
            title: "请完善基本信息！",
          });
        }
      });
    },

    async SaveStation() {
      this.formItem.StationCode = this.StationCode;
      if (this.formItem.ID) {
        //编辑保存

        let params = {
          IDname: "ID",
          IDvalue: this.formItem.ID,
          tablename: "StationStaff",
          datalist: this.formItem,
          StationCode: this.StationCode,
          redis_key: "stationstaff",
        };
        if(!this.isOpenAudit){
          const { state, msg } = await this.$curl.post( "api/hj/SetTableRedis",params);
        }else{
          // 推送数据
          let remindData={
            msgChannel:'changeStationAudit',msgType:'检测人员信息编辑',msgTypeCode:'04',msgInfo:''
          }
          let parmaData={
            oldItem:this.saveData,
            params:params
          }
          setRemindAndInsertAudit(this,remindData,parmaData,'02')
        }
      } else {
        //新增保存
        let params = {
          isRedis: true,
          tablename: "StationStaff",
          datalist: this.formItem,
          StationCode: this.StationCode,
          redis_key: "stationstaff",
        };
        if(!this.isOpenAudit){
          const { state, msg } = await this.$curl.post("api/hj/AddTableRedis", params);
        }else{
          // 推送数据
          let remindData={
            msgChannel:'changeStationAudit',msgType:'检测人员信息新增',msgTypeCode:'04',msgInfo:''
          }
          let parmaData={
            oldItem:null,
            params:params
          }
          setRemindAndInsertAudit(this,remindData,parmaData,'01')

        }
      }
      await this.searchStaff();
      this.$emit("Data_Process");
      this.$emit("saveState", true);
    },
    async searchStaff() {
      const params = {
        StationCode: this.StationCode,
        ID: this.ID,
      };
      const result = await this.$curl.get("api/hj/GetStationStaff", {
        params: JSON.stringify(params),
      });
      if (result.state) {
        if (result.data.length > 0) this.formItem = result.data[0];
        this.saveData=JSON.parse(JSON.stringify(this.formItem))
      } else {
        this.$Notice.warning({
          title: "提示",
          desc: "获取检测人员数据失败!",
        });
      }
    },
  },
  watch: {
    ID: {
      handler(newval, oldval) {
        this.formItem = {};
        if (!newval) return;
        this.searchStaff();
      },
      immediate: true,
    },
  },
  mounted(){
    this.getconfig()
  }
};
</script>
