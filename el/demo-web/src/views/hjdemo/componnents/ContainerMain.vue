<template>
  <div class="container-main">
    <div class="box-vertical">
      <div class="box fx__box" style="margin:13px">
        <chart-pieone></chart-pieone>
      </div>
      <div class="box fx__box" style="margin:13px;flex:1">
        <chart-pietwo></chart-pietwo>
      </div>
    </div>
    <div class="box-vertical">
      <div class="box fx__box" style="margin:13px">
        <chart-pietwo></chart-pietwo>
      </div>
      <div class="box fx__box" style="margin:13px;flex:1">
        <chart-columnar></chart-columnar>
      </div>
    </div>
    <div class="box-vertical">
      <rankList></rankList>
    </div>
  </div>
</template>
<script>
import chartPieone from "./pie1";
import chartPietwo from "./pie2";
import rankList from "./pie3";
import chartColumnar from "./Columnar";
export default {
  components: {
    chartPieone,
    chartPietwo,
    rankList,
    chartColumnar
  },
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped>
.container-main {
  display: flex;
  .box-vertical {
    display: flex;
    flex-direction: column;
    width: 33.33%;
  }
  .box{
    border-radius: 4px;
  }
}
@media screen and (max-width: 1200px) {
  .container-main {
    flex-wrap: wrap;
    .box-vertical {
      width: 50%;
      &.part3 {
        width: 100%;
        flex-direction: row;
      }
    }
    :nth-child(1) {
      order: -1;
    }
    :nth-child(2) {
      order: 2;
    }
    :nth-child(3) {
      order: 1;
    }
  }
}
@media screen and (max-width: 768px) {
  .container-main {
    flex-wrap: wrap;
    .box-vertical {
      width: 100%;
      &.part3 {
        width: 100%;
        flex-direction: row;
        flex-wrap: wrap;
        .per1 {
          width: 100%;
          flex: auto;
        }
      }
    }
    :nth-child(1) {
      order: 1;
    }
    :nth-child(2) {
      order: 2;
    }
    :nth-child(3) {
      order: -1;
    }
  }
}
</style>