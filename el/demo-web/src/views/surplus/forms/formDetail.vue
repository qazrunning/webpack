<template>
  <div class="content">
    <!-- <fx-track>
      <template>
        状态:研发中
        作者:张思欣
        功能描述:显示表单信息
      </template>
    </fx-track> -->
    <div class="container fx__form_detail-md">
    <Alert closable>iview组件：form表单+card卡片+栅格系统。表单单元格行高32px，一行的行下外间距8px（给form表单或其外层加fx__form_detail-md类名即可），第一个卡片的上外间距为0，其余为20px，表单域标签左对齐，不设宽度</Alert>

      <Form label-position='left'>
        <Card>
          <p slot="title">
            委托单基本信息
          </p>
          <div>
            <Row :gutter="16">
              <i-col :xs="24" :sm="8" :md="8" :lg="8">
                <FormItem label="任务名称:">
                  检测XXXX
                </FormItem>
              </i-col>
              <i-col :xs="24" :sm="8" :md="8" :lg="8">
                <FormItem label="监测类型:">
                  单位名称
                </FormItem>
              </i-col>
              <i-col :xs="24" :sm="8" :md="8" :lg="8">
                <FormItem label="委托日期:">
                  2019-9-26
                </FormItem>
              </i-col>
              <i-col :xs="24" :sm="8" :md="8" :lg="8">
                <FormItem label="备注:">
                  无
                </FormItem>
              </i-col>
              <!-- <i-col :xs="24" :sm="8" :md="8" :lg="8">
                <FormItem label="单位名称:">
                  单位名称
                </FormItem>
              </i-col>
              <i-col :xs="24" :sm="8" :md="8" :lg="8">
                <FormItem label="单位名称:">
                  单位名称
                </FormItem>
              </i-col>
              <i-col :xs="24" :sm="8" :md="8" :lg="8">
                <FormItem label="单位名称:">
                  单位名称
                </FormItem>
              </i-col>
              <i-col :xs="24" :sm="8" :md="8" :lg="8">
                <FormItem label="单位名称:">
                  单位名称
                </FormItem>
              </i-col> -->
            </Row>
          </div>
        </Card>
        <Card style="margin-top:20px">
          <p slot="title">
            受测单位信息
          </p>
          <div>
            <Row :gutter="16">
              <i-col :xs="24" :sm="8" :md="8" :lg="8">
                <FormItem label="单位名称:">
                  广东省XX单位
                </FormItem>
              </i-col>
              <i-col :xs="24" :sm="8" :md="8" :lg="8">
                <FormItem label="行业:">
                  环保行业
                </FormItem>
              </i-col>
              <i-col :xs="24" :sm="8" :md="8" :lg="8">
                <FormItem label="传真:">
                  25365241
                </FormItem>
              </i-col>
              <i-col :xs="24" :sm="8" :md="8" :lg="8">
                <FormItem label="联系地址:">
                  广东省XXX市XXX区
                </FormItem>
              </i-col>
              <i-col :xs="24" :sm="8" :md="8" :lg="8">
                <FormItem label="联系人:">
                  张三
                </FormItem>
              </i-col>
              <i-col :xs="24" :sm="8" :md="8" :lg="8">
                <FormItem label="联系电话:">
                  6257841
                </FormItem>
              </i-col>
              <i-col :xs="24" :sm="8" :md="8" :lg="8">
                <FormItem label="手机:">
                  123645987
                </FormItem>
              </i-col>
              
            </Row>
          </div>
        </Card>
      </Form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isPc: this.$app.helper.screen.isPC //判断是pc还是手机
    };
  }
};
</script>
<style lang="scss" scoped>
.content {
  height: 100%;
  position: relative;
  .container {
    padding: 20px 20px;
    height: 100%;
  }
}

</style>