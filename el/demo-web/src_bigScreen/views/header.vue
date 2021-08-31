<template>
    <div class="row">
     <div class="rowcolleft"><dv-decoration-8 style="width:600px;height:50px;" /></div>
     <div class="rowcolcenter">
       <dv-decoration-7 style="width:200px;height:30px;" class="fonttext">数据可视化项目</dv-decoration-7>
       <dv-decoration-5 style="width:600px;height:40px;" />
       </div>
     <div class="rowcolright"><dv-decoration-8 :reverse="true" style="width:600px;height:50px;" /></div>
   </div>
</template>
<style  scoped>
.row{
  width: 100%;
  height: 10%;
  /* background-color: aqua; */
  display: flex;
  justify-content:space-between;
    border-bottom: 2px solid rgb(91, 176, 255);

}
.rowcolleft ,.rowcolcenter ,.rowcolright {
  width: 33%;
  height: 100%;
  /* background-color: bisque; */
  display: flex;
  
}
.rowcolcenter{
  align-items:center;
  flex-direction:column;
  justify-content:space-around;
}
.rowcolleft{
   align-items:center;
   justify-content:flex-end;
}
.rowcolright{
  align-items:center;
  justify-content:flex-start
}
.fonttext{
color: rgb(255, 255, 255);
font-weight: 800;
font-size: 20px;
}
</style>