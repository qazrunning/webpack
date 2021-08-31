<template>
  <div>
    <Input v-model="value" placeholder="Enter something..." style="width: 300px" />
    <br />
    <br />
    <Input size="large" placeholder="large size" />
    <br />
    <br />
    <Input placeholder="default size" />
    <br />
    <br />
    <Input size="small" placeholder="small size" />
    <br />
    <br />
    <Input v-model="value14" placeholder="Enter something..." clearable style="width: 200px" />
    <br />
    <br />
    <Input
      v-model="value14"
      icon="ios-clock-outline"
      placeholder="Enter something..."
      style="width: 200px"
    />
    <br />
    <br />Props：
    <Input prefix="ios-contact" placeholder="Enter name" style="width: auto" />&nbsp;
    <Input suffix="ios-search" placeholder="Enter text" style="width: auto" />
    <br />
    <br />

    <Input search placeholder="Enter something..." />
    <br />
    <br />
    <Input search enter-button placeholder="Enter something..." />
    <br />

    <Input search enter-button="Search" placeholder="Enter something..." />
    <br />

    <Input type="textarea" placeholder="Enter something..." />
    <br />
    <br />
    <Input disabled type="textarea" :rows="4" placeholder="Enter something..." />
    <br />
    <br />
    <Input v-model="value11">
      <span slot="prepend">http://</span>
      <span slot="append">.com</span>
    </Input>
    <br />
    <Input v-model="value12">
      <Select v-model="select1" slot="prepend" style="width: 80px">
        <Option value="http">http://</Option>
        <Option value="https">https://</Option>
      </Select>
      <Select v-model="select2" slot="append" style="width: 70px">
        <Option value="com">.com</Option>
        <Option value="org">.org</Option>
        <Option value="io">.io</Option>
      </Select>
    </Input>
    <br />
    <Input v-model="value13">
      <Select v-model="select3" slot="prepend" style="width: 80px">
        <Option value="day">Day</Option>
        <Option value="month">Month</Option>
      </Select>
      <Button slot="append" icon="ios-search"></Button>
    </Input>
    <br />
    <br />
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: "",
      value14: "Hello World",
      value11: "",
      value12: "",
      value13: "",
      select1: "http",
      select2: "com",
      select3: "day"
    };
  }
};
</script>