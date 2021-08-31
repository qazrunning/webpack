<template>
  <div class="tabconfig">
    <!-- <div v-for="(item, index) in tabInfo" :key="index" class="tabconfig-opt" draggable="true">
      <Checkbox v-model="item.isShow" border>{{item.tabName}}</Checkbox>
    </div> -->
    <draggable v-model="tabInfo" group="people" @start="drag=true" @end="drag=false">
      <div v-for="(item,index) in tabInfo" :key="index" class="tabconfig-Item">
        <!-- <input type="radio" value="true" />{{element.tabName}} -->
        <!-- <Radio v-model="item.isShow" class="radio">{{item.tabName}}</Radio> -->
        <Checkbox v-model="item.isChecked" class="checkbox">{{item.tabName}}</Checkbox>
      </div>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
export default {
  name: 'TabConfig',
  props: {
    userTabConfig: {
      type: Array
    }
  },
  components: {
    draggable
  },
  data () {
    return {
      tabInfo: [
        { tabKey: 'summanyTab', tabName: '摘要信息', isChecked: false },
        { tabKey: 'reportTab', tabName: '检测报告', isChecked: false },
        { tabKey: 'vehicleTab', tabName: '车辆信息', isChecked: false },
        { tabKey: 'mainInfoTab', tabName: '关键信息更改记录', isChecked: false },
        { tabKey: 'dataView', tabName: '资料查看', isChecked: false },
      ],
      drag: false
    }
  },
  mounted() {

  },
  watch: {
    userTabConfig: {
      handler: function (data) {
        this.tabInfo = JSON.parse(JSON.stringify(data));
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    saveUserConfig () {
      const _this = this;
      if(!(JSON.stringify(this.tabInfo) === JSON.stringify(this.userTabConfig))) {
        this.$curl
          .post("api/hj/changeUserTabConfig", { params: this.tabInfo })
          .then((res) => {
            const { code, msg } = res;
            if (code) {
              _this.$emit('configUpdate');
              _this.$Message.success("修改显示菜单栏成功！");
            } else {
              _this.$Message.error("修改显示菜单栏失败！");
            }
          });

      } else {
        // console.log('未更改配置');
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tabconfig {
  // width: 100%;
  margin: 16px;

  &-Item {
    border: 1px solid #dcdee2;
    margin-top: 8px;
    &:first-child {
      margin-top: 0;
    }
    .checkbox {
      width: 100%;
      padding: 6px;
    }
  }
}
</style>
