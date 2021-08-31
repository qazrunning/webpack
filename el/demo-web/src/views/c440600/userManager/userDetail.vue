<template>
  <div>
    <Form :model="formData" ref="formValidate" :label-width="90" :label-colon="true" :rules="ruleValidate">
      <FormItem label="用户ID" v-if="formData.UserID != ''" prop="UserID">{{ formData.UserID }}</FormItem>
      <!-- <FormItem label="登录名" prop="password">
        <Row>
          <i-col span="9"> <Input v-model="formData.EnName" placeholder="" /></i-col>
          <i-col span="6" style="text-align: center"> 登录密码</i-col>
          <i-col span="9"><Input v-model="formData.PWD" placeholder="" /></i-col>
        </Row>
      </FormItem>-->
      <Row>
        <i-col span="11">
          <FormItem label="登录名" prop="EnName">
            <Input v-model="formData.EnName" placeholder />
          </FormItem>
        </i-col>
        <i-col span="11" offset="2">
          <FormItem label="登录密码" prop="PWD">
            <Input v-model="formData.PWD" placeholder />
          </FormItem>
        </i-col>
      </Row>
      <FormItem label="中文名">
        <Input v-model="formData.CnName" placeholder />
      </FormItem>
      <FormItem label="部门名" class="fromitem">
        <vue-treeselect :options="selectTree" :multiple="true" :flat="true" placeholder="选择部门" v-model="formData.lstGID"></vue-treeselect>
      </FormItem>
      <Row>
        <i-col span="11">
          <FormItem label="检测机构" prop="ESPOrganizationCode">
               <Select v-model="formData.ESPOrganizationCode"  filterable>
                    <Option v-for="(item) in organizationNameData" :value="item.stationcode" :key="item.stationcode">{{ item.stationname }}</Option>
                </Select>
          </FormItem>
        </i-col>
        <i-col span="11" offset="2">
          <FormItem label="所属地市" prop="city">
             <Cascader :data="cityData" v-model="formData.city"  filterable change-on-select></Cascader>
          </FormItem>
        </i-col>
      </Row>
      <Row>
        <i-col span="11">
          <FormItem label="状态">
            <i-switch v-model="UserEnable" size="large">
              <span slot="open">启用</span>
              <span slot="close">禁用</span>
            </i-switch>
          </FormItem>
        </i-col>
        <i-col span="11" offset="2">
          <FormItem label="性别">
            <RadioGroup v-model="formData.Sex">
              <Radio label="0">男</Radio>
              <Radio label="1">女</Radio>
            </RadioGroup>
          </FormItem>
        </i-col>
      </Row>
      <Row>
        <i-col span="11">
          <FormItem label="电话号码">
            <span v-if="!phoneShow" @click="phoneShow = !phoneShow" style="cursor: pointer;">
              {{ formData.Phone.replace(/(\d{3})(\d{4})(\d{4})/,"$1****$3") }}
              <span class="fa fa-edit fa-lg"></span>
            </span>
            <i-input  v-else v-model="formData.Phone" placeholder><span slot="append" class="fa fa-eye-slash fa-lg" style="cursor: pointer;" @click="phoneShow = !phoneShow"></span></i-input>
            
          </FormItem>
        </i-col>
        <i-col span="11" offset="2">
          <FormItem label="Email">
            <i-input v-model="formData.EMail" placeholder></i-input>
          </FormItem>
        </i-col>
      </Row>

      <FormItem>
        <Row>
          <i-col span="24">
            <Button type="primary" :loading="loading" @click="saveForm()" style="width: 100%">
              <span v-if="!loading">保存</span>
              <span v-else>保存中...</span>
            </Button>
          </i-col>
        </Row>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { enctyptLoginPWD } from "@skyland/fxcrypto";
export default {
  props: {
    // Data: Object
    DepartmentList: Array,
  },
  data() {
    // let { isforceStrongPwd } = this.$app.ProjSetting;
    let {
      verification_rules,
      error_prompt,
      verification_func,
    } = this.$app.Cfg.core.account_security;
    const PWDRegExp = new RegExp(verification_rules); //|| /^.*(?=.{6,})(?=.*\d)(?=.*[a-z]|[A-Z]{1,}).*$/;
    const validatePWD = (rele, value, callback) => {
      console.log(rele, value);
      console.log(PWDRegExp.test(value), PWDRegExp);
      if (value) {
        if (verification_func) {
          var func = eval(`(false||${verification_func})`);
          if (!func(value)) {
            callback(new Error(error_prompt)); //||"密码必须包含数字加英文字母并且长度大于6位"
          }
        } else if (!PWDRegExp.test(value)) {
          callback(new Error(error_prompt)); //||"密码必须包含数字加英文字母并且长度大于6位"
        }
      }
      callback();
    };

    // let str = "function(ss){alert(ss);}"
    // var f=eval(`(false||${str})`);
    // f(11);//所有浏览器成功输出

    let templeteData = {
      UserID: "",
      EnName: "",
      CnName: "",
      PWD: verification_rules || verification_func ? "" : "1",
      EMail: "",
      Status: 1,
      Phone: "",
      Sex: "",
      lstGID: [],
      ESPOrganizationName:"",
      ESPOrganizationCode:"",
      city:[]
    };

    // let validateSequence = (rule, value, callback) => {
    //   if (!value.length) {
    //     callback(new Error("请选择所属地市"));
    //   } else {
    //     callback();
    //   }
    // };
    return {
      organizationNameData:[],
      cityData:[],
      formData: Object.assign({}, templeteData),
      templeteData,
      loading: false,
      phoneShow:false,
      spinShow: false,
      ruleValidate: {
        PWD: [{ required: false, validator: validatePWD, trigger: "blur" }],
        EnName: [
          { required: true, message: "请填写有效的登录名", trigger: "blur" },
        ],
        ESPOrganizationCode:[
           { required: true, message: "请选择检测机构", trigger: "change" },
        ],
        city:[ 
          { required: true, message: '请选择所属地市', type: 'array',trigger: 'change' }
        ],
      },
    };
  },
    mounted() {
        this.cityData = this.$XZQH; //所属地市
        this.LoadOrganization();
    },
  computed: {
    UserEnable: {
      get: function () {
        this.phoneShow = false
        return this.formData.Status == "1" ? true : false;
      },
      set: function (val) {
        this.formData.Status = val ? 1 : 0;
      },
    },
    selectTree() {
      let _this = this;
      let list = Object.assign([], true, _this.DepartmentList);
      // list.unshift({
      //   GID: "NULL",
      //   GroupName: "待分配"
      // });

      return list.List2Tree("GID", "PGID", (src, sublist) => {
        let item = {};
        item.id = src.GID;
        item.label = src.GroupName;
        item.children = sublist;
        return item;
      });
    },
  },
  methods: {
    LoadOrganization(){
        this.$curl.get("/api/common/query/getStationList").then(res =>{
            this.organizationNameData = res.data;
        })
    },
    LoadForm(userid, rowData) {
      let _this = this;
      if (userid) {
        return this.$curl
          .get("/api/demo/user/get", {
            id: userid,
          })
          .then((res) => {
            console.log(res);
            
            let { user, lstGID } = res;

            user.Sex = user.Sex == null ? "" : user.Sex.toString();
            _this.$set(_this, "formData", user);

            _this.formData.lstGID = lstGID;
            this.formData.city=[];
            if(user.ProvinceCode!=null&&user.ProvinceCode!==""){
              this.formData.city.push(user.ProvinceCode);
            }
            if(user.AreaCode!=null&&user.AreaCode!==""){
              this.formData.city.push(user.AreaCode);
            }
            if(user.CountyCode!=null&&user.CountyCode!==""){
              this.formData.city.push(user.CountyCode);
            }
          });
      } else if (rowData) {
        _this.formData = Object.assign({}, rowData);
      } else {
        _this.formData = Object.assign({}, _this.templeteData);
      }
    },
    saveForm() {
      let _this = this;
      _this.$refs.formValidate.validate((valid) => {
        if (valid) {
          let formData = Object.assign({}, _this.formData);


          // 是否加密
          if (formData.PWD != "" && _this.$app.ProjSetting.isCryptoLoginPWD) {
            formData.PWD = enctyptLoginPWD(formData.PWD);
          }
          // console.log(this.organizationNameData);
          
          // let a = this.organizationNameData.find( i => i.stationcode === formData.ESPOrganizationCode).stationname;
          // console.log(a);
          
          formData.ESPOrganizationName = this.organizationNameData.find( i => i.stationcode === formData.ESPOrganizationCode).stationname;

          let content = {
            UserID:formData.UserID,
            EnName:formData.EnName,
            CnName:formData.CnName,
            PWD: formData.Status,
            EMail: formData.Status,
            Status:formData.Status,
            Phone:formData.Status,
            Sex:formData.Sex,
            lstGID:formData.lstGID,
          };
          let extInfo = {
            UserID:formData.UserID,
            ESPOrganizationName:formData.ESPOrganizationName,
            ESPOrganizationCode:formData.ESPOrganizationCode,
            ProvinceCode:formData.city[0]||"",
            AreaCode:formData.city[1]||"",
            CountyCode:formData.city[2]||"",
          };
          if (formData.UserID) {

            //修改
            _this.loading = true;
            
            _this.$curl
              .post("/api/demo/user/update", {
                content: JSON.stringify(content),
                extInfo,
              })
              .then((res) => {
                // self.$Message.info("修改完成");
                if(res.code==0){
                  _this.$emit("on-edit", formData);
                }else{
                  _this.$Message.error(e.message);
                }
                
              })
              .finally(() => {
                _this.loading = false;
              });
          } else {
            //新增

            // _this.loading = true;
            _this.$curl
              .post("/api/demo/user/add", {
                content: content,
                extInfo,
              })
              .then((res) => {
                let entity = res;
                if(res.code==0){
                  _this.$emit("on-adduser", res.data);
                }else{
                  _this.$Message.error(res.msg);
                }
                //_this.loadForm(entity.UserID);
                
              })
              .finally(() => {
                // _this.loading = false;
              });
          }
        }
      });
    },
  },
};
</script>

<style lang="scss">
.fromitem {
  .ivu-form-item-content {
    line-height: 20px;
  }
}
</style>
