//检测线表单
<template>
    <Form
        ref="formCustom"
        :model="formItem"
        :rules="ruleValidate"
        :label-width="isPc ? 150 : null"
        :label-position="isPc ? 'right' : 'top'"
    >
        <Row :gutter="16">
            <i-col :xs="24" :sm="12" :lg="12">
                <FormItem label="检测线编号：" prop="SceneCode">
                    <i-input
                        :readonly="readonlykey"
                        v-model="formItem.SceneCode"
                        placeholder="请输入"
                        clearable
                    ></i-input>
                </FormItem>
            </i-col>
            <i-col :xs="24" :sm="12" :lg="12">
                <FormItem label="检测线类型：" prop="LineType">
                    <Select v-model="formItem.LineType" clearable>
                        <Option
                            v-for="item in LineTypes"
                            :value="item.CodeValue"
                            :key="item.CodeValue"
                            >{{ item.CodeName }}</Option
                        >
                    </Select>
                </FormItem>
            </i-col>
            <i-col :xs="24" :sm="12" :lg="12">
                <FormItem label="检测线状态：" prop="LineStatus">
                    <Select v-model="formItem.LineStatus" clearable>
                        <Option
                            v-for="item in LineStatus"
                            :value="item.CodeValue"
                            :key="item.CodeValue"
                            >{{ item.CodeName }}</Option
                        >
                    </Select>
                </FormItem>
            </i-col>
            <i-col :xs="24" :sm="12" :lg="12">
                <FormItem label="设备标定有效期：" prop="ValidPeriod">
                    <DatePicker
                        type="date"
                        :editable="false"
                        format="yyyy-MM-dd"
                        v-model="formItem.ValidPeriod"
                        style="width: 100%"
                        placeholder="设备标定有效期"
                        clearable
                    ></DatePicker>
                </FormItem>
            </i-col>
            <i-col :xs="24" :sm="12" :lg="12">
                <FormItem label="创建日期：" prop="DateCreated">
                    <DatePicker
                        type="date"
                        :editable="false"
                        format="yyyy-MM-dd HH:mm:ss"
                        v-model="formItem.DateCreated"
                        style="width: 100%"
                        placeholder="创建日期"
                        clearable
                    ></DatePicker>
                </FormItem>
            </i-col>
            <i-col :xs="24" :sm="12" :lg="12">
                <FormItem label="检测线设备厂商：" prop="LineMANU">
                    <i-input
                        v-model="formItem.LineMANU"
                        placeholder="请输入"
                        clearable
                    ></i-input>
                </FormItem>
            </i-col>
            <i-col :xs="24" :sm="12" :lg="12">
                <FormItem label="检测线附件：" prop="LineAccessory">
                    <i-input
                        v-model="formItem.LineAccessory"
                        placeholder="请输入"
                        clearable
                    ></i-input>
                </FormItem>
            </i-col>
            <i-col :xs="24" :sm="12" :lg="12">
                <FormItem label="负责人：" prop="PersonInCharge">
                    <i-input
                        v-model="formItem.PersonInCharge"
                        placeholder="请输入"
                        clearable
                    ></i-input>
                </FormItem>
            </i-col>
            <i-col :xs="24" :sm="12" :lg="12">
                <FormItem label="机构编号：" prop="TsNo">
                    <i-input
                        v-model="formItem.TsNo"
                        placeholder="请输入"
                        clearable
                    ></i-input>
                </FormItem>
            </i-col>
            <i-col :xs="24" :sm="12" :lg="12">
                <FormItem label="底盘测功机型号：" prop="Dynamometer">
                    <i-input
                        v-model="formItem.Dynamometer"
                        placeholder="请输入"
                        clearable
                    ></i-input>
                </FormItem>
            </i-col>
            <i-col :xs="24" :sm="12" :lg="12">
                <FormItem label="底盘测功机制造厂：" prop="DProvider">
                    <i-input
                        v-model="formItem.DProvider"
                        placeholder="请输入"
                        clearable
                    ></i-input>
                </FormItem>
            </i-col>
            <i-col :xs="24" :sm="12" :lg="12">
                <FormItem label="气体分析仪型号：" prop="Analyser">
                    <i-input
                        v-model="formItem.Analyser"
                        placeholder="请输入"
                        clearable
                    ></i-input>
                </FormItem>
            </i-col>
            <i-col :xs="24" :sm="12" :lg="12">
                <FormItem label="气体分析仪制造厂:" prop="AProvider">
                    <i-input
                        v-model="formItem.AProvider"
                        placeholder="请输入"
                    ></i-input>
                </FormItem>
            </i-col>
            <i-col :xs="24" :sm="12" :lg="12">
                <FormItem label="流量计型号：" prop="Flowmeter">
                    <i-input
                        v-model="formItem.Flowmeter"
                        placeholder="请输入"
                        clearable
                    ></i-input>
                </FormItem>
            </i-col>
            <i-col :xs="24" :sm="12" :lg="12">
                <FormItem label="流量计制造厂：" prop="FProvider">
                    <i-input
                        v-model="formItem.FProvider"
                        placeholder="请输入"
                        clearable
                    ></i-input>
                </FormItem>
            </i-col>
            <i-col :xs="24" :sm="12" :lg="12">
                <FormItem label="烟度计型号：" prop="Smokemeter">
                    <i-input
                        v-model="formItem.Smokemeter"
                        placeholder="请输入"
                        clearable
                    ></i-input>
                </FormItem>
            </i-col>
            <i-col :xs="24" :sm="12" :lg="12">
                <FormItem label="烟度计制造厂：" prop="SProvider">
                    <i-input
                        v-model="formItem.SProvider"
                        placeholder="请输入"
                        clearable
                    ></i-input>
                </FormItem>
            </i-col>
            <i-col :xs="24" :sm="12" :lg="12">
                <FormItem label="转速计型号：" prop="Tachometer">
                    <i-input
                        v-model="formItem.Tachometer"
                        placeholder="请输入"
                        clearable
                    ></i-input>
                </FormItem>
            </i-col>
            <i-col :xs="24" :sm="12" :lg="12">
                <FormItem label="转速计制造厂：" prop="TProvider">
                    <i-input
                        v-model="formItem.TProvider"
                        placeholder="请输入"
                        clearable
                    ></i-input>
                </FormItem>
            </i-col>
            <i-col :xs="24" :sm="12" :lg="12">
                <FormItem label="油温传感器型号：" prop="OTSensor">
                    <i-input
                        v-model="formItem.OTSensor"
                        placeholder="请输入"
                        clearable
                    ></i-input>
                </FormItem>
            </i-col>
            <i-col :xs="24" :sm="12" :lg="12">
                <FormItem label="油温传感器制造厂：" prop="OProvider">
                    <i-input
                        v-model="formItem.OProvider"
                        placeholder="请输入"
                        clearable
                    ></i-input>
                </FormItem>
            </i-col>

            <i-col :xs="24" :sm="12" :lg="12">
                <FormItem label="OBD诊断仪型号:" prop="OBDType">
                    <i-input
                        v-model="formItem.OBDType"
                        placeholder="请输入"
                        clearable
                    ></i-input>
                </FormItem>
            </i-col>
            <i-col :xs="24" :sm="12" :lg="12">
                <FormItem label="OBD诊断仪生产厂：" prop="OBDProvider">
                    <i-input
                        v-model="formItem.OBDProvider"
                        placeholder="请输入"
                        clearable
                    ></i-input>
                </FormItem>
            </i-col>
            <i-col :xs="24" :sm="12" :lg="12">
                <FormItem label="氮氧化物分析仪型号：" prop="NOAnalyzerType">
                    <i-input
                        v-model="formItem.NOAnalyzerType"
                        placeholder="请输入"
                        clearable
                    ></i-input>
                </FormItem>
            </i-col>
            <i-col :xs="24" :sm="12" :lg="12">
                <FormItem
                    label="氮氧化物分析仪生产厂："
                    prop="NOAnalyzerProvider"
                >
                    <i-input
                        v-model="formItem.NOAnalyzerProvider"
                        placeholder="请输入"
                        clearable
                    ></i-input>
                </FormItem>
            </i-col>
            <i-col :xs="24" :sm="12" :lg="12">
                <FormItem label="备注：" prop="Remark">
                    <i-input
                        v-model="formItem.Remark"
                        placeholder="请输入"
                        clearable
                    ></i-input>
                </FormItem>
            </i-col>
        </Row>
    </Form>
</template>
<script>
import { formatDates } from "../../../utils/utils";
export default {
    props: {
        LineTypes: {
            type: Array,
            default: [],
        },
        LineStatus: {
            type: Array,
            default: [],
        },
        formItem: {
            type: Object,
            default: {},
        },
    },
    data() {
        return {
            firstDate: {},
            readonlykey: true,
            saveData: {}, // 保存数据用于判断是否修改
            changeData: ["LineType", "LineStatus", "ValidPeriod"], // 需要修改的数据监控
            isPc: this.$app.helper.screen.isPC, //判断是pc还是手机
            ruleValidate: {
                LineType: [
                    {
                        required: true,
                        message: "检测线类型不能为空",
                        trigger: "blur",
                    },
                ],
                LineStatus: [
                    {
                        required: true,
                        message: "站点名称不能为空",
                        trigger: "blur",
                    },
                ],
                SceneCode: [
                    {
                        required: true,
                        message: "检测线编号不能为空",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    methods: {
        HandleSubmit(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$emit("validStatus", true);
                } else {
                    this.$emit("validStatus", false);
                    this.$Notice.warning({
                        title: "请填写必填信息！",
                    });
                    return;
                }
            });
            this.judgeDataChange(this.saveData, true);
        },
        judgeDataChange(value, post) {
            this.readonlykey = true;
            if (!value.SceneCode) {
                this.readonlykey = false;
            }
            this.saveData = value;
            if (post)
                if (this.formItem) {
                    let filterData = this.changeData.filter((item) => {
                        if (item == "ValidPeriod")
                            return (
                                formatDates(
                                    this.saveData.ValidPeriod,
                                    "yyyy-MM-dd"
                                ) !=
                                formatDates(
                                    this.formItem.ValidPeriod,
                                    "yyyy-MM-dd"
                                )
                            );
                        else return this.saveData[item] != this.formItem[item];
                    });
                    let DataSource = [];
                    if (filterData.length) {
                        filterData.forEach((item) => {
                            DataSource.push(
                                `{old: ${this.saveData[item]}, new: ${this.formItem[item]}, field: ${item}}`
                            );
                        });
                        let DataTable = "LineInfo";
                        this.$curl.post("api/hj/dataChangeLog", {
                            params: {
                                DataSource,
                                DataTable,
                            },
                        });
                    }
                }
        },
    },
    watch: {
        // 'firstDate.SceneCode':{
        //       handler (newValue,oldValue) {
        //           if(newValue==undefined){//判断是否有值
        //             this.readonlykey=false
        //             console.log(newValue,this.firstDate)
        //           }else{
        //             this.readonlykey=true
        //             console.log(newValue,this.firstDate)
        //           }
        //       },
        //       deep:true,
        //       immediate:true
        //   },
    },
    mounted() {},
};
</script>
<style scoped>
</style>