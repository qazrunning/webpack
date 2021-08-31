<template>
  <div>
      <component v-bind:is="currentTabComponent" :infoObj="infoObj" ></component>
  </div>
</template>

<script>
import YWSHDetail from './YWSHDetail'
import YCDetail from './YCDetail'
import OBDDetail from './OBDDetail'
import LJDetail from './LJDetail/roadCheckDetail'
import HYCDetail from './HYCDetail'
import HJDetail from './HJDetail'
export default {
    name:'trackDetail',
    props:{
        infoObj:{
            type: Object
        }
    },
    components:{
        YWSHDetail,
        YCDetail,
        OBDDetail,
        LJDetail,
        HYCDetail,
        HJDetail
    },
    data(){
        return{
            currentTabComponent:''
        }
    },
    created(){
        let key = this.infoObj.stype;
        switch (key) {
            case "HJ":
                this.currentTabComponent = 'HJDetail'
                break;
            case "HYC":
                this.currentTabComponent = 'HYCDetail'
                break;
            case "LJ":
                this.currentTabComponent = 'LJDetail'
                break;
            case "obd":
                this.currentTabComponent = 'OBDDetail'
                break;
            case "YC":
                this.currentTabComponent = 'YCDetail'
                break;
            case "YWSH":
                this.currentTabComponent = 'YWSHDetail'
                break;
        
            default:
                break;
        }
    }
}
</script>

<style lang="less" scoped>

</style>