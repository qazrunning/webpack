
<template>
  <div class="fx__box" style="margin:16px">
    <div style="padding:10px">
      <span>当前数量:{{myCount}}</span>
      <Button type="primary" @click="testAdd()" style="margin-left:10px;">测试Add</Button>
      <Button type="primary" @click="testUpdate()" style="margin-left:10px;">测试Update</Button>
      <Button type="primary" @click="testfoldOnOff()" style="margin-left:10px;">切换展开</Button>
    </div>

    <fx-filter style="border:1px green solid;margin-bottom:10px;padding:10px;" :opts="filterOpts" @on-filter="onFilter" @on-keyword="onSearch" ref="filter1" :style-keyword="{width:'200px'}">
      <template v-slot:left>
        <!-- 选择排序组件 -->
        <fx-setgroup style="width:150px;margin-left:5px" :Opts="groupOpts" @on-set="onGroup"></fx-setgroup>
        <!-- 选择组内顺序组件 -->
        <fx-setsort style="width:150px;margin-left:5px;margin-right:5px" :Opts="sortOpts" @on-set="onSort"></fx-setsort>
      </template>
    </fx-filter>

    <fx-grid style="border:1px red solid;margin-bottom:10px;max-height:742px;overflow: scroll;" class="fx-grid-overflow" :Opts="gridOpts" @on-update="onUpdate" ref="grid1">
      <template v-slot:groups="{groups}">
        <div class="fx__group" v-for="(group,index) in groups" :key="index" style="margin:10px 0">
          <div class="fx__group_head" style="font-size:1rem;user-select:none;display:flex;align-items:center;" @click="onclick(group,$event)" :class="{'fx__group_head-open':group.isfold}">
            <span class="arrow" v-bind:class="{rotate90:group.isfold}">
              <i class="fa fa-angle-right"></i>
            </span>
            <span class="groupname">{{group.groupText}}</span>
            <Badge :count="group.children.length" style="margin:13px"></Badge>
            {{group.topindex}}
          </div>
          <div style="overflow:auto;/*padding:10px;子内容*/" v-if="group.isfold">
            <div class="gridlayoutbody" @scroll="scroll($event,index)" :style="{height:'auto'}">
              <div class="gridlayoutchild" :style="{top:group.topindex*itemhight+'px',position:'relative',width:'100%',height:'auto'}">
                <p v-for="(item, subindex) in group.children.slice(group.topindex, group.topindex+ (bodyhight/itemhight+2))" :key="subindex" class="gridlayoutrow fx__item">
                  <Row type="flex">
                    <i-col span="24">
                      原行:{{item.RowIndex}}
                      <span>索引{{index}}:{{Object.values(item.RowData).join(",")}}</span>
                    </i-col>
                    <i-col class="fx__opera gridlayoutdo">
                      <span class="delete fx__item_ico" @click="testDelete(item.RowData,item.RowIndex)">
                        <i class="fa fa-trash-o"></i>
                      </span>
                    </i-col>
                  </Row>
                </p>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-slot:table="{table}">
        <div class="gridlayoutbody" @scroll="scroll2($event)" :style="{height:'auto'}">
          <!-- <div :style="{ height:startIndex*41+'px' }"> -->
          <!-- <div :style="{height:this.dataSoucre.length*40+'px'}"></div> -->
          <div class="gridlayoutchild" :style="{top:startIndex*itemhight+'px',position:'relative',width:'100%'}">
            <p v-for="(item, index) in table.slice(0+startIndex, startIndex + (bodyhight/itemhight+2))" :key="index" class="gridlayoutrow fx__item">
              <Row type="flex">
                <i-col span="24">
                  原行:{{item.RowIndex}}
                  <span>索引{{index}}:{{Object.values(item.RowData).join(",")}}</span>
                </i-col>
                <i-col class="fx__opera gridlayoutdo">
                  <span class="delete fx__item_ico" @click="testDelete(item.RowData,item.RowIndex)">
                    <i class="fa fa-trash-o"></i>
                  </span>
                </i-col>
              </Row>
            </p>
          </div>
        </div>
      </template>
    </fx-grid>
  </div>
</template>

<script>
import { log } from "util";

// import fxgrid from "../components/fx-grid";
// import fxfilter from "../components/fx-filter";
// import fxsetgroup from "../components/fx-setgroup";
// import fxsetsort from "../components/fx-setsort";

export default {
  // components: {
  //   "fx-grid": fxgrid,
  //   "fx-filter": fxfilter,
  //   "fx-setgroup": fxsetgroup,
  //   "fx-setsort": fxsetsort
  // },

  type:"float",
  data() {

    return {
      
      bodyhight: 600, //容器的高度+200
      itemhight: 38, //循环的item的高度
      startIndex: 0,
      myCount: 0,
      gridOpts: {
        extra: {
          topindex: 0
        },
        groupRule: {}, //默认分组规则,必写
        keyFields: ["username", "phone"],
        keyword: "", //默认关键字,带监听连动
        dataSoucre: [], //数据源,带监听连动
        orderRule: {}, //默认排序规则
        filterRuleFnArr: [], //过滤规则函数数组,这里面是一个一个函数
        filterFnEx: null //行过滤扩展函数用法是传入一个带参数函数,参数将被传入行数据Object
      },
      groupOpts: {
        selectIndex: undefined,
        items: [
          //分组配置
          { field: "type", text: "按政治面貌分组" },
          { field: "", text: "不分组" },
          {
            field: "department",
            text: "按部门分组+简易组排序",
            //简易模式的组排序
            orderArr: ["开发部", "市场部", "外贸部", "项目部"]
          },
          {
            text: "扩展分组+组排序",
            field: "ageextend",
            //扩展分组方式
            groupFn: function(row) {
              if (row.age >= 90) return "90岁以上";
              else if (row.age < 90 && row.age > 10) return "成年人";
              else return "10岁以下";
            },
            //扩展组排序
            compareFn: function(group1, group2) {
              //这就是一个典型的自定义组之间的排序
              return (group1.children.length - group2.children.length) * -1;
            }
          }
        ]
      },
      sortOpts: {
        selectIndex: undefined,
        items: [
          //组内排序配置
          { field: "", text: "不排序" },
          { field: "age", type: Number, text: "按年龄正序" },
          { field: "age", type: Number, text: "按年龄倒序", desc: true },
          { field: "username", type: String, text: "按姓名排序", desc: true },
          {
            text: "扩展排序(电话号码)",
            compareFn: function(row1, row2) {
              return row1.phone - row2.phone;
            }
          }
        ]
      },
      // arr.map(p=>retrun { text:p.text,filterFn:row=>row.co==p.id })
      //type：有几种 tag,number,date
      filterOpts: [
        {
          title: "部门",
          type: "tag",
          field: "department",
          items: [
            { text: "项目部" },
            { text: "市场部" },
            { text: "其他部门", isother: true }
          ]
        },
        {
          title: "部门",
          type: "autocomplete",
          val: "",
          field: "department",
          texts: ["项目部", "市场部"]
        },
        {
          title: "年龄",
          type: "tag",
          field: "age",
          items: [
            {
              text: "大于60岁",
              filterFn: row => row.age >= 60
            },
            {
              text: "小于10岁",
              filterFn: row => row.age < 10
            },
            {
              text: "其他岁",
              isother: true
            }
          ]
        },
        {
          title: "年龄区间",
          type: "number",
          field: "age"
        },
        {
          title: "入职时间",
          type: "date",
          field: "hiredate"
        }
      ]
    };
  },
  created() {},

  mounted() {
    var self = this;
    let filter1 = this.$refs.filter1;
    this.$nextTick(() => {
      setTimeout(function() {
        // 有默认值可以打开这里Demo
        // filter1.keyword = "李";
        // self.filterOpts[0].items.push({ text: "外贸部", selected: true });
        // self.groupOpts.selectIndex = 1;
        // self.sortOpts.selectIndex = 1;

        let mockarr = [
          {
            department: "外贸部",
            type: "党员",
            username: "Mike",
            phone: 1588025447,
            hiredate: "2019-01-01",
            age: 4
          },
          {
            department: "市场部",
            type: "党员",
            username: "张三",
            phone: 1348025447,
            hiredate: "2019-02-01",
            age: 13
          },
          {
            department: "外贸部",
            type: "党员",
            username: "李三",
            phone: 2248025447,
            hiredate: "2019-03-01",
            age: 2
          },
          {
            department: "市场部",
            type: "团员",
            username: "李四",
            phone: 1188025447,
            hiredate: "2019-04-01",
            age: 100
          },
          {
            department: "项目部",
            type: "团员",
            username: "艾玛",
            phone: 1778025447,
            hiredate: "2019-05-01",
            age: 8
          },
          {
            department: "开发部",
            type: "团员",
            username: "马六",
            phone: 17780254447,
            hiredate: "2019-06-01",
            age: 22
          },
          {
            department: "宣传部",
            type: "团员",
            username: "老K",
            phone: 36987411,
            hiredate: "2019-07-01",
            age: 7
          }
        ];

        for (var i = 0; i < 2000; i++) {
          mockarr.push({
            department: "外贸部",
            type: "党员",
            username: "Mike",
            phone: 1588025447,
            hiredate: "2019-01-01",
            age: 4 + i
          });
        }

        self.gridOpts.dataSoucre = mockarr;
      }, 0);
    });
  },
  methods: {
    onclick(item, event) {
      item.topindex = 0;
      item.isfold = !item.isfold;
    },
    onGroup(index, { field, orderArr, groupFn, compareFn }) {
      // console.log("onGroup");
      this.gridOpts.groupRule = { field, orderArr, groupFn, compareFn }; //执行分组规则
      //Demo
      // if (field == "type") {
      //   //这里是连动写法
      //   //如果是按政治面貌排序
      //   this.sortOpts.selectIndex = 2;
      // } else this.sortOpts.selectIndex = 0;
    },
    onSearch(val) {
      this.gridOpts.keyword = val; //去掉首尾空格
    },
    onSort(index, { field, type, desc, compareFn }) {
      // console.log("onSort");
      this.gridOpts.orderRule = { field, type, desc, compareFn }; //执行组内排序规则
    },
    onUpdate({ filterlist, groups, table }) {
      this.myCount = filterlist.length;
      //groups.forEach(p => (p.topindex = 11));
    },
    onFilter(AllConditions) {
      this.gridOpts.filterRuleFnArr = AllConditions;
    },
    testDelete(rowdata, rowindex) {
      //Demo下面使用索引来删除数据,最合理是通过业务上的组件
      //对数据源本身删除
      this.gridOpts.dataSoucre.splice(rowindex, 1);
    },
    testDeleteGroup(rowdatas) {
      var names = rowdatas.map(k => k.username);
      //对数据源本身删除
      this.gridOpts.dataSoucre.RemoveAll(function(ent) {
        return names.includes(ent.username);
      });
    },
    testLookGroup(rowdatas) {
      alert(JSON.stringify(rowdatas));
    },
    testAdd() {
      this.gridOpts.dataSoucre.push({
        department: "外贸部",
        type: "党员",
        username: "NEW小明",
        phone: 1588025447,
        age: 99
      });
    },
    testUpdate() {
      this.gridOpts.dataSoucre[this.gridOpts.dataSoucre.length - 1].age = 100;
    },
    testfoldOnOff() {
      let grid1 = this.$refs.grid1;
      grid1.groups.forEach(element => {
        element.isfold = !element.isfold;
      });
    },
    testFilterEX() {
      this.gridOpts.filterFnEx = function(rowdata) {
        return rowdata.age > 50 && rowdata.a;
      };
    },
    delChat({ ChatID }) {
      let _this = this;
      _this.$curl.post("/api/demo/workflowtest/del", { ChatID }).then(res => {
        _this.getlist();
      });
    },
    scroll(event, index) {
      // 根据滚动的距离，估算出这个滚动位置对应的数组序列，例如滚动100px，每条40px，对应第3条
      let grid1 = this.$refs.grid1;
      let scrollTop = event.target.scrollTop;
      grid1.groups[index].topindex = Math.floor(scrollTop / 38);
    },
    scroll2(event) {
      // 根据滚动的距离，估算出这个滚动位置对应的数组序列，例如滚动100px，每条40px，对应第3条
      let scrollTop = event.target.scrollTop;
      this.startIndex = Math.floor(scrollTop / 38);
      console.log(this.startIndex);
    }
  }
};
</script>

<style lang="scss" scoped>
.d-flex {
  display: flex !important;
}
.fx-grid-overflow::-webkit-scrollbar {
  width: 0px !important;
}
.flex-column {
  -ms-flex-direction: column !important;
  -webkit-box-orient: vertical !important;
  -webkit-box-direction: normal !important;
  flex-direction: column !important;
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
.gridlayoutbody {
  max-height: 200px;
  flex: 1;
  overflow: scroll;
  position: relative;
}
// 改变表单滚动条样式
// .gridlayoutbody::-webkit-scrollbar{
//   width: 2px !important;

// }

.gridlayoutrow {
  padding: 10px;
  position: relative;
  &::after {
    display: block;
    content: "";
    height: 1px;
    // background: #464f5b;
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
  }
  //最后一个item去掉底边
  &:last-of-type {
    &::after {
      display: none;
    }
  }

  .chat__name {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }

  //每行得垃圾桶
  .delete {
    position: absolute;
    right: 10px; //修改垃圾桶左右位置
  }

  .gridlayoutdo {
    float: right;
  }
}
</style>
