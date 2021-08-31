<template>
  <div class="content" ref="ycyd">
    <!-- 头部 -->
    <Row style="height:50px;">
      <i-col span="24">
        <div style="height:40px;">
          <div style="padding:10px 0 0 7px;text-align: left;">
            <Input
              search
              clearable
              placeholder="车牌或车主姓名或车架号"
              v-model.trim="selVec"
              style="width: 240px;padding:2px;float:left;margin-right:10px"
              @on-enter="vlpnSearch('input')"
              @on-clear="clearSearch"
            />
            <!-- 下拉框式筛选 -->
            <div v-if="stateList.length > 7">
              <span
                style=" width:10px; margin-left: 5px;margin-top: 2px;  cursor:pointer;float:left;"
                @mouseover="vehicle_show = true"
              >
                <Button
                  :type="vehicle_show ? 'primary' : 'default'"
                  @click="vehicle_show = !vehicle_show"
                >
                  <Icon type="md-bookmarks" size="14" />分类
                </Button>
              </span>
              <div
                v-show="vehicle_show"
                @mouseleave="vehicle_show = false"
                :model="formData"
                style="overflow-y:auto;overflow-x:hidden;"
                class="tglpx_showe fx__box"
              >
                <Tag
                  v-for="item in stateList"
                  :key="item.value"
                  type="dot"
                  @click.native="vlpnSearch(item.value)"
                  :color="select_state == item.value ? 'success' : 'default'"
                  >{{ item.label }}</Tag
                >
              </div>
            </div>
            <!-- 并列式筛选 -->
            <Tag
              v-else
              v-for="item in stateList"
              :key="item.value"
              type="dot"
              @click.native="vlpnSearch(item.value)"
              :color="select_state == item.value ? 'success' : 'default'"
              >{{ item.label }}</Tag
            >
            <span style="margin-right: 8px;cursor:pointer;float:right;">
              <Dropdown
                trigger="hover"
                style="margin-right: 4px;"
                @on-visible-change="handleSaveConfig"
              >
                <Button type="default" icon="md-color-palette"></Button>
                <DropdownMenu slot="list">
                  <tab-config
                    :userTabConfig="userTabConfig"
                    ref="tabConfig"
                    @configUpdate="getVehicleMenuConfig"
                  ></tab-config>
                </DropdownMenu>
              </Dropdown>
              <Button
                :type="tglpx_show ? 'primary' : 'default'"
                @click="tglpx_show = !tglpx_show"
              >
                <Icon type="ios-funnel" size="14" />筛选
              </Button>
            </span>
            <div
              v-show="tglpx_show"
              :model="formData"
              style
              class="tglpx_showes fx__box"
            >
              <Form
                ref="queryForm"
                :model="formData"
                :label-width="82"
                :rules="queryFormRules"
              >
                <Divider orientation="left">车辆基本信息</Divider>
                <div style="max-height:400px;overflow: hidden auto">
                  <Row :gutter="5">
                    <i-col span="24">
                      <FormItem label="车牌号：">
                        <Input
                          v-model.trim="formData.vlpn"
                          placeholder="请输入车牌号"
                          clearable
                        />
                      </FormItem>
                    </i-col>
                    <i-col span="24">
                      <FormItem label="车牌颜色：">
                        <Select :clearable="true" v-model="formData.vlpncolor">
                          <Option
                            v-for="item in cddata.CD_VLPNColor"
                            :value="item.CodeValue"
                            :key="item.CodeValue"
                            >{{ item.CodeName }}</Option
                          >
                        </Select>
                      </FormItem>
                    </i-col>
                    <i-col span="24">
                      <FormItem label="车架号：">
                        <Input
                          v-model.trim="formData.vin"
                          placeholder="请输入车架号"
                          clearable
                        />
                      </FormItem>
                    </i-col>
                    <i-col span="24">
                      <FormItem label="燃油种类：">
                        <Select :clearable="true" v-model="formData.FuelType">
                          <Option
                            v-for="item in cddata.CD_FuelType"
                            :value="item.CodeValue"
                            :key="item.CodeValue"
                            >{{ item.CodeName }}</Option
                          >
                        </Select>
                      </FormItem>
                    </i-col>
                    <i-col span="24">
                      <FormItem label="营运性：">
                        <Select :clearable="true" v-model="formData.ocha">
                          <Option
                            v-for="item in cddata.CD_OCHA"
                            :value="item.CodeValue"
                            :key="item.CodeValue"
                            >{{ item.CodeName }}</Option
                          >
                        </Select>
                      </FormItem>
                    </i-col>
                    <!-- <i-col span="6" style="text-align: right;padding-top: 2%;">车牌号：</i-col>
                    <i-col span="18">
                      <Input v-model.trim="formData.vlpn" placeholder="请输入车牌号" clearable />
                    </i-col> -->
                    <!-- <i-col span="6" style="text-align: right;padding-top: 2%;">车牌颜色：</i-col>
                    <i-col span="18">
                      <Select :clearable="true" v-model="formData.vlpncolor">
                        <Option v-for="item in cddata.CD_VLPNColor" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
                      </Select>
                    </i-col> -->
                    <!-- <i-col span="6" style="text-align: right;padding-top: 2%;">车架号：</i-col>
                    <i-col span="18">
                      <Input v-model.trim="formData.vin" placeholder="请输入车架号" clearable />
                    </i-col> -->
                    <!-- <i-col span="6" style="text-align: right;padding-top: 2%;">燃油种类：</i-col>
                    <i-col span="18">
                      <Select :clearable="true" v-model="formData.FuelType">
                        <Option v-for="item in cddata.CD_FuelType" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
                      </Select>
                    </i-col> -->
                    <!-- <i-col span="6" style="text-align: right;padding-top: 2%;">营运性：</i-col>
                    <i-col span="18">
                      <Select :clearable="true" v-model="formData.ocha">
                        <Option v-for="item in cddata.CD_OCHA" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
                      </Select>
                    </i-col> -->
                  </Row>
                  <Divider orientation="left">车主信息</Divider>
                  <Row :gutter="5">
                    <i-col span="24">
                      <FormItem label="车主姓名：">
                        <Input
                          v-model.trim="formData.ownername"
                          clearable
                          placeholder="请输入车主姓名"
                        />
                      </FormItem>
                    </i-col>
                    <i-col span="24">
                      <FormItem label="联系电话：" prop="tel">
                        <Input
                          v-model.trim="formData.tel"
                          clearable
                          placeholder="请输入联系电话"
                        />
                      </FormItem>
                    </i-col>
                    <i-col span="24">
                      <FormItem label="证件号码：" prop="CredentialsNum">
                        <Input
                          v-model.trim="formData.CredentialsNum"
                          clearable
                          placeholder="请输入证件号码"
                        />
                      </FormItem>
                    </i-col>
                    <i-col span="24">
                      <FormItem label="联系地址：">
                        <Input
                          v-model.trim="formData.address"
                          clearable
                          placeholder="请输入联系地址"
                        />
                      </FormItem>
                    </i-col>
                    <!-- <i-col span="6" style="text-align: right;padding-top: 2%;">车主姓名：</i-col>
                    <i-col span="18">
                      <Input v-model.trim="formData.ownername" clearable placeholder="请输入车主姓名" />
                    </i-col> -->
                    <!-- <i-col span="6" style="text-align: right;padding-top: 2%;">联系电话：</i-col>
                    <i-col span="18">
                      <Input v-model.trim="formData.tel" clearable placeholder="请输入联系电话" />
                    </i-col> -->
                    <!-- <i-col span="6" style="text-align: right;padding-top: 2%;">证件号码：</i-col>
                    <i-col span="18">
                      <Input v-model.trim="formData.CredentialsNum" placeholder="请输入证件号码" />
                    </i-col> -->
                    <!-- <i-col span="6" style="text-align: right;padding-top: 2%;">联系地址：</i-col>
                    <i-col span="18">
                      <Input v-model.trim="formData.address" clearable placeholder="请输入联系地址" />
                    </i-col> -->
                  </Row>
                  <Divider orientation="left">车型信息</Divider>
                  <Row :gutter="5">
                    <i-col span="24">
                      <FormItem label="排放标准：">
                        <Select
                          :clearable="true"
                          placement="top"
                          v-model="formData.emissionstandard"
                        >
                          <Option
                            v-for="item in cddata.CD_EmissionStandard"
                            :value="item.CodeValue"
                            :key="item.CodeValue"
                            >{{ item.CodeName }}</Option
                          >
                        </Select>
                      </FormItem>
                    </i-col>
                    <i-col span="24">
                      <FormItem label="车辆型号：">
                        <Input
                          v-model.trim="formData.IUVTYPE"
                          clearable
                          placeholder="请输入车辆型号"
                        />
                      </FormItem>
                    </i-col>
                    <i-col span="24">
                      <FormItem label="车辆类型：">
                        <Select
                          :clearable="true"
                          placement="top"
                          v-model="formData.gavtype"
                          filterable
                        >
                          <Option
                            v-for="item in cddata.CD_GAVType"
                            :value="item.CodeValue"
                            :key="item.CodeValue"
                            >{{ item.CodeName }}</Option
                          >
                        </Select>
                      </FormItem>
                    </i-col>
                    <i-col span="24">
                      <FormItem label="品牌：">
                        <Input
                          v-model.trim="formData.factoryPlateModel"
                          clearable
                          placeholder="请输入品牌"
                        />
                      </FormItem>
                    </i-col>
                    <!-- <i-col span="6" style="text-align: right;padding-top: 2%;">排放标准：</i-col>
                    <i-col span="18">
                      <Select :clearable="true" placement="top" v-model="formData.emissionstandard">
                        <Option v-for="item in cddata.CD_EmissionStandard" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
                      </Select>
                    </i-col> -->
                    <!-- <i-col span="6" style="text-align: right;padding-top: 2%;">车辆型号：</i-col>
                    <i-col span="18">
                      <Input v-model.trim="formData.IUVTYPE" clearable placeholder="请输入车辆型号" />
                    </i-col> -->
                    <!-- <i-col span="6" style="text-align: right;padding-top: 2%;">车辆类型：</i-col>
                    <i-col span="18">
                      <Select :clearable="true" placement="top" v-model="formData.gavtype">
                        <Option v-for="item in cddata.CD_GAVType" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
                      </Select>
                    </i-col> -->
                    <!-- <i-col span="6" style="text-align: right;padding-top: 2%;">品牌：</i-col>
                    <i-col span="18">
                      <Input v-model.trim="formData.factoryPlateModel" clearable placeholder="请输入品牌" />
                    </i-col> -->
                  </Row>
                  <Divider orientation="left">是否为历史数据</Divider>
                  <Row :gutter="5">
                    <i-col span="24">
                      <FormItem label="历史数据：">
                        <Select
                          :clearable="true"
                          placement="top"
                          v-model="formData.IsInValid"
                        >
                          <Option
                            v-for="(item, index) in cdform"
                            :value="item.value"
                            :key="index"
                            >{{ item.label }}</Option
                          >
                        </Select>
                      </FormItem>
                    </i-col>
                    <!-- <i-col span="6" style="text-align: right;padding-top: 2%;">历史数据：</i-col>
                    <i-col span="18">
                      <Select :clearable="true" placement="top" v-model="formData.IsInValid">
                        <Option v-for="(item, index) in cdform" :value="item.value" :key="index">{{ item.label }}</Option>
                      </Select>
                    </i-col> -->
                  </Row>
                </div>
              </Form>
              <div style="display:flex;justify-content: space-around">
                <Button
                  style="margin-top: 15px;width:116px;"
                  type="success"
                  @click="changePage(1)"
                  >查询</Button
                >
                <Button
                  style="margin-top: 15px;width:120px;"
                  type="info"
                  @click="handleCancelReset()"
                  >重置</Button
                >
              </div>
            </div>
          </div>
        </div>
      </i-col>
    </Row>

    <div class="main_container">
      <!-- 左 -->
      <div
        id="vehicle_table_class"
        :height="height"
        class="main-left main__left"
      >
        <div class="fx__box" style="height:100%;">
          <Table
            highlight-row
            class="t-vehicle"
            :height="height - 85"
            :row-class-name="rowClassName"
            :columns="colVec"
            :data="vehicleData"
            :show-header="false"
            :loading="loading"
            @on-row-click="onRowClick"
          ></Table>
          <Switch v-model="loading"></Switch>
          <div style="padding:10px 0px;">
            <i-col span="6">共{{ dataCount }}条</i-col>
            <i-col span="18">
              <Page
                simple
                :current="pageIndex"
                :total="dataCount"
                :page-size="20"
                @on-change="changePage"
              />
            </i-col>
          </div>
        </div>
      </div>
      <div style class="main__right">
        <vehicle-stat
          ref="stat"
          style
          class="right__stat"
          :selectState="select_state"
        ></vehicle-stat>
        <Drawer
          :closable="true"
          v-model="active"
          :inner="true"
          :transfer="false"
          width="100"
          :mask="false"
          :title="selectVLPN"
        >
          <vehicle-detail
            ref="vehicleDetailBox"
            :UserTabConfig="userTabConfig"
            :hasAuthority="hasAuthority"
            :cddata="cddata"
            :Vlpn="selectVLPN"
            @handleListVehielData="handleListVehielData"
            :Rew="vehiclelist"
            :Vehicleid="selectVehicleID"
            :VecH="height"
            :selectVIN="selectVIN"
            :encrypt_value="encrypt_value"
            @sechdata="seachso"
            class="right__detail"
            style
          ></vehicle-detail>
        </Drawer>
      </div>
    </div>
  </div>
</template>
<script>
import VehicleInfo from "../../../HJ/views/vehicle/vehicleInfo";
import VehicleStat from "../../../HJ/views/vehicle/vehicleStat";
import VehicleDetail from "../../../HJ/views/vehicle/vehicleDetail";
import VehicleTag from "../../components/tags";
import FoldTag from "../../components/tags/FoldTag.vue";
import renderMessege from "../../../HJ/components/message";
import { setTimeout } from "timers";
import { getCDData } from "../../../HJ/utils/utils";
import { config } from "../../../utils/tools";
import TabConfig from "./tabConfig.vue";
import axios from "axios";
export default {
  name: "vehicleInfo",
  components: {
    VehicleStat,
    VehicleDetail,
    VehicleTag,
    VehicleInfo,
    FoldTag,
    TabConfig,
  },
  data() {
    const validateZW = (rule, value, callback) => {
      // console.log('验证-----', rule);
      if (value) {
        if (/[\u4E00-\u9FA5]/g.test(value)) {
          // callback(new Error(rule.message))
          this.$Notice.error({
            title: rule.message,
          });
          // this.$Message.error(rule.message);
          callback(true);
        } else {
          callback();
        }
      }
      callback();
    };
    return {
      encrypt_value:null, //是否加密车辆信息的敏感信息的value值
      lastVehicleID: "", // 上一次的车辆ID
      hasAuthority: false,
      VehicleId: "",
      select_state: "qb",
      vehicle_show: false,
      selVec: "",
      stateList: [
        { value: "qb", label: "全部" },
        { value: "hmd", label: "黑名单" },
        { value: "bmd", label: "白名单" },
        { value: "hyc", label: "黑烟车" },
        { value: "zdgz", label: "重点关注" },
        { value: "zxcyc", label: "重型柴油车" },
      ],
      active: false,
      localIndex: -1,
      isShow: 0,
      selectVLPN: "",
      selectVehicleID: 0,
      selectVIN: "",
      loading: true,
      height: 0,
      width: 0,
      cdform: [
        {
          value: 0,
          label: "否",
        },
        {
          value: 1,
          label: "是",
        },
      ],
      formData: {
        vlpn: "",
        vlpncolor: "",
        vehicleid: "",
        vin: "",
        FuelType: "",
        ocha: "",
        ownername: "",
        tel: "",
        creditnum: "",
        address: "",
        emissionstandard: "",
        gavtype: "",
        factoryPlateModel: "",
        IsInValid: 0,
      },
      colVec: [
        {
          title: "",
          key: "tag",
          className: "tag-info-column",
          render: (h, params) => {
            let data = []; //tag标签
            let data2 = []; //文字
            let list = [];
            let data3 = []; //第二行文字
            let data4 = []; //车架号
            let data5 = []; //车型号
            let data6 = []; //环保业务状态：
            data2.push(
              h(
                "span",
                { style: this.setVLPNColor(params.row.vlpncolor) },
                params.row.vlpn
              )
            );
            if (params.row.IsAndPoliceMatch == "1")
              data2.push(
                h(
                  "span",
                  { style: { margin: "0px 0px 0px 16px" } },
                  "已匹配公安"
                )
              );
            if (params.row.ownername) {
              if (params.row.ownername.length > 3) {
                data3.push(
                  h(
                    "Tooltip",
                    { props: { content: params.row.ownername } },
                    params.row.ownername.substring(0, 3) + ".."
                  )
                );
              } else {
                data3.push(h("span", params.row.ownername));
              }
            } else {
              data3.push(
                h(
                  "span",
                  { style: { padding: "0px 2px 0px 10px" } },
                  " / " + "暂无"
                )
              );
            }
            if (params.row.emissionstandard) {
              data3.push(
                h(
                  "span",
                  " / " +
                    this.returncodename(
                      this.cddata.CD_EmissionStandard,
                      params.row.emissionstandard
                    )
                )
              );
            } else {
              data3.push(h("span", " / " + "暂无"));
            }

            data3.push(h("span", " / "));
            if (params.row.FuelType) {
              data3.push(
                h(
                  "span",
                  params.row.FuelType
                    ? this.returnMultiple(
                        this.cddata.CD_FuelType,
                        params.row.FuelType
                      )
                    : ""
                )
              );
            } else {
              data3.push(h("span", "暂无"));
            }
            if (params.row.OCHA) {
              data3.push(
                h(
                  "span",
                  " / " + params.row.OCHA
                    ? this.returncodename(this.cddata.CD_OCHA, params.row.OCHA)
                    : ""
                )
              );
            } else {
              data3.push(h("span", " / " + "暂无"));
            }

            if (params.row.FactoryPlateModel) {
              data3.push(h("span", " / "));
              if (params.row.FactoryPlateModel.length > 8) {
                data3.push(
                  h(
                    "Tooltip",
                    { props: { content: params.row.FactoryPlateModel } },
                    params.row.FactoryPlateModel.substring(0, 8) + ".."
                  )
                );
              } else {
                data3.push(h("span", params.row.FactoryPlateModel));
              }
            } else {
              data3.push(
                h(
                  "span",
                  { style: { padding: "0px 2px 0px 10px" } },
                  " / " + "暂无"
                )
              );
            }
            if (params.row.IUVTYPE) {
              data4.push(h("span", "车辆型号：" + params.row.IUVTYPE));
            } else {
              data4.push(h("span", " 车辆型号：暂无"));
            }
            if (params.row.VIN) {
              data5.push(h("span", "车架号：" + params.row.VIN));
            } else {
              data5.push(h("span", "车架号：暂无"));
            }
            if (params.row.EStatus) {
              data6.push(
                h(
                  "span",
                  "环保业务状态：" + params.row.EStatus
                    ? this.returncodename(
                        this.cddata.CD_EStatus,
                        params.row.EStatus
                      )
                    : ""
                )
              );
            } else {
              data6.push(h("span", "环保业务状态：暂无"));
            }
            let tagData = [];
            if (params.row.hbc > 0) {
              tagData.push({
                label: "黄标车",
                tooltip: "黄标车",
                color: "#f7b53b",
              });
            }
            if (params.row.hyc > 0) {
              tagData.push({
                label: "黑烟车",
                tooltip: "黑烟车",
                color: "gray",
              });
            }
            if (params.row.zdgz > 0) {
              tagData.push({
                label: "重点关注",
                tooltip: "重点关注",
                color: "#f5554c",
              });
            }
            if (params.row.hmd > 0) {
              tagData.push({
                label: "黑名单",
                tooltip: "黑名单",
                color: "#474139",
              });
            }
            if (params.row.bmd > 0) {
              tagData.push({
                label: "白名单",
                tooltip: "白名单",
                color: "default",
              });
            }
            list.push(
              h(
                "div",
                {
                  style: {
                    width: "164px",
                    display: "inline-block",
                    height: "26px",
                    float: "left",
                    "margin-top": "4px",
                  },
                },
                data2
              )
            );
            list.push(
              h(
                "div",
                {
                  style: {
                    width: "181px",
                    display: "inline-block",
                    padding: "0 21px 0 0px",
                    "text-align": "right",
                    height: "26px",
                    float: "right",
                    "margin-top": "4px",
                  },
                },
                [
                  h(FoldTag, {
                    props: {
                      TagData: tagData,
                      ShowTagNum: 2,
                    },
                  }),
                ]
              )
            );
            list.push(
              h(
                "div",
                {
                  style: {
                    height: "30px",
                    "line-height": "30px",
                    float: "left",
                  },
                },
                data3
              )
            );
            list.push(
              h(
                "div",
                {
                  style: {
                    height: "30px",
                    "line-height": "30px",
                    width: "345px",
                    float: "left",
                  },
                },
                data4
              )
            );
            list.push(
              h(
                "div",
                {
                  style: {
                    height: "30px",
                    "line-height": "30px",
                    width: "345px",
                    float: "left",
                  },
                },
                data5
              )
            );
            list.push(
              h(
                "div",
                {
                  style: {
                    height: "30px",
                    "line-height": "30px",
                    width: "345px",
                    float: "left",
                  },
                },
                data6
              )
            );
            return h(
              "div",
              {
                style: {
                  width: "345px",
                },
              },
              list
            );
          },
        },
      ],
      vehicleData: [], //当前页面显示的数据
      dataCount: 0,
      pageSize: 20,
      pageIndex: 1, //默认当前为第一页
      tglpx_show: false,
      cddata: {}, //cd表
      vehiclelist: {},
      heightRowIndex: -1, //高亮index
      userTabConfig: [],
      defaultTabConfig: [
        {
          tabKey: "summanyTab",
          tabName: "摘要信息",
          icon: "logo-buffer",
          isChecked: true,
        },
        {
          tabKey: "reportTab",
          tabName: "检测报告",
          icon: "md-print",
          isChecked: true,
        },
        {
          tabKey: "vehicleTab",
          tabName: "车辆信息",
          icon: "ios-document",
          isChecked: true,
        },
        {
          tabKey: "mainInfoTab",
          tabName: "关键信息更改记录",
          icon: "ios-construct",
          isChecked: true,
        },
        {
          tabKey: "dataView",
          tabName: "资料查看",
          icon: "ios-book",
          isChecked: true,
        },
        {
          tabKey: "remoteInspect",
          tabName: "异地检测结果",
          icon: "ios-cloud",
          isChecked: false,
        },
        // {
        //   tabKey: "vehicleRepairinfo",
        //   tabName: "维修信息",
        //   icon: "ios-construct",
        //   isChecked: true,
        // },
      ],
      queryFormRules: {
        tel: [
          // { type: 'number', message: "联系电话不能包含中文", triggwe: 'blur'},
          {
            trigger: "blur",
            validator: validateZW,
            message: "联系电话不能包含中文",
          },
        ],
        CredentialsNum: [
          {
            validator: validateZW,
            message: "证件号码不能包含中文",
            trigger: "blur",
          },
        ],
      },
    };
  },
  //监听
  watch: {
    $route(to, from) {
      //通过let定义块级作用域
      if (to.name == "hj-home-vehicle") {
        if (to.params.Click) return;
        if (to.params && to.params.VehicleId && to.params.VehicleId != "null") {
          sessionStorage.setItem("isGoVehicle", 1);
          if (sessionStorage.getItem("isGoVehicle")) {
            this.pageIndex = 1;
            sessionStorage.setItem("VehiclePageIndex", 1);
          }
          this.formData.vehicleid = to.params.VehicleId;
          this.handleListVehielData();
        } else {
          sessionStorage.removeItem("isGoVehicle");
          this.formData.vehicleid = "";
          this.handleListVehielData();
        }
      }
    },
  },
  methods: {
    //查看用户是否有编辑权限
    getAuthority() {
      this.$curl
        .post("api/hj/hasAuthority", { type: "cz01" })
        .then((res) => {
          if (res.state) {
            this.hasAuthority = res.hasAuthority;
          } else {
            this.$Notice.warning({
              title: "提示",
              desc: "获取权限信息失败!",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    clearSearch() {
      this.selVec = "";
      this.$router.push({
        name: "hj-home-vehicle",
        params: { VehicleId: "null" },
      });
      this.handleListVehielData();
    },
    setVLPNColor(VLPNColor) {
      if (!config.vlpn_c[VLPNColor]) return {};
      const vlpn_c = config.vlpn_c[VLPNColor];
      return {
        display: "inline-block",
        margin: "-2 auto",
        "border-radius": "6px",
        "border-style": "double",
        "text-align": "center",
        padding: "0px 2px",
        background: `${vlpn_c.Background} !important`,
        color: `${vlpn_c.TextColor} !important`,
        "border-color": `${vlpn_c.BorderColor} !important`,
        "font-weight": "bold",
        "font-size": "10pt",
      };
    },
    rowClassName(row, index) {
      if (index == this.heightRowIndex) {
        return "ivu-table-row-highlight";
      }
      return "";
    },
    changePage(index) {
      this.$refs["queryForm"].validate((valid) => {
        if (valid) {
          // this.$Message.success('Success!');
          //分页功能
          this.tglpx_show = false;
          this.pageIndex = index;
          sessionStorage.setItem("VehiclePageIndex", index);
          this.$router.push({
            name: "hj-home-vehicle",
            params: { VehicleId: "null" },
          });
          this.localIndex = -1;
          this.handleListVehielData();
        } else {
        }
      });
    },
    //直接从浏览器缓存获取CD表或者从reids
    async getDBinfoByMultipte() {
      const self = this;
      let cdname = [
        {
          tableName: "CD_EmissionStandard",
          columns: "CodeValue,CodeName",
        },
        {
          tableName: "CD_VLPNColor",
          columns: "CodeValue,CodeName",
        },
        {
          tableName: "CD_FuelType",
          columns: "CodeValue,CodeName",
        },
        {
          tableName: "CD_OCHA", //营运
          columns: "CodeValue,CodeName",
        },
        {
          tableName: "CD_GAVType",
          columns: "CodeValue,CodeName",
          where: "where IsAvailable=1",
        },
        {
          tableName: "StationInfo",
          columns: "StationCode as CodeValue,StationName as CodeName",
        },
        {
          tableName: "CD_InspectionMethod",
          columns: "CodeValue,CodeName",
          where: "where IsAvailable=1",
        },
        {
          tableName: "CD_BLType",
          columns: "CodeValue,CodeName",
        },
        {
          tableName: "CD_YLCAuditWay",
          columns: "CodeValue,CodeName",
        },
        {
          tableName: "CD_SpecialAttentionType",
          columns: "CodeValue,CodeName",
        },
        {
          tableName: "CD_WhiteListType",
          columns: "CodeValue,CodeName",
        },
        {
          tableName: "CD_UseOfAuto",
          columns: "CodeValue,CodeName",
        },
        {
          tableName: "CD_InspectionWay",
          columns: "CodeValue,CodeName",
        },
        {
          tableName: "CD_BusinessType",
          columns: "CodeValue,CodeName",
        },
        {
          tableName: "CD_FileGroup",
          columns: "CodeValue,CodeName",
        },
        {
          tableName: "CD_EStatus",
          columns: "CodeValue,CodeName",
        },
        {
          tableName: "CD_CheckType",
          columns: "CodeValue,CodeName",
        },
        {
          tableName: "CD_AlarmType",
          columns: "CodeValue,CodeName",
        }
      ];
      const TableName = cdname.map((c) => c.tableName);
      if (self.$getDBTable) {
        await self.$getDBTable(TableName).then((res) => {
          if (res.indexOf(undefined) == -1) {
            let data = [];
            res.forEach((item, index) => {
              data = JSON.parse(item);
              if (data.length > 0 && data[0]) {
                if (data[0].hasOwnProperty("IsAvailable"))
                  data = data.filter((d) => d.IsAvailable == 1);
              }
              self.cddata[TableName[index]] = data;
            });
          } else {
            getCDData(this, cdname).then((res) => {
              const self = this;
              if (res.state) {
                res.data.forEach((item, index) => {
                  if (item.length > 0 && item[0]) {
                    if (item[0].hasOwnProperty("IsAvailable"))
                      item = item.filter((i) => i.IsAvailable == 1);
                  }
                  self.cddata[TableName[index]] = item;
                });
              }
            });
          }
        });
      } else {
        getCDData(this, cdname).then((res) => {
          const self = this;
          if (res.state) {
            res.data.forEach((item, index) => {
              if (item.length > 0 && item[0]) {
                if (item[0].hasOwnProperty("IsAvailable"))
                  item = item.filter((i) => i.IsAvailable == 1);
              }
              self.cddata[TableName[index]] = item;
            });
          }
        });
      }
    },

    // 获取否加密车辆信息的敏感信息的value值
    async getIsEncryptVehicleInfo() {
      let res = await this.$curl.get("api/hj/getIsEncryptVehicleInfo");
      if(res.encrypt_value=='true') this.encrypt_value=true;
       if(res.encrypt_value=='false') this.encrypt_value=false;
    },

    async handleListVehielData() {
      const _this = this;
      _this.loading = true;
      _this.active = false;
      _this.vehicle_show = false;
      _this.vehicleData = [];

      let param = {
        seach: this.selVec,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        condition: this.formData,
        state: this.select_state,
      };
      //获取车辆数据并实现分页显示
      await this.$curl
        .get("api/hj/searchVehicleInfo", { param: JSON.stringify(param) })
        .then((res) => {
          _this.loading = false;
          _this.vehicleData = res.data;
          _this.dataCount = res.dataCount.total;
          let routeDate = _this.$route.params.VehicleId;
          if (routeDate) {
            _this.vehicleData.forEach((item, index) => {
              if (item.vehicleid == routeDate) {
                this.onRowClick(item, index);
                this.heightRowIndex = index;
                return false;
              }
            });
          }
          _this.vehicleData.forEach((v) => {
            // 保留车架号初始字段值,用于请求参数传递
            v.OriginVIN = v.VIN;
          });
          // 处理是否加密车辆信息的敏感信息
          if (_this.encrypt_value == true) {
            _this.vehicleData.forEach((v) => {
              //  车主姓名加密显示
              if (v.ownername)
                v.ownername = v.ownername
                  .split("")
                  .fill("*")
                  .join("");
              //  车架号姓名加密显示
              if (v.VIN)
                v.VIN = v.VIN.split("")
                  .fill("*")
                  .join("");
            });
          } else {
            return false;
          }
        })
        .catch((err) => {
          _this.loading = false;
          _this.$Message.error({
            render: (h) => {
              return h("span", [
                h(renderMessege, {
                  props: { message: "获取车辆信息失败！", error: err },
                }),
              ]);
            },
            duration: 3,
            closable: true,
          });
        });
    },
    debounce(func, wait) {
      let timeout;
      return function() {
        let context = this;
        let args = arguments;
        timeout = setTimeout(() => {
          func.apply(context, args);
        }, wait);
        if (timeout) clearTimeout(timeout);
      };
    },
    onRowClick(data, index) {
      // console.log(data)
      const _this = this;
      this.heightRowIndex = -1;
      _this.vehiclelist = {};
      if (index != this.localIndex && this.localIndex == -1) {
        this.active = true;
      } else if (index != this.localIndex && this.localIndex != -1) {
        this.active = false;
        this.isShow = 0;
        let time = setTimeout(function() {
          _this.active = true;
        }, 10);
        if (time) clearTimeout(time);
      } else if (index == this.localIndex) {
        if (this.isShow == 0) {
          this.active = false;
          this.isShow = 1;
        } else {
          this.active = true;
          this.isShow = 0;
        }
      }
      this.VehicleId = +data.vehicleid;
      if (this.vehiclelist && this.vehiclelist.vehicleid == this.VehicleId)
        this.VehicleId = null;
      if (this.VehicleId == null) this.vehiclelist = null;
      else {
        this.localIndex = index;
        this.selectVLPN = data.vlpn;
        this.selectVehicleID = data.vehicleid;
        this.selectVIN = data.OriginVIN;
        this.vehiclelist = data;
      }
      let selectID = this.VehicleId == null ? "null" : data.vehicleid;
      if (selectID === this.lastVehicleID) return;
      this.lastVehicleID = selectID;
      this.$nextTick(() => {
        this.$router.push({
          name: "hj-home-vehicle",
          params: { VehicleId: selectID, Click: true },
        });
        _this.$refs.vehicleDetailBox.getVehicleDate();
        _this.hasAuthority
          ? _this.$refs.vehicleDetailBox.Tabclick("vehicleTab")
          : _this.$refs.vehicleDetailBox.Tabclick();
      });
    },
    filterMethod(value, option) {
      return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
    },
    vlpnSearch(value) {
      const _this = this;
      if (this.selVec.trim() === "") {
        this.formData.vehicleid = "";
      }
      if (value != this.select_state && value != "input") {
        this.select_state = value;
      } else {
        this.select_state = "qb";
      }
      this.localIndex = -1; //重置为初始值
      this.isShow = 0;

      this.pageSize = 20;
      this.pageIndex = 1; //默认当前为第一页
      // 用防抖方法，减少调用api次数
      _this.debounce(_this.handleListVehielData, 200, true)();
      this.active = false;
      // this.$router.push({
      //   name: "hj-home-vehicle",
      //   params: { VehicleId: "null" }
      // });
    },
    setHeight() {
      this.height = this.$refs.ycyd.offsetHeight - 40;
    },
    seachso() {
      this.$refs.stat.handleVehicleStat();
    },
    //过滤数据
    returncodename(namelist, codevalue) {
      if (namelist.length) {
        let CodeName = "";
        namelist.forEach((item) => {
          if (item.CodeValue == codevalue) CodeName = item.CodeName;
        });
        return CodeName;
      }
    },
    returnMultiple(namelist, codevalue) {
      if (codevalue) {
        let arrs = String(codevalue).split("");
        if (namelist.length) {
          let CodeName = [];
          namelist.forEach((item) => {
            arrs.forEach((aitem) => {
              if (item.CodeValue == aitem) CodeName.push(item.CodeName);
            });
          });
          return CodeName.join(",");
        }
      }
    },
    //筛选重置按钮
    handleCancelReset() {
      this.formData = {
        vlpn: "",
        vlpncolor: "",
        vehicleid: "",
        vin: "",
        FuelType: "",
        ocha: "",
        ownername: "",
        tel: "",
        creditnum: "",
        address: "",
        emissionstandard: "",
        gavtype: "",
        factoryPlateModel: "",
        IsInValid: 0,
      };
      this.localIndex = -1;
      this.handleListVehielData();
    },
    // 保存用户Tab页配置
    handleSaveConfig(visible) {
      if (!visible) {
        this.$refs.tabConfig.saveUserConfig();
      }
    },
    // 获取vehicleMenuTab.json内配置
    getVehicleMenuConfig() {
      this.$curl.get("api/hj/getUserTabConfig").then((res) => {
        // console.log(res);
        if (res.code === 1) {
          // 找到该用户的配置
          let temp = [...res.data.checkSelTab];
          this.defaultTabConfig.forEach(v => {
            let index = res.data.checkSelTab.findIndex(k => k.tabKey == v.tabKey);
            if(index == -1) {
              temp.push(v)
            }
          })
          this.userTabConfig = temp;
        } else {
          this.userTabConfig = this.defaultTabConfig;
        }
      });
    },
  },
  created() {},
  async mounted() {
    await this.getDBinfoByMultipte();
    window.addEventListener("resize", this.setHeight);
    this.setHeight();
    this.getAuthority();
    this.pageIndex = Number(sessionStorage.getItem("VehiclePageIndex")) || 1;
    if (sessionStorage.getItem("isGoVehicle") && this.$route.params.VehicleId)
      this.formData.vehicleid = this.$route.params.VehicleId;
    this.getIsEncryptVehicleInfo();
    this.handleListVehielData();
    this.getVehicleMenuConfig();
    // axios.get(`./../../../../../documents/user/${this.$store.state.core.user.userid}/vehicleMenuTab.json`)
    //   .then(res => {
    //     if (res.data.checkSelTab) {
    //       this.userTabConfig = res.data.checkSelTab;
    //     } else {
    //       this.userTabConfig = this.defaultTabConfig;
    //     }
    //   })
    //   .catch(error => {
    //     this.userTabConfig = this.defaultTabConfig;
    //   })
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.setHeight);
  },
};
</script>
<style lang="less" scoped>
.ivu-form-item {
  margin-bottom: 0;
}
.main-left {
  overflow: hidden;
  float: left;
  width: calc(33.3% - 24px);
  min-width: 422px;
  border: none;
  border-radius: 4px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
}
#vehicle_table_class /deep/ .ivu-table,
#vehicle_table_class /deep/ .ivu-table-overflowX {
  overflow-y: hidden;
  overflow-x: hidden;
}
.light /deep/ .ivu-table::before {
  content: none;
}
#vehicle_table_class /deep/ .ivu-table::before {
  content: none;
}
#vehicle_table_class /deep/ .t-vehicle {
  text-align: center;
  overflow: hidden;
  cursor: pointer;
  border: none;
}
#vehicle_table_class /deep/ .drawer-footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
}

.slide-fade-enter-active {
  transition: all 0.1s ease;
}
.slide-fade-leave-active {
  transition: all 0.1s ease;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(2500px);
}
.tglpx_showes {
  position: absolute;
  width: 340px;
  // height: 622px;
  top: 45px;
  right: 7px;
  z-index: 9999;
  padding: 0 10px 10px 10px;
  box-shadow: rgba(0, 0, 0, 0.35) -4px 7px 10px 2px;
  font-size: 12px;
}
.tglpx_showe {
  position: absolute;
  width: 240px;
  top: 44px;
  left: 254px;
  z-index: 9999;
  padding: 10px;
  box-shadow: rgba(0, 0, 0, 0.35) 3px 3px 10px 2px;
  text-align: left;
}
#vehicle_table_class /deep/ .t-vehicle {
  text-align: center;
  overflow: hidden;
}
::-webkit-scrollbar {
  width: 6px;
  background-color: #fff;
}

::-webkit-scrollbar-thumb {
  background-color: #656565;
}
.box ::-webkit-scrollbar {
  width: 0px;
}

.conv-notificat .btn-bell {
  float: right;
  cursor: pointer;
  margin-right: 15px;
  margin-top: 12px;
  line-height: 30px;
}
#vehicle_table_class /deep/ .ivu-page-simple .ivu-page-simple-pager input {
  width: 71px;
}
#vehicle_table_class /deep/ .ivu-tag:hover {
  opacity: 0.95;
}
.main__right /deep/ .ivu-drawer-body {
  padding: 0px;
}
.t-vehicle /deep/ .ivu-table::after {
  content: none;
}
.tabconfig_show {
  position: absolute;
  width: 205px;
  top: 46px;
  right: 10px;
  z-index: 9999;
  // padding: 10px;
  // box-shadow: rgba(0, 0, 0, 0.35) 3px 3px 10px 2px;
}
</style>
<style lang="less" scoped>
.content {
  padding: 0px 18px;
  // background-color: #eeeeee;
  text-align: center;
  overflow-x: hidden;
  overflow-y: hidden;
  min-width: 980px;
  height: calc(~"100% - 20px");
  margin-bottom: 20px;
  .main_container {
    height: calc(~"100% - 50px");
    margin-top: 3px;
    display: flex;
    // height:100%;
    .main__left {
      float: none;
      padding: 6px 10px;
      box-shadow: none;
    }
    .main__right {
      /deep/ .ivu-tabs-bar {
        margin-bottom: 10px;
      }
      flex: 1;
      position: relative;
      height: calc(~"100% - 12px");
      margin: 6px 10px;
      overflow: hidden hidden;
      /deep/ .ivu-drawer-header {
        text-align: left;
      }
      .right__stat {
        z-index: 1;
        overflow: hidden auto;
        height: 103%;
      }
      .right__detail {
        // position:absolute;
        // top:6px;
        // bottom: 6px;
        // left:20px;
        // right:10px;
        z-index: 10;
        overflow: hidden hidden;
        height: 100%;
        // height: calc(100% - 0px);
      }
    }
  }
}
.ivu-table .ivu-table-row-highlight {
  background-color: #ebf7ff;
}
</style>
