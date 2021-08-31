<template>
  <div>
    <div class="fx__module" style="display:flex;flex-direction:column;height:calc(100%);overflow: auto;">
      <div>
        <Button type="primary" @click="testalertError()">测试访问不存在url</Button>
         <Button type="primary" @click="testsql()">测试访问错误的数据库语法</Button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  mounted() {},
  methods: {
    testalertError() {
      this.$curl.get("/api/public/demo/logintitle2").then(res => {
        
      });
    },
    testsql() {
      this.$curl.get("/api/public/demo/pbtestsqlbug").then(res => {
        
      });
    }
  }
};
</script>