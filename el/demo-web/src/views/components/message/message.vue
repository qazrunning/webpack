<template>
     <div style="width:100%;text-align:left;">
        <p style="text-align:left;font-size:18px">{{message}}</p>
        <a style="text-align:right;" href="#"  @click.prevent="moreInfo"  v-if="ismore === -1||ismore === 1">
            <Icon type="ios-more"></Icon>
        </a>
        <p v-if="ismore === 1">{{error}}</p>
    </div>
</template>

<script>
export default {
  name: "MessageRender",
  props: {
    message: { type: String, default: "" },
    error: { type: String, default: "" }
  },
  data() {
    return {
      ismore: -1
    };
  },
  methods: {
    moreInfo() {
      if (this.ismore === -1) {
        this.ismore = 1;
      } else {
        this.ismore = -1;
      }
    }
  }
};
</script>

<style>
</style>
