<template>
  <div class="maincontent" style="padding: 10px;">
    <div class=" fx__bgcolor" style="margin-bottom:3px;">
      <Menu
        mode="horizontal"
        :active-name="tabsIndex"
        style="position: sticky; top: 0; flex: 1"
      >
        <MenuItem
          :name="index"
          v-for="(item, index) in tabs"
          :key="index"
          @click.native="myscroll(index)"
          >{{ item.Config }}
        </MenuItem>
      </Menu>
    </div>

    <div class="content" ref="fx__bgcolor">
      <div class="scroll-content">
        <div
          class="xl_user fx__bgcolor item-content"
          style="margin-bottom: 20px;"
        >
          <div
            class="name_user xl_name_user fx__box fx__bgcolor"
            style="position: relative"
          >
            <div class="xl_userifon">
              <div style="display: flex">
                <div style="flex: 30%">
                  <div
                    style=" display: flex;justify-content: center;align-items: center;flex-direction: column;"
                  >
                    <Badge
                      :text="stationData.StationStatus"
                      type="primary"
                      style="width: -1px"
                    >
                      <img
                        :src="jc_data.jc_img"
                        style="
                                                    max-width: 6rem;
                                                    margin-bottom: 0rem;
                                                    border: 3px
                                                        solid
                                                        #fff;
                                                    border-radius: 100%;
                                                    box-shadow: 0
                                                        1px 1px
                                                        rgba(
                                                            0,
                                                            0,
                                                            0,
                                                            0.1
                                                        );
                                                "
                      />
                    </Badge>
                    <h2>
                      {{ stationData.StationName }}
                    </h2>
                    <span
                      style="
                                                cursor: pointer;
                                            "
                      @click="RecordScoresClick(stationData)"
                    >
                      {{ changchun ? "总计分" : "剩余计分" }}
                      <span
                        v-if="changchun"
                        style="
                                                    font-size: 18px;
                                                    color: #f5a623;
                                                    letter-spacing: 10px;
                                                "
                        >{{ RecordScores }}</span
                      >
                      <span
                        v-else
                        style="
                                                    font-size: 18px;
                                                    color: #f5a623;
                                                    letter-spacing: 10px;
                                                "
                        >{{ " " + RecordScores * 2 || 0 }}</span
                      >
                    </span>
                    <div
                      v-if="!changchun"
                      style="
                                                cursor: pointer;
                                            "
                      @click="RecordScoresClick(stationData)"
                    >
                      <Rate
                        allow-half
                        disabled
                        :count="6"
                        v-model="RecordScores"
                      ></Rate>
                    </div>
                  </div>

                  <Button
                    v-if="hasAuthorityEdit"
                    @click="showEditModal"
                    type="primary"
                    shape="circle"
                    icon="md-create"
                    style="
                                            text-align: center;
                                            position: absolute;
                                            top: 10px;
                                            right: 20px;
                                        "
                    >编辑信息</Button
                  >
                </div>
                <div
                  style="
                                        flex: 70%;
                                        font-size: 16px;
                                        line-height: 35px;
                                    "
                  class="info"
                >
                  <i-col
                    :sm="6"
                    :lg="6"
                    style="
                                            margin-top: 20px;
                                            margin-bottom: 20px;
                                        "
                  >
                    <Tooltip content="联系人" placement="right">
                      <Icon type="ios-man" size="24" color="#FD9912" />
                      {{ stationData.FaRen || "暂无" }}
                    </Tooltip>
                  </i-col>
                  <i-col
                    :sm="18"
                    :lg="18"
                    style="
                                            margin-top: 20px;
                                            margin-bottom: 20px;
                                        "
                  >
                    <Tooltip content="注册时间" placement="right">
                      <Icon type="md-time" size="24" color="#FD9912" />
                      {{
                        stationData.RegisterDate | dataFormat("yyyy-MM-dd") ||
                          "暂无"
                      }}
                    </Tooltip>
                  </i-col>
                  <i-col
                    :sm="6"
                    :lg="6"
                    style="
                                            margin-bottom: 20px;
                                        "
                  >
                    <Tooltip content="电话" placement="right">
                      <Icon type="ios-call" size="24" color="#FD9912" />
                      {{ stationData.Tel || "暂无" }}
                    </Tooltip>
                  </i-col>
                  <i-col
                    :sm="18"
                    :lg="18"
                    style="
                                            margin-bottom: 20px;
                                        "
                  >
                    <Tooltip content="Email" placement="right">
                      <Icon type="ios-mail" size="24" color="#FD9912" />
                      {{ stationData.Email || "暂无" }}
                    </Tooltip>
                  </i-col>
                  <i-col
                    :lg="24"
                    style="
                                            margin-bottom: 20px;
                                        "
                  >
                    <Tooltip content="地址" placement="right">
                      <Icon type="md-home" size="24" color="#FD9912" />
                      {{ stationData.Address || "暂无" }}
                    </Tooltip>
                  </i-col>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Card
          :padding="0"
          :lg="24"
          class="fx__bgcolor item-content"
          style="margin-bottom: 20px"
        >
          <p slot="title">资质证书</p>
          <edit-file-info
            ref="editFileInfo"
            :StationCode="stationCode.toString()"
            @ruleFileInfo="ruleFileInfos"
          ></edit-file-info>
        </Card>

        <Lines
          class="item-content"
          :StationCode="stationCode"
          :Permission="Permission"
          :hasAuthorityEdit="hasAuthorityEdit"
          :activeStep="tabsIndex"
          :curIndex="2"
          style="margin-bottom: 20px"
        ></Lines>

        <detectionMethod
          class="item-content"
          :StationCode="stationCode"
          :Permission="Permission"
          :hasAuthorityEdit="hasAuthorityEdit"
          :hasAuthorityDel="hasAuthorityDel"
          :activeStep="tabsIndex"
          :curIndex="3"
          style="margin-bottom: 20px"
        ></detectionMethod>

        <stationDevices
          class="item-content"
          :StationCode="stationCode"
          :Permission="Permission"
          :hasAuthorityEdit="hasAuthorityEdit"
          :hasAuthorityDel="hasAuthorityDel"
          :activeStep="tabsIndex"
          :curIndex="4"
          style="margin-bottom: 20px"
        ></stationDevices>

        <stationStaffs
          class="item-content"
          :StationCode="stationCode"
          :Permission="Permission"
          :hasAuthorityEdit="hasAuthorityEdit"
          :hasAuthorityDel="hasAuthorityDel"
          :activeStep="tabsIndex"
          :curIndex="5"
          style="margin-bottom: 20px"
        ></stationStaffs>

        <DVRInfo
          class="item-content"
          :StationCode="stationCode"
          :Permission="Permission"
          :hasAuthorityEdit="hasAuthorityEdit"
          :activeStep="tabsIndex"
          :curIndex="6"
          style="height: 100%; margin-bottom: 20px"
        ></DVRInfo>

        <Cameras
          class="item-content"
          :StationCode="stationCode"
          :Permission="Permission"
          :hasAuthorityEdit="hasAuthorityEdit"
          :hasAuthorityDel="hasAuthorityDel"
          :activeStep="tabsIndex"
          :curIndex="7"
          style="margin-bottom: 20px"
        ></Cameras>

        <line-check
          class="item-content"
          :StationCode="stationCode"
          :activeStep="tabsIndex"
          :curIndex="8"
          style="margin-bottom: 20px"
        ></line-check>

        <self-check
          class="item-content"
          :StationCode="stationCode"
          :activeStep="tabsIndex"
          :curIndex="9"
          style="margin-bottom: 20px"
        ></self-check>

        <confidence
          class="item-content"
          style="margin-bottom: 20px"
          v-if="curStationConfidence.length"
          :curStationConfidence="curStationConfidence"
          :countBase="countBase"
          :initform="initform"
          :StationCode="stationCode"
          :activeStep="tabsIndex"
          :curIndex="10"
        ></confidence>
      </div>
    </div>

    <Modal v-model="show_editStation" width="80" title="站点详情">
      <edit-station
        ref="editStation"
        :StationCode="stationCode"
        @validStatus="funStatus"
        @saveState="saveStates"
        style="margin-top: 20px"
      ></edit-station>
      <!--自定义尾部按钮事件-->
      <div slot="footer">
        <Button type="text" size="large" @click="show_editStation = false"
          >取消</Button
        >
        <Button type="primary" size="large" @click="handleSave">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
const path = require("path");
const files = require.context("./listEditing", false, /\.vue$/);
const modules = {};
files.keys().forEach((key) => {
  if (key !== "./line.vue") {
    const name = path.basename(key, ".vue");
    modules[name] = files(key).default || files(key);
  }
});
let jcz_img = require("../../../../public/hj/img/avator.png");
let error_img = require("../../../../public/hj/img/error.gif");
import editStation from "./Model/editStation.vue";
import editFileInfo from "./Model/editFileInfo.vue";
import Lines from "./listEditing/line.vue";
// import CheckInfo from "./CheckInfo.index.vue";
// import LineCheck from './listEditing/lineCheck.vue';
export default {
  data() {
    return {
      Area: [], //行政区域
      islayoutscreen: false,
      isShowStaticDiv: false,
      showBZ: true,
      rightDiv: true,
      show_loading: false,
      isPc: this.$app.helper.screen.isPC, //判断是pc还是手机
      stationCode: "0",
      num: 0,
      Tgl: {},
      hasAuthority: false,
      hasAuthorityEdit: false, // 编辑权限
      hasAuthorityDel: false, // 删除权限
      RecordScores: 6,
      stationData: {},
      Permission: false,
      stationEdits: false,
      title_show: false,
      jc_data: {
        jc_img: jcz_img,
        // error_img: error_img,
      },
      tabs: [
        {
          Config: "基本信息",
        },
        {
          Config: "资质证书",
        },
        {
          Config: "检测线信息",
        },
        {
          Config: "检测线方法设置",
        },
        {
          Config: "检测设备信息",
        },
        {
          Config: "检测人员信息",
        },
        {
          Config: "硬盘录像机信息",
        },
        {
          Config: "摄像头信息",
        },
        {
          Config: "检测线标定信息",
        },
        {
          Config: "设备检查信息",
        },
      ],
      tabsIndex: 0,
      tabsItme: [],
      arrDom: [],
      scrollTop: 0,
      stationTree: [],
      pageNum: 1,
      pageSize: 10,
      totalPage: 0,
      show_loading: false,
      Input_value: "",
      filterList: [],
      isSmall: true,
      windowWidth: "",
      windowHeight: "",
      show_editStation: false,
      show_editGroups: false,
      show_areaAddModal: false,
      areaSaveLoading: true,
      areaShowLoading: true, // 行政区域loading
      stationLoading: true,
      areaForm: {
        AreaID: "",
        Name: "",
        OrderID: "",
      },
      areaRules: {
        AreaID: [
          {
            required: true,
            message: "请输入区域编号",
            trigger: "blur",
          },
        ],
        Name: [
          {
            required: true,
            message: "请输入区域名称",
            trigger: "blur",
          },
        ],
        OrderID: [
          {
            required: true,
            message: "请输入排序",
            trigger: "blur",
          },
        ],
      },
      checkallgroup: "",
      areaTreeData: [], // 数据库中已有的分组配置
      tempAreaData: [], // 缓存本次打开分组编辑对话框的操作
      buttonProps: {
        type: "default",
        size: "small",
      },
      switchProps: {
        size: "small",
      },
      stationTreeData: [],
      areaAddOrEdit: 1,
      selectedAreaGroup: {}, // 当前选中的分组规则
      selectedStationArr: [], // 当前选中分组的包含的站点
      otherBusinessID: [], // 其他区域的站点code
      countBase: "",
      confidenceList: [],
      curStationConfidence: [],
      initform: {},
      stationGroupAuth: false,
      changchun: false,
    };
  },
  components: {
    ...modules,
    editStation,
    editFileInfo,
    Lines,
    // CheckInfo,
  },
  methods: {
    // 获取CD表数据
    async loadCDDatas() {
      const _this = this;
      const list = [
        {
          tableName: "Area",
          columns: "AreaCode,AreaName",
          where: "",
        },
        {
          tableName: "CD_VehicleType",
          columns: "CodeValue,CodeName",
          where: "IsAvailable=1",
        },
        {
          tableName: "CD_PG",
          columns: "CodeValue,CodeName",
          where: "IsAvailable=1",
        },
        {
          tableName: "CD_InspectionNature",
          columns: "CodeValue,CodeName",
          where: "IsAvailable=1",
        },
        {
          tableName: "CD_InspectionMethod",
          columns: "CodeValue,CodeName",
          where: "",
        },
      ];
      if (this.$getDBTable) {
        let cdList = list.map((item) => item.tableName);
        await this.$getDBTable(cdList).then((res) => {
          let result = res.map((e, index) => {
            return JSON.parse(e);
          });
          const CD_Name = [
            "area",
            "CD_VehicleType",
            "CD_PG",
            "CD_InspectionNature",
            "CD_InspectionMethod",
          ];
          result.map((items, index) => {
            if (CD_Name[index] === "area") {
              _this.initform[CD_Name[index]] = {};
              items.forEach((item) => {
                _this.initform[CD_Name[index]][item.AreaCode] = item.AreaName;
              });
            } else {
              _this.initform[CD_Name[index]] = items;
            }
          });
        });
      } else {
        const res = await this.$curl.get("api/hj/getCDData", {
          CDDataList: JSON.stringify(list),
        });
        if (res.state) {
          const CD_Name = [
            "area",
            "CD_VehicleType",
            "CD_PG",
            "CD_InspectionNature",
            "CD_InspectionMethod",
          ];
          res.data.map((items, index) => {
            if (CD_Name[index] === "area") {
              _this.initform[CD_Name[index]] = {};
              items.forEach((item) => {
                _this.initform[CD_Name[index]][item.AreaCode] = item.AreaName;
              });
            } else {
              _this.initform[CD_Name[index]] = items;
            }
          });
        }
      }
    },
    // 获取数据可疑性是按月统计还是按周统计
    getCountBaseConfig() {
      const _this = this;
      _this.$curl
        .get("api/hj/getSysConfig", {
          params: {
            FieldKey: ["CountLTDataByMonthOrWeek", "CountLTDataCardinalNumber"],
          },
        })
        .then((res) => {
          if (res.state && res.data) {
            _this.countBase = res.data
              .filter((r) => r.FieldKey == "CountLTDataByMonthOrWeek")[0]
              .FieldValue.toUpperCase();
            _this.getAnalysisData();
          }
        });
    },
    // 获取首页置信度数据
    getAnalysisData() {
      const _this = this;
      _this.$curl
        .get("api/hj/getDataAnalysisFromRedis", {
          countBase: _this.countBase,
        })
        .then((res) => {
          if (res.code) {
            _this.confidenceList = res.data;
          }
        });
    },
    RecordScoresClick(data) {
      // 默认跳到佛山和其他地区
      // console.log(data);
      if (data.CityCode == "440600") {
        this.$router.push({
          name: "hj-stationScoreManage",
          params: {
            StationCode: data.StationCode,
            CityCode: data.CityCode,
          },
        });
      } else {
        this.$router.push({
          name: "hj-scoringManagement",
          params: {
            StationCode: data.StationCode,
            CityCode: data.CityCode,
          },
        });
      }
    },
    //新增站点
    loadnew() {
      this.$router.push({ name: "hj-newStataion" });
    },
    async funStatus(status) {
      //站点正则验证
      //判断是否验证通过
      if (!status) return;
      this.stationDataAdd = this.$refs.editStation.formItem;
      this.$refs.editStation.SaveStation();
    },
    async Data_Processing(StationCode) {
      this.stationData = {};
      const self = this;
      let params = {
        StationCode: StationCode,
      };
      // console.log(params);
      //获取点位信息
      let resData = await this.$curl.get("api/hj/getStations", {
        params: JSON.stringify(params),
      });
      // console.log(resData);
      if (resData.state) {
        if (resData.data) {
          this.stationData = resData.data;
        }
      } else {
        this.$Notice.warning({
          title: "提示",
          desc: "获取站点数据失败!",
        });
      }
      //获取剩余积分信息
      if (StationCode.slice(0, 4) == "2201") {
        self.changchun = true;
        self.RecordScores = 0;
        let RecordScore = await this.$curl.get(
          "api/hj/GetStationScoringIntegral",
          {
            StationCode,
          }
        );
        if (RecordScore.state) {
          if (RecordScore.data)
            self.RecordScores = RecordScore.data.RecordTotalScore;
        } else {
          this.$Notice.warning({
            title: RecordScore.msg,
          });
        }
      } else {
        self.changchun = false;
        self.RecordScores = 6;
        let RecordScore = await this.$curl.get("api/hj/GetStationIntegral", {
          StationCode,
        });
        if (RecordScore.state) {
          if (RecordScore.data)
            self.RecordScores = (12 - RecordScore.data.AccumulateScore) / 2;
        } else {
          this.$Notice.warning({
            title: RecordScore.msg,
          });
        }
      }
    },
    // 标签叠加
    label(data, tag, index) {
      let labelNum = data.length;
      let textNum = 0;
      let num = -22;

      for (let i = 0; i < data.length; i++) {
        textNum += data[i] && data[i].length;
      }
      if (this.width < 1245 && this.width > 1033) {
        if (index != 0) {
          // 标签数小于5且字数小于14
          if (labelNum < 5 && textNum < 14) {
            let x = -((data[index - 1].length - 1) * 12 + 22 - 30);
            return `margin:0px 0px 0px ` + x + `px;`;
          }
          // 标签数小于5且字数在14~23之间
          else if (labelNum < 5 && textNum > 13 && textNum < 24) {
            let x = -((data[index - 1].length - 1) * 12 + 22 - 15.5);
            return `margin:0px 0px 0px ` + x + `px;`;
          }
          // 标签数大于4且字数在14~23之间
          else if (labelNum > 4 && textNum > 13 && textNum < 24) {
            let x = -((data[index - 1].length - 1) * 12 + 22 - 10.5);
            return `margin:0px 0px 0px ` + x + `px;`;
          }
          // 字数在24~31之间
          else if (textNum > 23 && textNum < 32) {
            let x = -((data[index - 1].length - 1) * 12 + 22 - 2);
            return `margin:0px 0px 0px ` + x + `px;`;
          } else {
            let x = -((data[index - 1].length - 1) * 12 + 22);
            return `margin:0px 0px 0px ` + x + `px;`;
          }
        }
      } else if (this.width < 1033 && this.width > 929) {
        if (index != 0) {
          // 标签数小于5且字数小于14
          if (labelNum < 5 && textNum < 14) {
            if (this.width > 934) {
              let x = -((data[index - 1].length - 1) * 12);
              return `margin:0px 0px 0px ` + x + `px;`;
            } else {
              let x = -((data[index - 1].length - 1) * 12 + 9);
              return `margin:0px 0px 0px ` + x + `px;`;
            }
          }
          // 标签数小于5且字数在14~23之间
          else if (labelNum < 5 && textNum > 13 && textNum < 24) {
            let x = -((data[index - 1].length - 1) * 12 + 22 - 15.5);
            return `margin:0px 0px 0px ` + x + `px;`;
          }
          // 标签数大于4且字数在14~23之间
          else if (labelNum > 4 && textNum > 13 && textNum < 24) {
            if (this.width > 982) {
              let x = -((data[index - 1].length - 1) * 12 + 22 - 6.5);
              return `margin:0px 0px 0px ` + x + `px;`;
            } else {
              let x = -((data[index - 1].length - 1) * 12 + 22 - 1.5);
              return `margin:0px 0px 0px ` + x + `px;`;
            }
          } else {
            if (this.width > 986) {
              let x = -((data[index - 1].length - 1) * 12 + 22 + 1);
              return `margin:0px 0px 0px ` + x + `px;`;
            } else if (this.width > 971 && this.width > 985) {
              let x = -((data[index - 1].length - 1) * 12 + 22 + 2);
              return `margin:0px 0px 0px ` + x + `px;`;
            } else {
              let x = -((data[index - 1].length - 1) * 12 + 22 + 5);
              return `margin:0px 0px 0px ` + x + `px;`;
            }
          }
        }
      } else {
        // 标签数小于5且字数不超过9
        if (textNum <= 9 && labelNum < 5) return ``;
        // 两个标签
        if (labelNum == 2 && textNum > 11 && index != 0) {
          let y = -((data[index - 1].length - 1) * 12 + 22 - 31);
          return `margin:0px 0px 0px ` + y + `px;`;
        }
        // 标签数大于2且字数小于12
        if (labelNum > 2 && textNum < 12 && index != 0) {
          num = num * labelNum * 0.05;
          return `margin:0px 0px 0px ` + num + `px;`;
        }
        // 标签数大于2且字数大于11
        if (labelNum > 2 && textNum > 11 && index != 0) {
          // 标签数小于5且字数小于14
          if (labelNum < 5 && textNum < 14) {
            let x = -((data[index - 1].length - 1) * 12 + 22 - 30);
            return `margin:0px 0px 0px ` + x + `px;`;
          }
          // 标签数小于5且字数在14~23之间
          else if (labelNum < 5 && textNum > 13 && textNum < 24) {
            let x = -((data[index - 1].length - 1) * 12 + 22 - 19.5);
            return `margin:0px 0px 0px ` + x + `px;`;
          }
          // 标签数大于4且字数在14~23之间
          else if (labelNum > 4 && textNum > 13 && textNum < 24) {
            let x = -((data[index - 1].length - 1) * 12 + 22 - 15.5);
            return `margin:0px 0px 0px ` + x + `px;`;
          }
          // 字数在24~31之间
          else if (textNum > 23 && textNum < 32) {
            let x = -((data[index - 1].length - 1) * 12 + 22 - 6.5);
            return `margin:0px 0px 0px ` + x + `px;`;
          } else {
            let x = -((data[index - 1].length - 1) * 12 + 22 - 5.5);
            return `margin:0px 0px 0px ` + x + `px;`;
          }
        }
      }
    },
    // 标签颜色
    labelColor(index, tag) {
      // if()
      if (tag && tag.indexOf("重") != -1) {
        return "red";
      } else if (tag && tag.indexOf("新") != -1) {
        return "#7ED86E";
      } else if (index == 0) {
        return "#81bffc";
      } else {
        switch (index % 2) {
          case 0:
            return "#5FDAEF";
            break;
          default:
            return "#FDBC4E";
        }
      }
    },
    async saveStates(status) {
      if (!status) return;
      let params = {
        StationCode: this.stationCode,
      };
      //获取点位信息
      let resData = await this.$curl.get("api/hj/getStations", {
        params: JSON.stringify(params),
      });
      if (resData.state) {
        if (resData.data) {
          this.stationData = resData.data;
        }
      } else {
        this.$Notice.warning({
          title: "提示",
          desc: "获取站点数据失败!",
        });
      }
      this.show_editStation = false;
      //   this.Data_Processing(this.StationCode);
      // let self = this
      // setTimeout(()=>{
      //   self.Data_Processing();
      // },1000)
    },
    ruleFileInfos(data) {
      if (data.length != 0) {
        this.$Notice.warning({
          title: data.join(",<br/>"),
        });
        return;
      }
      this.current += 1;
    },
    async getAuthority() {
      //判断是否已存在值
      if (this.$store.state.hasAuthority) return;
      let res = await this.$curl.post("api/hj/hasAuthority", {
        type: "cz04",
      });
      if (res.state) {
        this.Permission = res.hasAuthority;
      } else {
        this.hasAuthority = false;
        this.$Notice.warning({
          title: "提示",
          desc: "获取权限信息失败!",
        });
      }

      let result = await this.$curl.post("api/hj/hasAuthority", {
        type: "cz13",
      });
      if (result.state) {
        this.stationGroupAuth = result.hasAuthority;
      } else {
        this.$Notice.warning({
          title: "提示",
          desc: "获取权限信息失败!",
        });
      }
    },
    handleSave() {
      this.$refs.editStation.HandleSubmit("formCustom");
    },
    //获取编辑权限
    async getAuthorityEdit() {
      //判断是否已存在值
      if (this.$store.state.hasAuthority) return;

      let res = await this.$curl.post("api/hj/hasAuthority", {
        type: "cz03",
      });
      if (res.state) {
        this.hasAuthorityEdit = res.hasAuthority;
      } else {
        this.hasAuthorityEdit = false;
        this.$Notice.warning({
          title: "提示",
          desc: "获取权限信息失败!",
        });
      }
    },
    //获取删除权限
    async getAuthorityDel() {
      //判断是否已存在值
      if (this.$store.state.hasAuthority) return;

      let res = await this.$curl.post("api/hj/hasAuthority", {
        type: "cz05",
      });
      if (res.state) {
        this.hasAuthorityDel = res.hasAuthority;
      } else {
        this.hasAuthorityDel = false;
        this.$Notice.warning({
          title: "提示",
          desc: "获取权限信息失败!",
        });
      }
    },
    myscroll(index) {
      let self = this;
      let target = this.$refs.fx__bgcolor;
      let scrollItems = document.querySelectorAll(".item-content");

      let totalY = scrollItems[index].offsetTop - scrollItems[0].offsetTop;
      let distance = this.$refs.fx__bgcolor.scrollTop + 60;
      let step = totalY;
      if (totalY > distance) {
        smoothDown(this.$refs.fx__bgcolor);
      } else {
        let newTotal = distance - totalY;
        step = newTotal;
        smoothUp(this.$refs.fx__bgcolor);
      }

      function smoothDown(element) {
        self.tabsIndex = index;
        if (distance < totalY) {
          distance += step;
          element.scrollTop = distance;
          setTimeout(smoothDown.bind(self, element), 0);
        } else {
          element.scrollTop = totalY;
        }
      }

      function smoothUp(element) {
        self.tabsIndex = index;
        if (distance > totalY) {
          distance -= step;
          element.scrollTop = distance;
          setTimeout(smoothUp.bind(self, element), 0);
        } else {
          element.scrollTop = totalY;
        }
      }
    },
    listenScroll(e) {
      this.scrollTop = e.target.scrollTop;
      let scrollTop = e.target.scrollTop;
      for (let i = 0; i < this.arrDom.length; i++) {
        if (this.arrDom[this.arrDom.length - 1].offsetTop - scrollTop > 10) {
          if (
            this.arrDom[i].offsetTop - scrollTop <= 10 &&
            this.arrDom[i + 1].offsetTop - scrollTop > 10
          ) {
            this.tabsIndex = i + 1;
          }
        } else {
          this.tabsIndex = this.arrDom.length;
        }
      }
      if (scrollTop === 0) {
        this.tabsIndex = 0;
      }
    },
    async getDetail(item) {
      // console.log(item);
      if (this.stationCode === item.StationCode) return;
      this.curStationConfidence = JSON.parse(
        JSON.stringify(this.confidenceList)
      );
      this.curStationConfidence.forEach((v) => {
        v.statisticData = v.statisticData.filter((k) => {
          return k.StationCode == item.StationCode;
        });
      });
      this.curStationConfidence = this.curStationConfidence.filter((v) => {
        return v.statisticData.length !== 0;
      });
      // if (this.curStationConfidence.length) this.tabs.push(
      //   {
      //     Config: "数据可疑性分析"
      //   });
      // else this.tabs.forEach((v, index) => { if (v.Config == '数据可疑性分析') { this.tabs.splice(index, 1) } })
      let self = this;
      this.stationCode = item.StationCode;
      this.$refs.fx__bgcolor.scrollTop = 0;
      this.rightDiv = false;
      await this.Data_Processing(this.stationCode);
      setTimeout(() => {
        self.rightDiv = true;
      }, 300);
    },
    showEditModal() {
      this.show_editStation = true;
      this.$refs.editStation.searchStation();
    },

    async opengroupModal() {
      this.tempAreaData = [];
      this.getAllArea();
      this.getAllStation();
      this.selectedAreaGroup = {};
      this.selectedStationArr = [];
      this.show_editGroups = true;
    },
    showaddGroupModal() {
      this.areaAddOrEdit = 1;
      this.show_areaAddModal = true;
    },
    //启动，全选，重置，还原
    checkgroupStaus() {
      let active;
      if (this.checkallgroup == 1) {
        //全选
        active = true;
        this.tempAreaData.forEach((v) => {
          v.active = active;
        });
      }
      if (this.checkallgroup == 0) {
        //取消全选
        active = false;
        this.tempAreaData.forEach((v) => {
          v.active = active;
        });
      }
      if (this.checkallgroup == 2) {
        //还原
        this.getAllArea();
        this.getAllStation();
        // this.areaTreeData.forEach(v => {
        //   v.active = v.isActive ? true : false;
        // });
      }
      if (this.checkallgroup == 3) {
        // 重置
        this.tempAreaData.forEach((item) => (item.BusinessID = null));
        this.stationTreeData.forEach((item) => {
          item.checked = false;
          item.disabled = false;
        });
      }
    },
    // 选中其中一个分组规则
    async areaTreeChange(arr, obj) {
      let _this = this;
      // 清空其他已选中的
      arr.forEach((item) => {
        item.checked = false;
      });
      // 只选中最后一次选中的
      obj.checked = true;
      _this.selectedAreaGroup = obj;
      // 过滤选中区域的站点
      let stationArr = [],
        otherStationArr = [];
      if (obj.BusinessID) {
        stationArr = obj.BusinessID.split(",");
        this.selectedStationArr = obj.BusinessID.split(",");
      }
      // 获取选中分组之外的站点
      // await _this.$curl
      //   .get("api/hj/getOtherBusinessID", {
      //     params: JSON.stringify(obj.ID)
      //   })
      //   .then(res => {
      //     _this.otherBusinessID = res.data;
      //   })
      //   .catch(err => {
      //     _this.$Message.error(err.msg);
      //   });
      _this.otherBusinessID = [];
      _this.tempAreaData.forEach((item) => {
        if (item.ID !== obj.ID) {
          // console.log('非当前分组ID：',item.ID);
          _this.otherBusinessID.push({
            BusinessID: item.BusinessID,
          });
        }
      });
      _this.otherBusinessID.map((v) => {
        if (v.BusinessID) {
          let arr = v.BusinessID.split(",");
          arr.map((el) => {
            otherStationArr.push(el);
          });
        }
      });

      _this.stationTreeData.forEach((v) => {
        _this.$set(v, "checked", false);
        _this.$set(v, "disabled", false);
        stationArr.map((el) => {
          if (v.value == el) {
            _this.$set(v, "checked", true);
          }
        });
        otherStationArr.map((o) => {
          if (v.value == o) {
            _this.$set(v, "checked", true);
            _this.$set(v, "disabled", true);
          }
        });
      });
    },
    // 获取当前分组配置
    async getAllArea() {
      let _this = this;
      await _this.$curl
        .get("api/hj/getAllArea")
        .then((res) => {
          let data = res.data;
          data.map((item) => {
            item.active = item.isActive ? true : false;
            item.hasEasyGroup = false;
          });
          _this.areaTreeData = data;
          _this.tempAreaData = JSON.parse(JSON.stringify(data));
          _this.areaShowLoading = false;
        })
        .catch((err) => {
          _this.$Message.error(err.msg);
        });
    },
    async getAllStation() {
      let _this = this;
      await _this.$curl
        .get("api/hj/getAllStation")
        .then((res) => {
          _this.stationTreeData = res.data;
          _this.stationLoading = false;
        })
        .catch((err) => {
          _this.$Message.error(err.msg);
        });
    },

    closeEditGroups() {
      this.checkallgroup = "";
      this.show_areaAddModal = false;
      this.areaShowLoading = true;
    },
    editAreaGroup(data) {
      this.areaAddOrEdit = 2;
      this.areaForm.ID = data.ID;
      this.areaForm.Name = data.Name;
      this.areaForm.AreaID = data.AreaID;
      this.areaForm.OrderID = data.OrderID;
      this.show_areaAddModal = true;
    },
    cancelAreaGroup() {
      this.$refs.areaForm.resetFields();
    },
    selectStation(arr) {
      if (!this.selectedAreaGroup.ID) {
        this.$Message.info("请先选择一个行政区");
        return;
      }
      this.selectedStationArr = [];
      arr.forEach((v) => {
        if (v.checked == true && v.disabled == false) {
          this.selectedStationArr.push(v.value);
        }
      });
      let index = this.tempAreaData.findIndex(
        (item) => item.ID === this.selectedAreaGroup.ID
      );
      this.tempAreaData[index].BusinessID = this.selectedStationArr.join(",");
    },

    // 一键勾选当前分组行政区下的所属站点
    checkDefaultStation() {
      // console.log("一键分组");
      if (!this.selectedAreaGroup.ID) {
        this.$Message.info("请先选择一个行政区分组！");
        return;
      }
      if (this.selectedAreaGroup.AreaID.slice(4) === "00") {
        // 市级分组
        this.stationTreeData.forEach((station) => {
          if (
            !station.disabled &&
            station.CityCode === this.selectedAreaGroup.AreaID
          ) {
            station.checked = true;
          }
        });
        this.selectStation(this.stationTreeData);
      } else {
        // 区级分组
        this.stationTreeData.forEach((station) => {
          if (
            !station.disabled &&
            station.CountyCode === this.selectedAreaGroup.AreaID
          ) {
            station.checked = true;
          }
        });
        this.selectStation(this.stationTreeData);
      }
      this.$set(this.selectedAreaGroup, "hasEasyGroup", true);
      let index = this.tempAreaData.findIndex(
        (item) => item.ID === this.selectedAreaGroup.ID
      );
      this.tempAreaData[index].hasEasyGroup = true;
    },
    // 撤销一键分组操作
    cancelDefaultStation() {
      // 更新右侧站点列表状态
      let originDataIndex = this.areaTreeData.findIndex(
        (item) => item.ID === this.selectedAreaGroup.ID
      );
      let tempDataIndex = this.tempAreaData.findIndex(
        (item) => item.ID === this.selectedAreaGroup.ID
      );
      let tempObj = JSON.parse(
        JSON.stringify(this.tempAreaData[tempDataIndex])
      );
      tempObj.BusinessID = this.areaTreeData[originDataIndex].BusinessID;
      this.$set(this.tempAreaData, tempDataIndex, tempObj);
      this.areaTreeChange(this.tempAreaData, this.tempAreaData[tempDataIndex]);
      // 更新一键分组按钮状态
      this.$set(this.selectedAreaGroup, "hasEasyGroup", false);
      let index = this.tempAreaData.findIndex(
        (item) => item.ID === this.selectedAreaGroup.ID
      );
      this.tempAreaData[index].hasEasyGroup = false;
    },
    //数据过滤
    returncodenames(namelist, codevalue) {
      codevalue = String(codevalue);
      if (codevalue && codevalue.indexOf(",") != -1) {
        let result = [];
        codevalue.split(",").forEach((e) => {
          namelist.forEach((v) => {
            if (v.CodeValue == e) result.push(v.CodeName);
          });
        });
        return result.join(",");
      } else {
        let CodeName = "";
        namelist.forEach((item) => {
          if (item.CodeValue == codevalue) CodeName = item.CodeName;
        });
        return CodeName;
      }
    },

    // 获取CD表数据
    async loadCDData() {
      const _this = this;
      const list = [
        {
          tableName: "Area",
          columns: "AreaCode as CodeValue,AreaName as CodeName",
          where: " where 1=1",
        },
      ];
      let res = this.$curl
        .get("api/hj/getCDData", {
          CDDataList: JSON.stringify(list),
        })
        .then((res) => {
          const { data, state } = res;
          // console.log(data);
          if (state) {
            _this.Area = data[0];
          }
        });
    },
  },
  mounted() {
    this.stationCode = this.$USER.userOrg;
    if (
      this.$route.name === "hj-allStationDetails" &&
      this.$route.query.StationCode
    ) {
      this.Input_value = this.$route.query.StationCode;
      this.$nextTick(() => {
        this.myscroll(4);
      });
    }
    this.getCountBaseConfig();
    this.loadCDData();
    this.loadCDDatas();
    this.getAuthority();
    this.getAuthorityEdit();
    this.getAuthorityDel();
    this.Data_Processing(this.stationCode);
    this.arrDom = document.getElementsByClassName("item-content");
    let scrollContent = this.$refs.fx__bgcolor;
    scrollContent.addEventListener("scroll", this.listenScroll, false);
  },
};
</script>

<style lang="scss" scoped>
$screen-lg-px: 1300px;

.ivu-tag {
  border: 1px solid rgba(83, 82, 82, 0.466) !important;
}

::v-deep .ivu-drawer-body {
  overflow: hidden !important;
}
</style>

<style lang="less" scoped>
.maincontent {
  margin-top: 5px;
  min-width: 600px;
  width: 100%;
  height: 100%;
  position: relative;
  .content {
    width: 100%;
    height: 90%;
    padding: 0;
    margin: 0;
    overflow: auto;
    ::-webkit-scrollbar {
      width: 0;
      display: none;
    }
  }
}
</style>
