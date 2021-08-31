<template>
  <div style="height:100vh;display:flex;align-items:center;justify-content:center;">
      <div>
      <i class="fa fa-exclamation-triangle " style="font-size: 200px;"></i>
      <h1 style="text-align: center;">页面走丢了!!!!</h1>
      <p @click="back" style="text-align: center;font-size: 16px;cursor: pointer;padding-top: 20px;">点我返回上一页</p>
      </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            
        }
    },
    methods:{
    back(){
        this.$router.go(-1);
    },
},
}
</script>

<style>

</style>