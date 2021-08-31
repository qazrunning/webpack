//环检抽查审核-外检抽查审核信息
<template>
  <div class="external-main">
    <Card>
      <p slot="title">外检抽查审核信息</p>
      <Form label-position="right" :label-width="370">
        <Row>
          <i-col :xxl='8' :xl='12' :lg='24' :md='24' :xs='24' :sm='24'>
            <FormItem :label-width="330" title="车辆机械状况是否良好" label="车辆机械状况是否良好:">{{ExternalForm.VehicleMechanicalCondition}}</FormItem>
            <FormItem :label-width="330" title="曲轴箱通风系统是否正常" label="曲轴箱通风系统是否正常:">{{ExternalForm.CrankcaseVentSystem}}</FormItem>
            <FormItem :label-width="330" title="有无可能影响安全或引起测试偏差的机械故障" label="有无可能影响安全或引起测试偏差的机械故障:">{{ExternalForm.MechanicalFault}}</FormItem>
            <FormItem :label-width="330" title="是否带OBD系统" label="是否带OBD系统:">{{ExternalForm.IsHaveOBD}}</FormItem>
            <FormItem :label-width="330" title="是否关闭车上空调、暖风等附属设备" label="是否关闭车上空调、暖风等附属设备:">{{ExternalForm.CloseAirAirHeater}}</FormItem>
            <FormItem :label-width="330" label="是否适合工况法检测:">{{ExternalForm.IsSuitGKInspect}}</FormItem>
          </i-col>
          <i-col :xxl='8' :xl='12' :lg='24' :md='24' :xs='24' :sm='24'>
            <FormItem :label-width="330" title="排气污染控制装置是否齐全，正常" label="排气污染控制装置是否齐全，正常:">{{ExternalForm.ExhaustPollutionDevice}}</FormItem>
            <FormItem :label-width="330" title="燃油蒸发控制系统是否正常" label="燃油蒸发控制系统是否正常:">{{ExternalForm.EVAP}}</FormItem>
            <FormItem :label-width="330" title="车辆进、排气系统是否有任何泄露" label="车辆进、排气系统是否有任何泄露:">{{ExternalForm.InOrOutputSystemLeaking}}</FormItem>
            <FormItem :label-width="330" title="轮胎气压是否正常" label="轮胎气压是否正常:">{{ExternalForm.TirePressure}}</FormItem>
            <FormItem :label-width="330" title="是否已经中断车辆上可能影响测试正常进行的功能" label="是否已经中断车辆上可能影响测试正常进行的功能:">{{ExternalForm.InterruptInfluenceFunction}}</FormItem>
            <FormItem :label-width="330" label="备注:"></FormItem>

          </i-col>
          <i-col :xxl='8' :xl='12' :lg='24' :md='24' :xs='24' :sm='24'>
            <FormItem title="车辆是否存在烧机油或者严重冒黑烟现象" label="车辆是否存在烧机油或者严重冒黑烟现象:">{{ExternalForm.BurningOilAndSmoke}}</FormItem>
            <FormItem title="车上仪表工作是否正常" label="车上仪表工作是否正常:">{{ExternalForm.VehicleMeter}}</FormItem>
            <FormItem title="车辆的发动机、变速箱和冷却系统等有无明显的液体渗漏" label="车辆的发动机、变速箱和冷却系统等有无明显的液体渗漏:">{{ExternalForm.LiquidLeakage}}</FormItem>
            <FormItem title="轮胎是否干燥、清洁" label="轮胎是否干燥、清洁:">{{ExternalForm.IsTireClear}}</FormItem>
            <FormItem title="车辆油箱和油品是否异常" label="车辆油箱和油品是否异常:">{{ExternalForm.VehicleFuelTank}}</FormItem>
          </i-col>
        </Row>
        <Divider dashed />
        <Row :gutter="32">
          <i-col :sm="6">
            <FormItem label="外检结果:" :label-width="80" :style="{color:(ExternalForm.AppearanceResult==1 ? '#009bff':'#f00')}">{{(ExternalForm.AppearanceResult==0 || ExternalForm.AppearanceResult==1) ? (ExternalForm.AppearanceResult==0 ? '不合格' : '合格') : ''}}</FormItem>
          </i-col>
          <i-col :sm="6">
            <FormItem label="检验员:" :label-width="80">{{ExternalForm.CheckPerson}}</FormItem>
          </i-col>
          <i-col :sm="12">
            <FormItem label="外检时间:" :label-width="80">{{ExternalForm.AppearanceDate | dataFormat("yyyy-MM-dd hh:mm:ss")}}</FormItem>
          </i-col>
        </Row>
      </Form>
      <Form label-position="right" :label-width="140">
        <Row>
          <div class="img-main">
            <Divider orientation="left">外检图片信息</Divider>
            <fieldset v-bind:disabled="Status=='1'" style="border:none;">
              <div>图片列表:</div>
              <div v-if="initialImgs.length>0">
                <viewer :images="initialImgs">
                  <Checkbox-group v-model="checkImgArr" @on-change="checkAllGroupChange">
                    <div v-for="(item, index) in initialImgs" :key="index" class="img_div">
                      <img :src="config.externalImgIP.LLAN+item.FullFileName" @error="onError($event)" />
                      <p style="text-align: center;margin-top: 3px;">
                        {{ item.DisplayName }}
                      </p>
                      <Checkbox :label="item.ID" :disabled="disableImgList.indexOf(item.ID) != -1">
                          <span>不通过</span>
                      </Checkbox>
                    </div>
                  </Checkbox-group>
                </viewer>
              </div>
              <div v-else style="text-align:center;height:60px;">暂无初检图片</div>
            </fieldset>
            <div v-if="SpotCheckForm.CheckStep == '2' && reviewImgs.length>0">
              <div>重拍图片列表:</div>
              <div v-if="reviewImgs.length>0">
                <fieldset style="border:none" :disabled="Status=='1'">
                  <viewer :images="reviewImgs">
                    <Checkbox-group v-model="checkImgArr" @on-change="checkAllGroupChange">
                      <div v-for="(item, index) in reviewImgs" :key="index" class="img_div">
                        <img :src="config.externalImgIP.LLAN+item.FullFileName" @error="onError($event)" />
                        <p>
                          {{ item.DisplayName.split('_')[1]}}
                          <Checkbox :label="item.ID">
                            <span>不通过</span>
                          </Checkbox>
                        </p>
                      </div>
                    </Checkbox-group>
                  </viewer>
                </fieldset>
              </div>
              <div v-else style="text-align:center;height:60px;">暂无复检图片</div>
            </div>
          </div>
        </Row>
        <Row :gutter="32">
          <i-col :sm="10">
            <FormItem label="外检信息审核结果:">
              <fieldset style="border:none" :disabled="Status=='1'">
                <RadioGroup v-model="TailCheckForm.InsExternalAudti" @on-change="selectChange">
                  <Radio :label="item.CodeValue" v-for="(item,index) in AuditList" :key="index">
                    <span>{{item.CodeName}}</span>
                  </Radio>
                </RadioGroup>
              </fieldset>

            </FormItem>
          </i-col>
          <i-col :sm="14">
            <FormItem label="外检信息审核备注:">
              <Input v-model="TailCheckForm.InsExternalAudtiReason" />
            </FormItem>
          </i-col>
        </Row>
      </Form>
    </Card>
  </div>
</template>

<script>
export default {
  props: {
    SpotCheckForm: {
      type: Object,
      default: () => {
        return {};
      }
    },
    ExternalForm: {
      type: Object,
      default: () => {
        return {};
      }
    },
    ExternalImgList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    TailCheckForm: {
      type: Object,
      default: () => {
        return {};
      }
    },
    Status: {
      type: String
    }
  },
  mounted() {
    this.$nextTick(() => {
      if(this.Status == 0) {
        this.TailCheckForm.InsExternalAudti = 1;
      }
    })
  },
  data() {
    return {
      checkImgArr: [], //选中项
      initialImgs: [], //初检图片列表
      reviewImgs: [], //复检图片列表
      config: {},
      AuditList: [
        { CodeValue: 1, CodeName: "通过" },
        { CodeValue: 2, CodeName: "不通过" }
      ],
      ImgForm: [],
      disableImgList: []
    };
  },
  watch: {
    TailCheckForm: {
      handler(newData, oldData) {
        let checkArr = [];
        if (newData.InsExternalNoZWM)
          checkArr = newData.InsExternalNoZWM.split("@");
        checkArr.forEach(t => {
          if (t != "ExtImg") 
            this.checkImgArr.push(+t);
        });
        if(this.Status == 0) {
          this.TailCheckForm.InsExternalAudti = 1;
        }
      }
    },
    ExternalImgList: {
      handler(newData, oldData) {
        this.initialImgs = newData.filter(item => item.IsPicAvailable != 1);
        this.reviewImgs = newData.filter(item => item.IsPicAvailable == 1);
        if(this.reviewImgs.length) {
          this.disableImgList = [];
          this.reviewImgs.forEach(newImg => {
            let index = this.initialImgs.findIndex(oldImg => oldImg.PicType == newImg.PicType)
            this.disableImgList.push(this.initialImgs[index].ID)
          })
          this.disableImgList = [...new Set(this.disableImgList)]
        }
      }
    }
  },
  methods: {
    onError(event) {
      event.target.src = "static/img/imgError.png";
    },
    selectChange() {
      this.$emit("selectChange", "");
    },
    checkAllGroupChange() {
      if (this.checkImgArr.length > 0) this.TailCheckForm.InsExternalAudti = 2;
      else this.TailCheckForm.InsExternalAudti = 1;
      this.$emit("selectChange", "");
    }
  },
  created() {
    this.config = this.$hjconfig;
  }
};
</script>

<style scoped>
fieldset[disabled] {
  -ms-pointer-events: none;
  pointer-events: none;
  cursor: not-allowed;
}
.ivu-radio-wrapper-disabled[disabled] {
  -ms-pointer-events: none;
  pointer-events: none;
  cursor: not-allowed;
}
.external-main .ivu-form-item {
  margin-bottom: 2px;
}

.external-main /deep/ .ivu-form-item-label {
  color: #a0a0a0;
}

.img_div {
  display: inline-block;
  margin: 5px;
}

.img_div img {
  display: block;
  width: 140px;
  height: 100px;
}
</style>
