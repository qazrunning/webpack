

import app, { coreRoutes } from '@skyland/core'
// import { wfcase, wfcaseStore } from '@skyland/wf-case'
// import gis from '@skyland/gis'

import fxchart from '@skyland/fxchart'

import routes from './route/routes'
import store from './store/store'

//import './assets/css/style.scss'
// import dataV from '@jiaminghi/data-view'
import '@/assets/icons' // svg 图标
import Viewer from 'v-viewer';
import 'viewerjs/dist/viewer.css';
import { dataFormat,config,returnCodeName, setVLPNColor } from '@/utils/tools.js';
import echarts from 'echarts';

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
    // use
app.Vue.use(mavonEditor)

// app.Vue.use(dataV)
//挂载框架
app.mount({ routes: coreRoutes })
app.Vue.use(Viewer);

//时间格式化函数(时间,格式)
app.Vue.filter('dataFormat', dataFormat);
// 设置车牌颜色
app.Vue.filter("setVLPNColor", setVLPNColor);
// 根据cd表返回对应值
app.Vue.filter("returnCodeName", returnCodeName);

//挂载gis系统
// app.mount(gis)

//挂载wfcase系统
// app.mount({ store: wfcaseStore })
// app.Vue.use(wfcase)

app.Vue.use(fxchart);

//全屏容器
app.Vue.prototype.$echartsc = echarts;

//挂载本项目
app.mount({ routes, store })

app.start().then(() => {
    console.log("oh,started vued")
});
app.Vue.prototype.$hjconfig = config;
//公共下拉框数据
app.curl.get("/api/public/common/dm/getSelected",{}
).then((data) => {
    app.Vue.prototype.$GY=data;
});
app.curl.get("/api/public/common/dm/getXzqhSelected",{}
).then((data) => {
    app.Vue.prototype.$XZQH=data;
});
app.curl.get("/api/public/common/dm/getSystemParams",{}
).then((data) => {
    app.Vue.prototype.$SYSTEM_PARAMS=data;
});
app.curl.get("/api/public/common/dm/getCurrentUser",{}
).then((data) => {
    app.Vue.prototype.$USER=data;
});
app.Vue.prototype.$GY_ARRAY = (key) => {
    return app.Vue.prototype.$GY[key];
}
app.Vue.prototype.$GY_MAP = (key) => {
    let res={};
    let arrs=app.Vue.prototype.$GY[key];
    for(let obj of arrs){
        res[obj.CodeValue]=obj.CodeName;
    }
    return res;
}
app.Vue.prototype.$GY_FORMAT = (key,value) => {
    if(!value) return;
    // let key=value.substring(0,4);
    for(let obj of app.Vue.prototype.$GY[key]){
        if(obj.CodeValue===value){
            return obj.CodeName;
        }
    }
    return "";
}