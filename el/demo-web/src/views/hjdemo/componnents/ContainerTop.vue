<template>
  <div class="container-top">
    <div class="box fx__box" v-for="(item,index) in boxData" :key="index">
      <div class="offset offset-green" :class="item.bgcolor">
        <div class="icon">
          <i class="fa fa-pie-chart fa-lg"></i>
        </div>
      </div>
      <div class="text">
        <div class="text_title fx__text_headline">{{item.textTitle}}</div>
        <div class="text_title fx__text_headline">
          <span class="text_num fx__text_num">{{item.textNum}}</span>辆
        </div>
      </div>
      <div class="fx__line_divide" style="margin: 14px 0;"></div>
      <div id="actions">
        <div class="icon_sign">
          <i class="fa fa-info"></i>
        </div>
        <div class="fx__text_assist text_assist">{{item.textAssist}}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      boxData: [
        {
          textTitle: "汽车保有量",
          textNum: "1,393,786",
          textAssist:
            "汽油车:1121900辆 柴油车:264196辆 新能源车:1辆 汽油车:1121900辆 柴油车:264196辆",
          bgcolor: "offset-green"
        },
        {
          textTitle: "汽车保有量",
          textNum: "1,393,786",
          textAssist:
            "汽油车:1121900辆 柴油车:264196辆 新能源车:1辆 汽油车:1121900辆 柴油车:264196辆",
          bgcolor: "offset-orange"
        },
        {
          textTitle: "汽车保有量",
          textNum: "1,393,786",
          textAssist:
            "汽油车:1121900辆 柴油车:264196辆 新能源车:1辆 汽油车:1121900辆 柴油车:264196辆",
          bgcolor: "offset-red"
        },
        {
          textTitle: "汽车保有量",
          textNum: "1,393,786",
          textAssist: "汽油车:1121900辆",
          bgcolor: "offset-blue"
        }
      ]
    };
  }
};
</script>
<style lang="scss" scoped>
.container-top {
  padding: 13px;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  .box {
    box-sizing: border-box;
    padding: 13px;
    margin-top: 30px;
    width: 24%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    position: relative;
    border-radius: 4px;
    .text {
      text-align: right;
      width: 100%;
      .text_title {
        font-weight: normal;
        line-height: 28px;
      }
      .text_num {
        font-size: 26px;
        margin-right: 14px;
      }
    }
    #line_divide {
      width: 100%;
      margin: 12px 0;
      border-top: 2px solid rgb(144, 147, 151);
    }
    #actions {
      position: relative;
      .icon_sign {
        width: 14px;
        text-align: center;
        position: absolute;
        top: 0;
        left: 0;
      }
      .text_assist {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        max-height: 42px;
        text-align: justify;
        padding-left: 18px;
      }
    }
    .offset {
      padding: 15px;
      border-radius: 4px;
      position: absolute;
      top: -24px;
      &-green {
        background-color: #48a44c;
      }
      &-orange {
        background-color: #fea21e;
      }
      &-red {
        background-color: #ec4d49;
      }
      &-blue {
        background-color: #1cbfd4;
      }
    }
    .icon {
      font-size: 22px;
      width: 55px;
      height: 55px;
      line-height: 55px;
      text-align: center;
      color: #ffffff; //注意
    }

    .fx__box {
      border-radius: 4px;
    }
  }
}

@media screen and (max-width: 1200px) {
  .container-top {
    flex-wrap: wrap;
    // justify-content:space-between;
    .box {
      width: 48.7%;
    }
  }
}
@media screen and (max-width: 768px) {
  .container-top {
    flex-wrap: wrap;
    .box {
      width: 100%;
      flex: auto;
    }
  }
}
</style>