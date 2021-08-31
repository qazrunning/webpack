<template>
  <div :style="{height: height-200+'px', overflow: 'auto'}">
    <Form ref="formInline" :label-width="150">
      <Divider>车辆基本信息</Divider>
      <Row style="padding:6px 10px;">
        <i-col span="12">
          <FormItem label="号牌号码：">
            <Input clearable v-model="likeParams.VLPN" />
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem label="车牌颜色：">
            <Select clearable v-model="params.VLPNColor">
              <Option v-for="item in ColorList" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
            </Select>
          </FormItem>
        </i-col>
        <!-- <Col span="12">
          <FormItem label="车辆ID：">
            <Input clearable v-model="likeParams.VehicleID" />
          </FormItem>
        </Col>-->
        <i-col span="12">
          <FormItem label="车架号：">
            <Input clearable v-model="likeParams.VIN" />
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem label="营运性质：">
            <Select clearable v-model="params.OCHA">
              <Option v-for="item in ServiceList" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
            </Select>
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem label="车辆性质：">
            <Select clearable v-model="params.VehicleKind">
              <Option v-for="item in VehicleKind" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
            </Select>
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem label="燃料种类：">
            <Select clearable v-model="params.FuelType">
              <Option v-for="item in FuelTypeList" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
            </Select>
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem label="使用性质：">
            <Select clearable v-model="params.UseOfAuto" multiple>
              <Option v-for="item in UseOfAuto" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
            </Select>
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem label="最大总质量：">
            <div class="flex">
              <Select clearable v-model="otherParams.VMLOption" style="width: 50px">
                <Option v-for="item in option" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
              <Input clearable v-model="otherParams.VML" class="InputClass" />
            </div>
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem label="排放标准：" >
            <Select clearable v-model="params.EmissionStandard" multiple>
              <Option v-for="item in EmissionStandardList" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
            </Select>
          </FormItem>
        </i-col>
      </Row>
      <Divider>检测信息</Divider>
      <Row style="padding:6px 10px;">
        <i-col span="12">
          <FormItem label="城市：">
            <Select clearable @on-change="changeCity" v-model="parame.city">
              <Option v-for="item in cityList" :value="item.AreaCode" :key="item.AreaCode">{{ item.AreaName }}</Option>
            </Select>
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem label="县区: ">
            <Select clearable @on-change="changeCounty" v-model="parame.county">
              <Option v-for="item in filterCounty" :value="item.AreaCode" :key="item.AreaCode">{{ item.AreaName }}</Option>
            </Select>
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem label="检测站：">
            <Select clearable filterable v-model="parame.StationCode" multiple :max-tag-count="1" @on-change="getLineNumber(parame.StationCode)">
              <Option v-for="item in station" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
            </Select>
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem label="检测方法：">
            <Select clearable v-model="params.IUTYPE" @on-change="getIUTYPE">
              <Option v-for="item in IUTYPE" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
            </Select>
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem label="检测开始时间">
            <DatePicker clearable type="date" v-model="DetectStartTime" class="timeClass"></DatePicker>
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem label="检测结束时间">
            <DatePicker clearable type="date" v-model="DetectEndTime" class="timeClass"></DatePicker>
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem label="检测类型">
            <Select clearable v-model="params.InspectionNature">
              <Option v-for="item in InspectionNature" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
            </Select>
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem label="检测结果裁决">
            <Select clearable v-model="params.VDCT">
              <Option v-for="item in detectionResult" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
            </Select>
          </FormItem>
        </i-col>
        <!-- <i-col span="12">
          <FormItem label="受理编号">
            <Input clearable v-model="likeParams.InspectionNum" />
          </FormItem>
        </i-col>-->
        <i-col span="12">
          <FormItem label="检测性质">
            <Select clearable v-model="params.InspectionKind">
              <Option v-for="item in InspectionKind" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
            </Select>
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem label="检测方式">
            <Select clearable v-model="params.InspectionWay">
              <Option v-for="item in InspectionWay" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
            </Select>
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem label="检测次数">
            <div class="flex">
              <Select clearable v-model="otherParams.InspectionTimesOption" style="width: 50px">
                <Option v-for="item in option" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
              <Input clearable v-model="otherParams.InspectionTimes" class="InputClass" />
            </div>
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem label="数据有效性">
            <Select clearable v-model="params.Validity">
              <Option v-for="item in validResult" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
            </Select>
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem label="检测线编号">
            <Select ref="select" clearable filterable v-model="params.SceneCode">
              <Option v-for="(item, index) in SceneCode" :key="index" :value="item">{{ item }}</Option>
            </Select>
          </FormItem>
        </i-col>

        <i-col span="12">
          <FormItem label="OBD系统故障指示">
            <Select  clearable filterable v-model="params.FaultIndicator">
              <Option v-for="(item, index) in [{code:0,codeValue:'不合格'},{code:1,codeValue:'合格'}]" :key="index" :value="item.code">{{ item.codeValue }}</Option>
            </Select>
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem label="OBD系统通讯">
            <Select clearable filterable v-model="params.IsCommunicated">
              <Option v-for="(item, index) in [{code:0,codeValue:'不成功'},{code:1,codeValue:'成功'}]" :key="index" :value="item.code">{{ item.codeValue }}</Option>
            </Select>
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem label="预警条件">
            <Select clearable v-model="params.AlarmType" multiple filterable>
              <Option v-for="item in AlarmType" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
            </Select>
          </FormItem>
        </i-col>
      </Row>
      <template v-if="params.IUTYPE == 'B'">
        <Divider>稳态工况排放因子</Divider>
        <Row style="padding:6px 10px;">
          <i-col span="12">
            <FormItem label="HC5025">
              <Select clearable v-model="optionASM.HCER5025" style="width: 50px">
                <Option v-for="item in option" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
              <Input clearable v-model="ASM.HCER5025" class="InputClass" />
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="HCED5025判定结果">
              <Select v-model="ASM.HCED5025" clearable>
                <Option v-for="item in passResult" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="HC2540">
              <Select v-model="optionASM.HCER2540" clearable style="width: 50px">
                <Option v-for="item in option" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
              <Input clearable v-model="ASM.HCER2540" class="InputClass" />
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="HCED2540判定结果">
              <Select v-model="ASM.HCED2540" clearable>
                <Option v-for="item in passResult" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="CO5025">
              <Select v-model="optionASM.COER5025" clearable style="width: 50px">
                <Option v-for="item in option" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
              <Input clearable v-model="ASM.COER5025" class="InputClass" />
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="COED5025判定结果">
              <Select clearable v-model="ASM.COED5025">
                <Option v-for="item in passResult" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="CO2540">
              <Select clearable v-model="optionASM.COER2540" style="width: 50px">
                <Option v-for="item in option" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
              <Input clearable v-model="ASM.COER2540" class="InputClass" />
            </FormItem>
          </i-col>

          <i-col span="12">
            <FormItem label="COED2540判定结果">
              <Select v-model="ASM.COED2540" clearable>
                <Option v-for="item in passResult" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="NO5025">
              <Select clearable v-model="optionASM.NOER5025" style="width: 50px">
                <Option v-for="item in option" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
              <Input clearable v-model="ASM.NOER5025" class="InputClass" />
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="NOED5025判定结果">
              <Select v-model="ASM.NOED5025" clearable>
                <Option v-for="item in passResult" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="NO2540">
              <Select v-model="optionASM.NOED5025" clearable style="width: 50px">
                <Option v-for="item in option" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
              <Input clearable v-model="ASM.NOED5025" class="InputClass" />
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="NOED2540判定结果">
              <Select v-model="ASM.NOED2540" clearable>
                <Option v-for="item in passResult" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
            </FormItem>
          </i-col>
        </Row>
      </template>
      <template v-if="params.IUTYPE == 'A'">
        <Divider>双怠速排放因子</Divider>
        <Row style="padding:6px 10px;">
          <i-col span="12">
            <FormItem label="低怠速CO">
              <Select clearable v-model="optionTSI.LICOR" style="width: 50px">
                <Option v-for="item in option" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
              <Input clearable v-model="TSI.LICOR" class="InputClass" />
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="低怠速CO判定结果">
              <Select v-model="TSI.LICOD" clearable>
                <Option v-for="item in passResult" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="高怠速CO">
              <Select v-model="optionTSI.HICOR" clearable style="width: 50px">
                <Option v-for="item in option" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
              <Input clearable v-model="TSI.HICOR" class="InputClass" />
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="高怠速CO判定结果">
              <Select v-model="TSI.HICOD" clearable>
                <Option v-for="item in passResult" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="低怠速HC">
              <Select v-model="optionTSI.LIHCR" clearable style="width: 50px">
                <Option v-for="item in option" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
              <Input clearable v-model="TSI.LIHCR" class="InputClass" />
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="低怠速HC判定结果">
              <Select v-model="TSI.LIHCD" clearable>
                <Option v-for="item in passResult" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="高怠速HC">
              <Select v-model="optionTSI.HIHCR" clearable style="width: 50px">
                <Option v-for="item in option" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
              <Input clearable v-model="TSI.HIHCR" class="InputClass" />
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="高怠速HC判定结果">
              <Select v-model="TSI.HIHCD" clearable>
                <Option v-for="item in passResult" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
            </FormItem>
          </i-col>
        </Row>
      </template>
      <template v-if="params.IUTYPE == 'G'">
        <Divider>加载减速排放因子</Divider>
        <Row style="padding:6px 10px;">
          <i-col span="12">
            <FormItem label="100%点排放结果">
              <Select v-model="optionLDD.ER100" clearable style="width: 50px">
                <Option v-for="item in option" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
              <Input clearable v-model="LDD.ER100" class="InputClass" />
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="90%点排放结果">
              <Select v-model="optionLDD.ER90" clearable style="width: 50px">
                <Option v-for="item in option" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
              <Input clearable v-model="LDD.ER90" class="InputClass" />
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="80%点排放结果">
              <Select v-model="optionLDD.ER80" clearable style="width: 50px">
                <Option v-for="item in option" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
              <Input clearable v-model="LDD.ER80" class="InputClass" />
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="最大轮边功率">
              <Select v-model="optionLDD.MWP" clearable style="width: 50px">
                <Option v-for="item in option" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
              <Input clearable v-model="LDD.MWP" class="InputClass" />
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="NOX80%排放结果">
              <Select v-model="optionLDD.NOX80" clearable style="width: 50px">
                <Option v-for="item in option" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
              <Input clearable v-model="LDD.NOX80" class="InputClass" />
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="NOX80判定结果">
              <Select v-model="LDD.NOXED" clearable>
                <Option v-for="item in passResult" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
            </FormItem>
          </i-col>

          <i-col span="12">
            <FormItem label="判断结果">
              <Select v-model="LDD.ED" clearable>
                <Option v-for="item in passResult" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
            </FormItem>
          </i-col>
        </Row>
      </template>
      <template v-if="params.IUTYPE == 'F'">
        <Divider>自由加速的排放因子</Divider>
        <Row style="padding:6px 10px;">
          <i-col span="12">
            <FormItem label="排放结果1">
              <Select v-model="optionLightProofSmoke.ER1" clearable style="width: 50px">
                <Option v-for="item in option" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
              <Input clearable v-model="LightProofSmoke.ER1" class="InputClass" />
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="排放结果2">
              <Select v-model="optionLightProofSmoke.ER2" clearable style="width: 50px">
                <Option v-for="item in option" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
              <Input clearable v-model="LightProofSmoke.ER2" class="InputClass" />
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="排放结果3">
              <Select v-model="optionLightProofSmoke.ER3" clearable style="width: 50px">
                <Option v-for="item in option" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
              <Input clearable v-model="LightProofSmoke.ER3" class="InputClass" />
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="平均值">
              <Select v-model="optionLightProofSmoke.ERA" clearable style="width: 50px">
                <Option v-for="item in option" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
              <Input clearable v-model="LightProofSmoke.ERA" class="InputClass" />
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="判断结果">
              <Select v-model="LightProofSmoke.ED" clearable>
                <Option v-for="item in passResult" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
            </FormItem>
          </i-col>
        </Row>
      </template>
      <template v-if="params.IUTYPE == 'J'">
        <Divider>林格曼黑度结果</Divider>
        <Row style="padding:6px 10px;">
          <i-col span="12">
            <FormItem label="明显可见烟度">
              <Select v-model="Lingman.VisibleSmoke" clearable>
                <Option v-for="item in VisibleSmoke" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="林格曼黑度(级)">
              <div style="display:flex">
                <Select clearable v-model="optionLingman.LingmanRank" style="width: 55px;margin-right: 5px;">
                  <Option v-for="item in option" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
                </Select>
                <Select v-model="Lingman.LingmanRank" clearable>
                  <Option v-for="item in LingmanRank" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
                </Select>
              </div>
            </FormItem>
          </i-col>
        </Row>
      </template>
      <template>
        <Divider v-show="params.FuelType == 'A'">OBD</Divider>
        <Row style="padding:6px 10px;" v-show="params.FuelType == 'A'">
          <i-col span="12">
            <FormItem label="OBD系统故障指示器">
              <Select clearable v-model="OBDParams.FaultIndicator">
                <Option v-for="item in passResult" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="通讯">
              <Select clearable v-model="OBDParams.IsCommunicated">
                <Option v-for="item in connectResult" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col span="12" v-show="OBDParams.IsCommunicated == 0">
            <FormItem label="通讯不成功的原因">
              <Select clearable multiple v-model="OBDParams.CommFailReason">
                <Option v-for="item in disconnectReason" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="OBD系统故障指示器报警及故障码">
              <Select clearable v-model="OBDParams.IsHaveFaultCode">
                <Option v-for="item in haveResult" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="就绪状态未完成项目">
              <Select clearable v-model="OBDParams.UnDoneReadyStatus">
                <Option v-for="item in haveResult" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col span="12" v-show="OBDParams.UnDoneReadyStatus == 1">
            <FormItem label="就绪未完成的项目">
              <Select clearable v-model="OBDParams.UnFinifishedItem" multiple>
                <Option v-for="item in oilReason" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
            </FormItem>
          </i-col>
        </Row>
      </template>
      <Divider>车主信息</Divider>
      <Row style="padding:6px 10px;">
        <i-col span="12">
          <FormItem label="车主姓名">
            <Input clearable v-model="likeParams.OwnerName" />
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem label="联系电话">
            <Input clearable v-model="likeParams.Tel" />
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem label="证件号码">
            <Input clearable v-model="likeParams.CredentialsNum" />
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem label="联系地址">
            <Input clearable v-model="likeParams.Address" />
          </FormItem>
        </i-col>
      </Row>

      <Divider>车型信息</Divider>
      <Row style="padding:6px 10px;">
        <i-col span="12">
          <FormItem label="车型号">
            <Input clearable v-model="likeParams.IUVTYPE" />
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem label="驱动方式">
            <Select clearable v-model="params.DriveForm">
              <Option v-for="item in DriveForm" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
            </Select>
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem label="车辆类型">
            <Select clearable filterable v-model="params.GAVType" multiple>
              <Option v-for="item in GAVType" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
            </Select>
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem label="机动车生产厂家">
            <Input clearable v-model="likeParams.IUVMANU" />
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem label="初次登记日期">
            <DatePicker clearable type="daterange" v-model="otherParams.VRDATE" class="timeClass"></DatePicker>
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem label="座位数">
            <div class="flex">
              <Select clearable v-model="otherParams.RatedSeatsOption" style="width: 50px">
                <Option v-for="item in option" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
              <Input clearable v-model="otherParams.RatedSeats" class="InputClass" />
            </div>
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem label="品牌">
            <Input clearable v-model="likeParams.FactoryPlateModel" />
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem label="发动机型号">
            <Input clearable v-model="likeParams.IUETYPE" />
          </FormItem>
        </i-col>
      </Row>
    </Form>
  </div>
</template>

<script>
import { formatDates, getCDData } from "./../../../utils/utils";
export default {
  props: {
    height: { type: Number },
    VehicleKind: { type: Array },
    FuelTypeList: { type: Array },
    StationInfo: { type: Array },
    InspectionWay: { type: Array },
    AlarmType: { type: Array },
    IUTYPE: { type: Array },
    RowInfo: { type: Object },
    selectModal: { type: Boolean },
    JCSJ: { type: Array },
  },
  data() {
    return {
      city: false, // 市级用户
      cityList: [], // 市级用户列表
      county: false, // 区级用户
      countyList: [], // 区级用户列表
      filterCounty: [], // 过滤后的县区
      station: [], // 过滤后的站点
      parame: {}, // 城市的参数
      params: {}, // 参数
      likeParams: {}, // 范围参数
      otherParams: {
        InspectionTimesOption: "=", // 检测次数的符号
        InspectionTimes: "", // 检测次数
        RatedSeats: "", // 座位数
        RatedSeatsOption: "=", // 座位数符号
        VRDATE: [], // 初次登记日期
        VML: "",//最大总质量
        VMLOption: ">=", //最大总质量符号
      },
      option: [
        { CodeValue: "=", CodeName: "=" },
        { CodeValue: ">=", CodeName: ">=" },
        { CodeValue: "<=", CodeName: "<=" }
      ],
      ColorList: [], // 颜色
      EmissionStandardList: [],//排放标准
      ServiceList: [], // 营运性质
      UseOfAuto: [], // 使用性质
      InspectionNature: [], // 检测类型
      InspectionKind: [], // 检测性质
      GAVType: [], // 车辆类型
      DriveForm: [], // 驱动方式
      detectionResult: [
        { CodeValue: "1", CodeName: "通过" },
        { CodeValue: "0", CodeName: "不通过" }
      ],
      validResult: [
        { CodeValue: "1", CodeName: "有效" },
        { CodeValue: "0", CodeName: "无效" }
      ],
      passResult: [
        { CodeValue: "1", CodeName: "合格" },
        { CodeValue: "0", CodeName: "未合格" }
      ],
      connectResult: [
        { CodeValue: "1", CodeName: "成功" },
        { CodeValue: "0", CodeName: "不成功" }
      ],
      disconnectReason: [
        { CodeValue: "01", CodeName: "接口损坏" },
        { CodeValue: "02", CodeName: "找不到接口" },
        { CodeValue: "03", CodeName: "连接后不能通信" }
      ],
      haveResult: [
        { CodeValue: "1", CodeName: "有" },
        { CodeValue: "0", CodeName: "无" }
      ],
      oilReason: [
        { CodeValue: "01", CodeName: "SCR" },
        { CodeValue: "02", CodeName: "POC" },
        { CodeValue: "03", CodeName: "DOC" },
        { CodeValue: "04", CodeName: "DPF" },
        { CodeValue: "05", CodeName: "废气再循环(EGR)" },
        { CodeValue: "06", CodeName: "催化器" },
        { CodeValue: "07", CodeName: "氧传感器" },
        { CodeValue: "08", CodeName: "氧传感器加热器" }
      ],
      DetectStartTime: "", // 开始检测时间
      DetectEndTime: "", // 结束检测时间
      SceneCode: [], // 检测站编号
      ASM: {}, // 稳态工况的参数
      optionASM: {
        HCER5025: "=",
        HCER2540: "=",
        COER5025: "=",
        COER2540: "=",
        NOER5025: "=",
        NOED5025: "="
      }, // 稳态工况的符号,设默认值为等号
      LDD: {}, //加载减速的参数
      optionLDD: {
        ER100: "=",
        ER90: "=",
        ER80: "=",
        NOX80: "=",
        NOXED: "=",
        MWP: "="
      }, // 加载减速的符号
      TSI: {}, // 双怠速的参数
      optionTSI: {
        LICOR: "=",
        HICOR: "=",
        LIHCR: "=",
        HIHCR: "=",
        ED: "="
      }, // 双怠速的符号,设默认值为等号
      LightProofSmoke: {}, // 自由加速的参数
      optionLightProofSmoke: {
        ER1: "=",
        ER2: "=",
        ER3: "=",
        ERA: "="
      },
      OBDParams: {},
      VisibleSmoke: [
        { CodeValue: "1", CodeName: "是" },
        { CodeValue: "0", CodeName: "否" }
      ],
      LingmanRank: [
        { CodeValue: "0", CodeName: "0" },
        { CodeValue: "1", CodeName: "1" },
        { CodeValue: "2", CodeName: "2" },
        { CodeValue: "3", CodeName: "3" },
        { CodeValue: "4", CodeName: "4" },
        { CodeValue: "5", CodeName: "5" },
      ],
      Lingman: {}, // 林格曼参数
      optionLingman: {
        LingmanRank: "="
      }
    };
  },
  watch: {
    StationInfo() {
      this.station = this.StationInfo;
    },
    selectModal() {
      if (this.selectModal) {
        this.likeParams = this.RowInfo.likeParams;
        this.params = this.RowInfo.params;
        this.parame = this.RowInfo.parame;
        if (this.RowInfo.parame.city) {
          this.changeCity(this.RowInfo.parame.city)
        }
        if (this.RowInfo.parame.county) {
          this.changeCounty(this.RowInfo.parame.county)
        }
        if (this.RowInfo.parame.StationCode) {
          this.getLineNumber(this.RowInfo.parame.StationCode)
        }
        this.DetectStartTime = this.JCSJ[0];
        this.DetectEndTime = this.JCSJ[1];
      }
    }
  },
  methods: {
    // 获取检测站编号
    async getLineNumber(StationCode) {
      if (!StationCode) this.params.SceneCode = "";
      let res = await this.$curl.get("api/hj/getstationLine", { StationCode:JSON.stringify(StationCode) });
      let line = res.Line.filter(v => v.SceneCode);
      this.SceneCode = line.map(v => v.SceneCode);
    },
    // 改变城市
    changeCity(value) {
      if (value) {
        this.station = this.StationInfo.filter(
          item => item.CodeValue.substr(0, 4) == value.substr(0, 4)
        );
        this.filterCounty = this.countyList.filter(
          item => item.AreaCode.substr(0, 4) == value.substr(0, 4)
        );
      } else {
        // this.station = this.StationInfo;
        this.filterCounty = [];
        this.parame = {};
        this.station = {};
      }
    },
    // 改变区
    changeCounty(value) {
      if (value) {
        this.station = this.StationInfo.filter(
          item => item.CodeValue.substr(0, 6) == value
        );
      } else {
        this.filterCounty = this.countyList.filter(
          item => item.AreaCode.substr(0, 4) == this.parame.city.substr(0, 4)
        );
        this.station = this.StationInfo.filter(
          item => item.CodeValue.substr(0, 4) == this.parame.city.substr(0, 4)
        );
      }
    },
    // 重置
    resetParams() {
      this.DetectStartTime = "";
      this.DetectEndTime = "";
      this.params = {};
      this.parame = {};
      this.likeParams = {};
      this.otherParams = {};
      this.TSI = {};
      this.LDD = {};
      this.ASM = {};
      this.Lingman - {};
      this.SceneCode = [];
      if (this.cityList.length == 1) {
        this.parame.city = this.cityList[0].AreaCode;
      }
    },
    getIUTYPE() {
      this.TSI = {};
      this.LDD = {};
      this.ASM = {};
      this.Lingman = {};
      this.$emit("resetIUTYPE");
    },
    // 获取cd表
    async getCDTable() {
      const list = [
        {
          tableName: "CD_VLPNColor",
          columns: "CodeValue,CodeName",
          where: "where  IsAvailable=1"
        },
        {
          tableName: "CD_OCHA",
          columns: "CodeValue,CodeName",
          where: "where  IsAvailable=1"
        },
        {
          tableName: "CD_UseOfAuto",
          columns: "CodeValue,CodeName",
          where: "where  IsAvailable=1"
        },
        {
          tableName: "CD_InspectionNature",
          columns: "CodeValue,CodeName",
          where: "where  IsAvailable=1"
        },
        {
          tableName: "CD_InspectionKind",
          columns: "CodeValue,CodeName",
          where: "where  IsAvailable=1"
        },
        {
          tableName: "CD_GAVType",
          columns: "CodeValue,CodeName",
          where: "where  IsAvailable=1"
        },
        {
          tableName: "CD_DriveForm",
          columns: "CodeValue,CodeName",
          where: "where  IsAvailable=1"
        },
        {
          tableName: "CD_EmissionStandard",
          columns: "CodeValue,CodeName",
          where: "where IsAvailable=1"
        }
      ];
      if (this.$getDBTable) {
        let cdList = list.map(item => item.tableName);
        await this.$getDBTable(cdList).then(data => {
          let dataList = data.map(v => {
            return JSON.parse(v).filter(e => e.IsAvailable == 1);
          });
          [
            this.ColorList,
            this.ServiceList,
            this.UseOfAuto,
            this.InspectionNature,
            this.InspectionKind,
            this.GAVType,
            this.DriveForm,
            this.EmissionStandardList,
          ] = [...dataList];
        });
      } else {
        let res = await this.$curl.get("api/hj/getCDData", {
          CDDataList: JSON.stringify(list)
        });
        let { data, state } = res;
        if (state) {
          data = data.map(item => {
            return item.filter(v => v.IsAvailable == 1);
          });
          this.ColorList = data[0];
          this.ServiceList = data[1];
          this.UseOfAuto = data[2];
          this.InspectionNature = data[3];
          this.InspectionKind = data[4];
          this.GAVType = data[5];
          this.DriveForm = data[6];
          this.EmissionStandardList = data[7]
        }
      }
    },
    //获取登录用户下的行政区域
    async getUserAreaInfo() {
      await this.$curl.get("api/hj/getUserCity").then(res => {
        this.cityList = res.city;
        this.countyList = res.area;
        this.filterCounty = this.countyList;
        this.$emit("getAllData", {
          cityList: this.cityList,
          countyList: this.countyList
        });
        if (this.cityList.length == 1) {
          // console.log(this.cityList)
          this.parame.city = this.cityList[0].AreaCode;
          this.changeCity(this.parame.city);
        }
      });
    }
  },
  mounted() {
    this.getCDTable();
    this.getUserAreaInfo();
  }
};
</script>

<style scoped>
.timeClass {
  width: 100%;
}
.InputClass {
  width: 80%;
  margin-left: 5px;
}
.flex {
  display: flex;
  justify-content: center;
}
</style>