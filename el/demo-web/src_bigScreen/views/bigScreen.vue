<template>
  <div id="app" >
  <dv-full-screen-container>
    <dv-border-box-1>
    <!-- header -->
   <headerrow></headerrow>
   <div class="row2">
     <dv-decoration-9 style="width:150px;height:150px;" class="fonttext">66%</dv-decoration-9>
     <dv-decoration-6 style="width:350px;height:30px;" />
     <dv-decoration-6 style="width:350px;height:30px;" />
     <dv-decoration-6 style="width:350px;height:30px;" />
     <dv-decoration-6 style="width:350px;height:30px;" />
     <dv-decoration-6 style="width:350px;height:30px;" />
     
     
   </div>
   <!-- body -->
    <bodytemplate/>
   </dv-border-box-1>
   </dv-full-screen-container>
  </div>
</template>

<script>
import header from './header.vue'
import bodytemplate from './bodytemplate.vue'
export default {
  name: "bigScreen",
  components: {
    "headerrow":header,
    "bodytemplate":bodytemplate
  },
  data() {
    
    return {

    };
  },
  methods: {}
};
</script>

<style  scoped>
.row2 , .row3{
  width: 100%;

}

.row2{
  
  margin-top :10px;
  height: 16%;
  /* background-color: rgb(165, 63, 94); */
  display: flex;
  align-items:center;
}
.fonttext{
color: rgb(255, 255, 255);
font-weight: 800;
font-size: 20px;
}

</style>


