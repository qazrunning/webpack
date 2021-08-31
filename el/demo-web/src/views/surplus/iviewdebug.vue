
<template>
  <div class="fx__module" style="display:flex;flex-direction:column;height:calc(100%);overflow: auto;">
    <div>
      <Button type="primary" @click="testfoldOnOff()">切换展开</Button>
    </div>
    <fx-grid class="" style="flex:1;overflow:scroll;" :Opts="gridOpts" ref="grid1">
      <template v-slot:groups="{groups}">
        <div class="fx__group" v-for="(group,index) in groups" :key="index" style="margin:10px 0">
          <div class="fx__group_head" style="user-select:none" @click="onclick(group,$event)" :class="{'fx__group_head-open':group.isfold}">
            <i class="fa fa-angle-right" style="padding:10px;" v-bind:class="{rotate90:group.isfold}"></i>
            <span class="groupname">{{group.groupText}}</span>
          </div>
          <div style="overflow:auto;padding:15px" v-if="group.isfold" class="">
            <p v-for="(item, subindex) in group.children" :key="subindex">
              <component :is="item.RowData.component"></component>
            </p>
          </div>
        </div>
      </template>

    </fx-grid>
  </div>
</template>

<script>
import testButton from "./iviewtest/testButton";
import testButton1 from "./iviewtest/testButton1";
import testLoading from "./iviewtest/testLoading";
import testSwitch from "./iviewtest/testSwitch";
import testCard from "./iviewtest/testCard";
import testCollapse from "./iviewtest/testCollapse";
import testSplit from "./iviewtest/testSplit";
import testCell from "./iviewtest/testCell";
import testTable from "./iviewtest/testTable";
import testTab from "./iviewtest/testTab";
import testPage from "./iviewtest/testPage";
import testDropdown from "./iviewtest/testDropdown";
import testMenu from "./iviewtest/testMenu";
import testAnchor from "./iviewtest/testAnchor";
import testInput from "./iviewtest/testInput";
import testRadio from "./iviewtest/testRadio";
import testSlider from "./iviewtest/testSlider";
import testSteps from "./iviewtest/testSteps";
import testSelect from "./iviewtest/testSelect";
import testMessage from "./iviewtest/testMessage";
import testDatePicker from "./iviewtest/testDatePicker";
import testTag from "./iviewtest/testTag";
import testNotice from "./iviewtest/testNotice";
import testTimePicker from "./iviewtest/testTimePicker";
import testCascader from "./iviewtest/testCascader";
import testTransfer from "./iviewtest/testTransfer";
import testRate from "./iviewtest/testRate";
import testColorPicker from "./iviewtest/testColorPicker";
import testForm from "./iviewtest/testForm";
import testAlert from "./iviewtest/testAlert";
import testModal from "./iviewtest/testModal";
import testDrawer from "./iviewtest/testDrawer";
import testTree from "./iviewtest/testTree";
import testTooltip from "./iviewtest/testTooltip";
import testProgress from "./iviewtest/testProgress";
import testAvatar from "./iviewtest/testAvatar";
import testCarousel from "./iviewtest/testCarousel";
import testTimeline from "./iviewtest/testTimeline";
import testCircle from "./iviewtest/testCircle";
import testSpin from "./iviewtest/testSpin";
import testScroll from "./iviewtest/testScroll";
export default {
  components: {
    testButton,
    testButton1,
    testLoading,
    testSwitch,
    testCard,
    testCollapse,
    testSplit,
    testCell,
    testTable,
    testTab,
    testPage,
    testDropdown,
    testMenu,
    testAnchor,
    testInput,
    testRadio,
    testSlider,
    testSteps,
    testSelect,
    testMessage,
    testDatePicker,
    testTag,
    testNotice,
    testTimePicker,
    testCascader,
    testTransfer,
    testRate,
    testColorPicker,
    testForm,
    testAlert,
    testModal,
    testDrawer,
    testTree,
    testTooltip,
    testProgress,
    testAvatar,
    testCarousel,
    testTimeline,
    testCircle,
    testSpin,
    testScroll
  },
  data() {
    return {
      gridOpts: {
        groupRule: { field: "type" }, //默认分组规则,必写
        keyFields: [],
        keyword: "", //默认关键字,带监听连动
        dataSoucre: [], //数据源,带监听连动
        orderRule: {}, //默认排序规则
        filterRuleFnArr: [], //过滤规则函数数组,这里面是一个一个函数
        filterFnEx: null //行过滤扩展函数用法是传入一个带参数函数,参数将被传入行数据Object
      }
    };
  },
  mounted() {
    var self = this;
    let filter1 = this.$refs.filter1;
    this.$nextTick(() => {
      self.gridOpts.dataSoucre = [
        {
          type: "按钮类型",
          component: "testButton"
        },
        {
          type: "组合按钮",
          component: "testButton1"
        },
        {
          type: "加载中状态",
          component: "testLoading"
        },
        {
          type: "switch",
          component: "testSwitch"
        },
        {
          type: "Card 卡片",
          component: "testCard"
        },
        {
          type: "折叠面板",
          component: "testCollapse"
        },
        {
          type: "分割线",
          component: "testSplit"
        },
        {
          type: "标题位置",
          component: "testCell"
        },
        {
          type: "table",
          component: "testTable"
        },
        {
          type: "Tabs标签页",
          component: "testTab"
        },
        {
          type: "分页",
          component: "testPage"
        },
        {
          type: "下拉菜单",
          component: "testDropdown"
        },
        {
          type: "下拉菜单",
          component: "testMenu"
        },
        {
          type: "锚点",
          component: "testAnchor"
        },
        {
          type: "Input",
          component: "testInput"
        },
        {
          type: "Radio",
          component: "testRadio"
        },
        {
          type: "Slider",
          component: "testSlider"
        },
        {
          type: "Steps",
          component: "testSteps"
        },
        {
          type: "Select",
          component: "testSelect"
        },
        {
          type: "全局提示,时间选择",
          component: "testMessage"
        },
        {
          type: "全局提示,时间选择",
          component: "testDatePicker"
        },
        {
          type: "Tag",
          component: "testTag"
        },
        {
          type: "Notice",
          component: "testNotice"
        },
        {
          type: "时间",
          component: "testTimePicker"
        },
        {
          type: "Cascader级联",
          component: "testCascader"
        },
        {
          type: "Transfer",
          component: "testTransfer"
        },
        {
          type: "Rate",
          component: "testRate"
        },
        {
          type: "ColorPicker",
          component: "testColorPicker"
        },
        {
          type: "Form",
          component: "testForm"
        },
        {
          type: "Alert",
          component: "testAlert"
        },
        {
          type: "Modal",
          component: "testModal"
        },
        {
          type: "Drawer",
          component: "testDrawer"
        },
        {
          type: "Tree",
          component: "testTree"
        },
        {
          type: "Tooltip",
          component: "testTooltip"
        },
        {
          type: "Progress",
          component: "testProgress"
        },
        {
          type: "Avatar",
          component: "testAvatar"
        },
        {
          type: "Carousel",
          component: "testCarousel"
        },
        {
          type: "Timeline",
          component: "testTimeline"
        },
        {
          type: "Circle",
          component: "testCircle"
        },
        {
          type: "Spin",
          component: "testSpin"
        },
        {
          type: "Scroll",
          component: "testScroll"
        }
      ];
    });
  },
  methods: {
    onclick(item, e) {
      item.isfold = !item.isfold;
    },
    testfoldOnOff() {
      let grid1 = this.$refs.grid1;
      grid1.groups.forEach(element => {
        element.isfold = !element.isfold;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.rotate90 {
  transition: All 0.4s ease-in-out;
  transform: rotate(90deg);
}


</style>
