<template>
  <div>
    <Button type="primary" @click="resetRedis">重置redis消息</Button>
    <Button type="primary" @click="test">测试modal</Button>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    resetRedis() {
      this.$curl.post("/api/demo/notice/resetRedis");
    },
    test() {
      console.log(this.$app)
      let route = this.$app.router.routes.find(
        ele => ele.name === "core-userManager"
      );
      if (route) {
        // let r = await route.component();
        // console.log(r);
        this.$Modal.info({
          render: h => h(route.component)
        });
      }
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
</style>