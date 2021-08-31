<template>
  <div class="process-data">
    <div v-if="data&&ComputedResult&&UploadResult">
        <div v-if="IUTYPE == 'G'&&data!=null">
          <!-- 加速减速法 -->
          <div class="title">加载减速法 上传结果值</div>
          <Form label-position="right" :label-width="135">
            <Row>
              <i-col span="8">
                <FormItem label="100%点排放结果："><span>{{float2(UploadResult.ER100)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="80%点排放结果："><span>{{float2(UploadResult.ER80)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="80%转速点的氮氧化物NOX:"><span>{{float2(UploadResult.NOX80)}}</span></FormItem>
              </i-col>
            </Row>
          </Form>
          <div class="title">加载减速法 根据过程数据计算结果值</div>
          <Form label-position="right" :label-width="135">
            <Row>
              <i-col span="8">
                <FormItem label="100%点排放结果："><span>{{float2(ComputedResult.ER100)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="80%点排放结果："><span>{{float2(ComputedResult.ER80)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="80%转速点的氮氧化物NOX:"><span>{{float2(ComputedResult.NOX80)}}</span></FormItem>
              </i-col>
            </Row>
          </Form>
          <br>
          <Form label-position="right">
            <Row>
              <i-col span="24" >
                <!-- <FormItem label="结果对比是否在误差范围内：">{{data.Judge=='0'?'否':data.Judge=='1'?'是':''}}</FormItem> -->
              </i-col>
              <i-col span="24" >
                <FormItem label="备注说明：">{{data.Remarks==null?'无':data.Remarks}}</FormItem>
              </i-col>
            </Row>
          </Form>
        </div>
        <div v-else-if="IUTYPE == 'A'&&data!=null">
          <!-- 双怠速法 -->
          <div class="title">双怠速法 上传结果值</div>
          <Form label-position="right" :label-width="140">
            <Row>
              <i-col span="8">
                <FormItem label="低怠速HC结果："><span>{{float2(UploadResult.LIHCR)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="低怠速CO结果："><span>{{float2(UploadResult.LICOR)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="高怠速HC结果："><span>{{float2(UploadResult.HIHCR)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="高怠速CO结果："><span>{{float2(UploadResult.HICOR)}}</span></FormItem>
              </i-col>
            </Row>
          </Form>
          <div class="title">双怠速法 根据过程数据计算结果值</div>
          <Form label-position="right" :label-width="140">
            <Row>
              <i-col span="8">
                <FormItem label="低怠速HC结果："><span>{{float2(ComputedResult.LIHCR)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="低怠速CO结果："><span>{{float2(ComputedResult.LICOR)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="高怠速HC结果："><span>{{float2(ComputedResult.HIHCR)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="高怠速CO结果："><span>{{float2(ComputedResult.HICOR)}}</span></FormItem>
              </i-col>
            </Row>
          </Form>
          <br>
           <Form label-position="right">
            <Row>
              <i-col span="24" >
                <!-- <FormItem label="结果对比是否在误差范围内：">{{data.Judge=='0'?'否':data.Judge=='1'?'是':''}}</FormItem> -->
              </i-col>
              <i-col span="24" >
                <FormItem label="备注说明：">{{data.Remarks==null?'无':data.Remarks}}</FormItem>
              </i-col>
            </Row>
          </Form>
        </div>
        <div v-else-if="IUTYPE == 'C'&&data!=null">
          <!-- 简易瞬态工况法 -->
          <div class="title">简易瞬态工况法 上传结果值</div>
          <Form label-position="right" :label-width="135">
            <Row>
              <i-col span="8">
                <FormItem label="HC排放结果："><span>{{float2(UploadResult.HCER)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="CO排放结果："><span>{{float2(UploadResult.COER)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="NOx排放结果："><span>{{float2(UploadResult.NOXER)}}</span></FormItem>
              </i-col>
            </Row>
          </Form>
          <div class="title">简易瞬态工况法 根据过程数据计算结果值</div>
          <Form label-position="right" :label-width="135">
            <Row>
              <i-col span="8">
                <FormItem label="HC排放结果："><span>{{float2(ComputedResult.HCER)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="CO排放结果："><span>{{float2(ComputedResult.COER)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="NOx排放结果："><span>{{float2(ComputedResult.NOXER)}}</span></FormItem>
              </i-col>
            </Row>
          </Form>
          <br>
          <Form label-position="right">
            <Row>
              <i-col span="24" >
                <!-- <FormItem label="结果对比是否在误差范围内：">{{data.Judge=='0'?'否':data.Judge=='1'?'是':''}}</FormItem> -->
              </i-col>
              <i-col span="24" >
                <FormItem label="备注说明：">{{data.Remarks==null?'无':data.Remarks}}</FormItem>
              </i-col>
            </Row>
          </Form>
        </div>
        <div v-else-if="IUTYPE == 'B'&&data!=null">
          <!-- 稳态工况法 -->
          
          <div class="title">稳态工况法 上传结果值</div>
          <Form label-position="right" :label-width="135">
            <Row>
              <i-col span="8">
                <FormItem label="5025HC排放结果："><span>{{float2(UploadResult.HCER5025)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="5025CO排放结果："><span>{{float2(UploadResult.COER5025)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="5025NO排放结果："><span>{{float2(UploadResult.NOER5025)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="2540HC排放结果："><span>{{float2(UploadResult.HCER2540)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="2540CO排放结果："><span>{{float2(UploadResult.COER2540)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="2540NO排放结果："><span>{{float2(UploadResult.NOER2540)}}</span></FormItem>
              </i-col>
            </Row>
          </Form>
          <div class="title">稳态工况法 根据过程数据计算结果值</div>
          <Form label-position="right" :label-width="135">
            <Row>
              <i-col span="8">
                <FormItem label="5025HC排放结果："><span>{{float2(ComputedResult.HCER5025)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="5025CO排放结果："><span>{{float2(ComputedResult.COER5025)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="5025NO排放结果："><span>{{float2(ComputedResult.NOER5025)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="2540HC排放结果："><span>{{float2(ComputedResult.HCER2540)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="2540CO排放结果："><span>{{float2(ComputedResult.COER2540)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="2540NO排放结果："><span>{{float2(ComputedResult.NOER2540)}}</span></FormItem>
              </i-col>
            </Row>
          </Form>
          <br>
          <Form label-position="right">
            <Row>
              <i-col span="24" >
                <!-- <FormItem label="结果对比是否在误差范围内：">{{data.Judge=='0'?'否':data.Judge=='1'?'是':''}}</FormItem> -->
              </i-col>
              <i-col span="24" >
                <FormItem label="备注说明：">{{data.Remarks==null?'无':data.Remarks}}</FormItem>
              </i-col>
            </Row>
          </Form>

        </div>
        <div v-else-if="IUTYPE == 'F'&&data!=null">
          <!-- 自由加速法 -->
          <div class="title">自由加速法 上传结果值</div>
          <Form label-position="right" :label-width="135">
            <Row>
              <i-col span="8">
                <FormItem label="排放结果1："><span>{{float2(UploadResult.ER1)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="排放结果2："><span>{{float2(UploadResult.ER2)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="排放结果3："><span>{{float2(UploadResult.ER3)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="排放平均值："><span>{{float2(UploadResult.ERA)}}</span></FormItem>
              </i-col>      
            </Row>
          </Form>
          <div class="title">自由加速法 根据过程数据计算结果值</div>
          <Form label-position="right" :label-width="135">
            <Row>
              <i-col span="8">
                <FormItem label="排放结果1："><span>{{float2(ComputedResult.ER1)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="排放结果2："><span>{{float2(ComputedResult.ER2)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="排放结果3："><span>{{float2(ComputedResult.ER3)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="排放平均值："><span>{{float2(ComputedResult.ERA)}}</span></FormItem>
              </i-col>      
            </Row>
          </Form>
          <br>
          <Form label-position="right">
            <Row>
              <i-col span="24" >
                <!-- <FormItem label="结果对比是否在误差范围内：">{{data.Judge=='0'?'否':data.Judge=='1'?'是':''}}</FormItem> -->
              </i-col>
              <i-col span="24" >
                <FormItem label="备注说明：">{{data.Remarks==null?'无':data.Remarks}}</FormItem>
              </i-col>
            </Row>
          </Form>
        </div>
    </div>
    <div v-else style="text-align: center;">暂无检测数据</div>
  </div>
</template>

<script>
export default {
    props: {
        InspectionNum: {
        type: String
        },
        IUTYPE: {
        type: String
        },
    },
    data() {
        return {
          data:null,
          ComputedResult:null,
          UploadResult:null,
        }
    },
    methods:{
        getresultData(){
            let param ={
                InspectionNum:this.InspectionNum,
                IUTYPE:this.IUTYPE
            }
            this.$curl.get('api/hj/getResultDBInfo',{param}).then(res=>{
                console.log(res);
                if(res.code&&res.data){
                  this.data = res.data
                  let ComputedResult = JSON.parse(res.data.ComputedResult)
                  let UploadResult = JSON.parse(res.data.UploadResult)
                  this.ComputedResult = ComputedResult
                  this.UploadResult = UploadResult
                }else{
                  this.data =null
                  this.ComputedResult = null
                  this.UploadResult = null
                }
            })
        },
        float2(val) {
          val = Number(val)
          return val.toFixed(2)
        }
    },
    watch:{
        InspectionNum(val, oldVal) {
            //普通的watch监听
            console.log(val, oldVal)
            this.$nextTick(() => {
                this.getresultData()
            })
           
        }
    }
}
</script>
<style lang="scss" scoped>
.ivu-form-item {
  margin-bottom: 0px;
  height: 34px;
}
.process-data {
  // border: 1px solid red;
  padding: 10px;
  margin-right: 7px;

  span {
    display: inline-block;
    width: 100px;
    height: 33px;
    border-bottom: 1px solid #515a6e;
    padding-left: 10px;
  }
  .title {
    width: 100%;
    text-align: center;
    font-size: 14px;
    margin-bottom: 4px;
    font-weight: 700;
  }
}
</style>