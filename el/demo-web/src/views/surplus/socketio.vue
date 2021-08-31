<template>
  <div style="padding: 10px;">
    <div style="margin-bottom: 10px;">
      <Input v-model="sendmsg" placeholder="输入信息" style="width: 440px" />
    </div>
    <div>
      <Button type="info" @click="send('all')" :disabled="!sendmsg">群发</Button>
      <Button type="success" @click="send('others')" :disabled="!sendmsg">排除自己发</Button>
      <Button type="warning" @click="send('userid')" :disabled="!sendmsg||!userids">指定人发</Button>
      <Input v-model.trim="userids" placeholder="输入UserID" style="width: 200px" />
      <ul style="margin-top:10px;list-style: none;">
        <li v-for="(item,index) in messages" :key="index">{{index}}:{{item.type}}:{{item.SendContent}}</li>
        <li v-if="messages.length===0">no messages</li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      sendmsg: "",
      userids: "",
      messages: []
    };
  },
  created() {
    const fd = this.$app.io.on("chat-test", data => {
      this.messages.push(data);
    });
    this.$once("hook:beforeDestroy", () => {
      fd.dispose();
    });
  },
  methods: {
    send(type) {
      let option = {
        data: {
          type: "chat-test",
          SendContent: this.sendmsg
        },
        userids: type,
        ack: () => {
          this.messages.push({
            type: "ack",
            SendContent: "success"
          });
        }
      };
      if (type === "userid") {
        option.userids = this.userids;
      }

      this.$app.io.sendMessage(option);
    }
  }
};
</script>