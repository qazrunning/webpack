<template>
  <div class="content" ref="content">
    <!-- 内容 -->
    <div class="main">
      <!-- 左边 -->
      <div class="main_left fx__bgcolor">
        <div class="item-box" style="display: flex">
          <!-- <span >车辆号</span> -->
          <Input v-model="conditions.searchVehicle.cphm" placeholder="请输入车牌号码" style="flex: 1; margin: 6px" />
          <Select v-model="conditions.searchVehicle.cpys" clearable placeholder="车牌颜色" style="flex: 1; margin: 6px">
            <Option v-for="(item, index) in selectDict.carColorList" :value="item.CodeValue" :key="index">{{
              item.CodeName
            }}</Option>
          </Select>
        </div>
        <div class="item-box" style="display: flex">
          <!-- <span >车架号</span> -->
          <Input
            v-model="conditions.searchVehicle.vin"
            style="flex: 1; margin: 6px"
            clearable
            placeholder="车架号"
          />
          <div style="flex: 1; margin: 6px">
            <Button type="primary" @click="handleReset">重置</Button>
            <Button
              type="primary"
              style="margin-left: 6px"
              @click="searchVehicleList"
              >检索</Button
            >
          </div>
        </div>
        <!-- 车辆查询列表 -->
        <div class="line-divide fx__line_divide"></div>
        <div v-if="!results.vehicleList.length" style="margin: 0 auto">暂无数据</div>
        <div
          style="
            overflow: hidden auto;
            height: 100%;
            position: relative;
            padding: 12px;
          "
          class="gridlayout"
        >
        <div v-for="(item, index) in results.vehicleList" :key="index" @click="initVehicle(item)">
          <Card
            shadow
            class="gridlayoutgroup fx__item"
            :class="{ 'fx__item-selected': item.ID == ID }" 
          >
            <div class="card_title" >
              <div class="card_tit_left fx__simpleline">
                <span title="车牌号" class="fx__text_middle">{{
                  item.VLPN || "无车牌"
                }}</span>
                <div class="car_tit_info">
                  <div title="车辆类型" v-if="item.carType" class="info_item">
                    {{ selectDict.gavtypeMap[item.GAVType] }}
                  </div>
                  <div title="燃料类型" class="info_item">
                    {{ selectDict.fuelTypeMap[item.FuelType] }}
                  </div>
                </div>
              </div>
              <span title="车架号">&nbsp;{{ item.VIN }}</span>
            </div>
          </Card>
        </div>
        </div>
      </div>
      <!-- 右边 -->
      <div class="main_right fx__box">
        <!-- <vehicleShapeAudit :vehicleInfo="results.vehicleInfo" :key="results.vehicleInfo.VehicleID"/> -->
        <vehicleShapeAudit :vehicleInfo="results.vehicleInfo" :statusV="childrenStatus" @initVehicle="initVehicle" @changeStatus="changeStatus"/>
      </div>
    </div>
  </div>
</template>

<script>
import vehicleShapeAudit from "./vehicleShapeAudit";
export default {
  //   name: "content",
  components: { vehicleShapeAudit },
  data() {
    return {
      conditions:{
        searchVehicle:{
          cphm:'',
          cpys:'',
          vin:''
        }
      },
      selectDict:{
        
      },
      results:{
        vehicleList:[],
        vehicleInfo:{}
      },
      childrenStatus: {//子组件属性
        typeofAudit:"1",//车型审核类型 1： 方式1；2：方式二
        GASM:false,//是否公安扫描
        IsChangeHasCCA:'',//如果改变三元催化装置，则提示预警
        isSave:true,//是否可以保存
        canSelectInspectionNature: true,
        ESPOrganizationInfoList: [],
      },
      heightPM: 0, //屏幕高度
      ID: 0,
      carData: [], //车辆列表
      carColorList: [], //车牌颜色列表
    };
  },
  created(){
    this.initSelectDict();
  },
  mounted() {
    // this.load();
    console.log(this.$GY_ARRAY('cd_vlpncolor'));
    window.addEventListener("resize", this.getHeight);
    this.$nextTick(() => {
      this.getHeight();
    });
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight);
  },

  // 方法集合
  methods: {
    //改变子状态
    changeStatus(key,value){
      this.childrenStatus[key]=value;
    },
    //初始化下拉框
    initSelectDict(){
      this.selectDict={//初始化下拉框
        carColorList:this.$GY_ARRAY('cd_vlpncolor'),
        fuelTypeMap:this.$GY_MAP('cd_fueltype'),
        gavtypeMap:this.$GY_MAP('cd_gavtype')
      }
    },
    //初始化车辆
    initVehicle(item){
      this.childrenStatus=this.$options.data().childrenStatus;
      // this.results.vehicleInfo=item;
      if(item!=null&&item.VehicleID!=null){
        this.$curl.get('/api/common/query/searchVehicleDetailList',{VehicleID:item.VehicleID}).then(res=>{
            if(res.code==0){
              if(res.data.length>0){
                this.results.vehicleInfo=res.data[0];
              }
            }
        })
      }else{
        this.results.vehicleInfo=item;
      }
      
      // this.openImgForm(item.VehicleID);
    },
    //打开图片列表
    openImgForm(VehicleID){
      let params = {
            ID: VehicleID,
            TYPE: '20',
            OP: '3'
        };
      this.$curl.get('/api/c440600/uploadFile/UploadFileData/GetBusinessFileInfo',params).then(res=>{
          if(res.code==0){
            
          }else{
            this.$Message.error(res.msg);
          } 
      });
    },
    //重置
    handleReset(){
      this.conditions.searchVehicle={
          cphm:'',
          cpys:'',
          vin:''
        };
    },
    //查询车辆信息
    searchVehicleList(){
      this.$curl.get('/api/common/query/searchVehicleList',this.conditions.searchVehicle).then(res=>{
          console.log(res);
          if(res.code==0){
            this.results.vehicleList=res.data;
            if(res.data.length>0){
              // this.results.vehicleInfo=res.data[0];
              this.$curl.get('/api/common/query/searchVehicleDetailList',{VehicleID:res.data[0].VehicleID}).then(res=>{
                  if(res.code==0){
                    if(res.data.length>0){
                      this.results.vehicleInfo=res.data[0];
                    }
                  }
              })
            }
          }else{
            this.results.vehicleList=[];
          } 
      })
    },
    // 重置
    handleReset() {},

    // 筛选
    handleSearch() {},

    // 获取屏幕高度
    getHeight() {
      this.heightPM = this.$refs.content.offsetHeight; //屏幕高度
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.main {
  display: flex;
  flex: 1;
  overflow: auto;
  position: relative;
  padding-top: 16px;
}
.main_left {
  overflow: auto;
  display: flex;
  flex-direction: column;
  height: calc(100%);
  width: calc(23%);
  min-width: 310px;
  margin-right: 16px;
  transition: all 0.3s ease;
  overflow: hidden auto;
}

.main_right {
  flex: 1;
  overflow: hidden;
  transition: all 0.3s ease;

  //padding-right: 5px;    //是否给滚动条留空
  &:hover {
    overflow-y: overlay;
  }
}

.gridlayout {
  overflow: hidden;
  padding-right: 5px; //给滚动条留空
  display: flex;
  flex-direction: column;
  flex: 1;

  &:hover {
    overflow-y: overlay;
  }

  .gridlayoutgroup {
    cursor:pointer;
    border: none;
    padding: 6px 3px;
    .card_title {
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      .card_tit_left {
        display: flex;
        flex: 1;
        align-items: center;
        .car_tit_info {
          display: flex;
          .info_item {
            font-size: 12px;
            border: 1px solid;
            border-radius: 10px;
            height: 20px;
            line-height: 18px;
            margin-left: 6px;
            padding: 0 6px;
          }
        }
      }
      .card_tit_right {
        .monitorRes {
          font-family: STXingkai;
          display: block;
          font-size: 25px;
          font-weight: bold;
          height: 30px;
          width: 75px;
          text-align: right;
        }
      }
    }
    //滚动条不超出
    &:first-child {
      margin: 1px 0 4px 1px;
    }

    &:last-child {
      margin: 4px 0 4px 1px;
    }
  }
}

// /deep/.ivu-tabs .ivu-tabs-content-animated {
//   height: 95% !important;
// }
</style>
