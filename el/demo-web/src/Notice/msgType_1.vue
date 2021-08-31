<template>
  <div>
    <h1>notice -- 1</h1>
    <div>{{data}}</div>
    <Button @click="remove">test</Button>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object
    },
    remove: {
      type: Function
    }
  },
  data() {
    return {};
  },
  mounted() {
    // console.log(this.data);
  }
};
</script>

<style>
</style>