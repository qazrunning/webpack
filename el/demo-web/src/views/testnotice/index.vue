<template>
  <fx-notify ref="notify" @msgs-change="msgchange" :moduleRule="ruleobj">
    <template v-slot:top>

      <div style="flex:1;border:1px solid red">
        <ButtonGroup style="margin-right:10px">
          <Button v-for="(item, index) in baseclassify.items" :key="index" v-on:click="clickbtn(item,index)" :type="baseclassify.selectindex==index?'primary':'default'">
            {{item.text}}
          </Button>
        </ButtonGroup>

        <button v-on:click="test1">模拟一个5s时效的消息</button>
        <button v-on:click="testdel">立即撤回刚刚模拟的5s时效的信息</button>
        <button v-on:click="test2">模拟一个3天时效的消息</button>

      </div>

    </template>
    <template v-slot:group="{group}" id="abc">
      <div>{{group.groupText}}【{{group.children.length}}】</div>
      <div style="display:flex;flex-direction:row;flex-wrap:wrap">
        <div v-for="(item, index2) in group.children" :key="index2" style="width:300px;padding:10px">
          <button v-on:click="testsetRead(item)">设置已读</button>
          <Input type="textarea" placeholder="" :value="JSON.stringify(item,null,2)" :rows="16" style="width:100%;height:100%" />

          <!-- 原行:{{item.RowIndex}}
          <span>索引{{index2}}:{{Object.values(item.RowData).join(",")}}</span> -->
        </div>
      </div>
    </template>
  </fx-notify>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      baseclassify: {
        selectindex: 0,
        items: []
      },
      ruleobj: {
        orderRule: {
          compareFn: function(row1, row2, group) {
            var level1 = (row1.MsgData && row1.MsgData.level) || 0;
            var level2 = (row2.MsgData && row2.MsgData.level) || 0;
            var time1 = moment(row1.MsgTime);
            var time2 = moment(row2.MsgTime);
            return level1 - level2 || time1.diff(time2) * -1;
          }
        },
        groupRule: {
          groupFn: function(row) {
            return moment(row.MsgTime, "YYYY-MM-DD HH:mm:ss").format(
              "YYYY年MM月DD日"
            );
          },
          compareFn: function(group1, group2) {
            var time1 = moment(
              group1.children[0].RowData.MsgTime,
              "YYYY-MM-DD"
            );
            var time2 = moment(
              group2.children[0].RowData.MsgTime,
              "YYYY-MM-DD"
            );
            return time1.diff(time2) * -1;
          }
        },
        filterRule: [
          {
            title: "消息MsgType",
            type: "tag",
            field: "MsgType",
            items: function(msgs, msgTypes) {
              var arr = [];
              msgTypes.forEach(function(element) {
                arr.push({ text: element });
              });
              return arr;
            }
          },
          {
            title: "消息时间",
            type: "tag",
            items: function(msgs, msgTypes) {
              let set = new Set();
              msgs.forEach(function(element) {
                set.add(moment(element.MsgTime).format("YYYY-MM-DD HH:mm"));
              });
              let timeArr = Array.from(set);
              var arr = [];
              timeArr.forEach(function(element) {
                arr.push({
                  text: element,
                  filterFn: (row, { key, text }) => {
                    return (
                      moment(row.MsgTime).format("YYYY-MM-DD HH:mm") === text
                    );
                  }
                });
              });
              return arr;
            }
          }
        ]
      }
    };
  },
  methods: {
    msgchange({ msgs, msgTypes }) {
      let _this = this;
      //去重找出所有频道
      var itemsArr = msgs.Distinct(
        function(p) {
          return p.Channel;
        },
        function(key, children) {
          return key;
        }
      );
      //
      var arr = [];
      //开始改变数据本身
      if (itemsArr.length > 0) {
        arr.push({ text: "全部", key: "*" });
        itemsArr.forEach(function(channel, index) {
          arr.push({
            text: channel,
            key: channel
          });
        });
      }
      let newbaseclassify = Object.assign({}, _this.baseclassify);
      newbaseclassify.items = arr;
      _this.$set(_this.$data, "baseclassify", newbaseclassify);
    },
    clickbtn(item, index) {
      let { baseclassify } = this;
      let { gridOpts } = this.$refs.notify;
      this.baseclassify.selectindex = index;
      if (item.key == "*") {
        gridOpts.filterFnEx["f1"] = null;
      } else {
        // debugger;
        gridOpts.filterFnEx["f1"] = function(rowdata) {
          return rowdata["Channel"] === item.key;
        };
      }
    },
    test1() {
      var axios = require("axios");
      var data = JSON.stringify({
        Channel: "demo-notice-pbtest3",
        MsgType: "镇龙FF检测站:co6",
        MsgAction: "replace",
        MsgTitle: "我是一个5秒的消息,随机数=" + Math.ceil(Math.random() * 100),
        MsgData: "我阿达25",
        timeout: 5
      });

      var config = {
        method: "post",
        url: "api/notify/testsend",
        headers: {
          "mock-login": "1",
          "mock-userid": "U000001",
          "Content-Type": "application/json"
        },
        data: data
      };
      axios(config)
        .then(function(response) {
          console.log(JSON.stringify(response.data));
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    test2() {
      var axios = require("axios");
      var data = JSON.stringify({
        Channel: "demo-notice-pbtest2",
        MsgType: "镇龙FF检测站:" + Math.ceil(Math.random() * 100),
        MsgAction: "replace",
        MsgTitle: "我是一个3天的消息" + Math.ceil(Math.random() * 100),
        MsgData: "我阿达25",
        timeout: 60 * 60 * 24 * 3
      });

      var config = {
        method: "post",
        url: "api/notify/testsend",
        headers: {
          "mock-login": "1",
          "mock-userid": "U000001",
          "Content-Type": "application/json"
        },
        data: data
      };
      axios(config)
        .then(function(response) {
          console.log(JSON.stringify(response.data));
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    testdel() {
      var axios = require("axios");
      var data = JSON.stringify({
        Channel: "demo-notice-pbtest3",
        MsgType: "镇龙FF检测站:co6"
      });

      var config = {
        method: "post",
        url: "api/notify/testcancel",
        headers: {
          "mock-login": "1",
          "mock-userid": "U000001",
          "Content-Type": "application/json"
        },
        data: data
      };
      axios(config)
        .then(function(response) {
          console.log(JSON.stringify(response.data));
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    testsetRead(item) {
      var axios = require("axios");
      var data = JSON.stringify({
        Channel: item.RowData.Channel,
        MsgID: item.RowData.MsgID
      });

      var config = {
        method: "post",
        url: "api/notify/testsetRead",
        headers: {
          "mock-login": "1",
          "mock-userid": "U000001",
          "Content-Type": "application/json"
        },
        data: data
      };
      axios(config)
        .then(function(response) {
          console.log(JSON.stringify(response.data));
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>
<style scoped>
.abc {
  color: red;
}
</style>