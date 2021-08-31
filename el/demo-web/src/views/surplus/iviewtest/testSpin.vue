<template>
  <div>
    <div class="demo-spin-container">
      <Spin fix></Spin>
    </div>
    <Row>
      <Col class="demo-spin-col" span="8">
        <Spin fix>加载中...</Spin>
      </Col>
      <Col class="demo-spin-col" span="8">
        <Spin fix>
          <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
          <div>Loading</div>
        </Spin>
      </Col>
    </Row>   
  </div>
</template>
<script>
export default {
 
};
</script>

<style>
.demo-spin-container {
  display: inline-block;
  width: 200px;
  height: 100px;
  position: relative;
}
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.demo-spin-col {
  height: 100px;
  position: relative;
}
</style>