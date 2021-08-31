<template>
     <div class="row3">
     <div class="row3colleft">
       <dv-decoration-7 style="width:200px;height:60px;" class="fonttext">各地城市数据</dv-decoration-7>       
       <dv-capsule-chart :config="config" style="width:90%;height:600px" />
     </div>
     <div class="row3colright">
       <div class="row3-col-rowtop">
         <div class="row3-col-rowtop-col-left">
           <dv-charts :option="option1" />
          </div>
         <div class="row3-col-rowtop-col-center">
           <dv-water-level-pond :config="config2" style="width:200px;height:200px" />
           </div>
         <div class="row3-col-rowtop-col-right"><dv-scroll-board :config="config3" style="width:100%;height:100%" /></div>
       </div>
       <div class="row3-col-rowbottom">
          <div class="row3-col-rowbottom-col">
            <dv-decoration-7 style="width:200px;height:60px;" class="fonttext">各地城市数据</dv-decoration-7>
            <dv-active-ring-chart :config="config4" style="width:100%;height:100%" /></div>
          <div class="row3-col-rowbottom-col">
            <dv-decoration-7 style="width:200px;height:60px;" class="fonttext">各地城市数据</dv-decoration-7>          
            <dv-active-ring-chart :config="config4" style="width:100%;height:100%" /></div>
          <div class="row3-col-rowbottom-col">
            <dv-decoration-7 style="width:200px;height:60px;" class="fonttext">各地城市数据</dv-decoration-7>
            <dv-active-ring-chart :config="config4" style="width:100%;height:100%" /></div>
          <div class="row3-col-rowbottom-col">
            <dv-decoration-7 style="width:200px;height:60px;" class="fonttext">各地城市数据</dv-decoration-7>
            <dv-active-ring-chart :config="config4" style="width:100%;height:100%" /></div>
          <div class="row3-col-rowbottom-col">
            <dv-decoration-7 style="width:200px;height:60px;" class="fonttext">各地城市数据</dv-decoration-7>
            <dv-active-ring-chart :config="config4" style="width:100%;height:100%" /></div>
       </div>
     </div>
   </div>
</template>
<script>
export default {
    data () {
        return {
  config:{  
      data: [
        {
          name: '南阳',
          value: 167
        },
        {
          name: '周口',
          value: 67
        },
        {
          name: '漯河',
          value: 123
        },
        {
          name: '郑州',
          value: 55
        },
        {
          name: '西峡',
          value: 98
        },
        {
          name: '广州',
          value: 62
        },
        {
          name: '深圳',
          value: 55
        },
        {
          name: '北京',
          value: 55
        },
        {
          name: '湖南',
          value: 66
        },
        {
          name: '长沙',
          value: 55
        },
        {
          name: '东北',
          value: 55
        },
        {
          name: '武汉',
          value: 88
        },
        {
          name: '浙江',
          value: 70
        },
        {
          name: '香港',
          value: 45
        },
        {
          name: '郑州澳门',
          value: 65
        },
       ]
  },
  option1:{
      title: {
        text: '畅销饮料占比饼状图',
         style: {
      fill: '#fff'
    }
      },
      series: [
        {
          type: 'pie',
          data: [
            { name: '可口可乐', value: 93 },
            { name: '百事可乐', value: 32 },
            { name: '哇哈哈', value: 65 },
            { name: '康师傅', value: 44 },
            { name: '统一', value: 52 },
          ],
          insideLabel: {
            show: true
          },
          roseType: true
        }
      ]
  },
  config2:{
      data: [48,65],
      shape: 'round'
  },
  config3:{
    header: ['列1', '列2', '列3'],
      data: [
        ['<span style="color:#37a2da;">行1列1</span>', '行1列2', '行1列3'],
        ['行2列1', '<span style="color:#32c5e9;">行2列2</span>', '行2列3'],
        ['行3列1', '行3列2', '<span style="color:#67e0e3;">行3列3</span>'],
        ['行4列1', '<span style="color:#9fe6b8;">行4列2</span>', '行4列3'],
        ['<span style="color:#ffdb5c;">行5列1</span>', '行5列2', '行5列3'],
        ['行6列1', '<span style="color:#ff9f7f;">行6列2</span>', '行6列3'],
        ['行7列1', '行7列2', '<span style="color:#fb7293;">行7列3</span>'],
        ['行8列1', '<span style="color:#e062ae;">行8列2</span>', '行8列3'],
        ['<span style="color:#e690d1;">行9列1</span>', '行9列2', '行9列3'],
        ['行10列1', '<span style="color:#e7bcf3;">行10列2</span>', '行10列3']
      ],
      index: true,
      columnWidth: [50],
      align: ['center']
  },
  config4:{
    
    data: [

        {
          name: '周口',
          value: 55
        },
        {
          name: '南阳',
          value: 120
        },
        {
          name: '西峡',
          value: 78
        },
        {
          name: '驻马店',
          value: 66
        },
        {
          name: '新乡',
          value: 80
        }
      ],
      lineWidth: 10
  },
  config5:{}
        }
    }
}
</script>
<style scoped>
    .row3{
  width: 100%;
  margin-top: 10px;
  height: 74%;
  /* background-color: brown; */
  display: flex;
  justify-content:space-around;
}

.row3colleft{
   display: flex;
   
  width: 20%;
  /* background-color: rgb(180, 102, 102); */

  flex-direction:column;
  justify-content:center;
  align-items:center;
  border: 2px solid rgb(91, 176, 255);
}
.row3colright{
  /* margin-left: 6px; */
  width: 80%;
  border-left: 2px solid rgb(91, 176, 255);
  border-top: 2px solid rgb(91, 176, 255);
  border-bottom: 2px solid rgb(91, 176, 255);  
  /* background-color: rgb(17, 50, 122); */
  display: flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;

}
.row3-col-rowtop{
  width: 100%;
  height: 50%;
  /* background-color: rgb(40, 170, 125); */
  display: flex;
  justify-content:space-between;
  align-items:center;
  border-bottom: 2px solid rgb(91, 176, 255);
}
.row3-col-rowtop-col-left{
    height: 100%;
    width: 30%;
  border-right: 2px solid rgb(91, 176, 255);

    /* background-color: rgb(255, 255, 255); */
}
.row3-col-rowtop-col-center{
    margin-left: 5px;
    display: flex;
    /* background-color: rgb(255, 255, 255); */
    height: 100%;
    width: 20%;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    border-right: 2px solid rgb(91, 176, 255);
}
.row3-col-rowtop-col-right{
    
    /* background-color: rgb(190, 39, 170); */
    height: 100%;
    width: 50%;
}
.row3-col-rowbottom{
 
  width: 100%;
  height: 50%;
  /* background-color: rgb(27, 139, 214); */
  display: flex;
  justify-content:space-between;
  align-items:center;
}
.row3-col-rowbottom-col{
  
  width: 20%;
  height: 100%;
  /* background-color: rgb(163, 15, 15); */
  display: flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  /* border: 2px solid rgb(91, 176, 255); */
    border-left: 2px solid rgb(91, 176, 255);
  border-top: 2px solid rgb(91, 176, 255);
  border-bottom: 2px solid rgb(91, 176, 255); 


}
.fonttext{
color: rgb(255, 255, 255);
font-weight: 800;
font-size: 20px;
}
</style>