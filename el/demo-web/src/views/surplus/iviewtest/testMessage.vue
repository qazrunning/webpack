<template>
  <Button @click="time">Displays a 10 second prompt</Button>
</template>
<script>
export default {
  methods: {
    time() {
      this.$Message.info({
        content: "111",
        duration: 300
      });
    }
  }
};
</script>