<template>
  <div style="width:100%;height:94%;">
     <i-col :lg="24" style="height:50px;padding:8px 0px 3px 30px;background-color:#fff">
       <i-col :lg="3">
        <Input
          v-model="inputdata"
          suffix="ios-search"
          @on-enter="changeCount(inputdata)"
          @on-blur="changeCount(inputdata)"
          size="default"
          placeholder="站点名称/区域/状态 关键字检索"
        />
      </i-col>
     </i-col>
     <div> </div>
     <i-col :lg="24" style="height:100%; overflow:auto" class="min-center">

     </i-col>
  </div>  
</template>
<script>
export default {
  name: "integratedfilter",
   props: {
    message: { type: String, default: "" }
  },
  data() {
    return {
      ismore: -1
    };
  },
  methods: {
   
  }
};
</script>

<style>
</style>