<template>

  <Tree ref="mytree" :data="treeSource" show-checkbox style="user-select: none;overflow-x:hidden"></Tree>


</template>
<script>
export default {
  data() {
    return {
      lstDepartment: [],
      lstUsers: [],
      lstUserGroupR: [],
      lstCheckUserID: [],
      expandDict: {}, //折叠缓存字典
      treeStyle: {
        display: "inline-block",
        height: "24px",
        "padding-left": "6px",
        "padding-right": "16px",
        margin: 0,
        // cursor: "pointer",
        "line-height": "24px",
        width: "100%"
      }
    };
  },
  mounted() {
    let _this = this;
    _this.$curl
      .get("/api/core/userManager/getall")
      .then(res => {
        let _this = this;
        let { lstDepartment, lstUsers, lstUserGroupR } = res;
        _this.lstDepartment = lstDepartment;
        _this.lstUsers = lstUsers;
        _this.lstUserGroupR = lstUserGroupR;
      })
      .finally(() => {});
  },
  computed: {
    treeSource() {
      let _this = this;
      let { lstDepartment, lstUsers, lstUserGroupR, lstCheckUserID } = _this;
      let arr = Object.assign([], true, lstDepartment);

      let DictUsers = {};
      lstUsers.forEach(elem => {
        DictUsers[elem.UserID] = elem;
      });

      lstUserGroupR.forEach(elem => {
        let userEntity = DictUsers[elem.UserID];
        if (!userEntity) return;

        let obj = {
          PGID: elem.GID,
          GID: elem.UserID,
          UserID: elem.UserID,
          GroupName: userEntity.CnName,
          RankID: userEntity.RankID
        };
        arr.push(obj);
      });

      //寻找无部门人士
      let lstGID = lstUserGroupR.map(k => k.UserID);
      let lstOthers = lstUsers.filter(p => {
        return !lstGID.includes(p.UserID);
      });
      //将无部门人士加入无归属分级
      // arr.push({
      //   PGID: null,
      //   GID: "无归属",
      //   GroupName: "无归属",
      //   RankID: null
      // });
      // lstOthers.forEach(elem => {
      //   let obj = {
      //     PGID: "无归属",
      //     GID: elem.UserID,
      //     GroupName: elem.CnName,
      //     RankID: elem.RankID
      //   };
      //   arr.push(obj);
      // });
      //开始制作树形结构
      let _Treedata = arr.List2Tree("GID", "PGID", (ent, sublist) => {
        //监听折叠展开
        let item = new Proxy(
          {
            expand: _this.expandDict[ent.GID] || false
          },
          {
            set: function(obj, prop, value) {
              obj[prop] = value;
              if (prop === "expand") {
                _this.expandDict[obj.name] = value;
              } else if (prop === "checked") {
              }
              return true;
            }
          }
        );

        Object.assign(item, {
          RoleKey: ent.RoleKey,
          RankID: ent.RankID,
          PGID: ent.PGID,
          UserID: ent.UserID,
          title: ent.GroupName,
          name: ent.GID,
          checked: lstCheckUserID.includes(ent.GID),
          render: _this.renderTreeItem
        });
        item.children = sublist;
        if (sublist) {
          //TODO实现排序
        }
        return item;
      });
      return [{ title: "全体人员", children: _Treedata, expand: true }];
    }
  },
  methods: {
    setCheck(userids) {
      let _this = this;
      _this.lstCheckUserID = userids;
    },
    getCheck() {
      return this.$refs.mytree
        .getCheckedNodes()
        .filter(p => p.children == undefined)
        .map(k => k.name);
    },
    makeBtn(fn) {
      return {
        class: "ivu-btn ivu-btn-primary",
        style: {
          display: "inline-block",
          // width:"60px",
          float: "right",
          "line-height": "100%",
          "text-align": "center",
          height: "100%",
          marginRight: "5px"
        },
        on: {
          click(event) {
            event.stopPropagation();
            fn();
          }
        }
      };
    },
    hMakeBtn(h, title, fn) {
      let _this = this;
      return h("button", _this.makeBtn(fn), [
        h("i", { class: "/*fa fa-trash*/" }),
        title
      ]);
    },
    renderTreeItem(h, { root, node, data }) {
      let _this = this;
      return h(
        "span",
        {
          class: {
            fx__item: true
          },
          style: _this.treeStyle,
          on: {
            click() {
              if (data.children != undefined) data.expand = !data.expand;
            }
          }
        },
        [
          h(
            "span",
            {
              class: {
                // "fa fa-user-o": data.UserID,
                fx__tag: true
              },
              on: {
                click(event) {
                  event.stopPropagation();
                  //找到兄弟checkbox，强行触发点击事件
                  let inputcheckbox = event.target.parentElement.previousElementSibling.getElementsByTagName(
                    "input"
                  );
                  inputcheckbox[0].click();
                }
              }
            },
            [
              data.UserID != undefined &&
                h("i", {
                  class: "fa fa-user-o",
                  style: {
                    "margin-right": "5px"
                  }
                }),
              data.title
            ]
          )
        ]
      );
    }
  }
};
</script>
<style lang="scss" scoped>
</style>