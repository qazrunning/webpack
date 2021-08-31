// 业务办理-受理信息
<template>
    <div class="accept-main">
        <Card>
            <p slot="title">
                受理信息&nbsp;&nbsp;<span
                    v-show="isShowRemark && ApplyReasonBool"
                    style="color: red"
                    >({{ remarkData }})</span
                >
            </p>
            <template slot="extra" v-if="flag">
                <Button
                    type="primary"
                    style="margin-top: -5px"
                    @click="inspectionRecords"
                    >检测记录</Button
                >
            </template>
            <Form label-position="right" :label-width="100">
                <Row :gutter="32">
                    <i-col :sm="8">
                        <FormItem label="受理编码:">{{
                            AcceptForm.InspectionNum || ""
                        }}</FormItem>
                    </i-col>
                    <i-col :sm="8">
                        <FormItem label="检测站名称:">{{
                            initform.cd_station[AcceptForm.StationCode] || " "
                        }}</FormItem>
                    </i-col>
                    <i-col :sm="8">
                        <FormItem label="检测方式:">{{
                            initform.cd_inspectionWay[
                                AcceptForm.InspectionWay
                            ] || " "
                        }}</FormItem>
                    </i-col>
                </Row>
                <Row :gutter="32">
                    <i-col :sm="8">
                        <FormItem label="检测性质:">{{
                            initform.cd_inspectionKind[
                                AcceptForm.InspectionKind
                            ] || " "
                        }}</FormItem>
                    </i-col>
                    <i-col :sm="8">
                        <FormItem label="受理人员:">{{
                            AcceptForm.Operator || ""
                        }}</FormItem>
                    </i-col>
                    <i-col :sm="8">
                        <FormItem label="受理时间:">{{
                            AcceptForm.AcceptanceDate || ""
                        }}</FormItem>
                    </i-col>
                </Row>
                <Row :gutter="32">
                    <i-col :sm="8">
                        <FormItem label="检测方法:">{{
                            initform.cd_inspectMethod[
                                AcceptForm.InspectionMethod
                            ] || " "
                        }}</FormItem>
                    </i-col>
                    <i-col :sm="8">
                        <FormItem label="检测次数:">{{
                            AcceptForm.InspectionTimes || ""
                        }}</FormItem>
                    </i-col>
                    <i-col :sm="8">
                        <FormItem label="检测类型:">{{
                            initform.cd_inspectionNature[
                                AcceptForm.InspectionNature
                            ] || " "
                        }}</FormItem>
                    </i-col>
                </Row>
            </Form>
            <!-- 检测记录表格 -->
            <Modal v-model="modalVisi" width="50" :closable="false">
                <p slot="header" style="height: auto; line-height: normal">
                    <Row type="flex" justify="space-between">
                        <i-col>
                            {{ modalTitle }}
                        </i-col>
                        <i-col
                            >筛选条件：<Select
                                :transfer="true"
                                v-model="model1"
                                style="width: 150px"
                                @on-change="changeSelect"
                            >
                                <Option
                                    v-for="item in conditions"
                                    :value="item.value"
                                    :key="item.value"
                                    >{{ item.label }}</Option
                                >
                            </Select></i-col
                        >
                    </Row>
                </p>
                <Table
                    :columns="columns1"
                    :data="data1"
                    height="600"
                    :loading="loading"
                ></Table>
                <div slot="footer">
                    <Button type="default" @click="modalVisi = false"
                        >关闭</Button
                    >
                </div>
            </Modal>
        </Card>
    </div>
</template>
<script>
import { config } from "../../../../utils/tools";
export default {
    name: "acceptInfo",
    props: {
        AcceptForm: {
            type: Object,
            default: () => {},
        },
        initform: {
            type: Object,
            default: () => {},
        },
        selectData: {
            type: Object,
            default: () => {},
        },
        VehicleForm: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },
    data() {
        return {
            remarkData: "",
            isShowRemark: false,
            ApplyReasonBool: 0,
            modalVisi: false,
            modalTitle: "",
            columns1: [
                {
                    title: "车牌",
                    key: "VLPN",
                    render: (h, param) => {
                        return h(
                            "span",
                            { style: this.setVLPNColor(param.row.VLPNColor) },
                            param.row.VLPN
                        );
                    },
                },
                {
                    title: "站点名称",
                    key: "StationCode",
                    ellipsis: true,
                    tooltip: true,
                    render: (h, params) => {
                        let result = "",
                            { cd_station } = this.initform;
                        if (cd_station[params.row.StationCode])
                            result = cd_station[params.row.StationCode];
                        return h("span", {}, result);
                    },
                },
                {
                    title: "检测报告编号",
                    key: "InspectionReportNo",
                    ellipsis: true,
                    tooltip: true,
                },
                {
                    title: "检测时间",
                    key: "DetectEndTime",
                    ellipsis: true,
                    tooltip: true,
                },
                {
                    title: "检测方法",
                    key: "IUTYPE",
                    ellipsis: true,
                    tooltip: true,
                    render: (h, params) => {
                        let result = "",
                            { cd_inspectMethod } = this.initform;
                        if (cd_inspectMethod[params.row.IUTYPE])
                            result = cd_inspectMethod[params.row.IUTYPE];
                        return h("span", {}, result);
                    },
                },
                {
                    title: "检测结果",
                    key: "VDCT",
                    ellipsis: true,
                    tooltip: true,
                    render: (h, params) => {
                        let result = params.row.VDCT ? "通过" : "不通过";
                        return h("span", {}, result);
                    },
                },
            ],
            data1: [],
            loading: false,
            conditions: [
                {
                    value: 0,
                    label: "按车牌查询",
                },
                {
                    value: 1,
                    label: "按车型号查询",
                },
            ],
            model1: 0,
            flag: true,
        };
    },
    watch: {
        AcceptForm: {
            handler(newValue, oldValue) {
                if (newValue != {}) {
                    this.getInspectRatio(this.initform);
                    if (newValue.ApplyReason) {
                        this.ApplyReasonBool =
                            newValue.ApplyReason.indexOf("21") + 1;
                    }
                }
            },
            immediate: true, //刷新加载 立马触发一次handler
            deep: true, // 可以深度检测到 person 对象的属性值的变化
        },
        VehicleForm: {
            handler(newValue, oldValue) {
                if (newValue.ApplyReason) {
                    this.flag = newValue.ApplyReason.split(",").includes("21");
                }
            },
            immediate: true,
            deep: true,
        },
    },
    mounted() {},
    methods: {
        setVLPNColor(VLPNColor) {
            if (!VLPNColor) return {};
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
        changeSelect(value) {
            this.inspectionRecords();
        },
        // 检测记录
        inspectionRecords() {
            let _this = this;
            _this.modalTitle = "检测记录";
            _this.modalVisi = true;
            _this.loading = true;
            _this.data1 = [];
            let params = {
                VLPN: _this.VehicleForm.VLPN,
                IUVTYPE: _this.VehicleForm.IUVTYPE,
                model: _this.model1,
            };
            _this.$curl
                .post("/api/hj/getInspectionRecord", {
                    params: params,
                })
                .then((res) => {
                    if (res.state) {
                        _this.data1 = res.data;
                        _this.loading = false;
                    }
                });
        },
        // 获取提示信息
        getInspectRatio() {
            let {
                FactoryPlateModel,
                IUVTYPE,
                IUETYPE,
                VehicleID,
                AcceptanceDate,
            } = this.AcceptForm;
            let params = {
                FactoryPlateModel,
                IUVTYPE,
                IUETYPE,
                VehicleID,
                AcceptanceDate,
            };
            this.$curl
                .get("/api/hj/getInspectRatio", {
                    params: JSON.stringify(params),
                })
                .then((res) => {
                    this.remarkData = "";
                    this.isShowRemark = false;
                    if (res.data && JSON.stringify(res.data) !== "{}") {
                        this.isShowRemark = true;
                        let inspectMethods = this.initform.cd_inspectMethod;
                        let inspectMethodInfo = ``;
                        let oldInspectMethod = "";
                        for (let i in inspectMethods) {
                            if (i == res.data.IUTYPE)
                                inspectMethodInfo = inspectMethods[i];
                        }
                        let remark = `通过大数据分析，当前车型最多使用检测方法为${inspectMethodInfo},使用比率为${res.data.InspectRatio}%`;
                        if (
                            res.lastestData &&
                            JSON.stringify(res.lastestData) !== "{}"
                        ) {
                            remark += `，该车上次于${res.lastestData.DetectEndTime.slice(
                                0,
                                16
                            )}在${
                                this.initform.cd_station[
                                    res.lastestData.StationCode
                                ]
                            }使用${
                                this.initform.cd_inspectMethod[
                                    res.lastestData.IUTYPE
                                ]
                            }进行检测`;
                        }
                        this.remarkData = remark;
                    } else if (
                        res.lastestData &&
                        JSON.stringify(res.lastestData) !== "{}"
                    ) {
                        this.isShowRemark = true;
                        let inspectMethods = this.initform.cd_inspectMethod;
                        let oldInspectMethod = "";
                        for (let i in inspectMethods) {
                            if (i == res.lastestData.IUTYPE)
                                oldInspectMethod = inspectMethods[i];
                        }
                        this.remarkData = `该车上次于${res.lastestData.DetectEndTime.slice(
                            0,
                            16
                        )}在${
                            this.initform.cd_station[
                                res.lastestData.StationCode
                            ]
                        }使用${oldInspectMethod}进行检测`;
                    }
                });
        },
    },
};
</script>
<style scoped>
.accept-main .ivu-form-item {
    margin-bottom: 2px;
}

.accept-main /deep/ .ivu-form-item-label {
    color: #a0a0a0;
}
.remarksInfo {
    margin-top: 10px;
    color: red;
}
</style>
