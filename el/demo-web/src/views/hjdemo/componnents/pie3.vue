<template>
  <div>
    <div class="box fx__box" style="margin:13px" v-for="(item1,num1) in rankData" :key="num1">
      <div class="fx__text_headline">{{item1.rankTitle}}</div>
      <div class="rank">
        <div class="fx__thead rank__head fx__thead-green">
          <Row>
            <i-col span="3" class-name="rank_num">{{item1.rankInfo.rankNav.ranking}}</i-col>
            <i-col span="17" class-name="rank_name">{{item1.rankInfo.rankNav.name}}</i-col>
            <i-col span="4" class-name="rank_rate">{{item1.rankInfo.rankNav.passRate}}</i-col>
          </Row>
        </div>
        <div class="rank__body">
          <div
            class="fx__item rank__item"
            v-for="(item2,num2) in item1.rankInfo.company"
            :key="num2"
          >
            <Row>
              <i-col span="3">{{num2+1}}</i-col>
              <i-col span="17" class-name="text-single">{{item2.companyName}}</i-col>
              <i-col span="4" class-name="rank_rate fx__text_num">100%</i-col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rankData: [
        {
          rankTitle: "柴油通过率TOP5",
          rankInfo: {
            rankNav: {
              ranking: "排名",
              name: "名称",
              passRate: "通过率"
            },
            company: [
              {
                companyName: "大沥机动车检测站有限公司"
              },
              {
                companyName: "大沥机动车检测站有限公司"
              },
              {
                companyName: "大沥机动车检测站有限公司"
              },
              {
                companyName: "大沥机动车检测站有限公司"
              },
              {
                companyName: "大沥机动车检测站有限公司"
              }
            ]
          }
        },
        {
          rankTitle: "柴油通过率TOP5",
          rankInfo: {
            rankNav: {
              ranking: "排名",
              name: "名称",
              passRate: "通过率"
            },
            company: [
              {
                companyName: "大沥机动车检测站有限公司"
              },
              {
                companyName: "大沥机动车检测站有限公司"
              },
              {
                companyName: "大沥机动车检测站有限公司"
              },
              {
                companyName: "大沥机动车检测站有限公司"
              },
              {
                companyName: "大沥机动车检测站有限公司"
              }
            ]
          }
        }
      ]
    };
  }
};
</script>
<style lang="scss" scoped>
.box {
  padding: 13px;
  border-radius: 4px;
  .rank {
    margin-top: 14px;
    .rank__head {
      font-size: 16px;
      padding: 14px;
      border-radius: 4px;
      line-height: 20px;
    }
    .rank_num {
      white-space: nowrap;
    }
    .rank_name {
      // text-align: center;
      padding-left: 50px;
    }
    .rank_rate {
      white-space: nowrap;
      text-align: right;
      font-size: 18px;
    }
    .rank__body {
      padding-top: 14px;
      .rank__item {
        padding: 14px;
        line-height: 20px;
        &::after {
          display: block;
          content: "";
          height: 1px;
          position: absolute;
          bottom: 0;
          right: 0;
          left: 0;
        }
        &:first-of-type {
        }
        &:last-of-type {
          &::after {
            display: none;
          }
        }
      }
    }
  }
}
.top__card .fx__bgcolor-green {
  box-shadow: none !important;
}
//单行溢出显示省略号
.text-single {
  overflow: hidden;
  white-space: normal;
  text-overflow: ellipsis;
}
</style>