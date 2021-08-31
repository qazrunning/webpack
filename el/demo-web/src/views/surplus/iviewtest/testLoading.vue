<template>
  <div>
    <Button type="primary" loading>Loading...</Button>&nbsp;
    <Button type="primary" :loading="loading" @click="toLoading">
      <span v-if="!loading">Click me!</span>
      <span v-else>Loading...</span>
    </Button>&nbsp;
    <Button type="primary" :loading="loading2" icon="ios-power" @click="toLoading2">
      <span v-if="!loading2">Click me!</span>
      <span v-else>Loading...</span>
    </Button>&nbsp;
    <Button loading shape="circle"></Button>&nbsp;
    <Button loading shape="circle" type="primary"></Button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      loading2: false
    };
  },
  methods: {
    toLoading() {
      this.loading = true;
    },
    toLoading2() {
      this.loading2 = true;
    }
  }
};
</script>>