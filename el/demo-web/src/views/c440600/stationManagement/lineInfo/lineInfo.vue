<template>
    <div class="scene_content">
        <div class="item_content cali_content">
            <Card :bordered="false">
                <p slot="title">{{ "标定结果数据" }}</p>
                <Table :columns="tabCoumns" :data="tabData"></Table>
            </Card>
        </div>
        <div class="item_content detection_content">
            <Card :bordered="false">
                <p slot="title">{{ "检测结果信息(最新5条信息)" }}</p>
                <div
                    class
                    style="margin-bottom: 5px"
                    v-for="(item, index) in tableDataList"
                    :key="index"
                >
                    <Card :bordered="false">
                        <p slot="title">{{ item.name }}</p>
                        <Table
                            :columns="item.columns"
                            :data="item.data"
                            border
                        ></Table>
                    </Card>
                </div>
                <div
                    v-if="tableDataList.length == 0"
                    style="display: flex; justify-content: center"
                >
                    <span>暂无数据</span>
                </div>
            </Card>
        </div>
    </div>
</template>
<script>
export default {
    name: "lineInfo",
    props: {
        SceneInfo: {
            type: Object,
            default: {},
        },
        stationList: {
            type: Array,
            default: [],
        },
        methodList: {
            type: Array,
            default: [],
        },
    },
    data() {
        let align = "center";
        return {
            tabCoumns: [
                {
                    title: "检测站",
                    key: "StationName",
                    align,
                },
                {
                    title: "检测站编码",
                    key: "StationCode",
                    align,
                },
                {
                    title: "检测线编号",
                    key: "SceneCode",
                    align,
                },
                {
                    title: "HC标定结果",
                    key: "HC_result",
                    align,
                },
                {
                    title: "CO标定结果",
                    key: "CO_result",
                    align,
                },
                {
                    title: "NO标定结果",
                    key: "NO_result",
                    align,
                },
                {
                    title: "CO2标定结果",
                    key: "CO2_result",
                    align,
                },
                {
                    title: "O2标定结果",
                    key: "O2_result",
                    align,
                },
                {
                    title: "标定日期",
                    key: "AdjustTimeEnd",
                    align,
                },
            ],
            tabData: [],
            columnsList: [
                {
                    title: "额定转速(r/min)",
                    key: "EngineRatedSpeed",
                    align: "center",
                    type: "F",
                },
                {
                    title: "实测转速(r/min)",
                    key: "ActualRotateSpeed",
                    align: "center",
                    type: "F",
                },
                {
                    title: "最后第一次测量值(1/m)",
                    key: "ER1",
                    align: "center",
                    type: "F",
                },
                {
                    title: "最后第二次测量值(1/m)",
                    key: "ER2",
                    align: "center",
                    type: "F",
                },
                {
                    title: "最后第三次测量值(1/m)",
                    key: "ER3",
                    align: "center",
                    type: "F",
                },
                {
                    title: "平均值(1/m)",
                    key: "ERA",
                    align: "center",
                    type: "F",
                },
                {
                    title: "限值(1/m)",
                    key: "EL",
                    align: "center",
                    type: "F",
                },
                {
                    title: "检测结果",
                    key: "LPSED",
                    align: "center",
                    type: "F",
                    width: 100,
                    render: (h, params) => {
                        let str = "";
                        if (params.row.LPSED == 1) {
                            str = "合格";
                        } else {
                            str = "不合格";
                        }
                        return h("span", str);
                    },
                },
                {
                    title: "转速额定转速",
                    key: "EngineRatedSpeed",
                    align: "center",
                    type: "G",
                    width: 150,
                },
                {
                    title: "转速实测（修正）VelMaxHP",
                    key: "VelMaxHP",
                    align: "center",
                    type: "G",
                },
                {
                    title: "最大轮边功率实测kW",
                    key: "VelMaxEnginePower",
                    align: "center",
                    type: "G",
                },
                {
                    title: "烟度",
                    align: "center",
                    type: "G",
                    children: [
                        {
                            title: "100%点",
                            align: "center",
                            children: [
                                {
                                    title: "实测值",
                                    key: "ER100",
                                    align: "center",
                                    width: 120,
                                },
                                {
                                    title: "限值",
                                    key: "EL",
                                    align: "center",
                                    width: 120,
                                },
                            ],
                        },
                        {
                            title: "80%点",
                            align: "center",
                            children: [
                                {
                                    title: "实测值",
                                    key: "ER80",
                                    align: "center",
                                    width: 120,
                                },
                                {
                                    title: "限值",
                                    key: "EL",
                                    align: "center",
                                    width: 120,
                                },
                            ],
                        },
                    ],
                },
                {
                    title: "氮氧化物NOx80%点",
                    align: "center",
                    type: "G",
                    children: [
                        {
                            title: "实测值",
                            key: "NOX80",
                            align: "center",
                            width: 110,
                        },
                        {
                            title: "限值",
                            key: "NOXEL",
                            align: "center",
                            width: 110,
                        },
                    ],
                },
                {
                    title: "检测结果",
                    key: "LDED",
                    align: "center",
                    type: "G",
                    width: 100,
                    render: (h, params) => {
                        let str = "";
                        if (params.row.LDED == 1) {
                            str = "合格";
                        } else {
                            str = "不合格";
                        }
                        return h("span", str);
                    },
                },
                {
                    title: "明显可见烟度",
                    key: "VisibleSmoke",
                    align: "center",
                    type: "J",
                },
                {
                    title: "林格曼黑度（级）",
                    key: "LingmanRank",
                    align: "center",
                    type: "J",
                },
                {
                    title: "检测结果",
                    key: "LGMED",
                    align: "center",
                    type: "J",
                    width: 100,
                    render: (h, params) => {
                        let str = "";
                        if (params.row.LGMED == 1) {
                            str = "合格";
                        } else {
                            str = "不合格";
                        }
                        return h("span", str);
                    },
                },
                {
                    title: "过量空气系数（λ）",
                    align: "center",
                    type: "A",
                    children: [
                        {
                            title: "实测值",
                            key: "EACR",
                            align: "center",
                        },
                        {
                            title: "限值",
                            key: "EACL",
                            align: "center",
                        },
                    ],
                },
                {
                    title: "低怠速",
                    align: "center",
                    type: "A",
                    children: [
                        {
                            title: "CO/%",
                            align: "center",
                            children: [
                                {
                                    title: "实测值",
                                    key: "LICOR",
                                    align: "center",
                                },
                                {
                                    title: "限值",
                                    key: "LICOL",
                                    align: "center",
                                },
                            ],
                        },
                        {
                            title: "HC/10^-6",
                            align: "center",
                            children: [
                                {
                                    title: "实测值",
                                    key: "LIHCR",
                                    align: "center",
                                },
                                {
                                    title: "限值",
                                    key: "LIHCL",
                                    align: "center",
                                },
                            ],
                        },
                    ],
                },
                {
                    title: "高怠速",
                    align: "center",
                    type: "A",
                    children: [
                        {
                            title: "CO/%",
                            align: "center",
                            children: [
                                {
                                    title: "实测值",
                                    key: "HICOR",
                                    align: "center",
                                },
                                {
                                    title: "限值",
                                    key: "HICOL",
                                    align: "center",
                                },
                            ],
                        },
                        {
                            title: "HC/10^-6",
                            align: "center",
                            children: [
                                {
                                    title: "实测值",
                                    key: "HIHCR",
                                    align: "center",
                                },
                                {
                                    title: "限值",
                                    key: "HIHCL",
                                    align: "center",
                                },
                            ],
                        },
                    ],
                },
                {
                    title: "检测结果",
                    key: "TSIED",
                    align: "center",
                    type: "A",
                    width: 100,
                    render: (h, params) => {
                        let str = "";
                        if (params.row.TSIED == 1) {
                            str = "合格";
                        } else {
                            str = "不合格";
                        }
                        return h("span", str);
                    },
                },
                {
                    title: "HC/（g/km）实测值",
                    key: "HCER",
                    align: "center",
                    type: "C",
                },
                {
                    title: "HC/（g/km）限值",
                    key: "HCEL",
                    align: "center",
                    type: "C",
                },
                {
                    title: "CO/（g/km）实测值",
                    key: "COER",
                    align: "center",
                    type: "C",
                },
                {
                    title: "CO/（g/km）限值",
                    key: "COEL",
                    align: "center",
                    type: "C",
                },
                {
                    title: "NOx/（g/km）实测值",
                    key: "NOXER",
                    align: "center",
                    type: "C",
                },
                {
                    title: "NOx/（g/km）限值",
                    key: "NOXEL",
                    align: "center",
                    type: "C",
                },
                {
                    title: "检测结果",
                    key: "IMED",
                    align: "center",
                    type: "C",
                    width: 100,
                    render: (h, params) => {
                        let str = "";
                        if (params.row.IMED == 1) {
                            str = "合格";
                        } else {
                            str = "不合格";
                        }
                        return h("span", str);
                    },
                },
                {
                    title: "ASM5025",
                    align: "center",
                    type: "B",
                    children: [
                        {
                            title: "HC/10^-6",
                            align: "center",
                            children: [
                                {
                                    title: "实测值",
                                    key: "HCER5025",
                                    align: "center",
                                },
                                {
                                    title: "限值",
                                    key: "HCEL5025",
                                    align: "center",
                                },
                            ],
                        },
                        {
                            title: "CO/%",
                            align: "center",
                            children: [
                                {
                                    title: "实测值",
                                    key: "COER5025",
                                    align: "center",
                                },
                                {
                                    title: "限值",
                                    key: "COEL5025",
                                    align: "center",
                                },
                            ],
                        },
                        {
                            title: "NO/10^-6",
                            align: "center",
                            children: [
                                {
                                    title: "实测值",
                                    key: "NOER5025",
                                    align: "center",
                                },
                                {
                                    title: "限值",
                                    key: "NOEL5025",
                                    align: "center",
                                },
                            ],
                        },
                    ],
                },
                {
                    title: "ASM2540",
                    align: "center",
                    type: "B",
                    children: [
                        {
                            title: "HC/10^-6",
                            align: "center",
                            children: [
                                {
                                    title: "实测值",
                                    key: "HCER2540",
                                    align: "center",
                                },
                                {
                                    title: "限值",
                                    key: "HCEL2540",
                                    align: "center",
                                },
                            ],
                        },
                        {
                            title: "CO/%",
                            align: "center",
                            children: [
                                {
                                    title: "实测值",
                                    key: "COER2540",
                                    align: "center",
                                },
                                {
                                    title: "限值",
                                    key: "COEL2540",
                                    align: "center",
                                },
                            ],
                        },
                        {
                            title: "NO/10^-6",
                            align: "center",
                            children: [
                                {
                                    title: "实测值",
                                    key: "NOER2540",
                                    align: "center",
                                },
                                {
                                    title: "限值",
                                    key: "NOEL2540",
                                    align: "center",
                                },
                            ],
                        },
                    ],
                },
                {
                    title: "检测结果",
                    key: "ASMED",
                    align: "center",
                    type: "B",
                    width: 100,
                    render: (h, params) => {
                        let str = "";
                        if (params.row.ASMED == 1) {
                            str = "合格";
                        } else {
                            str = "不合格";
                        }
                        return h("span", str);
                    },
                },
            ],
            tableDataList: [],
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.getCaliData();
            this.getDetectResultData();
        });
    },
    watch: {},
    methods: {
        // 获取最新标定信息数据
        getCaliData() {
            let self = this;
            this.$curl
                .get("api/hj/getLineInfo", {
                    params: JSON.stringify(this.SceneInfo),
                })
                .then((res) => {
                    self.tabData = self.returnName(
                        res.resultData,
                        self.stationList
                    );
                });
        },
        // 获取检测结果信息数据
        async getDetectResultData() {
            await this.$curl
                .get("api/hj/getLineDetectonResult", {
                    params: JSON.stringify(this.SceneInfo),
                })
                .then((res) => {
                    let self = this;
                    let otherColunms = [
                        {
                            title: "检测编码",
                            key: "InspectionNum",
                            align: "center",
                            width: 255,
                        },
                        {
                            title: "检测结束时间",
                            key: "DetectEndTime",
                            align: "center",
                            width: 175,
                        },
                    ];
                    let { state, result } = res;
                    if (state) {
                        self.tableDataList = result.map((item) => {
                            // item.data.forEach(itemi=>{
                            //   itemi.InspectionNum='...'+itemi.InspectionNum.substr(10)
                            // })
                            item.columns = [
                                ...otherColunms,
                                ...self.columnsList.filter(
                                    (itemc) => itemc.type == item.type
                                ),
                            ];
                            item.name = self.returnMethodName(
                                self.methodList,
                                item.type
                            );
                            return item;
                        });
                    }
                });
        },
        // 数据过滤
        returnName(sourceData, filterData) {
            return sourceData.map((item) => {
                filterData.forEach((e) => {
                    if (item.StationCode == e.CodeValue)
                        item.StationName = e.CodeName;
                });
                return item;
            });
        },
        // 方法名称过滤
        returnMethodName(methodList, type) {
            let name = ``;
            methodList.forEach((item) => {
                if (item.CodeValue == type) name = item.CodeName;
            });
            return name;
        },
    },
};
</script>
<style lang="scss">
.fx-thema.light {
    .scene_content .ivu-table-header th {
        background-color: #f8f8f9;
    }
}
</style>
<style lang="scss" scoped>
.scene_content {
    .item_content {
        margin-bottom: 5px;
    }
}
</style>