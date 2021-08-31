<template>
  <div class="fileInfo" style="overflow:hidden auto;width:100%;padding:0 10px 0">
    <div>
      <Row v-if="newImgInfo.length!=0">
        <div v-for="(item, index) in newImgInfo" :key="index" class="imgBox clearfix">
          <i-col :gutter="16" :xxl="12" :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
            <p>
              <span>{{returncodename(cddata.CD_BusinessType,item.BusinessType)}}</span>
              <span style="cursor: pointer;color:#5cadff;float:right;margin-left:10px" @click="getCurrentVehicleImg(item.BusinessType)">[历史图片]</span>
              <span style="float:right;font-weight:400">{{item.UploadFileTime}}</span>
              <span style="float:right;font-weight:400">{{item.UploadFileUser}} /</span>
              <span style="float:right;font-weight:400">{{returncodename(cddata.CD_FileGroup,item.FileGroup)}} /</span>
            </p>
            <viewer :images="newImgInfo">
              <img :src="item.Url" :key="index" style="width:333px;margin-right:6px" @error="onError($event)" />
            </viewer>
          </i-col>
        </div>
      </Row>
      <p v-else style="font-weight:400;font-size:12px;text-align:center">暂无相关数据</p>
    </div>
    <!-- 历史图片 -->
    <Modal v-model="isshowHistoryImg" :width="800">
      <viewer :images="photo" style="display:flex;justify-content: space-between;flex-wrap: wrap;">
        <div style="max-height:600px;overflow:auto;width:800px;margin-top:20px">
          <div v-for="(item, index) in photo" :key="index" style="display:inline-block;width:380px">
            <p style="height:38px;line-height:38px;font-size:14px;">{{returncodename(cddata.CD_BusinessType,item.BusinessType)}} / {{item.UploadFileUser}} / {{item.UploadFileTime}}</p>
            <img :src="item.Url" :key="index" style="width:80%;marign-right:4px;" @error="onError($event)" />
          </div>
        </div>
      </viewer>
      <div slot="footer" style="display:none"></div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: "dataView",
  props: {
    Vecid: {
      type: Number
    },
    cddata: {
      type: Object
    }
  },
  data() {
    return {
      photo: [], //历史图片数组
      n: 1, //控制多个图片时动态改变每个图片宽度
      isshowHistoryImg: false, //历史图片的显示与隐藏
      newImgInfo: [] //最新图片信息
    };
  },
  methods: {
    onError(event) {
      event.target.src = "static/img/imgError.png";
    },
    //获取当前车辆提交的相关图片信息
    getCurrentVehicleImg(type) {
      // this.newImgInfo = [];
      const param = {
        VehicleID: this.Vecid,
        BusinessType: type
      };
      this.$curl
        .post("api/hj/getReportAndDataImg", param)
        .then(res => {
          const { data } = res;
          if (data) {
            if (!type) {
              this.newImgInfo = data;
              this.photoNum = data.length;
            } else {
              this.isshowHistoryImg = true;
              this.photo = data;
            }
          }
        })
        .catch(error => { });
    },
    //过滤数据
    returncodename(namelist, codevalue) {
      if (!namelist || namelist.length == 0) return codevalue;
      let CodeName = "";
      namelist.forEach(item => {
        if (item.CodeValue == codevalue) CodeName = item.CodeName;
      });
      return CodeName;
    }
  },
  mounted() {
    this.getCurrentVehicleImg();
  }
};
</script>

<style lang="less" scoped>
.imgBox {
  text-align: left;
  width: 100%;
  margin: 0px 6px 6px 0px;
  .imgInfo {
    float: left;
    box-sizing: border-box;
    padding: 4px;
  }
}
.fileInfo {
  img {
    border-radius: 4px;
    width: 100%;
  }
  /deep/ p {
    text-align: left;
    padding: 0 4px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    font-weight: bold;
    span {
      margin-right: 6px;
    }
    span:nth-last-of-type(4) {
      float: right;
    }
  }
}

/deep/ .ivu-modal-wrap {
  z-index: 1500 !important;
}
/deep/ .ivu-modal-mask {
  z-index: 1500 !important;
}
</style>    

