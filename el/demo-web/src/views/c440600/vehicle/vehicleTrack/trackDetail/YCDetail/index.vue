<template>
  <div :style="{height: ycContentHeight + 'px'}" class="yc-content-box">
    <ycDetailTop :infoObj="infoObj" />
    <Divider dashed />
    <ycDetailVehicleInfo :infoObj="infoObj" />
  </div>
</template>

<script>
import ycDetailTop from "./ycDetailTop";
import ycDetailVehicleInfo from "./ycDetailVehicleInfo";
export default {
  name: "YCDetail",
  props: {
    infoObj: {
      type: Object,
    },
  },
  data(){
    return{
      ycContentHeight:0
    }
  },
  components: {
    ycDetailTop,
    ycDetailVehicleInfo,
  },
  mounted(){
    this.$nextTick(()=>{
      this.ycContentHeight = window.innerHeight * 0.6 ;
    })
  }
};
</script>

<style lang="less" scoped>
.yc-content-box{
  overflow-x:hidden ;
  overflow-y:auto ;
}
</style>
