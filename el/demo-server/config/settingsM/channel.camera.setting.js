const path = require('path');

require('colors');

module.exports = app => {

  const setingFilePath = path.join(path.resolve(), "../cfgs/channel.camera.setting.json");

  return {

    setingFilePath,
    filetype: "json",
    label: '摄像头配置',
    isUiDiplayView: true,//能否打开uidisplay
    isSourceView: true,//能否直接编辑json
    route: "",

    uiDisplay: {
      "Camera.DevType": {
        uiType: 'input-radio', description: "摄像头类型",
        group: [
          { value: "0", label: "大华" },
          { value: "1", label: "宇视" },
          { value: "2", label: "海康" }
        ]
      },
      "Camera.Ip": { uiType: 'input-text', description: "摄像头IP地址" },
      "Camera.Port": { uiType: 'input-number', description: "摄像头端口" },
      "Camera.UserName": { uiType: 'input-text', description: "登录名" },
      "Camera.UserPwd": { uiType: 'input-text', description: "登录密码" },
      "Camera.StreamNo": { uiType: 'input-number', description: "使用码流序号" },
      "Camera.StreamTmpDir": { uiType: 'input-text', description: "码流存储临时目录" },

      "Use.CameraCode": { uiType: 'input-text', description: "摄像头编号" },
      "Use.CameraAlias": { uiType: 'input-text', description: "点位名称" },
      "Use.WorkMode": {
        uiType: 'input-select', description: "摄像头类型",
        group: [
          { value: "0", label: "调试模式" },
          { value: "1", label: "前置摄像头(channel3)" },
          { value: "2", label: "(前置报警)触发后置视频抓拍" },
          { value: "3", label: "黑烟车抓拍摄像头专用" },
          { value: "4", label: "录像触发器" },
          { value: "5", label: "(后置报警)触发后置视频抓拍" },
        ]
      },
      "Use.IsOuputMp4": { uiType: 'input-switch', description: "是否直接用mp4v2直接封装h264为mp4" },
      "Use.Distance": { uiType: 'input-number', description: "视角开始到结束距离（单位米）作为（车速能精准识别情况下）会有用" },
      "Use.SpeedMode": { uiType: 'input-number', description: "如果前置车速模式有效则设置为1，代表利用车速车距离做精准视频长度控制（在后置车流模式下有用）" },
      "Use.FToBTimespan": { uiType: 'input-number', description: "从前置抓拍到后置抓拍平均消耗时间（单位秒）（这里是一个估计值因为速度不准，车身长度未知）" },
      "Use.IsMatchNearByLane": { uiType: 'input-switch', description: "是否开启变道匹配模式(只针对黑烟抓拍模式)" },
      "Use.IsAutoAlarm": { uiType: 'input-switch', description: "是否自动开启车流量布防" },
      "Use.IsAutoRealStream": { uiType: 'input-switch', description: "是否开启实时流回调" },
      "Use.AutoTimingPersec": { uiType: 'input-number', description: "自动校对摄像头时间周期0：代表不校对" },
      "Use.Vehicletype": {
        uiType: 'input-checkbox', description: "捕获车类型过滤",
        group: [
          { value: "2", label: "大货车" },
          { value: "5", label: "小货车" },
          { value: "15", label: "皮卡车" },
          { value: "10", label: "中型客车" }
        ]
      },
      "Use.Color": {
        uiType: 'color-picker', description: "颜色选择器",
      },
      "menus": {
        uiType: "tree-editor",
        description: "树形数据配置",
        maxHeight: '500px',
        rootTitle:"我是rootTitle",
        opt: {
          prop_alias: {
            field: "text",
            title: "菜单名称",
          },
          prop_primay: {
            field: "name",
            title: "菜单路由",
          },
          prop_extra: {
            iconbg: {
              default: "linear-gradient(to right, #FEA21E , #FC9107)",
              title: "背景颜色",
            },
            icon: {
              default: "fa fa-navicon fa-lg",
              title: "图标",
            },
            svg: {
              default: "user",
              title: "svg",
            },
            test: {
              default: "test",
              title: "测试项",
            }
          },
        }
      },
      "Store.TrafficFlowDir": { uiType: "input-json", description: "编辑JSON例子" },
      "Use.Alarmlane": {
        uiType: 'input-checkbox', description: "捕获车道过滤",
        group: [
          { value: "-1", label: "全部" },
          { value: "1", label: "车道1" },
          { value: "2", label: "车道2" },
          { value: "3", label: "车道3" },
          { value: "4", label: "车道4" }
        ]
      }
    },
    async onLoad(cfg) {
      // global.Helper.File.ensurePath("D:\\1\\2\\3\\4\\5\\6.txt");
      //fs.readfile
      cfg = Object.assign({}, {
        "menus": [{
          "text": "门户2",
          "name": "app-hjdemo"
        }, {
          "text": "我的",
          "name": "app-pad-userinfo",
          "icon": "fa fa-navicon fa-lg"
        },
        {
          "text": "菜单",
          "name": "core-phoneModulesNav",
          "children": [
            {
              "text": "Demo",
              "name": "app-demo",
              "children": [
                {
                  "text": "UI组件合集",
                  "name": "app-iviewdebug"
                },
                {
                  "text": "只读表单样式",
                  "name": "app-formDetail"
                }
              ]
            }
          ]
        }],
        "Camera": {
          "DevType": "2",
          "Ip": "192.168.19.201",
          "Port": 8000,
          "UserName": "admin",
          "UserPwd": "hk123456",
          "StreamTmpDir": "D:\\StreamTmpDir"
        },
        "Use": {
          "CameraCode": "D53030000101",
          "CameraAlias": "章贡区水西点位",
          "WorkMode": "4",
          "IsOuputMp4": true,
          "Distance": 120,
          "FToBTimespan": 10,
          "IsAutoRealStream": true,
          "AutoTimingPersec": 29,
          "Vehicletype": [
            "2"
          ],
          "Color": "#2C65A1",
          "Alarmlane": [
            "1",
            "2"
          ]
        },
        "Store": {
          "VideoDir": {
            "name": "fx__test",
            "host": "127.0.0.1",
            "port": 3306
          },
          "TrafficFlowDir": {
            "sky": {
              "cloud": "white"
            },
            "land": {
              "tree": "green"
            },
            "sea": {
              "water": "blue"
            }
          }
        }
      }, cfg);
      return cfg
    },
    async onSave(ctx, next, { data }) {
      await next();

      await this.reLoad(data);//重载配置到系统，（如果是系统之外得配置可以不写此行）
      // console.log(app.Cfg.demo.test1);
    }
  }
}