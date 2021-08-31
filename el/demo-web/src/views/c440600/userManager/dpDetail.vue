<template>
  <div>
    <Modal v-model="isDetail" :title="title" :footer-hide="true">
      <Form :label-width="80" v-if="mode=='edit'">
        <FormItem label="父部门">
          <!--<Select v-model="formData.PGID">
            <Option :value="item.GID" v-for="(item, index) in roleList" :key="index">
              {{item.GroupName}}
            </Option>
          </Select> -->
          <vue-treeselect v-model="formData.PGID" :options="selectTree" />
        </FormItem>
        <FormItem label="角色ID" v-if="isDebug">
          {{ formData.GID }}
        </FormItem>
        <FormItem label="角色Key">
          <Input placeholder="" v-model="formData.RoleKey" @keyup.enter.native="editRole()"/>
        </FormItem>
        <FormItem label="部门名">
          <Input placeholder="" v-model="formData.GroupName" @keyup.enter.native="editRole()"/>
        </FormItem>
        <FormItem>
          <Button type="primary" :loading="loading" @click="editRole()" style="width:100%">
            <span v-if="!loading">保存</span>
            <span v-else>保存中...</span>
          </Button>
        </FormItem>
      </Form>

      <Form :label-width="80" v-if="mode=='append'">
        <FormItem label="父角色ID" v-if="isDebug">
          {{formData.PGID}}
        </FormItem>
        <FormItem label="父部门名">
          {{formData.PGroupName}}
        </FormItem>

        <FormItem label="子部门名">
          <Input placeholder="" v-model="formData.GroupName" @keyup.enter.native="addSubRole()"/>
        </FormItem>
        <FormItem>
          <Button type="primary" :loading="loading" @click="addSubRole()" style="width:100%">
            <span v-if="!loading">保存</span>
            <span v-else>保存中...</span>
          </Button>
        </FormItem>
      </Form>

      <!-- <Form :label-width="80" v-if="mode=='create'">
        <FormItem label="部门名">
          <Input placeholder="" v-model="formData.GroupName" />
        </FormItem>
        <FormItem>
          <Button type="primary" :loading="loading" @click="createRole()" style="width:100%">
            <span v-if="!loading">保存</span>
            <span v-else>保存中...</span>
          </Button>
        </FormItem>
      </Form> -->

    </Modal>

  </div>
</template>

<script>
export default {
  props: {
    AllRoleList: Array
  },
  data() {
    return {
      isDetail: false,
      loading: false,
      title: "",
      isDebug: false, //是否显示ID,专门用来调试
      mode: null,
      formData: {
        PGID: "-",
        PGroupName: "",
        RoleType: ""
      },
      roleList: [],
      saveOkFn: null
    };
  },
  computed: {
    selectTree() {
      let _this = this;
      return _this.roleList.List2Tree("GID", "PGID", (src, sublist) => {
        let item = {};
        item.id = src.GID;
        item.label = src.GroupName;
        item.children = sublist;
        return item;
      });
    }
  },
  methods: {
    addSubRole() {
      let _this = this;
      let { PGID, GroupName } = this.formData;
      _this.loading = true;
      if (PGID == "all") PGID = undefined;
      return _this.$curl
        .post("api/core/userManager/addDepartment", {
          PGID,
          GroupName
        })
        .then(res => {
          _this.isDetail = false;
          if (_this.saveOkFn) {
            _this.isDetail = false;
            _this.saveOkFn(res);
          }
        })
        .finally(() => {
          _this.loading = false;
        });
    },
    editRole() {
      let _this = this;
      let { GID, GroupName, PGID, RoleKey } = this.formData;
      _this.loading = true;

      return _this.$curl
        .post("api/core/roleManager/editRole", {
          GID,
          GroupName,
          PGID,
          RoleKey
        })
        .then(res => {
          _this.isDetail = false;
          if (_this.saveOkFn) {
            _this.saveOkFn(res);
          }
        })
        .finally(() => {
          _this.loading = false;
        });
    },
    ShowAppendDlg(opts) {
      let _this = this;
      let { rowData, title, saveOkFn } = opts;
      _this.mode = "append";
      _this.isDetail = true;
      _this.title = title;
      _this.saveOkFn = saveOkFn;
      _this.formData = Object.assign({}, true, rowData);
    },
    ShowEditDlg(opts) {
      let _this = this;
      let { rowData, title, saveOkFn } = opts;
      _this.mode = "edit";
      _this.isDetail = true;
      _this.title = title;
      _this.saveOkFn = saveOkFn;
      _this.formData = Object.assign({}, true, rowData);
      _this.roleList = _this.AllRoleList.filter(
        p => p.RoleType == rowData.RoleType && p.GID != rowData.GID
      );

      _this.roleList.unshift({
        GID: "NULL",
        GroupName: "无"
      });

      _this.formData.NewGID = _this.formData.GID;
      if (!_this.formData.PGID) _this.formData.PGID = "NULL";
    }
  }
};
</script>

