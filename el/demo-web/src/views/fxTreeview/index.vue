<template>
  <!-- :TreeJSON='false'  是否显示树形JSON-->
  <div  style="height:100%">
    <div style="padding:16px 0 ">
    <Button type='primary' size="small"  @click="test2">获取勾选节点</Button>
    </div>
    <div style="height:calc(100% - 56px)">
     <fx-treeview class="fx__tree" ref="fx__treeview" @checkChange="test" :OnlyKey='true' :Multiple="true" :TreeOpt="opt" v-model="menus"></fx-treeview>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      menus: [
        {
          text: "门户",
          name: "app-hjdemo",
        },
        {
          text: "菜单",
          name: "core-phoneModulesNav",
          children: [
            {
              text: "Demo",
              name: "app-demo",
              children: [
                {
                  text: "UI组件合集",
                  name: "app-iviewdebug",
                },
                {
                  text: "只读表单样式",
                  name: "app-formDetail",
                },
              ],
            },
            {
              text: "功能集合1",
              name: "app-modules",
              children: [
                {
                  text: "fx-grid实验",
                  name: "app-gridtest",
                },
                {
                  text: "三列表单",
                  name: "app-threeColumn",
                },
                {
                  text: "实时通信",
                  name: "app-socketio",
                  svg: "application",
                },
              ],
            },
          ],
        },
        {
          text: "我的",
          name: "app-pad-userinfo",
          icon: "fa fa-navicon fa-lg",
        },
      ],
      opt: {
        prop_alias: {
          field: "text",
          title: "菜单名称",
        },
        prop_primay: {
          field: "name",
          title: "菜单路由",
        },
        prop_extra: {
          iconbg: {
            default: "linear-gradient(to right, #FEA21E , #FC9107)",
            title: "背景颜色",
          },
          icon: {
            default: "fa fa-navicon fa-lg",
            title: "图标",
          },
          svg: {
            default: "user",
            title: "svg",
          },
          test: {
            default: "test",
            title: "测试项",
          },
          test2: {
            default: "test2",
            title: "测试项2",
          },
        },
      },
    };
  },
  methods: {
    test(a, b) {
        this.$Message.success(`改变节点：${b.title}(${b.RoleKey})选中状态`);
    },
    test2() {
      let arr = this.$refs.fx__treeview.GetCheck()
      let str = ''
      arr.forEach(e=>{
          str += `<p>${e.title}(${e.RoleKey})</p>`
      })
      this.$Modal.confirm({
                    title: '所选树节点',
                    content: str,
                    onOk: () => {
                        this.$Message.info('Clicked ok');
                    },
                    onCancel: () => {
                        this.$Message.info('Clicked cancel');
                    }
      });
  
    },
  },
  watch: {
    menus: function(newVal, oldVal) {
      console.log(newVal);
    },
  },
};
</script>
