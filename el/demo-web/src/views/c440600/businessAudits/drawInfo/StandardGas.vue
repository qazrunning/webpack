<template>
  <div class="accept-main">
    <Card>
      <p slot="title">
        标气有效期审核
      </p>
      <Form label-position="right" :label-width="120">
        <Row :gutter="32">
          <i-col :sm="8">
            <FormItem label="标准气体类型:">{{getCDName(gasType, AcceptForm.StandardGasKind)+AcceptForm.StandardGasKind}}</FormItem>
          </i-col>
          <i-col :sm="8">
            <FormItem label="标准气体有效期:">{{AcceptForm.ValidPeriod || ' '}}</FormItem>
          </i-col>
          <i-col :sm="8">
            <FormItem label="上传时间:">{{AcceptForm.UploadTime || ' '}}</FormItem>
          </i-col>
        </Row>
        <Row :gutter="32">
          <i-col :sm="8">
            <FormItem label="站点编号:">{{getCDName(stationList, AcceptForm.StationCode)}}</FormItem>
          </i-col>
          <i-col :sm="8">
            <FormItem label="区编码:">{{AcceptForm.CountyCode?area[AcceptForm.CountyCode]: ''}}</FormItem>
          </i-col>
          <i-col :sm="8">
            <FormItem label="城市编码:">{{AcceptForm.CityCode?area[AcceptForm.CityCode]: ""}}</FormItem>
          </i-col>
        </Row>
      </Form>
    </Card>
  </div>
</template>
<script>
import { getCDData } from "./../../../utils/utils";
export default {
  props: {
    AcceptForm: {
      type: Object
    },
    area: {
      type: Object
    }
  },
  data() {
    return {
      stationList: [],
      gasType: []
    }
  },
  methods: {
    getCDName(list, codeValue) {
      let result = "";
      if (codeValue)
        list.forEach(item => {
          if (item.CodeValue == codeValue)
            result = item.CodeName
        })
      return result;
    },
    async getCDTable() {
      let cdname = [
        {
          tableName: "StationInfo",
          columns: "StationCode as CodeValue, StationName as CodeName",
          where: ``
        },
        {
          tableName: "CD_StandardGasKind",
          columns: "CodeValue, CodeName",
          where: ``
        }
      ];
      await getCDData(this, cdname).then(res => {
        const { data, state } = res;
        if (state) {
          this.stationList = data[0][0].hasOwnProperty('IsAvailable') ? data[0].filter(d => d.IsAvailable == 1) : data[0];
          this.gasType = data[1][0].hasOwnProperty('IsAvailable') ? data[1].filter(d => d.IsAvailable == 1) : data[1];
        }
      });
    },
    //直接从浏览器缓存获取CD表或者从reids
    getDBinfoByMultipte() {
      const self = this;
      if (self.$getDBTable) {
        self.$getDBTable(['StationInfo', 'CD_StandardGasKind']).then(res => {
          self.stationList = JSON.parse(res[0])[0].hasOwnProperty('IsAvailable') ? JSON.parse(res[0]).filter(r => r.IsAvailable == 1) : JSON.parse(res[0]);
          self.gasType = JSON.parse(res[1])[0].hasOwnProperty('IsAvailable') ? JSON.parse(res[1]).filter(r => r.IsAvailable == 1) : JSON.parse(res[1]);
        })
      } else {
        self.getCDTable()
      }
    }
  },
  mounted() {
    this.getDBinfoByMultipte()
  }
}
</script>

<style>
</style>