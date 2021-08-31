<template>
  <div>
    <Slider v-model="value1"></Slider>
    <Slider v-model="value2" range></Slider>
    <Slider v-model="value3" range disabled></Slider>
    <br />
    <br />
    <Slider v-model="value6" :step="10" show-stops></Slider>
    <br />
    <br />
    <Slider v-model="value8" show-input></Slider>
    <br />
    <br />
    <Slider v-model="value9" :tip-format="format"></Slider>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value1: 25,
      value2: [20, 50],
      value3: [20, 50],
      value6: 30,
      value8: 25,
      value9: 25
    }
  },
  methods: {
    format(val) {
      return "Progress: " + val + "%";
    }
  }
};
</script>