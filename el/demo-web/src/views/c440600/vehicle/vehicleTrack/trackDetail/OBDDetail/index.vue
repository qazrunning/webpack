<template>
  <div>
    <Row>
      <Col span="24">
        <Table
          size="large"
          :loading="loading"
          :columns="columns1"
          :data="OBDDetailList"
        >
         <template slot-scope="{ row }" slot="AlarmContent">
            <span>{{row.AlarmContent}} ppm</span>
        </template>
        </Table>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  name: "",
  props: {
    infoObj: {
      type: Object,
    },
  },
  data() {
    return {
      loading: false,
      OBDDetailList: [],
      columns1: [
        {
          title: "报警时间",
          key: "AlarmDate",
          align: "center",
        },
        {
          title: "报警内容",
          slot: "AlarmContent",
          align: "center",
        }
      ],
    };
  },
  methods: {
    async getOBDdetail() {
      let params = {
        VLPN: this.infoObj.VLPN,
        VLPNColor: this.infoObj.VLPNColor,
      };
      let res = await this.$curl.get("api/hj/getVehicleOBDInfo", {
        params: JSON.stringify(params),
      });
      if (res.state == 1) {
        this.OBDDetailList = res.data;
      }
    },

    async init() {
      this.loading = true;
      await this.getOBDdetail();
      this.loading = false;
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="less" scoped></style>
