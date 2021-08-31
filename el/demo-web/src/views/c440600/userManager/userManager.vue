<template>
  <div style="height: calc(100%); display: flex;position:relative;" class="fx__padding">
    <!-- <Button type="primary" @click="dataConvent()">转换旧表</Button> -->
    <div class="fx__box fx__margin" style="flex:400px 0 0;overflow:auto;display: flex;flex-direction:column;">
      <div style="display:flex;justify-content: space-between;align-items: center">
        <Button type="primary" size="small" @click="createuser()">新建用户</Button>
        <!-- @on-change='search' -->
        <Input suffix="ios-search" placeholder="输入用户名可搜索" v-model.trim="userTreeOpts.keyword" style="width: auto" />
      </div>
      <div class="fx__line_divide" style="height:2px;margin-top:10px;"></div>
      <div style="flex:1;overflow-y:auto;overflow-x:hidden;">
        <userTree ref="userTree" :Opts="userTreeOpts" @on-selectedUser="onSelectedUser"></userTree>
      </div>
    </div>
    <div style="flex:1;overflow:auto;display: flex;flex-direction:column;position:relative;" class="fx__margin"> 
      <Drawer :closable="true" v-model="isDetail" :inner="true" :transfer="false" width="100%" :title="drawertitle">
        <userDetail ref="detail" :DepartmentList="userTreeOpts.lstDepartment" @on-adduser="onAddUser" @on-edit="onEditUser"></userDetail>
      </Drawer>
    </div>

    <!-- <fx-track>
      <template>
        状态:研发中
        作者:彭博
        功能描述:实现用户部门和人员增删改
      </template>
    </fx-track> -->

  </div>
</template>

<script>
import userTree from "./manager";
import userDetail from "./userDetail";

export default {
  components: {
    userTree,
    userDetail
  },
  data() {
    return {
      isDetail: false,
      selectGID: null,
      userTreeOpts: {
        lstDepartment: [],
        lstUsers: [],
        lstUserGroupR: [],
        keyword: "" //数组件关键字传入
      }
    };
  },
  computed: {
    drawertitle() {
      let _this = this;
      if (_this.selectGID) {
        return "用户编辑";
      } else return "新增用户";
    }
  },
  mounted() {},
  methods: {
    dataConvent() {
      this.$curl.get("/api/core/userManager/migrateOldTable").then(res => {
        alert(res);
      });
    },
    createuser() {
      let _this = this;
      _this.isDetail = null;
      _this.selectGID = null;
      _this.$refs.userTree.roleSelectedID = null;
      _this.$nextTick(() => {
        this.isDetail = true;
        this.$refs.detail.LoadForm(null, null);
      });
    },
    onAddUser({ user, lstGID }) {
      let _this = this;
      _this.$Message.info("新增完成");
      _this.$refs.userTree.LoadData();
      _this.$nextTick(() => {
        _this.$refs.userTree.roleSelectedID = user.UserID;
        _this.selectGID = user.UserID;
        _this.$refs.detail.LoadForm(user.UserID, null);
      });
    },
    onEditUser() {
      let _this = this;
      _this.$Message.info("编辑完成");
      _this.$refs.userTree.LoadData();
    },
    onSelectedUser(UserID) {
      let _this = this;
      this.isDetail = null;
      _this.selectGID = null;
      if (UserID) {
        _this.$nextTick(() => {
          this.isDetail = true;
          _this.selectGID = UserID;
          this.$refs.detail.LoadForm(UserID, null);
        });
      }
    }
    // search(){
    //   this.userTreeOpts.keyword =  this.keyword.replace(/\s*/g,"");
    // }
  }
};
</script>


