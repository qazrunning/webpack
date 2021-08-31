<template>
  <div class="content">
    <div class="item">
      <div style="display:flex;margin-top:5px;">
        <span style="width:50px;">频道</span>

        <div style="flex:1">
          <Select v-model="form.msgChannel">
            <Option v-for="(item,key,index) in channels" :value="key" :key="index">{{ item.text }}</Option>
          </Select>
        </div>

      </div>
      <div style="display:flex;margin-top:5px;">
        <span style="width:50px;">类型</span>
        <div style="flex:1"><Input v-model="form.msgType" /></div>

      </div>
      <div style="display:flex;margin-top:5px;">
        <div style="width:50px;">摘要</div>
        <div style="flex:1">
          <Input type="textarea" :rows="4" placeholder="" v-model="form.msgTitle" />
        </div>
      </div>
      <div style="display:flex;margin-top:5px;">
        <div style="flex:1;padding-left:50px;"><Button @click="handleSubmit">发送</Button></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        msgChannel: "dingding",
        msgType: "放假通知",
        msgTitle: "1月1号元旦放假了"
      }
    };
  },
  computed: {
    channels() {
      return this.$app.Setting.core.remind;
    }
  },
  mounted() {
    // debugger;
  },
  methods: {
    handleSubmit() {
      let _this = this;
      _this.$curl
        .post("/api/demo/setTestRemind", JSON.stringify(this.form))
        .then(res => {
          _this.$Message.info("发送成功");
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  height: 100%;
  width: 50%;
  margin: 50px auto 0;
  .item {
    display: flex;
    flex-direction: column;
  }
}
</style>