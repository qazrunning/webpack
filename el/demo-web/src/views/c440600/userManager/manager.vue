<template>
  <div style="user-select: none;" class="fx__tree">
    <Tree ref="mytree" :data="treeSource"></Tree>

    <dpDetail ref="dpDetail" :AllRoleList="sortlstDepartment"></dpDetail>
  </div>
</template>
<script>
import dpDetail from "./dpDetail";
import draggable from "./draggable";

function compareRankID(a, b) {
  if (a.RankID != null && b.RankID != null) {
    return parseInt(a.RankID) - parseInt(b.RankID);
  } else if (a.RankID != null && b.RankID == null) {
    return -1;
  } else if (a.RankID == null && b.RankID != null) {
    return 1;
  } else {
    if (a.GID == "Others" && b.GID != "Others") {
      return 1;
    } else if (a.GID != "Others" && b.GID == "Others") {
      return -1;
    }

    return 0;
  }
}

function sortCondition(a, b) {
  //如果a<b return -1;
  //如果a>b return 1;
  if (a.UserID && b.UserID) {
    return compareRankID(a, b);
  } else if (a.UserID && !b.UserID) {
    return 1;
  } else if (!a.UserID && b.UserID) {
    return -1;
  } else {
    return compareRankID(a, b);
  }
}

export default {
  props: {
    Opts: {
      type: Object,
      default() {
        return {
          lstDepartment: [],
          lstUsers: [],
          lstUserGroupR: []
        };
      }
    }
  },
  components: {
    dpDetail
  },
  data() {
    return {
      expandDict: {}, //折叠缓存字典
      roleSelectedID: null,
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

    _this.$nextTick(() => {
      _this.LoadData();
    });
  },
  computed: {
    sortlstDepartment() {
      let _this = this;
      let { lstDepartment } = _this.Opts;
      return lstDepartment.sort(sortCondition);
    },
    treeSource() {
      let _this = this;
      let { lstDepartment, lstUsers, lstUserGroupR, keyword } = _this.Opts; //解构三个数组 以及搜索关键字
      let lstUsersfilter = Object.assign([], true, lstUsers); //深度拷贝一份 后台传过来的 用户名单

      if (keyword)
        //如果搜索框中存在关键字的时候，用lstUsersfilter中 寻找符合关键字条件的用户 并储存
        lstUsersfilter = lstUsersfilter.filter(
          p => p.CnName.indexOf(keyword) != -1
        );

      let arr = Object.assign([], true, lstDepartment); //方法用于对象的合并
      let DictUsers = {};
      lstUsersfilter.forEach(elem => {
        //获取所有人员
        DictUsers[elem.UserID] = elem;
      });

      lstUserGroupR.forEach(elem => {
        //给人员分配id 并加入到 arr 数组当中
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
      // if(userEntity.CnName.indexOf(keyword) != -1){
      // }
      //寻找无部门人士
      let lstGID = lstUserGroupR.map(k => k.UserID);
      let lstOthers = lstUsersfilter.filter(p => {
        //返回没有userid 的人员
        return !lstGID.includes(p.UserID);
      });
      //将无部门人士加入无归属分级
      arr.push({
        PGID: null,
        GID: "Others",
        GroupName: "待分配",
        RankID: null
      });
      lstOthers.forEach(elem => {
        let obj = {
          PGID: "Others",
          GID: elem.UserID,
          UserID: elem.UserID,
          GroupName: elem.CnName,
          RankID: elem.RankID
        };
        arr.push(obj);
      });

      let newArr = [];
      if (keyword) {
        //是否进行筛选
        arr.forEach(p => {
          if (p.UserID) {
            newArr.push(p); //遍历循环arr数组，找出用户 并存放到 newArr数组 当中
            let findobj = arr.find(k => k.GID == p.PGID); //在所有组里寻找该用户的父级
            while (findobj) {
              //TODO
              if (newArr.indexOf(findobj) == -1) newArr.push(findobj); //防止重复push到newArr
              findobj = arr.find(k => k.GID == findobj.PGID); //递归继续向上查找
            }
          }
        });
      } else newArr = arr;

      newArr = newArr.sort(sortCondition);
      //开始制作树形结构
      let _Treedata = newArr.List2Tree("GID", "PGID", (ent, sublist) => {
        //监听折叠展开
        let item = new Proxy(
          {
            expand: !keyword
              ? _this.expandDict[ent.GID] || false
              : _this.expandDict[ent.GID] || true //展开与折叠
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
          name: ent.GID
        });
        item.children = sublist;
        item.render = _this.renderTreeItem;
        return item;
      });
      return [
        {
          title: "所有部门",
          name: "all",
          children: _Treedata,
          expand: true,
          render: _this.renderTreeItem
        }
      ];
    }
  },
  methods: {
    LoadData() {
      let _this = this;
      _this.$curl
        .get("/api/core/userManager/getall")
        .then(res => {
          let _this = this;
          let { lstDepartment, lstUsers, lstUserGroupR } = res;
          _this.Opts.lstDepartment = lstDepartment;
          _this.Opts.lstUsers = lstUsers;
          _this.Opts.lstUserGroupR = lstUserGroupR;
        })
        .finally(() => {});
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
    // hMakeBtn(h, title, fn) {
    //   let _this = this;
    //   return h("button", _this.makeBtn(fn), [
    //     h("i", { class: "/*fa fa-trash*/" }),
    //     title
    //   ]);
    // },
    renderTreeItem(h, { root, node, data }) {
      let _this = this;

      return h(
        "span",
        {
          class: {
            fx__item: true,
            "fx__item-selected": _this.roleSelectedID === data.name
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
                  if (data.name === "all") return;
                  event.stopPropagation();
                  //切换选中
                  if (_this.roleSelectedID == data.name)
                    _this.roleSelectedID = null;
                  else _this.roleSelectedID = data.name;
                  //出发实践
                  if (data.UserID) {
                    //选中人员
                    _this.$emit(
                      "on-selectedUser",
                      _this.roleSelectedID == null ? null : data.name
                    );
                  } else {
                    //选中部门
                    _this.editRole(data).then(entity => {
                      _this.LoadData();
                    });
                    _this.$emit("on-selectedUser", null);
                  }
                }
              }
            },
            [
              data.UserID != undefined &&
                // h("fx-avatar", {
                //   // class: "fa fa-user-o",
                //   props: {
                //     UserID: data.UserID,
                //   },
                //   style: {
                //     "margin-right": "5px",
                //     "width": "15px",
                //     "height": "15px",
                //     "position": "relative",
                //     "top": "3px",
                //     "border-radius": "50%"
                //   }
                // }),
                h("span", {
                  class: "fa fa-user-o",
                  style: {
                    width: "15px",
                    height: "15px"
                  }
                }),
              data.RoleKey ? ` ${data.title}(${data.RoleKey})` : `${data.title}`
            ]
          ),
          h(
            "span",
            {
              class: "fx__opera"
            },
            this.Opts.keyword
              ? [
                  data.children == undefined
                    ? _this.hMakeBtn(h, "删除", () => {
                        if (data.UserID)
                          //删除用户
                          _this.deleteUser(data.name).then(res => {
                            _this.LoadData();
                          });
                      })
                    : undefined
                ]
              : [
                  data.children == undefined
                    ? _this.hMakeBtn(h, "删除", () => {
                        if (data.UserID)
                          //删除用户
                          _this.deleteUser(data.name).then(res => {
                            _this.LoadData();
                          });
                        else if (
                          data.UserID == undefined &&
                          data.children == undefined
                        )
                          //删除角色
                          _this.deleteRole(data.name).then(res => {
                            _this.LoadData();
                          });
                      })
                    : undefined,
                  //待分配集合不能有添加
                  data.UserID == undefined && data.name != "Others"
                    ? _this.hMakeBtn(h, "添加", () => {
                        _this.appendSubRole(data).then(entity => {
                          _this.$Message.info("新增成功");
                          data.expand = true;
                          _this.LoadData();
                          _this.roleSelectedID = entity.GID;
                        });
                      })
                    : undefined,
                  data.UserID == undefined &&
                  data.children !== undefined &&
                  data.name != "Others"
                    ? _this.hMakeBtn(h, "排序", () => {
                        let groupArr = data.children.filter(
                          p => p.UserID === undefined
                        );
                        let userArr = data.children.filter(
                          p => p.UserID !== undefined
                        );
                        _this.sortSubRole(groupArr, userArr).then(entity => {
                          _this.$Message.info("保存成功");
                          data.expand = true;
                          _this.LoadData();
                        });
                      })
                    : undefined
                  //_this.hMakeBtn(h, "添加部门", () => {})
                ]
          )
        ]
      );
    },
    editRole({ name, title, RoleKey, PGID }) {
      let _this = this;
      return new Promise(function(resolve, reject) {
        _this.$refs.dpDetail.ShowEditDlg({
          rowData: {
            GID: name,
            PGID,
            GroupName: title,
            RoleKey
          },
          title: "编辑部门",
          saveOkFn(entity) {
            resolve(entity);
          }
        });
      });
    },
    appendSubRole({ name, title }) {
      let _this = this;

      return new Promise(function(resolve, reject) {
        _this.$refs.dpDetail.ShowAppendDlg({
          rowData: {
            PGID: name,
            PGroupName: title
          },
          title: "添加部门",
          saveOkFn(entity) {
            resolve(entity);
          }
        });
      });
    },
    deleteRole(GID) {
      let _this = this;
      return new Promise(function(resolve, reject) {
        _this.$Modal.confirm({
          title: "删除确认",
          content: "<p>是否确认删除此角色,一旦删除不可恢复</p>",
          loading: true,
          onOk: () => {
            _this.$curl
              .post("/api/core/roleManager/delRole", { GID })
              .then(res => {
                _this.$Modal.remove();
                _this.$Message.info("删除完成");
                resolve();
              });
          }
        });
      });
    },
    deleteUser(UserID) {
      let _this = this;
      return new Promise(function(resolve, reject) {
        _this.$Modal.confirm({
          title: "删除确认",
          content: "<p>是否确认删除此用户,一旦删除不可恢复</p>",
          loading: true,
          onOk: () => {
            _this.$curl
              .post("/api/demo/user/del", { UserID })
              .then(res => {
                if(res.code==0){
                  _this.$Modal.remove();
                  _this.$Message.info("删除完成");
                  resolve();
                }else{
                  _this.$Message.error("删除失败");
                }
                
              });
          }
        });
      });
    },
    sortSubRole(groupArr, userArr) {
      let _this = this;
      
      return new Promise(function(resolve, reject) {
        _this.$Modal.confirm({
          title: "排序",
          render: h =>
            h(draggable, { props: { groupArr, userArr }, ref: "dragBox" }),
          onOk() {
            
            let dragDom = this.$refs.dragBox;
            let lstRoleRank = dragDom.groupRankArr.map((p, i) => ({
              RankID: i,
              GID: p.name
            }));
            let lstUserRank = dragDom.userRankArr.map((p, i) => ({
              name: p.title,
              RankID: i,
              UserID: p.UserID
            }));

            _this.$curl
              .post("/api/core/userManager/saveRank", {
                content: JSON.stringify({
                  lstUserRank,
                  lstRoleRank
                })
              })
              .then(res => {
                resolve();
              });
          }
        });
      });
    }
  }
};
</script>
<style lang="scss" >
</style>