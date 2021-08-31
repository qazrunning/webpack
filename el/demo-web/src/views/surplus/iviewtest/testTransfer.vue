<template>
  <div>
    <Transfer
      :data="data1"
      :target-keys="targetKeys1"
      :render-format="render1"
      @on-change="handleChange1"
    ></Transfer>
    <br />
    <br />
    <Transfer
      :data="data3"
      :target-keys="targetKeys3"
      :list-style="listStyle"
      :render-format="render3"
      :operations="['To left','To right']"
      filterable
      @on-change="handleChange3"
    >
      <div :style="{float: 'right', margin: '5px'}">
        <Button size="small" @click="reloadMockData">Refresh</Button>
      </div>
    </Transfer>
  </div>
</template>
<script>
export default {
  data() {
    return {
      data1: this.getMockData(),
      targetKeys1: this.getTargetKeys(),
      data3: this.getMockData(),
      targetKeys3: this.getTargetKeys(),
      listStyle: {
        width: "250px",
        height: "300px"
      }
    };
  },
  methods: {
    getMockData() {
      let mockData = [];
      for (let i = 1; i <= 20; i++) {
        mockData.push({
          key: i.toString(),
          label: "Content " + i,
          description: "The desc of content  " + i,
          disabled: Math.random() * 3 < 1
        });
      }
      return mockData;
    },
    getTargetKeys() {
      return this.getMockData()
        .filter(() => Math.random() * 2 > 1)
        .map(item => item.key);
    },
    render1(item) {
      return item.label;
    },
    handleChange1(newTargetKeys, direction, moveKeys) {
      console.log(newTargetKeys);
      console.log(direction);
      console.log(moveKeys);
      this.targetKeys1 = newTargetKeys;
    },
    handleChange3(newTargetKeys) {
      this.targetKeys3 = newTargetKeys;
    },
    render3(item) {
      return item.label + " - " + item.description;
    },
    reloadMockData() {
      this.data3 = this.getMockData();
      this.targetKeys3 = this.getTargetKeys();
    }
  }
};
</script>