<!--路检详情-->
<template>
  <div style="height:600px;overflow:auto;padding-left:20px;font-size:14px;">
    <Row>
      <i-col span="24">
        <div class="title" style="text-align:left">基本信息</div>
      </i-col>
      <i-col span="12">
        <div>
          <span class="textTitle">号牌号码：</span>
          <span :style="this.$options.filters.setVLPNColor(Data.hpys)">{{Data.hphm}}</span>
        </div>
      </i-col>
      <i-col span="12" style="line-height:33px;">
        <div>
          <span class="textTitle">总&nbsp;&nbsp;结&nbsp;&nbsp;果：</span>
          <span :style="{'color': Data.zjg=='合格'?'#19be6b':'#ed4014'}">{{Data.zjg}}</span>
        </div>
      </i-col>
      <i-col span="12" style="line-height:33px;">
        <div>
          <span class="textTitle">检查类型：</span>
          {{Data.jclx==1?'路检':'入户检查'}}
        </div>
      </i-col>
      <i-col span="12" style="line-height:33px;">
        <div>
          <span class="textTitle">驾&nbsp;&nbsp;驶&nbsp;&nbsp;员：</span>
          {{Data.jsy}}
        </div>
      </i-col>
      <i-col span="12" style="line-height:33px;">
        <div>
          <span class="textTitle">联系电话：</span>
          {{Data.lxdh}}
        </div>
      </i-col>
      <i-col span="12" style="line-height:33px;">
        <div>
          <span class="textTitle">行驶里程：</span>
          {{Data.xslc}}
        </div>
      </i-col>
      <i-col span="12" style="line-height:33px;">
        <div>
          <span class="textTitle">油品检查：</span>
          {{Data.ypjcjg}}
        </div>
      </i-col>
      <i-col span="12" style="line-height:33px;">
        <div>
          <span class="textTitle">油品含量：</span>
          {{Data.yplhl}}
        </div>
      </i-col>
      <i-col span="12" style="line-height:33px;">
        <div>
          <span class="textTitle">折&nbsp;&nbsp;光&nbsp;&nbsp;率：</span>
          {{Data.zgl?Data.zgl:'未检查'}}
        </div>
      </i-col>
      <i-col span="12" style="line-height:33px;">
        <div>
          <span class="textTitle">排放检查：</span>
          {{Data.pfjcjg}}
        </div>
      </i-col>
      <i-col span="12" style="line-height:33px;">
        <div>
          <span class="textTitle">林格曼黑度：</span>
          {{Data.lgmhd}}
        </div>
      </i-col>
      <i-col span="12" style="line-height:33px;">
        <div>
          <span class="textTitle">林格曼黑度结果：</span>
          {{Data.lgmhdjg}}
        </div>
      </i-col>
      <i-col span="12" style="line-height:33px;">
        <div>
          <span class="textTitle">光吸收系数：</span>
          {{Data.gxsxs}}
        </div>
      </i-col>
      <i-col span="12" style="line-height:33px;">
        <div>
          <span class="textTitle">光吸收系数结果：</span>
          {{Data.gxsxsjg}}
        </div>
      </i-col>
      <i-col span="12" style="line-height:33px;">
        <div>
          <span class="textTitle">尿素含量：</span>
          {{Data.nsjcjg}}
        </div>
      </i-col>
      <i-col span="12" style="line-height:33px;">
        <div>
          <span class="textTitle">尿素检查：</span>
          {{Data.nsjcjg}}
        </div>
      </i-col>
      <i-col span="12" style="line-height:33px;">
        <div>
          <span class="textTitle">OBD检查：</span>
          {{Data.obdjcjg}}
        </div>
      </i-col>
      <i-col span="12" style="line-height:33px;">
        <div>
          <span class="textTitle">是否罚款：</span>
          {{Data.sffk}}
        </div>
      </i-col>
      <i-col span="12" style="line-height:33px;" v-if="Data.sffk==1">
        <div>
          <span class="textTitle">罚款金额：</span>
          {{Data.fkje?Data.fkje:0}}元
        </div>
      </i-col>
      <i-col span="12" style="line-height:33px;">
        <div>
          <span class="textTitle">检查人员：</span>
          {{Data.jcy}}
        </div>
      </i-col>
      <i-col span="12" style="line-height:33px;">
        <div>
          <span class="textTitle">检查时间：</span>
          {{Data.jcjssj}}
        </div>
      </i-col>
      <i-col span="12" style="line-height:33px;">
        <div>
          <span class="textTitle">是否发整改通知书：</span>
          {{Data.sffzgtzs}}
        </div>
      </i-col>
    </Row>
    <Row v-show="Data.Urls == 0">
      <i-col span="24" style="line-height:33px;" >
        <div class="title" style="text-align:left">图片信息</div>
        <div style="display:flex;justify-content:center">
          暂无数据
        </div>
      </i-col>
    </Row>
    <Row v-show="Data.Urls && Data.Urls.length > 0" style="line-height:33px;">
      <i-col span="24">
        <div class="title" style="text-align:left">图片信息</div>
      </i-col>
      <i-col span="12" v-for="(item, index) in Data.Urls" :key="index" style="padding:0 5px">
        <span class="textTitle">{{item.text}}</span>
        <Card :padding="4" dis-hover style="height:195px;" >
          <div style="text-align:center;height:100px;position: relative;">
            <viewer>
              <img @error="onError($event)" :src="baseDir+item.url" style="width:70%;height:185px;cursor:pointer;" />
            </viewer>
          </div>
        </Card>
      </i-col>
    </Row>
  </div>
</template>
<script>
  import Viewer from "v-viewer";
  import "viewerjs/dist/viewer.css";
  import app from "@skyland/core";
  app.Vue.use(Viewer);
  import {
    LJMedia
  } from "../../../../../utils/utils";
  export default {
    name: "ledgerDetails",
    props: {
      infoObj: {
        type: Object,
      },
    },
    data() {
      return {
        Data:{}, // 详情数据
        baseDir: LJMedia, //图片路径
        picUrl: "", //台账图片
        cdParameterType: [],//台账类型CD表
      };
    },
    methods: {
    
      async getData(){
        let params = {
          zj : this.infoObj.zj,
        }
        let res =  await this.$curl.get(`api/hj/getRoadCheckData`, {params: JSON.stringify(params)});
        if(res.state == 1) {
          this.Data = res.data
        }else{
          this.Data = {}
        }
      },
      // 图片加载失败
      onError(event) {
        event.target.src = require('../../../../../../../public/static/img/imgError.png');
      },
    },
    mounted(){
      this.getData();
    },
    
  };
</script>
<style scoped>
  .textTitle {
    font-size: 14px;
    font-weight: 700;
  }
  /* 标题样式 */
  .title {
    font-size: 16px;
    font-weight: 600;
    line-height: 30px;
    margin: 10px 0;
    padding: 5px 0 5px 20px;
    border-radius: 5px;
    color: white;
    text-align: center;
    background-color: #7aabe5;
  }
</style>