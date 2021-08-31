<template>
    <!-- 业务审核-受理审核类型 -->
    <div>
        <vehicle-info
            :VehicleForm="vehicleInfo"
            :initform="initform"
            :selectData="selectData"
        ></vehicle-info>
        <accept-info
            :AcceptForm="acceptInfo"
            :initform="initform"
            :VehicleForm="vehicleInfo"
        ></accept-info>
        <image-info v-if="acceptInfo && acceptInfo.ApplyReason&&acceptInfo.ApplyReason != '33'" :ImgForm="imgInfo"></image-info>
        <date-edit-check v-if="acceptInfo && acceptInfo.ApplyReason&&acceptInfo.ApplyReason.indexOf('33') > -1" :editDate="editDate" :initform="initform"></date-edit-check>
        <audit-info
            :AcceptForm="acceptInfo"
            :selectData="selectData"
            :AuditForm="auditInfo"
            :initform="initform"
            :isFGK="isFGKs"
            :FGKForm="FGKForms"
            :CrossApplyForm="CrossApplyForms"
        ></audit-info>
    </div>
</template>
<script>
import VehicleInfo from "./drawInfo/VehicleInfo";
import AcceptInfo from "./drawInfo/AcceptInfo";
import AuditInfo from "./drawInfo/AuditInfo";
import ImageInfo from "./drawInfo/ImageInfo";
import DateEditCheck from "./drawInfo/DateEditCheck";
export default {
    name: "acceptaudit",
    props: {
        selectData: {
            type: Object,
            default: () => {},
        },
        initform: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            vehicleInfo: {}, //车辆信息
            acceptInfo: {}, //受理信息
            auditInfo: {}, //审核信息
            imgInfo: [], //图片信息
            isFGKs: false, //true为非工况
            FGKForms: {},
            CrossApplyForms: {}, //跨站信息
            InspectionNum: "", // 存储当前受理编号
            img: [],
            editDate: {  // 林格曼黑度法 审核 数据
                blackSmokeCar: {}, //黑烟车检查
                specialAttentionVehicle: {}, //重点关注车
                blackList: {}, //黑名单
                blackSmokeCarCapture: {}, //冒黑烟
                InspectData:{},//检测数据
            }, //检测数据审核
        };
    },
    components: {
        VehicleInfo,
        AcceptInfo,
        AuditInfo,
        ImageInfo,
        DateEditCheck
    },
    methods: {
        SubmitAudit(isStauts) {
            // if (this.auditInfo.AuditState != 0 && this.auditInfo.AuditState != 1) {
            //   this.$Notice.warning({
            //     title: "审核结果不能为空"
            //   });
            //   return;
            // }
            // if(!+this.auditInfo.AuditState && this.auditInfo.Remarks) {
            //   this.$Notice.warning({
            //     title: "不通过时备注不能为空"
            //   });
            //   return;
            // }
            //提交审核
            let message = "";
            if (!this.auditInfo.AuditState) message += "审核结果不能为空!<br/>";
            if (
                this.$hjconfig.reSure &&
                !+this.auditInfo.AuditState &&
                !this.auditInfo.Remarks
            )
                message += "备注不能为空!<br/>";
            if (message != "") return this.$Notice.warning({ title: message });
            this.saveAudit(isStauts);
        },
        BackToAudit() {
            this.$emit('handleBackToAudit', this.auditInfo)
        },
        async saveAudit(isStauts) {
            if (!this.acceptInfo.AcceptanceAuditID) return;
            const param = {
                ApplyReason: this.vehicleInfo.ApplyReason,
                acceptInfo: this.acceptInfo,
                auditInfo: this.auditInfo,
                isStauts: isStauts,
            };
            const res = await this.$curl.post(
                "api/hj/SaveAuditForWaitCheck",
                param
            );
            if (res.state) {
                if (res.auditInfo) {
                    //将后台返回的处理人，处理时间赋值
                    this.auditInfo.Checker = res.auditInfo.Checker;
                    this.auditInfo.CheckTime = res.auditInfo.CheckTime;
                    //合并修改后的数据
                    this.selectData.Status = this.auditInfo.Status = "1";
                    Object.assign(this.selectData, this.auditInfo);
                    this.$emit("on-edit", this.selectData);
                }
                this.$Message.success(res.msg);
            } else {
                this.$Notice.warning({
                    title: "提示",
                    desc: res.msg,
                });
            }
        },
        async getData() {
            const _this = this;
            const param = {
                CheckId: this.selectData.CheckId,
            };
            const res = await this.$curl.get("api/hj/getAcceptAudit", {
                CheckId: this.selectData.CheckId,
            });
            if (res.state) {
                _this.acceptInfo = res.data.AcceptAudit || {};
                _this.vehicleInfo = res.data.WaitCheck || {};
                _this.auditInfo = res.data.WaitCheck || {};
                if (
                    this.vehicleInfo.ApplyReason &&
                    this.vehicleInfo.ApplyReason.indexOf("21") > -1
                )
                    _this.getFGKData();
                if (
                    this.vehicleInfo.ApplyReason &&
                    this.vehicleInfo.ApplyReason.indexOf("18") > -1
                )
                    _this.getCrossAudit();
                if (
                    this.acceptInfo.ApplyReason && 
                    this.acceptInfo.ApplyReason.indexOf("33") > -1
                ) {
                    _this.getCheckDateAuditDate();
                    _this.getInspectionData();
                }
                   
            } else {
                this.$Notice.warning({
                    title: "提示",
                    desc: res.msg,
                });
            }
        },
        async getFGKData() {
            const res = await this.$curl.get("api/hj/getFGKData", {
                InspectionNum: this.acceptInfo.InspectionNum,
            });
            if (res.state && res.data.FGKInfo) this.FGKForms = res.data.FGKInfo;
            this.isFGKs = true;
        },
        async getCrossAudit() {
            const param = {
                CheckId: this.selectData.CheckId,
                VehicleiD: this.vehicleInfo.VehicleID,
            };
            const res = await this.$curl.get("api/hj/getCrossAudit", {
                VehicleiD: this.vehicleInfo.VehicleID,
            });
            if (res.state && res.data.CrossApply)
                this.CrossApplyForms = res.data.CrossApply;
        },
        async getImgList() {
            let Types = [];
            if (
                this.selectData.ApplyReason &&
                this.selectData.ApplyReason.split(",").length > 0
            ) {
                this.selectData.ApplyReason.split(",").forEach((type) => {
                    if (type == "17") Types.push("21");
                });
            }

            const param = {
                vid: this.selectData.VehicleID, //车辆ID
                TYPE: Types, //审核类型
                ApplyTime: this.selectData.ApplyTime, //申请时间
                OP: "6",
            };
            this.imgInfo = [];
            if (
                this.selectData.ApplyReason &&
                (this.selectData.ApplyReason.indexOf("26") != -1 ||
                    this.selectData.ApplyReason.indexOf("21") != -1 ||
                    this.selectData.ApplyReason.indexOf("03") != -1 ||
                    this.selectData.ApplyReason.indexOf("18") != -1 ||
                    this.selectData.ApplyReason.indexOf("29") != -1 ||
                    this.selectData.ApplyReason.indexOf("31") != -1 ||
                    this.selectData.ApplyReason.indexOf("32") != -1 )
            ) {
                await this.getSpecialImg(this.InspectionNum);
                this.img.forEach((item) => {
                    item.DisplayName = item.OriginalFileName.substring(
                        0,
                        item.OriginalFileName.lastIndexOf(".")
                    );
                    item.UploadPerson = item.UploadFileUser;
                    this.imgInfo.push(item);
                });
            } else {
                const res = await this.$curl.get("api/hj/getBusinessFileInfo", {
                    param: JSON.stringify(param),
                });
                if (res.state) {
                    if (res.data.imgList.length > 0) {
                        res.data.imgList.forEach((item) => {
                            this.imgInfo.push(item);
                        });
                    }
                } else {
                    this.$Notice.warning({
                        title: "提示",
                        desc: "获取图片列表失败!",
                    });
                }
            }
        },
        async getSpecialImg(value) {
            if (value) {
                this.img = [];
                let res = await this.$curl.get("api/hj/getSpecialImg", {
                    param: JSON.stringify(value),
                });
                if (res.state) {
                    this.img = res.data;
                }
            }
        },
        async getCheckDateAuditDate() {
            let res = await this.$curl.get('api/hj/getLatestLingmanDataInspectionnum',{vehicleID:this.selectData.VehicleID,date:this.acceptInfo.AcceptanceDate})
            console.log('acceptInfo',this.acceptInfo)
            const param = {
                // BusinessKey: this.acceptInfo.InspectionNum,
                BusinessKey: res.inspectionnum,
                VehicleID: this.selectData.VehicleID,
                CheckType: this.selectData.CheckType,
                IsCheck: "1"
            };
            this.$curl.get("api/hj/getCheckDateAudit", {param:JSON.stringify(param)}).then(res => {
            if (res.state) {
                this.editDate.blackSmokeCar = res.blackSmokeCar || {};
                this.editDate.specialAttentionVehicle =
                res.specialAttentionVehicle || {};
                this.editDate.blackList = res.blackList || {};
                this.editDate.blackSmokeCarCapture = res.blackSmokeCarCapture || {};
                this.editDate.imgList = res.imgList || {};;
            } else {
                this.$Message.error(res.msg);
            }
            });
        },
        //获取检测信息
        getInspectionData(){
        this.$curl.get("api/hj/getInspectData",{InspectionNum:this.acceptInfo.InspectionNum}).then(res=>{
            if(res.state){
            this.editDate.InspectData=res.InspectData||{};
            }
        })
        },
    },
    watch: {
        selectData: {
            handler(newData, oldData) {
                if (!newData) return;
                this.getData();
            },
            immediate: true,
        },
        acceptInfo: {
            handler(newData, oldData) {
                this.InspectionNum = this.acceptInfo.InspectionNum;
                this.getImgList();
            },
        },
    },
};
</script>
