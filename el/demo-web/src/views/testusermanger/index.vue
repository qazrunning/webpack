
<template>
  <div class="fx__module content">
    <div class="head">
      <div class="head__left" style="display:flex;">
        <!-- <div class="head__title" style="margin-right: 20px;">用户管理演示</div> -->
      </div>
      <div class="head__right">
        <div class="" style="display:flex;">
          <Button type="default" class="btn-static-switch" :class="{screen:islayoutscreen}" @click=" swicthdisplay">{{isShowStaticDiv ? '收起': '统计'}}</Button>
          <Button type="default" @click="addUser()" style="margin-left:10px;">新增</Button>
          <Dropdown style="margin-left:10px;" @on-click="islayoutscreen=!islayoutscreen" class="setting">
            <Button type="default">
              <i class="fa fa-cog icon-setting"></i>
            </Button>
            <DropdownMenu slot="list">
              <DropdownItem :selected="!islayoutscreen">左右布局</DropdownItem>
              <DropdownItem :selected="islayoutscreen">全屏布局</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="left fx__box" :class="{screen:islayoutscreen,ShowStaticDiv:isShowStaticDiv}">
        <div style="display:flex;justify-content: space-between;">
          <fx-filter @on-filter="onFilter" @on-keyword="onSearch" ref="filter1" :style-keyword="{width:'200px'}">
            <template v-slot:right>
              <span style="margin-left:10px;">总计：{{myCount}}</span>
            </template>
          </fx-filter>
          <Dropdown>
            <i class="fa fa-tasks" style="font-size:22px;height:32px;line-height:32px;"></i>
            <DropdownMenu slot="list">
              <DropdownItem>按时间排序</DropdownItem>
              <DropdownItem>按姓氏排序</DropdownItem>
              <DropdownItem><span @click="switchfoldOnOff()">展开关闭分组</span></DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div class="line-divide fx__line_divide"></div>

        <fx-grid :Opts="gridOpts" @on-update="onUpdate" ref="grid1" class="gridlayout">
          <!--左右布局-->
          <!--v-slot:table="{groups}  接收groups具名插槽-->
          <template v-slot:groups="{groups}">
            <div class="gridlayoutgroup  fx__group" v-for="(group,index) in groups" :key="index">
              <div class="collapse__header" :class="{'fx__group_head-open':group.isfold}" style="font-size:1rem;user-select:none;" @click="onclick(group,$event)">
                <span class="arrow" v-bind:class="{rotate90:group.isfold}"> <i class="fa fa-angle-right" style=""></i></span>
                <span>{{group.groupText}}</span>
                <Badge class="right_badge" :count="group.children.length"></Badge>

                <!-- 可继续添加其他标签元素 -->
                <!-- <span class="p-2 flex-fill"></span> -->
              </div>
              <div v-if="group.isfold" commnet="/*折叠*/">
                <!-- 行选中会添加类名：hightlight和fx__item，fx__item指定颜色，如背景色和字体色，该颜色由框架定义；hightlight在index.scss中可自定义修改 -->
                <div v-for="(item,subindex) in group.children" :key="subindex" class="gridlayoutrow fx__item" :class="{'fx__item-selected':gridSelectRow==item.RowData}" @click="routeToUser(item.RowData.UserID)">
                  <Row class="">
                    <i-col span="18">{{item.RowData.CnName}}</i-col>
                    <!--垃圾桶图标需要右边移动对齐-->
                    <i-col span="4" class="fx__opera gridlayoutdo">
                      <span class="delete fx__item_ico" @click.stop="delUser(item.RowData,item.RowIndex)"><i class="fa fa-trash-o"></i></span>
                    </i-col>
                  </Row>
                </div>
              </div>
            </div>
          </template>

          <!--全屏布局-->
          <!--v-slot:table="{table}  接收table具名插槽-->
          <template v-slot:table="{table}">
            <div class="gridlayouthead fx__thead">
              <Row>
                <i-col span="5" class="gridlayoutname">用户名</i-col>
                <i-col span="5" class="gridlayoutname">部门</i-col>
                <i-col span="5" class="gridlayoutname">电话号码</i-col>
                <i-col span="5" class="gridlayoutname">登录名</i-col>
              </Row>
            </div>
            <div class="gridlayoutbody">
              <!--键值对形式 别称+索引    :key="唯一标识" 唯一标识可以是item里面id index等，-->
              <div v-for="(item, index) in table" :key="index" class="gridlayoutrow fx__item" :class="{'fx__item-selected':gridSelectRow==item.RowData}" @click="routeToUser(item.RowData.UserID)">
                <Row>
                  <i-col span="5">{{item.RowData.CnName}}</i-col>
                  <i-col span="5">{{getDPName(item.RowData.DPID)}}</i-col>
                  <i-col span="5">{{item.RowData.Phone}}</i-col>
                  <i-col span="5">{{item.RowData.EnName}}</i-col>
                  <!--展开全屏布局删除图标-->
                  <i-col class="fx__opera gridlayoutdo">
                    <span class="delete fx__item_ico" @click.stop="delUser(item.RowData,item.RowIndex)"><i class="fa fa-trash-o"></i></span>
                  </i-col>
                </Row>
              </div>
            </div>
          </template>
        </fx-grid>
      </div>
      <!-- 首页右边滚动条 -->
      <div class="right" :class="{screen:islayoutscreen,ShowStaticDiv:isShowStaticDiv}">
        <biz-statics></biz-statics>
      </div>
      <!-- 左右布局和全屏布局  如果是PC版  抽屉从右边滑出   手机版就显示下面部分mode    -->
      <Drawer v-if="$app.helper.screen.isPC" :title="detailTitle" :closable="true" v-model="isDetail" :mask="islayoutscreen" :inner="true" :transfer="false" width="67">
        <biz-userdetail ref="detail" :AuxiData="{departments}" @on-add="onAddUser" @on-edit="onEditUser"></biz-userdetail>
      </Drawer>

      <Modal v-else v-model="isDetail" :title="detailTitle" :footer-hide="true">
        <biz-userdetail ref="detail" :AuxiData="{departments}" @on-add="onAddUser" @on-edit="onEditUser"></biz-userdetail>
      </Modal>

    </div>
  </div>
</template>
<script>
import bizUserdetail from "./detail";
import bizStatics from "./statics";

export default {
  components: {
    bizUserdetail,
    bizStatics
  },
  props: {
    UserID: String //路由组件参数
  },
  // beforeRouteEnter(to, from, next) {
  //   //防止keep-alive回调
  //   debugger;
  //   if (to.params.userid === null && from.name != "app-testusermanger") {
  //     return;
  //   }
  //   next();
  // },
  data() {
    let self = this;
    let userid = this.$route.params.userid;
    return {
      params_userid: userid,
      isDetail: false, //是否显示用户细节页面
      islayoutscreen: false, //是否全屏布局
      myCount: 0, //总人数
      departments: [], //所有部门
      gridOpts: {
        groupRule: {}, //默认分组规则,必写
        keyFields: ["CnName"],
        keyword: "", //默认关键字,带监听连动
        dataSoucre: [], //数据源,带监听连动
        orderRule: {}, //默认排序规则
        filterRuleFnArr: [], //过滤规则函数数组,这里面是一个一个函数
        filterFnEx: null //行过滤扩展函数用法是传入一个带参数函数,参数将被传入行数据Object
      },
      groupOpts: {}, //分组规则
      sortOpts: {}, //排序规则
      spinShow: false, //loading 效果
      gridSelectRow: null, //选中行对象
      detailmode: "", //细节模式
      isShowStaticDiv: false, //是否在大屏幕下面显示统计
      middleScreen: true,
      scrolls: {} //keep-alive缓存滚动条进度
    };
  },
  //事件挂载后
  mounted() {
    let _this = this;
    this.$nextTick(() => {
      _this.loadData();
      // .then(() => {
      //   let { params } = _this.$route;
      //   if (params.userid && params.userid != "null") {
      //     let userid = params.userid;
      //     // console.log(_this.gridSelectRow)
      //     _this.showActiveUser();
      //   }
      // });
    });
  },
  computed: {
    detailTitle() {
      let self = this;
      let dict = {
        add: "用户新增",
        edit: "用户编辑"
      };
      return dict[self.detailmode];
    }
  },
  //监听
  watch: {
    //是否是全屏布局
    islayoutscreen: {
      handler: function(newval, oldval) {
        let self = this;
        self.isDetail = false;
        if (newval == true) {
          self.gridOpts.groupRule = {};
        } else {
          self.gridOpts.groupRule = {
            field: "DPID",
            text: "按部门分组",
            formatterFn: self.getDPName
            //简易模式的组排序
            //orderArr: ["开发部", "市场部", "外贸部", "项目部"]
          };
        }
      },
      immediate: true
    },
    isDetail(newval, oldval) {
      let self = this;
      if (newval === false) {
        self.routeToUser(null);
      }
    },
    $route(to, from) {
      //通过let定义块级作用域
      let self = this;
      if (to.name != "app-testusermanger") return;
      if (to.params && to.params.userid && to.params.userid != "null") {
        // self.isDetail = false;
        self.showDetailById(to.params.userid, "edit");
      } else {
        self.isDetail = false; //是否打开细节
        self.gridSelectRow = null; //选择行
      }
    }
  },
  methods: {
    //异步加载数据
    async loadData() {
      let self = this;
      let filter1 = this.$refs.filter1;
      // 有默认值可以打开这里Demo
      // filter1.keyword = "李";
      // self.FilterOpts[0].items.push({ text: "外贸部", selected: true });
      self.groupOpts.selectIndex = 0;
      // self.sortOpts.selectIndex = 1;
      this.$curl.get("/api/demo/usermanager/getall").then(res => {
        let { users, departments } = res;
        self.gridOpts.dataSoucre = users;
        self.departments = departments;

        self.$nextTick(() => {
          if (self.params_userid == "null") return; //没有userid不执行下去
          if (!self.params_userid) return; //没有userid不执行下去
          self.showDetailById(self.params_userid, "edit");
          self.showActiveUser(self.params_userid);
        });
      });
    },
    onSearch(val) {
      this.gridOpts.keyword = val; //去掉首尾空格
    },
    onUpdate({ filterlist, groups, table }) {
      this.myCount = filterlist.length;
    },
    onFilter(AllConditions) {
      this.gridOpts.filterRuleFnArr = AllConditions;
    },
    //切换分组展开或关闭
    switchfoldOnOff() {
      let grid1 = this.$refs.grid1;
      this.allfold = !this.allfold; //切换展开
      grid1.groups.forEach(element => {
        element.isfold = this.allfold;
      });
    },
    //路由式导航展现用户详细信息
    routeToUser(userid) {
      let _this = this;

      if (_this.gridSelectRow && _this.gridSelectRow.UserID == userid) {
        userid = null;
      }
      if (userid == null) {
        _this.gridSelectRow = null;
      }

      if (userid) _this.isDetail = null; //赋值null,既不会影响监听isDetail中==false的判断，又可以达到短暂的关闭详细页面

      let useridstr = userid == null ? "null" : userid;

      this.$nextTick(() => {
        this.$router.push({
          name: "app-testusermanger",
          params: { userid: useridstr }
        });
      });
    },
    //根据ID行数据显示详细用户信息
    showDetailById(userid, mode) {
      let self = this;
      let findobj = self.gridOpts.dataSoucre.find(p => p.UserID == userid);
      self.showDetailByRow(findobj, mode);
    },
    //根据行数据显示详细用户信息
    async showDetailByRow(rowdata, mode) {
      let self = this;
      self.detailmode = mode;
      self.gridSelectRow = rowdata;
      self.isDetail = true;
      self.$nextTick(() => {
        self.$refs.detail.LoadForm(rowdata.UserID).then(() => {});
      });
    },
    //用户新增
    addUser() {
      let _this = this;
      _this.isDetail = null; //赋值null,既不会影响监听isDetail中==false的判断，又可以达到短暂的关闭详细页面
      _this.$nextTick(() => {
        _this.showDetailByRow({}, "add");
      });
    },
    //把分组字段格式化为分组名
    getDPName: function(field) {
      let self = this;
      let obj = self.departments.find(p => p.DPID == field);
      if (obj) return obj.DPName;
      else return "无部门";
    },
    //添加用户完成后回调
    onAddUser: function(entity) {
      let self = this;
      self.gridOpts.dataSoucre.push(entity);
      self.$Message.info("新增完成");
      self.routeToUser(entity.UserID);
    },
    //编辑用户完成后回调
    onEditUser: function(entity) {
      let self = this;
      Object.assign(self.gridSelectRow, entity);
      self.$Message.info("修改完成");
      //self.isDetail = false;
    },
    //删除用户[参数 rowdata：行数据,rowindex 索引]
    delUser(rowdata, rowindex) {
      let self = this;
      if (rowdata.UserID) {
        self.$Modal.confirm({
          title: "删除确认",
          content: "<p>是否确认删除此用户,一旦删除不可恢复</p>",
          loading: true,
          onOk: () => {
            this.$curl
              .post("/api/demo/usermanager/del", {
                UserID: rowdata.UserID
              })
              .then(function() {
                self.$Modal.remove();
                self.$Message.info("删除完成");
                self.gridOpts.dataSoucre.RemoveAll(function(item) {
                  return item.UserID == rowdata.UserID;
                });
                self.routeToUser(null);
              });
          }
        });
      }
    },
    //右边按钮以及选中变色
    swicthdisplay() {
      this.isShowStaticDiv = !this.isShowStaticDiv;
    },
    //切换折叠
    onclick(item, e) {
      item.isfold = !item.isfold;
    },
    //缓存滚动条位置
    recordScrollPosition(e) {
      let _el = e.target;
      let key = _el.className;
      let value = _el.scrollTop;
      this.scrolls[key] = value;
      // this.$store.commit("demo/setScrolls", { key, value });
      // this.$store.dispatch("setScrollArray",e.target.scrollTop);    //实时存入到vuex中
    },
    //将当前选中的用户提升到列表顶部
    showActiveUser(userid) {
      let _this = this;
      let { groups } = _this.$refs.grid1;
      //

      let group = groups.find(p =>
        p.children.find(k => k.RowData.UserID === userid)
      );
      if (!group) return;
      //
      group.isfold = true;
      _this.$nextTick(() => {
        let grid1 = _this.$refs.grid1.$el;
        let activeItem = document.querySelectorAll(".fx__item-selected")[0];
        grid1.scrollTop = activeItem.offsetTop - grid1.offsetTop;
      });
    }
  },
  //keep-alive缓存滚动位置
  activated() {
    let _this = this;
    let _el = _this.$refs.grid1.$el;
    let key = _el.className;
    _el.scrollTop = _this.scrolls[key] || 0;
    // _el.scrollTop = _this.$store.state.demo.scrolls[key];
    _el.addEventListener("scroll", _this.recordScrollPosition);
  },
  //keep-alive 的页面跳转时，移除scroll事件
  deactivated() {
    let _this = this;
    _this.$refs.grid1.$el.removeEventListener(
      "scroll",
      _this.recordScrollPosition
    );
  }
};
</script>
<style lang="scss" scoped>
$screen-lg-px: 1200px;

.content {
  height: calc(100%);
  display: flex;
  // background-color: $fx-bgcolor;
  flex-direction: column;
  .head {
    display: flex;
    justify-content: space-between;
    padding-bottom: 16px;
    // padding: 20px 30px;
    &__right {
      height: 34px;
      line-height: 29px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      &-group {
        height: 34px;
        line-height: 29px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
    }
    &__title {
      font-size: 18px;
      margin: 0;
      height: 34px;
      line-height: 34px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .line-divide {
    margin: 16px 0;
    height: 1px;
    width: 100%;
  }
  .main {
    display: flex;
    flex: 1;
    overflow: auto;
    position: relative;
    position: relative;
    .left {
      overflow: auto;
      display: flex;
      flex-direction: column;
      height: calc(100%);
      width: calc(33.3% - 20px);
      // min-width: 340px;
      margin-right: 16px;
      transition: all 0.3s ease;
      overflow: auto;
    }
    .right {
      flex: 1;
      overflow: hidden;
      transition: all 0.3s ease;
      //padding-right: 5px;    //是否给滚动条留空
      &:hover {
        overflow-y: overlay;
      }
    }
  }

  //大屏幕
  @media screen and (min-width: $screen-lg-px) {
    .btn-static-switch {
      display: none;
      &.screen {
        display: block;
      }
    }
    .right {
      &.screen {
        display: none;
        flex: 1;
        margin-left: 0 !important; //全屏模式下清除掉左右两边
      }
      &.ShowStaticDiv {
        display: block;
      }
    }
    .left {
      &.screen {
        flex: 1;
        margin-right: 0 !important; //全屏模式下清除掉左右两边
      }
      &.ShowStaticDiv {
        display: none !important;
      }
    }
  }
  //小屏幕,各种样式变化
  @media screen and (max-width: $screen-lg-px) {
    .right {
      margin-left: 0px;
      display: none;
      flex: 1;
      &.ShowStaticDiv {
        display: block;
      }
    }
    .left {
      flex: 1;
      margin-right: 0px !important;
      &.ShowStaticDiv {
        display: none !important;
      }
    }
  }
  @media screen and (max-width: 768px) {
    .gridlayout {
      overflow-y: overlay;
    }
  }
}

.gridlayout {
  overflow: hidden;
  padding-right: 5px; //给滚动条留空
  display: flex;
  flex-direction: column;
  flex: 1;
  &:hover {
    overflow-y: overlay;
  }
  .gridlayoutgroup {
    margin: 4px 0;
    //滚动条不超出
    &:first-child {
      margin: 0 0 4px 0;
    }
    &:last-child {
      margin: 4px 0 0 0;
    }
    .collapse__header {
      // border-top: 1px solid $border-color-base;
      background: transparent;
      height: 40px;
      line-height: 40px;
      padding: 0px;
      position: relative;
      font-size: 16px;
      width: 100%;
      cursor: pointer;
      display: flex;
      &:first-child {
        border-top: none;
      }
      .arrow {
        width: 16px;
        text-align: center;
        margin: 0 10px;
        transition: transform 0.2s;
        &.rotate90 {
          transform: rotate(90deg);
        }
      }
      .right_badge {
        position: absolute;
        top: 50%;
        margin-top: -10px;
        right: 10px;
      }
    }
  }
  .gridlayouthead {
    padding: 10px;
    //flex: 1;
    // background: $bg-active;
    // color: #fff;
    .gridlayoutname {
      font-size: large;
    }
  }
  .gridlayoutbody {
    flex: 1;
    overflow: auto;
  }
  .gridlayoutrow {
    padding: 10px;
    cursor: pointer;
    position: relative;
    &::after {
      display: block;
      content: "";
      /* height: 1px; */
      position: absolute;
      bottom: 0;
      right: 0;
      left: 0;
      border-bottom: 1px solid;
    }
    //最后一个item去掉底边
    &:last-of-type {
      &::after {
        display: none;
      }
    }
    //每行得垃圾桶
    .delete {
      position: absolute;
      right: 10px; //修改垃圾桶左右位置
      cursor: pointer;
    }

    .gridlayoutdo {
      float: right;
    }
  }
}
</style>



