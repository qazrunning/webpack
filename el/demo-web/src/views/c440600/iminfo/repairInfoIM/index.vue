<template>
  <div class="container" @click="sxshow=false">
    <!-- 顶部导航搜索栏 -->
    <div class="chooseNav" style="height:52px;line-height:52px;">
      <Input v-model="formData.Vehicleplatenumber" placeholder="请输入车牌号码..." clearable style="width:200px; margin: 0 20px" />
      <Button type="primary" style="" @click="selectData">检索</Button>
      <Button :type="isShow==true?'primary':'default'" icon="ios-funnel" style="margin:0 20px" @click="isShow=!isShow">筛选</Button>
    <!--   更多搜索条件 -->
      <div class v-show="isShow" style="position:relative;left:317px;top:0px;z-index:100;border-radius: 4px">
        <Card title="条件" icon="ios-options" :padding="0" shadow style="width: 350px;">
          <Form style="display: flex;flex-wrap: wrap;" v-model="formData" :label-width="120">
            <FormItem style="width: 100%;margin: 5px 0px;" label="检测报告编号：">
              <Input v-model="formData.test_no" placeholder="请输入检测报告编号..." clearable style="width:94%" />
            </FormItem>
            <FormItem style="width: 100%;margin: 5px 0px;" label="维修厂：">
                <Input v-model="formData.companyname" placeholder="请输入维修企业名称..." clearable style="width:94%" />
            </FormItem>
            <FormItem style="width: 100%;margin: 5px 0px;" label="送修日期：">
              <div  class="itemValue">
                <DatePicker type="datetimerange" format="yyyy-MM-dd HH:mm:ss" :split-panels='true'  placement="top-start" v-model="formData.repairdate" placeholder="请选择"  style="width: 94%;"></DatePicker>
              </div>
            </FormItem>
                <FormItem label="数据类型：">
            <Select v-model="formData.RecallResult" clearable>
                <Option value="1">撤回</Option>
                <Option value="0">未撤回</Option>
                <Option value="">全部</Option>
            </Select>
             </FormItem>
            <div class="button" style="margin:5px 0 15px 0;width:96%">
              <Button type="primary" style="float: right;" @click="selectData">检索</Button>
              <Button type="primary" style="float: right;marginRight:10px" @click="conditionReset">重置</Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
    <div class="Table">
      <!-- 表格信息详细 -->
      <div class="tableInfo" ref="tableInfo">
        <Table border :loading="loading" :columns="tableHeader" :data="tableData" :height="tabHeight">
          <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
          </template>
             <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="showDetail(row,index)">详情</Button>
          </template>
        </Table>
      </div>
      <!-- 分页器 -->
      <div class="thePager" style>
        <Page :total="total" :page-size="pageSizeArr[0]" show-sizer show-elevator :page-size-opts="pageSizeArr" @on-change="pageNumChange" @on-page-size-change="pageSizeChange" />
        <div class="pageInfo" style="marginRight:10px;textAlign: center">
          <span>
            当前显示
            <span>{{ (this.pageNum - 1) * this.pageSize + 1 }}</span> -
            <span>{{Math.ceil(this.total/this.pageSize)==(this.pageNum) ? (this.total) : (this.pageNum*this.pageSize)}}</span> 条记录 共
            <span>{{ total }}</span> 条记录
          </span>
        </div>
      </div>
       <Drawer title="维修信息详情" placement="left" :width="40" v-model="showDrawer">
      <maintain-detail :baseInfo="selectInfo"></maintain-detail>
    </Drawer>
    </div>
  
   
  </div>
</template>
<script>

export default {
  components: {
    maintainDetail: () => import('./maintainDetail.vue')
  },
  data() {
    return {
      showDrawer:false,
      selectInfo:{},
      isShow: false,
      Modal:false,
     loading: false,
      delModal:false,
      tabHeight: 0,
      ModalTitle:'',
      tableData:[],
      RecallResult:[
        {codeName:'撤回',codeValue:1},
        {codeName:'未撤回',codeValue:0},
        {codeName:'全部',codeValue:''}
        ],//撤回标识
      currentData:{},
      currentID:'',
      tableHeader:[
              {
                type: 'index',
                title: '序号',
                key: 'RowNum',
                minWidth: 70,
                align: 'center'
                },{
                title: '检测报告编号',
                key: 'test_no',
                minWidth: 120,
                align: 'center'
                },{
                title: '车牌号码',
                key: 'Vehicleplatenumber',
                minWidth: 150,
                align: 'center'
                },{
                title: '车架号',
                key: 'Vin',
                minWidth: 150,
                align: 'center'
                },{
                title: '故障描述',
                key: 'Faultdescription',
                minWidth: 150,
                align: 'center'
                },
                {
                title: '送修里程',
                key: 'repairmileage',
                minWidth: 150,
                align: 'center'
                }
                ,{
                title: '送修日期',
                key: 'repairdate',
                minWidth: 150,
                align: 'center'
                },{
                title: '结算日期',
                key: 'settledate',
                minWidth: 150,
                align: 'center'
                },{
                title: '维修企业名称',
                key: 'companyname',
                minWidth: 120,
                align: 'center'
                },{
                title: '维修企业地址',
                key: 'address',
                minWidth: 150,
                align: 'center'
                },
                  {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center',
          fixed:"right"
        }
             ],
      formData: {
                test_no:'',
                companyname:'',
                repairdate:[],
                Vehicleplatenumber:'',
                RecallResult:''
             },
      pageSizeArr: [20, 30, 40, 50],
      total: 0,
      pageSize: 20,
      pageNum: 1
    }
  },
 
  created() {
    this.getAllData(this.pageNum,this.pageSize,this.formData)
  },
  mounted() {
    this.$nextTick(() => {
      this.getTabHeight();
    })
    // this.getTabHeight()
    window.addEventListener('resize', this.getTabHeight)
  },
  destroyed() {
    window.removeEventListener('resize', this.getTabHeight)
  },
  methods: {
    //置空所有筛选条件
    conditionReset() {
      this.formData.test_no = ''
      this.formData.companyname = '',
      this.formData.repairdate = ['',''],
      this.formData.Vehicleplatenumber = '',
      this.getAllData(this.pageNum,this.pageSize,this.formData)
    },
    // 筛选搜索
    selectData() {
      this.getAllData(this.pageNum,this.pageSize,this.formData)
    },
    // 数据详情
    showDetail(row, index) {
        console.log(row);
        
      this.selectInfo = row;
      this.showDrawer = true;
    },
    // 计算表格高度
    getTabHeight() {
      this.tabHeight = this.$refs.tableInfo.offsetHeight
    },
    pageNumChange(value) {
      this.pageNum=value
      this.getAllData(this.pageNum, this.pageSize, this.formData)
    },
    pageSizeChange(value) {
      this.pageSize=value
      this.getAllData(this.pageNum, this.pageSize, this.formData)
    },
    
    // 获取所有数据
    async getAllData(pageNum,pageSize,formData){
         this.loading=true;
      let param=formData;
      let params = {pageNum, pageSize, param}
      this.$curl.get('api/hj/IM/getRepairData',{ params }).then(res=>{
        this.loading=false;
        this.tableData=res.repairData
        this.total=res.total
      })
    },
    //数据过滤
    returncodenames(namelist, codevalue) {
      codevalue = String(codevalue);
      if (codevalue && codevalue.indexOf(",") != -1) {
        let result = [];
        codevalue.split(",").forEach(e => {
          namelist.forEach(v => {
            if (v.CodeValue == e) result.push(v.CodeName);
          });
        });
        return result.join(",");
      } else {
        let CodeName = "";
        namelist.forEach(item => {
          if (item.CodeValue == codevalue) CodeName = item.CodeName;
        });
        return CodeName;
      }
    },
    
  }
}
</script>
<style lang="scss" scoped>
.container {
  height: 100%;
  .tglpx_showes {
    position: absolute;
    top: 38px;
    right: 3px;
    z-index: 9999;
    box-shadow: rgba(0, 0, 0, 0.35) -4px 7px 10px 2px;
    border-radius: 4px;
  }
  }
  .Table {
    height: calc(100% - 50px);
    .tableInfo {
      height: calc(100% - 50px);
    }
    .thePager {
      padding: 5px;
      border-top: 1px solid #ccc;
      display: flex;
      justify-content: space-between;
    }
  }

</style>
