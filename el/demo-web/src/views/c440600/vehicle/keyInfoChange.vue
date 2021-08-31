<template>
  <div  style="overflow: hidden auto;height:100%;" class="whole-div" ref='table'>
    <Table border :columns="colName" :data="keyData" size="large" :height="height" />
  </div>
</template>
<script>
export default {
  name: "keyInfoChange",
  data() {
    return {
      colName: [
        {
          title: "数据表",
          key: "SOURCE_TABLE",
          minWidth: 100
        },
        {
          title: "修改内容",
          key: "LOG_MSG",
          className: "modContent-row",
          minWidth: 200, 
          render: (h, p) => {
            var html = "";
            var titile_list = p.row.LOG_MSG.split(";");
            titile_list.map(e => {
              if (e)  html += "<li style='line-height:18px;list-style-type:decimal;margin-bottom:4px'> " + e + "</li>"; 
            });
            return h("div", {
              domProps: {
                innerHTML: html
              }
            });
          }
        },
        {
          title: "登录用户",
          key: "CHANGER",
          minWidth: 100
        },
        {
          title: "修改时间",
          key: "CHANGE_TIME",
          minWidth: 200
        },
        {
          title: "源信息唯一标识",
          key: "SOURCE_ID",
          minWidth: 100
        }
      ],
      height: 0,
      keyData: []
    };
  },
  props: {
    Vecid: {
      type: Number
    }
  },
  methods: {
    getInfo() {
      const _this = this;
      let vehicleid = this.Vecid.toString();
      this.$curl
        .get("api/hj/getkeyInfoChange", { params: vehicleid })
        .then(res => {
          _this.keyData = res.data;
        })
        .catch(e => {});
    },
    setHeight() {
      this.height = this.$refs.table.offsetHeight - 33;
    }
  },
  mounted() {
    this.setHeight();
    window.addEventListener("resize", this.setHeight);
  },
  destroyed() {
    window.removeEventListener("resize", this.setHeight);
  }
};
</script>
<style lang="less" scoped>
.whole-div /deep/ .modContent-row {
  padding-top: 8px;
  // line-height: 13px;
}
// .whole-div /deep/ .ivu-tabs-bar {
//   margin-bottom: 0;
// }
// .whole-div{
//   margin-bottom: 45px;
// }
</style>