<template>
  <div class="content" ref="content">
    <div class="fx__box title_top">
      <p>
        1.请由上往下进行操作(每个步骤都可以更改选择项)：申请业务类别→选择车辆→上传方式（拍照上传必须先点击"开始预览"按钮，本地文件上传必须先点击"选择文件"按钮选择文件）；
      </p>
      <p>2.如果要使用拍照上传功能的必须先安装良田高拍仪驱动(点击即可下载)。</p>
      <p>
        3.每次上传请完整上传所需文件，尽量避免同一个业务的所有文件多次打开窗口上传或多次选择业务类别、车辆上传您没有安装flash,请点击下载安装flash！
      </p>
    </div>
    <!-- 内容 -->
    <div class="main">
      <!-- 左边 -->
      <div class="main_left fx__bgcolor">
        <Card style="margin:6px 16px 0px 16px;">
          <h2 style="margin-bottom:6px;">业务类别</h2>
          <Form :label-width="80" inline>
            <FormItem label="业务类别">
              <Select v-model="model1" style="width:150px">
                <Option
                  v-for="item in cityList"
                  :value="item.value"
                  :key="item.value"
                  >{{ item.label }}</Option
                >
              </Select>
            </FormItem>
            <FormItem label="文件组">
              <Select v-model="model1" style="width:150px">
                <Option
                  v-for="item in cityList"
                  :value="item.value"
                  :key="item.value"
                  >{{ item.label }}</Option
                >
              </Select>
            </FormItem>
          </Form>
        </Card>
        <Card style="margin:6px 16px 0px 16px;">
          <h2 style="margin-bottom:6px;">数据绑定</h2>
          <Button>选择车辆</Button>
        </Card>
        <Card style="margin:6px 16px 0px 16px;">
          <h2 style="margin-bottom:6px;">上传方式</h2>
          <RadioGroup>
            <Radio label="male">拍照上传</Radio>
            <Radio label="female">选择本地文件上传</Radio>
          </RadioGroup>
        </Card>
        <Card style="margin:6px 16px 0px 16px;">
          <h2 style="margin-bottom:6px;">图片设置</h2>
          <Form :label-width="80">
            <FormItem label="设备">
              <Select v-model="model1" style="width:100%">
                <Option
                  v-for="item in cityList"
                  :value="item.value"
                  :key="item.value"
                  >{{ item.label }}</Option
                >
              </Select>
            </FormItem>
            <FormItem label="分辨率">
              <Select v-model="model1" style="width:100%">
                <Option
                  v-for="item in cityList"
                  :value="item.value"
                  :key="item.value"
                  >{{ item.label }}</Option
                >
              </Select>
            </FormItem>
            <FormItem label="尺寸">
              <Select v-model="model1" style="width:100%">
                <Option
                  v-for="item in cityList"
                  :value="item.value"
                  :key="item.value"
                  >{{ item.label }}</Option
                >
              </Select>
            </FormItem>
          </Form>
        </Card>
        <Card style="margin:6px 16px 0px 16px;">
          <h2 style="margin-bottom:6px;">功能操作</h2>
          <Form inline>
            <FormItem>
              <Button>主头拍照</Button>
            </FormItem>
            <FormItem>
              <Button>合成拍照</Button>
            </FormItem>
            <FormItem>
              <Button>图片左转</Button>
            </FormItem>
            <FormItem>
              <Button>图片右转</Button>
            </FormItem>
            <FormItem>
              <Button>属性设置</Button>
            </FormItem>
            <FormItem>
              <Button>删除文件</Button>
            </FormItem>
            <FormItem>
              <Button>上传文件</Button>
            </FormItem>
            <FormItem>
                <Checkbox >自动上传</Checkbox>
            </FormItem>
          </Form>
        </Card>
      </div>
      <div class="main_right fx__bgcolor"></div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cityList: [
        {
          value: "New York",
          label: "New York",
        },
        {
          value: "London",
          label: "London",
        },
        {
          value: "Sydney",
          label: "Sydney",
        },
        {
          value: "Ottawa",
          label: "Ottawa",
        },
        {
          value: "Paris",
          label: "Paris",
        },
        {
          value: "Canberra",
          label: "Canberra",
        },
      ],
      model1: "",
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
$screen-lg-px: 1000px;
.content {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.title_top {
  color: red;
  margin: 6px;
}
.main {
  display: flex;
  flex: 1;
  overflow: auto;
  position: relative;

  .main_left {
    overflow: auto;
    display: flex;
    flex-direction: column;
    height: calc(100%);
    width: 30%;
    margin-right: 16px;
    transition: all 0.3s ease;
    overflow: hidden auto;
  }

  .main_right {
    flex: 1;
    overflow: hidden;
    transition: all 0.3s ease;
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

    .main_right {
      &.screen {
        display: none;
        flex: 1;
        margin-left: 0 !important; //全屏模式下清除掉左右两边
      }

      &.ShowStaticDiv {
        display: block;
      }
    }

    .main_left {
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
    .main_right {
      margin-left: 0px;
      display: none;
      flex: 1;

      &.ShowStaticDiv {
        display: block;
      }
    }

    .main_left {
      flex: 1;
      margin-right: 0px !important;

      &.ShowStaticDiv {
        display: none !important;
      }
    }
  }

</style>
