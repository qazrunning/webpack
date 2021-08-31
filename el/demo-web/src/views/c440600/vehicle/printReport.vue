<template>
    <div style="height: 100%; overflow: auto">
        <div v-if="haveData">
            <Table
                ref="refTable"
                :columns="columns"
                :data="printdata"
                :height="table_height"
                :loading="loading"
            >
                <template slot-scope="{ row, index }" slot="lookSelect">
                    <label @click="getRowData($event, row, index)">
                        <Checkbox v-model="isSelect[index]"></Checkbox>
                    </label>
                </template>
                <template slot-scope="{ row }" slot="action">
                    <Button
                        type="primary"
                        size="small"
                        style="margin-left: 10px; float: right"
                        @click="getCurrentReport(row)"
                        >预览打印</Button
                    >
                    <Button
                        type="primary"
                        size="small"
                        style="float: right"
                        @click="getplayback(row)"
                        >回放</Button
                    >
                </template>
            </Table>
            <span
                v-show="this.isSelect.includes(true)"
                class="toggle"
                :class="{ toggleLeft: isShow, toggleRight: !isShow }"
                @click="replaceTable"
            >
                <span
                    class="point"
                    :class="{ pointLeft: isShow, pointRight: !isShow }"
                ></span>
                <span
                    v-if="isShow"
                    style="
                        color: white;
                        position: relative;
                        top: -3px;
                        font-size: 12px;
                    "
                    >对比图</span
                >
                <span
                    v-else
                    style="
                        color: white;
                        position: relative;
                        top: -3px;
                        font-size: 12px;
                    "
                    >对比表</span
                >
            </span>
        </div>
        <p v-else style="text-align: center">暂无相关数据</p>
        <!-- 过程曲线 -->
        <div v-if="haveData && !disTable" v-resize="resize">
            <div ref="dom" style="height: 400px; width: 100%"></div>
        </div>
        <!-- 表格形式 -->
        <div
            v-else-if="haveData && disTable"
            style="height: 400px; width: 100%"
        >
            <compareTable
                ref="refCompare"
                :selectData="selectData"
                :tableAll="tableAll"
                :cddata="cddata"
            ></compareTable>
        </div>
        <!-- 报告内容 -->
        <Modal width="880" v-model="showModel">
            <p slot="header" style="color: #f60; text-align: center">
                <Icon type="md-print" />
                <span>打印报告</span>
            </p>
            <printContent
                :giveReport="giveReport"
                ref="reportCont"
            ></printContent>
            <div slot="footer">
                <Button type="success" size="large" long @click="printStart"
                    >打印</Button
                >
            </div>
        </Modal>
        <!-- 检测报告相关图片展示 -->
        <Modal v-model="showReportImg" :width="width">
            <viewer
                :images="photo"
                style="
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: wrap;
                "
            >
                <div
                    v-for="(item, index) in photo"
                    :key="index"
                    :style="{ width: (width - 30) / n + 'px' }"
                    style="flex: 1; min-width: 370px; max-width: 380px"
                >
                    <p style="height: 38px; line-height: 38px; font-size: 14px">
                        {{
                            returncodenames(
                                cddata.CD_BusinessType,
                                item.BusinessType
                            )
                        }}
                        / {{ item.UploadFileUser }} / {{ item.UploadFileTime }}
                    </p>
                    <img
                        :src="item.Url"
                        :key="index"
                        style="width: 80%; marign-right: 4px"
                        @error="onError($event)"
                    />
                </div>
            </viewer>
            <div slot="footer" style="display: none"></div>
        </Modal>

        <!-- 检测回放弹框 -->
        <div class="modalbody">
            <Modal
                v-model="playback"
                title="更多条件检索"
                width="70%"
                @on-cancel="closemodal"
            >
                <p slot="header" class="fx__text_headline">
                    <span>{{ Iutype }}</span>
                </p>
                <modalbox
                    :modalData="modalData"
                    :VLPN="VLPN"
                    :VLPNColor="VLPNColor"
                    ref="modalchild"
                ></modalbox>
                <div slot="footer"></div>
            </Modal>
        </div>
    </div>
</template>
<script>
import printContent from "./printContent";
import compareTable from "./compareTable";
import modalbox from "./modalbox"; // 模态框组件
export default {
    components: {
        printContent,
        compareTable,
        modalbox,
    },
    props: {
        Vecid: { type: Number },
        selectVIN: { type: String },
        cddata: { type: Object },
        vehicleData: {
            type: Object,
        },
    },
    data() {
        //测试车辆粤C23500  MAG1100 粤Y846E0
        return {
            VLPNColor: "", //传给模态框的车牌颜色
            VLPN: "", //传给模态框的车牌号
            Iutype: "",
            playback: false, //检测回放模块
            modalData: [], //检测回放模块数据
            disTable: false,
            photo: [], //图片数组
            width: 500,
            n: 1,
            themaColor: this.$store.state.core.themaColor.basetextcolor,
            showReportImg: false,
            showModel: false,
            haveData: false, //是否有相关数据
            dom: null,
            prints: false,
            print_model: false,
            QY_CY: false,
            table_height: 70,
            //字典表
            station: [],
            jctype: [],
            reportImg: [], //文件图片
            CDvlpncolor: [],
            CDfueltype: [],
            BusinessType: [],
            CDocha: [],
            loading: false,
            printdata: [],
            newprints: {
                InsDataInfo: [],
                jcsb: [],
                OBDInfo: [],
                wgj: [],
                Method_g: [],
                Method_f: [],
                Method_a: [],
                Method_b: [],
                Method_c: [],
            },
            giveReport: {}, //传递给子组件
            isShowReport: false, //是否显示弹框
            columns: [
                {
                    title: "查看",
                    minWidth: 100,
                    align: "center",
                    slot: "lookSelect",
                },
                {
                    title: "检测站点",
                    key: "StationName",
                    align: "left",
                    minWidth: 150,
                    ellipsis: true,
                    tooltip: true,
                },
                {
                    title: "检测结果",
                    key: "NewVDCT",
                    minWidth: 120,
                    render: (h, params) => {
                        let name = "";
                        if (params.row.NewVDCT == "1") {
                            name = "通过";
                        } else if (params.row.NewVDCT == "0") {
                            name = "未通过";
                        } else {
                            name = params.row.NewVDCT;
                        }
                        return h("div", name);
                    },
                },
                {
                    title: "检测方法",
                    key: "IUTYPE",
                    minWidth: 120,
                    render: (h, params) => {
                        let name = this.returncodenames(
                            this.cddata.CD_InspectionMethod,
                            params.row.IUTYPE
                        );
                        return h("div", name);
                    },
                },
                {
                    title: "检测日期",
                    key: "DetectEndTime",
                    minWidth: 200,
                    render: (h, params) => {
                        const Name = this.$options.filters.dataFormat(
                            params.row.DetectEndTime,
                            "yyyy-MM-dd hh:mm:ss"
                        );
                        return h("div", Name);
                    },
                },
                {
                    title: "检测类型",
                    key: "jctype",
                    minWidth: 80,
                },
                {
                    title: "检测性质",
                    key: "InspectionNature",
                    minWidth: 120,
                    render: (h, params) => {
                        let name = "";
                        if (params.row.InspectionNature == "01") {
                            name = "初检";
                        } else if (params.row.InspectionNature == "02") {
                            name = "复检";
                        } else {
                            name = "多检";
                        }
                        return h("div", name);
                    },
                },
                {
                    title: "文件预览",
                    key: "imgData",
                    minWidth: 80,
                    render: (h, params) => {
                        if (params.row.imgData) {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#5cadff",
                                        cursor: "pointer",
                                    },
                                    on: {
                                        click: () => {
                                            this.showReportImg = true;
                                            let BusinessKey = [];
                                            BusinessKey.push(
                                                params.row.InspectionNum
                                            );
                                            this.$curl
                                                .post(
                                                    "api/hj/getReportAndDataImg",
                                                    {
                                                        BusinessType: "11",
                                                        BusinessKey: BusinessKey,
                                                    }
                                                )
                                                .then((res) => {
                                                    const { data } = res;
                                                    if (data) {
                                                        this.photo = data;
                                                        let photoNum =
                                                            data.length;
                                                        if (photoNum > 1) {
                                                            this.n = 2;
                                                            this.width = 800;
                                                        }
                                                    }
                                                });
                                        },
                                    },
                                },
                                params.row.imgData + "个文件"
                            );
                        } else {
                            return h("span", "无文件");
                        }
                    },
                },
                {
                    title: "操作",
                    slot: "action",
                    align: "center",
                    minWidth: 180,
                },
            ],
            tableAll: [], // 所有数据
            tableAllList: [], // 选择所有的数据
            tableAllTime: [], // 选择所有的数据
            tableAllTutype: "", // 选择所有的类型
            tableList: [], // 选择的编号
            tableTime: [], // 选择的时间
            selectData: [], // 选择的数据
            isShow: true, // 样式显示
            isSelect: [], // 是否选中
        };
    },
    mounted() {},
    methods: {
        // 关闭检测回放模态框事件
        closemodal() {
            this.$refs.modalchild.chongzhi();
        },
        //打开检测回放
        async getplayback(row) {
            // console.log(row);
            this.modalData = [];
            // console.log(this.vehicleData);
            this.VLPN = this.vehicleData.VLPN;
            this.VLPNColor = this.vehicleData.VLPNColor;
            this.playback = true;
            let { IUTYPE, DetectEndTime, InspectionNum } = row;
            DetectEndTime = DetectEndTime.replace("-", "").substring(0, 6);
            let baseTable = "";
            if (IUTYPE == "G") {
                this.Iutype = "加载减速法";
                baseTable = "LDProcessData" + DetectEndTime;
            } else if (IUTYPE == "F") {
                this.Iutype = "自由加速法";
                baseTable = "LightProofSmokeProcessData" + DetectEndTime;
            } else if (IUTYPE == "A") {
                this.Iutype = "双怠速法";
                baseTable = "TSIProcessData" + DetectEndTime;
            } else if (IUTYPE == "B") {
                this.Iutype = "稳态工况法";
                baseTable = "ASMProcessData" + DetectEndTime;
            } else if (IUTYPE == "C") {
                this.Iutype = "简易瞬态工况法";
                baseTable = "IMProcessData" + DetectEndTime;
            }
            // console.log(IUTYPE, baseTable, DetectEndTime, InspectionNum);
            let param = {
                IUTYPE: IUTYPE,
                baseTable: JSON.parse(JSON.stringify(baseTable)),
                InspectionNum: InspectionNum,
            };
            await this.$curl
                .get("api/hj/getPlayBack", { param })
                .then((res) => {
                    if (res.code == 0) {
                        this.$Message.error("暂无检测过程数据");
                        this.$refs.modalchild.canotUse = true;
                    } else {
                        if (res.data && res.data.length != 0) {
                            this.modalData = res.data;
                        } else {
                            this.$Message.error("暂无检测过程数据");
                            this.$refs.modalchild.canotUse = true;
                        }
                    }
                });
            // console.log('父组件',this.modalData);
            this.$refs.modalchild.setHeight();
            this.$refs.modalchild.changeType(IUTYPE);
        },

        resize() {
            if (this.dom) this.dom.resize();
        },
        onError(event) {
            event.target.src = "static/img/imgError.png";
        },
        // ivu-checkbox-checked
        // ivu-checkbox
        // 获取每行数据
        getRowData(e, row, index) {
            if (this.tableList.length == 0) {
                this.tableAllTutype = row.IUTYPE;
            }
            this.isSelect[index] = !this.isSelect[index];
            if (!this.isSelect.includes(true)) {
                this.getAllCancelData();
                return;
            }
            if (this.tableAllTutype) {
                if (this.tableAllTutype == row.IUTYPE) {
                    this.selectData = [];
                    this.tableList = [];
                    this.tableTime = [];
                    this.isSelect.forEach((item, id) => {
                        if (item) {
                            this.selectData.push(this.printdata[id]);
                            this.tableList.push(this.tableAllList[id]);
                            this.tableTime.push(this.tableAllTime[id]);
                        }
                    });
                } else {
                    this.isSelect[index] = !this.isSelect[index];
                    this.$Message.error("检测方法不一致,请重新选择");
                    e.preventDefault();
                    return;
                }
            }
            if (!this.disTable)
                this.showChart(
                    this.tableList,
                    this.tableAllTutype,
                    this.tableTime
                );
        },
        // 取消所有
        getAllCancelData(selection) {
            this.selectData = [];
            this.tableList = [];
            this.tableTime = [];
            this.tableAllTutype = "";
            if (!this.disTable) this.showChart([], "", []);
        },
        // 切换
        replaceTable() {
            this.isShow = !this.isShow;
            this.disTable = !this.disTable;
            if (!this.disTable)
                if (this.tableList.length)
                    this.showChart(
                        this.tableList,
                        this.tableAllTutype,
                        this.tableTime
                    );
                else {
                    this.showChart([], "", []);
                }
        },
        resize() {
            if (this.dom) this.dom.resize();
        },
        loaddata() {
            // console.log(this.selectVIN)
            this.getAllCancelData();
            let self = this;
            self.loading = true;
            self.printdata = [];
            self.$curl
                .get("api/hj/getInspectionDataByVehicleID", {
                    VehicleID: self.Vecid,
                })
                .then((res) => {
                    self.printdata = res.data;
                    if (self.printdata.length > 0) {
                        self.haveData = true;
                        let tableList = [];
                        let tableTime = [];
                        let tableData = [];
                        self.printdata.forEach((e, index) => {
                            this.isSelect[index] = false;
                            let stationName = "";
                            if (self.cddata && self.cddata.StationInfo) {
                                self.cddata.StationInfo.forEach((i) => {
                                    if (e.StationCode == i.CodeValue) {
                                        stationName = i.CodeName;
                                    }
                                });
                                e.StationName = stationName;
                            }
                            if (e.IUTYPE == self.printdata[0].IUTYPE) {
                                this.isSelect[index] = true;
                                tableList.push(e.InspectionNum);
                                tableTime.push(
                                    self.$options.filters.dataFormat(
                                        e.DetectEndTime,
                                        "yyyy-MM-dd hh:mm:ss"
                                    )
                                );
                                tableData.push(e);
                                e._checked = true;
                            }
                        });
                        self.selectData = tableData;
                        self.tableList = tableList;
                        self.tableTime = tableTime;
                        let BusinessKey = self.printdata.map(
                            (p) => p.InspectionNum
                        );
                        self.$curl
                            .post("api/hj/getReportAndDataImg", {
                                BusinessType: "11",
                                BusinessKey: BusinessKey,
                            })
                            .then((res) => {
                                const { data, code } = res;
                                let i;
                                if (code) {
                                    self.printdata.forEach((p) => {
                                        i = 0;
                                        data.forEach((d) => {
                                            if (
                                                d.BusinessKey == p.InspectionNum
                                            ) {
                                                i++;
                                            }
                                        });
                                        self.$set(p, "imgData", i);
                                    });
                                }
                            })
                            .catch((error) => {});
                        let list = self.printdata.map((e) => {
                            return e.InspectionNum;
                        });
                        let time = self.printdata.map((e) => {
                            return self.$options.filters.dataFormat(
                                e.DetectEndTime,
                                "yyyy-MM-dd hh:mm:ss"
                            );
                        });

                        self.table_height = 60 + self.printdata.length * 48;
                        if (self.table_height > 270) self.table_height = 270;
                        this.tableAllList = list;
                        this.tableAllTime = time;
                        this.tableAllTutype = self.printdata[0].IUTYPE;
                        self.showChart(
                            self.tableList,
                            self.printdata[0].IUTYPE,
                            self.tableTime
                        );
                    } else {
                        self.haveData = false;
                    }
                    self.loading = false;
                })
                .catch((err) => {
                    self.$Message.error("获取数据失败!");
                });
        },
        showChart(datas, IUTYPE, times) {
            let left = this;
            let data_a = {
                co_d: [],
                co_g: [],
                hc_d: [],
                hc_g: [],
                title: ["低怠速co", "低怠速hc", "高怠速co", "高怠速hc"],
            };
            let data_b = {
                hc_b: [],
                co_b: [],
                no_b: [],
                hc_a: [],
                co_a: [],
                no_a: [],
                title: [
                    "ASM5025_HC",
                    "ASM5025_CO",
                    "ASM5025_NO",
                    "ASM2540_HC",
                    "ASM2540_CO",
                    "ASM2540_NO",
                ],
            };
            let data_c = {
                hc: [],
                co: [],
                nox: [],
                title: ["HC", "CO", "NOx"],
            };
            let data_g = {
                VMP: [],
                SCKM: [],
                ELKM: [],
                yd80: [],
                yd100: [],
                nox: [],
                title: [
                    "VelMaxHP",
                    "最大轮边功率(实测)",
                    "最大轮边功率(限值)",
                    "烟度100%",
                    "烟度80%",
                    "NOx",
                ],
            };
            let data_f = {
                er1: [],
                er2: [],
                er3: [],
                era: [],
                er: [],
                title: [
                    "第一次测量值",
                    "第二次测量值",
                    "第三次测量值",
                    "测量平均值",
                    "测量限值",
                ],
            };
            let data_j = {
                title: ["林格曼黑度"],
                lgm_dj: [],
            };
            var colors = [
                "#5793f3",
                "#d14a61",
                "#675baa",
                "#B8F091",
                "#D9397A",
                "#A1522B",
            ];
            let option = {};
            let param = {
                list: datas,
                IUTYPE: IUTYPE,
            };
            this.$curl.get("api/hj/getIUTYPEstate", { param }).then((json) => {
                let res = json.data;
                if (res)
                    res = res.filter((item) => {
                        return this.tableList.includes(item.InspectionNum);
                    });
                this.tableAll = res;
                let series = [],
                    title = [];
                let ydata = [];
                switch (IUTYPE) {
                    case "A":
                        data_a.co_d = res.map((e) => {
                            return e.LICOR ? e.LICOR.toFixed(3) : "0";
                        });
                        data_a.hc_d = res.map((e) => {
                            return e.LIHCR ? e.LIHCR.toFixed(3) : "0";
                        });
                        data_a.co_g = res.map((e) => {
                            return e.HICOR ? e.HICOR.toFixed(3) : "0";
                        });
                        data_a.hc_g = res.map((e) => {
                            return e.HIHCR ? e.HIHCR.toFixed(3) : "0";
                        });
                        title = data_a.title;
                        series = [
                            {
                                name: data_a.title[0],
                                type: "line",
                                yAxisIndex: 0,
                                data: data_a.co_d,
                                smooth: true,
                            },
                            {
                                name: data_a.title[2],
                                type: "line",
                                yAxisIndex: 0,
                                data: data_a.co_g,
                                smooth: true,
                            },
                            {
                                name: data_a.title[1],
                                type: "line",
                                data: data_a.hc_d,
                                yAxisIndex: 1,
                                smooth: true,
                            },
                            {
                                name: data_a.title[3],
                                type: "line",
                                yAxisIndex: 1,
                                data: data_a.hc_g,
                                smooth: true,
                            },
                        ];
                        ydata = [
                            {
                                type: "value",
                                name: "(10⁻⁶)",
                                position: "right",
                                // offset: 80,
                                axisLine: {
                                    lineStyle: {
                                        color: colors[1],
                                    },
                                },
                                axisLabel: {
                                    formatter: "{value}(10⁻⁶)",
                                },
                            },
                            {
                                type: "value",
                                name: "%",
                                position: "left",
                                axisLine: {
                                    lineStyle: {
                                        color: colors[2],
                                    },
                                },
                                axisLabel: {
                                    formatter: "{value}%",
                                },
                            },
                        ];
                        break;
                    case "B":
                        data_b.hc_a = res.map((e) => {
                            return e.HCER5025 ? e.HCER5025.toFixed(3) : "0";
                        });
                        data_b.co_a = res.map((e) => {
                            return e.COER5025 ? e.COER5025.toFixed(3) : "0";
                        });
                        data_b.no_a = res.map((e) => {
                            return e.NOER5025 ? e.NOER5025.toFixed(3) : "0";
                        });
                        data_b.hc_b = res.map((e) => {
                            return e.HCER2540 ? e.HCER2540.toFixed(3) : "0";
                        });
                        data_b.co_b = res.map((e) => {
                            return e.COER2540 ? e.COER2540.toFixed(3) : "0";
                        });
                        data_b.no_b = res.map((e) => {
                            return e.NOER2540 ? e.NOER2540.toFixed(3) : "0";
                        });
                        title = data_b.title;
                        series = [
                            {
                                name: data_b.title[0],
                                type: "line",
                                data: data_b.hc_a,
                                smooth: true,
                            },
                            {
                                name: data_b.title[1],
                                type: "line",
                                data: data_b.co_a,
                                yAxisIndex: 1,
                                smooth: true,
                            },
                            {
                                name: data_b.title[2],
                                type: "line",
                                data: data_b.no_a,
                                smooth: true,
                            },
                            {
                                name: data_b.title[3],
                                type: "line",
                                data: data_b.hc_b,
                                smooth: true,
                            },
                            {
                                name: data_b.title[4],
                                type: "line",
                                data: data_b.co_b,
                                yAxisIndex: 1,
                                smooth: true,
                            },
                            {
                                name: data_b.title[5],
                                type: "line",
                                data: data_b.no_b,
                                smooth: true,
                            },
                        ];
                        ydata = [
                            {
                                type: "value",
                                name: "(10⁻⁶)",
                                position: "right",
                                // offset: 80,
                                axisLine: {
                                    lineStyle: {
                                        color: colors[1],
                                    },
                                },
                                axisLabel: {
                                    formatter: "{value}(10⁻⁶)",
                                },
                            },
                            {
                                type: "value",
                                name: "%",
                                position: "left",
                                axisLine: {
                                    lineStyle: {
                                        color: colors[2],
                                    },
                                },
                                axisLabel: {
                                    formatter: "{value}%",
                                },
                            },
                        ];
                        break;
                    case "C":
                        data_c.hc = res.map((e) => {
                            return e.HCER ? e.HCER.toFixed(3) : "0";
                        });
                        data_c.co = res.map((e) => {
                            return e.COER ? e.COER.toFixed(3) : "0";
                        });
                        data_c.nox = res.map((e) => {
                            return e.NOXER ? e.NOXER.toFixed(3) : "0";
                        });
                        title = data_c.title;
                        series = [
                            {
                                name: data_c.title[0],
                                type: "line",
                                data: data_c.hc,
                                smooth: true,
                            },
                            {
                                name: data_c.title[1],
                                type: "line",
                                data: data_c.co,
                                smooth: true,
                            },
                            {
                                name: data_c.title[2],
                                type: "line",
                                data: data_c.nox,
                                smooth: true,
                            },
                        ];
                        ydata = [
                            {
                                type: "value",
                                name: "(g/km)",
                                position: "left",
                                axisLine: {
                                    lineStyle: {
                                        color: colors[2],
                                    },
                                },
                                axisLabel: {
                                    formatter: "{value}(g/km)",
                                },
                            },
                        ];
                        break;
                    case "F":
                        data_f.er1 = res.map((e) => {
                            return e.ER1 ? e.ER1.toFixed(3) : "0";
                        });
                        data_f.er2 = res.map((e) => {
                            return e.ER2 ? e.ER2.toFixed(3) : "0";
                        });
                        data_f.er3 = res.map((e) => {
                            return e.ER3 ? e.ER3.toFixed(3) : "0";
                        });
                        data_f.era = res.map((e) => {
                            return e.ERA ? e.ERA.toFixed(3) : "0";
                        });
                        data_f.er = res.map((e) => {
                            return e.EL ? e.EL.toFixed(3) : "0";
                        });
                        title = data_f.title;
                        series = [
                            {
                                name: data_f.title[0],
                                type: "line",
                                data: data_f.er1,
                                smooth: true,
                            },
                            {
                                name: data_f.title[1],
                                type: "line",
                                data: data_f.er2,
                                smooth: true,
                            },
                            {
                                name: data_f.title[2],
                                type: "line",
                                data: data_f.er3,
                                smooth: true,
                            },
                            {
                                name: data_f.title[3],
                                type: "line",
                                data: data_f.era,
                                smooth: true,
                            },
                            {
                                name: data_f.title[4],
                                type: "line",
                                data: data_f.er,
                                smooth: true,
                            },
                        ];
                        ydata = [
                            {
                                type: "value",
                                name: "m⁻¹",
                                position: "left",
                                axisLine: {
                                    lineStyle: {
                                        color: colors[2],
                                    },
                                },
                                axisLabel: {
                                    formatter: "{value}m⁻¹",
                                },
                            },
                        ];
                        break;
                    case "G":
                        data_g.VMP = res.map((e) => {
                            return e.VelMaxHP == null
                                ? e.RotateSpeed == null
                                    ? "0"
                                    : e.RotateSpeed.toFixed(2)
                                : e.VelMaxHP.toFixed(2);
                        });
                        data_g.SCKM = res.map((e) => {
                            return e.MWP ? e.MWP.toFixed(3) : "0";
                        });
                        data_g.ELKM = res.map((e) => {
                            return e.MWPEL ? e.MWPEL.toFixed(3) : "0";
                        });
                        data_g.yd80 = res.map((e) => {
                            return e.ER80 ? e.ER80.toFixed(3) : "0";
                        });
                        data_g.yd100 = res.map((e) => {
                            return e.ER100 ? e.ER100.toFixed(3) : "0";
                        });
                        data_g.nox = res.map((e) => {
                            return e.NOX80 ? e.NOX80.toFixed(3) : "0";
                        });
                        title = data_g.title;
                        series = [
                            {
                                name: data_g.title[0],
                                type: "line",
                                data: data_g.VMP,
                                smooth: true,
                            },
                            {
                                name: data_g.title[2],
                                type: "line",
                                data: data_g.SCKM,
                                smooth: true,
                            },
                            {
                                name: data_g.title[1],
                                type: "line",
                                data: data_g.ELKM,
                                smooth: true,
                            },
                            {
                                name: data_g.title[3],
                                type: "line",
                                yAxisIndex: 1,
                                data: data_g.yd80,
                                smooth: true,
                            },
                            {
                                name: data_g.title[4],
                                type: "line",
                                yAxisIndex: 1,
                                data: data_g.yd100,
                                smooth: true,
                            },
                            {
                                name: data_g.title[5],
                                type: "line",
                                yAxisIndex: 1,
                                data: data_g.nox,
                                smooth: true,
                            },
                        ];
                        ydata = [
                            {
                                type: "value",
                                name: "KM",
                                position: "left",
                                axisLine: {
                                    lineStyle: {
                                        color: colors[2],
                                    },
                                },
                                axisLabel: {
                                    formatter: "{value}",
                                },
                            },
                            {
                                type: "value",
                                name: "",
                                position: "right",
                                axisLine: {
                                    lineStyle: {
                                        color: colors[1],
                                    },
                                },
                                axisLabel: {
                                    formatter: "{value}",
                                },
                            },
                        ];
                        break;
                    case "J":
                        data_j.lgm_dj = res.map((e) => {
                            return e.LingmanRank
                                ? e.LingmanRank.toFixed(3)
                                : "0";
                        });
                        title = data_j.title;
                        series = [
                            {
                                name: data_j.title[0],
                                type: "line",
                                data: data_j.lgm_dj,
                                smooth: true,
                            },
                        ];
                        ydata = [
                            {
                                type: "value",
                                name: "级",
                                position: "left",
                                min: 0,
                                max: 5,
                                axisLine: {
                                    lineStyle: {
                                        color: colors[2],
                                    },
                                },
                                axisLabel: {
                                    formatter: "{value}",
                                },
                            },
                        ];
                        break;
                    // default:
                    //   return;
                    //   break;
                }
                option = {
                    color: colors,
                    title: {
                        text: "多次检测数据对比分析",
                        textStyle: {
                            align: "center",
                            color: this.themaColor,
                            fontSize: 20,
                        },
                        top: "3%",
                        left: "10%",
                        bottom: "2%",
                    },
                    tooltip: {
                        trigger: "axis",
                        axisPointer: {
                            type: "cross",
                        },
                    },
                    legend: {
                        padding: [50, 0, 50, 0],
                        data: title,
                        textStyle: {
                            color: this.themaColor,
                        },
                    },
                    grid: {
                        top: "24%",
                    },
                    xAxis: [
                        {
                            type: "category",
                            axisTick: {
                                alignWithLabel: true,
                            },
                            data: times,
                            axisLabel: {
                                textStyle: {
                                    color: this.themaColor,
                                },
                            },
                            axisLine: {
                                lineStyle: {
                                    color: this.themaColor,
                                },
                            },
                        },
                    ],
                    yAxis: ydata,
                    series: series,
                };
                if (left.dom) {
                    left.dom.clear();
                    left.$echartsc.dispose(left.dom);
                    left.dom = null;
                }

                if (this.tableList.length == 0) {
                    option = {};
                }
                if (
                    !Object.keys(option).length ||
                    (this.haveData && option.series.length)
                ) {
                    if (left.$refs.dom) {
                        left.dom = left.$echartsc.init(left.$refs.dom, "");
                        left.dom.setOption(option, true);
                    }
                }
            });
        },

        // 点击打印预览,传参给子组件
        getCurrentReport(row) {
            this.showModel = true;
            this.giveReport = {
                InspectionDataID: row.InspectionDataID,
                VehicleID: row.VehicleID,
                IUTYPE: row.IUTYPE,
                InspectionNum: row.InspectionNum,
                VDCT: row.VDCT,
            };
            this.$nextTick(() => {
                this.$refs.reportCont.printaction();
            });
        },
        //过滤数据
        returncodenames(namelist, codevalue) {
            let CodeName = "";
            namelist.forEach((item) => {
                if (item.CodeValue == codevalue) CodeName = item.CodeName;
            });
            return CodeName;
        },
        //打印
        printStart() {
            this.showModel = false;
            this.$refs.reportCont.print_stat();
        },
    },
    beforeDestroy() {
        if (this.dom) {
            this.dom.clear();
            this.$echartsc.dispose(this.dom);
            this.dom = null;
        }
    },
};
</script>
<style scoped>
label {
    padding: 0;
    margin: 0;
}
img {
    width: 100%;
}
td {
    border: 1px solid #000000;
    text-align: left;
    margin: 0px;
    padding: 3px;
    font-family: 宋体;
    font-size: 9pt;
    /*height:3mm;
    line-height:3mm;*/
}

tr {
    line-height: 3mm;
}

.myTable {
    border-collapse: collapse;
}

.myTd {
    border: #000 1px solid;
    text-align: center;
}

.tdText {
    text-align: center;
}

.myFld-title {
    /*border-bottom: 0px solid #C0C0C0;*/
    text-align: left;
    vertical-align: middle;
    /*background-color: blueviolet;*/
    /*color: white;*/
    margin: 2px;
    padding: 2px 5px 2px 5px;
}

.mySpan-fld {
    /*border-style: solid;
        border-width: 0px 0px 1px 0px;
        border-color: #6694cf;*/
    text-align: left;
    vertical-align: bottom;
    margin: 2px 5px 0px 0px;
    padding: 2px 5px 2px 5px;
    width: 100%;
    /*text-decoration:underline;*/
    display: -moz-inline-box;
    display: inline-block; /* 使span支持设置宽度*/
    /*min-width: 3cm;*/
}

.nc-info p {
    margin: 0;
    padding: 2px 0;
    font-size: 7pt;
}

.report-info {
    display: inline-block;
    padding: 1px 5px;
}

.report-info span {
    font-family: 宋体;
    font-size: 9pt;
}
.toggle {
    position: relative;
    width: 75px;
    height: 25px;
    border: 1px solid black;
    padding: 6px;
    float: right;
    top: 20px;
    right: 20px;
    border-radius: 20px;
    z-index: 100;
}
.toggleLeft {
    background-color: #c5c8ce;
}
.toggleRight {
    background-color: #2d8cf0;
}
.point {
    position: relative;
    width: 25px;
    height: 23px;
    border-radius: 25px;
    top: -6px;
    background-color: white;
}
.pointLeft {
    float: left;
    left: -6px;
}
.pointRight {
    float: right;
    right: -6px;
}
</style>

<style lang="less" scoped>
/deep/ .ivu-modal {
    min-width: 800px;
}
</style>