<template>
  <div style="postion:relative">

    <Form :model="formData" :label-width="80" style="position:relative">
      <FormItem label="用户ID" v-if="formData.UserID!=''">

        <Row>
          <i-col span="9">{{formData.UserID}}</i-col>
          <i-col span="6" style="text-align: center"> 创建时间</i-col>
          <i-col span="9">{{formData.CreateTime}}</i-col>
        </Row>
      </FormItem>
      <FormItem label="登录名">
        <Row>
          <i-col span="9"> <Input v-model="formData.EnName" placeholder="" /></i-col>
          <i-col span="6" style="text-align: center"> 登录密码</i-col>
          <i-col span="9"><Input v-model="formData.PWD" placeholder="" /></i-col>
        </Row>
      </FormItem>
      <FormItem label="中文名">
        <Input v-model="formData.CnName" placeholder="" />
      </FormItem>
      <FormItem label="部门名">
        <Select v-model="formData.DPID">
          <Option :value="item.DPID" v-for="(item, index) in AuxiData.departments" :key="index">
            {{item.DPName}}
          </Option>
        </Select>
      </FormItem>
      <FormItem label="状态">
        <Row>
          <i-col span="9">
            <i-switch v-model="UserEnable" size="large">
              <span slot="open">启用</span>
              <span slot="close">禁用</span>
            </i-switch>
          </i-col>
          <i-col span="6" style="text-align: center">性别
          </i-col>
          <i-col span="9">
            <RadioGroup v-model="formData.Sex">
              <Radio label="0">男</Radio>
              <Radio label="1">女</Radio>
            </RadioGroup>
          </i-col>
        </Row>

      </FormItem>
      <FormItem label="电话号码">
        <Row>
          <i-col span="9">
            <i-input v-model="formData.Phone" placeholder=""></i-input>
          </i-col>
          <i-col span="6" style="text-align: center">Email
          </i-col>
          <i-col span="9">
            <i-input v-model="formData.EMail" placeholder=""></i-input>
          </i-col>
        </Row>
      </FormItem>

      <FormItem>
        <Row>
          <i-col span="24">
            <Button type="primary" :loading="loading" @click="saveForm()" style="width:100%">
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
export default {
  props: {
    // Data: Object
    AuxiData: Object
  },
  data() {
    let templeteData = {
      UserID: "",
      EnName: "",
      CnName: "",
      PWD: "1",
      EMail: "test",
      Status: 1,
      Phone: "",
      Sex: "",
      DPID: ""
    };

    return {
      formData: Object.assign({}, templeteData),
      templeteData,
      loading: false,
      spinShow: false
    };
  },
  computed: {
    UserEnable: {
      get: function() {
        return this.formData.Status == "1" ? true : false;
      },
      set: function(val) {
        this.formData.Status = val ? 1 : 0;
      }
    }
  },
  methods: {
    async LoadForm(userid, rowData) {
      var self = this;
      if (userid) {
        return this.$curl
          .get("/api/demo/usermanager/get", {
            id: userid
          })
          .then(res => {
            let { user } = res;
            user.Sex = user.Sex || "0";
            user.Sex = user.Sex.toString();
            self.$set(self, "formData", user);
          });
      } else if (rowData) {
        self.formData = Object.assign({}, rowData);
      } else {
        self.formData = Object.assign({}, self.templeteData);
      }
    },
    async saveForm() {
      var self = this;

      if (self.formData.UserID) {
        //修改
        self.loading = true;
        return this.$curl
          .post("/api/demo/usermanager/update", {
            content: JSON.stringify(self.formData)
          })
          .then(res => {
            // self.$Message.info("修改完成");
            let { DPID, CnName } = self.formData;
            self.$emit("on-edit", self.formData);
          })
          .finally(() => {
            self.loading = false;
          });
      } else {
        //新增
        self.loading = true;
        return this.$curl
          .post("/api/demo/usermanager/add", {
            content: JSON.stringify(self.formData)
          })
          .then(res => {
            let entity = res;
            // self.$Message.info("新增完成");
            // self.loadForm(entity.UserID);
            self.$emit("on-add", entity);
          })
          .finally(() => {
            self.loading = false;
          });
      }
    }
  }
};
</script>

<style>
</style>
