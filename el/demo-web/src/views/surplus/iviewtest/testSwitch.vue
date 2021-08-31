<template>
  <div>
    <i-switch v-model="switch1" @on-change="change" />
    <br />
    <br />
    <i-switch>
      <span slot="open">开</span>
      <span slot="close">关</span>
    </i-switch>
    &nbsp;&nbsp;
    <i-switch>
      <Icon type="md-checkmark" slot="open"></Icon>
      <Icon type="md-close" slot="close"></Icon>
    </i-switch>
    <br />
    <br />
    <i-switch size="large">
      <span slot="open">开启</span>
      <span slot="close">关闭</span>
    </i-switch>
    &nbsp;&nbsp;
    <i-switch size="large">
      <span slot="open">ON</span>
      <span slot="close">OFF</span>
    </i-switch>
    &nbsp;
    <i-switch :disabled="disabled" />&nbsp;
    <Button type="primary" @click="disabled = !disabled">Toggle Disabled</Button>
    &nbsp;&nbsp;
    <i-switch loading :value="true" />
    &nbsp;&nbsp;
    <i-switch loading :value="false" size="small" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      switch1: false,
      disabled: true
    };
  },
  methods: {
    change(status) {
      this.$Message.info("开关状态：" + status);
    }
  }
};
</script>