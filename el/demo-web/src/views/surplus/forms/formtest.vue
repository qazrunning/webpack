<template>
  <div style="padding:20px;">
    <Alert closable>表单组件还在开发中，如有建议，请反馈</Alert>
    <core-form title="label右对齐，分4列，label宽100px，可编辑" col=4 label-align="right" label-direction="horizontal" label-width='100' :editable="true" class="fx__box">
      <core-form-item label="单位名称：">
        <input placeholder="测试输入框" class="core__input ivu-input" />
      </core-form-item>
      <core-form-item label="出差事由：">
        <input placeholder="测试输入框" class="core__input ivu-input" />
      </core-form-item>
      <core-form-item label="合同编号：">
        <input placeholder="测试输入框" class="core__input ivu-input" />
      </core-form-item>
      <core-form-item label="出差时间：">
        <input placeholder="测试输入框" class="core__input ivu-input" />
      </core-form-item>
      <core-form-item label="审批人：">
        <input placeholder="测试输入框" class="core__input ivu-input" />
      </core-form-item>
    </core-form>
    <br>
    <core-form title="label右对齐，分4列，label宽100px，不可编辑" col=4 label-align="right" label-direction="horizontal" label-width='100' :editable="false" class="fx__box">
      <core-form-item label="单位名称：">
        广州是云景信息科技有限公司
      </core-form-item>
      <core-form-item label="出差事由：">
        项目需要
      </core-form-item>
      <core-form-item label="合同编号：">
        0011145467587
      </core-form-item>
      <core-form-item label="出差时间：">
        2019-11-11 至 2019-11-21
      </core-form-item>
    </core-form>
    <br>
    <core-form title="label右对齐，分3列，label宽100px" col=3 label-align="right" label-direction="horizontal" label-width='100' :rules="ruleValidate" ref="formValidate" :model="formValidate" class="fx__box">
      <core-form-item label="名字：" prop="test2">
        <i-input placeholder="测试输入框" v-model="formValidate.test2" ></i-input>
      </core-form-item>
      <core-form-item label="年龄：" prop="test3">
        <i-input v-model="formValidate.test3" number></i-input>
      </core-form-item>
      <!-- <core-form-item>
      <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
      </core-form-item> -->
    </core-form>
  </div>

</template>
<script>
export default {
  data() {
    const validateAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("不能为空"));
      }
      console.log(typeof(value))
      // 模拟异步验证效果
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("要输入数字"));
        } else {
          if (value < 18) {
            callback(new Error("一定要超过18"));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    return {
      formValidate: {
        test1: "",
        test2: "",
        test3: "",
      },
      //验证规则
      ruleValidate: {
        test1: [
          {
            required: true,
            message: "必填信息",
            trigger: "blur"
          }
        ],
        test2: [
          {
            required: true,
            message: "必填信息",
            trigger: "blur"
          }
        ],
        test3: [
          {
            validator: validateAge,
            trigger: "blur"
          }
        ],
      }
    };
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$Message.success("成功!");
        } else {
          this.$Message.error("失败!");
        }
      });
    },
    
  },
  mounted(){
    this.$app.helper.core.setModuleTitle("表单组件")  //自定义头部的标题
  }
};
</script>
<style lang="scss" scoped>
</style>