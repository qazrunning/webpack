<template>
  <div style="width:100%;height:100%;" ref="factormanage">
    <Row>
      <i-col span="24">
        <div style="width:100%;padding:10px; display:flex;justify-content:flex-start">
          <Input search v-model="SearchParam.MoreValue" placeholder="按维修厂名称、地址搜索" @on-change="SearchData(1)" style="width:220px" />
          <Button type="primary" icon="md-add" style="margin-left:20px;" @click="AddData">新增</Button>
          <Button type="primary" style="margin-left:20px;" @click="exportExcel">导出</Button>
          <Upload ref="upload" :format="['xlsx','xls']" :on-format-error="handleFormatError" :show-upload-list="false" :on-success="uploadSuccess" :on-error="onerror" action="api/hj/importMaintainFactory">
            <Button type="primary" icon="md-arrow-round-up" style="margin:0  20px;">导入数据</Button>
          </Upload>
          <span style="cursor:pointer;flex:auto;">
            <Button :type="tglpx_show?'primary':'default'" icon="ios-funnel" style="float:right;marginLeft:10px" @click="tglpx_show = !tglpx_show">筛选</Button>
            <div v-show="tglpx_show" class="tglpx_showes fx__bgcolor">
              <Card title="维修厂基本信息" icon="ios-options" :padding="0" shadow>
                <Row :gutter="5" style="padding:10px 20px;">
                  <Col span="8" style="text-align: right;padding-top: 2%;">维修厂名称：</Col>
                  <Col span="16">
                    <Input v-model="SearchParam.MAI_Name" />
                  </Col>
                  <Col span="8" style="text-align: right;padding-top: 2%;margin-top: 5px">许可证号：</Col>
                  <Col span="16" style="margin-top: 5px">
                    <Input v-model="SearchParam.MAI_Permit" />
                  </Col>

                  <Col span="8" style="text-align: right;padding-top: 2%;margin-top: 5px">行业类别：</Col>
                  <Col span="16" style="margin-top: 5px">
                    <Select v-model="SearchParam.MAI_CompanyType" clearable>
                      <Option v-for="item in CompanyTypeOpt" :value="item.Name" :key="item.Name">{{ item.Name }}</Option>
                    </Select>
                  </Col>

                  <Col span="8" style="text-align: right;padding-top: 2%;margin-top: 5px">分类：</Col>
                  <Col span="16" style="margin-top: 5px">
                    <Select v-model="SearchParam.MAI_LV" clearable>
                      <Option v-for="item in LVOpt" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
                    </Select>
                  </Col>
                  <Col span="8" style="text-align: right;padding-top: 2%;margin-top: 5px">录入人：</Col>
                  <Col span="16" style="margin-top: 5px">
                    <Input v-model="SearchParam.MAI_Recorder" />
                  </Col>
                  <Col span="8" style="text-align: right;padding-top: 2%;margin-top: 5px">经营范围：</Col>
                  <Col span="16" style="margin-top: 5px">
                    <Input type="text" v-model="SearchParam.MAI_OperateRange" />
                  </Col>
                  <Col span="8" style="text-align: right;padding-top: 2%;margin-top: 5px">地址：</Col>
                  <Col span="16" style="margin-top: 5px">
                    <Input type="text" v-model="SearchParam.MAI_Address" />
                  </Col>
                  <Col span="8" style="text-align: right;padding-top: 2%;margin-top: 5px">现场负责人：</Col>
                  <Col span="16" style="margin-top: 5px">
                    <Input type="text" v-model="SearchParam.MAI_ResponsiblePerson" />
                  </Col>
                  <Col span="24">
                    <div style="display: flex;justify-content:flex-end;margin-top:10px;">
                      <Button style type="primary" @click="SearchData()">检索</Button>
                      <Button style="margin-left: 10px;" type="primary" @click="resetData">重置</Button>
                    </div>
                  </Col>
                </Row>
              </Card>
            </div>
          </span>
        </div>
      </i-col>
    </Row>
    <div :height="windowHight" id="tac">
      <Table :height="windowHight-15" border :columns="columns1" :data="ListData" :loading="loading">
        <template slot-scope="{ row }" slot="MAI_JuridicalPerson">{{row.MAI_JuridicalPerson}}-{{row.MAI_Tel}}</template>
        <template slot-scope="{ row }" slot="MAI_ResponsiblePerson">{{row.MAI_ResponsiblePerson}}-{{row.MAI_IP}}</template>
        <template slot-scope="{ row }" slot="MAI_LV">{{GetCD_Name(row.MAI_LV,LVOpt)}}</template>
        <template slot-scope="{ row }" slot="MAI_Status">{{GetCD_Name(row.MAI_Status,StatusOpt)}}</template>
        <template slot-scope="{row,index}" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px" @click="ShowInfo(row,index)">编辑</Button>
          <Button type="error" size="small" @click="remove(row,index)">删除</Button>
        </template>
      </Table>
    </div>
    <div style="padding:6px 10px;width:100%;">
      <Page :total="SearchParam.total" :page-size="SearchParam.PageSize" :current="SearchParam.CurrentPage" show-total @on-change="PageChange" />
    </div>
    <Modal v-model="isShowEdit" width="80" :label-width="isPc ? 140 : null" :label-position="isPc ? 'right' : 'top'">
      <p slot="header" class="fx__text_default">信息详情</p>
      <div>
        <Form ref="RowInfo" :model="RowInfo" :show-message="false" label-position="right" :rules="ruleInline" :label-width="110">
          <Row>
            <i-col :xs="24" :sm="12" :lg="6">
              <FormItem prop="MAI_Name" label="维修厂名称">
                <Input v-model="RowInfo.MAI_Name" style="width:100%;" />
              </FormItem>
            </i-col>
            <i-col :xs="24" :sm="12" :lg="6">
              <FormItem prop="MAI_CompanyType" label="行业类别">
                <Select v-model="RowInfo.MAI_CompanyType" clearable style="width:100%;">
                  <Option v-for="item in CompanyTypeOpt" :value="item.Name" :key="item.Name">{{ item.Name }}</Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col :xs="24" :sm="12" :lg="6">
              <FormItem label="登记号">
                <Input v-model="RowInfo.MAI_StatRecordNumber" style="width:100%;" />
              </FormItem>
            </i-col>

            <i-col :xs="24" :sm="12" :lg="6"></i-col>

            <i-col :xs="24" :sm="12" :lg="6">
              <FormItem label="营业执照号码">
                <Input v-model="RowInfo.MAI_BusinessLicenceNO" style="width:100%;" />
              </FormItem>
            </i-col>
            <i-col :xs="24" :sm="12" :lg="6">
              <FormItem label="税务登记号">
                <Input v-model="RowInfo.MAI_TaxRegistrationNumber" style="width:100%;" />
              </FormItem>
            </i-col>
            <i-col :xs="24" :sm="12" :lg="6">
              <FormItem label="所属区域">
                <Select v-model="RowInfo.MAI_Area" clearable style="width:100%;">
                  <Option v-for="item in AreaOpt" :value="item.AreaCode" :key="item.AreaCode">{{ item.AreaName }}</Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col :xs="24" :sm="12" :lg="6">
              <FormItem label="经济性质">
                <Select v-model="RowInfo.MAI_EconomicType" clearable style="width:100%;">
                  <Option v-for="item in EconomicTypeOpt" :value="item.Name" :key="item.Name">{{ item.Name }}</Option>
                </Select>
              </FormItem>
            </i-col>

            <i-col :xs="24" :sm="12" :lg="6">
              <FormItem prop="MAI_LV" label="分类">
                <Select v-model="RowInfo.MAI_LV" clearable style="width:100%;">
                  <Option v-for="item in LVOpt" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col :xs="24" :sm="12" :lg="6">
              <FormItem label="传真号码">
                <Input v-model="RowInfo.MAI_Facsimile" style="width:100%;" />
              </FormItem>
            </i-col>
            <i-col :xs="24" :sm="12" :lg="6">
              <FormItem prop="MAI_RegDate" label="初次发证日期">
                <DatePicker type="date" v-model="RowInfo.MAI_RegDate" style="width:100%;"></DatePicker>
              </FormItem>
            </i-col>

            <i-col :xs="24" :sm="12" :lg="6">
              <FormItem prop="MAI_ValidDate" label="有效截止日期">
                <DatePicker type="date" v-model="RowInfo.MAI_ValidDate" style="width:100%;"></DatePicker>
              </FormItem>
            </i-col>
            <i-col :xs="24" :sm="12" :lg="6">
              <FormItem prop="MAI_Address" label="地址" style="width:100%;">
                <Input v-model="RowInfo.MAI_Address" />
              </FormItem>
            </i-col>
            <i-col :xs="24" :sm="12" :lg="6">
              <FormItem prop="MAI_Status" label="状态">
                <Select v-model="RowInfo.MAI_Status" clearable style="width:100%;">
                  <Option v-for="item in StatusOpt" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
                </Select>
              </FormItem>
            </i-col>

            <i-col :xs="24" :sm="12" :lg="6">
              <FormItem prop="MAI_JuridicalPerson" label="法人">
                <Input v-model="RowInfo.MAI_JuridicalPerson" style="width:100%;" />
              </FormItem>
            </i-col>
            <i-col :xs="24" :sm="12" :lg="6">
              <FormItem prop="MAI_Tel" label="法人电话">
                <Input v-model="RowInfo.MAI_Tel" style="width:100%;" />
              </FormItem>
            </i-col>
            <i-col :xs="24" :sm="12" :lg="6">
              <FormItem prop="MAI_ResponsiblePerson" label="现场负责人">
                <Input v-model="RowInfo.MAI_ResponsiblePerson" style="width:100%;" />
              </FormItem>
            </i-col>

            <i-col :xs="24" :sm="12" :lg="6">
              <FormItem prop="MAI_IP" label="现场负责人电话">
                <Input v-model="RowInfo.MAI_IP" style="width:100%;" />
              </FormItem>
            </i-col>
            <i-col :xs="24" :sm="12" :lg="6">
              <FormItem label="X坐标">
                <Input v-model="RowInfo.MAI_PosX" style="width:100%;" />
              </FormItem>
            </i-col>
            <i-col :xs="24" :sm="12" :lg="6">
              <FormItem label="Y坐标">
                <Input v-model="RowInfo.MAI_PosY" style="width:100%;" />
              </FormItem>
            </i-col>

            <i-col :xs="24" :sm="12" :lg="6">
              <FormItem prop="MAI_Permit" label="经营许可证号">
                <Input v-model="RowInfo.MAI_Permit" style="width:100%;" />
              </FormItem>
            </i-col>
            <i-col span="24">
              <FormItem prop="MAI_OperateRange" label="经营范围">
                <Input v-model="RowInfo.MAI_OperateRange" type="textarea" style="width:100%;" />
              </FormItem>
            </i-col>
            <i-col span="24">
              <FormItem label="备注">
                <Input v-model="RowInfo.MAI_Remarks" type="textarea" />
              </FormItem>
            </i-col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button type="info" size="small" @click="CloseModal">取消</Button>
        <Button type="primary" size="small" @click="SaveInfo('RowInfo')">保存</Button>
      </div>
    </Modal>

    <Modal footer-hide title="图片查看" v-model="picModal" :width="width">
      <viewer :images="ImgForm" style="display:flex;flex-wrap:wrap;">
        <div :style="{width:(width-30)/n+'px'}" v-for="(item,index) in ImgForm" :key="index" style="flex:1;min-width:370px;max-width:380px;marign-right:8px;">
          <img :src="item.Url" alt style="width:80%;" @error="onError($event)" />
          <p>文件名：{{item.OriginalFileName}}</p>
          <p>上传者：{{item.UploadFileUser}}</p>
          <p>上传时间：{{item.UploadFileTime}}</p>
          <p>文件类型：{{returncodenames(BusinessType,item.BusinessType)}}</p>
          <p>文件组：{{returncodenames(FileGroup,item.FileGroup)}}</p>
        </div>
      </viewer>
    </Modal>
  </div>
</template>
<script>
import { formatDates, getCDData } from "../../../utils/utils";
export default {
  data() {
    return {
      isPc: true,
      ImgForm: [], //图片
      width: 500,
      n: 1,
      picModal: false,
      loading: false,
      tglpx_show: false,
      isShowEdit: false,
      SearchModal: false,
      RowInfo: {},
      windowHight: 0,
      ruleInline: {
        MAI_Name: [{ required: true, trigger: "blur" }],
        MAI_CompanyType: [{ required: true, trigger: "blur" }],
        MAI_LV: [{ required: true, trigger: "blur" }],
        MAI_RegDate: [{ required: true, type: "date", trigger: "blur" }],
        MAI_ValidDate: [{ required: true, type: "date", trigger: "blur" }],
        MAI_Status: [{ required: true, trigger: "blur" }],
        MAI_JuridicalPerson: [{ required: true, trigger: "blur" }],
        MAI_Tel: [{ required: true, trigger: "blur" }],
        MAI_ResponsiblePerson: [{ required: true, trigger: "blur" }],
        MAI_IP: [{ required: true, trigger: "blur" }],
        MAI_Permit: [{ required: true, trigger: "blur" }],
        MAI_OperateRange: [{ required: true, trigger: "blur" }],
        MAI_Address: [{ required: true, trigger: "blur" }]
      },
      CurrentParam: {},
      SearchParam: {
        MoreValue: "",
        MAI_Name: "", //维修厂名称
        MAI_Permit: "", //许可证号
        MAI_Recorder: "", //录入人
        MAI_OperateRange: "", //经营范围
        MAI_Address: "", //地址
        MAI_ResponsiblePerson: "", //现场负责人
        MAI_CompanyType: "", //行业类别
        MAI_LV: "", //分类,
        CurrentPage: 1,
        PageSize: 15, //每页15条数据
        total: 0 //总数
      },
      columns1: [
        {
          title: "维修厂名称",
          key: "MAI_Name",
          align: "center",
          minWidth: 250,
          tooltip: true,
        },
        {
          title: "分类",
          slot: "MAI_LV",
          align: "center",
          minWidth: 80
        },
        {
          title: "行业类别",
          key: "MAI_CompanyType",
          align: "center",
          minWidth: 120
        },
        {
          title: "经营许可证",
          key: "MAI_Permit",
          align: "center",
          minWidth: 180,
          tooltip: true,
        },
        {
          title: "地址",
          key: "MAI_Address",
          tooltip: true,
          align: "center",
          minWidth: 200
        },
        {
          title: "经营范围",
          key: "MAI_OperateRange",
          align: "center",
          minWidth: 200,
          tooltip: true
        },
        {
          title: "初级发证日期",
          key: "MAI_RegDate",
          align: "center",
          minWidth: 130,
          render: (h, params) => {
            return h(
              "span",
              this.$options.filters.dataFormat(
                params.row.MAI_RegDate,
                "yyyy-MM-dd"
              )
            );
          }
        },
        {
          title: "有效截止日期",
          key: "MAI_ValidDate",
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              this.$options.filters.dataFormat(
                params.row.MAI_ValidDate,
                "yyyy-MM-dd"
              )
            );
          },
          minWidth: 130
        },
        {
          title: "法人-联系电话",
          slot: "MAI_JuridicalPerson",
          align: "center",
          minWidth: 190
        },
        {
          title: "现场负责人-联系电话",
          slot: "MAI_ResponsiblePerson",
          tooltip: true,
          align: "center",
          minWidth: 190
        },
        {
          title: "图片查看",
          key: "imgData",
          minWidth: 100,
          align: "center",
          render: (h, params) => {
            if (params.row.imgData) {
              return h(
                "span",
                {
                  style: {
                    color: "#2d8cf0",
                    cursor: "pointer"
                  },
                  on: {
                    click: () => {
                      this.picModal = true;
                      let BusinessKey = [];
                      BusinessKey.push(String(params.row.MAI_ID));
                      this.$curl
                        .post("api/hj/getReportAndDataImg", {
                          BusinessType: "15",
                          BusinessKey: BusinessKey
                        })
                        .then(res => {
                          const { data } = res;
                          if (data) {
                            this.ImgForm = data;
                            let photoNum = data.length;
                            if (photoNum > 1) {
                              this.n = 2;
                              this.width = 800;
                            }
                          }
                        });
                    }
                  }
                },
                params.row.imgData + "个文件"
              );
            } else {
              return h("span", "无文件");
            }
          },
          minWidth: 100
        },
        {
          title: "状态",
          slot: "MAI_Status",
          align: "center",
          minWidth: 100
        },
        {
          title: "录入人",
          key: "MAI_Recorder",
          align: "center",
          minWidth: 100
        },
        {
          title: "录入时间",
          key: "MAI_RecordTime",
          render: (h, params) => {
            return h(
              "span",
              this.$options.filters.dataFormat(
                params.row.MAI_RecordTime,
                "yyyy-MM-dd"
              )
            );
          },
          align: "center",
          minWidth: 120
        },
        {
          title: "操作",
          slot: "action",
          width: 150,
          align: "center",
          fixed: "right",
          minWidth: 100
        }
      ],
      ListData: [],
      LVOpt: [
        { CodeValue: "01", CodeName: "一类" },
        { CodeValue: "02", CodeName: "二类" },
        { CodeValue: "03", CodeName: "三类" }
      ],
      EconomicTypeOpt: [
        { Name: "非公司企业法人" },
        { Name: "有限责任公司" },
        { Name: "股份有限责任公司" },
        { Name: "个体工商户" },
        { Name: "私营独资企业" },
        { Name: "私营合伙企业" }
      ],
      CompanyTypeOpt: [{ Name: "机动车维修" }, { Name: "其它" }],
      StatusOpt: [],
      AreaOpt: [],
      BusinessType: [],
      FileGroup: [],
      exportData: [
        {
          title: "维修厂名称",
          key: "MAI_Name",
        },
        {
          title: "行业类别",
          key: "MAI_CompanyType",
        },
        {
          title: "登记号",
          key: "MAI_StatRecordNumber",
        },
        {
          title: "营业执照号码",
          key: "MAI_BusinessLicenceNO",
        },
        {
          title: "税务登记号",
          key: "MAI_TaxRegistrationNumber",
        },
        {
          title: "所属区域",
          key: "MAI_Area",
        },
        {
          title: "经济性质",
          key: "MAI_EconomicType",
        },
        {
          title: "分类",
          key: "MAI_LV",
        },
        {
          title: "传真号码",
          key: "MAI_Facsimile",
        },
        {
          title: "初次发证日期",
          key: "MAI_RegDate",
        },
        {
          title: "有效截止日期注",
          key: "MAI_ValidDate",
        },
        {
          title: "地址",
          key: "MAI_Address",
        },
        {
          title: "状态",
          key: "MAI_Status",
        },
        {
          title: "法人",
          key: "MAI_JuridicalPerson",
        },
        {
          title: "法人电话",
          key: "MAI_Tel",
        },
        {
          title: "负责人",
          key: "MAI_ResponsiblePerson",
        },
        {
          title: "负责人电话",
          key: "MAI_IP",
        },

        {
          title: "备许可证号",
          key: "MAI_Permit",
        },
        {
          title: "经营范围",
          key: "MAI_OperateRange",
        },
        {
          title: "备注",
          key: "MAI_Remarks",
        },

      ], //导出数据标题
    };
  },
  methods: {
    // 导出数据
    exportExcel() {
      require.ensure([], () => {
        let List = [];
        const {
          export_json_to_excel,
        } = require("../../../../../src/excel/Export2Excel");
        const tHeader = []; //表头名
        const filterVal = [];
        this.exportData.map((item, id) => {
          tHeader.push(item.title);
          filterVal.push(item.key);
        });
        const url = "api/hj/searchMaintainFactorInfo";
        let dataTable = [];
        this.CurrentPage = 1;
        this.SearchParam.PageSize = this.SearchParam.total
        this.$curl
          .get(url, {
            param: JSON.stringify(this.SearchParam),
          })
          .then((res) => {
            List = res.data;
            if (List.length) {
              List.forEach((item) => {
                item.MAI_Area = this.returncodenames(
                  this.AreaOpt,
                  item.MAI_Area
                );
                item.MAI_LV = this.returncodenames(
                  this.LVOpt,
                  item.MAI_LV
                );
                item.MAI_Status = this.returncodenames(
                  this.StatusOpt,
                  item.MAI_Status
                );
              });
              const data = this.formatJson(filterVal, List);
              export_json_to_excel(tHeader, data, `维修厂信息`); //列表excel  这个是导出表单的名称
            }
          });
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    handleFormatError(file) {
      this.$Message.error("请选择.xsl,.xlsx格式文件！");
    },
    onError(event) {
      event.target.src = "static/img/imgError.png";
    },
    //过滤数据
    returncodenames(namelist, codevalue) {
      let CodeName = "";
      namelist.forEach(item => {
        if (item.CodeValue == codevalue) CodeName = item.CodeName;
      });
      return CodeName;
    },
    setHeight() {
      this.windowHight = this.$refs.factormanage.offsetHeight - 85; //this.$refs.bs.getBoundingClientRect().height;
    },
    //获取CD表
    async loadCDData() {
      const _this = this;
      const list = [
        {
          tableName: "CD_MAIStatus",
          columns: "CodeValue,CodeName",
          where: ""
        },
        {
          tableName: "CD_BusinessType",
          columns: "CodeValue,CodeName",
          where: " where IsAvailable=1"
        },
        {
          tableName: "CD_FileGroup",
          columns: "CodeValue,CodeName",
          where: " where IsAvailable=1"
        }
      ];
      if (this.$getDBTable) {
        let cd_list = list.map(e => e.tableName)
        await this.$getDBTable(cd_list).then(data => {
          _this.StatusOpt = JSON.parse(data[0]);
          _this.BusinessType = JSON.parse(data[1]);
          _this.FileGroup = JSON.parse(data[2]);
        })
      }
      else {
        let res = this.$curl
          .get("api/hj/getCDData", { CDDataList: JSON.stringify(list) })
          .then(res => {
            const { data, state } = res;
            if (state) {
              _this.StatusOpt = data[0];
              _this.BusinessType = data[1];
              _this.FileGroup = data[2];
            }
          });
      }
    },
    //获取用户所在区域
    getUserInfo() {
      this.$curl
        .get("api/hj/getUserCity", {})
        .then(res => {
          const { city, state, area } = res;
          this.AreaOpt = area;
        })
        .catch(error => { });
    },
    //查询数据
    SearchData() {
      const _this = this;
      this.loading = true;
      this.CurrentPage = 1;
      this.CurrentParam = Object.assign({}, this.SearchParam);
      this.$curl
        .get("api/hj/searchMaintainFactorInfo", {
          param: JSON.stringify(this.SearchParam)
        })
        .then(json => {
          const { data, total } = json;
          _this.ListData = data;
          _this.SearchParam.total = total;
          _this.SearchModal = false;
          _this.loading = false;
          let BusinessKey = _this.ListData.map(l => String(l.MAI_ID));
          _this.$curl
            .post("api/hj/getReportAndDataImg", {
              BusinessType: "15",
              BusinessKey: BusinessKey
            })
            .then(res => {
              const { data, code } = res;
              let i;
              if (code) {
                _this.ListData.forEach(p => {
                  i = 0;
                  data.forEach(d => {
                    if (d.BusinessKey == p.MAI_ID) {
                      i++;
                    }
                  });
                  _this.$set(p, "imgData", i);
                });
              }
            })
            .catch(error => { });
        })
        .catch(e => {
          _this.loading = false;
        });
    },
    //新增
    AddData() {
      this.isShowEdit = true;
      this.RowInfo = {};
      this.$refs.RowInfo.resetFields();
    },
    //重置
    resetData() {
      this.SearchParam = { MoreValue: "", MAI_Name: "", MAI_Permit: "", MAI_Recorder: "", MAI_OperateRange: "", MAI_Address: "", MAI_ResponsiblePerson: "", MAI_CompanyType: "", MAI_LV: "", CurrentPage: 1, PageSize: 15, total: 0 };
      this.CurrentParam.CurrentPage = 1;
      this.SearchData();
    },
    //分页查询
    PageChange(page) {
      this.CurrentParam.CurrentPage = page;
      const _this = this;
      this.$curl
        .get("api/hj/searchMaintainFactorInfo", {
          param: JSON.stringify(this.CurrentParam)
        })
        .then(json => {
          const { data, total } = json;
          _this.ListData = data;
          _this.SearchParam.total = total;
        })
        .catch(e => { });
    },
    ShowInfo(row, index) {
      this.isShowEdit = true;
      this.RowInfo = row;
      this.RowInfo.MAI_RegDate = new Date(this.RowInfo.MAI_RegDate);
      this.RowInfo.MAI_ValidDate = new Date(this.RowInfo.MAI_ValidDate);
    },
    CloseModal() {
      this.isShowEdit = false;
    },
    //保存信息
    SaveInfo(name) {
      const _this = this;
      this.$refs[name].validate(valid => {
        if (valid) {
          const DataInfo = Object.assign({}, _this.RowInfo);
          for (var item in DataInfo) {
            if (
              !DataInfo[item] ||
              item == "RowNumber" ||
              item == "_rowKey" ||
              item == "_index"
            ) {
              delete DataInfo[item];
            }
          }
          //如果是新增(ID不存在）,需要录入人
          if (!DataInfo["MAI_ID"]) {
            DataInfo["MAI_Recorder"] = this.$store.state.core.user.username;
          }
          this.$curl
            .post("api/hj/EditMaintainFactorInfo", { DataInfo: DataInfo })
            .then(json => {
              const { success, msg } = json;
              if (success) {
                _this.SearchData();
                _this.$Message.success(msg);
                _this.isShowEdit = false;
              } else {
                _this.$Message.error(msg);
                _this.isShowEdit = false;
              }
            })
            .catch(e => { });
        } else {
          this.$Message.error("红色*必填!");
        }
      });
    },
    //删除信息
    remove(row, index) {
      const _this = this;
      this.$Modal.confirm({
        title: "确定删除?",
        content: "",
        onOk: () => {
          this.$curl
            .post("api/hj/DeleteMaintainFactorInfo", { MAI_ID: row.MAI_ID })
            .then(json => {
              const { success, msg } = json;
              if (success) {
                this.$Message.success(msg);
                _this.ListData.splice(index, 1);
              } else {
                this.$Message.error(msg);
              }
            })
            .catch(e => { });
        },
        onCancel: () => { }
      });
    },
    GetCD_Name(key, item) {
      for (var i = 0; i < item.length; i++) {
        var flag = false;
        for (var prop in item[i]) {
          if (flag) {
            return item[i][prop];
          }
          if (key == item[i][prop]) flag = true;
        }
      }
    },
    MoreBtn() {
      this.SearchModal = true;
    },
    CancelModal() {
      this.SearchModal = false;
    },
    uploadSuccess(response, file, fileList) {
      if (response.success) {
        this.$Message.success(response.msg);
      } else {
        this.$Message.error(response.msg);
      }
      this.SearchData();
    },
    onerror(error, file, fileList) {
      this.$Message.error("数据导入失败!");
    }
  },
  mounted() {
    this.loadCDData();
    window.addEventListener("resize", this.setHeight);
    this.$nextTick(() => {
      this.setHeight();
    })
    // this.setHeight();
    this.SearchData();
    this.getUserInfo();
  },
  destroyed() {
    window.removeEventListener("resize", this.setHeight);
  }
};
</script>
<style scoped>
.ivu-form /deep/ .ivu-form-item {
  margin-bottom: 5px;
}
.box {
  display: flex;
  align-items: center;
  padding: 5px 0px;
}
.tglpx_showes {
  padding: 0;
  position: absolute;
  width: 340px;
  top: 52px;
  right: 15px;
  z-index: 9999;
  box-shadow: rgba(0, 0, 0, 0.35) -4px 7px 10px 2px;
  border-radius: 4px;
}
#tac /deep/ .ivu-table-column-center {
  text-align: center;
}
</style>