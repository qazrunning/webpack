//过程监管-外检信息
<template>
  <Card class="inspect_main" :bordered="false">
    <div>
      <Tabs size="small" :animated=false value="name1">
        <TabPane label="外检列表" name="name1" style="height:280px;overflow:auto;">
          <div v-if="JSON.stringify(resData) != '{}'">
            <Form label-position="left" :label-width="160">
              <Row>
                <i-col :xxl='8' :xl='12' :lg='8' :md='12' :sm="24">
                  <FormItem title="车辆机械状况是否良好" label="车辆机械状况是否良好：">{{resData.VehicleMechanicalCondition}}</FormItem>
                  <FormItem title="曲轴箱通风系统是否正常" label="曲轴箱通风系统是否正常：">{{resData.CrankcaseVentSystem}}</FormItem>
                  <FormItem title="有无可能影响安全或引起测试偏差的机械故障" label="有无可能影响安全或引起测试偏差的机械故障：">{{resData.MechanicalFault}}</FormItem>
                  <FormItem title="是否带OBD系统" label="是否带OBD系统：">{{resData.IsHaveOBD}}</FormItem>
                  <FormItem title="是否关闭车上空调、暖风等附属设备" label="是否关闭车上空调、暖风等附属设备：">{{resData.CloseAirAirHeater}}</FormItem>
                </i-col>
                <i-col :xxl='8' :xl='12' :lg='8' :md='12' :sm="24">
                  <FormItem title="排气污染控制装置是否齐全，正常" label="排气污染控制装置是否齐全，正常：">{{resData.ExhaustPollutionDevice}}</FormItem>
                  <FormItem title="燃油蒸发控制系统是否正常" label="燃油蒸发控制系统是否正常：">{{resData.EVAP}}</FormItem>
                  <FormItem title="车辆进、排气系统是否有任何泄露" label="车辆进、排气系统是否有任何泄露：">{{resData.InOrOutputSystemLeaking}}</FormItem>
                  <FormItem title="轮胎气压是否正常" label="轮胎气压是否正常：">{{resData.TirePressure}}</FormItem>
                  <FormItem title="是否已经中断车辆上可能影响测试正常进行的功能" label="是否已经中断车辆上可能影响测试正常进行的功能：">{{resData.InterruptInfluenceFunction}}</FormItem>
                </i-col>
                <i-col :xxl='8' :xl='12' :lg='8' :md='12' :sm="24">
                  <FormItem title="车辆是否存在烧机油或者严重冒黑烟现象" label="车辆是否存在烧机油或者严重冒黑烟现象：">{{resData.BurningOilAndSmoke}}</FormItem>
                  <FormItem title="车上仪表工作是否正常" label="车上仪表工作是否正常：">{{resData.VehicleMeter}}</FormItem>
                  <FormItem title="车辆的发动机、变速箱和冷却系统等有无明显的液体渗漏" label="车辆的发动机、变速箱和冷却系统等有无明显的液体渗漏：">{{resData.LiquidLeakage}}</FormItem>
                  <FormItem title="轮胎是否干燥、清洁" label="轮胎是否干燥、清洁：">{{resData.IsTireClear}}</FormItem>
                  <FormItem title="车辆油箱和油品是否异常" label="车辆油箱和油品是否异常：">{{resData.VehicleFuelTank}}</FormItem>
                </i-col>
              </Row>
              <Row>
                <i-col :xxl='8' :xl='12' :lg='8' :md='24' :sm="24">
                  <FormItem label="是否适合工况法检测：">{{resData.IsSuitGKInspect}}</FormItem>
                </i-col>
                <i-col v-show="resData.ExhaustEmissionDevice" :xxl='8' :xl='12' :lg='8' :md='24' :sm="24">
                  <FormItem title="排气管" label="排气管：">
                    <p>{{ resData.ExhaustEmissionDevice }}</p>
                  </FormItem>
                </i-col>
                <i-col v-show="resData.ExhaustEmissionDevice === '异常'" :xxl='8' :xl='12' :lg='8' :md='24' :sm="24">
                  <FormItem title="排气管异常" label="排气管异常：">
                    <p>{{ resData.ExhaustEmissionDevicePL }}</p>
                  </FormItem>
                </i-col>
                <i-col v-show="resData.DualExhaustSystemAndLeaking" :xxl='8' :xl='12' :lg='8' :md='24' :sm="24">
                  <FormItem title="多排气系统/装饰管" label="多排气系统/装饰管：">
                    <p>{{ resData.DualExhaustSystemAndLeaking }}</p>
                  </FormItem>
                </i-col>
                <i-col v-show="resData.DualExhaustSystemAndLeaking === '是'" :xxl='8' :xl='12' :lg='8' :md='24' :sm="24">
                  <FormItem title="拥有多排气系统/装饰管类型" label="拥有多排气系统/装饰管类型：">
                    <p>{{ resData.VentPipe }}</p>
                  </FormItem>
                </i-col>
                <i-col v-show="resData.IsFourWheeler" :xxl='8' :xl='12' :lg='8' :md='24' :sm="24">
                  <FormItem title="是否为四驱车" label="是否为四驱车：">
                    <p>{{ resData.IsFourWheeler }}</p>
                  </FormItem>
                </i-col>
                <i-col v-show="resData.IsHaveExtensionPipe" :xxl='8' :xl='12' :lg='8' :md='24' :sm="24">
                  <FormItem title="是否有延长管" label="是否有延长管：">
                    <p>{{ resData.IsHaveExtensionPipe }}</p>
                  </FormItem>
                </i-col>
                <i-col :xxl='16' :xl='24' :lg='8' :md='24' :sm="24">
                  <FormItem label="备注：">
                    <p>{{resData.Remarks}}</p>
                  </FormItem>
                </i-col>
              </Row>
              <Divider dashed />
            </Form>
            <Form label-position="right" :label-width="160">
              <Row>
                <i-col :xxl='7' :xl='12' :lg='6' :md='12' :sm="24">
                  <FormItem label="外检结果：" :label-width="136" :style="{color:(resData.AppearanceResult==1 ? '#009bff':'#f00')}">{{(resData.AppearanceResult==0 || resData.AppearanceResult==1) ? (resData.AppearanceResult==0 ? '不合格' : '合格') : ''}}</FormItem>
                </i-col>
                <i-col :xxl='8' :xl='12' :lg='8' :md='12' :sm="24">
                  <FormItem label="检验员：" :label-width="141">{{resData.CheckPerson}}</FormItem>
                </i-col>
                <i-col :xxl='9' :xl='24' :lg='10' :md='24' :sm="24">
                  <FormItem label="外检时间：" :label-width="88">{{resData.AppearanceDate | dataFormat("yyyy-MM-dd hh:mm:ss")}}</FormItem>
                </i-col>
              </Row>
            </Form>
          </div>
          <div v-else style="text-align:center;">暂无数据</div>
        </TabPane>
        <TabPane label="图片信息" name="name2">
          <div v-if="ImgData.length>0" style="height:280px;overflow-y:auto;">
            <viewer :images="ImgData" style="display:flex;flex-wrap: wrap;">
              <div v-for="(item, index) in ImgData" :key="index" class="img_div">
                <img :src="config.externalImgIP.LLAN+item.FullFileName" @error="onError($event)">
                <p style="text-align:center;margin-top:5px;">
                  {{ item.DisplayName }}
                </p>
              </div>
            </viewer>
          </div>
          <div v-else style="text-align:center;">暂无图片</div>
        </TabPane>
      </Tabs>
    </div>
  </Card>
</template>

<script>
export default {
  props: {
    ExternalForm: {
      type: Object
    },
    ImgForm: {
      type: Array
    }
  },
  data() {
    return {
      config: {},
      resData: {},
      ImgData: []
    };
  },
  methods: {
    onError(event) {
      event.target.src = "static/img/imgError.png";
    },
  },
  created() {
    this.config = this.$hjconfig;
  },
  watch: {
    ExternalForm: {
      handler(newData, oldData) {
        this.resData = {};
        this.resData = newData;
      },
      immediate: true
    },
    ImgForm: {
      handler(newData, oldData) {
        this.ImgData = [];
        this.ImgData = newData;
      },
      immediate: true
    }
  }
};
</script>

<style scoped>
.inspect_main /deep/ .ivu-tabs-bar {
  margin-bottom: 4px;
}
.inspect_main .ivu-form-item {
  margin-bottom: 2px;
  overflow: hidden;
}

.inspect_main /deep/ .ivu-form-item-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.inspect_main /deep/ .ivu-divider-horizontal {
  margin: 4px 0;
}
.inspect_main /deep/ .ivu-form-item-label {
  color: #a0a0a0;
}
.inspect_main /deep/ .ivu-form-item-content{
  line-height: 3 !important;
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
