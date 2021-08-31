<template>
  <Form :label-width="isPc ? 120 : null" :label-position="isPc ? 'right' : 'top'">
    <Card>
      <p slot="title">
        单位信息
      </p>
      <div>
        <Row :gutter="16">
          <i-col :xs="24" :sm="8" :md="8" :lg="8">
            <FormItem label="单位名称：" label-for="input1">
              <i-input placeholder="" element-id="input1"></i-input>
            </FormItem>
          </i-col>
          <i-col :xs="24" :sm="8" :md="8" :lg="8">
            <FormItem label="单位性质：" label-for="input2">
              <i-input placeholder="" element-id="input2"></i-input>
            </FormItem>
          </i-col>
          <i-col :xs="24" :sm="8" :md="8" :lg="8">
            <FormItem label="单位地址：" label-for="input4">
              <i-input placeholder="" element-id="input4"></i-input>
            </FormItem>
          </i-col>
          <i-col :xs="24" :sm="8" :md="8" :lg="8">
            <FormItem label="成立日期：" label-for="input5">
              <DatePicker type="date" placeholder="请选择" style="width: 100%" element-id="input5"></DatePicker>
            </FormItem>
          </i-col>
          <i-col :xs="24" :sm="8" :md="8" :lg="8">
            <FormItem label="环境修复从业日期：" label-for="input6">
              <DatePicker type="date" placeholder="请选择" style="width: 100%" element-id="input6"></DatePicker>
            </FormItem>
          </i-col>
          <i-col :xs="24" :sm="8" :md="8" :lg="8">
            <FormItem label="选择单位类型：">
              <Select style="width:100%">
                <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </i-col>
        </Row>
      </div>
    </Card>
    <Card style="margin-top:20px;">
      <p slot="title">
        法人信息
      </p>
      <div>
        <Row :gutter="16">
          <i-col :xs="24" :sm="8" :md="8" :lg="8">
            <FormItem label="法人代表" label-for="input7">
              <i-input placeholder="" icon="ios-person-outline" element-id="input7"></i-input>
            </FormItem>
          </i-col>
          <i-col :xs="24" :sm="8" :md="8" :lg="8">
            <FormItem label="法人职务" label-for="input8">
              <i-input placeholder="" element-id="input8"></i-input>
            </FormItem>
          </i-col>
          <i-col :xs="24" :sm="8" :md="8" :lg="8">
            <FormItem label="法人电话" label-for="input9">
              <i-input placeholder="" element-id="input9" icon="ios-call-outline"></i-input>
            </FormItem>
          </i-col>
        </Row>
      </div>
    </Card>
    <Card style="margin-top:20px;">
      <p slot="title">
        负责人信息
      </p>
      <div>
        <Row :gutter="16">
          <i-col :xs="24" :sm="8" :md="8" :lg="8">
            <FormItem label="技术负责人" label-for="input3">
              <i-input placeholder="" element-id="input3" icon="ios-person"></i-input>
            </FormItem>
          </i-col>
          <i-col :xs="24" :sm="8" :md="8" :lg="8">
            <FormItem label="负责人职务" label-for="input10">
              <i-input placeholder="" element-id="input10"></i-input>
            </FormItem>
          </i-col>
          <i-col :xs="24" :sm="8" :md="8" :lg="8">
            <FormItem label="负责人电话" label-for="input11">
              <i-input placeholder="" element-id="input11" icon="ios-call"></i-input>
            </FormItem>
          </i-col>
        </Row>
      </div>
    </Card>
    <Card style="margin-top:20px;">
      <p slot="title">
        其他信息
      </p>
      <div>
        <Row :gutter="16">
          <i-col :xs="24" :sm="24" :md="24" :lg="24">
            <FormItem label="选择单位业务类型（可多选）">
              <CheckboxGroup v-model="checkboxs">
                <Checkbox label="监测检测类"></Checkbox>
                <Checkbox label="地块环境调查与风险评估类"></Checkbox>
                <Checkbox label="风险管控与修复方案编制类"></Checkbox>
                <Checkbox label="污染地块治理修复工程施工类"></Checkbox>
                <Checkbox label="污染地块治理修复工程环境监理类"></Checkbox>
                <Checkbox label="污染地块治理修复工程效果评估类"></Checkbox>
              </CheckboxGroup>
            </FormItem>
          </i-col>
          <i-col :xs="24" :sm="24" :md="24" :lg="24">
            <FormItem label="">
              <Upload action="">
                <Button icon="ios-cloud-upload-outline">选择附件上传</Button>
              </Upload>
            </FormItem>
          </i-col>
          <i-col :xs="24" :sm="24" :md="12" :lg="8">
            <FormItem label="单位取得资质情况" label-for="input12">
              <Input type="textarea" :rows="4" placeholder="请输入..." element-id="input12" />

            </FormItem>
          </i-col>
          <i-col :xs="24" :sm="24" :md="12" :lg="{span: 16}">
            <FormItem label="组织机构图">
              <!-- <div class="demo-upload-list" v-for="(item,index) in uploadList" :key="index">
                  <template v-if="item.status === 'finished'">
                    <img :src="item.url">
                    <div class="demo-upload-list-cover">
                      <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                      <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                    </div>
                  </template>
                  <template v-else>
                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                  </template>
                </div> -->
              <Upload ref="upload" :show-upload-list="false" :default-file-list="defaultList" :on-success="handleSuccess" :format="['jpg','jpeg','png']" :max-size="2048" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" multiple type="drag" action="//jsonplaceholder.typicode.com/posts/" style="display: inline-block;width:58px;">
                <div style="width: 58px;height:58px;line-height: 58px;">
                  <Icon type="ios-camera" size="20"></Icon>
                </div>
              </Upload>
              <Modal title="View Image" v-model="visible">
                <img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" v-if="visible" style="width: 100%">
              </Modal>
            </FormItem>
          </i-col>
        </Row>
      </div>
    </Card>
    <Card style="margin-top:20px;">
      <p slot="title">
        单位信息
      </p>
      <div>
        <Row :gutter="16">
          <i-col :xs="24" :sm="12" :md="12" :lg="12">
            <FormItem label="单位名称：" label-for="input1">
              <i-input placeholder="" element-id="input1"></i-input>
            </FormItem>
          </i-col>
          <i-col :xs="24" :sm="12" :md="12" :lg="12">
            <FormItem label="单位性质：" label-for="input2">
              <i-input placeholder="" element-id="input2"></i-input>
            </FormItem>
          </i-col>
          <i-col :xs="24" :sm="12" :md="12" :lg="12">
            <FormItem label="单位地址：" label-for="input4">
              <i-input placeholder="" element-id="input4"></i-input>
            </FormItem>
          </i-col>
          <i-col :xs="24" :sm="12" :md="12" :lg="12">
            <FormItem label="成立日期：" label-for="input5">
              <DatePicker type="date" placeholder="请选择" style="width: 100%" element-id="input5"></DatePicker>
            </FormItem>
          </i-col>
          <i-col :xs="24" :sm="12" :md="12" :lg="12">
            <FormItem label="环境修复从业日期：" label-for="input6">
              <DatePicker type="date" placeholder="请选择" style="width: 100%" element-id="input6"></DatePicker>
            </FormItem>
          </i-col>
          <i-col :xs="24" :sm="12" :md="12" :lg="12">
            <FormItem label="选择单位类型：">
              <Select style="width:100%">
                <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </i-col>
        </Row>
      </div>
    </Card>
  </Form>
</template>
<script>
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
  methods: {
    handleView(name) {
      this.imgName = name;
      this.visible = true;
    },
    handleRemove(file) {
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
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
    this.uploadList = this.$refs.upload.fileList;
  }
};
</script>
<style lang="scss" scoped>
.content {
  height: 100%;
  .container {
    padding: 26px 20px;
    height: 100%;
    overflow-y: scroll;
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