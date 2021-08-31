<template>
  <div class="content">
    <!-- <fx-track>
      <template>
        状态:研发中
        作者:张思欣
        功能描述:显示表单信息
      </template>
    </fx-track> -->
    <!-- <div class="top fx__box">
      <div class="fx__line_divide" style="margin-bottom:16px;"></div>

      <Steps>
        <Step title="步骤1"></Step>
        <Step title="步骤2"></Step>
        <Step title="步骤3"></Step>
        <Step title="步骤4"></Step>
      </Steps>
    </div> -->
    <div class="main">
      <div class="container">
        <Alert closable>iview组件：form表单+card卡片+栅格系统。1.表单单元格行高32px，一行的行下外间距20px，第一个卡片的上外间距为0，其余为20px。2.表单域标签右对齐，宽度根据实际自行设置。3.提交按钮定在底部不移动</Alert>
        <detail></detail>
      </div>
    </div>
    <div class="submit bottom">
      <!-- <Button type="primary" disabled icon="md-arrow-back">上一步</Button>
      <Button type="primary" icon="md-arrow-forward" style="margin-left:20px">下一步</Button> -->
      <Button type="primary">提交</Button>
    </div>
  </div>
</template>
<script>
import detail from "./threeColumnDetail";
export default {
  data() {
    return {
      value1: "",
      isPc: this.$app.helper.screen.isPC, //判断是pc还是手机
      cityList: [
        {
          value: "New York",
          label: "New York"
        },
        {
          value: "London",
          label: "London"
        },
        {
          value: "Sydney",
          label: "Sydney"
        },
        {
          value: "Ottawa",
          label: "Ottawa"
        },
        {
          value: "Paris",
          label: "Paris"
        },
        {
          value: "Canberra",
          label: "Canberra"
        }
      ], //假数据
      social: ["facebook", "github"],
      checkboxs: [], //假数据
      //上传
      defaultList: [
        {
          name: "a42bdcc1178e62b4694c830f028db5c0",
          url:
            "https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar"
        },
        {
          name: "bc7521e033abdd1e92222d733590f104",
          url:
            "https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar"
        }
      ],
      imgName: "",
      visible: false,
      uploadList: []
    };
  },
  components: {
    detail
  },
  methods: {
    handleView(name) {
      this.imgName = name;
      this.visible = true;
    },
    handleRemove(file) {
      // const fileList = this.$refs.upload.fileList;
      // this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
    },
    handleSuccess(res, file) {
      file.url =
        "https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar";
      file.name = "7eb99afb9d5f317c912f08b5212fd69a";
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "The file format is incorrect",
        desc:
          "File format of " +
          file.name +
          " is incorrect, please select jpg or png."
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "Exceeding file size limit",
        desc: "File  " + file.name + " is too large, no more than 2M."
      });
    },
    handleBeforeUpload() {
      const check = this.uploadList.length < 5;
      if (!check) {
        this.$Notice.warning({
          title: "Up to five pictures can be uploaded."
        });
      }
      return check;
    }
  },
  mounted() {
    // this.uploadList = this.$refs.upload.fileList;
  }
};
</script>
<style lang="scss">
.content {
  .ivu-steps-item.ivu-steps-status-process .ivu-steps-tail > i {
    background: #c5c8ce;
  }
  .ivu-steps-item.ivu-steps-status-wait .ivu-steps-tail > i {
    background: #c5c8ce;
  }
  .ivu-steps-item.ivu-steps-status-finish .ivu-steps-tail > i:after {
    background: #2d8cf0;
  }
}
</style>
<style lang="scss" scoped>
.content {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  .container {
    padding: 0 20px;
  }
  .top,
  .bottom {
    position: relative;
    z-index: 1;
  }
  .top {
    // text-align: center;
    padding: 10px 30px !important;
  }
  .main {
    padding: 16px 0;
    // height: calc(100% - 58px - 64px - 16px);
    overflow-y: scroll;
    position: relative;
    flex: 1;
  }
  //提交
  .bottom {
    text-align: right;
    padding: 10px 25px 10px 20px;
  }
}

// 上传
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>