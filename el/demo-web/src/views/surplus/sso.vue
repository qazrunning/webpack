<template>
  <div class="fx__box iframediv">
    <div style="display:flex">
      <Button type="primary" @click="test1()" style="margin-right:5px;">单点登录新框架某个项目</Button>
      <Input v-model="newframeText" style="flex:1" />
    </div>
    <div style="margin-top:5px;display:flex">
      <Button type="primary" style="margin-right:5px;" @click="test2()">单点登录旧框架某个项目</Button>
      <Input v-model="oldframeText" style="flex:1" />
    </div>
    <!-- <iframe ref="iframe" style="width:100%;height:100%;border:none" :src="src"></iframe> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      newframeText: "",
      oldframeText: ""
    };
  },
  computed: {
    newframeUrl() {
      let childsys_path = "/index.html";
      let url = `/api/core/sso_to?redirect_uri=${this.newframeText}&path=${childsys_path}`;
      return url;
    },
    oldframeUrl() {
      let childsys_path = "/index.html";
      let url = `/api/core/sso_to?redirect_uri=${this.oldframeText}&path=${childsys_path}`;
      return url;
    }
  },
  mounted() {
    this.newframeText = "http://127.0.0.1:9001/api/public/demo/ssoLogin/entry";
    this.oldframeText = "http://localhost:52396/ssologin.data";
  },
  methods: {
    test1() {
      window.open(this.newframeUrl);
    },
    test2() {
      window.open(this.oldframeUrl);
    }
  }
};
</script>
<style lang="scss" scoped>
.iframediv {
  height: calc(100%);
}
</style>