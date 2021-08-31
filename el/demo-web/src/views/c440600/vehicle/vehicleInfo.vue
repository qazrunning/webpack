<template>
  <div style="overflow:hidden auto;position:relative" class="baseInfo">
    <!-- <Spin fix v-if="spinShow"></Spin> -->
    <!-- <Spin size="large" fix v-if="spinShow"></Spin> -->
    <Row type="flex" justify="center" align="top" class="code-row-bg" :gutter="8">
      <i-Col :xxl="6" :xl="12" :lg="12" :md="24">
        <Card dis-hover style="height:293px;overflow:hidden auto">
          <!-- 编辑 -->
          <div style="text-align:center;padding:0 10px;box-size:border-box" v-show="isEditOwnerInfo == true">
            <div style="margin:6px 0 8px 0;">
              <span>
                <img src="exhaust/img/error.gif" style="width:100px;height:80px;border-radius:50%;" @error="onError($event)" />
              </span>
              <div style="position: absolute; right: 20px;  top: 28px;" v-show="hasAuthority">
                <Button style="float:center; margin-top:5px" type="success" shape="circle" size="small" @click="saveVehOwnerInfo">保存</Button>
                <Button style="float:center; margin:5px 2px 0 0;" type="error" shape="circle" size="small" @click="isEditOwnerInfo=false">取消</Button>
              </div>
            </div>
            <Form label-position="right" :label-width="80" :model="vehicleData" :rules="vehicleDataRules" ref="vehicleDataForm">
              <FormItem label="车主姓名">
                <Input v-model="vehicleData.OwnerName" />
              </FormItem>
              <FormItem label="车主电话" prop="Tel">
                <Input v-model="vehicleData.Tel" />
              </FormItem>
              <FormItem label="联系地址">
                <Input v-model="vehicleData.Address" />
              </FormItem>
              <FormItem label="证件类型">
                <Select v-model="vehicleData.CredentialsType">
                  <Option v-for="(item,index) in initform.CD_CredentialsType " :value="item.CodeValue" :key="index">{{ item.CodeName }}</Option>
                </Select>
              </FormItem>
              <FormItem label="证件号码" prop="CredentialsNum">
                <Input v-model="vehicleData.CredentialsNum" />
              </FormItem>
            </Form>
          </div>
          <!-- 查看 -->
          <div style="text-align:center;" v-show="isEditOwnerInfo==false">
            <div style="margin:15px 0 8px 0;">
              <span>
                <img src="exhaust/img/error.gif" style="width:100px;height:80px;border-radius:50%;" @error="onError($event)" />
              </span>
              <div style="position: absolute; right: 20px;  top: 28px;" v-show="hasAuthority">
                <Button style="float:center;" type="primary" shape="circle" size="small" @click="isEditOwnerInfo=true">编辑</Button>
              </div>
            </div>
            <p style="font-weight:bold;margin-bottom:2px">
              <!-- encrypt_value为true时，加密显示 -->
              <span v-if="encrypt_value">{{vehicleData.OwnerName == null ? vehicleData.OwnerName : vehicleData.OwnerName.split('').fill('*').join('') }}</span>
              <span v-else>{{vehicleData.OwnerName}}</span>
            </p>
            <p style="margin-bottom:2px">
              <span v-if="encrypt_value">{{vehicleData.Tel == null ? vehicleData.Tel : vehicleData.Tel.split('').fill('*').join('')}}</span>
              <span v-else>{{vehicleData.Tel}}</span>
            </p>
            <p :class="isEditOwnerInfo?'OwnerInfoTwo':'OwnerInfo'">
              <span style="font-weight:bold;">联系地址：</span>
              <span v-if="encrypt_value">{{vehicleData.Address == null ? vehicleData.Address : vehicleData.Address.split('').fill('*').join('')}}</span>
              <span v-else>{{vehicleData.Address}}</span>
            </p>
            <p :class="isEditOwnerInfo?'OwnerInfoTwo':'OwnerInfo'">
              <span style="font-weight:bold;">证件类型：</span>
              <span>{{returncodename(this.initform.CD_CredentialsType,this.vehicleData.CredentialsType)}}</span>
            </p>
            <p :class="isEditOwnerInfo?'OwnerInfoTwo':'OwnerInfo'">
              <span style="font-weight:bold;">证件号码：</span>
              <span v-if="encrypt_value">{{vehicleData.CredentialsNum == null ? vehicleData.CredentialsNum : vehicleData.CredentialsNum.split('').fill('*').join('')}}</span>
              <span v-else>{{vehicleData.CredentialsNum}}</span>
            </p>
          </div>
        </Card>
      </i-Col>
      <viewer :images="ImgForm">
        <i-Col :xxl="6" :xl="12" :lg="12" :md="24">
          <Card dis-hover style="padding-top:16px;height:293px;overflow:hidden">
            <img :src="imgData.xsz" style="max-height:220px" @error="onError($event)" />
            <p style="font-weight:bold;line-height: 32px;">行驶证</p>
          </Card>
        </i-Col>
        <i-Col :xxl="6" :xl="12" :lg="12" :md="24">
          <Card dis-hover style="padding-top:16px;height:293px;overflow:hidden">
            <img :src="imgData.sfz" style="max-height:220px" @error="onError($event)" />
            <p style="font-weight:bold;line-height: 32px;">身份证</p>
          </Card>
        </i-Col>
        <i-Col :xxl="6" :xl="12" :lg="12" :md="24">
          <Card dis-hover style="padding-top:16px;height:293px;overflow:hidden">
            <img :src="imgData.djz" style="max-height:220px" @error="onError($event)" />
            <p style="font-weight:bold;line-height: 32px;">登记证</p>
          </Card>
        </i-Col>
      </viewer>
    </Row>
    <Row type="flex" justify="center" class="code-row-bg" :gutter="16">
      <!-- 编辑 -->
      <div v-show="isEditBaseInfo == true">
        <i-Col :md="24" :sm="24" style="margin-top:15px;">
          <Card dis-hover>
            <p slot="title" style="text-align:left;">
              <span class="title">车辆基本信息</span>
              <Button style="float:right;" type="error" shape="circle" size="small" @click="isEditBaseInfo=false">取消</Button>
              <Button style="float:right;" type="success" shape="circle" size="small" @click="saveVecBaseInfo">保存</Button>
            </p>
            <div style="width:100%;padding-left:10px;">
              <Form label-position="right" :label-width="100">
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label="号牌号码">
                    <Input v-model="vehicleData.VLPN"></Input>
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label="车架号">
                    <Input v-model="vehicleData.VIN" />
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label="车牌颜色">
                    <Select v-model="vehicleData.VLPNColor">
                      <Option v-for="(item,index) in initform.CD_VLPNColor" :value="item.CodeValue" :key="index">{{ item.CodeName }}</Option>
                    </Select>
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label="车辆型号">
                    <Input v-model="vehicleData.IUVTYPE" />
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label="发动机型号">
                    <Input v-model="vehicleData.IUETYPE" />
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label="排放标准" class="esissionStandard">
                    <Select v-model="vehicleData.EmissionStandard" style="width:60%;">
                      <Option v-for="(item,index) in initform.CD_EmissionStandard" :value="item.CodeValue" :key="index">{{ item.CodeName }}</Option>
                    </Select>
                    <Button style="margin-left:6px;" type="primary" @click="handleModel">排放标准</Button>
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label="初次登记日期">
                    <DatePicker type="date" v-model="vehicleData.VRDATE" style="width:100%"></DatePicker>
                  </FormItem>
                </i-Col>

                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label="出厂日期">
                    <DatePicker type="date" v-model="vehicleData.ProductDate" style="width:100%"></DatePicker>
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label=" 环保业务状态">
                    <Select v-model="vehicleData.EStatus">
                      <Option v-for="(item,index) in initform.CD_EStatus" :value="item.CodeValue" :key="index">{{ item.CodeName }}</Option>
                    </Select>
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label="机动车生产厂家">
                    <Input v-model="vehicleData.IUVMANU" />
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label="品牌">
                    <Input v-model="vehicleData.FactoryPlateModel" />
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label=" 车辆性质">
                    <Select v-model="vehicleData.VehicleKind">
                      <Option v-for="(item,index) in initform.CD_VehicleKind" :value="item.CodeValue" :key="index">{{ item.CodeName }}</Option>
                    </Select>
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label="最大总质量(kg)">
                    <Input v-model="vehicleData.VML" />
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label="整备质量">
                    <Input v-model="vehicleData.KerbMass" />
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label="基准质量(kg)">
                    <Input v-model="vehicleData.BenchmarkMass" />
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label="车辆类型">
                    <Select v-model="vehicleData.GAVType">
                      <Option v-for="(item,index) in initform.CD_GAVType" :value="item.CodeValue" :key="index">{{ item.CodeName }}</Option>
                    </Select>
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label="座位数">
                    <Input v-model="vehicleData.RatedSeats" />
                  </FormItem>
                </i-Col>

                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label="燃油类型">
                    <Select v-model="vehicleData.FuelType">
                      <Option v-for="(item,index) in initform.CD_FuelType" :value="item.CodeValue" :key="index">{{ item.CodeName }}</Option>
                    </Select>
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label="使用性质">
                    <Select v-model="vehicleData.UseOfAuto">
                      <Option v-for="(item,index) in initform.CD_UseOfAuto" :value="item.CodeValue" :key="index">{{ item.CodeName }}</Option>
                    </Select>
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label="发动机号码">
                    <Input v-model="vehicleData.EngineNum" />
                  </FormItem>
                </i-Col>

                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label="是否为历史数据">
                    <Select v-model="vehicleData.IsInValid">
                      <Option v-for="(item,index) in cdform" :value="item.CodeValue" :key="index">{{item.CodeName}}</Option>
                    </Select>
                  </FormItem>
                </i-Col>

                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label="排量(L)">
                    <Input v-model="vehicleData.EDSPL" />
                  </FormItem>
                </i-Col>

                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label="发动机额定功率(kW)">
                    <Input v-model="vehicleData.EnginePower" />
                  </FormItem>
                </i-Col>
                <i-Col span="24" class="VecBaseInfo">
                  <FormItem label="车辆备注">
                    <Input v-model="vehicleData.Remarks" />
                  </FormItem>
                </i-Col>

                <Divider orientation="left" style="padding-top:10px">车辆其他信息</Divider>

                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label="车辆状态">
                    <Select multiple v-model="vehicleData.VStatus">
                      <Option v-for="(item,index) in initform.CD_VStatus" :value="item.CodeValue" :key="index">{{ item.CodeName }}</Option>
                    </Select>
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label=" 车辆类型">
                    <Select v-model="vehicleData.VehicleType">
                      <Option v-for="(item,index) in initform.CD_VehicleType" :value="item.CodeValue" :key="index">{{ item.CodeName }}</Option>
                    </Select>
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label=" 车辆登记日期">
                    <DatePicker type="date" v-model="vehicleData.RegistDate" style="width:100%"></DatePicker>
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label=" 营运性质">
                    <Select v-model="vehicleData.OCHA">
                      <Option v-for="(item,index) in initform.CD_OCHA" :value="item.CodeValue" :key="index">{{ item.CodeName }}</Option>
                    </Select>
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label="机动车大类">
                    <Select v-model="vehicleData.VehicleBigType">
                      <Option v-for="(item,index) in initform.CD_VehicleBigType" :value="item.CodeValue" :key="index">{{ item.CodeName }}</Option>
                    </Select>
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label=" 载客载货">
                    <Select v-model="vehicleData.PG">
                      <Option v-for="(item,index) in initform.CD_PG" :value="item.CodeValue" :key="index">{{ item.CodeName }}</Option>
                    </Select>
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label="发动机额定转速">
                    <Input v-model="vehicleData.EngineRatedSpeed" />
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label="供油方式">
                    <Select v-model="vehicleData.OilSupplyWay">
                      <Option v-for="(item,index) in initform.CD_OilSupplyWay" :value="item.CodeValue" :key="index">{{ item.CodeName }}</Option>
                    </Select>
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label="进气方式">
                    <Select v-model="vehicleData.IntakeWay">
                      <Option v-for="(item,index) in initform.CD_IntakeWay" :value="item.CodeValue" :key="index">{{ item.CodeName }}</Option>
                    </Select>
                  </FormItem>
                </i-Col>

                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label="里程表读数">
                    <Input v-model="vehicleData.Mileage" />
                  </FormItem>
                </i-Col>

                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label=" 车辆所属省份">
                    <Select v-model="vehicleData.Province" @on-change="selectCity(vehicleData.Province,'1')">
                      <Option v-for="(item,index) in provinceList" :value="item.CodeValue" :key="index">{{ item.CodeName }}</Option>
                    </Select>
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label=" 车辆所属城市">
                    <Select v-model="vehicleData.City" @on-change="selectCity(vehicleData.City,'1')">
                      <Option v-for="(item,index) in cityOption" :value="item.CodeValue" :key="index">{{ item.CodeName }}</Option>
                    </Select>
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label=" 车辆所属县/区">
                    <Select v-model="vehicleData.County">
                      <Option v-for="(item,index) in AreaOption" :value="item.CodeValue" :key="index">{{ item.CodeName }}</Option>
                    </Select>
                  </FormItem>
                </i-Col>

                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label="发动机生产企业">
                    <Input v-model="vehicleData.IUEMANU" />
                  </FormItem>
                </i-Col>

                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label="是否本地检车">
                    <Select v-model="vehicleData.IsLocalInspection">
                      <Option v-for="(item,index) in cdform" :value="item.CodeValue" :key="index">{{item.CodeName}}</Option>
                    </Select>
                  </FormItem>
                </i-Col>

                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label="是否为进口车">
                    <Select v-model="vehicleData.IsImportedCar">
                      <Option v-for="(item,index) in cdform" :value="item.CodeValue" :key="index">{{item.CodeName}}</Option>
                    </Select>
                  </FormItem>
                </i-Col>

                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label=" 催化转化器型号">
                    <Input v-model="vehicleData.CatalyticConvertersAndCorp" />
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label=" 排气管数量">
                    <Input v-model="vehicleData.GasVentCount" />
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label=" 单车轴重">
                    <Input v-model="vehicleData.AxleWeight" />
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label=" 是否装有OBD">
                    <Select v-model="vehicleData.HasOBD">
                      <Option v-for="(item,index) in cdform" :value="item.CodeValue" :key="index">{{item.CodeName}}</Option>
                    </Select>
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label=" 是否双燃料">
                    <Select v-model="vehicleData.IsDoubleFuel">
                      <Option v-for="(item,index) in cdform" :value="item.CodeValue" :key="index">{{item.CodeName}}</Option>
                    </Select>
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label=" 是否有氧传感器">
                    <Select v-model="vehicleData.HasOxygenSensor">
                      <Option v-for="(item,index) in cdform" :value="item.CodeValue" :key="index">{{item.CodeName}}</Option>
                    </Select>
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label=" 是否有三元催化装置">
                    <Select v-model="vehicleData.HasCCA">
                      <Option v-for="(item,index) in cdform" :value="item.CodeValue" :key="index">{{item.CodeName}}</Option>
                    </Select>
                  </FormItem>
                </i-Col>

                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label=" 强制报废年限">
                    <DatePicker type="date" v-model="vehicleData.AbandonedYear" style="width:100%"></DatePicker>
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label=" 变速器型式">
                    <Select v-model="vehicleData.VariableForm">
                      <Option v-for="(item,index) in initform.CD_VariableForm" :value="item.CodeValue" :key="index">{{ item.CodeName }}</Option>
                    </Select>
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label=" 原号牌号码">
                    <Input v-model="vehicleData.OldVLPN" />
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label="  底盘型号">
                    <Input v-model="vehicleData.ChassisType" />
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label="档位数">
                    <Input v-model="vehicleData.GearCount" />
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label=" 发动机冲程数">
                    <Input v-model="vehicleData.StrokeCount" />
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label=" 气缸数">
                    <Input v-model="vehicleData.CylinderCount" />
                  </FormItem>
                </i-Col>

                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label=" 驱动方式">
                    <Select v-model="vehicleData.DriveForm">
                      <Option v-for="(item,index) in initform.CD_DriveForm" :value="item.CodeValue" :key="index">{{ item.CodeName }}</Option>
                    </Select>
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label="车轮型号">
                    <Input v-model="vehicleData.TyreType" />
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label="原车主">
                    <Input v-model="vehicleData.OldOwner" />
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label="原省">
                    <Select v-model="vehicleData.OldProv" @on-change="selectCity(vehicleData.OldProv,'0')">
                      <!-- <Option v-for="(item,index) in initform.provinceList" :value="item.CodeValue" :key="index">{{ item.CodeName }}</Option> -->
                      <Option v-for="(item,index) in provinceList" :value="item.CodeValue" :key="index">{{ item.CodeName }}</Option>
                    </Select>
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label="原市">
                    <Select v-model="vehicleData.OldCity" @on-change="selectCity(vehicleData.OldCity,'0')">
                      <Option v-for="(item,index) in oldCityOption" :value="item.CodeValue" :key="index">{{ item.CodeName }}</Option>
                    </Select>
                  </FormItem>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  <FormItem label="原县">
                    <Select v-model="vehicleData.OldCounty">
                      <Option v-for="(item,index) in oldAreaOption" :value="item.CodeValue" :key="index">{{ item.CodeName }}</Option>
                    </Select>
                  </FormItem>
                </i-Col>
              </Form>
            </div>
          </Card>
        </i-Col>
      </div>
      <!-- 查看 -->
      <div v-show="isEditBaseInfo == false">
        <i-Col :md="24" :sm="24" style="margin-top:15px;">
          <Card dis-hover>
            <p slot="title" style="text-align:left;">
              <span class="title">车辆基本信息</span>
              <Button v-show="hasAuthority==true" style="float:right;" type="primary" shape="circle" size="small" @click="isEditBaseInfo=true">编辑</Button>
            </p>
            <div style="width:100%;padding-left:10px;">
              <Row style="text-align:left;" :gutter="8">
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  号牌号码：
                  <span>{{vehicleData.VLPN}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  车架号：
                  <span v-if="encrypt_value">{{vehicleData.VIN == null ? vehicleData.VIN : vehicleData.VIN.split('').fill('*').join('')}}</span>
                  <span v-else>{{vehicleData.VIN}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  车牌颜色：
                  <span>{{returncodename(this.initform.CD_VLPNColor,this.vehicleData.VLPNColor)}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  车辆型号：
                  <span>{{vehicleData.IUVTYPE}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  发动机型号：
                  <span>{{vehicleData.IUETYPE}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  排放标准：
                  <span style="width:80%">{{returncodename(this.initform.CD_EmissionStandard,this.vehicleData.EmissionStandard)}}</span>
                  <Button style="margin-left:20px" type="primary" size="small" @click="handleModel">排放标准</Button>
                </i-Col>

                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  初次登记日期：
                  <span>{{vehicleData.VRDATE | dataFormat("yyyy-MM-dd")}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  出厂日期：
                  <span>{{vehicleData.ProductDate | dataFormat("yyyy-MM-dd")}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  环保业务状态：
                  <span>{{returncodename(this.initform.CD_EStatus,this.vehicleData.EStatus)}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  机动车生产厂家：
                  <span>{{vehicleData.IUVMANU}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  品牌：
                  <span>{{vehicleData.FactoryPlateModel}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  车辆性质：
                  <span>{{returncodename(this.initform.CD_VehicleKind,this.vehicleData.VehicleKind)}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  最大总质量(kg)：
                  <span>{{vehicleData.VML}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  整备质量：
                  <span>{{vehicleData.KerbMass}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  基准质量(kg)：
                  <span>{{vehicleData.BenchmarkMass}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  车辆类型：
                  <span>{{returncodename(this.initform.CD_GAVType,this.vehicleData.GAVType)}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  座位数：
                  <span>{{vehicleData.RatedSeats}}</span>
                </i-Col>

                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  燃油类型：
                  <span>{{returnMultiple(this.initform.CD_FuelType,this.vehicleData.FuelType)}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  使用性质：
                  <span>{{returncodename(this.initform.CD_UseOfAuto,this.vehicleData.UseOfAuto)}}</span>
                </i-Col>

                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  发动机号码：
                  <span>{{vehicleData.EngineNum}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  是否为历史数据：
                  <span>{{vehicleData.IsInValid==1?"是":vehicleData.IsInValid==0?'否':''}}</span>
                </i-Col>

                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  排量(L)：
                  <span>{{new Number(vehicleData.EDSPL).toFixed(2)}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  发动机额定功率(kW)：
                  <span>{{new Number(vehicleData.EnginePower).toFixed(2)}}</span>
                </i-Col>
                <i-Col span="24" class="VecBaseInfo">
                  车辆备注：
                  <span>{{vehicleData.Remarks}}</span>
                </i-Col>
                <Divider orientation="left">车辆其他信息</Divider>

                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  车辆状态：
                  <span>{{returnVstatusName(this.initform.CD_VStatus)}}</span>
                </i-Col>

                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  车辆类型：
                  <span>{{returncodename(this.initform.CD_VehicleType,this.vehicleData.VehicleType)}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  车辆登记日期：
                  <span>{{vehicleData.RegistDate | dataFormat("yyyy-MM-dd")}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  营运性质：
                  <span>{{returncodename(this.initform.CD_OCHA,this.vehicleData.OCHA)}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  机动车大类：
                  <span>{{returncodename(this.initform.CD_VehicleBigType,this.vehicleData.VehicleBigType)}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  载客载货：
                  <span>{{returncodename(this.initform.CD_PG,this.vehicleData.PG)}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  发动机额定转速：
                  <span>{{vehicleData.EngineRatedSpeed}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  供油方式：
                  <span>{{returncodename(this.initform.CD_OilSupplyWay,this.vehicleData.OilSupplyWay)}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  进气方式：
                  <span>{{returncodename(this.initform.CD_IntakeWay,this.vehicleData.IntakeWay)}}</span>
                </i-Col>

                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  里程表读数：
                  <span>{{vehicleData.Mileage}}</span>
                </i-Col>

                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  车辆所属省份：
                  <span>{{returncodename(this.initform.Area,this.vehicleData.Province)}}</span>
                  <!-- <span>{{this.vehicleData.Province}}</span> -->
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  车辆所属城市：
                  <span>{{returncodename(this.initform.Area,this.vehicleData.City)}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  车辆所属县/区：
                  <span>{{returncodename(this.initform.Area,this.vehicleData.County)}}</span>
                </i-Col>

                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  发动机生产企业：
                  <span>{{vehicleData.IUEMANU}}</span>
                </i-Col>

                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  是否本地检车：
                  <span>{{vehicleData.IsLocalInspection==1?"是":vehicleData.IsLocalInspection==0?"否":''}}</span>
                </i-Col>

                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  是否为进口车：
                  <span>{{vehicleData.IsImportedCar==1?"是":vehicleData.IsImportedCar==0?"否":''}}</span>
                </i-Col>

                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  催化转化器型号：
                  <span>{{vehicleData.CatalyticConvertersAndCorp}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  排气管数量：
                  <span>{{vehicleData.GasVentCount}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  单车轴重：
                  <span>{{vehicleData.AxleWeight}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  是否装有OBD：
                  <span>{{vehicleData.HasOBD==1?"是":vehicleData.HasOBD==0?'否':''}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  是否双燃料：
                  <span>{{vehicleData.IsDoubleFuel==1?"是":vehicleData.IsDoubleFuel==0?'否':''}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  是否有氧传感器：
                  <span>{{vehicleData.HasOxygenSensor==1?"是":vehicleData.HasOxygenSensor==0?"否":""}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  是否有三元催化装置：
                  <span>{{vehicleData.HasCCA==1?"是":vehicleData.HasCCA==0?"否":''}}</span>
                </i-Col>

                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  强制报废年限：
                  <span>{{vehicleData.AbandonedYear | dataFormat("yyyy-MM-dd")}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  变速器型式：
                  <span>{{returncodename(this.initform.CD_VariableForm,this.vehicleData.VariableForm)}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  原号牌号码：
                  <span>{{vehicleData.OldVLPN}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  底盘型号：
                  <span>{{vehicleData.ChassisType}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  档位数：
                  <span>{{vehicleData.GearCount}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  发动机冲程数：
                  <span>{{vehicleData.StrokeCount}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  气缸数：
                  <span>{{vehicleData.CylinderCount}}</span>
                </i-Col>

                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  驱动方式：
                  <span>{{returncodename(this.initform.CD_DriveForm,this.vehicleData.DriveForm)}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  车轮型号：
                  <span>{{vehicleData.TyreType}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  原车主：
                  <span>{{vehicleData.OldOwner}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  原省：
                  <span>{{returncodename(this.initform.Area,this.vehicleData.OldProv)}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  原市：
                  <span>{{returncodename(this.initform.Area,this.vehicleData.OldCity)}}</span>
                </i-Col>
                <i-Col :xxl="8" :xl="12" :lg="12" :md="24" class="VecBaseInfo">
                  原县：
                  <span>{{returncodename(this.initform.Area,this.vehicleData.OldCounty)}}</span>
                </i-Col>
              </Row>
            </div>
          </Card>
        </i-Col>
      </div>
    </Row>
    <Row type="flex" justify="center" class="code-row-bg" :gutter="8">
      <i-Col :md="24" :sm="24" style="margin-top:15px;">
        <Card dis-hover>
          <p slot="title" style="text-align:left;">
            <span class="title">其他信息</span>
          </p>
          <div>
            <CellGroup>
              <p class="OtherInfo">
                <Row>
                  <Col :xxl="6" :xl="12" :lg="12" :md="24">
                    <span style="font-weight:bold;">录入人：</span>
                    {{vehicleData.Creater}}
                  </Col>
                  <Col :xxl="6" :xl="12" :lg="12" :md="24">
                    <span style="font-weight:bold;">录入时间：</span>
                    {{vehicleData.CreateTime | dataFormat("yyyy-MM-dd hh:mm:ss")}}
                  </Col>
                  <Col :xxl="6" :xl="12" :lg="12" :md="24">
                    <span style="font-weight:bold;">最后修改时间：</span>
                    {{vehicleData.LastUpdateTime | dataFormat("yyyy-MM-dd hh:mm:ss")}}
                  </Col>
                  <Col :xxl="6" :xl="12" :lg="12" :md="24">
                    <span style="font-weight:bold;">数据来源：</span>
                    {{vehicleData.DataSources}}
                  </Col>
                  <Col :xxl="6" :xl="12" :lg="12" :md="24">
                    <span style="font-weight:bold;">数据更新来源：</span>
                    {{vehicleData.UpdateDataSources}}
                  </Col>
                </Row>
              </p>
            </CellGroup>
          </div>
        </Card>
      </i-Col>
    </Row>
    <!-- 车型审核 -->
    <emission-info ref="emiss_div" :hasAuthority="hasAuthority" @getEmissionStandard="getEmissionStandard" @changeAllInfo="changeAllInfo"></emission-info>
  </div>
</template>
<script>
import renderMessege from "../../../HJ/components/message";
import { getCDData } from "../../../HJ/utils/utils";
import EmissionInfo from "../../../HJ/views/businessAudits/drawInfo/EmissionInfo";
export default {
  name: "VehicleInfo",
  components: {
    EmissionInfo
  },
  data() {
    const validateZW = (rule, value, callback) => {
      if (value) {
        // console.log('验证------', rule);
        if (/[\u4E00-\u9FA5]/g.test(value)) {
          this.$Notice.error({
              title: rule.message
          });
          callback(true)
        } else {
          callback()
        }
      }
      callback()
    };
    return {
      // encrypt_value: false,
      isEditBaseInfo: false, //是否编辑车辆基本信息，默认为false,
      isEditOwnerInfo: false, //是否编辑车户信息，默认为false
      initform: {},
      height: 0,
      cdform: [
        {
          CodeValue: "0",
          CodeName: "否"
        },
        {
          CodeValue: "1",
          CodeName: "是"
        }
      ],
      // spinShow:true,
      ImgForm: [],
      imgData: { djz: "", xsz: "", sfz: "" },
      provinceList: [], //省
      cityOption: [], //市
      AreaOption: [], //区
      oldCityOption: [], //原市
      oldAreaOption: [],//原区
      CD_Name: [
        "CD_VLPNColor",
        "CD_GAVType",
        "CD_EmissionStandard",
        "CD_UseOfAuto",
        "CD_FuelType",
        "CD_OilSupplyWay",
        "CD_IntakeWay",
        "CD_OCHA",
        "CD_EStatus",
        "CD_VehicleBigType",
        "CD_VStatus",
        "CD_PG",
        "CD_VariableForm",
        "CD_VehicleKind",
        "CD_VehicleType",
        "CD_DriveForm",
        "CD_CredentialsType",
        "Area"
      ], //需要获取的CD表
      vehicleDataRules: {
        Tel: [
          { validator: validateZW, message: "联系电话不能包含中文", trigger: 'blur' }
        ],
        CredentialsNum: [
          { validator: validateZW, message: "证件号码不能包含中文", trigger: 'blur' }
        ]
      }
    };
  },
  props: {
    Vecid: {
      type: Number
    },
    vehicleData: {
      type: Object
    },
    hasAuthority: {
      type: Boolean
    },
    encrypt_value:{
      type:Boolean,
    }
    // spinShow: {
    //   type: Boolean
    // }
  },
  methods: {
    // 获取否加密车辆信息的敏感信息的value值
    async getIsEncryptVehicleInfo() {
      let res = await this.$curl.get("api/hj/getIsEncryptVehicleInfo")
      if (res.encrypt_value == "false") {
        this.encrypt_value = false
      } else {
        this.encrypt_value = true
      }
    },

    arrayBufferToBase64(buffer) {
      //buffer 转base64方法
      var binary = "";
      var bytes = new Uint8Array(buffer);
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
    },
    onError(event) {
      event.target.src = "static/img/imgError.png";
    },
    //获取图片信息
    getImgList() {
      const _this = this;
      _this.imgData = { djz: "", xsz: "", sfz: "" };
      _this.isEditBaseInfo = false;
      _this.isEditOwnerInfo = false;
      this.$curl
        .get("api/hj/GetVehicleimg", { param: this.Vecid })
        .then(res => {

          //桂CV6993
          // this.spinShow = false;
          _this.imgData.sfz = res.data.sfz?res.data.sfz.Url:''
          _this.imgData.xsz = res.data.xsz?res.data.xsz.Url:''
          _this.imgData.djz = res.data.djz?res.data.djz.Url:''
      
          // this.spinShow = !this.spinShow;
        })
    },
    //保存车辆基本信息
    saveVecBaseInfo() {
      const _this = this;
      this.$curl
        .post("api/hj/saveChangeInfoAndLog", {
          params: this.vehicleData
        })
        .then(function (res) {
          const { result } = res;
          if (result) {
            _this.$Message.success(res.msg);
            _this.$emit("refreshList");
            _this.isEditBaseInfo = false;
          }
        })
        .catch(err => {
          _this.$Message.success("保存车辆信息失败！");
          _this.isEditBaseInfo = true;
        });
    },
    returnVstatusName(codevalue) {
      if (this.vehicleData.VStatus == undefined || this.vehicleData.VStatus == "")
        return "";        
      if ( this.vehicleData.VStatus.length >= 2) {

        let list1 = this.vehicleData.VStatus.join('');
let list=list1.split('')
        let names = list.map(item => {
          return this.returncodename(
            codevalue,
            item
          );
        })
       let name=names.join(',')
        
        return name ;
      }
      let name = this.returncodename(
        codevalue,
        this.vehicleData.VStatus
      );
      return name;
    },
    returncodename(namelist, codevalue) {
      if (namelist) {
        let CodeName = "";
        namelist.forEach(item => {
          if (item.CodeValue == codevalue) CodeName = item.CodeName;
        });
        return CodeName;
      }
    },
    returnMultiple(namelist, codevalue) {
      if (codevalue) {
        let arrs = String(codevalue).split("");
        if (namelist) {
          let CodeName = [];
          namelist.forEach(item => {
            arrs.forEach(aitem => {
              if (item.CodeValue == aitem) CodeName.push(item.CodeName);
            });
          });
          return CodeName.join(",");
        }
      }
    },
    //保存编辑的车主信息
    saveVehOwnerInfo() {
      this.$refs['vehicleDataForm'].validate((valid) => {
          if (valid) {
              // console.log('验证成功');
              const params = {
              OwnerName: this.vehicleData.OwnerName,
              Tel: this.vehicleData.Tel,
              Address: this.vehicleData.Address,
              CredentialsType: this.vehicleData.CredentialsType,
              CredentialsNum: this.vehicleData.CredentialsNum,
              VehicleID: this.Vecid,
            };
            this.$curl.post("api/hj/SetVehOwnerInfo", { params: params }).then(json => {
              this.$Message.success(json.msg);
            });
            this.isEditOwnerInfo = false;
            this.$emit("refreshList");
          } else {
          }
      })
    },

    async getOption() {
      const _this = this;
      if (JSON.stringify(_this.initform) == "{}") {
        await getCDData(this, [
          {
            tableName: "CD_VLPNColor",
            columns: "CodeValue,CodeName"
          },
          {
            tableName: "CD_GAVType",
            columns: "CodeValue,CodeName"
          },
          {
            tableName: "CD_EmissionStandard",
            columns: "CodeValue,CodeName"
          },
          {
            tableName: "CD_UseOfAuto",
            columns: "CodeValue,CodeName"
          },
          {
            tableName: "CD_FuelType",
            columns: "CodeValue,CodeName"
          },
          {
            tableName: "CD_OilSupplyWay",
            columns: "CodeValue,CodeName"
          },
          {
            tableName: "CD_IntakeWay",
            columns: "CodeValue,CodeName"
          },
          {
            tableName: "CD_OCHA",
            columns: "CodeValue,CodeName"
          },
          {
            tableName: "CD_EStatus",
            columns: "CodeValue,CodeName"
          },
          {
            tableName: "CD_VehicleBigType",
            columns: "CodeValue,CodeName"
          },
          {
            tableName: "CD_VStatus",
            columns: "CodeValue,CodeName"
          },
          {
            tableName: "CD_PG",
            columns: "CodeValue,CodeName"
          },
          {
            tableName: "CD_VariableForm",
            columns: "CodeValue,CodeName"
          },
          {
            tableName: "CD_VehicleKind",
            columns: "CodeValue,CodeName"
          },
          {
            tableName: "CD_VehicleType",
            columns: "CodeValue,CodeName"
          },
          {
            tableName: "CD_DriveForm",
            columns: "CodeValue,CodeName"
          },
          {
            tableName: "CD_CredentialsType",
            columns: "CodeValue,CodeName",
          },
          {
            tableName: "Area",
            columns: "AreaCode as CodeValue,AreaName as CodeName"
          }
        ]).then(function (res) {
          if (res.state) {
            res.data.map((d, index) => {
              if (d[0].hasOwnProperty('IsAvailable')) d = d.filter(d => d.IsAvailable == 1);
              _this.initform[_this.CD_Name[index]] = d;
            });
          }
        });
        this.getDefaultCity();
      }
    },
    //从缓存中读取cd表或者库中
    getDBinfoByMultipt() {
      const self = this;
      if (self.$getDBTable) {
        self.$getDBTable(self.CD_Name).then(res => {

          let data = [];
          res.forEach((item, index) => {
            data = JSON.parse(item);
            if (data[0].hasOwnProperty('IsAvailable'))
              data = data.filter(d => d.IsAvailable == 1);
            self.initform[self.CD_Name[index]] = data;
          })
        })
      } else {
        self.getOption();
      }
    },
    //拿取默认市区
    getDefaultCity() {
      const _this = this;
      if (_this.initform && _this.initform.Area) {
        _this.provinceList = [];
        _this.cityOption = [];
        _this.AreaOption = [];
        _this.oldCityOption = [];
        _this.oldAreaOption = [];
        _this.initform.Area.forEach(a => {
          if(a.AreaCode){
    a.CodeValue=JSON.parse(JSON.stringify(a.AreaCode));
          delete a.AreaCode;
          }
          if (a.CodeValue.indexOf("0000") != -1) {
            _this.provinceList.push(a);
          }
          if (_this.vehicleData.Province) {
            if (
              a.CodeValue.indexOf("0000") == -1 &&
              a.CodeValue.slice(4, 6).indexOf("00") != -1 &&
              a.CodeValue.slice(0, 2) == _this.vehicleData.Province.slice(0, 2)
            ) {
              _this.cityOption.push(a);
            }
            if (_this.vehicleData.City) {
              if (
                a.CodeValue.indexOf("0000") == -1 &&
                a.CodeValue.slice(4, 6).indexOf("00") == -1 &&
                a.CodeValue.slice(0, 4) == _this.vehicleData.City.slice(0, 4)
              ) {
                _this.AreaOption.push(a);
              }
            }
          }
          if (_this.vehicleData.OldProv) {
            if (
              a.CodeValue.indexOf("0000") == -1 &&
              a.CodeValue.slice(4, 6).indexOf("00") != -1 &&
              a.CodeValue.slice(0, 2) == _this.vehicleData.OldProv.slice(0, 2)
            ) {
              _this.oldCityOption.push(a);
            }
            if (_this.vehicleData.OldCity) {
              if (
                a.CodeValue.indexOf("0000") == -1 &&
                a.CodeValue.slice(4, 6).indexOf("00") == -1 &&
                a.CodeValue.slice(0, 4) == _this.vehicleData.OldCity.slice(0, 4)
              ) {
                _this.oldAreaOption.push(a);
              }
            }
          }
        });
      }
    },
    //省市联动
    selectCity(value, type) {
      if (value) {
        if (value.indexOf("0000") != -1) {
          //省
          type == 1 ? (this.cityOption = []) : (this.oldCityOption = []);
          this.initform.Area.forEach(a => {
            if (
              a.CodeValue.indexOf("0000") == -1 &&
              a.CodeValue.slice(4, 6).indexOf("00") != -1 &&
              a.CodeValue.slice(0, 2) == value.slice(0, 2) &&
              a.CodeValue != value
            ) {
              type == 1 ? this.cityOption.push(a) : this.oldCityOption.push(a);
            }
          });
        } else if (value.slice(4, 6).indexOf("00") != -1) {
          //市
          type == 1 ? (this.AreaOption = []) : (this.oldAreaOption = []);
          this.initform.Area.forEach(a => {
            if (
              a.CodeValue.indexOf("0000") == -1 &&
              a.CodeValue.slice(4, 6).indexOf("00") == -1 &&
              a.CodeValue.slice(0, 4) == value.slice(0, 4) &&
              a.CodeValue != value
            ) {
              type == 1 ? this.AreaOption.push(a) : this.oldAreaOption.push(a);
            }
          });
        }
      }
    },
    //车型审核
    handleModel() {
      this.$refs.emiss_div.openModel();
      this.$refs.emiss_div.childMethods(this.vehicleData); //调用子组件方法并传参
    },
    //获取审核的排放标准
    getEmissionStandard(value) {
      if (value) {
        this.vehicleData.EmissionStandard = value;
        if (this.vehicleData.FuelType == 'A') {
          if (value == '00') this.vehicleData.BZTYPE = '02';
          else this.vehicleData.BZTYPE = '01';
        } else if (this.vehicleData.FuelType == 'B') {
          if (value == '00' || value == '01' || value == '02') this.vehicleData.BZTYPE = '02';
          else this.vehicleData.BZTYPE = '01';
        }
        this.saveVecBaseInfo();
      }
    },
    //标准改变对应数据改变
    changeAllInfo(value) {
      this.vehicleData.GAVType = value.GAVType;
      this.vehicleData.VML = value.VML;
      this.vehicleData.RatedSeats = value.RatedSeats;
      this.vehicleData.VRDATE = value.VRDATE;
      this.vehicleData.FuelType = value.FuelType;
      this.vehicleData.HasOBD = value.HasOBD;
      this.vehicleData.EmissionStandard = value.EmissionStandard;
      if (this.vehicleData.FuelType == 'A') {
        if (value.EmissionStandard == '00') this.vehicleData.BZTYPE = '02';
        else this.vehicleData.BZTYPE = '01';
      } else if (this.vehicleData.FuelType == 'B') {
        if (value.EmissionStandard == '00' || value.EmissionStandard == '01' || value.EmissionStandard == '02') this.vehicleData.BZTYPE = '02';
        else this.vehicleData.BZTYPE = '01';
      }
      this.saveVecBaseInfo();
    }
  },
  mounted() {
    // this.getIsEncryptVehicleInfo()
    this.getDBinfoByMultipt();
  },
  created() { },
  watch: {
    vehicleData(newval) {
      if (newval) {
        Object.assign(this.vehicleData, newval);
        this.getDefaultCity();
      }
    },
    'vehicleData.VStatus'(newval) {
      if (newval) {
        if (newval.length >= 2 && typeof (newval) == 'string') {
          let a = newval.split('');
          this.vehicleData.VStatus = a
        }
      } else {
        this.vehicleData.VStatus = newval
      }


    }
  }
}
</script>
<style lang="less" scoped>
.ivu-card /deep/ .ivu-card-body {
  padding: 8px 8px;
}
.ivu-row-flex {
  display: block;
}
.title {
  font-size: 15px;
}
.OwnerInfo {
  text-align: left;
  margin: 0 10px;
  line-height: 26px;
}
.OwnerInfoTwo {
  text-align: center;
  // margin: 0 10px 2px;
  line-height: 26px;
}
.OtherInfo {
  text-align: left;
  margin: 0 10px;
  line-height: 28px;
}
.VecBaseInfo {
  margin: 5px 0px;
  height: 30px;
  line-height: 30px;
  font-weight: bold;
  > span {
    font-weight: normal;
  }
}
.ivu-card-head p {
  height: 24px;
  line-height: 24px;
  /*style="padding-bottom:10px"*/
}
.baseInfo /deep/ .ivu-form-item {
  margin-bottom: 4px;
}
.baseInfo /deep/ .ivu-form-item-label {
  font-weight: bold;
  // font-size: 14px;
}
.esissionStandard /deep/ .ivu-form-item-content {
  text-align: left;
}
.demo-spin-container {
  display: inline-block;
  width: 200px;
  height: 100px;
  position: relative;
  border: 1px solid #eee;
}
</style>
