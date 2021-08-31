<template>
  <div class="main" ref="main">
    <div class="searchDiv">
      <Input v-model="selectData" placeholder="按M站名称/M站编码搜索..." clearable style="width:200px; margin: 0 20px" />
      <Button type="primary" style="margin-right:5px" @click="searchfactoryData">检索</Button>
      <Button type="primary" style="float:right" @click="exportData">导出</Button>
    </div>
    <div class="mainBody">
      <Table :columns="factoryInfo" :data="factoryData" :height="height" :loading="loading"></Table>
      <Page :total="total" :page-size="pageSize" show-total show-sizer @on-change="changePage" @on-page-size-change="changSize" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      factoryInfo: [
        {
          title: "维修企业名称",
          key: "companyname",
          align: "center",
          minWidth: 50
        }, {
          title: "维修企业编号",
          key: "companyuniquecode",
          align: "center",
          minWidth: 50
        }, {
          title: "统一社会信用编码",
          key: "unifiedcreditcode",
          align: "center",
          minWidth: 50
        }, {
          title: "维修企业地址",
          key: "address",
          align: "center",
          minWidth: 100
        }, {
          title: "企业联系人姓名",
          key: "companylinkmanname",
          align: "center",
          minWidth: 50
        },
        {
          title: "企业联系人电话",
          key: "companylinkmantel",
          align: "center",
          minWidth: 50
        }
      ],
      factoryData: [],
      selectData: '',
      pageSize: 10,
      pageIndex: 1,
      total: 0,
      height: 0,
    }
  },
  methods: {
    //   加载维修厂数据
    searchfactoryData() {
      this.loading = true;
      const param = {
        selectData: this.selectData,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
      }

      this.$curl.post('api/hj/searchHNFactoryInfo', { param }).then(res => {
        if (res.factoryList) {
          this.factoryData = res.factoryList;
          this.total = res.total;
        } else {
          this.$Message.error('获取失败');
        }
        this.loading = false;
      }).catch(err => {
        this.$Message.error('系统异常');
      })
    },
    changePage(pageSize) {
      this.pageIndex = pageSize;
      this.searchfactoryData();
    },
    changSize(pageSize) {
      this.pageSize = pageSize;
      this.searchfactoryData();
    },
    exportData() {
      require.ensure([], () => {
        let List = [];
        const {
          export_json_to_excel,
        } = require("../../../../../excel/Export2Excel");
        const tHeader = []; //表头名
        const filterVal = [];
        this.factoryInfo.map((item, id) => {
          tHeader.push(item.title);
          filterVal.push(item.key);
        });
        const url = "api/hj/searchHNFactoryInfo";
        let dataTable = [];
        let param = {
          pageSize: this.total,
          pageIndex: 1,
          selectData: this.selectData,
        };
        this.$curl
          .post(url, {
            param
          })
          .then((res) => {
            List = res.factoryList;
            if (List.length) {
              const data = this.formatJson(filterVal, List);
              export_json_to_excel(tHeader, data, `维修厂信息`); //列表excel  这个是导出表单的名称
            }
          });
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    setHeight() {
      this.height = this.$refs.main.offsetHeight - 90;
    },
  },
  created() {

  },
  mounted() {
    window.addEventListener("resize", this.setHeight);
    this.$nextTick(() => {
      this.setHeight();
    })
    // this.setHeight();
    this.searchfactoryData();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.setHeight);
  },
}
</script>
<style lang="less" scoped>
.main {
  height: 100%;
  .searchDiv {
    margin: 10px;
  }
}
</style>