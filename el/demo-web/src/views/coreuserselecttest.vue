<template>
  <div class="fx__module" style="height:100%;margin:0 -10px -10px;display:flex;">
    <div class="fx__box" style="flex:1;margin:0 10px 10px;overflow:hidden;">
      <span style="padding:15px 10px;display:inline-block;">当前选中: {{name}}</span>
      <div class="fx__line_divide"></div>
      <div style="height:100%;overflow-y:auto;overflow-x:hidden;">
        <core-userselect ref="userTree" :Multiple="false" @on-select-change="selectItem"></core-userselect>
      </div>
    </div>
    <div class=" fx__box" style="flex:1;margin:0 10px 10px;overflow:hidden;">
      <div style="padding-bottom:15px;">
        <Button type="primary" @click="testSetCheck(['U000116','U000117'])" style="margin-left:10px;">测试选中用户</Button>
        <Button type="primary" @click="testGetCheck()" style="margin-left:10px;">测试获取选中id</Button>
        <Button type="primary" @click="testGetCheckUsers()" style="margin-left:10px;">测试获取选中信息</Button>
      </div>
      <div class="fx__line_divide"></div>
      <div style="height:100%;overflow-y:auto;overflow-x:hidden;">
        <core-userselect ref="userTree" :Multiple="true"></core-userselect>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: ""
    };
  },
  methods: {
    selectItem(user) {
      this.name = user.CnName;
      alert(JSON.stringify(user));
    },
    testSetCheck(users) {
      this.$refs.userTree.SetCheck(users);
    },
    testGetCheck() {
      let users = this.$refs.userTree.GetCheck();
      if (users.length > 0) {
        alert(users.join("\r\n"));
      } else {
        alert("未选中任何用户");
      }
    },
    testGetCheckUsers() {
      let users = this.$refs.userTree.GetCheckUsers();
      if (users.length > 0) {
        let arr = users.map(p => JSON.stringify(p));
        alert(arr.join("\r\n"));
      } else {
        alert("未选中任何用户");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
</style>