// 业务审核-车型审核图片信息
<template>
  <div class="img-main">
    <Card>
      <p slot="title">图片信息</p>
      <div v-if="ImgForm.length>0">
        <viewer :images="ImgForm" style="display:flex;flex-wrap:wrap;">
          <div v-for="(item, index) in ImgForm" :key="index" class="img_div">
            <img :src="item.Url" style=" width:200px;height:200px;" @error="onError($event)" />
            <p>文件名：{{item.OriginalFileName}}</p>
            <p>上传者：{{item.UploadFileUser}}</p>
            <p>上传时间：{{item.UploadFileTime}}</p>
            <p>文件类型：{{returncodenames(CheckType,item.BusinessType)}}</p>
            <p>文件组：{{returncodenames(FileGroup,item.FileGroup)}}</p>
          </div>
        </viewer>
      </div>
      <div v-else style="text-align:center;">暂无图片</div>
    </Card>
  </div>
</template>
<script>
import { getCDData } from "./../../../utils/utils";
export default {
  name: "imginfo",
  props: {
    ImgForm: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      FileGroup: [],
      CheckType: []
    };
  },
  methods: {
    onError(event) {
      event.target.src = "static/img/imgError.png";
    },
    //过滤数据
    returncodenames(namelist, codevalue) {
      if (namelist) {
        let CodeName = "";
        namelist.forEach(item => {
          if (item.CodeValue == codevalue) CodeName = item.CodeName;
        });
        return CodeName;
      }
    },
    //直接从浏览器缓存获取CD表或者从reids
    getDBinfoByMultipte() {
      const self = this;
      let cdname = [
        {
          tableName: "CD_FileGroup",
          columns: "CodeValue,CodeName",
        },
        {
          tableName: "CD_CheckType",
          columns: "CodeValue,CodeName",
        }
      ];
      const tabName=cdname.map(c=>c.tableName);
      if (self.$getDBTable) {
        self.$getDBTable(tabName).then(res => {
          self.FileGroup = JSON.parse(res[0])[0].hasOwnProperty('IsAvailable') ? JSON.parse(res[0]).filter(r => r.IsAvailable == 1) : JSON.parse(res[0]);
          self.CheckType = JSON.parse(res[1])[0].hasOwnProperty('IsAvailable') ? JSON.parse(res[1]).filter(r => r.IsAvailable == 1) : JSON.parse(res[1]);
        })
      } else {
        getCDData(this, cdname).then(res => {
          const { state, data, msg } = res;
          if (state) {
            self.FileGroup = data[0][0].hasOwnProperty('IsAvailable') ? data[0].filter(d => d.IsAvailable == 1) : data[0];
            self.CheckType = data[1][0].hasOwnProperty('IsAvailable') ? data[1].filter(d => d.IsAvailable == 1) : data[1];
          }
        });
      }
    }
  },
  watch: {
    ImgForm: {
      handler(newData, oldData) {
        if (!newData) return;
      },
      immediate: true
    }
  },
  mounted() {
    this.getDBinfoByMultipte();
  }
};
</script>

<style scoped>
.img_div {
  width: 200px;
  margin-right: 20px;
}
</style>