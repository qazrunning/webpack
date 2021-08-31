// 业务审核历史查询界面
<template>
    <div class="content" style="height: 100%; overflow: hidden" ref="bc">
        <div
            v-show="showModel"
            style="
                background: #f8f8f9;
                position: absolute;
                right: 0px;
                top: 43px;
                z-index: 9999;
            "
        >
            <Card
                title="条件"
                icon="ios-options"
                :padding="0"
                shadow
                style="width: 300px"
            >
                <div style="padding: 20px">
                    <Form :model="formItem" :label-width="80">
                        <FormItem label="车牌号码">
                            <Input
                                v-model.trim="formItem.VLPN"
                                placeholder="请输入车牌号码"
                                clearable
                            />
                        </FormItem>
                        <FormItem label="车牌颜色">
                            <Select v-model="formItem.VLPNColor" clearable>
                                <Option
                                    v-for="item in search_CD.CD_VLPNColor"
                                    :value="item.CodeValue"
                                    :key="item.CodeValue"
                                    >{{ item.CodeName }}</Option
                                >
                            </Select>
                        </FormItem>
                        <FormItem label="申请站点">
                            <Select
                                v-model="formItem.ESPOrganizationCode"
                                clearable
                                filterable
                            >
                                <Option
                                    v-for="item in search_CD.StationInfo"
                                    :value="item.CodeValue"
                                    :key="item.CodeValue"
                                    >{{ item.CodeName }}</Option
                                >
                            </Select>
                        </FormItem>
                        <FormItem label="审核类型">
                            <Select
                                v-model="formItem.CheckType"
                                clearable
                                @on-change="changeCheckType"
                            >
                                <Option
                                    v-for="item in search_CD.CD_CheckType"
                                    :value="item.CodeValue"
                                    :key="item.CodeValue"
                                    >{{ item.CodeName }}</Option
                                >
                            </Select>
                        </FormItem>
                        <FormItem label="申请原因">
                            <Select
                                v-model="formItem.ApplyReason"
                                :disabled="
                                    formItem.CheckType == '20' ||
                                    formItem.CheckType == '31'
                                        ? false
                                        : true
                                "
                                clearable
                            >
                                <Option
                                    v-for="item in search_CD.CD_AuditReason"
                                    :value="item.CodeValue"
                                    :key="item.CodeValue"
                                    >{{ item.CodeName }}</Option
                                >
                            </Select>
                        </FormItem>
                        <FormItem label="车架号">
                            <Input
                                v-model.trim="formItem.VIN"
                                placeholder="请输入车架号"
                                clearable
                            />
                        </FormItem>
                        <FormItem label="审核状态">
                            <Select v-model="formItem.Status" clearable>
                                <Option value="0">未审核</Option>
                                <Option value="1">已审核</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="审核结果" clearable>
                            <Select v-model="formItem.AuditState">
                                <Option value="0">审核不通过</Option>
                                <Option value="1">审核通过</Option>
                                <Option value="3">自动审核</Option>
                                <Option value="4">退回</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="申请时间">
                            <Row>
                                <i-col span="12">
                                    <DatePicker
                                        type="daterange"
                                        format="yyyy-MM-dd HH:mm"
                                        :options="options2"
                                        v-model="formItem.timeRange"
                                        placement="bottom-end"
                                        placeholder="请输入申请时间"
                                        @on-change="timeChange"
                                        style="width: 180px"
                                        clearable
                                    ></DatePicker>
                                </i-col>
                            </Row>
                        </FormItem>
                        <div style="text-align: center">
                            <Button
                                type="success"
                                @click="Search"
                                style="margin-right: 10px"
                                >检索</Button
                            >
                            <Button type="success" @click="handleReset"
                                >重置</Button
                            >
                        </div>
                    </Form>
                </div>
            </Card>
        </div>
        <div style="height: 50px; padding: 10px 15px">
            <Tooltip content="返回上级" placement="right">
                <span style="cursor: pointer">
                    <Icon
                        type="md-return-left"
                        size="26"
                        @click="$router.back(-1)"
                        style="line-height: 33px"
                    />
                </span>
            </Tooltip>
            <Button
                type="primary"
                @click="showSearchModel"
                icon="ios-funnel"
                shape="circle"
                style="float: right"
                >筛选</Button
            >
            <Button
                type="primary"
                @click="exportExcel()"
                icon="ios-bookmark"
                shape="circle"
                style="float: right; margin-right: 10px"
                >导出表格</Button
            >
        </div>
        <div style="position: relative; cursor: pointer">
            <Table
                @on-row-click="onClicks"
                :stripe="true"
                :columns="historyColumns"
                highlight-row
                :data="historyData"
                :row-class-name="rowClassName"
                :height="height - 60"
                :loading="loading"
            ></Table>
            <Switch v-model="loading"></Switch>
            <Page
                style="padding: 5px"
                :current="pageIndex"
                :total="dataCount"
                :page-size="pageSize"
                @on-change="handleData"
                @on-page-size-change="getPageSize"
                show-total
                show-sizer
                show-elevator
            ></Page>

            <!-- 左右布局和全屏布局  如果是PC版  抽屉从右边滑出   手机版就显示下面部分mode-->
            <Drawer
                v-if="$app.helper.screen.isPC"
                :title="detailTitle"
                :closable="true"
                v-model="isDetail"
                :mask="false"
                :inner="true"
                :transfer="false"
                width="67"
            >
                <div
                    class="drawer-body-wrapper"
                    :style="{ height: height - 126 + 'px' }"
                >
                    <transition>
                        <keep-alive>
                            <component
                                v-bind:is="currentView"
                                :selectData="gridSelectRow"
                                :initform="initform"
                                :VehicleForm="gridSelectRow"
                                ref="refDom"
                                @on-edit="onEdit"
                                @handleBackToAudit="handleBackToAudit"
                            ></component>
                        </keep-alive>
                    </transition>
                </div>
                <div class="drawer-footer">
                    <Button
                        style="float: right"
                        type="primary"
                        @click="submitAudit()"
                        v-text="+isStauts ? '保存' : '提交审核'"
                    ></Button>
                    <Button v-if="+isStauts == 0" style="float:right;margin-right: 8px;" type="warning" @click="backToAudit()">退回</Button>
                    <Button
                        style="float: right; margin-right: 8px"
                        @click="isDetail = false"
                        >关闭窗口</Button
                    >
                </div>
            </Drawer>

            <Modal
                v-else
                v-model="isDetail"
                :title="detailTitle"
                :footer-hide="true"
            >
                <div
                    class="drawer-body-wrapper"
                    :style="{ height: height - 126 + 'px' }"
                >
                    <transition>
                        <keep-alive>
                            <component
                                v-bind:is="currentView"
                                :selectData="gridSelectRow"
                                :initform="initform"
                                :VehicleForm="gridSelectRow"
                                ref="refDom"
                                @on-edit="onEdit"
                                @handleBackToAudit="handleBackToAudit"
                            ></component>
                        </keep-alive>
                    </transition>
                </div>
                <div class="drawer-footer">
                    <Button
                        style="float: right"
                        type="primary"
                        @click="submitAudit()"
                        v-text="+isStauts ? '保存' : '提交审核'"
                    ></Button>
                    <Button v-if="+isStauts == 0" style="float:right;margin-right: 8px;" type="warning" @click="backToAudit()">退回</Button>
                    <Button
                        style="float: right; margin-right: 8px"
                        @click="isDetail = false"
                        >关闭窗口</Button
                    >
                </div>
            </Modal>
        </div>
    </div>
</template>

<script>
const CartInfo = () => import("./../businessAudits/cartInfo/CartInfo");
const path = require("path");
const files = require.context("./../businessAudits", false, /\.vue$/);
const modules = {};
files.keys().forEach((key) => {
    const name = path.basename(key, ".vue");
    modules[name] = files(key).default || files(key);
});
import { export_json_to_excel } from "./../../../excel/Export2Excel";
import { formatDates, getCDData } from "./../../utils/utils";
import { config } from "../../../utils/tools";
export default {
    data() {
        return {
            isStauts: 0, //是否已审核
            isDetail: false,
            gridSelectRow: {},
            currentView: "", //侧边栏模板
            height: 0,
            dataCount: 0,
            pageSize: 30,
            pageIndex: 1, //默认当前为第一页
            showModel: false,
            loading: true,
            formItem: {
                VLPN: "",
                VLPNColor: "",
                ESPOrganizationCode: "",
                CheckType: "",
                VIN: "",
                Status: "",
                AuditState: "",
                timeRange: [],
                CheckId: "",
            },
            search_CD: {},
            initform: {
                cd_state: { 1: "已审核", 0: "未审核" },
                cd_auditState: {
                    3: "自动审核",
                    1: "审核通过",
                    0: "审核不通过",
                    4: "退回",
                },
            },
            cdData: {
                cd_state: [
                    { CodeName: "已审核", CodeValue: "1" },
                    { CodeName: "未审核", CodeValue: "0" },
                ],
                cd_auditState: [
                    { CodeName: "自动审核", CodeValue: "3" },
                    { CodeName: "审核通过", CodeValue: "1" },
                    { CodeName: "审核不通过", CodeValue: "0" },
                    { CodeName: "退回", CodeValue: "4" },
                ],
            },
            auditType: {
                20: { template: modules.AcceptAudit },
                21: { template: modules.VehicleInto },
                23: { template: modules.SkillDiscernAudit },
                24: { template: modules.VehicleInfoUpdateAudit },
                27: { template: modules.ExemptVehicleAudit },
                "07": { template: modules.SpotCheckAudit },
                30: { template: modules.ChangeRegistratAudit },
                "01": { template: modules.DateUpdateAudit },
                "08": { template: modules.OutInspectUpdateAudit },
                31: { template: modules.AcceptAudit },
                "02": { template: modules.ModelReviewAudit },
                10: { template: modules.CheckDateAudit },
                22: { template: modules.CrossStationAudit },
                33: { template: modules.StandardGasAudit },
                34: { template: modules.vehicleCombine },
                28: { template: modules.vehicleIutypeAudit },
                42: { template: modules.ApplyFJAudit },
                40: { template: modules.ChangeLingmanDataAudit}
            },
            options2: {
                shortcuts: [
                    {
                        text: "今天",
                        value() {
                            const end = new Date();
                            const start = new Date(
                                new Date(
                                    new Date().toLocaleDateString()
                                ).getTime()
                            );
                            start.setTime(start.getTime());
                            return [start, end];
                        },
                    },
                    {
                        text: "昨天",
                        value() {
                            const end = new Date(
                                new Date(
                                    new Date(
                                        new Date().setDate(
                                            new Date().getDate() - 1
                                        )
                                    ).toLocaleDateString()
                                ).getTime() +
                                    24 * 60 * 60 * 1000 -
                                    1
                            );
                            const start = new Date(
                                new Date(
                                    new Date().toLocaleDateString()
                                ).getTime()
                            );
                            start.setTime(start.getTime() - 3600 * 1000 * 24);
                            return [start, end];
                        },
                    },
                    {
                        text: "一周",
                        value() {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 7
                            );
                            return [start, end];
                        },
                    },
                    {
                        text: "一个月",
                        value() {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 30
                            );
                            return [start, end];
                        },
                    },
                    {
                        text: "三个月",
                        value() {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 90
                            );
                            return [start, end];
                        },
                    },
                ],
            },
            historyColumns: [
                {
                    title: "号牌号码",
                    align: "center",
                    minWidth: 110,
                    key: "VLPN",
                    render: (h, params) => {
                        return h("div", [
                            h(
                                "span",
                                {
                                    style: this.setVLPNColor(
                                        params.row.VLPNColor
                                    ),
                                    on: {
                                        click: () => {
                                            this.$router.push({
                                                name: "hj-home-vehicle",
                                                params: {
                                                    VehicleId:
                                                        params.row.VehicleID,
                                                },
                                            });
                                        },
                                    },
                                },
                                params.row.VLPN
                            ),
                        ]);
                    },
                },
                {
                    title: "申请站点",
                    align: "center",
                    key: "OrgCode",
                    minWidth: 100,
                    sortable: true,
                    render: (h, params) => {
                        const Name = this.initform.cd_station[
                            params.row.OrgCode
                        ];
                        return h("span", {}, Name);
                    },
                },
                {
                    title: "申请人",
                    align: "center",
                    minWidth: 100,
                    key: "ApplyUserName",
                },
                {
                    title: "申请时间",
                    align: "center",
                    minWidth: 166,
                    key: "ApplyTime",
                    render: (h, params) => {
                        const Name = this.$options.filters.dataFormat(
                            params.row.ApplyTime,
                            "yyyy-MM-dd hh:mm:ss"
                        );
                        return h("span", {}, Name);
                    },
                },
                {
                    title: "车架号",
                    align: "center",
                    minWidth: 185,
                    key: "VIN",
                },
                {
                    title: "燃油种类",
                    align: "center",
                    minWidth: 100,
                    key: "FuelType",
                    render: (h, params) => {
                        // const Name = this.initform.cd_fuelType[params.row.FuelType];
                        const Name = this.returnMultiple(
                            this.initform.cd_fuelType,
                            params.row.FuelType
                        );
                        return h("span", {}, Name);
                    },
                },

                {
                    title: "审核类型",
                    align: "center",
                    minWidth: 180,
                    sortable: true,
                    key: "CheckType",
                    render: (h, params) => {
                        const Name = this.initform.cd_checkType[
                            params.row.CheckType
                        ];
                        return h("span", {}, Name);
                    },
                },
                {
                    title: "申请原因",
                    align: "center",
                    minWidth: 150,
                    sortable: true,
                    key: "ApplyReason",
                    render: (h, params) => {
                        if (
                            !params.row.ApplyReason ||
                            params.row.CheckType == "24"
                        )
                            return;
                        let Name;
                        let codeValues;
                        let codeNames;
                        let children = [];
                        if (
                            params.row.CheckType == "20" ||
                            params.row.CheckType == "31" ||
                            params.row.CheckType == "21"
                        ) {
                            codeValues = params.row.ApplyReason.split(",");
                            codeNames = this.returnReasonValues(
                                this.search_CD.CD_AuditReason,
                                codeValues
                            );
                            codeNames = codeNames.split(";");
                            codeNames.forEach((item) => {
                                children.push(h("p", {}, item));
                            });
                        } else if (params.row.CheckType == "10") {
                            codeValues = params.row.ApplyReason.split(",");
                            codeNames = this.returnReasonValues(
                                this.search_CD.CD_ApplyReason,
                                codeValues
                            );
                            codeNames = codeNames.split(";");
                            codeNames.forEach((item) => {
                                children.push(h("p", {}, item));
                            });
                        } else codeNames = params.row.ApplyReason;
                        return h("div", {}, children);
                    },
                },
                {
                    title: "审核时间",
                    align: "center",
                    minWidth: 166,
                    key: "CheckTime",
                    render: (h, params) => {
                        const Name = this.$options.filters.dataFormat(
                            params.row.CheckTime,
                            "yyyy-MM-dd hh:mm:ss"
                        );
                        return h("span", {}, Name);
                    },
                },
                {
                    title: "审核人",
                    align: "center",
                    minWidth: 100,
                    key: "Checker",
                },
                {
                    title: "审核状态",
                    align: "center",
                    minWidth: 100,
                    key: "Status",
                    render: (h, params) => {
                        let tmpStr = "";
                        if (params.row.Status == 1) {
                            tmpStr = "已审核";
                        } else if (params.row.Status == 0) {
                            tmpStr = "未审核";
                        } else {
                            tmpStr = " ";
                        }
                        return h(
                            "span",
                            {
                                style: {
                                    color:
                                        params.row.Status == 0
                                            ? "#f00"
                                            : params.row.Status == 1
                                            ? "#19be6b"
                                            : " ",
                                },
                            },
                            tmpStr
                        );
                    },
                },
                {
                    title: "审核结果",
                    align: "center",
                    minWidth: 100,
                    key: "AuditState",
                    render: (h, params) => {
                        let tmpStr = "";
                        if (params.row.AuditState == 1) {
                            tmpStr = "通过";
                        } else if (params.row.AuditState == 0) {
                            tmpStr = "不通过";
                        } else if (params.row.AuditState == 3) {
                            tmpStr = "自动通过";
                        } else if (params.row.AuditState == 4) {
                            tmpStr = "退回";
                        } else {
                            tmpStr = " ";
                        }
                        return h(
                            "span",
                            {
                                style: {
                                    color:
                                        params.row.AuditState == 0
                                            ? "#f00"
                                            : params.row.AuditState == 1
                                            ? "#2d8cf0"
                                            : params.row.AuditState == 4
                                            ? "#f90"
                                            : params.row.AuditState == 3
                                            ? "#f90"
                                            : " ",
                                },
                            },
                            tmpStr
                        );
                    },
                },
            ],
            historyData: [],
            allResult: [],
        };
    },
    watch: {},
    computed: {
        detailTitle() {
            const self = this;
            let titleArr = [];
            if (self.gridSelectRow) {
                if (self.gridSelectRow.CheckType)
                    titleArr.push(
                        self.initform.cd_checkType[self.gridSelectRow.CheckType]
                    );
                if (self.gridSelectRow.VLPN)
                    titleArr.push(self.gridSelectRow.VLPN);
                if (self.gridSelectRow.OwnerName)
                    titleArr.push(self.gridSelectRow.OwnerName);
                if (self.gridSelectRow.VIN)
                    titleArr.push(self.gridSelectRow.VIN);
            }
            return titleArr.join("-");
        },
    },
    components: modules,
    // AcceptAudit, //受理审核（或复合审核）
    // SkillDiscernAudit, //技术鉴别审核
    // VehicleInfoUpdateAudit, //车辆关键信息修改审核
    // ExemptVehicleAudit, //免检车辆审核
    // SpotCheckAudit, //环检抽查审核
    // ChangeRegistratAudit, //车辆变更登记审核
    // DateUpdateAudit, //车辆数据修改审核
    // OutInspectUpdateAudit, //外检修改审核
    // ModelReviewAudit, //车型审核
    // CheckDateAudit //检测数据审核
    methods: {
        // checkType改变
        changeCheckType(value) {
            if (!value) {
                this.formItem.ApplyReason = "";
            }
        },
        //数据导出
        async exportExcel() {
            const _this = this;
            let param = {
                formItem: _this.formItem,
                pageIndex: _this.pageIndex,
                pageSize: _this.pageSize,
            };
            const res = await _this.$curl.get("api/hj/getAuditHistory", {
                param: JSON.stringify(param),
                IsExport: 1,
            });
            require.ensure([], () => {
                const tHeader = this.historyColumns.map((c) => c.title);
                const filterVal = this.historyColumns.map((c) => c.key);
                const list = JSON.parse(JSON.stringify(res.allResult));
                const data = this.formatJson(filterVal, list);
                export_json_to_excel(
                    tHeader,
                    data,
                    " 业务审核历史查询数据" +
                        formatDates(new Date(), "yyyyMMdd")
                );
            });
        },
        formatJson(filterVal, jsonData) {
            const self = this;
            return jsonData.map((v) =>
                filterVal.map((j) => {
                    if (j == "OrgCode") {
                        v[j] = self.returncodenames(
                            self.search_CD.StationInfo,
                            v[j]
                        );
                    } else if (j == "FuelType") {
                        v[j] = self.returnMultiple(
                            self.initform.cd_fuelType,
                            v[j]
                        );
                    } else if (j == "CheckType") {
                        v[j] = self.returncodenames(
                            self.search_CD.CD_CheckType,
                            v[j]
                        );
                    } else if (j == "Status") {
                        v[j] = self.returncodenames(self.cdData.cd_state, v[j]);
                    } else if (j == "AuditState") {
                        v[j] = self.returncodenames(
                            self.cdData.cd_auditState,
                            v[j]
                        );
                    } else if (j == "ApplyTime" || j == "CheckTime") {
                        v[j] == formatDates(v[j], "yyyy-MM-dd hh:mm:ss");
                    } else if (j == "ApplyReason") {
                        if (!v[j] || v.CheckType == "车辆关键信息修改审核")
                            return;
                        if (
                            v.CheckType == "受理审核" ||
                            v.CheckType == "复合审核" ||
                            v.CheckType == "外地转入二手车审核"
                        ) {
                            v[j] = this.returnReasonValues(
                                this.search_CD.CD_AuditReason,
                                v.ApplyReason.split(",")
                            );
                        } else if (v.CheckType == "检测数据审核") {
                            v[j] = this.returnReasonValues(
                                this.search_CD.CD_ApplyReason,
                                v.ApplyReason
                            );
                        } else v[j] = v.ApplyReason;
                    }
                    return v[j];
                })
            );
        },
        returncodenames(namelist, codevalue) {
            if (namelist) {
                let CodeName = "";
                namelist.forEach((item) => {
                    if (item.CodeValue == codevalue) CodeName = item.CodeName;
                });
                return CodeName;
            }
        },
        // 针对审核原因渲染
        returnReasonValues(nameList, codeValues) {
            if (nameList && codeValues) {
                let CodeName = [];
                for (let i = 0; i < codeValues.length; i++) {
                    for (let j = 0; j < nameList.length; j++) {
                        if (nameList[j].CodeValue == codeValues[i]) {
                            CodeName.push(nameList[j].CodeName);
                        }
                    }
                }
                return CodeName.join(" ; ");
            }
        },
        returnMultiple(cdList, codeValue) {
            const _this = this;
            if (!codeValue) return;
            const arrs = String(codeValue).split("");
            let CodeName = [];
            for (let key in cdList) {
                arrs.forEach((item) => {
                    if (key == item) CodeName.push(cdList[key]);
                });
            }
            return CodeName.join(",");
        },
        handleReset() {
            this.pageIndex = 1;
            this.formItem = {
                VLPN: "",
                VLPNColor: "",
                ESPOrganizationCode: "",
                CheckType: "",
                VIN: "",
                Status: "",
                AuditState: "",
                timeRange: [],
                CheckId: "",
            };
            this.handleData();
        },
        submitAudit() {
            if (!this.$refs.refDom.SubmitAudit) return;
            this.$refs.refDom.SubmitAudit(this.isStauts); //调用子组件的方法
        },
        // 退回审核
        backToAudit() {
            console.log('点击退回触发')
            if (!this.$refs.refDom.BackToAudit) return;
            console.log('子组件存在退回方法')
            this.$refs.refDom.BackToAudit();
        },
        handleBackToAudit(auditInfo, tailCheckInfo) {
            console.log('接收到退回的审核参数',auditInfo,tailCheckInfo)
            if(auditInfo.Remarks && auditInfo.Remarks.trim()) {
                this.$curl.post('api/hj/saveBackToAudit', {
                    auditInfo: {
                        CheckId: auditInfo.CheckId,
                        Remarks: auditInfo.Remarks,
                        CheckType: auditInfo.CheckType
                    },
                    tailCheckInfo
                }).then(res => {
                    if(res.code) {
                        let auditParam = JSON.parse(JSON.stringify(auditInfo))
                        Object.assign(auditParam, res.auditInfo)
                        Object.assign(this.gridSelectRow, auditParam)
                        this.onEdit(this.gridSelectRow)
                        this.$Message.success(res.msg)
                    } else {
                        this.$Message.warning("退回操作失败！")
                    }
                })
            } else {
                this.$Message.warning("退回审核必须填写备注！")
            }
        },
        onEdit(entity) {
            const self = this;
            Object.assign(self.gridSelectRow, entity);
            self.isDetail = false;
            //如果是未审核才移除。否则修改不移除
            if (this.isStauts == 0) {
                self.historyData.forEach((v, k) => {
                    if (v.CheckId == entity.CheckId) {
                        v.CheckTime = entity.CheckTime;
                        v.Checker = entity.Checker;
                        v.Status = entity.Status;
                        v.AuditState = entity.AuditState;
                    }
                });
            }
        },
        onClicks(rowdata) {
            this.RowNumber = rowdata.RowNumber;
            this.isStauts = rowdata.Status;
            this.gridSelectRow = rowdata;
            if (
                this.gridSelectRow &&
                this.auditType[this.gridSelectRow.CheckType]
            ) {
                this.currentView = this.auditType[
                    this.gridSelectRow.CheckType
                ].template; //选取侧边栏模板
                this.isDetail = true;
            } else {
                this.$Notice.warning({
                    title: "提醒",
                    desc: "暂无审核类型模板,请添加",
                });
                this.isDetail = false;
                return;
            }
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
                background: `${vlpn_c.Background}`,
                color: `${vlpn_c.TextColor}`,
                "border-color": `${vlpn_c.BorderColor}`,
                "font-weight": "bold",
                "font-size": "10pt",
            };
        },
        rowClassName(row, index) {},
        timeChange(data) {},
        setHeight() {
            this.height = this.$refs.bc.offsetHeight - 35; //this.$refs.bs.getBoundingClientRect().height;
        },
        showSearchModel() {
            this.showModel = !this.showModel;
        },
        Search() {
            this.pageIndex = 1;
            this.showModel = !this.showModel;
            this.handleData();
        },
        async getPageSize(pageSize) {
            //获取当前页的大小
            this.pageSize = pageSize;
            this.loading = true;
            let param = {
                formItem: this.formItem,
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
            };
            const res = await this.$curl.get("api/hj/getAuditHistory", {
                param: JSON.stringify(param),
                IsExport: 0,
            });
            if (res.state) {
                this.historyData = res.data;

                if (res.dataCount) this.dataCount = res.dataCount.total;
            }
            this.loading = false;
        },
        async handleData(index = this.pageIndex) {
            this.pageIndex = index;
            this.loading = true;
            this.formItem.timeRange = [
                this.$options.filters.dataFormat(
                    this.formItem.timeRange[0],
                    "yyyy-MM-dd 00:00:00"
                ),
                this.$options.filters.dataFormat(
                    this.formItem.timeRange[1],
                    "yyyy-MM-dd  23:59:59"
                ),
            ];
            let param = {
                formItem: this.formItem,
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
            };
            this.loading = true;
            const res = await this.$curl.get("api/hj/getAuditHistory", {
                param: JSON.stringify(param),
                IsExport: 0,
            });
            if (res.state) {
                this.historyData = res.data;
                if (res.dataCount) this.dataCount = res.dataCount.total;
            }
            this.loading = false;
        },
        //直接从浏览器缓存获取CD表或者从reids
        getDBinfoByMultipte() {
            const self = this;
            const list = [
                {
                    tableName: "CD_VLPNColor",
                    columns: "CodeValue,CodeName",
                    where: "where IsAvailable=1",
                },
                {
                    tableName: "StationInfo",
                    columns: "StationCode as CodeValue,StationName as CodeName",
                    where: "",
                },
                {
                    tableName: "CD_CheckType",
                    columns: "CodeValue,CodeName",
                    where: "where IsAvailable=1",
                },
                {
                    tableName: "CD_FuelType",
                    columns: "CodeValue,CodeName",
                    where: "where IsAvailable=1",
                },

                {
                    tableName: "CD_City",
                    columns: "CodeValue,CodeName",
                    where: "where IsAvailable=1",
                },
                {
                    tableName: "CD_VehicleKind",
                    columns: "CodeValue,CodeName",
                    where: "where IsAvailable=1",
                },
                {
                    tableName: "CD_InspectionMethod",
                    columns: "CodeValue,CodeName",
                    where: "where IsAvailable=1",
                },
                {
                    tableName: "CD_GAVType",
                    columns: "CodeValue,CodeName",
                    where: "where IsAvailable=1",
                },
                {
                    tableName: "CD_UseOfAuto",
                    columns: "CodeValue,CodeName",
                    where: "where IsAvailable=1",
                },
                {
                    tableName: "CD_Emissionstandard",
                    columns: "CodeValue,CodeName",
                    where: "where IsAvailable=1",
                },
                {
                    tableName: "CD_AuditReason",
                    columns: "CodeValue,CodeName",
                    where: "where IsAvailable=1",
                },
                {
                    tableName: "CD_CredentialsType",
                    columns: "CodeValue,CodeName",
                    where: "where IsAvailable=1",
                },
                {
                    tableName: "CD_FGKReason",
                    columns: "CodeValue,CodeName",
                    where: "where IsAvailable=1",
                },
                {
                    tableName: "CD_InspectionWay",
                    columns: "CodeValue,CodeName",
                    where: "where IsAvailable=1",
                },
                {
                    tableName: "CD_InspectionKind",
                    columns: "CodeValue,CodeName",
                    where: "where IsAvailable=1",
                },
                {
                    tableName: "CD_Province",
                    columns: "CodeValue,CodeName",
                    where: "where IsAvailable=1",
                },
                {
                    tableName: "Area",
                    columns: "AreaCode as CodeValue, AreaName as CodeName",
                },
                {
                    tableName: "CD_VehicleType",
                    columns: "CodeValue, CodeName",
                    where: "where IsAvailable=1",
                },
                {
                    tableName: "CD_ApplyReason",
                    columns: "CodeValue,CodeName",
                    where: "where IsAvailable=1",
                },
                // {
                //   tableName: "CD_AuditReason",
                //   columns: "CodeValue,CodeName",
                //   where: "where IsAvailable=1",
                // }
            ];
            const TableName = list.map((l) => l.tableName);
            const CD_Name = [
                "cd_vlpnColor",
                "cd_station",
                "cd_checkType",
                "cd_fuelType",
                "cd_city",
                "cd_vehicleKind",
                "cd_inspectMethod",
                "cd_gavType",
                "cd_useOfAuto",
                "cd_emission",
                "cd_auditReason",
                "cd_credentials",
                "cd_fgkReason",
                "cd_inspectionWay",
                "cd_inspectionKind",
                "cd_province",
                "area",
                "cd_vehicleType",
                "cd_applyreason",
            ];
            let data = [];
            if (self.$getDBTable) {
                self.$getDBTable(TableName).then((res) => {
                    res.map((items, index) => {
                        data = JSON.parse(items);
                        if (data[0].hasOwnProperty("IsAvailable"))
                            data = data.filter((d) => d.IsAvailable == 1);
                        self.initform[CD_Name[index]] = {};
                        self.search_CD[TableName[index]] = {};
                        self.search_CD[TableName[index]] = data;
                        data.forEach((item) => {
                            self.initform[CD_Name[index]][item.CodeValue] =
                                item.CodeName;
                        });
                    });
                    self.handleData();
                });
            } else {
                this.$curl
                    .get("api/hj/getCDData", {
                        CDDataList: JSON.stringify(list),
                    })
                    .then((res) => {
                        if (res.state) {
                            res.data.map((items, index) => {
                                data = items[0].hasOwnProperty("IsAvailable")
                                    ? items.filter((i) => i.IsAvailable == 1)
                                    : items;
                                self.initform[CD_Name[index]] = {};
                                self.search_CD[TableName[index]] = {};
                                self.search_CD[TableName[index]] = data;
                                data.forEach((item) => {
                                    self.initform[CD_Name[index]][
                                        item.CodeValue
                                    ] = item.CodeName;
                                });
                            });
                            self.handleData();
                        }
                    });
            }
        },
    },
    mounted() {
        if (this.$route.query && this.$route.query.CheckId) {
            this.formItem.CheckId = this.$route.query.CheckId;
        }
        if (this.$route.params && this.$route.params.startTime)
            this.formItem.timeRange = [
                this.$route.params.startTime,
                this.$route.params.endTime,
            ];
        window.addEventListener("resize", this.setHeight);
        this.setHeight();
        this.getDBinfoByMultipte();
    },
    destroyed() {
        window.removeEventListener("resize", this.setHeight);
    },
};
</script>
// 右侧滑块样式
<style scoped>
.fx-thema.light .fx__group {
    border: none !important;
}

.drawer-footer {
    -webkit-box-flex: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
    width: 100%;
    bottom: 0;
    left: 0;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    overflow: hidden;
}
.drawer-body-wrapper {
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
}

.drawer-body-wrapper /deep/ .ivu-card {
    margin: 10px;
}

.content /deep/ .ivu-drawer-body {
    padding: 0 0 !important;
    overflow: hidden !important;
}
</style>

<style scoped>
.content /deep/ .ivu-form-item {
    margin-bottom: 6px;
}
</style>


