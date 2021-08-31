<template>
  <div>
    <Carousel autoplay v-model="value1" loop>
      <CarouselItem>
        <div class="demo-carousel">1</div>
      </CarouselItem>
      <CarouselItem>
        <div class="demo-carousel">2</div>
      </CarouselItem>
      <CarouselItem>
        <div class="demo-carousel">3</div>
      </CarouselItem>
      <CarouselItem>
        <div class="demo-carousel">4</div>
      </CarouselItem>
    </Carousel>

    <Form :model="setting" :label-width="100">
      
      <FormItem label="Automatic switching speed">
        <Slider v-model="setting.autoplaySpeed" :min="300" :max="10000" :step="100"></Slider>
      </FormItem>
      <FormItem label="Indicator position">
        <RadioGroup v-model="setting.dots" type="button">
          <Radio label="inside">interior</Radio>
          <Radio label="outside">exterior</Radio>
          <Radio label="none">Don't show</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="Switch the arrow">
        <RadioGroup v-model="setting.arrow" type="button">
          <Radio label="hover">Hover displayed when</Radio>
          <Radio label="always">Always show</Radio>
          <Radio label="never">Don't show</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="Indicator trigger mode">
        <RadioGroup v-model="setting.trigger" type="button">
          <Radio label="click">Click</Radio>
          <Radio label="hover">Hover</Radio>
        </RadioGroup>
      </FormItem>
    </Form>
    <Carousel
      v-model="value3"
      :autoplay="setting.autoplay"
      :autoplay-speed="setting.autoplaySpeed"
      :dots="setting.dots"
      :radius-dot="setting.radiusDot"
      :trigger="setting.trigger"
      :arrow="setting.arrow"
    >
      <CarouselItem>
        <div class="demo-carousel">1</div>
      </CarouselItem>
      <CarouselItem>
        <div class="demo-carousel">2</div>
      </CarouselItem>
      <CarouselItem>
        <div class="demo-carousel">3</div>
      </CarouselItem>
      <CarouselItem>
        <div class="demo-carousel">4</div>
      </CarouselItem>
    </Carousel>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value1: 0,
      value3: 0,
      setting: {
        autoplay: false,
        autoplaySpeed: 2000,
        dots: "inside",
        radiusDot: false,
        trigger: "click",
        arrow: "hover"
      }
    };
  }
};
</script>