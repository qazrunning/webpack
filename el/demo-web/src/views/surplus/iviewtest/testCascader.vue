<template>
  <div>
    <Cascader :data="data" v-model="value1"></Cascader>
    <br />
    <br />
    <Cascader :data="data" v-model="value2"></Cascader>
    <br />
    <br />
    <Cascader :data="data" trigger="hover"></Cascader>
    <br />
    <br />
    <Cascader :data="data2" disabled></Cascader>
    <br />
    <Cascader :data="data2"></Cascader>
    <br />

    <Cascader :data="data4" :load-data="loadData"></Cascader>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value1: [],
      data: [
        {
          value: "beijing",
          label: "北京",
          children: [
            {
              value: "gugong",
              label: "故宫"
            },
            {
              value: "tiantan",
              label: "天坛"
            },
            {
              value: "wangfujing",
              label: "王府井"
            }
          ]
        },
        {
          value: "jiangsu",
          label: "江苏",
          children: [
            {
              value: "nanjing",
              label: "南京",
              children: [
                {
                  value: "fuzimiao",
                  label: "夫子庙"
                }
              ]
            },
            {
              value: "suzhou",
              label: "苏州",
              children: [
                {
                  value: "zhuozhengyuan",
                  label: "拙政园"
                },
                {
                  value: "shizilin",
                  label: "狮子林"
                }
              ]
            }
          ]
        }
      ],
      value2: ["jiangsu", "suzhou", "zhuozhengyuan"],
      data: [
        {
          value: "beijing",
          label: "北京",
          children: [
            {
              value: "gugong",
              label: "故宫"
            },
            {
              value: "tiantan",
              label: "天坛"
            },
            {
              value: "wangfujing",
              label: "王府井"
            }
          ]
        },
        {
          value: "jiangsu",
          label: "江苏",
          children: [
            {
              value: "nanjing",
              label: "南京",
              children: [
                {
                  value: "fuzimiao",
                  label: "夫子庙"
                }
              ]
            },
            {
              value: "suzhou",
              label: "苏州",
              children: [
                {
                  value: "zhuozhengyuan",
                  label: "拙政园"
                },
                {
                  value: "shizilin",
                  label: "狮子林"
                }
              ]
            }
          ]
        }
      ],
      data2: [
        {
          value: "zhejiang",
          label: "浙江",
          children: [
            {
              value: "hangzhou",
              label: "杭州",
              children: [
                {
                  value: "xihu",
                  label: "西湖"
                }
              ]
            }
          ]
        },
        {
          value: "jiangsu",
          label: "江苏",
          disabled: true,
          children: [
            {
              value: "nanjing",
              label: "南京",
              children: [
                {
                  value: "zhonghuamen",
                  label: "中华门"
                }
              ]
            }
          ]
        }
      ],
      data4: [
        {
          value: "beijing",
          label: "北京",
          children: [],
          loading: false
        },
        {
          value: "hangzhou",
          label: "杭州",
          children: [],
          loading: false
        }
      ]
    };
  },
  methods: {
    loadData(item, callback) {
      item.loading = true;
      setTimeout(() => {
        if (item.value === "beijing") {
          item.children = [
            {
              value: "talkingdata",
              label: "TalkingData"
            },
            {
              value: "baidu",
              label: "百度"
            },
            {
              value: "sina",
              label: "新浪"
            }
          ];
        } else if (item.value === "hangzhou") {
          item.children = [
            {
              value: "ali",
              label: "阿里巴巴"
            },
            {
              value: "163",
              label: "网易"
            }
          ];
        }
        item.loading = false;
        callback();
      }, 1000);
    }
  }
};
</script>
