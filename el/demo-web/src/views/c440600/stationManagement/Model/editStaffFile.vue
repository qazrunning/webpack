//上传站点证件
<template>
  <div>
    <viewer  :images='imgList'>
      <i-col :sm="12" v-for="(item,index) in imgList" :key="index">
        <div class="fx__bgcolor" style="padding:18px;margin:6px;">
          <img class="img_div" :src="item.HasPhoto? item.FullFileName&&item.FullFileName.indexOf(':')==-1?item.FullFileName:'data:image/jpg;base64,'+item.Bytes : error_img" @error="onError($event)">
          <label class="img_title">{{item.CodeName}}</label>
          <Button @click="addPhoto(item)" type="success" long icon="ios-cloud-upload-outline">上传图片</Button>
        </div>
      </i-col>
    </viewer>
    <input type="file" @change="picUpload($event)" style="display:none;" ref="filElem" accept="image/*" />
  </div>
</template>
<script>
let error_img = require("../../../../../public/hj/img/error.gif");
import { ImageZip } from "../../../../utils/tools.js";
export default {
  props: {
    StationCode: {
      type: String,
      default: "0"
    },
    StationStaffID: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      error_img: error_img, //无图片时显示的默认图片
      imgList: [
      ],
      selData: {}
    };
  },
  methods: {
    arrayBufferToBase64(buffer) {
      //buffer 转base64方法
      var binary = "";
      var bytes = new Uint8Array(buffer);
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
    },
    onError(event) {
      event.target.src = "static/img/imgError.png";
    },
    addPhoto(item) {
      //添加图片
      this.selData = item;
      this.$refs.filElem.dispatchEvent(new MouseEvent("click")); //触发file方法
    },
    picUpload(event) {
      //获取上传图片
      const self = this;
      let files = event.target.files[0];

      ImageZip(files, function (baseData) {
        self.upLoads(baseData);
      });
    },
    async upLoads(baseData) {
      const self = this;
      let formData = new FormData();
      let { Bytes, ...paramsData } = this.selData;
      formData.append("uploadType", "2");
      formData.append("selData", JSON.stringify(paramsData));
      formData.append("file", baseData.blobUrl);
      const res = await this.$curl.post("api/hj/uploadImage", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
        onUploadProgress: progressEvent => {
          var complete = (progressEvent.loaded / progressEvent.total * 100 | 0);
        }
      });
      if (res.state) {
        this.$Message.success(res.msg);
        this.imgList.forEach(t => {
          if (t.CodeValue != res.newData.type) return;
          t = Object.assign(t, res.newData); //重新赋值
          t["HasPhoto"] = t.FullFileName ? 1 : 0;
          if (t.FullFileName && t.FullFileName.indexOf(':') != -1) t['Bytes'] = self.arrayBufferToBase64(t.Bytes.data);
        });
        this.$refs.filElem.value = ""; //上传成功，清除input里的file,这样可以重复选择
      } else {
        this.$Notice.warning({
          title: res.msg
        });
        return;
      }
    },
    async searchFileInfo() {
      const self = this;
      const params = { StationStaffID: this.StationStaffID }
      let result = await this.$curl.get("api/hj/getStaffimg", { StationStaffID: this.StationStaffID });
      if (result.state) {
        result.data.forEach(t => {
          t.StationCode = self.StationCode;
          t.StationStaffID = self.StationStaffID;
          if (t.ID) { //是否有图片
            t["HasPhoto"] = t.FullFileName ? 1 : 0;
          } else t["HasPhoto"] = false;
          if (t.FullFileName && t.FullFileName.indexOf(':') != -1) t['Bytes'] = self.arrayBufferToBase64(t.Bytes.data);
        });
        if (result.data) this.imgList = result.data;
      } else {
        this.$Notice.warning({
          title: '提示',
          desc: '获取图片失败!'
        });
      }
    },
    ruleValidate() {
      const self = this;
      let titleArr = [];
      for (var i = 0; i < self.imgList.length; i++) {
        if (!self.imgList[i].FullFileName && self.imgList[i].Must) {
          titleArr.push(self.imgList[i].CodeName + "不能为空！");
        }
      }
      this.$emit("ruleFileInfo", titleArr);
    }
  },
  watch: {
    StationStaffID: {
      handler(newval, oldval) {
        if (!newval) return;
        this.searchFileInfo();
      },
      immediate: true
    }
  },
  mounted() {
  }
};
</script>
<style scoped>
.img_div {
  height: 240px;
  width: 100%;
}
.img_title {
  display: block;
  text-align: center;
}
</style>