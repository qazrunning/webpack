<template>
  <div>
    <Tabs value="name1">
      <TabPane label="标签一" name="name1">标签一的内容</TabPane>
      <TabPane label="标签二" name="name2">标签二的内容</TabPane>
      <TabPane label="标签三" name="name3">标签三的内容</TabPane>
    </Tabs>
    <br />
    <br />
    <Tabs>
      <TabPane label="标签一">标签一的内容</TabPane>
      <TabPane label="标签二" disabled>标签二的内容</TabPane>
      <TabPane label="标签三">标签三的内容</TabPane>
    </Tabs>
    <br />
    <br />
    <Tabs>
      <TabPane label="macOS" icon="logo-apple">标签一的内容</TabPane>
      <TabPane label="Windows" icon="logo-windows">标签二的内容</TabPane>
      <TabPane label="Linux" icon="logo-tux">标签三的内容</TabPane>
    </Tabs>
    <br />
    <br />
    <Tabs type="card">
      <TabPane label="标签一">标签一的内容</TabPane>
      <TabPane label="标签二">标签二的内容</TabPane>
      <TabPane label="标签三">标签三的内容</TabPane>
    </Tabs>
    <br />
    <br />
    <Tabs type="card" closable @on-tab-remove="handleTabRemove">
      <TabPane label="标签一" v-if="tab0">标签一的内容</TabPane>
      <TabPane label="标签二" v-if="tab1">标签二的内容</TabPane>
      <TabPane label="标签三" v-if="tab2">标签三的内容</TabPane>
    </Tabs>
    <br />
    <br />
    <Tabs value="name1">
      <TabPane :label="label" name="name1">标签一的内容</TabPane>
      <TabPane label="标签二" name="name2">标签二的内容</TabPane>
      <TabPane label="标签三" name="name3">标签三的内容</TabPane>
    </Tabs>
    <br />
    <br />
    <Tabs type="card">
      <TabPane v-for="tab in tabs" :key="tab" :label="'标签' + tab">标签{{ tab }}</TabPane>
      <Button @click="handleTabsAdd" size="small" slot="extra">增加</Button>
    </Tabs>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tab0: true,
      tab1: true,
      tab2: true,
      tabs: 2,
      label: h => {
        return h("div", [
          h("span", "标签一"),
          h("Badge", {
            props: {
              count: 3
            }
          })
        ]);
      }
    };
  },
  methods: {
    handleTabRemove(name) {
      this["tab" + name] = false;
    },
    handleTabsAdd() {
      this.tabs++;
    }
  }
};
</script>