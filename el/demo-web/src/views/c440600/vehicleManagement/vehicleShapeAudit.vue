<template>
  <div style="height:100%;overflow: hidden auto;">
    <Tabs value="name1">
      <TabPane label="根据车型审核" name="name1">
        <!-- 根据车型审核 -->
        <Card style="margin:6px 16px 16px 16px;">
          <Form :label-width="80" inline>
            <FormItem label="车辆型号">
              <Input v-model="conditions.vehicleType.CLXH" placeholder="请输入车辆型号" />
            </FormItem>
            <FormItem label="车辆品牌">
              <Input v-model="conditions.vehicleType.CLSB" placeholder="请输入车辆品牌" />
            </FormItem>
            <FormItem label="发动机型号">
              <Input
                v-model="conditions.vehicleType.FDJXH"
                placeholder="请输入发动机型号"
              />
            </FormItem>
            <FormItem>
              <Checkbox v-model="conditions.vehicleType.ISLIKE">精选检索</Checkbox>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="searchVehicleTypePage">检索</Button>
            </FormItem>
          </Form>
          <Table @on-row-click="rowClick" border height="200" :columns="tables.VehicleType1.columns" :data="tables.VehicleType1.data">
            <template slot-scope="{ row, ind }" slot="PF">
                {{$GY_FORMAT('cd_emissionstandard',row.PF)}}
            </template>
          </Table>
          <div style="text-align:center">
            <div style="margin:10px 0px 0px;height:32px">
                <Button style="display:inline-block;position: relative;bottom: 13px;margin-right:8px" @click.native="changePage(1)">首页</Button>
                <Page style="display:inline-block;" :total="conditions.vehicleType.total" :page-size="conditions.vehicleType.pageSize" :current="conditions.vehicleType.pageNum" @on-change="changePage"/>
                <Button style="display:inline-block;position: relative;bottom: 13px;margin-left:8px" @click.native="changePage(Math.ceil(conditions.vehicleType.total/conditions.vehicleType.pageSize))">尾页</Button>
            </div>
          </div>
        </Card>
      </TabPane>
      <TabPane label="其他方式审核" name="name2">
        <Card style="margin:6px 16px 16px 16px;">
          <Form  ref="vehicleType2Validate" :rules="vehicleType2_rules" :model="conditions.vehicleType2"  :label-width="100" inline>
            <FormItem :label="item.describe" v-show="!item.hidden" :class="{requireStar:item.required}"  :prop='`${key}.value`'  v-for="(item, key, index) in conditions.vehicleType2"
              :key="index">
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
            </FormItem>
            <FormItem>
              <Button type="primary" @click="searchEmissionStandard('vehicleType2Validate')">审核</Button>
            </FormItem>
          </Form>
        </Card>
      </TabPane>
    </Tabs>

    <!-- 办理业务 -->
    <Card style="margin:16px 16px;">
      <h2 style="margin-bottom:6px;">办理业务</h2>
      <div>
        <RadioGroup v-model="operation">
          <Radio label="0" border><span>机动车监测</span></Radio>
          <Radio label="1" border><span>6年免检车辆</span></Radio>
          <Radio label="3" border><span>旧牌新用车辆</span></Radio>
        </RadioGroup>
        <span style="color:red;">办理业务必选一个！</span>
      </div>
    </Card>
    <!-- 车辆基本信息 -->
    <Form ref="vehicleItemsId" :rules="vehicleItems_rules" :model="vehicleItems" :label-width="100" inline>
    <Card style="margin:16px 16px;">
      <div>
        <h2 style="margin-bottom:6px;">车辆基本信息</h2>
        <span style="color:red;"
          >(新车车牌规则：本地车牌前两位+车架号后5位+新。如：粤E12345新)</span
        >
      </div>
      <FormItem :label="item.describe" v-show="!item.hidden" :class="{requireStar:item.required}"  :prop='`${key}.value`'  v-for="(item, key, index) in vehicleItems"
    :key="index">
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
      </FormItem>
    </Card>
    </Form>
    <Form ref="ownerItemsId" :rules="ownerItems_rules" :model="ownerItems" :label-width="100" inline>
    <!-- 车主信息 -->
    <Card style="margin:16px 16px;">
      <h2 style="margin-bottom:6px;">车主信息</h2>
      <FormItem :label="item.describe"  v-show="!item.hidden" :class="{requireStar:item.required}" :prop='`${key}.value`'  v-for="(item, key, index) in ownerItems"
        :key="index">
        <Input
          v-if="item.model == 'Input'"
          v-model="item.value"
          :disabled="item.readonly"
          style="flex:1"
          :placeholder="item.pholder"
          clearable
        />
        <!-- {{JSON.stringify(item.value)}} -->
        <Cascader v-if="item.model == 'Cascader'" change-on-select :data="selectDict[key]" :disabled="item.readonly" style="flex:1" v-model="item.value" clearable></Cascader>
        <Select
          v-if="item.model == 'Select'" filterable
          :disabled="item.readonly"
          style="flex:1"
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
          style="flex:1"
          :format="item.format==null?'yyyy-MM-dd':item.format"
          type="datetime"
          placeholder="请选择"
        ></DatePicker>
      </FormItem>
    </Card>
    </Form>
    <Form ref="otherItemsId" :rules="otherItems_rules" :model="otherItems" :label-width="100" inline>
    <!-- 车辆其他信息 -->
    <Card style="margin:16px 16px;">
      <h2 style="margin-bottom:6px;">车辆其他信息</h2>
      <FormItem :label="item.describe"  v-show="!item.hidden" :class="{requireStar:item.required}" :prop='`${key}.value`'  v-for="(item, key, index) in otherItems" :key="index">
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
      </FormItem>
    </Card>
    </Form>
    <Form inline style="margin:16px">
      <FormItem>
        <Button type="primary" @click="initFormData('0')"> 点击录入下一辆车</Button>
      </FormItem>
      <FormItem>
        <Button type="primary" :disabled="!status.isSave" @click="save">保存</Button>
      </FormItem>
      <FormItem>
        <Button type="primary" :disabled="status.isSave" @click="acceptance" >受理</Button>
      </FormItem>
    </Form>

  </div>
</template>
<script>
import GuangDong from "@/views/common/GuangDong";
export default {
  props: {
    vehicleInfo:{
      type:Object
    },
    statusV:{
      type:Object
    }
  },
  data() {
    return {
      tables:{
        VehicleType1:{
          columns: [
              {
                title: "车辆型号",
                key: "CLXH",
                align: 'center',
              },
              {
                title: "排放阶段",
                key: "PF",
                slot:"PF",
                align: 'center',
              },
              {
                title: "目录日期",
                key: "FILENAME",
                align: 'center',
              },
              {
                title: "发动机型号",
                key: "FDJXH",
                align: 'center',
              },
              {
                title: "车辆品牌",
                key: "CLSB",
                align: 'center',
              },
              {
                title: "车辆制造企业名称",
                key: "MANUF",
                align: 'center',
              },
              {
                title: "发动机生产厂家",
                key: "FDJSCC",
                align: 'center',
              },
              {
                title: "车辆名称",
                key: "CLMC",
                align: 'center',
              },
              {
                title: "车辆类别",
                key: "CLLB",
                align: 'center',
              },
          ],
          data:[]
        }
      },
      vehicleType2_rules:{

      },
      vehicleItems_rules:{ 
      //  'VLPN.value': [{validator:(rule, value, callback) => {
      //             if ((value==null||value==="") && obj.required) {
      //               return callback(new Error(`${obj.describe}不能为空`));
      //             } else {
      //               return callback();
      //             }
      //           }, trigger: 'blur' }]
      },
      ownerItems_rules:{ 
      },
      otherItems_rules:{ 
      },
      operation: "0", //办理业务
      vehicleItems: {
        VehicleID: {
          describe: "车辆id",
          model: "Input",
          pholder: "请输入...",
          required: false,
          value: "",
          showStr: "",
          readonly: true,
          hidden: false,
        },
        //车辆信息
        VLPN: {
          describe: "号牌号码",
          model: "Input",
          pholder: "请输入...",
          required: true,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
        },
        VLPNColor: {
          describe: "车牌颜色",
          model: "Select",
          pholder: "请选择...",
          required: true,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
          dict: [], //下拉数组
        },
        GAVType: {
          describe: "车辆类型",
          model: "Select",
          pholder: "请选择...",
          required: true,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
          dict: [], //下拉数组
        },
        EmissionStandard: {
          describe: "排放标准",
          model: "Select",
          pholder: "请选择...",
          required: true,
          value: "",
          showStr: "",
          readonly: true,
          hidden: false,
          dict: [], //下拉数组
        },
        UseOfAuto: {
          describe: "使用性质",
          model: "Select",
          pholder: "请选择...",
          required: true,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
          dict: [], //下拉数组
        },
        FactoryPlateModel: {
          describe: "品牌",
          model: "Input",
          pholder: "请输入...",
          required: true,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
        },
        IUVTYPE: {
          describe: "车辆型号",
          model: "Input",
          pholder: "请输入...",
          required: true,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
        },
        IUETYPE: {
          describe: "发动机型号",
          model: "Input",
          pholder: "请输入...",
          required: true,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
        },
        VIN: {
          describe: "车架号",
          model: "Input",
          pholder: "请输入...",
          required: true,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
        },
        EngineNum: {
          describe: "发动机号码",
          model: "Input",
          pholder: "请输入...",
          required: true,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
        },
        VRDATE: {
          describe: "初次登记日期",
          model: "Date",
          pholder: "请输入...",
          required: true,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
        },
        ProductDate: {
          describe: "出厂日期",
          model: "Date",
          pholder: "请输入...",
          required: true,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
        },
        RatedSeats: {
          describe: "座位数",
          model: "Input",
          pholder: "请输入...",
          required: true,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
        },
        VML: {
          describe: "最大总质量(kg)",
          model: "Input",
          pholder: "请输入...",
          required: true,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
        },
        KerbMass: {
          describe: "整备质量",
          model: "Input",
          pholder: "请输入...",
          required: true,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
        },
        BenchmarkMass: {
          describe: "基准质量(kg)",
          model: "Input",
          pholder: "请输入...",
          required: true,
          value: "",
          showStr: "",
          readonly: true,
          hidden: false,
        },
        IUVMANU: {
          describe: "机动车生产厂家",
          model: "Input",
          pholder: "请输入...",
          required: true,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
        },
        FuelType: {
          describe: "燃料种类",
          model: "Select",
          pholder: "请选择...",
          required: true,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
          dict: [],
        },
        EDSPL: {
          describe: "排量(L)",
          model: "Input",
          pholder: "请输入...",
          required: true,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
        },
        EnginePower: {
          describe: "发动机额定功率(KW)",
          model: "Input",
          pholder: "请输入...",
          required: true,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
        },
        HasOBD: {
          describe: "是否装有OBD",
          model: "Select",
          pholder: "请选择...",
          required: true,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
          dict: [],
        },
        OBDType: {
          describe: "OBD类型",
          model: "Select",
          pholder: "请选择...",
          required: false,
          value: "",
          showStr: "",
          readonly: false,
          hidden: true,
          dict: [],
        },
        IsHasROBD: {
          describe: "是否安装远程排放管理车载终端",
          model: "Select",
          pholder: "请选择...",
          required: false,
          value: "",
          showStr: "",
          readonly: false,
          hidden: true,
          dict: [],
        },
      },
      ownerItems: {
        //车主信息
        OwnerName: {
          describe: "车主姓名",
          model: "Input",
          pholder: "请输入...",
          required: true,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
        },
        Address: {
          describe: "联系地址",
          model: "Input",
          pholder: "请输入...",
          required: true,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
        },
        Tel: {
          describe: "联系电话",
          model: "Input",
          pholder: "请输入...",
          required: true,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
        },
        CredentialsType: {
          describe: "证件类型",
          model: "Select",
          pholder: "请选择...",
          required: true,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
          dict: [], //下拉数组
        },
        CredentialsNum: {
          describe: "证件号码",
          model: "Input",
          pholder: "请输入...",
          required: true,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
        },
      },
      otherItems: {
        //车辆其他信息
        OilSupplyWay: {
          describe: "供油方式",
          model: "Select",
          pholder: "请选择...",
          required: false,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
          dict: [], //下拉数组
        },
        IntakeWay: {
          describe: "进气方式",
          model: "Select",
          pholder: "请选择...",
          required: false,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
          dict: [], //下拉数组
        },
        EngineRatedSpeed: {
          describe: "发动机额定转速",
          model: "Input",
          pholder: "请输入...",
          required: true,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
        },
        Mileage: {
          describe: "里程表读数",
          model: "Input",
          pholder: "请输入...",
          required: true,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
        },
        OCHA: {
          describe: "营运性质",
          model: "Select",
          pholder: "请选择...",
          required: true,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
          dict: [], //下拉数组
        },
        ssx: {
          describe: "车辆所属省市县",
          model: "Cascader",
          pholder: "请输入...",
          required: true,
          value: [],
          showStr: "",
          readonly: false,
          hidden: false,
        },
        Province: {
          describe: "车辆所属省份",
          model: "Input",
          pholder: "请输入...",
          required: true,
          value: "",
          showStr: "",
          readonly: false,
          hidden: true,
        },
        City: {
          describe: "车辆所属城市",
          model: "Input",
          pholder: "请输入...",
          required: true,
          value: "",
          showStr: "",
          readonly: false,
          hidden: true,
        },
        County: {
          describe: "车辆所属县/区",
          model: "Input",
          pholder: "请输入...",
          required: true,
          value: "",
          showStr: "",
          readonly: false,
          hidden: true,
        },
        EStatus: {
          describe: "环保业务状态",
          model: "Select",
          pholder: "请输入...",
          required: true,
          value: "01",
          showStr: "",
          readonly: true,
          hidden: false,
          dict: [],
        },
        VehicleBigType: {
          describe: "机动车大类",
          model: "Select",
          pholder: "请输入...",
          required: true,
          value: "01",
          showStr: "",
          readonly: true,
          hidden: false,
          dict: [],
        },
        IUEMANU: {
          describe: "发动机生产企业",
          model: "Input",
          pholder: "请输入...",
          required: false,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
        },
        GAIUVTYPE: {
          describe: "购置税上车型号",
          model: "Input",
          pholder: "请输入...",
          required: false,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
        },
        VStatus: {
          describe: "车辆状态",
          model: "Select",
          pholder: "请输入...",
          required: true,
          value: "A",
          showStr: "",
          readonly: false,
          hidden: false,
          dict: [],
        },
        IsLocalInspection: {
          describe: "是否本地检车",
          model: "Select",
          pholder: "请输入...",
          required: true,
          value: "1",
          showStr: "",
          readonly: true,
          hidden: false,
          dict: [],
        },
        IsInValid: {
          describe: "历史数据",
          model: "Select",
          pholder: "请输入...",
          required: true,
          value: "0",
          showStr: "",
          readonly: true,
          hidden: false,
          dict: [],
        },
        IsImportedCar: {
          describe: "是否为进口车",
          model: "Select",
          pholder: "请输入...",
          required: false,
          value: "0",
          condition: "IsImportedCar",
          showStr: "",
          readonly: false,
          hidden: false,
          dict: [],
        },
        PG: {
          describe: "载客载货",
          model: "Select",
          pholder: "请输入...",
          required: false,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
          dict: [],
        },
        CatalyticConvertersAndCorp: {
          describe: "催化器外观号/生产厂家",
          model: "Input",
          pholder: "请输入...",
          required: false,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
        },
        GasVentCount: {
          describe: "排气管数量",
          model: "Input",
          pholder: "请输入...",
          required: false,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
        },
        AxleWeight: {
          describe: "单车轴重",
          model: "Input",
          pholder: "请选择...",
          required: false,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
        },
        IsDoubleFuel: {
          describe: "是否双燃料",
          model: "Select",
          pholder: "请输入...",
          required: false,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
          dict: [],
        },
        HasOxygenSensor: {
          describe: "是否有氧传感器",
          model: "Select",
          pholder: "请输入...",
          required: false,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
          dict: [],
        },
        HasCCA: {
          describe: "是否有三元催化装置",
          model: "Select",
          pholder: "请选择...",
          required: false,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
          dict: [],
        },
        RegistDate: {
          describe: "车辆登记日期",
          model: "Date",
          pholder: "请选择...",
          required: false,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
        },
        AbandonedYear: {
          describe: "强制报废年限",
          model: "Date",
          format: "yyyy-MM-dd HH:mm",
          pholder: "请选择...",
          required: false,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
          dict: [],
        },

        VariableForm: {
          describe: "变速器型式",
          model: "Select",
          pholder: "请选择...",
          required: true,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
          dict: [],
        },
        OldVLPN: {
          describe: "原号牌号码",
          model: "Input",
          pholder: "请输入...",
          required: false,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
        },
        ChassisType: {
          describe: "底盘型号",
          model: "Input",
          pholder: "请输入...",
          required: false,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
          dict: [],
        },
        GearCount: {
          describe: "档位数",
          model: "Input",
          pholder: "请输入...",
          required: false,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
        },
        StrokeCount: {
          describe: "发动机冲程数",
          model: "Input",
          pholder: "请输入...",
          required: false,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
        },
        CylinderCount: {
          describe: "气缸数",
          model: "Input",
          pholder: "请输入...",
          required: false,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
        },
        DriveForm: {
          describe: "驱动方式",
          model: "Select",
          pholder: "请选择...",
          required: true,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
          dict: [],
        },
        TyreType: {
          describe: "车轮型号",
          model: "Input",
          pholder: "请输入...",
          required: false,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
        },
        SCR: {
          describe: "SCR",
          model: "Input",
          pholder: "请输入...",
          required: false,
          value: "",
          showStr: "",
          readonly: false,
          hidden: true,
        },
        SCRType: {
          describe: "SCR型号",
          model: "Input",
          pholder: "请输入...",
          required: false,
          value: "",
          showStr: "",
          readonly: false,
          hidden: true,
        },
        DPF: {
          describe: "DPF",
          model: "Input",
          pholder: "请输入...",
          required: false,
          value: "",
          showStr: "",
          readonly: false,
          hidden: true,
        },
        DPFType: {
          describe: "DPF型号",
          model: "Input",
          pholder: "请输入...",
          required: false,
          value: "",
          showStr: "",
          readonly: false,
          hidden: true,
        },
        MotorType: {
          describe: "电动机型号",
          model: "Input",
          pholder: "请输入...",
          required: false,
          value: "",
          showStr: "",
          readonly: false,
          hidden: true,
        },
        ESDType: {
          describe: "储能装置型号",
          model: "Input",
          pholder: "请输入...",
          required: false,
          value: "",
          showStr: "",
          readonly: false,
          hidden: true,
        },
        BatteryCapacity: {
          describe: "电池容量单位A·H(安培·小时)",
          model: "Input",
          pholder: "请输入...",
          required: false,
          value: "",
          showStr: "",
          readonly: false,
          hidden: true,
        },
        Remarks: {
          describe: "车辆备注",
          model: "Input",
          pholder: "请输入...",
          required: false,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
        },
      },
      extItems:{
        VehicleType: {
          describe: "车辆类型代码表",
          model: "Input",
          pholder: "请输入...",
          required: true,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
        },
        VehicleKind:{
          describe: "车辆种类",
          model: "Input",
          pholder: "请输入...",
          required: true,
          value: "02",
          showStr: "",
          readonly: false,
          hidden: false,
        },
        InspectionKind:{
          describe: "受理种类",
          model: "Input",
          pholder: "请输入...",
          required: true,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
        },
        InspectionWays:{
          describe: "检测方法",
          model: "Input",
          pholder: "请输入...",
          required: true,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
        },
        InspectionWay:{
          describe: "检测方式",
          model: "Input",
          pholder: "请输入...",
          required: true,
          value: "",
          showStr: "",
          readonly: false,
          hidden: false,
        },
        InspectionNature:{
          describe: "检测类型",
          model: "Input",
          pholder: "请输入...",
          required: true,
          value: "02",
          showStr: "",
          readonly: false,
          hidden: false,
        },
      },
      selectDict: {
      },
      status:{},
      conditions: {
        vehicle: {
          cphm: "",
          cpys: "",
          vin: "",
        },
        vehicleType: {
          CLXH: "",
          FDJXH: "",
          CLSB: "",
          ISLIKE:false,
          orderstr:" pf desc ",
          pageNum:1,
          pageSize:10,
          total:0
        },
        vehicleType2: {
            GAVType: {
            describe: "公安车辆类型",
            model: "Select",
            pholder: "请输入...",
            required: true,
            value: "",
            showStr: "",
            readonly: false,
            hidden: false,
          },
            VML:{
            describe: "最大总质量(kg)",
            model: "Input",
            pholder: "请输入...",
            required: true,
            value: "",
            showStr: "",
            readonly: false,
            hidden: false,
          },
            RatedSeats: {
            describe: "座位数",
            model: "Input",
            pholder: "请输入...",
            required: true,
            value: "",
            showStr: "",
            readonly: false,
            hidden: false,
          },
            FuelType:{
            describe: "燃油类型",
            model: "Select",
            pholder: "请输入...",
            required: true,
            value: "",
            showStr: "",
            readonly: false,
            hidden: false,
          },
            VRDATE:{
            describe: "登记日期",
            model: "Date",
            pholder: "请输入...",
            required: true,
            value: "",
            showStr: "",
            readonly: false,
            hidden: false,
          },
            HasOBD:{
            describe: "是否装有OBD",
            model: "Select",
            pholder: "请输入...",
            required: false,
            value: "",
            showStr: "",
            readonly: false,
            hidden: false,
          }
        },
      },
    };
  },
  watch: {
    statusV:{ //监听的对象
      deep:true, //深度监听设置为 true
      handler:function(newV,oldV){
        for(let key in newV){
          this.status[key]=newV[key];
        }
      }
    },
    'vehicleInfo.VehicleID':{ //监听的对象
      deep:true, //深度监听设置为 true
      handler:function(newV,oldV){
        this.initVehicleInfo(this.vehicleInfo);
      }
    },
    "vehicleItems.HasOBD.value": {
      //是否装有OBD
      deep: true,
      handler: function(newV, oldV) {
        // console.log("HasOBD：", newV);
        if (newV == 1) {
          //是
          this.vehicleItems.OBDType.hidden = false;
          this.vehicleItems.IsHasROBD.hidden = false;
          this.vehicleItems.IsHasROBD.required = true;
          if(this.vehicleItems.FuelType.value=="B"){
              this.otherItems.SCR.hidden=false;
              this.otherItems.SCRType.hidden=false;
              this.otherItems.DPF.hidden=false;
              this.otherItems.DPFType.hidden=false;
          }else{
            this.otherItems.SCR.hidden=true;
            this.otherItems.SCRType.hidden=true;
            this.otherItems.DPF.hidden=true;
            this.otherItems.DPFType.hidden=true;
            this.otherItems.SCR.value="";
            this.otherItems.SCRType.value="";
            this.otherItems.DPF.value="";
            this.otherItems.DPFType.value="";
          }
        } else {
          this.vehicleItems.OBDType.hidden = true;
          this.vehicleItems.IsHasROBD.hidden = true;
          this.vehicleItems.OBDType.value = "";
          this.vehicleItems.IsHasROBD.value = "";
          this.vehicleItems.IsHasROBD.required = false;
        }
      },
    },
    'vehicleItems.GAVType.value':{
      //公安车辆类型
      deep: true,
      handler: function(newV, oldV) {
        
        for(let obj of this.selectDict['GATypePG']){
          if(newV===obj.GAVType){
            this.otherItems.PG.value=obj.PG;
            this.extItems.VehicleType.value=obj.VehicleType;
            break;
          }
        }
      },
    },
    'vehicleItems.FuelType.value':{
      //公安车辆类型
      deep: true,
      handler: function(newV, oldV) {
        if(this.vehicleItems.FuelType.value==="C"){
          this.otherItems.VehicleBigType.value="04";//机车大类
        }else{
          this.otherItems.VehicleBigType.value="01";
        }
        if(newV!=""){
          if(newV=='A'){//汽油
            this.otherItems.IntakeWay.required=false;
            this.otherItems.IntakeWay.value="";
            this.otherItems.IntakeWay.hidden=true;
            this.otherItems.OilSupplyWay.hidden=false;
            this.otherItems.OilSupplyWay.required=true;
          }else if(newV=='B'){
            this.otherItems.OilSupplyWay.required=false;
            this.otherItems.OilSupplyWay.value="";
            this.otherItems.OilSupplyWay.hidden=true;
            this.otherItems.IntakeWay.required=true;
            this.otherItems.IntakeWay.hidden=false;
            if(this.vehicleItems.HasOBD.value=="1"){
              this.otherItems.SCR.hidden=false;
              this.otherItems.SCRType.hidden=false;
              this.otherItems.DPF.hidden=false;
              this.otherItems.DPFType.hidden=false;
            }else{
              this.otherItems.SCR.hidden=true;
              this.otherItems.SCRType.hidden=true;
              this.otherItems.DPF.hidden=true;
              this.otherItems.DPFType.hidden=true;
              this.otherItems.SCR.value="";
              this.otherItems.SCRType.value="";
              this.otherItems.DPF.value="";
              this.otherItems.DPFType.value="";
            }
          }else{
            if(newV=='O'){
              this.otherItems.MotorType.hidden=false;
              this.otherItems.ESDType.hidden=false;
              this.otherItems.BatteryCapacity.hidden=false;
            }else{
              this.otherItems.MotorType.hidden=true;
              this.otherItems.ESDType.hidden=true;
              this.otherItems.BatteryCapacity.hidden=true;
              this.otherItems.MotorType.value="";
              this.otherItems.ESDType.value="";
              this.otherItems.BatteryCapacity.value="";
            }
            if(newV=='C'||newV=='N'){
              this.vehicleItems.EmissionStandard.required=false;
            }else{
              this.vehicleItems.EmissionStandard.required=true;
            }
            this.otherItems.IntakeWay.required=false;
            this.otherItems.IntakeWay.value="";
            this.otherItems.OilSupplyWay.required=false;
            this.otherItems.OilSupplyWay.value="";
            this.otherItems.IntakeWay.hidden=false;
            this.otherItems.OilSupplyWay.hidden=false;
          }       
        }
      },
    },
    "otherItems.OilSupplyWay.value": {
      //供油方式
      deep: true,
      handler: function(newV, oldV) {
        console.log("供油方式", newV);
        if(newV=="02"){
          this.otherItems.HasCCA.value="1";
        }
      },
    },
    "vehicleItems.UseOfAuto.value": {
      //使用性质
      deep: true,
      handler: function(newV, oldV) {
        console.log("使用性质", newV);
        if(newV=="Z"){
          this.otherItems.OCHA.readonly=false;//.value="1";
        }else{
          this.otherItems.OCHA.readonly=true;
          for(let obj of this.selectDict['UseOfAutoOCHA']){
            if(newV===obj.UseOfAutoCode){
               this.otherItems.OCHA.value=obj.OCHACode;
               break;
            }
          }
         
        }
      },
    },
    "vehicleItems.KerbMass.value": {
      //整备质量
      deep: true,
      handler: function(newV, oldV) {
        console.log("供油方式", newV);
        if(newV!=null&&newV!=""){
          try{
            this.vehicleItems.BenchmarkMass.value=parseFloat(newV)+100;
          }catch(e){
            console.log(e.message);
          }
        }else{
          this.vehicleItems.BenchmarkMass.value="";
        }
      },
    },
    "otherItems.ssx.value": {
      //省市县
      deep: true,
      handler: function(newV, oldV) {
        console.log("省市县", newV);
        if(newV!=null&&newV.length>0){
          this.otherItems.Province.value=newV[0];
          if(newV.length>1)
          this.otherItems.City.value=newV[1];
          if(newV.length>2)
          this.otherItems.County.value=newV[2];
        }else{
          this.otherItems.Province.value="";
          this.otherItems.City.value="";
          this.otherItems.County.value="";
        }
      },
    },
    'vehicleItems.VLPN.value':{
      //车牌号码
      deep: true,
      handler: function(newV, oldV) {
        if(newV!=null&&newV!==""){
          if(newV.length>1){
            let v = newV.substring(0, 2);
            let local=this.$SYSTEM_PARAMS['01_LocalVlpn'];
            if(local!=null&&local.indexOf(v)>=0){
              this.otherItems.IsLocalInspection.value='1';
              this.otherItems.County.required=true;
            }else{
              this.otherItems.County.required=false;
              this.otherItems.IsLocalInspection.value='0';
            }
          }
        }else{
          this.otherItems.County.required=false;
        }
      },
    },
    operation:function(newV,oldV){
      this.initFormData(newV);
    },
    'conditions.vehicleType2.FuelType.value':{
      //燃料类型-车辆型号2条件
      deep: true,
      handler: function(newV, oldV) {
        console.log(newV);
        if(newV=="A"){
          this.conditions.vehicleType2.HasOBD.required=true;
        }else{
          this.conditions.vehicleType2.HasOBD.required=false;
        }
      },
    },
  },
  created() {
    this.initSelectDict();
  },
  methods: {
    acceptance(){
      
    },
    getSubmitData(){
      let res={};
      let strs= ['vehicleItems','ownerItems','otherItems'];
      for(let str of strs){
        for( let k in this[str]){
          res[k]=this[str][k].value;
        }
      }
      for(let key in this.vehicleInfo){
        if(!res.hasOwnProperty(key)){
          res[key]=this.vehicleInfo[key];
        }
      }
      delete res.ssx;
      return res;
    },
    extValidate(params){
      try{
        let BenchmarkMass=parseFloat(params.BenchmarkMass);
        let VML=parseFloat(params.VML);
        if(BenchmarkMass>VML){
          this.$Message.error('输入的基准质量应小于最大总质量,请重新输入！')
          return false;
        }
      }catch(e){
        this.$Message.error('基准质量或最大总质量不是数字');
        return false;
      }
      try{
        let datetime=new Date().getTime();
        let vardate=new Date(params.VRDATE).getTime();
        let productdate=new Date(params.ProductDate).getTime();
        if (vardate > datetime) {
          this.$Message.error("初次登记日期不能大于当前日期！");
          return false;
        }
        if (productdate > datetime) {
          this.$Message.error("出厂日期不能大于当前日期！");
          return false;
        }
        if(productdate>vardate){
          this.$Message.error('出厂日期不能大于初次登记日期，请重新输入！');
          return false;
        }
      }catch(e){
        this.$Message.error('出厂日期或初次登记日期不是日期');
        return false;
      }
      if(params.EngineRatedSpeed!=""){
        try{
          let EngineRatedSpeed=parseFloat(params.EngineRatedSpeed);
          if(EngineRatedSpeed<1500||EngineRatedSpeed>8000){
            this.$Message.error('输入的发动机额定转速范围不在1500至8000 r/min之间,请重新输入！');
            return false;
          }
        }catch(e){
          this.$Message.error('发动机额定转速不是数字');
          return false;
        }
      }
      if(params.IUETYPE!=null&&params.IUETYPE.indexOf("#")>=0){
        this.$Message.error("发动机型号包含'#'字符号,不能保存!");
        return false;
      }
      let telV=/^([1]\d{10}|([\(（]?0[0-9]{2,3}[）\)]?[-]?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?)$/;
      if(params.Tel!=null&&!telV.test(params.Tel)){
        this.$Message.error('车主联系电话或手机号码格式输入错误，请重新输入！');
        return false;
      }
      let reg = /^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/;
      if (params.CredentialsType == "01" && !reg.test(params.CredentialsNum)){
        this.$Message.error('车主身份证号码格式输入错误，请重新输入！');
        return false;
      }
      if(params.VIN!=null&&params.VIN.length!=17){
        this.$Modal.confirm({
            title: '车架号提示',
            content: '输入的车架号不是17位，确定要保存吗？',
            onOk: () => {
              for(let i=0;i<10000;i++){

              }
              console.log(1)
                this.$Message.info('Clicked ok');
            },
            onCancel: () => {
                this.$Message.info('Clicked cancel');
            }
        });
         console.log(2)
      }
      if(params.VStatus==null||params.VStatus===""){
        params.VStatus='A';
      }
      if(params.VehicleID==null||params.VehicleID<=0){
        params.State='3';
      }else{
        params.State='2';
      }
      if(params.VLPN==null||params.VLPN.length<7){
        this.$Message.error('车牌号码不正确，请重新输入！');
        return false;
      }
      return true;
    },
    submitData(params){
      for(let key in params){
        if(params[key]==""){
          params[key]=null;
        }
      }
      let p={
        data:params,
        type:this.operation,
        GASM:this.status.GASM,
        way:this.status.typeofAudit
      }
      if(!this.status.GASM){
        let where={
          vehicleID: params.VehicleID,
          vin: params.VIN,
          vlpn: params.VLPN,
          vlpnColor: params.VLPNColor
        }
        this.$curl.post("/api/c440600/vehicle/Vehicle/VehicleExistsByVINOrVLPNAndColor", where).then((res) => {
            if(res.code==0){
              let r=res.data;
              if(r.Have==2){
                 if (!window.confirm('系统已经存在相同车牌号和颜色，你确定车牌号和颜色是正确的吗？')) {
                    return;
                  }
              }
              if(r.Have==1){
                this.$Message.error('系统已经存在相同车架号，不能保存！');
                return;
              }
              if(r.Have==3){
                this.$Message.error('存在相同车架号、车牌号和颜色,不能保存！');
                return;
              }
              this.$curl
              .post(
                "/api/c440600/vehicle/Vehicle/SaveNewVehicle",
                p
              ).then((res) => {
                if(res.code==0){
                  let data=res.data;
                  // this.vehicleInfo=data.Vehicle;
                  this.$emit("initVehicle",data.Vehicle);
                  // this.vehicleItems.VehicleID.value=vehicleInfo.VehicleID;
                  this.$Message.success('保存成功');
                  // this.$nextTick(() => {
                  //   this.status.isSave=false;
                  // });
                  this.$emit("changeStatus",'isSave',false);
                  // this.status.isSave=false;
                  // console.log(this.$USER);
                  if(this.status.IsChangeHasCCA=="1"&&this.otherItems.HasCCA.value!=this.status.IsChangeHasCCA&&this.vehicleItems.FuelType.value=='A'){
                    let param={
                      VLPN: this.vehicleItems.VLPN.value,
                      StationCode: this.$USER.userOrg,
                      VIN: this.vehicleItems.VIN.value,
                      CityCode: this.$USER.areaCode
                    }
                    console.log(param);
                    this.$curl
                    .post(
                      "/api/c440600/vehicle/Vehicle/ChangeHacCCAToAlarm",
                      param
                    );
                  }
                }else{
                  this.$Message.error(res.msg);
                }
              });
            }else{
              this.$Message.error(res.msg);
              return;
            }
        });
      }else{

      }
    },
    //保存车辆信息
    save(){
      this.$refs['vehicleItemsId'].validate((valid1) => {
        if (valid1) {
          this.$refs['ownerItemsId'].validate((valid2) => {
            if (valid2) {
              this.$refs['otherItemsId'].validate((valid3) => {
              if (valid3) {
                  let params=this.getSubmitData();
                  if(this.extValidate(params)){
                    this.submitData(params);
                  }
                }
              });
            }
          });
        }
      });
    },
    //初始化车辆信息
    initVehicleInfo(newV){
      // Object.assign(this.$data, this.$options.data());
      this.initData();
      if(newV!=null){
        for(let key in newV){
          if(this.vehicleItems[key]){
            this.vehicleItems[key].value=newV[key]==null?"":(newV[key]+"");
          }else if(this.ownerItems[key]){
            this.ownerItems[key].value=newV[key]==null?"":(newV[key]+"");
          }else if(this.otherItems[key]){
            this.otherItems[key].value=newV[key]==null?"":(newV[key]+"");
          }else{
            // console.log(key,"未知KEY");
          }
        }
        let ssx=[];
        if(this.otherItems.Province.value!=""){
          ssx.push(this.otherItems.Province.value);
          if(this.otherItems.City.value!=""){
            ssx.push(this.otherItems.City.value)
            if(this.otherItems.County.value!=""){
              ssx.push(this.otherItems.County.value)
            }
          }
        }
        this.otherItems.ssx.value=ssx;
        //this.status.IsChangeHasCCA=this.otherItems.HasCCA.value;
        this.$emit("changeStatus",'IsChangeHasCCA',this.otherItems.HasCCA.value);
        this.vehicleItems.VLPN.readonly=true;
        this.vehicleItems.VLPNColor.readonly=true;
      }
    },
    //行点击
    rowClick(row,index){
      this.vehicleItems.IUVTYPE.value=row.CLXH;
      this.otherItems.GAIUVTYPE.value=row.CLXH;
      this.vehicleItems.IUETYPE.value=row.FDJXH;
      this.vehicleItems.IUVMANU.value=row.MANUF;
      this.vehicleItems.EmissionStandard.value=row.PF.indexOf("0")>=0?row.PF:("0"+row.PF);
      this.vehicleItems.FactoryPlateModel.value=row.CLSB;
      this.otherItems.IUEMANU.value=row.FDJSCC;
      let cllb=row.CLLB;
      if(!cllb){
        cllb=row.CLMC;
      }
      if(cllb.indexOf("汽油")>=0){
        this.vehicleItems.FuelType.value="A";
      }else if(cllb.indexOf("柴油")>=0){
        this.vehicleItems.FuelType.value="B";
      }else{
        this.vehicleItems.FuelType.value="";
      }
      this.$emit("changeStatus",'typeofAudit',"1");
    },
    //分页查询
    changePage(v){
      if(v){
        this.conditions.vehicleType.pageNum=v;
      }
      this.searchVehicleTypeList();
    },
    //查询排放标准
    searchEmissionStandard(validate){
      this.$refs[validate].validate((valid) => {
          if (valid) {
              let params={};
              for(let key in this.conditions.vehicleType2){
                params[key]=this.conditions.vehicleType2[key].value;
              }
              console.log(params);
              this.$curl
              .post(
                "/api/c440600/verify/Verify/GetEmissionStandardOfVehicle",
                params
              ).then((res) => {
                  if(res.code==0){
                    this.vehicleItems.EmissionStandard.value=res.data;
                    this.vehicleItems.VML.value=params.VML;
                    this.vehicleItems.RatedSeats.value=params.RatedSeats;
                    this.vehicleItems.VRDATE.value=params.VRDATE;
                    this.vehicleItems.FuelType.value=params.FuelType;
                    this.vehicleItems.HasOBD.value=params.HasOBD;
                    this.$emit("changeStatus",'typeofAudit','2');
                  }else{
                    this.$Message.error(res.msg);
                  }
              });
          }
      })
      // let vehicleType2=this.conditions.vehicleType2;

    },
    initData(){
      this.vehicleItems = this.$options.data().vehicleItems;
      this.ownerItems = this.$options.data().ownerItems;
      this.otherItems = this.$options.data().otherItems;
      this.extItems = this.$options.data().extItems;
      // this.status = this.$options.data().status;
      this.conditions = this.$options.data().conditions;
    },
    initFormData(v){//业务类型
      // this.vehicleItems = this.$options.data().vehicleItems;
      // this.ownerItems = this.$options.data().ownerItems;
      // this.otherItems = this.$options.data().otherItems;
      // this.extItems = this.$options.data().extItems;
      // this.status = this.$options.data().status;
      // Object.assign(this.$data, this.$options.data());
      //this.initData();
      this.$emit("initVehicle",{});
      if(v==="0"){
        
      }else if(v==="1"){
        this.otherItems.Mileage.required=false;
        this.otherItems.EngineRatedSpeed.required=false;
      }else{
        this.otherItems.Mileage.required=false;
        this.otherItems.EngineRatedSpeed.required=false;
        this.extItems.VehicleKind.value="01";
      }
    },
    initSelectDict(){
      //初始化下拉框
      let sf=[{ CodeName: "否", CodeValue: "0" },{ CodeName: "是", CodeValue: "1" }];
      this.selectDict['IsImportedCar']=sf;//是否为进口车
      this.selectDict['IsInValid']=sf;//是否为历史数据
      this.selectDict['HasOBD']=sf;//是否装有OBD
      this.selectDict['IsHasROBD']=sf;//是否安装远程排放管理车载终端
      this.selectDict['IsLocalInspection']=sf;//是否本地检车
      this.selectDict['IsInspectionPass']=sf;//
      this.selectDict['HasCCA']=sf;//三元催化装置
      this.selectDict['HasOxygenSensor']=sf;//是否有氧传感器
      this.selectDict['IsDoubleFuel']=sf;//是否双燃料

      this.selectDict['OBDType']=this.$GY_ARRAY("cd_obdtype");//OBD类型
      this.selectDict['VLPNColor']=this.$GY_ARRAY("cd_vlpncolor");//车牌颜色
      this.selectDict['GAVType']=this.$GY_ARRAY("cd_gavtype");//公安车辆类型
      this.selectDict['CredentialsType']=this.$GY_ARRAY("cd_credentialstype");//证件类型
      this.selectDict['PG']=this.$GY_ARRAY("cd_pg");//载客载货
        this.selectDict['VehicleType']=this.$GY_ARRAY("cd_vehicletype");//车辆类型代码表 extItems
      this.selectDict['OilSupplyWay']=this.$GY_ARRAY("cd_oilsupplyway");//供油方式
      this.selectDict['FuelType']=this.$GY_ARRAY("cd_fueltype");//燃油类型
      this.selectDict['VehicleBigType']=this.$GY_ARRAY("cd_vehiclebigtype");//机动车大类
      //ESPOrganizationInfoList//组织机构下拉列表
      this.selectDict['VStatus']=this.$GY_ARRAY("cd_vstatus");//车辆状态
      this.selectDict['EStatus']=this.$GY_ARRAY("cd_estatus");//环保业务状态代码表
      this.selectDict['UseOfAuto']=this.$GY_ARRAY("cd_useofauto");//车辆用途
      this.selectDict['OCHA']=this.$GY_ARRAY("cd_ocha");//营运性质
      this.selectDict['VariableForm']=this.$GY_ARRAY("cd_variableform");//变速器型式
      this.selectDict['IntakeWay']=this.$GY_ARRAY("cd_intakeway");//进气方式
      this.selectDict['DriveForm']=this.$GY_ARRAY("cd_driveform");//驱动方式
      this.selectDict['EmissionStandard']=this.$GY_ARRAY("cd_emissionstandard");//排放标准
      this.selectDict['VehicleKind']=this.$GY_ARRAY("cd_vehiclekind");//车辆种类
      this.selectDict['InspectionKind']=this.$GY_ARRAY("cd_inspectionkind");//受理种类
      this.selectDict['InspectionWay']=this.$GY_ARRAY("cd_inspectionway");//检测方式
      this.selectDict['InspectionWays']=this.$GY_ARRAY("cd_inspectionmethod");//检测方法
      this.selectDict['InspectionNature']=this.$GY_ARRAY("cd_inspectionnature");//检测类型
      this.selectDict["ssx"]=this.$XZQH;//行政区划
      this.loadRL_HBVType_GAVTypeList();//受理方式
      this.loadRL_OCHA_UseOfAuto();//营运性质
      for(let name of ['vehicleItems','ownerItems','otherItems']){
        for(let key in this[name]){
            let obj =this[name][key];
            this.showOrHidden(obj,name,key);
        }
      }
      for(let key in this.conditions.vehicleType2){
          let obj =this.conditions.vehicleType2[key];
          this.showOrHidden(obj,'vehicleType2',key);
      }
    },
    loadRL_OCHA_UseOfAuto(){
      this.$curl
        .get("/api/common/query/searchRL_OCHA_UseOfAuto", this.conditions.vehicle)
        .then((res) => {
          // this.selectDict['GATypePG']=
          if(res.code==0){
            this.selectDict['UseOfAutoOCHA']=res.data;
          }
        });
    },
    loadRL_HBVType_GAVTypeList(){
         this.$curl
        .get("/api/common/query/searchRL_HBVType_GAVType", this.conditions.vehicle)
        .then((res) => {
          // this.selectDict['GATypePG']=
          if(res.code==0){
            this.selectDict['GATypePG']=res.data;
          }
        });
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
    //   检索
    handleSearch() {},
    //查询车辆列表
    searchVehicleList() {
      this.$curl
        .get("/api/common/query/searchVehicleList", this.conditions.vehicle)
        .then((res) => {});
    },
    searchVehicleTypePage(){
      let page=this.conditions.vehicleType;
      page.pageNum=1;
      page.pageSize=10;
      page.total=0;
      this.searchVehicleTypeList();
    },
    //查询车辆类型（方式1）
    searchVehicleTypeList() {
      let temp = Object.assign({}, this.conditions.vehicleType);
      if(!temp.ISLIKE){
        temp.CLXH=`%${temp.CLXH}%`;
        temp.CLSB=`%${temp.CLSB}%`;
        temp.FDJXH=`%${temp.FDJXH}%`;
      }
      this.$curl
        .get(
          "/api/common/query/searchVehicleTypeList",
          temp
        ).then((res) => {
            this.tables.VehicleType1.data=res.data.list;
            this.conditions.vehicleType.total=res.data.total
        });
    },
  },
};
</script>
<style lang="less" scoped>
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
