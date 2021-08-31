<template>
  <div class="content ">
    <!-- <fx-track>
      <template>
        状态:研发中
        作者:张思欣
        功能描述:显示表单信息
      </template>
    </fx-track> -->
    <Alert closable>iview组件：form表单。1.表单单元格行高32px，一行的行下外间距20px，第一个卡片的上外间距为0，其余为20px。</Alert>
    <div class="container">
      <div class="left">
        <div class="fx__box box">
          <div class="fx__text_headline" style="margin-bottom:20px;">标签:pc版在左侧，手机版在顶部</div>
          <Form :model="formItem"  :label-width="isPc ? 80 : null" :label-position="isPc ? 'right' : 'top'">
            <FormItem label="任务名称：">
              <Input v-model="formItem.input" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="监测类型：">
              <Select v-model="formItem.select">
                <Option value="beijing">类型1</Option>
                <Option value="shanghai">类型2</Option>
                <Option value="shenzhen">类型3</Option>
              </Select>
            </FormItem>
            <FormItem label="时间范围：">
              <div class="group_date">
                <DatePicker type="date" placeholder="选择日期" v-model="formItem.date" style="flex:1"></DatePicker>
                <span class="middle">-</span>
                <TimePicker type="time" placeholder="选择时间" v-model="formItem.time" style="flex:1"></TimePicker>
              </div>
            </FormItem>
            <FormItem label="类型：">
              <RadioGroup v-model="formItem.radio">
                <Radio label="male">类型1</Radio>
                <Radio label="female">类型2</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="业务类型：">
              <CheckboxGroup v-model="formItem.checkbox">
                <Checkbox label="业务类型1"></Checkbox>
                <Checkbox label="业务类型2"></Checkbox>
                <Checkbox label="业务类型3"></Checkbox>
                <Checkbox label="业务类型4"></Checkbox>
              </CheckboxGroup>
            </FormItem>
            <FormItem label="状态：">
              <i-switch v-model="formItem.switch" size="large">
                <span slot="open">开</span>
                <span slot="close">关</span>
              </i-switch>
            </FormItem>
            <!-- <FormItem label="滑块">
            <Slider v-model="formItem.slider" range></Slider>
          </FormItem> -->
            <FormItem label="备注：">
              <i-input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入："></i-input>
            </FormItem>
            <FormItem>
              <Button type="primary">提交</Button>
              <Button style="margin-left: 8px">取消</Button>
            </FormItem>
          </Form>
        </div>
      </div>
      <div class="right">
        <div class="fx__box box">
          <div class="fx__text_headline" style="margin-bottom:20px;">标签在顶部</div>
          <Form :model="formItem" label-position="top">
            <FormItem label="任务名称：">
              <Input v-model="formItem.input" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="监测类型：">
              <Select v-model="formItem.select">
                <Option value="beijing">类型1</Option>
                <Option value="shanghai">类型1</Option>
                <Option value="shenzhen">类型2</Option>
              </Select>
            </FormItem>
            <FormItem label="时间范围：">
              <div class="group_date">
                <DatePicker type="date" placeholder="选择日期" v-model="formItem.date" style="flex:1"></DatePicker>
                <span class="middle">-</span>
                <TimePicker type="time" placeholder="选择时间" v-model="formItem.time" style="flex:1"></TimePicker>
              </div>
            </FormItem>
            <FormItem label="类型：">
              <RadioGroup v-model="formItem.radio">
                <Radio label="male">类型1</Radio>
                <Radio label="female">类型2</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="业务类型：">
              <CheckboxGroup v-model="formItem.checkbox">
                <Checkbox label="类型1"></Checkbox>
                <Checkbox label="类型2"></Checkbox>
                <Checkbox label="类型3"></Checkbox>
                <Checkbox label="类型4"></Checkbox>
              </CheckboxGroup>
            </FormItem>
            <FormItem label="状态：">
              <i-switch v-model="formItem.switch" size="large">
                <span slot="open">开</span>
                <span slot="close">关</span>
              </i-switch>
            </FormItem>
            <!-- <FormItem label="Slider">
            <Slider v-model="formItem.slider" range></Slider>
          </FormItem> -->
            <FormItem label="备注：">
              <Input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入"></Input>
            </FormItem>
            <FormItem>
              <Button type="primary">提交</Button>
              <Button style="margin-left: 8px">取消</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  data() {
    return {
      isPc: this.$app.helper.screen.isPC, //判断是pc还是手机
      formItem: {
        input: "",
        select: "",
        radio: "male",
        checkbox: [],
        switch: true,
        date: "",
        time: "",
        slider: [20, 50],
        textarea: ""
      }
    };
  }
};
</script>
<style lang="scss" scoped>
.content {
  padding: 20px 10px;
  height: 100%;
  overflow-y: scroll;
  .container {
    display: flex;
  }
  .left,
  .right {
    flex: 1;
    padding: 0 10px;
  }
  .box {
    border-radius: 4px;
    height: 100%;
  }
  .group_date {
    display: flex;
    justify-content: space-between;
    .left {
      // width: 48%;
      flex: 1;
      padding: 0;
    }
    .middle {
      display: inline-block;
      width: 30px;
      text-align: center;
    }
    .right {
      // width: 48%;
      flex: 1;
      padding: 0;
    }
  }
}
@media screen and (max-width:756px){
  .content{
    .container{
      flex-direction: column;
      .right{
        margin-top: 20px;
      }
    }
  }
}
</style>