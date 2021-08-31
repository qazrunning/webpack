<template>
  <fxEasylogin></fxEasylogin>
</template>
<script>

export default {
  data() {
    return {
      title: ""
    };
  },
  mounted() {
    // this.$curl.get("/api/public/demo/logintitle").then(res => {
    //   this.title = res.data;
    // });
  }
};
</script>