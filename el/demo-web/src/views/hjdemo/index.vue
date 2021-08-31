<template>
  <div class="content">
    <ContainerTop></ContainerTop>
    <ContainerMain></ContainerMain>
  </div>
</template>
<script>
import ContainerTop from "./componnents/ContainerTop";
import ContainerMain from "./componnents/ContainerMain";

export default {
  components: {
    ContainerTop,
    ContainerMain
  },
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped>
.content {
  padding: 17px;
  height: 100%;
  overflow-y: overlay;
  min-height: 100%;
  overflow: scroll;
}
.box{
  border-radius: 4px;
}
@media screen and (max-width: 768px) {
  .content {
    padding: 0
  }
}
</style>