//业务设置-受理审核原因设置
<template>
  <div style="margin-top: 3px; height: 100%" ref="bs">
    <div class="search">
      <Select v-model="searchParam.AreaCode" class="input" :clearable="userGrade == 1" @on-change="getAllSettingData">
        <Option
          v-for="item in areaList"
          :value="item.AreaCode"
          :key="item.AreaCode"
          >{{ item.AreaName }}</Option
        >
      </Select>
      <Button v-if="isAdmin" type="primary" @click="resetAcceptAuditSetting">初始化配置</Button>
    </div>
    <Table :columns="columns" :data="BLData" :height="height">
      <template slot-scope="{ row }" slot="AreaCode">
        <span v-if="row.CountyCode">{{ getAreaName(row.CountyCode) }}</span>
        <span v-else>{{ getAreaName(row.CityCode) }}</span>
      </template>
      <template slot-scope="{ row, index }" slot="Explain">
        <Input type="text" v-model="editExplain" v-if="editIndex === index" />
        <span style="text-overflow: ellipsis" v-else>{{ row.Explain }}</span>
      </template>

      <template slot-scope="{ row, index }" slot="Tips">
        <Input type="text" v-model="editTips" v-if="editIndex === index" />
        <span style="text-overflow: ellipsis" v-else>{{ row.Tips }}</span>
      </template>

      <template slot-scope="{ row, index }" slot="IsAvailable">
        <RadioGroup v-model="editIsAvailable" v-if="editIndex === index">
          <Radio :label="1">
            <span>启用</span>
          </Radio>
          <Radio :label="0">
            <span>不启用</span>
          </Radio>
        </RadioGroup>
        <span v-else>{{ retrunName(row.IsAvailable) }}</span>
      </template>

      <template slot-scope="{ row, index }" slot="IsCanAccept">
        <RadioGroup v-model="editIsCanAccept" v-if="editIndex === index">
          <Radio :label="1">
            <span>启用</span>
          </Radio>
          <Radio :label="0">
            <span>不启用</span>
          </Radio>
        </RadioGroup>
        <span v-else>{{ retrunName(row.IsCanAccept) }}</span>
      </template>

      <template slot-scope="{ row, index }" slot="IsNeedAudit">
        <RadioGroup v-model="editIsNeedAudit" v-if="editIndex === index && editIsCanAccept">
          <Radio :label="1">
            <span>启用</span>
          </Radio>
          <Radio :label="0">
            <span>不启用</span>
          </Radio>
        </RadioGroup>
        <span v-else-if="editIndex === index && !editIsCanAccept">{{ retrunName(editIsNeedAudit) }}</span>
        <span v-else>{{ retrunName(row.IsNeedAudit) }}</span>
      </template>
      <template slot-scope="{ row, index }" slot="IsAutoAudit">
        <RadioGroup v-model="editIsAutoAudit" v-if="editIndex === index && editIsNeedAudit && editIsCanAccept">
          <Radio :label="1">
            <span>启用(自动审核)</span>
          </Radio>
          <Radio :label="0">
            <span>不启用(人工审核)</span>
          </Radio>
        </RadioGroup>
        <span v-else-if="editIndex === index && (!editIsCanAccept || !editIsNeedAudit)">{{ retrunName(editIsAutoAudit) }}</span>
        <span v-else>{{ retrunName(row.IsAutoAudit) }}</span>
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <div v-if="editIndex === index">
          <Button
            type="info"
            shape="circle"
            icon="md-checkmark-circle"
            @click="handleSave(index)"
            >保存</Button
          >
          <Button
            type="warning"
            shape="circle"
            icon="md-close-circle"
            @click="editIndex = -1"
            >取消</Button
          >
        </div>
        <div v-else>
          <Button
            type="info"
            ghost
            shape="circle"
            icon="md-create"
            @click="handleEdit(row, index)"
            >编辑</Button
          >
        </div>
      </template>
    </Table>
    <Page
      :current="pageIndex"
      :total="dataCount"
      :page-size="pageSize"
      show-total
      show-sizer
      :page-size-opts="[10,15,20,25,30]"
      @on-change="changePage"
      @on-page-size-change="getPageSize"
      style="margin-left: 10px;margin-top: 5px;"
    />
  </div>
</template>

<script>
import { addOperaLog } from '../../../utils/utils'
import renderMessege from "../../components/message";
export default {
  data() {
    return {
      searchParam: {
        AreaCode: ''
      },
      areaList: [],
      userRole: {},
      userGrade: 0,
      cdList: [],
      columns: [
        {
          title: "地区名称",
          slot: "AreaCode",
          minWidth: 120
        },
        {
          title: "名称",
          key: "AuditReasonName",
          width: 210
        },
        {
          title: "设置说明",
          slot: "Explain",
          minWidth: 160
        },

        {
          title: "提醒内容",
          slot: "Tips",
          minWidth: 140
        },
        {
          title: "启用",
          slot: "IsAvailable",
          minWidth: 100,
          filters: [
            {
              label: "是",
              value: 1
            },
            {
              label: "否",
              value: 0
            }
          ]
        },
        {
          title: "是否允许受理",
          slot: "IsCanAccept",
          minWidth: 140,
          filters: [
            {
              label: "是",
              value: 1
            },
            {
              label: "否",
              value: 0
            }
          ]
        },
        {
          title: "是否需要审核",
          slot: "IsNeedAudit",
          minWidth: 140,
          filters: [
            {
              label: "是",
              value: 1
            },
            {
              label: "否",
              value: 0
            }
          ],
          filterMultiple: false,
          filterMethod(value, row) {
            if (value === 1) {
              return row.IsNeedAudit === 1;
            } else if (value === 0) {
              return row.IsNeedAudit === 0;
            }
          }
        },
        {
          title: "是否自动审核",
          slot: "IsAutoAudit",
          minWidth: 140,
          filters: [
            {
              label: "是",
              value: 1
            },
            {
              label: "否",
              value: 0
            }
          ],
          filterMultiple: false,
          filterMethod(value, row) {
            if (value === 1) {
              return row.IsAutoAudit === 1;
            } else if (value === 0) {
              return row.IsAutoAudit === 0;
            }
          }
        },
        {
          title: "操作",
          slot: "action",
          minWidth: 100,
          maxWidth: 100,
          fixed: 'right'
        }
      ],
      editIndex: -1, // 当前聚焦的输入框的行数
      editExplain: "", //第三列输入框
      editTips: 0, //第四列输入框
      editEffectInspectionLogin: 0, //第五列输入框
      editIsCanAccept: 0,
      editIsAvailable: 0,
      editIsNeedAudit: 0,
      editIsAutoAudit: 0,
      BLData: [],
      initData: [], //初始化车辆信息条数
      dataCount: 0,
      pageSize: 15,
      pageIndex: 1, //默认当前为第一页
      height: 0,
      saveData: '',
      isAdmin: false
    };
  },
  methods: {
    async getCDData() {
      let cdname = [
        {
          tableName: "area",
          columns: "AreaCode as CodeValue,AreaCode as CodeName",
          where: ""
        }
      ];
      if (this.$getDBTable) {
        let cdList = cdname.map(item => item.tableName);
        await this.$getDBTable(cdList).then(data => {
          this.cdList = JSON.parse(data[0])
        })
      } else {
        const res = await this.$curl.get("api/hj/getCDData", {
          CDDataList: JSON.stringify(cdname)
        });
        const { state, data } = res;
        if (state) {
          this.cdList = data[0];
        }
      }
    },
    getAreaName(AreaCode){
      let AreaName = '';
      if(this.cdList.length) {
        let index = this.cdList.findIndex(item => item.AreaCode == AreaCode);
        if(index != -1) {
          AreaName = this.cdList[index].AreaName;
        } else {
          AreaName = AreaCode
        }
      }
      return AreaName
    },
    handleEdit(row, index) {
      this.saveData = row
      this.editExplain = row.Explain;
      this.editTips = row.Tips;
      this.editIsAvailable = row.IsAvailable;
      this.editIsCanAccept = row.IsCanAccept;
      this.editIsNeedAudit = row.IsNeedAudit;
      this.editIndex = index;
    },
    handleSave(index) {
      this.BLData[index].Explain = this.editExplain;
      this.BLData[index].Tips = this.editTips;
      this.BLData[index].IsAvailable = this.editIsAvailable;
      this.BLData[index].IsCanAccept = this.editIsCanAccept;
      this.BLData[index].IsNeedAudit = this.editIsNeedAudit;
      this.BLData[index].IsAutoAudit = this.editIsAutoAudit;
      // console.log(this.BLData[index])
      //保存受理审核设置信息
      this.$curl
        .post("api/hj/saveAuditSettingData", { AuditSettingData : this.BLData[index] })
        .then(res => {
          const { code } = res;
          if (code) {
            let params = {}
            params.DataSource = []
            params.DataTable = 'AuditReasonList'
            for (let keyold in this.saveData) {
              for (let keynew in this.BLData[index]) {
                if (keyold == keynew) {
                  if (this.saveData[keyold] != this.BLData[index][keynew]) params.DataSource.push(`{old: ${this.saveData[keyold]}, new: ${this.BLData[index][keynew]}, field: ${keyold}}`)
                }
              }
            }
            if (params.DataSource != []) {
              addOperaLog(this, params)
            }
            this.$Message.success("保存成功！");
          } else {
            this.$Message.error("保存失败，请重新保存！");
          }
        })
      this.editIndex = -1;
    },
    retrunName(value) {
      return value === 1 || value === "1" ? "是" : "否";
    },
    changePage(index) {
      //分页功能
      let _start = (index - 1) * this.pageSize;
      let _end = index * this.pageSize;
      this.pageIndex = index;
      this.BLData = this.initData.slice(_start, _end);
    },
    getPageSize(pageSize) {
      //获取当前页的大小
      this.pageSize = pageSize;
      let _start = (this.pageIndex - 1) * pageSize;
      let _end = this.pageIndex * pageSize;
      this.BLData = this.initData.slice(_start, _end);
    },
    getAllSettingData() {
      let parentAreaCode = '';
      if(this.searchParam.AreaCode) {
        let index = this.areaList.findIndex(item => item.AreaCode === this.searchParam.AreaCode);
        if(index !== -1) {
          parentAreaCode = this.areaList[index].ParentAreaCode;
        } 
      }
      this.$curl
        .get("api/hj/getAcceptSettingData", {
          params: JSON.stringify({
            AreaCode: this.searchParam.AreaCode,
            userGrade: this.userGrade,
            userRole: this.userRole,
            parentAreaCode: parentAreaCode
          })
        })
        .then(res => {
          // console.log(res)
          const { code, data } = res;
          if (code) {
            this.pageIndex = 1;
            this.initData = data.list;
            this.dataCount = data.list.length;
            // //初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
            if (this.dataCount < this.pageSize) {
              this.BLData = this.initData;
            } else {
              this.BLData = this.initData.slice(0, this.pageSize);
            }
          }
        })
        .catch(err => {
          this.$Message.error('受理审核配置获取失败！');
        });
    },
    setHeight() {
      this.height = this.$refs.bs.offsetHeight - 100; //this.$refs.bs.getBoundingClientRect().height;
    },
    getUserRole(){
      this.$curl.get('api/hj/getUserAreaData')
        .then(res => {
          if (res.code) {
            this.areaList = res.data.cityList;
            this.userRole = res.data.role;
            this.userGrade = res.data.roleGrade;
            this.searchParam.AreaCode = this.areaList[0].AreaCode;
            this.getAllSettingData();
          }
        })
    },
    resetAcceptAuditSetting() {
      this.$curl.get('api/hj/resetAcceptAuditSetting')
      .then(res => {
        if(res.code) {
          this.$Message.success(res.message)
          this.getAllSettingData();
        } else {
          this.$Notice.warning({
            title: "初始化失败",
            desc: res.message
          });
        }
      })
    }
  },
  beforeRouteEnter(to, from, next) {
    next();
  },
  components: {
    renderMessege
  },
  mounted() {
    this.isAdmin = this.$store.state.core.user.isAdmin;
    this.getUserRole();
    this.getCDData();
    window.addEventListener("resize", this.setHeight);
    this.$nextTick(() => {
      this.setHeight();
    })
    // this.setHeight();
    // this.getAllBLData();
  },
  watch: {
    editIsCanAccept: function(newValue, oldValue){
      if(newValue == 0) {
        this.editIsNeedAudit = 0;
        this.editIsAutoAudit = 0;
      }
    },
    editIsNeedAudit: function(newValue, oldValue) {
      if(newValue == 0) {
        this.editIsAutoAudit = 0;
      }
    }
  },
  created() { },
  destroyed() {
    window.removeEventListener("resize", this.setHeight);
  }
};
</script>

<style lang="scss" scoped>
.search {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  .input {
    width: 160px;
    margin-right: 10px;
  }
}
</style>

