<template>
<div style="overflow:hidden hidden;height:100%;width:100%;" ref="inheight" class="ind">
    <Spin size="large" fix v-if="spinShow"></Spin>
    <Row ref="leftRight" class="leftRight" style="height:100%;">
        <!-- 左侧 -->
        <i-Col span="8" style="margin:8px 0 5px;height:100%;position:relative;">
            <div style="padding:0 4px 8px;border-bottom:1px solid #999;">
                <Input v-model.trim="VLPNandSceneCode" @on-enter="handleInspectionDataGet" placeholder="请输入车牌号码或检测线编号" style="width: 180px;margin:0 10px " clearable @on-clear="handleInspectionDataGet" />
                <span style="float:right">
                    <Button @click="selectModal = !selectModal" style="margin-left:10px;">更多条件</Button>
                </span>
                <span style="float:right">
                    <Button :type="tglpx_show ? 'primary' : 'default'" @click="tglpx_show = !tglpx_show" style="margin-left:10px;">
                        <Icon type="ios-funnel" size="14" />
                    </Button>
                </span>
                <!-- 个性化设置tab栏 -->
                <Dropdown style="margin-left:10px;float:right" trigger="hover" @on-visible-change="changeSelTab(false)">
                    <Button type="default">
                        <Icon type="md-color-palette" />
                    </Button>
                    <DropdownMenu slot="list">
                        <CheckboxGroup v-model="defaultCheckSelTab">
                            <Checkbox label="InspectionReport">检测报告</Checkbox>
                            <Checkbox label="InspectionProcess">尾气检测过程数据</Checkbox>
                            <Checkbox label="obdInspectionProcess">OBD过程数据</Checkbox>
                            <Checkbox label="InspectionImage">检测照片</Checkbox>
                            <Checkbox label="InspectionVideo">检测录像</Checkbox>
                            <Checkbox label="AppearanceInfo">外观检测信息</Checkbox>
                            <Checkbox label="BlackSmokeCarVideo">黑烟车抓拍</Checkbox>
                            <Checkbox label="blackBoxProcessTab">黑匣子过程数据</Checkbox>
                        </CheckboxGroup>
                    </DropdownMenu>
                </Dropdown>
                    <!-- 布局选择 -->
                <Dropdown style="margin-left:10px;float:right" @on-click="swicthlayout" class="setting">
                    <Button type="default">
                        <i class="fa fa-cog icon-setting"></i>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem :selected="!islayoutscreen" name="card">卡片布局</DropdownItem>
                        <DropdownItem :selected="islayoutscreen" name="table">表格布局</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <!-- 下拉筛选条件 -->
            <div v-show="tglpx_show" class="fx__bgcolor tglpx_showes">
                <Row :gutter="2">
                    <Col span="6" style="text-align: center;padding-top: 2%;margin-top: 5px">检测时间：</Col>
                    <Col span="18" style="margin-top: 5px">
                    <DatePicker clearable placement="bottom-start" split-panels type="datetimerange" format="yyyy-MM-dd HH:mm" style="width: 100%" v-model="JCSJ" :options="options2"></DatePicker>
                    </Col>
                     </Row>
                     <Row :style="{ height: height - 200 + 'px' }" style="overflow:hidden auto;max-height:482px;width:100%">
           
                        <Col span="6" style="text-align: center;padding-top: 2%;margin-top: 5px">车牌号码：</Col>
                        <Col span="18" style="margin-top: 5px">
                        <Input clearable v-model="RowInfo.likeParams.VLPN" />
                        </Col>
                        <Col span="6" style="text-align: center;padding-top: 2%;margin-top: 5px">受理编号：</Col>
                        <Col span="18" style="margin-top: 5px">
                        <Input clearable v-model="RowInfo.likeParams.InspectionNum" />
                        </Col>
                        <Col span="6" style="text-align: center;padding-top: 2%;margin-top: 5px">检测报告编号</Col>
                        <Col span="18" style="margin-top: 5px">
                        <Input clearable v-model="RowInfo.likeParams.InspectionReportNo" />
                        </Col>
                        <Col span="6" style="text-align: center;padding-top: 2%;margin-top: 5px">城市：</Col>
                        <Col span="18" style="margin-top: 5px">
                        <Select ref="select" clearable filterable v-model="RowInfo.parame.city" @on-change="changeCity">
                            <Option v-for="item in cityList" :key="item.AreaCode" :value="item.AreaCode">{{ item.AreaName }}</Option>
                        </Select>
                        </Col>
                        <Col span="6" style="text-align: center;padding-top: 2%;margin-top: 5px">县区:</Col>
                        <Col span="18" style="margin-top: 5px">
                        <Select ref="select" clearable filterable v-model="RowInfo.parame.county" @on-change="changeCounty">
                            <Option v-for="item in filterCounty" :key="item.AreaCode" :value="item.AreaCode">{{ item.AreaName }}</Option>
                        </Select>
                        </Col>
                        <Col span="6" style="text-align: center;padding-top: 2%;margin-top: 5px">检测站：</Col>
                        <Col span="18" style="margin-top: 5px">
                        <Select ref="select" clearable filterable v-model="RowInfo.parame.StationCode" multiple :max-tag-count="1" @on-change="getLineNumber(RowInfo.parame.StationCode)">
                            <Option v-for="item in station" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
                        </Select>
                        </Col>
                        <Col span="6" style="text-align: center;padding-top: 2%;margin-top: 5px">预警条件：</Col>
                        <Col span="18" style="margin-top: 5px">
                        <Select clearable v-model="RowInfo.params.AlarmType" filterable multiple>
                            <Option v-for="(item, index) in AlarmType" :key="index" :value="item.CodeValue">{{ item.CodeName }}</Option>
                        </Select>
                        </Col>
                        <Col span="6" style="text-align: center;padding-top: 2%;margin-top: 5px">车型号：</Col>
                        <Col span="18" style="margin-top: 5px">
                        <Input clearable v-model="RowInfo.likeParams.IUVTYPE" />
                        </Col>
                        <Col span="6" style="text-align: center;padding-top: 2%;margin-top: 5px">车架号：</Col>
                        <Col span="18" style="margin-top: 5px">
                        <Input clearable v-model="RowInfo.likeParams.VIN" />
                        </Col>
                        <Col span="6" style="text-align: center;padding-top: 2%;margin-top: 5px">品牌：</Col>
                        <Col span="18" style="margin-top: 5px">
                        <Input clearable v-model="RowInfo.likeParams.FactoryPlateModel" />
                        </Col>
                        <Col span="6" style="text-align: center;padding-top: 2%;margin-top: 5px">车主名称：</Col>
                        <Col span="18" style="margin-top: 5px">
                        <Input clearable v-model="RowInfo.likeParams.OwnerName" />
                        </Col>
                        <Col span="6" style="text-align: center;padding-top: 2%;margin-top: 5px">检测线编号：</Col>
                        <Col span="18" style="margin-top: 5px">
                        <Select ref="select" clearable filterable v-model="RowInfo.params.SceneCode">
                            <Option v-for="(item, index) in SceneCode" :key="index" :value="item">{{ item }}</Option>
                        </Select>
                        </Col>
                        <Col span="6" style="text-align: center;padding-top: 2%;margin-top: 5px">检测类型：</Col>
                        <Col span="18" style="margin-top: 5px">
                        <Select clearable v-model="RowInfo.params.InspectionNature">
                            <Option v-for="(item, index) in InspectionNature" :key="index" :value="item.CodeValue">{{ item.CodeName }}</Option>
                        </Select>
                        </Col>
                        <Col span="6" style="text-align: center;padding-top: 2%;margin-top: 5px">载客/载货：</Col>
                        <Col span="18" style="margin-top: 5px">
                        <Select clearable v-model="RowInfo.params.PG">
                            <Option v-for="(item, index) in PG" :key="index" :value="item.CodeValue">{{ item.CodeName }}</Option>
                        </Select>
                        </Col>
                        <Col span="6" style="text-align: center;padding-top: 2%;margin-top: 5px">检测方法：</Col>
                        <Col span="18" style="margin-top: 5px">
                        <Select clearable v-model="RowInfo.params.IUTYPE">
                            <Option v-for="(item, index) in this.IUTYPE" :key="index" :value="item.CodeValue">{{ item.CodeName }}</Option>
                        </Select>
                        </Col>
                        <Col span="6" style="text-align: center;padding-top: 2%;margin-top: 5px">燃料种类：</Col>
                        <Col span="18" style="margin-top: 5px">
                        <Select clearable v-model="RowInfo.params.FuelType">
                            <Option v-for="(item, index) in FuelTypeList" :key="index" :value="item.CodeValue">{{ item.CodeName }}</Option>
                        </Select>
                        </Col>
                        <Col span="6" style="text-align: center;padding-top: 2%;margin-top: 5px">排放标准：</Col>
                        </Col>
                        <Col span="18" style="margin-top: 5px">
                        <Select clearable v-model="RowInfo.params.EmissionStandard" multiple>
                            <Option v-for="(item, index) in emisphase" :key="index" :value="item.CodeValue">{{ item.CodeName }}</Option>
                        </Select>
                        </Col>
                        <Col span="6" style="text-align: center;padding-top: 2%;margin-top: 5px">车辆类型：</Col>
                        <Col span="18" style="margin-top: 5px">
                        <Select clearable v-model="RowInfo.params.GAVType" multiple>
                            <Option v-for="(item, index) in VLPNTypeList" :key="index" :value="item.CodeValue">{{ item.CodeName }}</Option>
                        </Select>
                        </Col>
                        <Col span="6" style="text-align: center;padding-top: 2%;margin-top: 5px">检测结果：</Col>
                        <Col span="18" style="margin-top: 5px">
                        <Select clearable v-model="RowInfo.params.VDCT">
                            <Option v-for="(item, index) in VDCT" :key="index" :value="item.CodeValue">{{ item.CodeName }}</Option>
                        </Select>
                        </Col>
                   
                     </Row>
                  
               

                <div style="display:flex;justify-content: space-around;align-items: center;margin-top:10px;">
                    <Button style="margin-top: 20px;width:120px;" type="primary" @click="
                handleInspectionDataGet();
                tglpx_show = false;
              ">查询</Button>
                    <Button style="margin-top: 20px;width:120px;" type="primary" @click="handleCancelReset">重置</Button>
                </div>
            </div>
            <!-- 左侧表格布局 -->
            <Table v-if="islayoutscreen == true" border highlight-row :loading="loading" :columns="colList" :data="dataTable" :height="height" @on-row-click="getsingleifon" style="cursor:pointer; " />
            <!-- 左侧卡片布局 -->
            <div v-if="islayoutscreen != true" style="overflow:hidden auto;" class="scroller" :style="{ height: height + 'px' }">
                <div v-show="dataTable.length > 0" style="width:100%;height:204px;border-bottom:1px solid #999;border-right:1px solid #999;cursor:pointer" v-for="(item, index) in dataTable" :key="index" @click="getsingleifon(item, index)" :class="index == num ? 'active' : ''">
                    <div style="font-size:14px;padding:20px 15px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <div>
                                <span :style="setVLPNColor(item.VLPNColor)">{{ item.VLPN }}</span>
                                <span style="margin:0 0 0 20px">{{ returnMethodnames(IUTYPE, item.IUTYPE) }}</span>
                                <span>/{{ returncodename(emisphase, item.EmissionStandard) }}</span>
                            </div>
                            <span style>{{ item.DetectEndTime }}</span>
                        </div>

                        <div class="leftStyle">
                            <span>
                                车架号:
                                <span class="ml10">{{ item.VIN }}</span>
                            </span>
                            <span>
                                车辆性质:
                                <span class="ml10">{{ returncodename(VehicleKind, item.VehicleKind) }}</span>
                            </span>
                        </div>
                        <div class="leftStyle">
                            <span>
                                打印次数:
                                <span class="ml10">{{ item.PrintTimes || 0 }}</span>
                            </span>
                            <span>
                                检测方式:
                                <span class="ml10">{{ returncodename(InspectionWay, item.InspectionWay) }}</span>
                            </span>
                        </div>
                        <div class="leftStyle">
                            <span>
                                检测站:
                                <span class="ml10">
                                    {{item.StationShortName || returncodename(StationInfo, item.StationCode)}}
                                </span>
                            </span>
                            <span>
                                检测线编号:
                                <span class="ml10">{{ item.SceneCode }}</span>
                            </span>
                        </div>
                        <div class="leftStyle">
                            <span :title="item.InspectionReportNo">
                                检测报告编号:
                                <span class="ml10">{{ item.InspectionReportNo }}</span>
                            </span>

                            <span :title="item.InspectionNature">
                                检测类型：
                                <span class="ml10">
                                    {{
                                        returncodename(InspectionNature, item.InspectionNature)
                                    }}
                                </span>
                            </span>
                        </div>
                        <div class="leftStyle">
                            <span :title="item.VRDATE">
                                初次登记日期:
                                <span class="ml10">{{ item.VRDATE }}</span>
                            </span>
                            <span v-if="item.VDCT == '1'" style="color:green;">
                                <span class="ml10">{{ returncodename(VDCT, item.VDCT) }}</span>
                            </span>
                            <span v-else-if="item.VDCT == '0'" style="color:red;">
                                <span class="ml10">{{ returncodename(VDCT, item.VDCT) }}</span>
                            </span>
                            <span v-else style="padding-right:89px"></span>
                        </div>
                    </div>
                </div>
                <div v-show="dataTable.length == 0" style="margin: 300px auto;text-align:center;">暂无数据</div>
            </div>
            <!-- 页尾 -->
            <div class="pagediv">
                <Page :total="dataCount" :current="pageIndex" :page-size="pageSize" show-total @on-change="changePage" />
                <Button type="primary" style @click="exportExcel()">导出</Button>
            </div>
        </i-Col>
        <!-- 右侧详细信息 -->
        <i-Col span="16" v-if="!ifDrawer" style="height:100%">
            <rightBlock :height="height" :checkSelTab="checkSelTab" ref="rightBlock" @getTabName="getTabName" :currenDate="currenDate" :initForm="initForm" :number="number"></rightBlock>
        </i-Col>
        <div v-if="ifDrawer" style="height:100%">
            <Drawer :closable="false" v-model="ifDrawer" width="80%" v-show="currenDate">
                <rightBlock :height="height" :checkSelTab="checkSelTab" ref="rightBlock" @getTabName="getTabName" :currenDate="currenDate" :initForm="initForm" :number="number"></rightBlock>
            </Drawer>
        </div>
    </Row>
    <!-- 整体表格布局 -->
    <Row class="tableShow">
        <div style="padding: 10px">
            <Input v-model.trim="VLPNandSceneCode" @on-enter="handleInspectionDataGet" placeholder="请输入车牌号码或检测线编号" style="width: 180px;margin:0 10px " clearable @on-clear="handleInspectionDataGet" />
            <span style="float:right">
                <Button @click="selectModal = !selectModal" style="margin-right:20px;">更多条件</Button>
            </span>
            <span style="float:right">
                <Button :type="tglpx_show ? 'primary' : 'default'" @click="tglpx_show = !tglpx_show" style="margin-right:20px;">
                    <Icon type="ios-funnel" size="14" />
                </Button>
            </span>
            <!-- 个性化设置tab栏 -->
            <Dropdown style="margin-right:10px;float:right" trigger="hover" @on-visible-change="changeSelTab">
                <Button type="default">
                    <Icon type="md-color-palette" />
                </Button>
                <DropdownMenu slot="list">
                    <CheckboxGroup v-model="defaultCheckSelTab">
                        <Checkbox label="InspectionReport">检测报告</Checkbox>
                        <Checkbox label="InspectionProcess">尾气检测过程数据</Checkbox>
                        <Checkbox label="obdInspectionProcess">OBD过程数据</Checkbox>
                        <Checkbox label="InspectionImage">检测照片</Checkbox>
                        <Checkbox label="InspectionVideo">检测录像</Checkbox>
                        <Checkbox label="AppearanceInfo">外观检测信息</Checkbox>
                        <Checkbox label="BlackSmokeCarVideo">黑烟车抓拍</Checkbox>
                        <Checkbox label="blackBoxProcessTab">黑匣子过程数据</Checkbox>
                    </CheckboxGroup>
                </DropdownMenu>
            </Dropdown>
            <div v-show="tglpx_show" class="fx__bgcolor tglpx_showe">
                <Row :gutter="5">
                    <Col span="6" style="text-align: center;padding-top: 2%;margin-top: 5px">检测时间：</Col>
                    <Col span="18" style="margin-top: 5px">
                    <DatePicker clearable split-panels placement="bottom-start" type="datetimerange" format="yyyy-MM-dd HH:mm" style="width: 100%" v-model="JCSJ" :options="options2"></DatePicker>
                    </Col>
                    <div :style="{ height: height - 200 + 'px' }" style="overflow:hidden auto;max-height:482px;width:100%">
                        <Col span="6" style="text-align: center;padding-top: 2%;margin-top: 5px">车牌号码：</Col>
                        <Col span="18" style="margin-top: 5px">
                        <Input clearable v-model="RowInfo.likeParams.VLPN" />
                        </Col>
                        <Col span="6" style="text-align: center;padding-top: 2%;margin-top: 5px">受理编号：</Col>
                        <Col span="18" style="margin-top: 5px">
                        <Input clearable v-model="RowInfo.likeParams.InspectionNum" />
                        </Col>
                        <Col span="6" style="text-align: center;padding-top: 2%;margin-top: 5px">检测报告编号</Col>
                        <Col span="18" style="margin-top: 5px">
                        <Input clearable v-model="RowInfo.likeParams.InspectionReportNo" />
                        </Col>
                        <Col span="6" style="text-align: center;padding-top: 2%;margin-top: 5px">城市：</Col>
                        <Col span="18" style="margin-top: 5px">
                        <Select ref="select" clearable filterable v-model="RowInfo.parame.city" @on-change="changeCity">
                            <Option v-for="item in cityList" :key="item.AreaCode" :value="item.AreaCode">{{ item.AreaName }}</Option>
                        </Select>
                        </Col>
                        <Col span="6" style="text-align: center;padding-top: 2%;margin-top: 5px">县区:</Col>
                        <Col span="18" style="margin-top: 5px">
                        <Select ref="select" clearable filterable v-model="RowInfo.parame.county" @on-change="changeCounty">
                            <Option v-for="item in filterCounty" :key="item.AreaCode" :value="item.AreaCode">{{ item.AreaName }}</Option>
                        </Select>
                        </Col>
                        <Col span="6" style="text-align: center;padding-top: 2%;margin-top: 5px">检测站：</Col>
                        <Col span="18" style="margin-top: 5px">
                        <Select ref="select" clearable filterable v-model="RowInfo.parame.StationCode" multiple :max-tag-count="1" @on-change="getLineNumber(RowInfo.parame.StationCode)">
                            <Option v-for="item in station" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
                        </Select>
                        </Col>
                        <Col span="6" style="text-align: center;padding-top: 2%;margin-top: 5px">车型号：</Col>
                        <Col span="18" style="margin-top: 5px">
                        <Input clearable v-model="RowInfo.likeParams.IUVTYPE" />
                        </Col>
                        <Col span="6" style="text-align: center;padding-top: 2%;margin-top: 5px">车架号：</Col>
                        <Col span="18" style="margin-top: 5px">
                        <Input clearable v-model="RowInfo.likeParams.VIN" />
                        </Col>
                        <Col span="6" style="text-align: center;padding-top: 2%;margin-top: 5px">品牌：</Col>
                        <Col span="18" style="margin-top: 5px">
                        <Input clearable v-model="RowInfo.likeParams.FactoryPlateModel" />
                        </Col>
                        <Col span="6" style="text-align: center;padding-top: 2%;margin-top: 5px">车主名称：</Col>
                        <Col span="18" style="margin-top: 5px">
                        <Input clearable v-model="RowInfo.likeParams.OwnerName" />
                        </Col>
                        <Col span="6" style="text-align: center;padding-top: 2%;margin-top: 5px">检测线编号：</Col>
                        <Col span="18" style="margin-top: 5px">
                        <Select ref="select" clearable filterable v-model="RowInfo.params.SceneCode">
                            <Option v-for="(item, index) in SceneCode" :key="index" :value="item">{{ item }}</Option>
                        </Select>
                        </Col>
                        <Col span="6" style="text-align: center;padding-top: 2%;margin-top: 5px">检测类型：</Col>
                        <Col span="18" style="margin-top: 5px">
                        <Select clearable v-model="RowInfo.params.InspectionNature">
                            <Option v-for="(item, index) in InspectionNature" :key="index" :value="item.CodeValue">{{ item.CodeName }}</Option>
                        </Select>
                        </Col>
                        <Col span="6" style="text-align: center;padding-top: 2%;margin-top: 5px">载客/载货：</Col>
                        <Col span="18" style="margin-top: 5px">
                        <Select clearable v-model="RowInfo.params.PG">
                            <Option v-for="(item, index) in PG" :key="index" :value="item.CodeValue">{{ item.CodeName }}</Option>
                        </Select>
                        </Col>
                        <Col span="6" style="text-align: center;padding-top: 2%;margin-top: 5px">检测方法：</Col>
                        <Col span="18" style="margin-top: 5px">
                        <Select clearable v-model="RowInfo.params.IUTYPE">
                            <Option v-for="(item, index) in this.IUTYPE" :key="index" :value="item.CodeValue">{{ item.CodeName }}</Option>
                        </Select>
                        </Col>
                        <Col span="6" style="text-align: center;padding-top: 2%;margin-top: 5px">燃料种类：</Col>
                        <Col span="18" style="margin-top: 5px">
                        <Select clearable v-model="RowInfo.params.FuelType">
                            <Option v-for="(item, index) in FuelTypeList" :key="index" :value="item.CodeValue">{{ item.CodeName }}</Option>
                        </Select>
                        </Col>
                        <Col span="6" style="text-align: center;padding-top: 2%;margin-top: 5px">排放标准：</Col>
                        </Col>
                        <Col span="18" style="margin-top: 5px">
                        <Select clearable v-model="RowInfo.params.EmissionStandard" multiple>
                            <Option v-for="(item, index) in emisphase" :key="index" :value="item.CodeValue">{{ item.CodeName }}</Option>
                        </Select>
                        </Col>
                        <Col span="6" style="text-align: center;padding-top: 2%;margin-top: 5px">车辆类型：</Col>
                        <Col span="18" style="margin-top: 5px">
                        <Select clearable filterable v-model="RowInfo.params.GAVType" multiple>
                            <Option v-for="(item, index) in VLPNTypeList" :key="index" :value="item.CodeValue">{{ item.CodeName }}</Option>
                        </Select>
                        </Col>
                        <Col span="6" style="text-align: center;padding-top: 2%;margin-top: 5px">检测结果：</Col>
                        <Col span="18" style="margin-top: 5px">
                        <Select clearable v-model="RowInfo.params.VDCT">
                            <Option v-for="(item, index) in VDCT" :key="index" :value="item.CodeValue">{{ item.CodeName }}</Option>
                        </Select>
                        </Col>
                    </div>
                </Row>

                <div style="display:flex;justify-content: space-around;align-items: center;margin-top:10px;">
                    <Button style="margin-top: 20px;width:120px;" type="primary" @click="
                handleInspectionDataGet();
                tglpx_show = false;
              ">查询</Button>
                    <Button style="margin-top: 20px;width:120px;" type="primary" @click="handleCancelReset">重置</Button>
                </div>
            </div>
        </div>
        <Table border highlight-row :loading="loading" :columns="colList" :data="dataTable" :height="height" @on-row-click="getsingleifon" style="cursor:pointer;" />
        <div class="pagediv" style="padding:0">
            <Page style="padding: 10px" :total="dataCount" show-sizer :current="pageIndex" :page-size="pageSize" show-total @on-change="changePage" @on-page-size-change="changePageSize" />
            <Button type="primary" style="margin:10px" @click="exportExcel()">导出</Button>
        </div>
    </Row>
    <Modal v-model="selectModal" title="更多条件检索" width="70%" :styles="{ height: '500px' }">
        <searchForm ref="searchForm" :JCSJ="JCSJ" :selectModal="selectModal" :RowInfo="RowInfo" :height="height" :VehicleKind="VehicleKind" :FuelTypeList="FuelTypeList" :StationInfo="StationInfo" :IUTYPE="IUTYPE" :InspectionWay="InspectionWay" :AlarmType="AlarmType" @resetIUTYPE="resetIUTYPE" @getAllData="getAllData"></searchForm>
        <div slot="footer">
            <Button type="primary" size="large" @click="modelSearch">查询</Button>
            <Button size="large" @click="handleCancelReset">重置</Button>
            <Button size="large" @click="selectModal = false">取消</Button>
        </div>
    </Modal>
</div>
</template>

<script>
import { formatDates, getCDData } from "../../utils/utils";
import { export_json_to_excel } from "../../../excel/Export2Excel";
import { config } from "../../../utils/tools";
export default {
    components: {
        searchForm: () => import("./component/searchForm.vue"),
        rightBlock: () => import("./component/rightBlock.vue"),
    },
    data() {
        return {
            defaultCheckSelTab: [
                "InspectionReport",
                "InspectionProcess",
                "obdInspectionProcess",
                "InspectionImage",
                "InspectionVideo",
                "AppearanceInfo",
            ], //设置显示的tab栏
            checkSelTab: [],
            ifDrawer: false,
            SceneCode: [],
            options2: {
                shortcuts: [
                    {
                        text: "今天",
                        value() {
                            const end = new Date();
                            const start = new Date(
                                new Date(
                                    new Date().toLocaleDateString()
                                ).getTime()
                            );
                            start.setTime(start.getTime());
                            return [start, end];
                        },
                    },
                    {
                        text: "昨天",
                        value() {
                            const end = new Date(
                                new Date(
                                    new Date(
                                        new Date().setDate(
                                            new Date().getDate() - 1
                                        )
                                    ).toLocaleDateString()
                                ).getTime() +
                                    24 * 60 * 60 * 1000 -
                                    1
                            );
                            const start = new Date(
                                new Date(
                                    new Date().toLocaleDateString()
                                ).getTime()
                            );
                            start.setTime(start.getTime() - 3600 * 1000 * 24);
                            return [start, end];
                        },
                    },
                    {
                        text: "一周",
                        value() {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 7
                            );
                            return [start, end];
                        },
                    },
                    {
                        text: "一个月",
                        value() {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 30
                            );
                            return [start, end];
                        },
                    },
                    {
                        text: "三个月",
                        value() {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 90
                            );
                            return [start, end];
                        },
                    },
                ],
            },
            VDCT: [
                {
                    CodeName: "通过",
                    CodeValue: "1",
                },
                {
                    CodeName: "不通过",
                    CodeValue: "0",
                },
            ],
            InspectionNature: [],
            videoUrl: "", //视频路径
            currentNum: null,
            islayoutscreen: false,
            VLPNandSceneCode: "",
            RowInfo: {
                params: {}, // 参数
                likeParams: {}, // 范围参数
                parame: {}, // 权限参数
                otherParams: {}, // 比较参数
            },
            resData: {},
            ImgData: [],
            ImgArr: [],
            videoArr: [],
            processArr: [], //过程数据
            loading: true,
            height: 0,
            width: 10000,
            tabName: "InspectionReport", //默认显示的是检测 报告的tab
            ImageUrl: "",
            VideoUrl: "",
            colList: [
                {
                    title: "车牌号",
                    key: "VLPN",
                    align: "center",
                    fixed: "left",
                    minWidth: 110,
                },
                {
                    title: "检测站",
                    key: "StationCode",
                    align: "center",
                    minWidth: 185,
                        render:(h,params)=>{
                       let name=this.returncodename(this.StationInfo,params.row.StationCode);
                        return h('span',{},name)
                    }
                },
                {
                    title: "检测报告编号",
                    key: "InspectionReportNo",
                    align: "center",
                    minWidth: 225,
                },
                {
                    title: "车架号",
                    key: "VIN",
                    align: "center",
                    minWidth: 175,
                    tooltip: true,
                },
                {
                    title: "车型号",
                    key: "IUVTYPE",
                    align: "center",
                    minWidth: 175,
                    tooltip: true,
                },
                {
                    title: "车牌颜色",
                    key: "VLPNColor",
                    align: "center",
                    minWidth: 100,
                    render: (h, params) => {
                        const Name = this.initform.cd_VLPNColor[
                            params.row.VLPNColor
                        ];
                        return h("span", {}, Name);
                    },
                },
                {
                    title: "营运性质",
                    key: "OCHA",
                    align: "center",
                    minWidth: 100,
                    render: (h, params) => {
                        const Name = this.initform.cd_OCHA[params.row.OCHA];
                        return h("span", {}, Name);
                    },
                },
                {
                    title: "车辆性质",
                    key: "InspectionKind",
                    align: "center",
                    minWidth: 185,
                    render: (h, params) => {
                        const Name = this.initform.cd_InspectionKind[
                            params.row.InspectionKind
                        ];
                        return h("span", {}, Name);
                    },
                },
                {
                    title: "使用性质",
                    key: "UseOfAuto",
                    align: "center",
                    minWidth: 100,
                    render: (h, params) => {
                        const Name = this.initform.cd_UseOfAuto[
                            params.row.UseOfAuto
                        ];
                        return h("span", {}, Name);
                    },
                },
                {
                    title: "排放标准",
                    key: "EmissionStandard",
                    align: "center",
                    minWidth: 100,
                    render: (h, params) => {
                        const Name = this.initform.cd_EmissionStandard[
                            params.row.EmissionStandard
                        ];
                        return h("span", {}, Name);
                    },
                },
                {
                    title: "车辆类型",
                    key: "GAVType",
                    align: "center",
                    minWidth: 120,
                    render: (h, params) => {
                        const Name = this.initform.cd_VLPNType[
                            params.row.GAVType
                        ];
                        return h("span", {}, Name);
                    },
                },
                {
                    title: "品牌",
                    key: "FactoryPlateModel",
                    align: "center",
                    minWidth: 175,
                    tooltip: true,
                },
                {
                    title: "检测线",
                    key: "SceneCode",
                    align: "center",
                    minWidth: 80,
                },
                {
                    title: "燃油种类",
                    key: "FuelType",
                    align: "center",
                    minWidth: 100,
                    render: (h, params) => {
                        const Name = this.returnMultiple(
                            this.initform.cd_Fueltype,
                            params.row.FuelType
                        );
                        return h("span", {}, Name);
                    },
                },
                {
                    title: "检测类型",
                    key: "InspectionNature",
                    align: "center",
                    minWidth: 100,
                    render: (h, params) => {
                        const Name = this.initform.cd_InspectionNature[
                            params.row.InspectionNature
                        ];
                        return h("span", {}, Name);
                    },
                },

                {
                    title: "检测方法",
                    key: "IUTYPE",
                    align: "center",
                    minWidth: 130,
                    render: (h, params) => {
                        const Name = this.initform.cd_Inspectionmethod[
                            params.row.IUTYPE
                        ];
                        return h("span", {}, Name);
                    },
                },
                {
                    title: "检测次数",
                    key: "InspectionTimes",
                    align: "center",
                    minWidth: 100,
                },
                {
                    title: "检测结果",
                    key: "VDCT",
                    align: "center",
                    // fixed: "right",
                    minWidth: 100,
                    render: (h, params) => {
                        const Name = this.initform.cd_vdct[params.row.VDCT];
                        return h("span", {}, Name);
                    },
                },
                {
                    title: "检测时间",
                    key: "DetectEndTime",
                    align: "center",
                    minWidth: 170,
                },
                {
                    title: "初次登记日期",
                    key: "VRDATE",
                    align: "center",
                    minWidth: 170,
                },
                {
                    title: "受理编号",
                    key: "InspectionNum",
                    align: "center",
                    minWidth: 250,
                    tooltip: true,
                },
                {
                    title: "打印次数",
                    key: "PrintTimes",
                    align: "center",
                    minWidth: 110,
                },
            ],
            VLPN: "",
            InspectionNum: "",
            currenDate: {}, //当前选中行的数据对象
            tglpx_show: false,
            FuelTypeList: [],
            VLPNTypeList: [],
            InspectionWay: [],
            VehicleKind: [],
            AlarmType: [],
            PG: [],
            emisphase: [],
            list: [],
            imgList: [],
            IUTYPE: [],
            VLPNColor: [],
            OCHA: [],
            InspectionKind: [],
            UseOfAuto: [],
            dataTable: [],
            StationInfo: [],
            dataCount: 0,
            num: 0,
            pageSize: 20,
            number: {
                xxl: 8,
                xl: 10,
                lg: 12,
            },
            JCSJ: ["", ""],
            pageIndex: 1, //默认当前为第一页
            initform: {
                cd_vdct: {
                    1: "通过",
                    0: "不通过",
                },
                cd_Inspectionmethod: {
                    A: "双怠速法",
                    B: "稳态工况法",
                    C: "简易瞬态工况法",
                    F: "自由加速法",
                    G: "加载减速法",
                    J: "林格曼黑度法",
                },
                cd_Fueltype: {},
                cd_InspectionNature: {},
                cd_VLPNColor: {},
                cd_OCHA: {},
                cd_InspectionKind: {},
                cd_UseOfAuto: {},
                cd_VLPNType: {},
                cd_EmissionStandard: {},
            },
            currenDate: {},
            initForm: {
                cd_tsi_gklx: {},
            },
            selectModal: false, // 筛选模态框
            isFind: true, // 判断是否是按查询按钮触发或者是按页号触发，true 按钮， false 页号
            selectInspectionNum: [], // 选择减速方法得到的InspectionNum
            ifInspectionNum: false, // 判断是否启动因子
            cityList: [],
            filterCounty: [],
            station: [], // 站点
            OBDParams: {}, // OBD搜索参数
            InspectionNum: "", //路由参数
            isExportExcel: false,
            exportData: [],
            exportDataNum: 0,
            spinShow: false,
        };
    },
    watch: {
        selectModal() {
            this.RowInfo.params = this.$refs.searchForm.params;
            this.RowInfo.likeParams = this.$refs.searchForm.likeParams;
            this.RowInfo.otherParams = this.$refs.searchForm.otherParams;
            this.JCSJ[0] = this.$refs.searchForm.DetectStartTime;
            this.JCSJ[1] = this.$refs.searchForm.DetectEndTime;
            this.RowInfo.parame = this.$refs.searchForm.parame;
            if (this.RowInfo.parame.city) {
                this.changeCity(this.RowInfo.parame.city);
            }
            if (this.RowInfo.parame.county) {
                this.changeCounty(this.RowInfo.parame.county);
            }
            if (this.RowInfo.parame.StationCode) {
                this.getLineNumber(this.RowInfo.parame.StationCode);
            }
            if (!this.selectModal) this.handleInspectionDataGet();
        },
        currenDate(newVal, oldVal) {
            this.$nextTick(() => {
                this.processArr = [];
                if (this.tabName == "InspectionReport")
                    this.$refs.rightBlock &&
                        this.$refs.rightBlock.getInspectionReport();
                else if (
                    this.tabName == "InspectionImage" ||
                    this.tabName == "InspectionVideo"
                )
                    this.$refs.rightBlock.getInspectionImage();
                else if (this.tabName == "InspectionProcess") {
                } else if (this.tabName == "AppearanceInfo")
                    this.$refs.rightBlock.getAppearanceInfo();
                else if (this.tabName == "obdInspectionProcess")
                    this.$refs.rightBlock.getObdProcessData();
                else if (this.tabName == "BlackSmokeCarVideo")
                    this.$refs.rightBlock.getBlackSmokeCar();
                else if (this.tabName == "blackBoxProcessTab") {
                    this.$refs.rightBlock.getBlackBoxProcessData();
                    this.$refs.rightBlock.getProcessData("DB");
                } 
            });
        },
    },

    methods: {
        swicthlayout(name) {
            if (
                (this.islayoutscreen && name == "card") ||
                (!this.islayoutscreen && name == "table")
            ) {
                this.islayoutscreen = !this.islayoutscreen;
            }
        },
        //获取登录用户下的行政区域
        async getUserAreaInfo() {
            await this.$curl.get("api/hj/getUserCity").then((res) => {
                if (res.grade == "2") {
                    //市级
                    this.RowInfo.parame.city = res.city[0].AreaCode;
                    this.handleInspectionDataGet();
                } else if (res.grade == "1") {
                    this.handleInspectionDataGet(); //省级用户
                }
            });
        },
        exportExcel() {
            this.spinShow = true;
            if (this.dataCount > 30000)
                this.$Message.info("导出数据量较大，请耐心等待！");
            this.isExportExcel = true;
            if (!this.exportDataNum) {
                this.exportDataNum = 1;
                this.handleInspectionDataGet();
            } else {
                this.$Message.warning("数据下载中.......请勿重复操作！！");
            }
        },

        // 导出表格
        exportExcelInfo() {
            const self = this;
            require.ensure([], () => {
                const tHeader = self.colList.map((c) => c.title);
                const filterVal = self.colList.map((c) => c.key);
                const list = JSON.parse(JSON.stringify(self.exportData));
                const data = self.formatJson(filterVal, list);
                export_json_to_excel(
                    tHeader,
                    data,
                    "过程监管信息详细" + formatDates(new Date(), "yyyyMMdd")
                );
                self.spinShow = false;
            });
        },
        formatJson(filterVal, jsonData) {
            const _this = this;
            return jsonData.map((v) =>
                filterVal.map((j) => {
                    if (j === "FuelType") {
                        v[j] = _this.returncodename(_this.FuelTypeList, v[j]);
                    } else if (j === "IUTYPE") {
                        v[j] = _this.returncodename(_this.IUTYPE, v[j]);
                    } else if (j === "InspectionNature") {
                        v[j] = _this.returncodename(
                            _this.InspectionNature,
                            v[j]
                        );
                    } else if (j === "VDCT") {
                        v[j] = _this.returncodename(_this.VDCT, v[j]);
                    } else if (j === "VLPNColor") {
                        v[j] = _this.returncodename(_this.VLPNColor, v[j]);
                    } else if (j === "OCHA") {
                        v[j] = _this.returncodename(_this.OCHA, v[j]);
                    } else if (j === "InspectionKind") {
                        v[j] = _this.returncodename(_this.InspectionKind, v[j]);
                    } else if (j === "UseOfAuto") {
                        v[j] = _this.returncodename(_this.UseOfAuto, v[j]);
                    } else if (j === "GAVType") {
                        v[j] = _this.returncodename(_this.VLPNTypeList, v[j]);
                    } else if (j === "EmissionStandard") {
                        v[j] = _this.returncodename(_this.emisphase, v[j]);
                    }
                    return v[j];
                })
            );
        },
        // 获取对于的tabName
        getTabName(value) {
            this.tabName = value;
        },
        //关闭自定义tab栏下拉框触发
        changeSelTab(visible) {
            const self = this;
            if (!visible) {
                if (self.defaultCheckSelTab) {
                    if (
                        self.defaultCheckSelTab.sort().toString() !=
                        self.checkSelTab
                    ) {
                        if (
                            self.checkSelTab.sort().toString() ||
                            self.checkSelTab.sort().toString() == ""
                        ) {
                            self.$curl
                                .post("api/hj/changeUserThema", {
                                    params: this.defaultCheckSelTab,
                                })
                                .then((res) => {
                                    if (res.state) {
                                        self.checkSelTab = this.defaultCheckSelTab;
                                        self.$Message.success(
                                            "修改显示菜单栏成功！"
                                        );
                                    }
                                });
                        }
                    }
                }
            }
        },
        //根据检测站得对应检测线编号
        async getLineNumber(StationCode) {
            if (!StationCode.length) this.RowInfo.params.SceneCode = "";
            await this.$curl
                .get("api/hj/getstationLine", {
                    StationCode: JSON.stringify(StationCode),
                })
                .then((res) => {
                    let line = res.Line.filter((v) => v.SceneCode);
                    this.SceneCode = line.map((v) => v.SceneCode);
                });
        },
        //多选过滤
        returnMultiple(cdList, codeValue) {
            const _this = this;
            if (!codeValue) return;
            const arrs = String(codeValue).split("");
            let CodeName = [];
            for (let key in cdList) {
                arrs.forEach((item) => {
                    if (key == item) CodeName.push(cdList[key]);
                });
            }
            return CodeName.join(",");
        },
        //点击左侧数据
        getsingleifon(row, index) {
            this.currenDate = row;
            if (this.width < 1380)
                // 检测报告
                this.ifDrawer = true;
            this.num = index;
        },
        // 清除inspectionNum的数据
        resetIUTYPE() {
            this.selectInspectionNum = [];
            this.ASM = {};
            this.LDD = {};
            this.TSI = {};
            this.Lingman = {};
        },
        // 改变城市
        changeCity(value) {
            if (value) {
                this.station = this.StationInfo.filter(
                    (item) => item.CodeValue.substr(0, 4) == value.substr(0, 4)
                );
                this.filterCounty = this.countyList.filter(
                    (item) => item.AreaCode.substr(0, 4) == value.substr(0, 4)
                );
            } else {
                // this.station = this.StationInfo;
                this.filterCounty = [];
                this.station = [];
                this.RowInfo.parame = {};
            }
        },
        // 改变区
        changeCounty(value) {
            if (value) {
                this.station = this.StationInfo.filter(
                    (item) => item.CodeValue.substr(0, 6) == value
                );
            } else {
                this.filterCounty = this.countyList.filter(
                    (item) =>
                        item.AreaCode.substr(0, 4) ==
                        this.RowInfo.parame.city.substr(0, 4)
                );
                this.station = this.StationInfo.filter(
                    (item) =>
                        item.CodeValue.substr(0, 4) ==
                        this.RowInfo.parame.city.substr(0, 4)
                );
            }
        },
        // 获取所有数据
        async getAllData(value) {
            this.cityList = value.cityList;
            this.countyList = value.countyList;
            this.filterCounty = this.countyList;
            this.station = this.StationInfo;
            if (this.cityList.length == 1) {
                this.RowInfo.parame.city = this.cityList[0].AreaCode;
                this.changeCity(this.RowInfo.parame.city)
            } 
        },
        //重置条件搜索
        handleCancelReset() {
            this.JCSJ = [];
            this.RowInfo = {
                params: {}, // 参数
                likeParams: {}, // 范围参数
                parame: {},
                otherParams: {},
            };
            if (this.cityList.length == 1) {
                this.RowInfo.parame.city = this.cityList[0].AreaCode;
            }
            // this.resetSearch();
            this.selectInspectionNum = [];
            this.ifInspectionNum = false;
            this.$refs.searchForm.resetParams();
            this.handleInspectionDataGet();
            // this.selectModal = false;
        },
        setVLPNColor(VLPNColor) {
            if (!config.vlpn_c[VLPNColor]) return `padding:2px 4px;`;
            const vlpn_c = config.vlpn_c[VLPNColor];
            return `display: inline-block;
              margin: 0;
              border-radius: 6px;
              border-style: double;
              text-align: center;
              padding:2px 4px;
              background: ${vlpn_c.Background};
              color:${vlpn_c.TextColor};
              border-color:${vlpn_c.BorderColor};
              font-weight: bold;
              font-size: 11pt;`;
        },
        // 获取ODB的InspectionNum
        async getODBInspectionNum() {
            let where = " where 1=1 ";
            for (let key in this.OBDParams) {
                if (
                    key == "FaultIndicator" ||
                    key == "IsCommunicated" ||
                    key == "IsHaveFaultCode" ||
                    key == "UnDoneReadyStatus"
                ) {
                    if (this.OBDParams[key] === "0")
                        where += ` and ${key} = 0 `;
                    else if (this.OBDParams[key])
                        where += ` and ${key} = ${this.OBDParams[key]} `;
                } else if (
                    key == "CommFailReason" ||
                    key == "UnFinifishedItem"
                ) {
                    if (this.OBDParams[key].length) {
                        let arr = this.OBDParams[key].map((item) => {
                            return `'${item}'`;
                        });
                        where += ` and ${key} in (${arr}) `;
                    }
                }
                // else if(this.OBDParams[key])
                //   where += ` and ${key} = ${this.OBDParams[key]} `;
            }
            if (where == " where 1=1 ") return;
            this.ifInspectionNum = true;
            const list = [
                {
                    tableName: "OBDInfo",
                    columns: "InspectionNum",
                    where: where,
                },
            ];
            let res = await this.$curl.get("api/hj/getCDData", {
                CDDataList: JSON.stringify(list),
            });
            const { data, state } = res;
            if (state) {
                this.selectInspectionNum = [];
                data[0].forEach((item) => {
                    this.selectInspectionNum.push(item.InspectionNum);
                });
            }
        },
        // 获取检测方法的InspectionNum
        async getMethodsInspectionNum() {
            let table = "";
            let where = " where 1=1 ";
            if (this.RowInfo.params.IUTYPE == "A") {
                table = "TSIData";
                const TSI = this.$refs.searchForm.TSI;
                const optionTSI = this.$refs.searchForm.optionTSI;
                for (let key in TSI) {
                    if (TSI[key]) {
                        if (optionTSI[key])
                            where += ` and ${key} ${optionTSI[key]} ${TSI[key]} `;
                        else {
                            where += ` and ${key} = ${TSI[key]} `;
                        }
                    }
                }
            } else if (this.RowInfo.params.IUTYPE == "B") {
                table = "ASMData";
                const ASM = this.$refs.searchForm.ASM;
                const optionASM = this.$refs.searchForm.optionASM;
                for (let key in ASM) {
                    if (ASM[key]) {
                        if (optionASM[key])
                            where += ` and ${key} ${optionASM[key]} ${ASM[key]} `;
                        else {
                            where += ` and ${key} = ${ASM[key]} `;
                        }
                    }
                }
            } else if (this.RowInfo.params.IUTYPE == "J") {
                table = "LingmanData";
                const Lingman = this.$refs.searchForm.Lingman;
                const optionLingman = this.$refs.searchForm.optionLingman;
                for (let key in Lingman) {
                    if (Lingman[key]) {
                        if(optionLingman[key]) {
                            where += ` and ${key} ${optionLingman[key]} ${Lingman[key]} `;
                        } else {
                            where += ` and ${key} = ${Lingman[key]} `;
                        }
                    }
                }
            } else if (this.RowInfo.params.IUTYPE == "G") {
                table = "LDData";
                const LDD = this.$refs.searchForm.LDD;
                const optionLDD = this.$refs.searchForm.optionLDD;
                for (let key in LDD) {
                    if (LDD[key]) {
                        if (optionLDD[key])
                            where += ` and ${key} ${optionLDD[key]} ${LDD[key]} `;
                        else {
                            where += ` and ${key} = ${LDD[key]} `;
                        }
                    }
                }
            } else if (this.RowInfo.params.IUTYPE == "F") {
                table = "LightProofSmokeData";
                const LightProofSmoke = this.$refs.searchForm.LightProofSmoke;
                const optionLightProofSmoke = this.$refs.searchForm
                    .optionLightProofSmoke;
                for (let key in LightProofSmoke) {
                    if (LightProofSmoke[key]) {
                        if (optionLightProofSmoke[key])
                            where += ` and ${key} ${optionLightProofSmoke[key]} ${LightProofSmoke[key]} `;
                        else {
                            where += ` and ${key} = ${LightProofSmoke[key]} `;
                        }
                    }
                }
            }
            if (where == " where 1=1 ") return;
            this.ifInspectionNum = true;
            const list = [
                {
                    tableName: table,
                    columns: "InspectionNum",
                    where: where,
                },
            ];
            let res = await this.$curl.get("api/hj/getCDData", {
                CDDataList: JSON.stringify(list),
            });
            const { data, state } = res;
            if (state) {
                this.selectInspectionNum = [];
                this.selectInspectionNum = data[0].map((item) => {
                    return item.InspectionNum;
                });
            }
        },
        // 查询
        async modelSearch() {
            this.OBDParams = this.$refs.searchForm.OBDParams;
            if (this.RowInfo.params.IUTYPE)
                await this.getMethodsInspectionNum();
            if (Object.keys(this.OBDParams).length)
                await this.getODBInspectionNum();
            this.selectModal = !this.selectModal;
        },
        //获取左侧历史检测数据
        handleInspectionDataGet() {
            if (!this.isExportExcel) this.loading = true;
            if (this.isFind != false) this.pageIndex = 1;
            this.isFind = true;
            this.RowInfo.JCSJ1 = formatDates(
                this.JCSJ[0],
                "yyyy-MM-dd 00:00:00"
            );
            this.RowInfo.JCSJ2 = formatDates(
                this.JCSJ[1],
                "yyyy-MM-dd 23:59:59"
            );
            let param = {
                VLPNandSceneCode: this.VLPNandSceneCode,
                pageSize: this.pageSize,
                pageIndex: this.pageIndex,
                selectInspectionNum: this.selectInspectionNum,
                ifInspectionNum: this.ifInspectionNum,
                InspectionNum: this.InspectionNum,
                ...this.RowInfo,
            };
            param.isExportExcel = this.isExportExcel;
            this.$curl.post("api/hj/getHistorySearch", param).then((res) => {
                if (res.state) {
                    if (this.isExportExcel) {
                        this.exportData = res.lst;
                        this.exportExcelInfo();
                        this.isExportExcel = false;
                        this.exportDataNum = 0;
                    } else {
                        this.dataTable = res.result.list;
                        this.dataCount = res.result.total;
                        if(!this.RowInfo.params.IUTYPE) {
                            this.ifInspectionNum = false;
                            this.selectInspectionNum = [];
                        }
                        this.loading = false;
                        if (res.result.list.length)
                            this.currenDate = res.result.list[0];
                        else {
                            this.currenDate = {};
                            return;
                        }
                        this.$nextTick(() => {
                            let timer = setTimeout(() => {
                                this.$refs.rightBlock &&
                                    this.$refs.rightBlock.getInspectionReport();
                                clearTimeout(timer);
                            }, 0);
                        });
                    }
                }
            });
        },

        changePage(index = 1) {
            //分页功能,index为当前页
            this.pageIndex = index;
            this.loading = true;
            this.isFind = false;
            this.handleInspectionDataGet();
        },
        changePageSize(value) {
            this.pageSize = value;
            this.pageIndex = 1;
            this.loading = true;
            this.isFind = false;
            this.handleInspectionDataGet();
        },
        async getvehList() {
            const _this = this;
            const list = [
                {
                    tableName: "StationInfo",
                    columns: "StationCode as CodeValue,StationName as CodeName",
                    where: "",
                },
                {
                    tableName: "CD_InspectionMethod",
                    columns: " CodeValue, CodeName",
                    where: "where  IsAvailable=1",
                },
                {
                    tableName: "CD_FuelType",
                    columns: " CodeValue, CodeName",
                    where: "where  IsAvailable=1",
                },
                {
                    tableName: "CD_GAVType",
                    columns: " CodeValue, CodeName",
                    where: "where  IsAvailable=1",
                },
                {
                    tableName: "CD_PG",
                    columns: " CodeValue, CodeName",
                    where: "where  IsAvailable=1",
                },
                {
                    tableName: "CD_EmissionStandard",
                    columns: " CodeValue, CodeName",
                    where: "where  IsAvailable=1",
                },
                {
                    tableName: "CD_VehicleKind",
                    columns: " CodeValue, CodeName",
                    where: "where IsAvailable=1",
                },
                {
                    tableName: "CD_InspectionWay",
                    columns: " CodeValue, CodeName",
                    where: "where IsAvailable=1",
                },
                {
                    tableName: "CD_TSI_GKLX",
                    columns: "CodeValue,CodeName,IsAvailable",
                    where: "where  IsAvailable=1",
                },
                {
                    tableName: "CD_InspectionNature",
                    columns: "CodeValue, CodeName",
                    where: " where IsAvailable=1",
                },
                {
                    tableName: "CD_VLPNColor",
                    columns: "CodeValue, CodeName",
                    where: " where IsAvailable=1",
                },
                {
                    tableName: "CD_OCHA",
                    columns: "CodeValue, CodeName",
                    where: " where IsAvailable=1",
                },
                {
                    tableName: "CD_InspectionKind",
                    columns: "CodeValue, CodeName",
                    where: " where IsAvailable=1",
                },
                {
                    tableName: "CD_UseOfAuto",
                    columns: "CodeValue, CodeName",
                    where: " where IsAvailable=1",
                },
                {
                    tableName: "CD_AlarmType",
                    columns: "CodeValue, CodeName",
                    where: " where IsAvailable=1",
                },
            ];
            if (_this.$getDBTable) {
                let cdList = list.map((item) => {
                    return item.tableName;
                });
                await _this.$getDBTable(cdList).then((data) => {
                    let dataList = data.map((v, index) => {
                        v = JSON.parse(v);
                        if (index != 0)
                            v = v.filter((e) => {
                                return e.IsAvailable == 1;
                            });
                        return v;
                    });
                    let cdTSI = [];
                    [
                        _this.StationInfo,
                        _this.IUTYPE,
                        _this.FuelTypeList,
                        _this.VLPNTypeList,
                        _this.PG,
                        _this.emisphase,
                        _this.VehicleKind,
                        _this.InspectionWay,
                        cdTSI,
                        _this.InspectionNature,
                        _this.VLPNColor,
                        _this.OCHA,
                        _this.InspectionKind,
                        _this.UseOfAuto,
                        _this.AlarmType
                    ] = [...dataList];
                    cdTSI.forEach((item) => {
                        _this.initForm.cd_tsi_gklx[item.CodeValue] =
                            item.CodeName;
                    });
                    _this.FuelTypeList.forEach((item) => {
                        _this.initform.cd_Fueltype[item.CodeValue] =
                            item.CodeName;
                    });
                    _this.InspectionNature.forEach((item) => {
                        _this.initform.cd_InspectionNature[item.CodeValue] =
                            item.CodeName;
                    });
                    _this.VLPNColor.forEach((item) => {
                        _this.initform.cd_VLPNColor[item.CodeValue] =
                            item.CodeName;
                    });
                    _this.OCHA.forEach((item) => {
                        _this.initform.cd_OCHA[item.CodeValue] = item.CodeName;
                    });
                    _this.InspectionKind.forEach((item) => {
                        _this.initform.cd_InspectionKind[item.CodeValue] =
                            item.CodeName;
                    });
                    _this.UseOfAuto.forEach((item) => {
                        _this.initform.cd_UseOfAuto[item.CodeValue] =
                            item.CodeName;
                    });
                    _this.VLPNTypeList.forEach((item) => {
                        _this.initform.cd_VLPNType[item.CodeValue] =
                            item.CodeName;
                    });
                    _this.emisphase.forEach((item) => {
                        _this.initform.cd_EmissionStandard[item.CodeValue] =
                            item.CodeName;
                    });
                    // _this.handleInspectionDataGet();
                    _this.loading = false;
                });
            } else {
                let res = await _this.$curl.get("api/hj/getCDData", {
                    CDDataList: JSON.stringify(list),
                });
                let { data, state } = res;
                if (state) {
                    data = data.map((item, index) => {
                        if (index != 0)
                            return item.filter((v) => v.IsAvailable == 1);
                        return item;
                    });
                    _this.StationInfo = data[0];
                    _this.IUTYPE = data[1];
                    _this.FuelTypeList = data[2];
                    _this.VLPNTypeList = data[3];
                    _this.PG = data[4];
                    _this.emisphase = data[5];
                    _this.VehicleKind = data[6];
                    _this.InspectionWay = data[7];
                    _this.InspectionNature = data[9];
                    _this.VLPNColor = data[10];
                    _this.AlarmType = data[14];
                    (_this.OCHA = data[11]),
                        (_this.InspectionKind = data[12]),
                        (_this.UseOfAuto = data[13]),
                        data[8].forEach((item) => {
                            _this.initForm.cd_tsi_gklx[item.CodeValue] =
                                item.CodeName;
                        });
                    _this.InspectionNature.forEach((item) => {
                        _this.initform.cd_InspectionNature[item.CodeValue] =
                            item.CodeName;
                    });
                    _this.FuelTypeList.forEach((item) => {
                        _this.initform.cd_Fueltype[item.CodeValue] =
                            item.CodeName;
                    });
                    _this.VLPNColor.forEach((item) => {
                        _this.initform.cd_VLPNColor[item.CodeValue] =
                            item.CodeName;
                    });
                    _this.OCHA.forEach((item) => {
                        _this.initform.cd_OCHA[item.CodeValue] = item.CodeName;
                    });
                    _this.InspectionKind.forEach((item) => {
                        _this.initform.cd_InspectionKind[item.CodeValue] =
                            item.CodeName;
                    });
                    _this.UseOfAuto.forEach((item) => {
                        _this.initform.cd_UseOfAuto[item.CodeValue] =
                            item.CodeName;
                    });
                    _this.VLPNTypeList.forEach((item) => {
                        _this.initform.cd_VLPNType[item.CodeValue] =
                            item.CodeName;
                    });
                    _this.emisphase.forEach((item) => {
                        _this.initform.cd_EmissionStandard[item.CodeValue] =
                            item.CodeName;
                    });
                    // _this.handleInspectionDataGet();
                    _this.loading = false;
                }
            }
        },

        setHeight() {
            this.height = this.$refs.inheight.offsetHeight - 98;
            this.width = this.$refs.inheight.offsetWidth;
        },
        returncodename(namelist, codevalue) {
            if (namelist.length == 0) return codevalue;
            let CodeName = "";
            namelist.forEach((item) => {
                if (item.CodeValue == codevalue) CodeName = item.CodeName;
            });
            return CodeName;
        },
        returnMethodnames(namelist, codevalue) {
            if (namelist) {
                let CodeName = "";
                if (codevalue) {
                    let arr = codevalue.split(",");
                    if (arr.length > 1) {
                        let typeList = [];
                        arr.forEach((item) => {
                            let index = namelist.findIndex(
                                (aitem) => item == aitem.CodeValue
                            );
                            if (index != -1) {
                                typeList.push(namelist[index].CodeName);
                            }
                        });
                        CodeName = typeList.join("、");
                    } else {
                        namelist.forEach((item) => {
                            if (item.CodeValue == codevalue)
                                CodeName = item.CodeName;
                        });
                    }
                }
                return CodeName;
            }
        },
        // 获取用户标签页配置
        getProcessMenuConfig() {
            this.$curl.get("api/hj/getUserProcessMenuConfig").then((res) => {
                // console.log(res);
                if (res.code === 1) {
                    this.defaultCheckSelTab = res.data.checkSelTab;
                    this.checkSelTab = res.data.checkSelTab;
                } else {
                    this.checkSelTab = this.defaultCheckSelTab;
                }
            });
        },
    },
    created() {
        this.getvehList();
    },
    mounted() {
          this.getUserAreaInfo();
        this.$nextTick(() => {
            this.setHeight();
            window.addEventListener("resize", this.setHeight);
        });
        this.getProcessMenuConfig();
    },
    destroyed() {
        window.removeEventListener("resize", this.setHeight);
    },
};
</script>

<style lang="less" scoped>
.tableShow {
    display: none;
}

.leftRight /deep/ .ivu-checkbox-group-item,
.tableShow /deep/ .ivu-checkbox-group-item {
    display: block !important;
}

.leftRight /deep/ .ivu-checkbox-group-item,
.tableShow /deep/ .ivu-checkbox-group-item {
    margin-left: 18px;
    height: 30px;
}

.ind /deep/ .table_td1 {
    border: 1px solid black;
    width: 230px;
    height: 52px;
    font-size: 17px;
}

.ind /deep/ .table_td2 {
    border: 1px solid black;
    width: 436px;
    font-size: 17px;
}

.ind /deep/ .ivu-form-item-label {
    font-size: 14px;
}

.tglpx_showes,
.tglpx_showe {
    position: absolute;
    width: 400px;
    top: 40px;
    right: -160px;
    z-index: 9999;
    padding: 10px;
    box-shadow: rgba(0, 0, 0, 0.35) -4px 7px 10px 2px;
}

.tglpx_showe {
    top: 52px;
    right: 100px;
}

.pagediv {
    width: 100%;
    padding: 8px 10px;
    background-color: rgba(81, 90, 110, 0.3);
    display: flex;
    justify-content: space-between;
}

.active {
    cursor: pointer;
    background-color: rgba(45, 140, 240, 0.2);
    width: 100%;
}

.img_div {
    display: inline-block;
    margin: 5px 10px;
}

.img_div img {
    display: block;
    width: 140px;
    height: 100px;
}

.videoInfo {
    margin-left: 20px;

    button {
        margin-bottom: 8px;
        margin-right: 8px;
    }
}

.ml10 {
    margin-left: 10px;
}

#report /deep/ .ivu-tabs-bar {
    margin-bottom: 0px;
}

.ivu-divider-horizontal.ivu-divider-with-text-left {
    margin-top: 0px;
}

.leftStyle {
    margin-top: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.scroller::-webkit-scrollbar {
    width: 10px;
}

@media screen and(max-width: 1430px) {
    .leftRight {
        display: none;
    }

    .tableShow {
        display: block;
    }
}
</style>
