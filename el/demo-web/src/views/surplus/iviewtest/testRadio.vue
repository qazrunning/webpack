<template>
  <div>
    <Radio v-model="single">Radio</Radio>&nbsp;&nbsp;
    <RadioGroup v-model="phone">
      <Radio label="apple">
        <Icon type="logo-apple"></Icon>
        <span>Apple</span>
      </Radio>
      <Radio label="android">
        <Icon type="logo-android"></Icon>
        <span>Android</span>
      </Radio>
      <Radio label="windows">
        <Icon type="logo-windows"></Icon>
        <span>Windows</span>
      </Radio>
    </RadioGroup>&nbsp;&nbsp;
    <RadioGroup v-model="animal">
      <Radio label="金斑蝶"></Radio>
      <Radio label="爪哇犀牛"></Radio>
      <Radio label="印度黑羚"></Radio>
    </RadioGroup>
    <br />
    <br />
    <Radio v-model="disabledSingle" disabled>Radio</Radio>
    <RadioGroup v-model="disabledGroup">
      <Radio label="金斑蝶" disabled></Radio>
      <Radio label="爪哇犀牛"></Radio>
      <Radio label="印度黑羚"></Radio>
    </RadioGroup>
    <br />
    <br />
    <RadioGroup v-model="button1" type="button">
      <Radio label="北京"></Radio>
      <Radio label="上海"></Radio>
      <Radio label="深圳"></Radio>
      <Radio label="杭州"></Radio>
    </RadioGroup><br><br>
    <RadioGroup v-model="button2" type="button">
      <Radio label="北京"></Radio>
      <Radio label="上海" disabled></Radio>
      <Radio label="深圳"></Radio>
      <Radio label="杭州"></Radio>
    </RadioGroup><br><br>
    <RadioGroup v-model="button3" type="button">
      <Radio label="北京" disabled></Radio>
      <Radio label="上海" disabled></Radio>
      <Radio label="深圳" disabled></Radio>
      <Radio label="杭州" disabled></Radio>
    </RadioGroup>
    <br />
    <br />
    <Checkbox v-model="disabledSingle1" disabled>Checkbox</Checkbox>
    <CheckboxGroup v-model="disabledGroup1">
      <Checkbox label="香蕉" disabled></Checkbox>
      <Checkbox label="苹果"></Checkbox>
      <Checkbox label="西瓜"></Checkbox>
    </CheckboxGroup>
    <br />
    <br />
    <Button @click="start">Start</Button>
    &nbsp;&nbsp;
    <Button @click="finish">Finish</Button>
    &nbsp;&nbsp;
    <Button @click="error">Error</Button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      phone: "apple",
      animal: "爪哇犀牛",
      single: false,
      disabledSingle: false,
      disabledSingle1: false,
      disabledGroup: "爪哇犀牛",
      disabledGroup1: ["苹果"],
      button1: "北京",
      button2: "北京",
      button3: "北京"
    };
  },
  methods: {
    start() {
      this.$Loading.start();
    },
    finish() {
      this.$Loading.finish();
    },
    error() {
      this.$Loading.error();
    }
  }
};
</script>