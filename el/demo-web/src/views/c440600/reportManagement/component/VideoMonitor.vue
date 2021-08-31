//实时视频监控
<template>
    <Card
        :bordered="false"
        class="videoMonitor_div"
        style="position: relative; height: 100%;width:100%;"
    >
        <div slot="title" style="height: 22px">
            <RadioGroup
                style="margin: 4px 0"
                v-model="selVideoType"
                @on-change="RadioChange"
            >
                <Radio label="realVideo" v-show="showRealVideo">
                    <span>实时</span>
                </Radio>
                <Radio label="playbackVideo" v-show="showPlaybackVideo">
                    <span>海康威视回放</span>
                </Radio>
                <Radio label="ieVideo">
                    <span>IE播放</span>
                </Radio>
            </RadioGroup>
            <span style="position: relative; float: right; cursor: pointer">
                <Tooltip content="筛选" v-show="selVideoType != 'ieVideo'">
                    <span @click.stop="showModel = !showModel">
                        <i style="font-size: 24px"></i>筛选
                    </span>
                </Tooltip>
            </span>
            <Poptip
                placement="bottom"
                confirm
                title="是否确定发送监管指令,强制要求工控机停检?"
                @on-ok="stopCheck()"
                style="float: right"
            >
                <Button
                    type="primary"
                    size="small"
                    v-show="showCommand()"
                    style="float: right; margin-right: 10px"
                    >停检指令</Button
                >
            </Poptip>
            <div
                v-show="showModel"
                style="
                    position: absolute;
                    top: 38px;
                    right: 0px;
                    background: rgb(248, 248, 249);
                    z-index: 2001;
                "
                :key="1"
            >
                <Card
                    :padding="0"
                    shadow
                    style="width: 440px"
                    v-show="selVideoType == 'realVideo'"
                >
                    <div style="padding: 4px">
                        <div style="padding: 4px 0">
                            <Select
                                v-model="WndNum"
                                @on-change="changeWndNum"
                                placeholder="请选择窗口分割数"
                            >
                                <Option
                                    v-for="item in WndNumList"
                                    :value="item.value"
                                    :key="item.value"
                                    >{{ item.label }}</Option
                                >
                            </Select>
                        </div>
                        <div style="padding: 4px 0">
                            <Select
                                v-model="LoginDevice"
                                placeholder="请选择已登录设备"
                            >
                                <Option
                                    v-for="item in LoginDeviceList"
                                    :value="item.value"
                                    :key="item.value"
                                    >{{ item.label }}</Option
                                >
                            </Select>
                        </div>
                        <div style="padding: 4px 0">
                            <Select v-model="Channel" placeholder="请选择通道">
                                <Option
                                    v-for="item in ChannelList"
                                    :value="item.value"
                                    :key="item.value"
                                    >{{ item.label }}</Option
                                >
                            </Select>
                        </div>
                        <div>
                            <Button
                                type="success"
                                size="small"
                                @click="searchClick"
                                >登录</Button
                            >
                            <Button
                                type="success"
                                size="small"
                                @click="StartRealPlay"
                                style="margin-left: 5px"
                                >开始预览</Button
                            >
                            <Button
                                type="success"
                                size="small"
                                @click="clickLogout"
                                style="margin-left: 5px"
                                >退出</Button
                            >
                        </div>
                    </div>
                </Card>
                <Card
                    :padding="0"
                    shadow
                    style="width: 320px"
                    v-if="selVideoType == 'playbackVideo'"
                >
                    <div style="padding: 4px; text-align: center">
                        <div style="padding: 4px 0">
                            <Select
                                v-model="WndNum"
                                @on-change="changeWndNum"
                                placeholder="请选择窗口分割数"
                            >
                                <Option
                                    v-for="item in WndNumList"
                                    :value="item.value"
                                    :key="item.value"
                                    >{{ item.label }}</Option
                                >
                            </Select>
                        </div>
                        <div style="padding: 4px 0">
                            <Select
                                v-model="LoginDevice"
                                placeholder="请选择已登录设备"
                            >
                                <Option
                                    v-for="item in LoginDeviceList"
                                    :value="item.value"
                                    :key="item.value"
                                    >{{ item.label }}</Option
                                >
                            </Select>
                        </div>
                        <div style="padding: 4px 0">
                            <Select v-model="Channel" placeholder="请选择通道">
                                <Option
                                    v-for="item in ChannelList"
                                    :value="item.value"
                                    :key="item.value"
                                    >{{ item.label }}</Option
                                >
                            </Select>
                        </div>
                        <div style="padding: 4px 0">
                            <DatePicker
                                type="datetimerange"
                                split-panels
                                placement="bottom-end"
                                v-model="timeRange"
                                format="yyyy-MM-dd HH:mm:ss"
                                placeholder="请输入时间"
                                v-bind:options="optionsDate"
                                style="width: 100%"
                            ></DatePicker>
                        </div>
                        <div style="padding: 4px 0">
                            <Select
                                v-model="record_streamtype"
                                placeholder="请选择码流"
                            >
                                <Option value="1" key="1">主码流</Option>
                                <Option value="2" key="2">子码流</Option>
                            </Select>
                        </div>
                        <div>
                            <Button
                                type="success"
                                size="small"
                                @click="searchClick"
                                >登录</Button
                            >
                            <Button
                                type="success"
                                size="small"
                                @click="clickLogout"
                                style="margin-left: 5px"
                                >退出</Button
                            >
                        </div>
                        <div style="padding: 4px 0">
                            <Button
                                type="success"
                                size="small"
                                @click="clickStartPlayback"
                                >回放</Button
                            >
                            <Button
                                type="success"
                                size="small"
                                style="margin-left: 5px"
                                @click="clickStopPlayback"
                                >停止回放</Button
                            >
                            <Button
                                type="success"
                                size="small"
                                style="margin-left: 5px"
                                @click="clickPause"
                                >暂停</Button
                            >
                        </div>
                        <div style="padding: 4px 0">
                            <Button
                                type="success"
                                size="small"
                                @click="clickResume"
                                >恢复</Button
                            >
                            <Button
                                type="success"
                                size="small"
                                style="margin-left: 5px"
                                @click="clickPlaySlow"
                                >慢放</Button
                            >
                            <Button
                                type="success"
                                size="small"
                                style="margin-left: 5px"
                                @click="clickPlayFast"
                                >快放</Button
                            >
                        </div>
                    </div>
                </Card>
                <!-- 解决IE浏览器下Object遮挡住div的问题 -->
                <iframe
                    id="iframe1"
                    src=""
                    frameBorder="0"
                    marginHeight="0"
                    marginWidth="0"
                    style="
                        position: absolute;
                        visibility: inherit;
                        top: 0px;
                        left: 0px;
                        width: 100%;
                        height: 140%;
                        z-index: -1;
                        filter: alpha(opacity=0);
                    "
                ></iframe>
            </div>
        </div>
        <div
            ref="VideoElement"
            style="
                overflow: hidden;
                position: absolute;
                left: 0px;
                right: 0px;
                top: 50px;
                bottom: 0;
            "
        >
            <div
                id="divPlugin"
                class="plugin"
                v-show="selVideoType != 'ieVideo'"
            ></div>
            <div v-show="selVideoType == 'ieVideo' && IsFinishCheck == 0">
                <a
                    style="
                        display: block;
                        margin: 20px auto;
                        text-align: center;
                    "
                    :href="hrefs"
                    >实时视频
                </a>
            </div>
            <div v-show="selVideoType == 'ieVideo' && IsFinishCheck == 1">
                <a
                    style="
                        display: block;
                        margin: 20px auto;
                        text-align: center;
                    "
                    :href="playBackHrefs"
                    >回放视频
                </a>
            </div>
        </div>
    </Card>
</template>

<script>
require("../../../../../public/hj/js/jquery-1.7.1.min.js");
require("../../../../../public/hj/js/AES.js");
require("../../../../../public/hj/js/cryptico.min.js");
require("../../../../../public/hj/js/crypto-3.1.2.min.js");
import { WebVideoCtrls } from "../../../../../public/hj/js/webVideoCtrl";
import "../../../../../public/hj/js/jsPlugin-1.2.0.min.js";
import { formatDates } from "../../../utils/utils";
import { setTimeout } from "timers";
export default {
    name: "videonode",
    props: {
        InspectionNum: {
            type: String,
        },
        SceneCode: {
            type: String,
            default: "",
        },
        StationCode: {
            type: String,
            default: "",
        },
        InspectTimes: {
            type: Object,
        },
        IsFinishCheck: {
            type: Number,
        },
    },
    data() {
        return {
            isUseMapIP: false,
            curMapIP: "",
            optionsDate: {
                disabledDate: function (date) {
                    var disabledDay = date.getFullYear();
                    //取2018年至今的时间范围.
                    return disabledDay <= 2018 || date.valueOf() > Date.now();
                },
            },
            timeRange: [],
            showRealVideo: true,
            showPlaybackVideo: false,
            showModel: false,
            selVideoType: "ieVideo",
            g_iWndIndex: 0,
            iWidth: "300px",
            iHeight: "300px",
            deviceport: "", //设备端口
            rtspport: 0, //RTSP端口
            szIP: "", //IP
            szPort: "80", //端口号
            szUsername: "", //用户名
            szPassword: "", //密码
            MapIP: "", // 映射IP
            iStreamType: 1,
            bZeroChannel: false,
            WebVideoCtrl: WebVideoCtrls,
            record_streamtype: "1", //回放的码流类型
            Channel: 0,
            WndNum: localStorage.getItem("WndNum") || "1",
            WndNumList: [
                {
                    //窗口分割数
                    value: "1",
                    label: "1x1",
                },
                {
                    value: "2",
                    label: "2x2",
                },
                {
                    value: "3",
                    label: "3x3",
                },
                {
                    value: "4",
                    label: "4x4",
                },
            ],
            ChannelList: [], //通道列表
            LoginDeviceList: [], //已经登录的设备
            LoginDevice: "",
            IsDVRUseMapIP: "", //硬盘录像机是否是使用映射地址
            time: null,
            stationCityCode: "", // 站点城市编码
            CAMChannel: null,
        };
    },
    computed: {
        hrefs() {
            let host = this.isUseMapIP ? this.curMapIP : window.location.host;
            let szStartTime = "";
            let szEndTime = "";
            // IsDVRUseMapIP: this.IsDVRUseMapIP,
            // Port: '80',
            let selStation = JSON.stringify([
                {
                    IP: this.szIP,
                    Port: this.szPort,
                    LoginName: this.szUsername,
                    LoginPassword: this.szPassword,
                    MapIP: this.MapIP,
                    StationCode: this.StationCode,
                    SceneCode: this.SceneCode
                },
            ]);
            // if (this.InspectTimes.startTime != "") szStartTime = new Date(this.InspectTimes.startTime).getTime()
            // if (this.InspectTimes.endTime != "") szEndTime = new Date(this.InspectTimes.endTime).getTime();
            // szStartTime = new Date(this.timeRange[0]).getTime()
            // szEndTime = new Date(this.timeRange[1]).getTime();
            return `alert:http://${host}/HKWS/index.html?selStation=${encodeURIComponent(
                selStation
            )}?
      szStartTime=''?szEndTime=''?IsDVRUseMapIP=${
          this.IsDVRUseMapIP
      }?allCAMIDinfo=[null]?userRole=''?channel=${this.CAMChannel}`;
        },
        playBackHrefs() {
            let host = this.isUseMapIP ? this.curMapIP : window.location.host;
            let szStartTime = "";
            let szEndTime = "";
            // IsDVRUseMapIP: this.IsDVRUseMapIP,
            // Port: '80',
            let selStation = JSON.stringify({
                IP: this.szIP,
                Port: this.szPort,
                LoginName: this.szUsername,
                LoginPassword: this.szPassword,
                MapIP: this.MapIP,
                StationCode: this.StationCode,
                SceneCode: this.SceneCode
            });
            // if (this.InspectTimes.startTime != "") szStartTime = new Date(this.InspectTimes.startTime).getTime()
            // if (this.InspectTimes.endTime != "") szEndTime = new Date(this.InspectTimes.endTime).getTime();
            // szStartTime = this.timeRange[0];
            // szEndTime = this.timeRange[1];
            szStartTime = new Date(this.timeRange[0]).getTime();
            szEndTime = new Date(this.timeRange[1]).getTime();
            return `alert:http://${host}/HKWS/playBack.html?selStation=${encodeURIComponent(
                selStation
            )}?szStartTime='${szStartTime}'?szEndTime='${szEndTime}'?IsDVRUseMapIP=${
                this.IsDVRUseMapIP
            }?allCAMIDinfo=[null]?channel=${this.CAMChannel}`;
        },
    },
    methods: {
        getCAMChannel() {
            if (!this.StationCode || !this.SceneCode) return;
            this.$curl
                .get("api/public/hj/getVideoChannel", {
                    StationCode: this.StationCode,
                    SceneCode: this.SceneCode,
                })
                .then((res) => {
                    if (res.code) {
                        this.CAMChannel = res.data.channel;
                    }
                });
        },
        async getisUseMapIP() {
            let res = await this.$curl.get("api/hj/getisUseMapIP", {});
            this.isUseMapIP = res.isUseMapIP == "true" ? true : false;
            this.getDVRUseMapIPConfig();
            if (this.isUseMapIP) this.getMapIPtoIE();
        },
        async getMapIPtoIE() {
            let res = await this.$curl.get("api/hj/getMapIPtoIE", {});
            this.curMapIP = res.MapIPtoIE;
        },
        getDVRUseMapIPConfig() {
            this.$curl
                .get("api/hj/getAllSysConfig", {
                    param: JSON.stringify({
                        where: "IsDVRUseMapIP",
                        sysConfigType: "02",
                    }),
                })
                .then((res) => {
                    this.IsDVRUseMapIP = this.isUseMapIP ? 
                        (res.data[0].FieldValue == "true" ? true : false) : false
                });
        },
        showCommand() {
            return this.IsFinishCheck == 1 ? false : true;
        },
        videoSize() {
            return {
                Width: this.$refs.VideoElement
                    ? this.$refs.VideoElement.offsetWidth - 6
                    : "400",
                Height: this.$refs.VideoElement
                    ? this.$refs.VideoElement.offsetHeight
                    : "340",
            };
        },
        async stopCheck() {
            if (!this.StationCode) return;
            const keys = `ljfw/fwd/jgzl/${this.StationCode}`;
            const SceneCode = this.Channel;
            const value = {
                ID: this.InspectionNum,
                CODE: 0,
                INFO:
                    "由于监管部门强制干预,检测线主机在接收到监管指令之后,应马上终止车辆检测工作",
            };
            //推送
            const Data = `${SceneCode}#${JSON.stringify(value)}`;
            const result = await this.$curl.post("api/hj/stopInspectEmit", {
                keys,
                Data,
                ID: this.InspectionNum,
                StationCode: this.StationCode,
                CityCode: this.stationCityCode,
            });
            if (result) {
                this.$Notice.warning({
                    title: result.msg,
                });
            }
        },
        clickGoIE() {
            this.clickLogout();
            const stationCode = this.StationCode;
        },
        changeWndNum(value) {
            // 修改视频窗口个数
            let iType = this.WndNum;
            iType = parseInt(iType, 10);
            let videoSize = this.videoSize();
            this.iWidth = videoSize.Width;
            this.iHeight = videoSize.Height;
            WebVideoCtrl.I_ChangeWndNum(iType);
            localStorage.setItem("WndNum", value);
        },
        RadioChange(value) {
            //if(value =='ieVideo') return;
            //this.videoInitPlugin();
        },
        getStationInfo() {
            //获取站点信息
            // let params = { stationID: this.StationCode };
            if (!this.StationCode) return;
            this.$curl
                .get("api/hj/getDVRInfo", {
                    stationID: this.StationCode,
                    SceneCode: this.SceneCode,
                })
                .then((res) => {
                    if (res.DVRInfo) {
                        this.szIP = res.DVRInfo.IP; //IP
                        // this.szPort = 80; //端口号
                        this.MapIP = res.DVRInfo.MapIP; //映射IP
                        this.szPort = res.DVRInfo.Port; //端口号
                        this.szUsername = res.DVRInfo.LoginName; //用户名
                        this.szPassword = res.DVRInfo.LoginPassword; //密码
                        this.stationCityCode = res.DVRInfo.CityCode;
                        //this.searchClick();
                    }
                })
                .catch((error) => {
                    console.log("获取站点信息失败!");
                });
        },
        videoInitPlugin() {
            const _this = this;
            let iRet = WebVideoCtrl.I_CheckPluginInstall();
            if (iRet === -1) {
                alert("您还未安装过插件，请先安装WebComponentsKit.exe！");
                //this.downLoadPlugin();
                return;
            }
            _this.initPlugin();
        },
        downLoadPlugin() {
            if (confirm(`是否下载该插件?`)) {
                window.location.href = `/dashboard/downloadPlug`;
            }
        },
        initPlugin() {
            // 初始化视频播放插件
            const _this = this;
            // 初始化插件参数及插入插件
            let videoSize = this.videoSize();
            this.iWidth = videoSize.Width;
            this.iHeight = videoSize.Height;
            WebVideoCtrl.I_InitPlugin(this.iWidth, this.iHeight, {
                bWndFull: true, //是否支持单窗口双击全屏，默认支持 true:支持 false:不支持
                iPackageType: 2,
                iWndowType: 1,
                bNoPlugin: true,
                cbSelWnd: function (xmlDoc) {
                    //获取点击的通道
                    _this.g_iWndIndex = parseInt(
                        $(xmlDoc).find("SelectWnd").eq(0).text(),
                        10
                    );
                    var szInfo = "当前选择的窗口编号：" + _this.g_iWndIndex;
                    console.log(szInfo);
                },
                cbDoubleClickWnd: function (iWndIndex, bFullScreen) {
                    // console.log('双击窗口');  // 双击未进入该函数
                    var szInfo = "当前放大的窗口编号：" + iWndIndex;
                    if (!bFullScreen) {
                        szInfo = "当前还原的窗口编号：" + iWndIndex;
                    }
                    console.log(szInfo);
                },
                cbEvent: function (iEventType, iParam1, iParam2) {
                    if (2 == iEventType) {
                        // 回放正常结束
                        console.log("窗口" + iParam1 + "回放结束！");
                    } else if (-1 == iEventType) {
                        console.log("设备" + iParam1 + "网络错误！");
                    } else if (3001 == iEventType) {
                        clickStopRecord(g_szRecordType, iParam1);
                    }
                },
                cbRemoteConfig: function () {
                    console.log("关闭远程配置库！");
                },
                cbInitPluginComplete: function () {
                    WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin");

                    // 检查插件是否最新
                    if (-1 == WebVideoCtrl.I_CheckPluginVersion()) {
                        console.log("请先安装软件！");
                        // alert("检测到新的插件版本，双击开发包目录里的WebComponentsKit.exe升级！");
                        return;
                    }
                },
            });
        },
        searchClick() {
            const _this = this;
            let szIP = this.szIP,
                szPort = this.szPort,
                szUsername = this.szUsername,
                szPassword = this.szPassword;
            console.log(
                "IP" + szIP,
                "Port" + szPort,
                "Name" + szUsername,
                "Pass" + szPassword
            );
            if (!szIP || !szPort || !szUsername || !szPassword) {
                return this.$Notice.warning({
                    title: "提示",
                    desc: "关键信息不能为空！",
                });
            }
            //if(this.Channel=="" || !this.Channel) return;

            var szDeviceIdentify = szIP + "_" + szPort;

            var iRet = WebVideoCtrl.I_Login(
                szIP,
                1,
                szPort,
                szUsername,
                szPassword,
                {
                    async: true,
                    success: function (xmlDoc) {
                        console.log("登陆成功！");
                        _this.LoginDeviceList.push({
                            label: szDeviceIdentify,
                            value: szDeviceIdentify,
                        }); //添加已登录的设备
                        setTimeout(function () {
                            _this.LoginDevice = szDeviceIdentify;
                            _this.getChannelInfo();
                            _this.getDevicePort();
                            // _this.clickStartPlayback()
                        }, 10);
                        // _this.StartRealPlay();
                    },
                    error: function (status, xmlDoc) {
                        console.log(xmlDoc);
                        console.log(
                            szDeviceIdentify + " 登录失败！",
                            status,
                            xmlDoc
                        );
                    },
                }
            );

            if (-1 == iRet) {
                console.log(szDeviceIdentify + " 已登录过！");
            }
        },
        clickLogout() {
            this.WndNum = localStorage.getItem("WndNum") || "1";
            this.changeWndNum(localStorage.getItem("WndNum")); //设置默认单窗口
            var szDeviceIdentify = this.LoginDevice,
                szInfo = "";

            if (!szDeviceIdentify) {
                return;
            }
            this.LoginDevice = "";

            for (let i = 0; i <= 16; i++) {
                WebVideoCtrl.I_Stop({
                    iWndIndex: i,
                    success: function (t) {},
                    error: function () {},
                });
            }

            var iRet = WebVideoCtrl.I_Logout(szDeviceIdentify);
            if (0 == iRet) {
                szInfo = "退出成功！";

                this.LoginDeviceList = [];
                this.getChannelInfo();
                this.getDevicePort();
                this.$Notice.success({
                    title: "提示",
                    desc: "退出成功",
                });
            } else {
                szInfo = "退出失败！";
                this.$Notice.error({
                    title: "提示",
                    desc: "退出失败",
                });
            }
            console.log(szDeviceIdentify + " " + szInfo);
        },
        StartRealPlay() {
            //开始预览
            var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex),
                szDeviceIdentify = this.LoginDevice,
                iRtspPort = parseInt(this.rtspport, 10),
                iChannelID = parseInt(this.Channel, 10),
                bZeroChannel = false,
                szInfo = "";

            var iStreamType = this.iStreamType;

            if (null == szDeviceIdentify) {
                return;
            }
            var startRealPlay = function () {
                WebVideoCtrl.I_StartRealPlay(szDeviceIdentify, {
                    // iRtspPort: iRtspPort,
                    // iPort: iRtspPort,
                    iStreamType: iStreamType,
                    iChannelID: iChannelID,
                    // bZeroChannel: bZeroChannel,
                    success: function () {
                        szInfo = "开始预览成功！";
                        console.log(szDeviceIdentify + " " + szInfo);
                    },
                    error: function (status, xmlDoc) {
                        if (403 === status) {
                            szInfo = "设备不支持Websocket取流！";
                        } else {
                            szInfo = "开始预览失败！";
                        }
                        console.log(szDeviceIdentify + " " + szInfo);
                    },
                });
            };

            if (oWndInfo != null) {
                // 已经在播放了，先停止
                WebVideoCtrl.I_Stop({
                    success: function () {
                        startRealPlay();
                    },
                });
            } else {
                startRealPlay();
            }
        },
        getDevicePort() {
            var szDeviceIdentify = this.LoginDevice;

            if (null == szDeviceIdentify) {
                return;
            }
            var oPort = WebVideoCtrl.I_GetDevicePort(szDeviceIdentify);
            if (oPort != null) {
                this.deviceport = oPort.iDevicePort;
                this.rtspport = oPort.iRtspPort;

                console.log(szDeviceIdentify + " 获取端口成功！");
            } else {
                console.log(szDeviceIdentify + " 获取端口失败！");
            }
        },
        getChannelInfo() {
            const _this = this;
            var szDeviceIdentify = this.LoginDevice;
            this.ChannelList = [];
            this.Channel = 0;
            console.log("设备标识：", szDeviceIdentify);
            if (null == szDeviceIdentify) {
                return;
            }

            // 模拟通道
            WebVideoCtrl.I_GetAnalogChannelInfo(szDeviceIdentify, {
                async: true,
                success: function (xmlDoc) {
                    var oChannels = $(xmlDoc).find("VideoInputChannel");

                    $.each(oChannels, function (i) {
                        var id = $(this).find("id").eq(0).text(),
                            name = $(this).find("name").eq(0).text();
                        if ("" == name) {
                            name = "Camera " + (i < 9 ? "0" + (i + 1) : i + 1);
                        }
                        _this.ChannelList.push({
                            label: name,
                            value: id,
                        });
                    });
                    console.log("模拟通道列表:", _this.ChannelList);
                    // _this.Channel = _this.SceneCode;
                    console.log(szDeviceIdentify + " 获取模拟通道成功！");
                },
                error: function (status, xmlDoc) {
                    console.log(xmlDoc);
                    console.log(
                        szDeviceIdentify + " 获取模拟通道失败！",
                        status,
                        xmlDoc
                    );
                },
            });
            // 数字通道
            WebVideoCtrl.I_GetDigitalChannelInfo(szDeviceIdentify, {
                async: true,
                success: function (xmlDoc) {
                    var oChannels = $(xmlDoc).find("InputProxyChannelStatus");

                    $.each(oChannels, function (i) {
                        var id = $(this).find("id").eq(0).text(),
                            name = $(this).find("name").eq(0).text(),
                            online = $(this).find("online").eq(0).text();
                        if ("false" == online) {
                            // 过滤禁用的数字通道
                            return true;
                        }
                        if ("" == name) {
                            name =
                                "IPCamera " + (i < 9 ? "0" + (i + 1) : i + 1);
                        }
                        _this.ChannelList.push({
                            label: name,
                            value: id,
                        });
                    });
                    console.log("数字通道列表:", _this.ChannelList);
                    // _this.Channel = _this.SceneCode;
                    console.dir(" 获取数字通道成功！");
                },
                error: function (status, xmlDoc) {
                    console.log(xmlDoc);
                    console.dir(" 获取数字通道失败！", status, xmlDoc);
                },
            });
        },
        clickStartPlayback() {
            //开始回放
            var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex),
                szDeviceIdentify = this.LoginDevice,
                iRtspPort = parseInt(this.rtspport, 10),
                iStreamType = parseInt(this.record_streamtype, 10),
                bZeroChannel = this.bZeroChannel,
                iChannelID = parseInt(this.Channel, 10),
                szStartTime = formatDates(
                    this.timeRange[0],
                    "yyyy-MM-dd hh:mm:ss"
                ),
                szEndTime = formatDates(
                    this.timeRange[1],
                    "yyyy-MM-dd hh:mm:ss"
                ),
                szInfo = "",
                bChecked = false,
                iRet = -1;
            if (null == szDeviceIdentify) {
                return;
            }

            if (bZeroChannel) {
                // 零通道不支持回放
                return;
            }

            var startPlayback = function () {
                if (bChecked) {
                    // 启用转码回放
                    var oTransCodeParam = {
                        TransFrameRate: "14", // 0：全帧率，5：1，6：2，7：4，8：6，9：8，10：10，11：12，12：16，14：15，15：18，13：20，16：22
                        TransResolution: "1", // 255：Auto，3：4CIF，2：QCIF，1：CIF
                        TransBitrate: "19", // 2：32K，3：48K，4：64K，5：80K，6：96K，7：128K，8：160K，9：192K，10：224K，11：256K，12：320K，13：384K，14：448K，15：512K，16：640K，17：768K，18：896K，19：1024K，20：1280K，21：1536K，22：1792K，23：2048K，24：3072K，25：4096K，26：8192K
                    };
                    WebVideoCtrl.I_StartPlayback(szDeviceIdentify, {
                        // iRtspPort: iRtspPort,
                        iPort: iRtspPort,
                        iStreamType: iStreamType,
                        iChannelID: iChannelID,
                        szStartTime: szStartTime,
                        szEndTime: szEndTime,
                        oTransCodeParam: oTransCodeParam,
                        success: function () {
                            szInfo = "开始回放成功！";
                            console.log(szDeviceIdentify + " " + szInfo);
                        },
                        error: function (status, xmlDoc) {
                            if (403 === status) {
                                szInfo = "设备不支持Websocket取流！";
                            } else {
                                szInfo = "开始回放失败！";
                            }
                            console.log(szDeviceIdentify + " " + szInfo);
                        },
                    });
                } else {
                    WebVideoCtrl.I_StartPlayback(szDeviceIdentify, {
                        // iRtspPort: iRtspPort,
                        iPort: iRtspPort,
                        iStreamType: iStreamType,
                        iChannelID: iChannelID,
                        szStartTime: szStartTime,
                        szEndTime: szEndTime,
                        success: function () {
                            szInfo = "开始回放成功！";
                            console.log(szDeviceIdentify + " " + szInfo);
                        },
                        error: function (status, xmlDoc) {
                            if (403 === status) {
                                szInfo = "设备不支持Websocket取流！";
                            } else {
                                szInfo = "开始回放失败！";
                            }
                            console.log(szDeviceIdentify + " " + szInfo);
                            console.log(szDeviceIdentify + " " + iRtspPort);
                            console.log(szDeviceIdentify + " " + iStreamType);
                            console.log(szDeviceIdentify + " " + iChannelID);
                            console.log(szDeviceIdentify + " " + szStartTime);
                            console.log(szDeviceIdentify + " " + szEndTime);
                        },
                    });
                }
            };

            if (oWndInfo != null) {
                // 已经在播放了，先停止
                WebVideoCtrl.I_Stop({
                    success: function () {
                        startPlayback();
                    },
                });
            } else {
                startPlayback();
            }
        },
        clickStopPlayback() {
            //停止回放
            var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex),
                szInfo = "";

            if (oWndInfo != null) {
                WebVideoCtrl.I_Stop({
                    success: function () {
                        szInfo = "停止回放成功！";
                        console.log(oWndInfo.szDeviceIdentify + " " + szInfo);
                    },
                    error: function () {
                        szInfo = "停止回放失败！";
                        console.log(oWndInfo.szDeviceIdentify + " " + szInfo);
                    },
                });
            }
        },
        clickPause() {
            //暂停
            var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex),
                szInfo = "";

            if (oWndInfo != null) {
                WebVideoCtrl.I_Pause({
                    success: function () {
                        szInfo = "暂停成功！";
                        console.log(oWndInfo.szDeviceIdentify + " " + szInfo);
                    },
                    error: function () {
                        szInfo = "暂停失败！";
                        console.log(oWndInfo.szDeviceIdentify + " " + szInfo);
                    },
                });
            }
        },
        clickResume() {
            //恢复
            var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex),
                szInfo = "";

            if (oWndInfo != null) {
                WebVideoCtrl.I_Resume({
                    success: function () {
                        szInfo = "恢复成功！";
                        console.log(oWndInfo.szDeviceIdentify + " " + szInfo);
                    },
                    error: function () {
                        szInfo = "恢复失败！";
                        console.log(oWndInfo.szDeviceIdentify + " " + szInfo);
                    },
                });
            }
        },
        clickPlaySlow() {
            //慢放
            var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex),
                szInfo = "";

            if (oWndInfo != null) {
                WebVideoCtrl.I_PlaySlow({
                    success: function () {
                        szInfo = "慢放成功！";
                        console.log(oWndInfo.szDeviceIdentify + " " + szInfo);
                    },
                    error: function () {
                        szInfo = "慢放失败！";
                        console.log(oWndInfo.szDeviceIdentify + " " + szInfo);
                    },
                });
            }
        },
        clickPlayFast() {
            //快放
            var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex),
                szInfo = "";

            if (oWndInfo != null) {
                WebVideoCtrl.I_PlayFast({
                    success: function () {
                        szInfo = "快放成功！";
                        console.log(oWndInfo.szDeviceIdentify + " " + szInfo);
                    },
                    error: function () {
                        szInfo = "快放失败！";
                        console.log(oWndInfo.szDeviceIdentify + " " + szInfo);
                    },
                });
            }
        },
        initPlay() {
            const _this = this;
            // if (_this.time) clearInterval(_this.time);
            if (_this.time) clearTimeout(_this.time);
            _this.time = setTimeout(function () {
                _this.videoInitPlugin();
            }, 5000);
        },
    },
    watch: {
        // SceneCode(data, olddata) {
        //   this.Channel = data;
        //   this.getStationInfo();
        // },
        // StationCode(data, olddata) {
        //   this.clickLogout();
        //   this.getStationInfo();
        // },
        SceneCode: {
            handler(data, olddata) {
                this.Channel = data;
                this.getStationInfo();
                this.getCAMChannel();
            },
            immediate: true,
        },
        StationCode: {
            handler(data, olddata) {
                this.clickLogout();
                this.getStationInfo();
                this.getCAMChannel();
            },
            immediate: true,
        },
        InspectTimes: {
            handler: function (data) {
                if (data.endTime == "") {
                    this.showRealVideo = true;
                    this.showPlaybackVideo = false;
                    this.selVideoType = "realVideo";
                } else {
                    this.showRealVideo = false;
                    this.showPlaybackVideo = true;
                    this.selVideoType = "playbackVideo";
                    this.timeRange = [data.startTime, data.endTime];
                }
                // this.getStationInfo();
                this.showCommand();
                this.initPlay();
            },
            immediate: true,
        },
    },
    mounted() {
        // this.getStationInfo();
        this.getisUseMapIP();
        window.onresize = () => {
            return (() => {
                this.$nextTick(() => {
                    let videoSize = this.videoSize();
                    this.iWidth = videoSize.Width;
                    this.iHeight = videoSize.Height;
                });
            })();
        };
        this.$nextTick(() => {
            const _this = this;
            setTimeout(function () {
                _this.videoInitPlugin();
            }, 5000);
        });
    },
    destroyed: function () {
        this.clickLogout();
    },
};
</script>

<style scoped>
/* 时间控件位置 */
.videoMonitor_div /deep/ .ivu-select-dropdown {
    left: 0px !important;
}

.videoMonitor_div /deep/ .ivu-card-body {
    height: 100%;
}

.videoMonitor_div {
    margin: 10px 0 0 10px !important;
}
</style>
