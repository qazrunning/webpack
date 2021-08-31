<template>
  <div class="stationCard fx__box fx__bgcolor">
    <div class="header fx__text_default">
      <span :title="StationData.StationName">{{StationData.StationName}}</span>
    </div>
    <div class="tag">
      <div class="confidence fx__text_default" style="font-size:13px;">置信度：
        <Tag
          color="volcano"
          v-if="parseFloat(StationData.Confidence) > 50"
          >{{ StationData.Confidence }}</Tag>
        <Tag
          color="orange"
          v-if="parseFloat(StationData.Confidence) <= 50"
          >{{ StationData.Confidence }}</Tag>
      </div>
      <div class="target">
        <Tag v-if="StationData.ProcessingResults == 1" color="red">重点监控</Tag>
      </div>
    </div>
    <Divider class="line" />
    <div class="info" v-if="CDData.area">
      <div>地区：{{CDData.area[StationData.CityCode]}} {{CDData.area[StationData.CountyCode]}}</div>
      <div>检测车辆数{{isMonth === 'MM'?'(月)':'(周)'}}：{{StationData.jccls}} 辆</div>
    </div>
    <div class="statistic" @mouseenter="stopScroll" @mouseleave="continueScroll">
      <div :class="{'infoList': true, 'scroll':listNum > 3}" ref="infoList">
        <div class="row" v-if="StationData.asmlt">
          <div class="left"><div>稳态工况法雷同数据：</div><div>{{StationData.asmlt}} 条</div></div>
          <div class="right">
            <span>涉及</span>
            <span class="num">{{StationData.asmlt_cl}}</span>
            <span>辆车</span>
          </div>
        </div>
        <div class="row" v-if="StationData.tsilt">
          <div class="left"><div>双怠速法雷同数据：</div><div>{{StationData.tsilt}} 条</div></div>
          <div class="right">
            <span>涉及</span>
            <span class="num">{{StationData.tsilt_cl}}</span>
            <span>辆车</span>
          </div>
        </div>
        <div class="row" v-if="StationData.lpslt">
          <div class="left"><div>自由加速法雷同数据：</div><div>{{StationData.lpslt}} 条</div></div>
          <div class="right">
            <span>涉及</span>
            <span class="num">{{StationData.lpslt_cl}}</span>
            <span>辆车</span>
          </div>
        </div>
        <div class="row" v-if="StationData.ldlt">
          <div class="left"><div>加载减速法雷同数据：</div><div>{{StationData.ldlt}} 条</div></div>
          <div class="right">
            <span>涉及</span>
            <span class="num">{{StationData.ldlt_cl}}</span>
            <span>辆车</span>
          </div>
        </div>
        <div class="row" v-if="StationData.imlt">
          <div class="left"><div>简易瞬态法雷同数据：</div><div>{{StationData.imlt}} 条</div></div>
          <div class="right">
            <span>涉及</span>
            <span class="num">{{StationData.imlt_cl}}</span>
            <span>辆车</span>
          </div>
        </div>
        <div class="row" v-if="StationData.cjffjt">
          <div class="left">
            <div>初检不通过复检通过
              <!-- <Tooltip content="初检不通过复检通过" placement="top">
                <Icon type="ios-help-circle-outline" size="14"/> -->
                <!-- title="初检不通过复检通过" style="cursor:pointer;"  -->
              <!-- </Tooltip> -->
            ：</div>
            <div>{{StationData.cjffjt}} 条</div></div>
          <div class="right">
            <span>涉及</span>
            <span class="num">{{StationData.cjffjt_cl}}</span>
            <span>辆车</span>
          </div>
        </div>
        <div v-if="StationData.tglData.length">
          <div class="row" v-for="item in StationData.tglData" :key="item.ID">
            <div class="left"><div>{{getTglTypeName(item.StatisticalParameters)}}通过率：</div><div>{{item.PassRate}}%</div></div>
            <!-- <div>{{item.PassRate}}%</div> -->
            <div class="right">
              <span>{{getTglName(item.StatisticalGroup)}}</span>
            </div>
          </div>
        </div>
      </div>
      
    </div>
    <div class="bottom" >
      <div v-if="StationData.continue > 1 && StationData.OnListTimes">
        <span>连续</span>
        <span class="num"> {{StationData.continue}} </span>   
        <span v-if="isMonth === 'MM'">个月入榜, 今年累计入榜</span>
        <span v-else-if="isMonth === 'WW'">个周入榜, 今年累计入榜</span>
        <span class="num"> {{StationData.OnListTimes}} </span><span>次</span>
      </div>
      <div v-else-if="StationData.continue <= 1 && StationData.OnListTimes">
        <span>今年累计入榜</span>
        <span class="num"> {{StationData.OnListTimes}} </span>
        <span>次</span>
      </div>
      <div v-else-if="StationData.continue >= 1 && !StationData.OnListTimes">
        <span>连续</span>
        <span class="num"> {{StationData.continue}} </span>
        <span v-if="isMonth === 'MM'">个月置信度入榜</span>
        <span v-else-if="isMonth === 'WW'">周置信度入榜</span>
      </div>
    </div>
    <!-- <div class="top">TOP.{{10}}</div> -->
  </div>
</template>

<script>
export default {
  name: "StationAnalysisCard",
  props: {
    StationData: {
      type: Object,
      default: () => {}
    },
    isMonth: {
      type: String,
      default: ''
    },
    CDData: {
      type: Object,
      default: () => {}
    }
  },
  mounted(){
    // console.log('StationData',this.StationData);
    // console.log('isMonth',this.isMonth);
    // console.log('CDData',this.DData);
    
  },
  computed: {
    listNum () {
      let num = 0;
      if(this.StationData.asmlt) num++;
      if(this.StationData.tsilt) num++;
      if(this.StationData.lpslt) num++;
      if(this.StationData.ldlt) num++;
      if(this.StationData.imlt) num++;
      if(this.StationData.cjffjt) num++;
      if(this.StationData.tglData.length) num++;
      return num;
    }
  },
  data() {
    return {
      CD_VehicleType: [
        { CodeValue: '01', CodeName: '微型'},
        { CodeValue: '02', CodeName: '小型'},
        { CodeValue: '03', CodeName: '中型'},
        { CodeValue: '04', CodeName: '大型'},
      ]
    }
  },
  methods: {
    // 通过率统计-车辆品牌
    getTglName (StatisticalGroup) {
      console.log('StatisticalGroup',StatisticalGroup);
      
      // let brand = JSON.parse(StatisticalGroup);
      let brand = StatisticalGroup;
      return brand.FactoryPlateModel;
    },
    // 通过率统计-统计类型分类
    getTglTypeName (StatisticalParameters) {
      let Arr = StatisticalParameters.split('_');
      return `${this.getCodeName(this.CD_VehicleType, Arr[0])}${this.getCodeName(this.CDData.CD_PG, Arr[1])}${this.getCodeName(this.CDData.CD_InspectionNature, Arr[2])}`;
    },
    getCodeName(list, codevalue) {
      if (list) {
        let target = list.findIndex(item => item.CodeValue == codevalue);
        return (target !== -1) && list[target].CodeName || '';
      }
    },
    stopScroll () {
      this.$refs.infoList.classList.remove('startScroll');
      this.$refs.infoList.classList.add('stopScroll');
    },
    continueScroll () {
      this.$refs.infoList.classList.remove('stopScroll');
      this.$refs.infoList.classList.add('startScroll');
    }
  },
}
</script>

<style lang="scss" scoped>
.ivu-divider-horizontal {
  margin: 8px 0;
}
.stationCard{
  height: 270px;
  width: 290px;
  border-radius: 4px;
  position: relative;
  cursor: pointer;
  .header{
    height: 30px;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 10px;
  }
  .tag {
    font-family: 'Arial Normal', 'Arial';
    display: flex;
    justify-content: space-between;
  }
  .info {
    font-family: 'Arial Normal', 'Arial';
    line-height: 24px;
    font-size: 12px;
  }
  .statistic {
    margin-top: 10px;
    font-family: 'Arial Normal', 'Arial';
    overflow: hidden;
    height: 72px;
    position: relative;
    .infoList {
      position: absolute;
      width: 258px;
      line-height: 24px;
      .row {
        width: 100%;
        display: flex;
        justify-content: space-between;
        .left {
          flex-basis: 160px;
          display: flex;
          justify-content: space-between;
        }
        .right {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          .num {
            flex-basis: 25px;
            text-align: center;
          }
        }
      }
    }
    .scroll {
      animation: roll 2.5s infinite alternate linear;
    }
    .stopScroll {
      animation-play-state: paused;
    }
    .startScroll {
      animation-play-state: running;
    }
  }
  .top {
    position: absolute;
    left: 0;
    top: -1px;
    height: 25px;
    width: 42px;
    background: url('../../../../../public/static/img/top10.png') no-repeat;
    font-family: 'Bahnschrift Condensed';
    font-weight: 700;
    font-size: 13px;
    line-height: 25px;
    color: #fff;
    padding-right: 4px;
    text-align: center;
  }
  .bottom {
    position: absolute;
    bottom: 10px;
    .num {
      font-weight: 800;
      color: rgba(255, 0, 0, 0.7);
    }
  }
}
@keyframes roll {
  0% {
    top: 0;
    transform: translate(0, 0);
  }
  100% {
    top: 100%;
    transform: translate(0, -100%);
  }
}
.fx-thema.dark {
  .stationCard .fx__bgcolor {
    background-color: #fff;
  }
  .stationCard .fx__text_default {
    color: rgb(195,197,200);
  }
  .statistic {
    color: rgba(255, 255, 255, 0.7);
  }
  .bottom {
    color: rgba(255, 255, 255, 0.7);
  }
  .info {
    color: rgba(255, 255, 255, 0.5)
  }
  .line {
    color: #e9e9ea;
  }
}
.fx-thema.light {
  .stationCard .fx__bgcolor {
    background-color: #37404a;
  }
  .stationCard .fx__text_default {
    color: rgba(51,51,51,1);
  }
  .statistic {
    color: #333333
  }
  .bottom {
    color: #333333;
  }
  .info {
    color: #333333;
  }
}
</style>