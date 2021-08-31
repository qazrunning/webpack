<template>
  <div>
    <Button type="primary" @click="open(false)">Open notice</Button>
    &nbsp;
    <Button @click="open(true)">Open notice(only title)</Button>
    <br />
    <br />
    <p>With desc</p>
    <Button @click="info(false)">Info</Button>
    &nbsp;
    <Button @click="success(false)">Success</Button>
    &nbsp;
    <Button @click="warning(false)">Warning</Button>
    &nbsp;
    <Button @click="error(false)">Error</Button>
    <p>Only title</p>
    <Button @click="info(true)">Info</Button>
    &nbsp;
    <Button @click="success(true)">Success</Button>
    &nbsp;
    <Button @click="warning(true)">Warning</Button>
    &nbsp;
    <Button @click="error(true)">Error</Button>
    <br />
    <br />
    <Button type="primary" @click="time">Open notice</Button>
  </div>
</template>
<script>
export default {
  methods: {
    open(nodesc) {
      this.$Notice.open({
        title: "Notification title",
        desc: nodesc
          ? ""
          : "Here is the notification description. Here is the notification description. "
      });
    },
    info(nodesc) {
      this.$Notice.info({
        title: "Notification title",
        desc: nodesc
          ? ""
          : "Here is the notification description. Here is the notification description. "
      });
    },
    success(nodesc) {
      this.$Notice.success({
        title: "Notification title",
        desc: nodesc
          ? ""
          : "Here is the notification description. Here is the notification description. "
      });
    },
    warning(nodesc) {
      this.$Notice.warning({
        title: "Notification title",
        desc: nodesc
          ? ""
          : "Here is the notification description. Here is the notification description. "
      });
    },
    error(nodesc) {
      this.$Notice.error({
        title: "Notification title",
        desc: nodesc
          ? ""
          : "Here is the notification description. Here is the notification description. "
      });
    },
    time() {
      this.$Notice.open({
        title: "Notification title",
        desc:
          "This notification does not automatically close, and you need to click the close button to close.",
        duration: 0
      });
    }
  }
};
</script>