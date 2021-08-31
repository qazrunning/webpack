
<template> 
     <!--IM尾气不合格报告-->
<div class="container">
    <div class="topSearch">
         <!--顶部搜索-->
        <Select v-model="param.stationCode" :filterable="true" :clearable="true" placeholder="选择站点" style="width:200px;margin:0 10px 0 10px">
            <Option v-for="item in stationList" :value="item.CodeValue" :key="item.CodeValue">{{item.CodeName}}</Option>
        </Select>
        <Input placeholder="请输入车牌号码..."  :clearable="true" v-model="param.vlpn" style="width:200px; margin: 0 20px" />
        <Select v-model="param.iutype" :filterable="true" :clearable="true" placeholder="选择检测方法" style="width:200px;margin:0 10px;">
            <Option v-for="item in iutypeList" :value="item.CodeValue" :key="item.CodeValue">{{item.CodeName}}</Option>
        </Select>
        <DatePicker placeholder="选择时间…" type="date" v-model="param.detectEndTime[0]" style="margin-left:10px;width:113px;"></DatePicker>----
        <DatePicker placeholder="选择时间…" type="date" v-model="param.detectEndTime[1]" style="width:113px;"></DatePicker>
         <Button type="primary" @click="selectData" style="margin:0 20px">检索</Button>
    </div>
    <div class="reportTable">
         <!--表格-->
         <div class="tableContent" ref="tableContent">
            <Table :columns="reportColumns" :data="reportData" :height="tableHeight">
                <template slot-scope="{row,index}" slot="action">
                    <Button type="primary" size="small" style="margin-right: 5px" @click="onClickPrint(index)">预览打印</Button>
                </template>
            </Table>
         </div>
         <div class="tablePager">
            <!--分页-->
            <Page :total="total" :page-size="pageSizeArr[0]" show-elevator show-sizer show-total :page-size-opts="pageSizeArr" @on-change="pageNumChange" @on-page-size-change="pageSizeChange" />
        </div>
    </div>
      <!-- 报告内容 -->
    <Modal width="880" v-model="showModel">
      <printContent :giveReport="giveReport" ref="reportCont"></printContent>
      <div slot="footer">
        <Button type="success" size="large" long @click="printStart">打印</Button>
      </div>
    </Modal>
</div>
</template>
<script>
const printContent = () =>
  import("../../../../HJ/views/vehicle/printContent.vue");
export default {
        data(){
            return {
                isShow: false,
                showModel: false, //是否展示打印窗口
                initform:{
                    stationinfo:{},
                    cd_fueltype:{},
                    cd_inspectionmethod:{},
                    cd_inspectionnature:{}
                },
                giveReport:{},
                param: {
                    stationCode: "",
                    vlpn: "",
                    detectEndTime: [new Date(), new Date()],
                    inspectionNum: "",
                    inspectionReportNo: "",
                    vin: "",
                    iutype:""
                },
                reportColumns:[
                    {
                        title:'车牌',
                        key:'VLPN',
                        minWidth: 70,
                        align:'center'
                    }, 
                    {
                        title:'车架号',
                        key:'VIN',
                        minWidth: 140,
                        align:'center'
                    },
                    {
                        title:'燃油种类',
                        key:'FuelType',
                        minWidth: 70,
                        render: (h, params) => {
                            const Name = this.initform.cd_fueltype[
                                params.row.FuelType
                            ];
                            return h("span", {}, Name);
                        },
                        align:'center'
                    },
                     {
                        title:'检测站名称',
                        key:'StationCode',
                        minWidth: 100,
                        render: (h, params) => {
                            const Name = this.initform.stationinfo[
                                params.row.StationCode
                            ];
                            return h("span", {}, Name);
                        },
                        align:'center'
                    },
                     {
                        title:'检测报告编号',
                        key:'InspectionReportNo',
                        minWidth: 140,
                        align:'center'
                    },
                     {
                        title:'检测时间',
                        key:'DetectEndTime',
                        minWidth: 80,
                        align:'center'
                    },
                     {
                        title:'检测方法',
                        key:'IUTYPE',
                        minWidth: 70,
                        render: (h, params) => {
                            const Name = this.initform.cd_inspectionmethod[
                                params.row.IUTYPE
                            ];
                            return h("span", {}, Name);
                        },
                        align:'center'
                    },
                    {
                        title:'检测类型',
                        key:'InspectionNature',
                        minWidth: 60,
                        render: (h, params) => {
                            const Name = this.initform.cd_inspectionnature[
                                params.row.InspectionNature
                            ];
                            return h("span", {}, Name);
                        },
                        align:'center'
                    },
                    {
                        title:'操作',
                        slot:'action',
                        minWidth:80,
                        align:'center'
                    }
                ],
                reportData:[],
                pageSize: 20,
                pageNum: 1,
                total: 0,
                tableHeight: 0,
                pageSizeArr: [20, 30, 40, 50],
                stationList:[],
                fuelTypeList:[],
                iutypeList:[]
            }
        },
        components: {
            printContent
        },
        methods: {
             //打印
            printStart() {
                this.showModel = false;
                this.$refs.reportCont.print_stat();
            },
            //预览打印
            onClickPrint(index){
                let { VehicleID,InspectionNum,VDCT,IUTYPE,InspectionDataID } = this.reportData[index];
                this.giveReport = {VehicleID,InspectionNum,VDCT,IUTYPE,InspectionDataID};
                 if (!this.giveReport.InspectionNum) return;
                this.showModel = true;
                this.$nextTick(() => {
                    this.$refs.reportCont.printaction();
                });
            },
            async getNoQualifiedReport(pageNum,pageSize,param) { //获取尾气不合格的报告
                let params = { pageNum,pageSize,param };
                if(!param.iutype) {
                    this.$Message.warning("请选择对应的检测方法！");
                    return;
                }                
                await this.$curl.get("api/hj/IM/getNoQualifiedReport",{params}).then(res => {
                    if(res.state && res.reportData){
                        this.reportData = res.reportData;
                        this.total = res.total;
                    }
                }).catch((error) =>{

                });
            },
            async getCDData() {
                const _this = this;
                const list = [
                {
                    tableName: "StationInfo",
                    columns: "StationCode as CodeValue,StationName as CodeName",
                    where: "",
                },
                {
                    tableName: "CD_FuelType",
                    columns: "CodeValue,CodeName",
                    where: "where IsAvailable=1",
                },
                {
                    tableName: "CD_InspectionMethod",
                    columns: "CodeValue,CodeName",
                    where: "where IsAvailable=1",
                },
                {
                    tableName: "CD_InspectionNature",
                    columns: "CodeValue,CodeName",
                    where: "where IsAvailable=1",
                }
                ];
                let data = {};
                if(this.$getDBTable){
                    let cdList = list.map(item => item.tableName);
                    let cdTableName = cdList.map(item => item.toLowerCase());
                    await this.$getDBTable(cdList).then(res => {
                        _this.stationList = JSON.parse(res[0]);
                        _this.fuelTypeList = JSON.parse(res[1]);
                        _this.iutypeList = JSON.parse(res[2]);
                        res.forEach((items,index) => {
                            data = JSON.parse(items);
                            _this.initform[cdTableName[index]]={};
                            if (data[0].hasOwnProperty('IsAvailable')) data = data.filter(d => d.IsAvailable == 1);
                            data.forEach(item => {
                                _this.initform[cdTableName[index]][item.CodeValue] = item.CodeName;
                            });           
                        });
                    });
                }else{
                     await this.$curl.get("api/hj/getCDData", {
                    CDDataList: JSON.stringify(list),
                    }).then(res => {
                        _this.stationList = res.data[0];
                        _this.fuelTypeList = res.data[1];
                        _this.iutypeList = res.data[2];
                    }).catch((error)=>{
                    });
                }
            },
              // 检索
            selectData() {
                this.getNoQualifiedReport(this.pageNum, this.pageSize, this.param);
            },
            pageNumChange(value) {
                this.pageNum = value;
                this.getNoQualifiedReport(this.pageNum, this.pageSize, this.param);
            },
            pageSizeChange(value) {
                this.pageSize = value;
                this.getNoQualifiedReport(this.pageNum, this.pageSize, this.param);
            },
            getTableHeight(){
                this.tableHeight = this.$refs.tableContent.offsetHeight;
            }
        },
        created() {

        },
        mounted() {
            this.getCDData();
            this.getTableHeight();
            window.addEventListener("resize", this.getTableHeight);
        },
        destroyed() {
             window.removeEventListener("resize", this.getTableHeight);
        }

    }
</script>
<style lang="scss" scoped>
    .container {
        height: 100%;
        .topSearch {
            height: 52px;
            line-height: 52px;
        }
    }
    .reportTable {
        height: calc(100% - 50px);
        .tableContent {
            height: calc(100% - 50px);
        .tablePager {
            padding: 5px;
            border-top: 1px solid #ccc;
            display: flex;
            justify-content: space-between;
        }
        }
    }
    
    
    
</style>
