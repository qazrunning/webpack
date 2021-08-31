<template>
    <Modal v-model="status.isShowAcceptance" draggable scrollable closable title="车辆受理" :width="900">
      <h2 :show="dataStatus.isShowInspecratio" style="color:red;padding-bottom:20px">{{dataStatus.inspecratioText}}</h2>  
      <h2 :show="dataStatus.isShowLastInspection" style="color:red;padding-bottom:20px">{{dataStatus.lastInspectionText}}</h2>  
      <Form ref="accItemsId" :rules="accItems_rules" :model="accItems" :label-width="100" inline>
           <FormItem :label="item.describe"  v-show="!item.hidden" :class="{requireStar:item.required}" :prop='`${key}.value`'  v-for="(item, key, index) in accItems" :key="index">
                <Input
                v-if="item.model == 'Input'"
                :disabled="item.readonly"
                v-model="item.value"
                style="width:150px"
                :placeholder="item.pholder"
                clearable
                />
                <!-- {{JSON.stringify(item.value)}} -->
                <Cascader v-if="item.model == 'Cascader'" change-on-select :data="selectDict[key]" :disabled="item.readonly" style="flex:1" v-model="item.value" clearable></Cascader>
                <Select
                v-if="item.model == 'Select'" filterable
                :disabled="item.readonly"
                style="width:150px"
                v-model="item.value"
                clearable
                >
                <Option
                    v-for="citem in selectDict[key]"
                    :value="citem.CodeValue"
                    :key="citem.CodeValue"
                    >{{ citem.CodeName }}</Option
                    >
                </Select>
                <DatePicker
                v-if="item.model == 'Date'"
                :disabled="item.readonly"
                v-model="item.value"
                style="width:150px"
                :format="item.format==null?'yyyy-MM-dd':item.format"
                            type="datetime"
                placeholder="请选择"
                ></DatePicker>
                <Select
                v-if="item.model == 'SelectAndButton'" filterable
                :disabled="item.readonly"
                style="width:150px"
                v-model="item.value"
                clearable
                >
                <Option
                    v-for="citem in selectDict[key]"
                    :value="citem.CodeValue"
                    :key="citem.CodeValue"
                    >{{ citem.CodeName }}</Option
                    >
                </Select>
                <Button v-if="item.model == 'SelectAndButton'" :disabled="item.readonly" @click="item.btnClick">{{item.btnDescribe}}</Button>
            </FormItem>
         </Form>
         <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" @click="acceptance">保存受理</Button>
        </div>
    </Modal>
</template>
<script>
    export default {
        watch:{
            isShowAcceptance:function(newV,oldV){
                this.status.isShowAcceptance=newV;
            },
            VehicleID:function(newV,oldV){
                // this.accItems.VehicleID.value=newV;
                this.initFormData(newV);
            },
            "accItems.InspectionKind.value": {
                //车辆检测性质
                deep: true,
                handler: function(newV, oldV) {
                    this.accItems.InspectionMethod.value="";//检测方法
                    this.initInspectionWay(newV);
                    if(newV=='99'){
                        this.accItems.InspectionWay.value='99';
                    }else{
                        this.accItems.InspectionWay.value='02';
                    }
                    if(newV=='03'){
                        this.dataStatus.isShowInspecratio=false;
                    }else{
                        this.dataStatus.isShowInspecratio=true;
                    }
                },
            },
            "accItems.InspectionMethod.value": {
                //检测方法
                deep: true,
                handler: function(newV, oldV) {
                    
                        if(newV=="F"||newV=='A'){
                            if(this.accItems.InspectionKind.value!="01"){
                                this.dataStatus.APT2=true;
                                this.dataStatus.AcceptancPicType="02";
                                // this.dataStatus.isShowPic=true;
                                this.accItems.GpyType.hidden=false;
                                this.accItems.GpyType.required=true;
                            }else{
                                this.dataStatus.APT2=false;
                                this.dataStatus.AcceptancPicType="";
                                // this.dataStatus.isShowPic=false;
                                this.accItems.GpyType.hidden=true;
                                this.accItems.GpyType.required=false;
                            }
                            if(this.dataStatus.fgk){
                                this.accItems.FGKReason.hidden=false;
                                this.accItems.FGKReason.required=true;
                                this.accItems.JSFZRRemark.hidden=false;
                                this.accItems.JSFZRRemark.required=true;
                            }else{
                                this.accItems.FGKReason.hidden=true;
                                this.accItems.FGKReason.required=false;
                                this.accItems.JSFZRRemark.hidden=true;
                                this.accItems.JSFZRRemark.required=false;
                            }
                        }else{
                            this.dataStatus.APT2=false;
                            this.dataStatus.AcceptancPicType="";
                            // this.dataStatus.isShowPic=false;
                            this.accItems.GpyType.hidden=true;
                            this.accItems.GpyType.required=false;

                            this.accItems.FGKReason.hidden=true;
                            this.accItems.FGKReason.required=false;
                            this.accItems.JSFZRRemark.hidden=true;
                            this.accItems.JSFZRRemark.required=false;
                        }
                },
            },
            "accItems.FGKReason.value": {
                //非工况原因
                deep: true,
                handler: function(newV, oldV) {
                    if(newV=="04"){
                        this.accItems.OtherReason.hidden=false;
                        this.accItems.OtherReason.required=true;
                    }else{
                        this.accItems.OtherReason.hidden=true;
                        this.accItems.OtherReason.required=false;
                    }
                },
            },

            
        },
        props: {
            isShowAcceptance:{
                type:Boolean
            },
            VehicleID:{
                type:String
            }
        },
        data () {
            return {
              selectDict:{},
              status:{
                  isShowAcceptance:false,
              },
              dataStatus:{
                  AcceptancPicType:'',
                  APT2:false,
                  isShowLastInspection:true,
                  lastInspectionText:'',
                  isShowInspecratio:true,
                  inspecratioText:'',
                  fgk:false,//非工况原因开关
                  ufi:false,//非工况图片上传开发
                  isShowPic:false,
                  selectBusinessType:'61',//业务类型图片类型
                  localvlpn:'',//本地车牌
                  IsPrintAcceptance,//是否开启受理前打印
                  isAccAudit:'0',//是否受理审核
                  applyAccReason:'',//申请受理原因
                  passReason:'',//一个月内检测通过需再次检测的受理申请原因 
                  gavecReason:'',//车辆公安未联网受理申请原因
                  recheckReason:'',//复检时间间隔的受理申请原因
              },
              accItems: {
                InspectionNum: {
                describe: "受理编号",
                model: "Input",
                pholder: "请输入...",
                required: true,
                value: "",
                showStr: "",
                readonly: true,
                hidden: true,
                dict: [], //下拉数组
                },
                VehicleID: {
                describe: "车辆id",
                model: "Input",
                pholder: "请输入...",
                required: false,
                value: "",
                showStr: "",
                readonly: true,
                hidden: true,
                dict: [], //下拉数组
                },
                InspectionKind: {
                describe: "车辆检测性质",
                model: "Select",
                pholder: "请选择...",
                required: true,
                value: "",
                showStr: "",
                readonly: false,
                hidden: false,
                dict: [], //下拉数组
                },
                InspectionMethod: {
                describe: "检测方法",
                model: "Select",
                pholder: "请选择...",
                required: true,
                value: "",
                showStr: "",
                readonly: false,
                hidden: false,
                dict: [], //下拉数组
                },
                InspectionNature: {
                describe: "检测类型",
                model: "Select",
                pholder: "请选择...",
                required: true,
                value: "",
                showStr: "",
                readonly: false,
                hidden: false,
                dict: [], //下拉数组
                },
                InspectionWay: {
                describe: "检测方式",
                model: "Select",
                pholder: "请选择...",
                required: true,
                value: "",
                showStr: "",
                readonly: false,
                hidden: false,
                dict: [], //下拉数组
                },
                Mileage: {
                describe: "里程表读数",
                model: "Input",
                pholder: "请输入...",
                required: true,
                value: "",
                showStr: "",
                readonly: true,
                hidden: false,
                },
                InspectionTimes: {
                describe: "同个周期检测次数",
                model: "Input",
                pholder: "请输入...",
                required: true,
                value: "",
                showStr: "",
                readonly: true,
                hidden: false,
                },
                EStatus: {
                describe: "环保业务状态",
                model: "Select",
                pholder: "请选择...",
                required: true,
                value: "",
                showStr: "",
                readonly: true,
                hidden: false,
                dict: [], //下拉数组
                },
                VLPN: {
                describe: "号牌号码",
                model: "Input",
                pholder: "请输入...",
                required: true,
                value: "",
                showStr: "",
                readonly: true,
                hidden: false,
                },
                VIN: {
                describe: "车架号",
                model: "Input",
                pholder: "请输入...",
                required: true,
                value: "",
                showStr: "",
                readonly: true,
                hidden: false,
                },
                PG: {
                describe: "载客载货",
                model: "Select",
                pholder: "请输入...",
                required: true,
                value: "",
                showStr: "",
                readonly: true,
                hidden: false,
                },
                FuelType: {
                describe: "燃料种类",
                model: "Select",
                pholder: "请输入...",
                required: true,
                value: "",
                showStr: "",
                readonly: true,
                hidden: false,
                },
                VehicleKind: {
                describe: "车辆性质",
                model: "Select",
                pholder: "请输入...",
                required: true,
                value: "",
                showStr: "",
                readonly: true,
                hidden: false,
                dict: [],
                },
                OwnerName: {
                describe: "车主姓名",
                model: "Input",
                pholder: "请输入...",
                required: true,
                value: "",
                showStr: "",
                readonly: true,
                hidden: false,
                dict: [],
                },
                IUVTYPE: {
                describe: "车型号",
                model: "Input",
                pholder: "请输入...",
                required: true,
                value: "",
                showStr: "",
                readonly: true,
                hidden: false,
                },
                SceneCode: {
                describe: "检测线编号",
                model: "Select",
                pholder: "请输入...",
                required: true,
                value: "",
                showStr: "",
                readonly: false,
                hidden: false,
                },
                FactoryPlateModel: {//以下不展示
                describe: "品牌",
                model: "Input",
                pholder: "请输入...",
                required: false,
                value: "",
                showStr: "",
                readonly: false,
                hidden: true,
                },
                IUETYPE: {
                describe: "发动机型号",
                model: "Input",
                pholder: "请输入...",
                required: false,
                value: "",
                showStr: "",
                readonly: false,
                hidden: true,
                },
                EmissionStandard: {
                describe: "排放标准",
                model: "Input",
                pholder: "请输入...",
                required: false,
                value: "",
                showStr: "",
                readonly: false,
                hidden: true,
                },
                VRDATE: {
                describe: "初次登记日期",
                model: "Input",
                pholder: "请输入...",
                required: false,
                value: "",
                showStr: "",
                readonly: false,
                hidden: true,
                },
                FGKReason: {//以下非工况审核
                describe: "非工况原因",
                model: "Select",
                pholder: "请输入...",
                required: false,
                value: "",
                showStr: "",
                readonly: false,
                hidden: true,
                },
                OtherReason: {
                describe: "其他原因",
                model: "Input",
                pholder: "请输入...",
                required: false,
                value: "",
                showStr: "",
                readonly: false,
                hidden: true,
                },
                JSFZRRemark: {
                describe: "技术负责人意见",
                model: "Input",
                pholder: "请输入...",
                required: false,
                value: "",
                showStr: "",
                readonly: false,
                hidden: true,
                },
                GpyType: {
                    describe: "高拍仪类型",
                    btnDescribe:"上传资料",
                    model: "SelectAndButton",
                    pholder: "请输入...",
                    required: false,
                    value: "",
                    showStr: "",
                    readonly: false,
                    hidden: true,
                    btnClick:()=>{
                        return this.takePhoto();
                    }
                },
              },
              accItems_rules:{ 
              },
            }
        },
        created(){
            this.initSelectDict();
        },
        methods:{
            takePhoto(){
                this.dataStatus.selectBusinessType='61';
                if(this.accItems.GpyType.value==null||this.accItems.GpyType.value==''){
                    this.$Message.error("请选择高拍仪类型");
                    return;
                }
                //拍照没写
            },
            cancel(){
                this.$emit('changeShowAcceptance',false);
            },
            //检测是否上传图片
            async checkUploadImg(){
                if(this.accItems.InspectionNum.value==null||this.accItems.InspectionNum.value==''){
                     this.$Message.error("出现异常，请重新刷新页面");
                     return false;
                }
                if(this.dataStatus.ufi==true&&(this.accItems.InspectionMethod.value=='A'||this.accItems.InspectionMethod.value=='F')){
                    let res=await this.$curl.get("/api/common/query/searchInspectionData", {BusinessKey:this.accItems.InspectionNum.value});
                    if(res.code==0){
                        let list=res.data;
                        if(list.length>0){
                            for(let obj of list){
                                if(obj.BusinessType=='61'){
                                    return true;
                                }
                            }
                            this.$Message.error("请上传图片");
                            return false;
                        }else{
                            this.$Message.error("请上传图片");
                            return false;
                        }
                    }else{
                        this.$Message.error(res.msg);
                        return false;
                    }
                }else{
                    return true;
                }
            },
            //判断是否本地车牌
            isLocalVlpn(){
                let isLocalVlpn=false;
                let localvlpns=this.dataStatus.localvlpn;
                if(localvlpns!=null){
                    let list=localvlpns.split(",");
                    for(let obj of list){
                        if(this.accItems.VLPN.value.indexOf(obj)>=0){
                            isLocalVlpn=true;
                            break;
                        }
                    }
                }
                return isLocalVlpn;
            },
            getFgkreason(){
                let p={
                    OtherReason:this.accItems.OtherReason.value,
                    JSFZRRemark:this.accItems.JSFZRRemark.value,
                    InspectionMethod:this.accItems.InspectionMethod.value,
                }
                return p;
            },
            getAcceptance(){
                let p={
                    "AcceptanceID":"0",
                    "InspectionNum":null,
                    "CityCode":null,
                    "StationCode":null,
                    "VLPN":this.accItems.VLPN.value,
                    "VLPNColor":null,
                    "FuelType":null,
                    "VIN":this.accItems.VIN.value,
                    "Operator":null,
                    "InspectionState":null,
                    "AcceptanceDate":null,
                    "InspectionMethod":this.accItems.InspectionMethod.value,
                    "InspectionTimes":this.accItems.InspectionTimes.value,
                    "InspectionNature":this.accItems.InspectionNature.value,
                    "VehicleID":this.accItems.VehicleID.value,
                    "InspectionKind":this.accItems.InspectionKind.value,
                    "InspectionWay":this.accItems.InspectionWay.value,
                    "Remarks":null,
                    "MethodRemarks":null,
                    "IsExtCheck":null,
                    "SceneCode":this.accItems.SceneCode.value,
                    "IsUploadLambdaLimit":null,
                    "EACLU":null,
                    "EACLD":null,
                    "IsCheckHC":null,
                    "IsCheckOBD":null,
                    "HasFueltankCover":null
                    };
                return p;
            },
            //保存受理
            async acceptance(){
                this.$refs['accItemsId'].validate(async (valid1) => {
                    if (valid1) {
                        let bool=await this.checkUploadImg();
                        if(bool){
                            let localvlpns=this.isLocalVlpn();
                            // let IsPrintAcceptance=省去这部分逻辑
                            if(this.accItems.InspectionTimes.value==null||this.accItems.InspectionTimes.value==''||this.accItems.InspectionTimes.value=='0'){
                                this.accItems.InspectionTimes.value="1";
                            }
                            let params={
                                vehicleID: this.accItems.VehicleID.value,
                                Mileage: this.accItems.Mileage.value,
                                acceptance: this.getAcceptance(),
                                fgkreason: this.getFgkreason(),
                                isAccAudit: this.dataStatus.isAccAudit,
                                applyAccReason: this.dataStatus.applyAccReason,
                                passReason: this.dataStatus.passReason,
                                gavecReason: this.dataStatus.gavecReason,
                                recheckReason: this.dataStatus.recheckReason,
                                inspectionNum: this.accItems.InspectionNum.value
                            }
                            let res=await this.$curl.post("/api/c440600/Inspection/Acceptance/IsExitsWaitCheck_New", params);
                            this.$emit('changeShowAcceptance',false);
                        }
                    }
                });
            },
             //初始化下拉框
            async initSelectDict(){
                this.selectDict['InspectionKind']=this.$GY_ARRAY("cd_inspectionkind");//受理种类
                this.selectDict['InspectionMethod_ALL']=this.$GY_ARRAY("cd_inspectionmethod");//检测方法
                this.selectDict['InspectionNature']=this.$GY_ARRAY("cd_inspectionnature");//检测类型
                this.selectDict['InspectionWay_ALL']=this.$GY_ARRAY("cd_inspectionway");//检测方式
                this.selectDict['EStatus']=this.$GY_ARRAY("cd_estatus");//环保业务状态代码表
                this.selectDict['PG']=this.$GY_ARRAY("cd_pg");//载客载货
                this.selectDict['FuelType']=this.$GY_ARRAY("cd_fueltype");//燃油类型
                this.selectDict['VehicleKind']=this.$GY_ARRAY("cd_vehiclekind");//车辆种类
                this.selectDict['FGKReason']=this.$GY_ARRAY("cd_fgkreason");//非工况原因
                //初始化检测线列表
                this.selectDict['SceneCode']=await this.initLineInfo();
                // this.initFormData();
                for(let name of ['accItems']){
                    for(let key in this[name]){
                        let obj =this[name][key];
                        this.showOrHidden(obj,name,key);
                    }
                }
            },
            async initData(data){
                for(let key in this.accItems){
                    if(data.hasOwnProperty(key)){
                        this.accItems[key].value=data[key];
                    }
                }
                this.accItems.InspectionWay.value="02";
                this.loadVehicleLastInspection();
                this.loadVehicleAnalyse();
                //锁定车辆
                await this.lockStation();
            },
            //锁定车辆
            async lockStation(){
                let date=moment().format("YYYY-MM-DD HH:mm:ss");
                console.log(this.$USER)
                let StationCode=this.$USER.userOrg;
                let params={
                    StationCode:StationCode,
                    LockYear:new Date().getFullYear(),
                    ctime:date,
                    IsAvailableAcceptance:'1'
                }
                let res=await this.$curl.get("/api/common/query/searchLockStationList", params);
                if(res.code==0){
                    if(res.data!=null&&res.data.length>0){
                        let inf=res.data[0];
                        if(inf.LockStartDate!=null&&inf.LockEndDate!=null){
                            this.$Message.error(`站点已锁定，${inf.LockStartDate}~${inf.LockEndDate}这段时间内不能进行受理`);
                        }else{
                            this.$Message.error(`站点已锁定，不能进行受理`);
                        }
                    }else{//获取受理编号
                        res=await this.$curl.get("/api/c440600/Inspection/Acceptance/GetInspectionNum", {});
                        if(res.code===0){
                            this.accItems.InspectionNum.value=res.data;
                        }else{
                            this.$Message.error(res.msg);
                            return;
                        }
                    }
                }else{
                    this.$Message.error(res.msg);
                }
            },
            //获取该车最新一次的检测方法时间和检测站
            async loadVehicleLastInspection(){
                let VehicleID=this.accItems.VehicleID.value;
                let res=await this.$curl.get("/api/common/query/searchInspectionData", {VehicleID});
                if(res.code==0){
                    let info=res.data;
                    if(info.length>0){
                        info=info[0];
                        let m=this.selectDict['InspectionMethod_ALL'];
                        let jcff="";
                        for(let obj of m){
                            if(obj.CodeValue==info.IUTYPE){
                               jcff=obj.CodeName; break;
                            }
                        }
                        // this.dataStatus.isShowLastInspection=true;
                        this.dataStatus.lastInspectionText=`该车上一次检测站点为${info.stationName},检测时间为${info.DetectEndTime.replace("T","")},使用检测方法为${jcff}`;
                    }else{
                        // this.dataStatus.isShowLastInspection=false;
                        this.dataStatus.lastInspectionText="暂未找到检测信息";
                    }
                }else{
                    this.$Message.error(res.msg);
                }
            },
            //车型数据提醒:车型统计分析表
            async loadVehicleAnalyse(){
                let params={
                    VehicleID: this.accItems.VehicleID.value,
                    FactoryPlateModel: this.accItems.FactoryPlateModel.value,
                    IUVTYPE: this.accItems.IUVTYPE.value,
                    IUETYPE: this.accItems.IUETYPE.value,
                    EmissionStandard: this.accItems.EmissionStandard.value,
                    VRDATE: this.accItems.VRDATE.value
                }
                let res=await this.$curl.get("/api/common/query/searchGetInspectRatio", params);
                this.dataStatus.inspecratioText=''
                if(res.code==0){
                    if(res.data.length>0){
                        let dt=res.data[0];
                        let inspectionmethod = "";
                        let m=this.selectDict['InspectionMethod_ALL'];
                        for(let obj of m){
                            if(obj.CodeValue==dt.IUTYPE){
                               inspectionmethod=obj.CodeName; break;
                            }
                        }
                        let inspectdonetimes = dt.InspectDoneTimes;
                        let inspectratio = dt.InspectRatio;
                        this.dataStatus.inspecratioText="当前车型最多使用检测方法为" + inspectionmethod + ',检测完成台次为' + inspectdonetimes + ",使用比率为" + inspectratio + "%";
                    }
                }else{
                    this.$Message.error(res.msg);
                }
            },
            //初始化表单
            async initFormData(VehicleID){
                this.dataStatus=this.$options.data().dataStatus;
                 //车辆受理 非工况原因和 选择工转非图片的开关
                this.dataStatus.fgk=this.$SYSTEM_PARAMS['01_IsNeedAstrictFGKReason'];
                this.dataStatus.ufi=this.$SYSTEM_PARAMS['01_IsUploadingFGKImage'];
                this.dataStatus.localvlpn=this.$SYSTEM_PARAMS['01_LocalVlpn'];
                // this.dataStatus.IsPrintAcceptance=this.$SYSTEM_PARAMS['01_IsPrintAcceptance'];
                this.accItems.VehicleID.value=VehicleID;
                let res=await this.$curl.post("/api/c440600/Inspection/InspectionData/GetInspectionTimes", {VehicleID});
                if(res.code==0){
                    this.accItems.InspectionTimes.value=res.data+"";
                    if(res.data>2){
                    this.accItems.InspectionNature.value="03";
                    }else if(res.data==2){
                    this.accItems.InspectionNature.value="02";
                    }else{
                    this.accItems.InspectionNature.value="01";
                    }
                    res=await this.$curl.get("/api/common/query/searchVehicleDetailList", {VehicleID});
                    if(res.code==0){
                        let vinfo=res.data[0];
                        this.initData(vinfo);
                        this.initInspectionMethod(vinfo.FuelType);//初始化检测方法下拉列表
                        if(vinfo.VehicleKind=="03"){//二手车
                            this.accItems.InspectionKind.value="02"//外地转入本地车辆（二手车）
                        }
                    }
                }else{
                    this.$Message.error(res.msg);
                    return;
                }
            },
            //初始化检测方式下拉列表
            initInspectionWay(inspectionkind){
                let InspectionWay_ALL=this.selectDict['InspectionWay_ALL'];
                let res=[];
                for(let obj of InspectionWay_ALL){
                    if((inspectionkind=='99')&&obj.IsAvailable==1){//测试检测
                        if(obj.CodeValue=='91'||obj.CodeValue=='92'||obj.CodeValue=='93'){//对比/联调测试/监督性检测
                            res.push(obj);
                        }else{
                            continue;
                        }
                    }else if(obj.IsAvailable==1){
                        if(obj.CodeValue!='91'&&obj.CodeValue!='92'&&obj.CodeValue!='93'){//不透光烟度/加载减速/林格曼
                            res.push(obj);
                        }else{
                            continue;
                        }
                    }
                }
                this.selectDict['InspectionWay']=res;
            },
            //初始化检测方法下拉列表
            initInspectionMethod(fuelType){
                let InspectionMethod_ALL=this.selectDict['InspectionMethod_ALL'];
                let res=[];
                for(let obj of InspectionMethod_ALL){
                    if((fuelType=='A'||fuelType=='E')&&obj.IsAvailable==1){//汽油/天然气
                        if(obj.CodeValue=='A'||obj.CodeValue=='B'||obj.CodeValue=='C'){//双怠速/稳态工况/简易瞬态
                            res.push(obj);
                        }else{
                            continue;
                        }
                    }else if(fuelType=='B'&&obj.IsAvailable==1){
                        if(obj.CodeValue=='F'||obj.CodeValue=='G'||obj.CodeValue=='J'){//不透光烟度/加载减速/林格曼
                            res.push(obj);
                        }else{
                            continue;
                        }
                    }else if(obj.IsAvailable==1){
                        res.push(obj);
                    }
                }
                this.selectDict['InspectionMethod']=res;
            },
            //初始化检测线列表
            async initLineInfo(){
                let userOrg=this.$USER.userOrg;
                console.log(userOrg);
                let res=await this.$curl.get('/api/common/query/searchLineInfo',{StationCode:userOrg});
                if(res.code===0){
                    return res.data;
                }else{
                    return [];
                }
            },
            showOrHidden(obj,name,key){
                const c=(rule, value, callback) => {
                    if ((value==null||value==="") && obj.required) {
                    return callback(new Error(`${obj.describe}不能为空`));
                    } else {
                    return callback();
                    }
                };
                if(obj.model==='Input'){
                    this[name+'_rules'][key+'.value']=[{validator:c, trigger: 'blur' }]
                }else{
                    this[name+'_rules'][key+'.value']=[{validator:c, trigger: 'change' }];
                }
            },
        }
    }
</script>
<style  lang="less" scoped>
.requireStar /deep/.ivu-form-item-label:before{
	content: '*';
	display: inline-block;
	margin-right: 4px;
	line-height: 1;
	font-family: SimSun;
	font-size: 12px;
	color: #ed4014;
}
</style>
