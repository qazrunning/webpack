//站点信息表单
<template>
    <div class="station">
        <Form
            ref="formCustom"
            :model="formItem"
            :rules="ruleValidate"
            :label-width="isPc ? 140 : null"
            :label-position="isPc ? 'right' : 'top'"
        >
            <Divider orientation="left">主要信息</Divider>
            <Row :gutter="16">
                <i-col :xs="24" :sm="12" :lg="6">
                    <FormItem label="检测站编号：" prop="StationCode">
                        <i-input
                            :disabled="!isAddStation"
                            v-model="formItem.StationCode"
                            placeholder="请输入"
                            clearable
                        ></i-input>
                    </FormItem>
                </i-col>
                <i-col :xs="24" :sm="12" :lg="6">
                    <FormItem label="检测站名称：" prop="IUSTA">
                        <i-input
                            v-model="formItem.IUSTA"
                            placeholder="请输入"
                            clearable
                        ></i-input>
                    </FormItem>
                </i-col>
                <i-col :xs="24" :sm="12" :lg="6">
                    <FormItem label="检测站简称：" prop="StationName">
                        <i-input
                            v-model="formItem.StationName"
                            placeholder="请输入"
                            clearable
                        ></i-input>
                    </FormItem>
                </i-col>
                <i-col :xs="24" :sm="12" :lg="6">
                    <FormItem label="检测站状态：" prop="StationStatus">
                        <Select
                            style="width: 100%"
                            v-model="formItem.StationStatus"
                            clearable
                        >
                            <Option
                                v-for="item in statusList"
                                :value="item.value"
                                :key="item.value"
                                >{{ item.label }}</Option
                            >
                        </Select>
                    </FormItem>
                </i-col>
                <i-col :xs="24" :sm="12" :lg="6">
                    <FormItem label="法人：" prop="FaRen">
                        <i-input
                            v-model="formItem.FaRen"
                            placeholder="请输入"
                            clearable
                        ></i-input>
                    </FormItem>
                </i-col>
                <i-col :xs="24" :sm="12" :lg="6">
                    <FormItem label="联系人：" prop="LinkMan">
                        <i-input
                            v-model="formItem.LinkMan"
                            placeholder="请输入"
                            clearable
                        ></i-input>
                    </FormItem>
                </i-col>
                <i-col :xs="24" :sm="12" :lg="6">
                    <FormItem label="联系电话：">
                        <i-input
                            v-model="formItem.Tel"
                            placeholder="请输入"
                            clearable
                        ></i-input>
                    </FormItem>
                </i-col>
                <i-col :xs="24" :sm="12" :lg="6">
                    <FormItem label="检测线总数：">
                        <i-input
                            v-model="formItem.LineCount"
                            type="number"
                            placeholder="请输入"
                            clearable
                        ></i-input>
                    </FormItem>
                </i-col>
                <i-col :xs="24" :sm="12" :lg="6">
                    <FormItem label="检测站纬度：" prop="PosY">
                        <i-input
                            type="number"
                            v-model="formItem.PosY"
                            placeholder="请输入"
                            clearable
                        ></i-input>
                    </FormItem>
                </i-col>
                <i-col :xs="24" :sm="12" :lg="6">
                    <FormItem label="检测站经度：" prop="PosX">
                        <i-input
                            type="number"
                            v-model="formItem.PosX"
                            placeholder="请输入"
                        ></i-input>
                    </FormItem>
                </i-col>
                <i-col :xs="24" :sm="12" :lg="12">
                    <FormItem label="地址：" prop="Address">
                        <i-input
                            v-model="formItem.Address"
                            placeholder="请输入"
                            clearable
                        ></i-input>
                    </FormItem>
                </i-col>
                <i-col :xs="24" :sm="12" :lg="12">
                    <FormItem label="读取视频和照片的URL:" prop="ImageMediaUrl">
                        <i-input
                            v-model="formItem.ImageMediaUrl"
                            placeholder="请输入"
                            clearable
                        ></i-input>
                    </FormItem>
                </i-col>
                <i-col :xs="24" :sm="12" :lg="6">
                    <FormItem label="城市" prop="CityCode">
                        <Select
                            style="width: 100%"
                            v-model="formItem.CityCode"
                            @on-change="selectCity(formItem.CityCode)"
                            clearable
                        >
                            <Option
                                v-for="item in CityOption"
                                :value="item.AreaCode"
                                :key="item.value"
                                >{{ item.AreaName }}</Option
                            >
                        </Select>
                    </FormItem>
                </i-col>
                <i-col :xs="24" :sm="12" :lg="6">
                    <FormItem label="区县" prop="AreaCode">
                        <Select
                            style="width: 100%"
                            v-model="formItem.AreaCode"
                            clearable
                        >
                            <Option
                                v-for="item in AreaOption"
                                :value="item.AreaCode"
                                :key="item.value"
                                >{{ item.AreaName }}</Option
                            >
                        </Select>
                    </FormItem>
                </i-col>
            </Row>
            <Divider orientation="left">基本信息</Divider>
            <Row>
                <i-col :xs="24" :sm="12" :lg="6">
                    <FormItem label="检测服务器IP：">
                        <i-input
                            v-model="formItem.ServiceIP"
                            placeholder="请输入"
                            clearable
                        ></i-input>
                    </FormItem>
                </i-col>
                <i-col :xs="24" :sm="12" :lg="6">
                    <FormItem label="注册时间：">
                        <DatePicker
                            :editable="false"
                            type="date"
                            format="yyyy-MM-dd"
                            v-model="formItem.RegisterDate"
                            style="width: 100%"
                            placeholder="注册时间"
                            clearable
                        ></DatePicker>
                    </FormItem>
                </i-col>
                <i-col :xs="24" :sm="12" :lg="6">
                    <FormItem label="邮政编码：">
                        <i-input
                            type="number"
                            v-model="formItem.PostCode"
                            placeholder="请输入"
                            clearable
                        ></i-input>
                    </FormItem>
                </i-col>
                <i-col :xs="24" :sm="12" :lg="6">
                    <FormItem label="传真：">
                        <i-input
                            v-model="formItem.Fax"
                            placeholder="请输入"
                            clearable
                        ></i-input>
                    </FormItem>
                </i-col>
                <i-col :xs="24" :sm="12" :lg="6">
                    <FormItem label="Email:" prop="Email">
                        <i-input
                            v-model="formItem.Email"
                            placeholder="请输入"
                            clearable
                        ></i-input>
                    </FormItem>
                </i-col>
                <i-col :xs="24" :sm="12" :lg="6">
                    <FormItem label="移动电话：" prop="MobilePhone">
                        <i-input
                            v-model="formItem.MobilePhone"
                            placeholder="请输入"
                            clearable
                        ></i-input>
                    </FormItem>
                </i-col>
                <i-col :xs="24" :sm="12" :lg="6">
                    <FormItem label="委托有效期：">
                        <DatePicker
                            :editable="false"
                            type="date"
                            format="yyyy-MM-dd"
                            v-model="formItem.EntrustDate"
                            style="width: 100%"
                            placeholder="委托有效期"
                            clearable
                        ></DatePicker>
                    </FormItem>
                </i-col>
                <i-col :xs="24" :sm="12" :lg="6">
                    <FormItem label="委托日期：">
                        <DatePicker
                            :editable="false"
                            type="date"
                            format="yyyy-MM-dd"
                            v-model="formItem.AuthDate"
                            style="width: 100%"
                            clearable
                        ></DatePicker>
                    </FormItem>
                </i-col>
                <i-col :xs="24" :sm="12" :lg="6">
                    <FormItem label="过期时间：">
                        <DatePicker
                            :editable="false"
                            type="date"
                            format="yyyy-MM-dd"
                            v-model="formItem.Deadline"
                            style="width: 100%"
                            clearable
                        ></DatePicker>
                    </FormItem>
                </i-col>
                <i-col :xs="24" :sm="12" :lg="6">
                    <FormItem label="机构编号：">
                        <i-input
                            v-model="formItem.TsNo"
                            placeholder="请输入"
                            clearable
                        ></i-input>
                    </FormItem>
                </i-col>
                <i-col :xs="24" :sm="12" :lg="6">
                    <FormItem label="委托证书编号：">
                        <i-input
                            v-model="formItem.AuthCode"
                            placeholder="请输入"
                            clearable
                        ></i-input>
                    </FormItem>
                </i-col>
                <i-col :xs="24" :sm="12" :lg="6">
                    <FormItem label="首次环检委托时间：">
                        <DatePicker
                            :editable="false"
                            type="date"
                            format="yyyy-MM-dd"
                            v-model="formItem.FirstCheckEntrustDate"
                            style="width: 100%"
                            placeholder="首次环检委托时间"
                            clearable
                        ></DatePicker>
                    </FormItem>
                </i-col>
                <i-col :xs="24" :sm="12" :lg="6">
                    <FormItem label="是否同时承担安检：">
                        <Select v-model="formItem.IsAssumeSafeCheck" clearable>
                            <Option :value="1">是</Option>
                            <Option :value="0">否</Option>
                        </Select>
                    </FormItem>
                </i-col>
                <i-col :xs="24" :sm="12" :lg="6">
                    <FormItem label="是否同时承担综检：">
                        <Select
                            v-model="formItem.IsAssumeSynthesizeCheck"
                            clearable
                        >
                            <Option :value="1">是</Option>
                            <Option :value="0">否</Option>
                        </Select>
                    </FormItem>
                </i-col>
                <i-col :xs="24" :sm="12" :lg="6">
                    <FormItem label="组织机构代码：">
                        <i-input
                            v-model="formItem.OrgCode"
                            placeholder="请输入"
                            clearable
                        ></i-input>
                    </FormItem>
                </i-col>
                <i-col :xs="24" :sm="12" :lg="6">
                    <FormItem label="场地联系电话：" prop="TestTel">
                        <i-input
                            v-model="formItem.TestTel"
                            placeholder="请输入"
                            clearable
                        ></i-input>
                    </FormItem>
                </i-col>
                <i-col :xs="24" :sm="12" :lg="6">
                    <FormItem label="有效期：">
                        <DatePicker
                            :editable="false"
                            type="date"
                            format="yyyy-MM-dd"
                            v-model="formItem.ExpireDate"
                            style="width: 100%"
                            clearable
                        ></DatePicker>
                    </FormItem>
                </i-col>
                <i-col :xs="24" :sm="12" :lg="6">
                    <FormItem label="证件原件：">
                        <i-input
                            v-model="formItem.Cert"
                            placeholder="请输入"
                            clearable
                        ></i-input>
                    </FormItem>
                </i-col>
                <i-col :xs="24" :sm="12" :lg="6">
                    <FormItem label="机构类别：">
                        <i-input
                            v-model="formItem.OrganizationType"
                            placeholder="请输入"
                            clearable
                        ></i-input>
                    </FormItem>
                </i-col>
                <i-col :xs="24" :sm="12" :lg="12">
                    <FormItem label="备注:">
                        <i-input
                            v-model="formItem.Remark"
                            placeholder="请输入"
                            clearable
                        ></i-input>
                    </FormItem>
                </i-col>
            </Row>
            <Divider orientation="left">证件信息</Divider>
            <Row>
                <i-col :xs="24" :sm="12" :lg="6">
                    <FormItem label="证件编号:">
                        <i-input
                            v-model="formItem.CertificateNo"
                            placeholder="请输入"
                            clearable
                        ></i-input>
                    </FormItem>
                </i-col>
                <i-col :xs="24" :sm="12" :lg="6">
                    <FormItem label="原件扫描:">
                        <i-input
                            v-model="formItem.OriginalScan"
                            placeholder="请输入"
                            clearable
                        ></i-input>
                    </FormItem>
                </i-col>
                <i-col :xs="24" :sm="12" :lg="6">
                    <FormItem label="有效日期:">
                        <DatePicker
                            :editable="false"
                            type="date"
                            format="yyyy-MM-dd"
                            v-model="formItem.ExpiryDate"
                            style="width: 100%"
                            clearable
                        ></DatePicker>
                    </FormItem>
                </i-col>
                <i-col :xs="24" :sm="12" :lg="6">
                    <FormItem label="发件日期:">
                        <DatePicker
                            :editable="false"
                            type="date"
                            format="yyyy-MM-dd"
                            v-model="formItem.IssueDate"
                            style="width: 100%"
                            clearable
                        ></DatePicker>
                    </FormItem>
                </i-col>
                <i-col :xs="24" v-show="isAddStation == false">
                    <Tag
                        v-for="(tag, index) in tagList"
                        :key="tag"
                        :name="tag"
                        closable
                        @on-close="handleClose"
                        :color="index % 2 == 0 ? '#81bffc' : '#FDBC4E'"
                        >{{ tag }}</Tag
                    >
                    <span v-show="!formItem.StationTag">&nbsp;</span>
                    <Button
                        icon="ios-add"
                        type="dashed"
                        size="small"
                        @click="handleAdd"
                        >添加标签</Button
                    >
                </i-col>
            </Row>
        </Form>
    </div>
</template>
<script>
import {
    getCDData,
    setRemindAndInsertAudit,
    getStationConfig,
} from "../../../utils/utils";
export default {
    props: {
        StationCode: {
            type: String,
            default: "",
        },
    },
    data() {
        return {
            CityOption: [], //城市
            AreaOption: [], //区域
            isPc: this.$app.helper.screen.isPC, //判断是pc还是手机
            statusList: [
                { value: "正常", label: "正常" },
                { value: "暂停", label: "暂停" },
                { value: "吊销", label: "吊销" },
                { value: "注册", label: "注册" },
                { value: "离线", label: "离线" },
            ], //检测站状态
            formItem: {},
            oldItem: {},
            isAddStation: true, //判断是否为新增站点
            tagList: [],
            ruleValidate: {
                StationCode: [
                    {
                        required: true,
                        message: "站点编码不能为空",
                        trigger: "blur",
                    },
                    {
                        pattern: "([0-9]){8,10}$",
                        message: "请正确输入站点编码！",
                    },
                ],
                IUSTA: [
                    {
                        required: true,
                        message: "站点名称不能为空",
                        trigger: "blur",
                    },
                ],
                StationName: [
                    {
                        required: true,
                        message: "站点简称不能为空",
                        trigger: "blur",
                    },
                ],
                FaRen: [
                    {
                        required: true,
                        message: "法人不能为空",
                        trigger: "blur",
                    },
                ],
                StationStatus: [
                    {
                        required: true,
                        message: "检测站状态不能为空",
                        trigger: "blur",
                    },
                ],
                LinkMan: [
                    {
                        required: true,
                        message: "联系人不能为空",
                        trigger: "blur",
                    },
                ],
                // PosX: [
                //     {
                //         type: "number",
                //         required: true,
                //         message: "检测站纬度不能为空",
                //         trigger: "blur",
                //     },
                // ],
                // PosY: [
                //     {
                //         type: "number",
                //         required: true,
                //         message: "检测站经度不能为空",
                //         trigger: "blur",
                //     },
                // ],
                CityCode: [
                    {
                        required: true,
                        message: "检测站城市不能为空",
                        trigger: "blur",
                    },
                ],
                AreaCode: [
                    {
                        required: true,
                        message: "检测站区县不能为空",
                        trigger: "blur",
                    },
                ],
                Address: [
                    {
                        required: true,
                        message: "地址不能为空",
                        trigger: "blur",
                    },
                ],
                ImageMediaUrl: [
                    {
                        required: true,
                        message: "读取视频和照片的URL不能为空",
                        trigger: "blur",
                    },
                ],
                MobilePhone: [
                    {
                        pattern: /(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^((\(\d{3}\))|(\d{3}\-))?(1[358]\d{9})$)/,
                        message: "号码错误，请重新输入",
                        trigger: "blur",
                    },
                ],
                Tel: [
                    {
                        required: true,
                        message: "联系电话不能为空",
                        trigger: "blur",
                    },
                    {
                        pattern: /(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^((\(\d{3}\))|(\d{3}\-))?(1[358]\d{9})$)/,
                        message: "号码错误，请重新输入",
                        trigger: "blur",
                    },
                ],
                TestTel: [
                    {
                        pattern: /(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^((\(\d{3}\))|(\d{3}\-))?(1[358]\d{9})$)/,
                        message: "号码错误，请重新输入",
                        trigger: "blur",
                    },
                ],
                Email: [
                    {
                        pattern: /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
                        message: "邮箱错误，请重新输入",
                        trigger: "blur",
                    },
                ],
            },
            isOpenAudit: false,
        };
    },
    methods: {
        async getconfig() {
            this.isOpenAudit = await getStationConfig(this);
        },
        //省市联动
        selectCity(value) {
            if (value) {
                if (
                    value.indexOf("0000") == -1 &&
                    value.slice(4, 6).indexOf("00") != -1
                ) {
                    //市
                    this.AreaOption = [];
                    //0000为省，00为市
                    this.Area.forEach((a) => {
                        if (
                            a.AreaCode.indexOf("0000") == -1 &&
                            a.AreaCode.slice(4, 6).indexOf("00") == -1 &&
                            a.AreaCode.slice(0, 4) == value.slice(0, 4) &&
                            a.AreaCode != value
                        ) {
                            this.AreaOption.push(a);
                        }
                    });
                }
            }
        },
        //展示所有下拉框展示数据
        async getOption() {
            const self = this;
            let cdname = [
                {
                    tableName: "Area",
                    columns: "AreaCode,AreaName",
                    where: "",
                },
            ];
            if (self.$getDBTable) {
                let cdList = cdname.map((item) => {
                    return item.tableName;
                });
                await self.$getDBTable(cdList).then((data) => {
                    self.Area = data.map((v) => JSON.parse(v))[0];
                });
            } else {
                getCDData(self, cdname).then((res) => {
                    const { state, data, msg } = res;
                    if (state) {
                        self.Area = data[0];
                    }
                });
            }
        },
        handleClose(event, name) {
            const index = this.tagList.indexOf(name);
            this.tagList.splice(index, 1);
        },
        handleAdd() {
            const self = this;
            this.stationtag_name = "";
            this.$Modal.confirm({
                render: (createElement) => {
                    return createElement("Input", {
                        domProps: {
                            value: self.stationtag_name,
                        },
                        attrs: {
                            autofocus: true,
                            placeholder: "输入标签",
                        },
                        on: {
                            input: (val) => {
                                if (val.target.value.length > 8) {
                                    self.$Notice.warning({
                                        title: "提示",
                                        desc: "标签最长为8个字符 ",
                                    });
                                } else {
                                    self.stationtag_name = val.target.value;
                                }
                            },
                        },
                    });
                },
                onOk: () => {
                    //判断是否存在该标签
                    const hasData = this.tagList.find(
                        (t) => t == self.stationtag_name
                    );
                    if (hasData) {
                        this.$Notice.warning({
                            title: "提示",
                            desc: "已存在该标签",
                        });
                        return;
                    }

                    if (this.tagList.length >= 5) {
                        this.$Notice.warning({
                            title: "提示",
                            desc: "最多只能添加5个标签",
                        });
                        return;
                    }

                    this.tagList.push(this.stationtag_name);
                },
                onCancel: () => {},
            });
        },
        HandleSubmit(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$emit("validStatus", true);
                } else {
                    this.$Notice.warning({
                        title: "请完善基本信息！",
                    });
                    this.$emit("validStatus", false);
                    return;
                }
            });
        },
        async searchStation() {
            const params = {
                StationCode: this.StationCode,
            };
            const result = await this.$curl.get("api/hj/getStations", {
                params: JSON.stringify(params),
            });
            if (result.state) {
                if (result.data) {
                    this.formItem = result.data;
                    // 深拷贝数据
                    for (let i in result.data) {
                        this.oldItem[i] = result.data[i];
                    }
                    if (this.formItem.StationTag) {
                        this.tagList = JSON.parse(this.formItem.StationTag);
                    } else {
                        this.tagList = [];
                    }
                }
            } else {
                this.$Notice.warning({
                    title: "提示",
                    desc: "获取站点数据失败!",
                });
            }
        },
        async SaveStation() {
            this.formItem["CountyCode"] = this.formItem.AreaCode;

            //序列化标签列表
            this.formItem.StationTag = JSON.stringify(this.tagList);

            let params = {
                StationCode: this.formItem.StationCode,
                datalist: this.formItem,
                IsAdd: this.isAddStation,
            };
            if (!this.isOpenAudit) {
                let result = await this.$curl.post(
                    "api/hj/addOrUpdateStation",
                    params
                );
                console.log(result);
                if (result.state) this.$Message.success("保存成功!");
            } else {
                let remindData = {
                    msgChannel: "changeStationAudit",
                    msgType: "站点信息修改",
                    msgTypeCode: "00",
                    msgInfo: "",
                };
                let parmaData = {
                    oldItem: this.oldItem,
                    params: params,
                };
                setRemindAndInsertAudit(this, remindData, parmaData, "02");
            }
            this.isAddStation = false; //关闭弹窗等操作
            this.$emit("saveState", true);
        },
        getUserCity() {
            this.$curl.get("api/hj/getUserCity").then((res) => {
                this.CityOption = res.city;
                this.AreaOption = res.area;
            });
        },
    },
    watch: {
        StationCode: {
            handler(newval, oldval) {
                // if (!+newval || newval == oldval) return;
                // if (oldval == "0") return; //代表新增
                // if (+newval) this.isAddStation = false;
                if (newval) {
                    if (newval !== oldval) {
                        this.isAddStation = false;
                        this.StationCode = newval;
                        this.searchStation();
                    }
                } else this.isAddStation = true;
            },
            immediate: true,
        },
    },
    mounted() {
        this.getUserCity();
        this.getOption();
        this.getconfig();
    },
};
</script>
<style scoped></style>
