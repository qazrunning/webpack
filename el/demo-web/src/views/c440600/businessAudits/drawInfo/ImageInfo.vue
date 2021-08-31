// 业务审核-审核图片信息(UploadFileData)
<template>
  <div class="img-main">
    <Card>
      <p slot="title">图片信息</p>
      <div v-if="ImgForm.length>0">
        <viewer :images="ImgForm" style="display:flex;flex-wrap:wrap;">
          <div v-for="(item, index) in ImgForm" :key="index" class="img_div">
             <img v-if="item.Bytes" :src="'data:image/jpg;base64,'+item.Bytes" style=" width:200px;height:200px;" @error="onError($event)" />
            <img v-else-if="item.FullFileName" :src="item.FullFileName" style="width:200px;height:200px;" @error="onError($event)" />
            <img v-else :src="item.Url" style=" width:200px;height:200px;" @error="onError($event)" />
            <p>文件名：{{item.DisplayName}}</p>
            <p>上传者：{{item.UploadPerson}}</p>
          </div>
        </viewer>
      </div>
      <div v-else style="text-align:center;">暂无图片</div>
    </Card>
  </div>
</template>
<script>
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
    };
  },
  methods: {
    onError(event) {
      event.target.src = "static/img/imgError.png";
    },
    arrayBufferToBase64(buffer) {
      //buffer 转base64方法
      var binary = "";
      var bytes = new Uint8Array(buffer);
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
    }
  },
  watch: {
    ImgForm: {
      handler(newData, oldData) {
        if (!newData) return;
        newData.forEach(item => {
          if (!item.Bytes) return;
          item["Bytes"] = this.arrayBufferToBase64(item.Bytes.data);
        });
      },
      immediate: true
    }
  },
  mounted() {
  }
};
</script>

<style scoped>
.img_div {
  width: 200px;
  margin-right: 20px;
}
</style>