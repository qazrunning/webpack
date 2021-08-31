<template>
    <div style="overflow: auto">
        <table
            border="1"
            style="border-collapse: collapse; margin: 0 auto 40px"
        >
            <caption style="fontsize: 40px; color: #19be6b">
                {{
                    inspecMethod
                }}
            </caption>
            <tbody v-if="selectData.length">
                <tr v-for="(item, index) in columns" :key="index">
                    <th
                        style="padding: 12px"
                        v-if="
                            item.type == true || item.type == inspectionMethod
                        "
                    >
                        {{ item.title }}
                    </th>
                    <td
                        v-for="(e, id) in dataList"
                        :key="id"
                        v-if="
                            item.type == true || item.type == inspectionMethod
                        "
                        style="padding: 12px"
                    >
                        <template v-if="item.key == 'DetectEndTime'">{{
                            formatTime(e.DetectEndTime)
                        }}</template>
                        <template v-else>{{
                            toFlostTwo(e[item.key])
                        }}</template>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    props: {
        selectData: { type: Array },
        tableAll: { type: Array },
        cddata: { type: Object },
    },
    mounted() {
        this.getData();
    },
    data() {
        return {
            columns: [
                // {
                //     title: "站点编号",
                //     key: "InspectionNum",
                //     type: true,

                // },
                {
                    title: "检测站点",
                    key: "StationCode",
                    type: true,
                },
                {
                    title: "检测日期",
                    key: "DetectEndTime",
                    type: true,
                },
                // {
                //     title: "检测方式",
                //     key: "InspectionWay",
                //     type: true,

                // },
                {
                    title: "检测类型",
                    key: "InspectionWay",
                    type: true,
                },
                // {
                //     title: "燃油类型",
                //     key: "FuelType",
                //     type: true,
                // },
                {
                    title: "额定转速(r/min)",
                    key: "EngineRatedSpeed",
                    type: "F",
                },
                {
                    title: "实测转速(r/min)",
                    key: "ActualRotateSpeed",
                    type: "F",
                },
                {
                    title: "最后第一次测量值(1/m)",
                    key: "ER1",
                    type: "F",
                },
                {
                    title: "最后第二次测量值(1/m)",
                    key: "ER2",
                    type: "F",
                },
                {
                    title: "最后第三次测量值(1/m)",
                    key: "ER3",
                    type: "F",
                },
                {
                    title: "平均值(1/m)",
                    key: "ERA",
                    type: "F",
                },
                {
                    title: "限值(1/m)",
                    key: "EL",
                    type: "F",
                },
                {
                    title: "转速额定转速",
                    key: "EngineRatedSpeed",
                    type: "G",
                },
                {
                    title: "转速实测（修正）VelMaxHP",
                    key: "VelMaxHP",
                    type: "G",
                },
                {
                    title: "最大轮边功率实测kW",
                    key: "VelMaxEnginePower",
                    type: "G",
                },
                {
                    title: "烟度100%点实测值",
                    key: "ER100",
                    type: "G",
                },
                {
                    title: "烟度100%点限值",
                    key: "EL",
                    type: "G",
                },
                {
                    title: "烟度80%点实测值",
                    key: "ER80",
                    type: "G",
                },
                {
                    title: "烟度80%点限值",
                    key: "EL",
                    type: "G",
                },
                {
                    title: "氮氧化物NOx80%点实测值",
                    key: "NOX80",
                    type: "G",
                },
                {
                    title: "氮氧化物NOx80%点限值",
                    key: "NOXEL",
                    type: "G",
                },
                {
                    title: "明显可见烟度",
                    key: "VisibleSmoke",
                    type: "J",
                },
                {
                    title: "林格曼黑度（级）",
                    key: "LingmanRank",
                    type: "J",
                },
                {
                    title: "过量空气系数（λ）实测值",
                    key: "EACR",
                    type: "A",
                },
                {
                    title: "过量空气系数（λ）限值",
                    key: "EACL",
                    type: "A",
                },
                {
                    title: "低怠速CO（%）实测值",
                    key: "LICOR",
                    type: "A",
                },
                {
                    title: "低怠速CO（%）限值",
                    key: "LICOL",
                    type: "A",
                },
                {
                    title: "低怠速HC（1/10^6）实测值",
                    key: "LIHCR",
                    type: "A",
                },
                {
                    title: "低怠速HC（1/10^6）限值",
                    key: "LIHCL",
                    type: "A",
                },
                {
                    title: "高怠速CO（%）实测值",
                    key: "HICOR",
                    type: "A",
                },
                {
                    title: "高怠速CO（%）限值",
                    key: "HICOL",
                    type: "A",
                },
                {
                    title: "高怠速HC（1/10^6）实测值",
                    key: "HIHCR",
                    type: "A",
                },
                {
                    title: "高怠速HC（1/10^6）限值",
                    key: "HIHCL",
                    type: "A",
                },
                {
                    title: "HC/（g/km）实测值",
                    key: "HCER",
                    type: "C",
                },
                {
                    title: "HC/（g/km）限值",
                    key: "HCEL",
                    type: "C",
                },
                {
                    title: "CO/（g/km）实测值",
                    key: "COER",
                    type: "C",
                },
                {
                    title: "CO/（g/km）限值",
                    key: "COEL",
                    type: "C",
                },
                {
                    title: "NOx/（g/km）实测值",
                    key: "NOXER",
                    type: "C",
                },
                {
                    title: "NOx/（g/km）限值",
                    key: "NOXEL",
                    type: "C",
                },
                {
                    title: "ASM5025(HC/ 10^-6)实测值",
                    key: "HCER5025",
                    type: "B",
                },
                {
                    title: "ASM5025(HC/ 10^-6)限值",
                    key: "HCEL5025",
                    type: "B",
                },
                {
                    title: "ASM5025(CO/%)实测值",
                    key: "COER5025",
                    type: "B",
                },
                {
                    title: "ASM5025(CO/%)限值",
                    key: "COEL5025",
                    type: "B",
                },
                {
                    title: "ASM5025(NO/10^-6)实测值",
                    key: "NOER5025",
                    type: "B",
                },
                {
                    title: "ASM5025(NO/10^-6)限值",
                    key: "NOEL5025",
                    type: "B",
                },
                {
                    title: "ASM2540(HC/10^-6)实测值",
                    key: "HCER2540",
                    type: "B",
                },
                {
                    title: "ASM2540(HC/10^-6)限值",
                    key: "HCEL2540",
                    type: "B",
                },
                {
                    title: "ASM2540(CO/%)实测值",
                    key: "COER2540",
                    type: "B",
                },
                {
                    title: "ASM2540(CO/%)限值",
                    key: "COEL2540",
                    type: "B",
                },
                {
                    title: "ASM2540(NO/10^-6)实测值",
                    key: "NOER2540",
                    type: "B",
                },
                {
                    title: "ASM2540(NO/10^-6)限值",
                    key: "NOEL2540",
                    type: "B",
                },
            ],
            wayData: [], // 方法数据
            inspectionMethod: "", // 方法
        };
    },
    computed: {
        dataList: function () {
            this.wayData.forEach((item, index) => {
                if (this.selectData[index]) {
                    item.InspectionWay = this.returncodenames(
                        this.cddata.CD_InspectionWay,
                        this.selectData[index].InspectionWay
                    );
                    item.StationCode = this.returncodenames(
                        this.cddata.StationInfo,
                        item.StationCode
                    );
                }
            });
            console.log(this.wayData);
            return this.wayData;
        },
        inspecMethod: function () {
            return this.returncodenames(
                this.cddata.CD_InspectionMethod,
                this.inspectionMethod
            );
        },
    },
    watch: {
        selectData() {
            this.getData();
        },
    },
    methods: {
        formatTime(time) {
            return this.$options.filters.dataFormat(
                time,
                "yyyy-MM-dd hh:mm:ss"
            );
        },
        toFlostTwo(value) {
            if (value == null) return "-";
            if (typeof value == "string") return value;
            value = Number(value).toFixed(2);
            return value;
        },
        getData() {
            let InspectionNum = [];
            let inspectionMethod = "";
            this.selectData.forEach((item) => {
                InspectionNum.push(item.InspectionNum);
                inspectionMethod = item.IUTYPE;
            });
            this.inspectionMethod = inspectionMethod;
            this.$curl
                .get("api/hj/getInspectionMethodData", {
                    params: { InspectionNum, inspectionMethod },
                })
                .then((res) => {
                    if (res.state) {
                        // console.log(res.result)
                        this.wayData = res.result;
                    }
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
    },
};
</script>

<style>
</style>