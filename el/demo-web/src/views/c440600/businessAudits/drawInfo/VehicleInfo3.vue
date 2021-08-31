//车辆关键信息修改审核-车辆信息--变更信息
<template>
  <div class="vehicle-main">
    <Card>
       <Table border :columns="columns1" :data="data1"></Table>
    </Card>
  </div>
</template>

<script>
export default {
  props: {
    VehicleForm: {
      type: Object,
      required: true
    },
    initform:{
      type: Object,
      required: true
    }
  },
  data() {
    return {
      columns1: [
        {
          title: "关键修改信息",
          key: "Name"
        },
        {
          title: "修改前",
          key: "oldValue",
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color:'#f00'  
                }
              },
              params.row.oldValue
            );
          }
        },
        {
          title: "修改后",
          key: "newValue",
          render: (h, params) => {
          return h(
            "span",
            {
              style: {
                color:'#2d8cf0'  
              }
            },
            params.row.newValue
          );
        }
        }
      ],
      data1: []
    };
  },
  mounted() {
    // console.log(this.VehicleForm);
    // console.log(this.initform);
  },
  methods:{
    isJSON(str) {
      if (typeof str == 'string') {
          try {
              JSON.parse(str);
              return true;
          } catch(e) {
              return false;
          }
      }
    }
  },
  watch: {
    VehicleForm: function(vehicleInfo) {
      if(!vehicleInfo) return;
      let columns = [
        { Name: "车牌号", column: "VLPN" },
        { Name: "车牌颜色", column: "VLPNColor" },
        { Name: "车架号", column: "VIN" },
        { Name: "车型号", column: "IUVTYPE" }
      ];
      if(this.isJSON(vehicleInfo.Remarks)){
        const oldvehicle=JSON.parse(vehicleInfo.Remarks);
        this.data1 = [];
        for (var t in columns) {
          if (columns.hasOwnProperty(t) === true){  //只遍历自身属性 
            if (columns[t].column == "VLPNColor") {
              this.data1.push({
                Name: columns[t].Name,
                oldValue: this.initform.cd_vlpnColor[oldvehicle[columns[t].column]] || '',
                newValue: this.initform.cd_vlpnColor[vehicleInfo[columns[t].column]] || ''
              });
            } else {
              this.data1.push({
                Name: columns[t].Name,
                oldValue:oldvehicle[columns[t].column],
                newValue: vehicleInfo[columns[t].column]
              });
            }
          }
        }
      }
      
    }
  }
};
</script>
<style scoped>
.vehicle-main .ivu-form-item {
  margin-bottom: 2px;
}

.vehicle-main /deep/ .ivu-form-item-label {
  color: #a0a0a0;
}
</style>

