<template>
  <div class="process-data">
    <div v-if="hasData">
      <div v-for="(item,index) in InspectionInfo" :key="index">
        <div v-if="item.IUTYPE == 'G'&&item.data!=null">
          <!-- 加速减速法 -->
          <div class="title">加载减速法</div>
          <Form label-position="right" :label-width="135">
            <Row>
              <i-col span="8">
                <FormItem label="排放限值："><span>{{float2(item.data.EL)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="排放判定："><span>{{getCodeName(item.data.ED, resultType)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="最大轮边功率："><span>{{float2(item.data.MWP)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="100%点排放结果："><span>{{float2(item.data.ER100)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="80%点排放结果："><span>{{float2(item.data.ER80)}}</span></FormItem>
              </i-col>
            </Row>
          </Form>
        </div>
        <div v-else-if="item.IUTYPE == 'A'&&item.data!=null">
          <!-- 双怠速法 -->
          <div class="title">双怠速法</div>
          <Form label-position="right" :label-width="140">
            <Row>
              <i-col span="8">
                <FormItem label="低怠速HC限值："><span>{{float2(item.data.LIHCL)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="低怠速HC结果："><span>{{float2(item.data.LIHCR)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="低怠速HC判定："><span>{{getCodeName(item.data.LIHCD, resultType)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="低怠速CO限值："><span>{{float2(item.data.LICOL)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="低怠速CO结果："><span>{{float2(item.data.LICOR)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="低怠速CO判定："><span>{{getCodeName(item.data.LICOD, resultType)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="高怠速HC限值："><span>{{float2(item.data.HIHCL)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="高怠速HC结果："><span>{{float2(item.data.HIHCR)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="高怠速HC判定："><span>{{getCodeName(item.data.HIHCD, resultType)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="高怠速CO限值："><span>{{float2(item.data.HICOL)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="高怠速CO结果："><span>{{float2(item.data.HICOR)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="高怠速CO判定："><span>{{getCodeName(item.data.HICOD, resultType)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="过量空气系数限值："><span>{{float2(item.data.EACL)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="过量空气系数结果："><span>{{float2(item.data.EACR)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="过量空气系数判定："><span>{{getCodeName(item.data.EACD, resultType)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="暖机转速："><span>{{float2(item.data.NSRotateSpeedLimit)}}</span></FormItem>
              </i-col>
            </Row>
          </Form>
        </div>
        <div v-else-if="item.IUTYPE == 'C'&&item.data!=null">
          <!-- 简易瞬态工况法 -->
          <div class="title">简易瞬态工况法</div>
          <Form label-position="right" :label-width="135">
            <Row>
              <i-col span="8">
                <FormItem label="HC排放限值："><span>{{float2(item.data.HCEL)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="HC排放结果："><span>{{float2(item.data.HCER)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="HC排放判定："><span>{{getCodeName(item.data.HCED, resultType)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="CO排放限值："><span>{{float2(item.data.COEL)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="CO排放结果："><span>{{float2(item.data.COER)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="CO排放判定："><span>{{getCodeName(item.data.COED, resultType)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="NOx排放限值："><span>{{float2(item.data.NOXEL)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="NOx排放结果："><span>{{float2(item.data.NOXER)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="NOx排放判定："><span>{{getCodeName(item.data.NOXED, resultType)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="HC+NOx排放限值："><span>{{float2(item.data.HCNOXEL)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="HC+NOx排放结果："><span>{{float2(item.data.HCNOXER)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="HC+NOx排放判定："><span>{{getCodeName(item.data.HCNOXED, resultType)}}</span></FormItem>
              </i-col>
            </Row>
          </Form>
        </div>
        <div v-else-if="item.IUTYPE == 'B'&&item.data!=null">
          <!-- 稳态工况法 -->
          <div class="title">稳态工况法</div>
          <Form label-position="right" :label-width="135">
            <Row>
              <i-col span="8">
                <FormItem label="5025HC排放限值："><span>{{float2(item.data.HCEL5025)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="5025HC排放结果："><span>{{float2(item.data.HCER5025)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="5025HC排放判定："><span>{{getCodeName(item.data.HCED5025, resultType)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="5025CO排放限值："><span>{{float2(item.data.COEL5025)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="5025CO排放结果："><span>{{float2(item.data.COER5025)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="5025CO排放判定："><span>{{getCodeName(item.data.COED5025, resultType)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="5025NO排放限值："><span>{{float2(item.data.NOEL5025)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="5025NO排放结果："><span>{{float2(item.data.NOER5025)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="5025NO排放判定："><span>{{getCodeName(item.data.NOED5025, resultType)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="2540HC排放限值："><span>{{float2(item.data.HCEL2540)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="2540HC排放结果："><span>{{float2(item.data.HCER2540)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="2540HC排放判定："><span>{{getCodeName(item.data.HCED2540, resultType)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="2540CO排放限值："><span>{{float2(item.data.COEL2540)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="2540CO排放结果："><span>{{float2(item.data.COER2540)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="2540CO排放判定："><span>{{getCodeName(item.data.COED2540, resultType)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="2540NO排放限值："><span>{{float2(item.data.NOEL2540)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="2540NO排放结果："><span>{{float2(item.data.NOER2540)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="2540NO排放判定："><span>{{getCodeName(item.data.NOED2540, resultType)}}</span></FormItem>
              </i-col>
            </Row>
          </Form>
        </div>
        <div v-else-if="item.IUTYPE == 'F'&&item.data!=null">
          <!-- 自由加速法 -->
          <div class="title">自由加速法</div>
          <Form label-position="right" :label-width="135">
            <Row>
              <i-col span="8">
                <FormItem label="排放结果1："><span>{{float2(item.data.ER1)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="排放结果2："><span>{{float2(item.data.ER2)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="排放结果3："><span>{{float2(item.data.ER3)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="排放限值："><span>{{float2(item.data.EL)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="排放平均值："><span>{{float2(item.data.ERA)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="排放判定："><span>{{getCodeName(item.data.ED, resultType)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="额定转速："><span>{{float2(item.data.RotateSpeedLimit)}}</span></FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="实测转速："><span>{{float2(item.data.ActualRotateSpeed)}}</span></FormItem>
              </i-col>         
            </Row>
          </Form>
        </div> 
      </div>
      
    </div>
    <div v-else style="text-align: center;">暂无检测数据</div>
  </div>
</template>

<script>
export default {
  props: {
    InspectionInfo: {
      required: true
    },
    IUTYPE: {
      required: true
    }
  },
  data() {
    return {
      resultType: [
        { CodeValue: 0, CodeName: '不合格' },
        { CodeValue: 1, CodeName: '合格' },
      ],
      hasData: false,
      method_a: false,
      method_b: false,
      method_c: false,
      method_f: false,
      method_g: false,
      data_a: {},
      data_b: {},
      data_c: {},
      data_f: {},
      data_g: {},
    }
  },
  methods: {
    getCodeName(code, codeForm) {
      for (let i = 0; i < codeForm.length; i++) {
        if (code == codeForm[i].CodeValue) return codeForm[i].CodeName
      }
    },
    float2(val) {
      val = Number(val)
      return val.toFixed(2)
    }
  },
  watch: {
    InspectionInfo: {
      handler: function(data) {
        this.method_a = false;
        this.method_b = false;
        this.method_c = false;
        this.method_f = false;
        this.method_g = false;
        if (JSON.stringify(data) !== '{}' && data !== null) {
          this.hasData = true
          data.forEach(item => {
            switch (item.IUTYPE) {
              case 'B': this.method_b = true;this.data_b = item.data; break;
              case 'C': this.method_c = true;this.data_c = item.data; break;
              case 'G': this.method_g = true;this.data_g = item.data; break;
              case 'F': this.method_f = true;this.data_f = item.data; break;
              case 'A': this.method_a = true;this.data_a = item.data; break;
              default: break;
            }
          })
        } else {
          this.hasData = false
        }
      },
      immediate: true
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