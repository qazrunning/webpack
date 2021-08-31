<template>
<div>
    <row>
    <i-col :lg="16">
    <video ishivideo="true" width="100%" height="428" autoplay="true" controls="true" autohide="false" loop="loop" hivideoid="hivideo"
    :src="dataList.url">
    </video>
    </i-col>
    <i-col :lg="8">
    <Card>
        <p slot="title">{{dataList.VLPN}}</p>
        <p>车牌颜色： <span style="color: #a94442;font-family:'Lato',sans-serif;font-weight: bold;">{{dataList.VLPNColor}}</span></p>
        <p>林格曼等级：<span style="color: #a94442;font-family:'Lato',sans-serif;font-weight: bold;"> {{dataList.SmokeRank}}级</span></p>
        <p>审核结果： <span style="color: #a94442;font-family:'Lato',sans-serif;font-weight: bold;">{{dataList.DSStatus}}判定为黑烟车</span></p>
    </Card>
    <br/>
     <Card>
         <p slot="title">林格曼等级</p>
         <img src="/images/smokeRank/smokerank0.png" style="width:105px;height:90px">
          <img src="/images/smokeRank/smokerank1.png" style="width:105px;height:90px">
          <img src="/images/smokeRank/smokerank2.png" style="width:105px;height:90px">
          <img src="/images/smokeRank/smokerank3.png" style="width:105px;height:90px">
          <img src="/images/smokeRank/smokerank4.png" style="width:105px;height:90px">
          <img src="/images/smokeRank/smokerank5.png" style="width:105px;height:90px">
    </Card>
    </i-col>
    </row>
</div>
</template>
<script>
//测试视频
//src="http://192.168.0.58:5018/BlackSmokeFiles//440608GM/Mp4Video/2017/2017-11-01/合和大道与S272路路口(西行)1_粤XV2996_01_113528_01_3_50.mp4"
export default {
    data(){
        return{
           dataList:[],
        }
    },
    props:{
        vlpn:{type:String}
        
    },
    methods:{
      returncodename(namelist,codevalue){
          let CodeName="";
          namelist.forEach(item => {
              if(item.CodeValue==codevalue)CodeName=item.CodeName;
          });
          return CodeName
      },
      async getDetailData(){
        let dataInfo = [];
        await this.$curl.get("api/hj/smokeModel", {vlpn:JSON.stringify(this.vlpn)})
        .then(res=> {
          dataInfo = res.data;
        });
        if (dataInfo.length > 0) {
          this.dataList = dataInfo[0];
           this.dataList.url=this.$hjconfig.smokeUrl+this.dataList.url;
        }
      }
    },
    mounted(){
    },
    watch:{
        vlpn:{
            handler(newData) {
        　  　if(!newData) return;   
             this.getDetailData();  　
        　　},
        　　immediate: true
        }
    }
    
}
</script>

