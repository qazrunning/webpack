<template>
  <div class="detail">
    <Form :model="baseData" :label-width="150">
      <div class="info">
        <div class="info-title">
          <i class="iconfont iconjibenxinxi"></i>
          <span>基本信息</span>
          <Divider class="l" />
        </div>
        <Row>
          <i-col :xxl="12" :xl="24" :lg="24" :md="24" :xs="24" :sm="24">
            <FormItem label="车牌号：">
              <Input v-model="baseData.Vehicleplatenumber" disabled />
            </FormItem>
          </i-col>
          <i-col :xxl="12" :xl="24" :lg="24" :md="24" :xs="24" :sm="24">
            <FormItem label="车架号：">
              <Input v-model="baseData.Vin" disabled />
            </FormItem>
          </i-col>
          <i-col :xxl="12" :xl="24" :lg="24" :md="24" :xs="24" :sm="24">
            <FormItem label="维修厂名称：">
              <Input v-model="baseData.companyname" disabled />
            </FormItem>
          </i-col>
          <i-col :xxl="12" :xl="24" :lg="24" :md="24" :xs="24" :sm="24">
            <FormItem label="送修时间：">
              <DatePicker type="date" v-model="baseData.repairdate" format="yyyy-MM-dd HH:mm:ss" disabled></DatePicker>
            </FormItem>
          </i-col>
          <i-col :xxl="12" :xl="24" :lg="24" :md="24" :xs="24" :sm="24">
            <FormItem label="结算时间：">
              <DatePicker type="date" v-model="baseData.settledate" format="yyyy-MM-dd HH:mm:ss" disabled></DatePicker>
            </FormItem>
          </i-col>
          <i-col :xxl="12" :xl="24" :lg="24" :md="24" :xs="24" :sm="24">
            <FormItem label="送修里程：">
              <Input v-model="baseData.repairmileage" disabled />
            </FormItem>
          </i-col>
          <i-col :xxl="12" :xl="24" :lg="24" :md="24" :xs="24" :sm="24">
            <FormItem label="结算清单编号：">
              <Input v-model="baseData.Costlistcode" disabled />
            </FormItem>
          </i-col>
          <i-col :xxl="24" :xl="24" :lg="24" :md="24" :xs="24" :sm="24">
            <FormItem label="故障描述：">
              <Input type="textarea" v-model="baseData.Faultdescription" :autosize="{ minRows: 2, maxRows: 5 }" disabled />
            </FormItem>
          </i-col>
            <i-col :xxl="24" :xl="24" :lg="24" :md="24" :xs="24" :sm="24">
            <FormItem label="上传人：">
              <Input  v-model="baseData.uploader"  disabled />
            </FormItem>
          </i-col>
               <i-col :xxl="12" :xl="24" :lg="24" :md="24" :xs="24" :sm="24">
            <FormItem label="上传时间：">
              <DatePicker type="date" v-model="baseData.uploadTime" format="yyyy-MM-dd HH:mm:ss" disabled></DatePicker>
            </FormItem>
          </i-col>
        </Row>
      </div>
    </Form>
    <div class="info">
      <div class="info-title">
        <i class="iconfont iconjibenxinxi"></i>
        <span>配件列表</span>
        <Divider class="l" />
      </div>
      <div style="padding-top: 16px">
        <Form :model="item" :label-width="150" v-for="(item, index) in vehiclePartsList" :key="index">
          <Row class="nomargintop">
            <i-col :xxl="12" :xl="24" :lg="24" :md="24" :xs="24" :sm="24">
              <FormItem label="配件名称：">
                <Input v-model="item.partsname" disabled />
              </FormItem>
            </i-col>
            <i-col :xxl="12" :xl="24" :lg="24" :md="24" :xs="24" :sm="24">
              <FormItem label="配件数量：">
                <Input v-model="item.partsquantity" disabled />
              </FormItem>
            </i-col>
            <i-col :xxl="12" :xl="24" :lg="24" :md="24" :xs="24" :sm="24">
              <FormItem label="配件编码：">
                <Input v-model="item.partscode" disabled />
              </FormItem>
            </i-col>
          </Row>
        </Form>
      </div>
    </div>
    <div class="info">
      <div class="info-title">
        <i class="iconfont iconjibenxinxi"></i>
        <span>项目列表</span>
        <Divider class="l" />
      </div>
      <div style="padding-top: 16px">
        <Form :model="item" :label-width="150" v-for="(item, index) in repairProjectsList" :key="index">
          <Row class="nomargintop">
            <i-col :xxl="12" :xl="24" :lg="24" :md="24" :xs="24" :sm="24">
              <FormItem label="维修项目：">
                <Input v-model="item.repairproject" disabled />
              </FormItem>
            </i-col>
            <i-col :xxl="12" :xl="24" :lg="24" :md="24" :xs="24" :sm="24">
              <FormItem label="维修工时：">
                <Input v-model="item.workinghours" disabled />
              </FormItem>
            </i-col>
          </Row>
        </Form>
      </div>
    </div>
    <div class="info">
      <div class="info-title">
        <i class="iconfont iconqita"></i>
        <span>图片资料</span>
        <Divider class="l" />
      </div>
      <div class="imgCon">
        <div class="single" v-for="(item, index) in imgList" :key="index">
          <p>{{ item.FileGroup_Name }}</p>
          <div class="ImgSingle">
            <viewer class="imgView">
              <img :src="item.Url" @error="onError($event)" />
            </viewer>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    baseInfo: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      baseData: {},
      vehiclePartsList: [],
      repairProjectsList: [],
      imgList: [],
      ImgToUploadList: []
    }
  },
  mounted() {
    this.getImgList();
  },
  methods: {
    // 获取维修配件与项目信息
    getDetailData() {
      this.$curl.get('api/hj/IM/getMaintainDetail', {
        RepairVeID: this.baseData.RepairVeID
      }).then(res => {
        if (res.code) {
          this.vehiclePartsList = res.data.partsList;
          this.repairProjectsList = res.data.projectsList;
          let temp = res.data.imgList.map(item => {
            let index = this.ImgToUploadList.findIndex(k => item.FileGroup == k.FileGroup_Code);
            if (index !== -1) {
              item.FileGroup_Name = this.ImgToUploadList[index].FileGroup_Name
            }
            return item
          })
          this.imgList = temp;
        }
      })
    },
    onError(event) {
      event.target.src = "static/img/imgError.png";
    },
    getImgList() {
      this.$curl
        .get("api/hj/IM/getImgToUpload", {
          BusinessType: "77"
        })
        .then((res) => {
          if (res.code) {
            this.ImgToUploadList = res.data.ImgList;
          }
        });
    },
  },
  watch: {
    baseInfo: function (newValue, oldValue) {
      this.baseData = JSON.parse(JSON.stringify(newValue))
      this.getDetailData();
    }
  },
}
</script>

<style lang="scss" scoped>
.detail {
  .info {
    padding: 10px 10px 0;
    &-title {
      span {
        font-size: 16px;
        margin-left: 5px;
      }
      .l {
        margin: 0;
        margin-top: 10px;
      }
      .add {
        margin-left: 8px;
        font-size: 21px;
        font-weight: 700;
        cursor: pointer;
      }
    }
    .ivu-row {
      margin-top: 16px;
    }
  }
  .imgCon {
    display: flex;
    justify-content: flex-start;
    width: 100%;
    flex-wrap: wrap;
    .single {
      margin: 16px 0 0 60px;
      text-align: center;
      font-size: 14px;
      width: 150px;
      p {
        margin-bottom: 6px;
      }
      .icon-size {
        font-size: 35px;
      }
      .upload {
        position: relative;
        // padding: 20px 0;
        text-align: center;
        background: #fff;
        border: 1px dashed #dcdee2;
        border-radius: 4px;
        cursor: pointer;
        height: 90px;
        line-height: 90px;

        &:hover {
          border: 1px dashed #2d8cf0;
        }

        &-input {
          position: absolute;
          border: 1px solid red;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          // visibility: hidden;
          opacity: 0;
          cursor: pointer;
        }
      }
    }
    .ImgSingle {
      height: 90px;
      position: relative;
      .imgView {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          max-width: 100%;
          max-height: 100%;
          cursor: pointer;
        }
      }
      .deleteBtn {
        position: absolute;
        top: 0;
        right: 0;
        width: 20px;
        height: 19px;
        color: orange;
        .ivu-icon {
          cursor: pointer;
        }
      }
    }
  }
}
.nomargintop {
  margin-top: 0 !important;
}
</style>