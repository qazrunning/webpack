<template>
    <div class=" box">
          <div class="fx__box top__card">
            <div class="offset offset-green">
              <div class="icon">
                <i class="fa fa-pie-chart fa-lg"></i>
              </div>
            </div>
            <div class="text">
              <div class="text_title">汽车保有量</div>
              <div class="text_title"><span class="text_num">1,393,786</span>辆</div>
            </div>
            <div class="fx__line_divide line_divide"></div>
            <div class="actions">
              <div class="icon_sign"><i class="fa fa-info"></i></div>
              <div class="fx__text_assist text_assist">
                汽油车:1121900辆 柴油车:264196辆 新能源车:1辆 汽油车:1121900辆 柴油车:264196辆
              </div>
            </div>
          </div>
        </div>
</template>
<script>
export default {
    
}
</script>

<style lang="scss" scoped>
.fx__box {
  height: 100%;
  border-radius: 4px;
}
.fx__thead {
  &-green {
    background: -webkit-linear-gradient(left, #62b866, #48a44c);
    background: -o-linear-gradient(right, #62b866, #48a44c);
    background: -moz-linear-gradient(right, #62b866, #48a44c);
    background: linear-gradient(to right, #62b866, #48a44c);
  }
  &-orange {
    background: -webkit-linear-gradient(left, #fea21e, #fc9107);
    background: -o-linear-gradient(right, #fea21e, #fc9107);
    background: -moz-linear-gradient(right, #fea21e, #fc9107);
    background: linear-gradient(to right, #fea21e, #fc9107);
  }
  &-red {
    background: -webkit-linear-gradient(left, #ec4d49, #e73d39);
    background: -o-linear-gradient(right, #ec4d49, #e73d39);
    background: -moz-linear-gradient(right, #ec4d49, #e73d39);
    background: linear-gradient(to right, #ec4d49, #e73d39);
  }
  &-blue {
    background: -webkit-linear-gradient(left, #1cbfd4, #03aec3);
    background: -o-linear-gradient(right, #1cbfd4, #03aec3);
    background: -moz-linear-gradient(right, #1cbfd4, #03aec3);
    background: linear-gradient(to right, #1cbfd4, #03aec3);
  }
}
.content {
  padding: 17px;
  height: 100%;
  min-height: 100%;
  overflow-y: overlay;
  .box {
    flex: 1;
    padding: 13px;
  }
  .box-horizontal {
    display: flex;
    flex: 1;
  }
  .box-vertical {
    display: flex;
    flex-direction: column;
    width: 33.33%;
    // flex: 1;
  }
  .per1 {
    flex: 1;
  }
  .per2 {
    flex: 2;
  }

  .container {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    .top {
      display: flex;
      flex: 1;
      .box{
          width: 25%;
      }
      .top__card {
        display: flex;
        flex-direction: column;
        margin: 25px 0 0;
        height: calc(100% - 25px);
        position: relative;
        .offset {
          padding: 15px;
          border-radius: 4px;
          position: absolute;
          top: -24px;
          &-green {
            background: -webkit-linear-gradient(left, #62b866, #48a44c);
            background: -o-linear-gradient(right, #62b866, #48a44c);
            background: -moz-linear-gradient(right, #62b866, #48a44c);
            background: linear-gradient(to right, #62b866, #48a44c);
          }
          &-orange {
            background: -webkit-linear-gradient(left, #fea21e, #fc9107);
            background: -o-linear-gradient(right, #fea21e, #fc9107);
            background: -moz-linear-gradient(right, #fea21e, #fc9107);
            background: linear-gradient(to right, #fea21e, #fc9107);
          }
          &-red {
            background: -webkit-linear-gradient(left, #ec4d49, #e73d39);
            background: -o-linear-gradient(right, #ec4d49, #e73d39);
            background: -moz-linear-gradient(right, #ec4d49, #e73d39);
            background: linear-gradient(to right, #ec4d49, #e73d39);
          }
          &-blue {
            background: -webkit-linear-gradient(left, #1cbfd4, #03aec3);
            background: -o-linear-gradient(right, #1cbfd4, #03aec3);
            background: -moz-linear-gradient(right, #1cbfd4, #03aec3);
            background: linear-gradient(to right, #1cbfd4, #03aec3);
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
        .text {
          text-align: right;
          width: 100%;
          .text_title {
            font-size: 18px;
            color: rgba(106, 106, 106, 1);
            line-height: 28px;
          }
          .text_num {
            font-size: 26px;
            color: rgba(51, 51, 51, 1);
            margin-right: 14px;
            font-family: Roboto;
          }
        }
        .line_divide {
          height: 1px;
          width: 100%;
          margin: 12px 0;
        }
        .actions {
          overflow: hidden;
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
      }
    }
    
  }
}


@media screen and (max-width: 1200px) {
  .content {
    .container{
        .top{
            flex-wrap: wrap;
            .box{
                width: 50%;
                flex: auto;
            }
        }
    }
  }
}
</style>


