<template>
  <Card :bordered="false">
    <Tabs size="small" value="name1">
      <TabPane label="黑匣子数据图表" name="name1">
        <div v-if="resData.length>0" style="height:230px" ref="Inspect_div"></div>
        <div v-else style="height:230px;text-align:center;">暂无数据</div>
      </TabPane>
      <TabPane label="黑匣子数据列表" name="name2">
        <Table size="small" :loading="loading" :columns="columns" :data="dataList" :height="height"></Table>
      </TabPane>
    </Tabs>
  </Card>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      height: 230,
      loading: false,
      resData: [],
      columns: [],
      dataList: []
    };
  },
  methods: {
    async getDetailData() {
      this.formatChart();
    },
    formatChart() {}
  },
  mounted() {}
};
</script>

