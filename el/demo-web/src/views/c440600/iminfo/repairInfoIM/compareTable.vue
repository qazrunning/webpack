<template>
  <div style="overflow: auto">
    <Tabs value="name1">
      <TabPane label="检测结果对比" name="name1">
        <inspection-result :baseInfo="baseInfo" :stationList="stationList" :InspectionMethodList="InspectionMethodList" ref="inspectionresultdata"></inspection-result>
      </TabPane>
      <TabPane label="检测过程对比" name="name2">
        <inspection-process :baseInfo="baseInfo" :stationList="stationList" :InspectionMethodList="InspectionMethodList" ref="inspectionprocessdata"></inspection-process>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
export default {
  components: {
    inspectionResult: () => import('./inspectionResult.vue'),
    inspectionProcess: () => import('./inspectionProcess.vue')
  },
  props: {
    baseInfo: {
      type: Object,
      default: () => { }
    },
    stationList: {
      type: Array,
      default: () => []
    },
    InspectionMethodList: {
      type: Array,
      default: () => []
    },
    //  lastInspectionNum: {
    //    type: String
    // },
  },
  data() {
    return {
      lastInspectionNum: "",
      wayData: [], // 方法数据
      inspectionMethod: "", // 方法
    }
  },
  mounted() {


  },
  computed: {

  },
  methods: {
    getlastInspectionNum(val) {

      this.lastInspectionNum = val
      // console.log('子组件', this.lastInspectionNum);
      this.$refs.inspectionresultdata.getinspectionresultdata(val)
      this.$refs.inspectionprocessdata.getinspectionprocessdata(val)
    }
  },
  watch: {
  }
}
</script>

<style>
</style>