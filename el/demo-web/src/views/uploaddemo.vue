<template>
  <div
    class="content"
    style="text-align:center;overflow: scroll;
    height: 100%;"
  >
    <div class="content_nav ">
      <div class="content_nav-switch"><i-switch v-model="isUploadArr" /><span style="margin-left:5px">批量下载模式</span></div>
      <Checkbox :indeterminate="indeterminate" v-if="isUploadArr" style="margin-left:5px" :value="checkAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
      <Button type="success" v-if="isUploadArr" style="border-radius: 10px;margin-left:5px" @click="handleBatchDownload">批量下载 </Button>
      <transition name="fade">
        <div v-show="social.length > 0" style="flex: 1;display: flex;align-items: center;margin:0 10px">
          <Progress :stroke-width="5" hide-info :percent="percent" :stroke-color="['#108ee9', '#87d068']" />
          <span style="margin-left:5px">{{ fileNum }}/{{ social.length }}</span>
        </div>
      </transition>
    </div>
    <CheckboxGroup v-model="social" @on-change="checkAllGroupChange">
      <div ref="fx_uploadbody" class="demo_uploadbody" style="">
        <div class="fx__item fx__border demo_item fx__box" ref="browse">
          <span class="fa fa-4x" style="padding-bottom:10px;">+</span>
        </div>

        <div class="fx__item fx__border demo_item fx__box" :ref="item.FileID" v-for="item in this.files" :key="item.id">
          <Checkbox v-if="isUploadArr" :label="JSON.stringify(item)" style="margin: 0 0 0 5px;">
            <span></span>
          </Checkbox>
          <div class="demo_item_icon " @click="setCheckbox(item.FileID)">
            <!-- <span :class="icon(item)"></span> -->

            <svg-icon class="demo_item_svg" :iconClass="icon(item)"></svg-icon>
            <transition name="fade">
              <i v-show="!item.percent" class="fa fa-check fx__text_primary demo_item_i" style=""></i>
            </transition>
            <!-- fa fa-file-picture-o fa-4x  -->
          </div>
          <div class="fx__simpleline demo_item_msg" @click="setCheckbox(item.FileID)">
            <span class="demo_item_fileName">{{ item.FileName }}</span>
            <div class="demo_item_fileSize">
              <!-- (item.percent==100?'':formatFileSize(item.size*(item.percent	.toFixed(0)/100))+'/')+ -->
              <span style="font-size:5px">{{ formatFileSize(item.FileSize) }}</span>
              <Progress style="width:55%" v-if="item.percent" :percent="item.percent" :stroke-width="2" />
              <span v-else style="font-size:5px;margin-left:5px">{{ item.UploadDt | dateFormat("") }}</span>
            </div>
          </div>
          <!-- 在使用数组的 reverse() unshift() 是 iview的percent 有问题-->
          <!-- <Progress :percent="item.percent" :stroke-width="2" /> fx__opera-->
          <div class="fx__bgcolor demo_item_opera" v-if="!isUploadArr">
            <Button type="success" style="border-radius: 20px;" @click="upload(item)">下载</Button>
            <!-- <span> <a class="fx__text_primary" :href="item.path" :download="item.path">下载</a></span> -->
          </div>
        </div>

        <div class="demo_transparentBox" v-for="item in this.transparentBoxArr" :key="item.id">
          <svg-icon iconClass="doc" style="width:51px;height:58px"></svg-icon>
        </div>
      </div>
    </CheckboxGroup>
  </div>
</template>

<script>
import plupload from "plupload";
import JSZip from "jszip";
import FileSaver from "file-saver";
import {Promise} from "bluebird";
// demo-12978016186031185921
// demo-12978016321633034241
// demo-12978016711913021441
// demo-12978017072287621121

export default {
  data() {
    return {
      percent: 0,
      fileNum: 0,
      isUploadArr: false,
      checkAll: false,
      indeterminate: false,
      social: [],
      files: [],
      storageFiles: [],
      uploadBodyWidth: 0,
      transparentBoxArrLenght: 0,
      test: [],
    };
  },
  filters: {
    dateFormat: function(datestr, pattern) {
      //时间过滤器
      // 根据给定的时间字符串，得到特定的时间
      var dt = new Date(datestr);
      var y = dt.getFullYear();
      var m = (dt.getMonth() + 1).toString().padStart(2, "0");
      var d = dt
        .getDate()
        .toString()
        .padStart(2, "0");
      var hh = dt
        .getHours()
        .toString()
        .padStart(2, "0");
      var mm = dt
        .getMinutes()
        .toString()
        .padStart(2, "0");
      var ss = dt
        .getSeconds()
        .toString()
        .padStart(2, "0");
      // toLowerCase() 将无论是大小写字母都转换为小写字母
      if (pattern.toLowerCase() == "yyyy-mm-dd") return `${y}-${m}-${d}`;
      else {
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
      }
    },
  },
  mounted() {
    let _this = this;
    //实例化一个plupload上传对象
    var uploader = new plupload.Uploader({
      browse_button: this.$refs.browse, //触发文件选择对话框的按钮，绑定元素id 也可以是 ref
      url: "api/public/demo/saveFile", //服务器端的上传页面地址
      flash_swf_url: "js/Moxie.swf", //swf文件，当需要使用swf方式进行上传时需要配置该参数
      silverlight_xap_url: "js/Moxie.xap", //silverlight文件，当需要使用silverlight方式进行上传时需要配置该参数
      filters: {
        // mime_types: [
        //   //只允许上传图片
        //   { title: "Image files", extensions: "jpg,gif,png" }
        // ],
        multipart: true,
        max_file_size: "4000kb", //最大只能上传4000kb的文件
        prevent_duplicates: true, //不允许选取重复文件
      },
    });
    //在实例对象上调用init()方法进行初始化
    uploader.init();
    //绑定各种事件，并在事件监听函数中做你想做的事
    uploader.bind("FilesAdded", function(uploader, files) {
      //当文件添加到上传队列后触发
      files.forEach((file, index) => {
        _this.files.unshift({
          SeiralID: file.id,
          FileName: file.name,
          FileSize: file.size,
          percent: 0,
          UploadDt: new Date(),
        });
      });
      uploader.start();
      //unshift
      // files.reverse() 数组的倒叙会有显示的bug 所以我用flex布局的 倒叙
      //调用实例对象的start()方法开始上传文件，当然你也可以在其他地方调用该方法
    });

    uploader.bind("BeforeUpload", function(uploader, file) {
      //上传之前
      //上传之前附带一些额外的参数
      uploader.setOption("multipart_params", {
        filesize: file.size,
      });
    });
    // QueueChanged UploadComplete
    uploader.bind("UploadProgress", function(uploader, file) {
      //上传时
      //每个事件监听函数都会传入一些很有用的参数，
      //我们可以利用这些参数提供的信息来做比如更新UI，提示上传进度等操作
      let obj = _this.files.find((p) => p.SeiralID == file.id);
      if (obj) {
        obj.percent = file.percent;
      }
    });
    uploader.bind("FileUploaded", function(uploader, file, responseObject) {
      //当文件上传完成时
      let res = JSON.parse(responseObject.response);
      let obj = _this.files.find((p) => p.SeiralID == file.id);
      if (obj) {
        obj.percent = null;
        obj.FileID = res.FileID;
        obj.UploadDt = new Date(res.UploadDt);
      }
    });

    _this.$curl.get("/api/public/demo/readFile", {}).then((res) => {
      //初始化的时候访问数据库的数据
      let { files } = res;
      _this.files = files; //数据库的文件信息
    });
    _this.uploadBodyWidth = _this.$refs.fx_uploadbody.clientWidth;
    window.onresize = () => {
      //监听窗口宽度
      return (() => {
        _this.uploadBodyWidth = _this.$refs.fx_uploadbody.clientWidth;
      })();
    };
  },
  watch: {
    isUploadArr: function(newVal, oldVal) {
      if (!newVal) {
        this.social = [];
      }
    },
    // uploadBodyWidth:function(newVal,oldVal){
    //   let col = parseInt(newVal/300)
    //    this.transparentBoxArrLenght =col-((this.files.length+1)%col)
    // }
  },
  computed: {
    // 空盒子 用于布局排版
    transparentBoxArr: function() {
      let arr = [];
      let _this = this;
      let col = parseInt(this.uploadBodyWidth / 300);
      this.transparentBoxArrLenght = col - ((this.files.length + 1) % col);
      // console.log(this.uploadBodyWidth,'width',col,'col',this.files.length+1,'files.length+1',((this.files.length+1)%col),this.transparentBoxArrLenght);
      if ((this.files.length + 1) % col == 0) return [];
      if (this.transparentBoxArrLenght > 0) {
        for (let index = 1; index <= this.transparentBoxArrLenght; index++) {
          arr.push(index);
        }
      }
      return arr;
    },
  },
  methods: {
    checkAllGroupChange(data) {
      let _this = this;
      if (data.length === _this.files.length) {
        this.indeterminate = false;
        this.checkAll = true;
      } else if (data.length > 0) {
        this.indeterminate = true;
        this.checkAll = false;
      } else {
        this.indeterminate = false;
        this.checkAll = false;
      }
    },
    handleCheckAll() {
      let _this = this;
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminate = false;

      if (this.checkAll) {
        this.social = _this.files.map((p) => JSON.stringify(p));
      } else {
        this.social = [];
      }
    },
    setCheckbox(FileID) {
      let _this = this;
      if (_this.isUploadArr) {
        _this.$refs[FileID][0].children[0].getElementsByTagName("input")[0].click();
      }
    },
    getFile(url, index) {
      let _this = this;
      return new Promise((resolve, reject) => {
        this.$curl({
          method: "get",
          url,
          responseType: "arraybuffer",
          onDownloadProgress(a) {
            var percent = 0
            percent = parseInt(100 * (a.loaded / a.total));
            _this.$nextTick(() => {
              _this.percent = percent;
              if (_this.percent == 100) _this.fileNum++;
            });
          },
        })
          .then((data) => {
            resolve(data);
          })
          .catch((error) => {
            reject(error.toString());
          });
      });
    },
    handleBatchDownload() {
      let _this = this;
      if (this.social.length == 0) return this.$Message.warning("请勾选文件！");
      let str = "/api/public/demo/download?fileId=";
      let arr = this.social.map((e) => {
        let obj = {};
        obj.api = str + JSON.parse(e).FileID;
        obj.FileName = JSON.parse(e).FileName;
        return obj;
      });
      const zip = new JSZip();
      const cache = {};
      const promises = [];
      Promise.mapSeries(arr, function(item, index, arrayLength) {
        return _this.getFile(item.api, index)
        .then((data) => {
          // 下载文件, 并存成ArrayBuffer对象
          zip.file(item.FileName + ".jpg", data, { binary: true }); // 逐个添加文件
          cache[item.FileName] = data;
        });
      }).then(() => {
        zip.generateAsync({ type: "blob" }).then((content) => {
          // 生成二进制流
          FileSaver.saveAs(content, "打包下载.zip"); // 利用file-saver保存文件
        });
        setTimeout(() => {
          _this.social = [];
          _this.fileNum = 0;
          _this.percent = 0;
          _this.indeterminate = false;
        }, 1500);
      });
     // arr.forEach((item, index) => {
      //   const promise = this.getFile(item.api, index)
      //   .then((data) => {
      //     // 下载文件, 并存成ArrayBuffer对象
      //     zip.file(item.FileName + ".jpg", data, { binary: true }); // 逐个添加文件
      //     cache[item.FileName] = data;
      //   });
      //   promises.push(promise);
      // });
      // Promise.all(promises).then(() => {
      //   zip.generateAsync({ type: "blob" }).then((content) => {
      //     // 生成二进制流
      //     FileSaver.saveAs(content, "打包下载.zip"); // 利用file-saver保存文件
      //   });
      //   setTimeout(() => {
      //     _this.social = [];
      //     _this.fileNum = 0;
      //     _this.percent = 0;
      //     _this.indeterminate = false;
      //   }, 1500);
      // });
    },
    upload(item) {
      let _this = this;
      let fileId = item.FileID;
      _this.$curl.get(`/api/public/demo/checkfile?fileId=${fileId}`).then(
        (res) => {
          window.location.href = "/api/public/demo/download?fileId=" + fileId;
        },
        function(err) {
          console.log("数据库没有数据");
        }
      );
    },
    formatFileSize(fileSize) {
      //文件大小格式转换
      if (fileSize < 1024) {
        return fileSize + " B";
      } else if (fileSize < 1024 * 1024) {
        var temp = fileSize / 1024;
        temp = temp.toFixed(2);
        return temp + " KB";
      } else if (fileSize < 1024 * 1024 * 1024) {
        var temp = fileSize / (1024 * 1024);
        temp = temp.toFixed(2);
        return temp + " MB";
      } else {
        var temp = fileSize / (1024 * 1024 * 1024);
        temp = temp.toFixed(2);
        return temp + " GB";
      }
    },
    icon(item) {
      //目前只有图片可用

      let flieArr;
      let suffix;
      try {
        flieArr = item.FileName.split(".");
        suffix = flieArr[flieArr.length - 1];
      } catch (err) {
        suffix = "";
      }
      let icon = "";
      switch (suffix.toLowerCase()) {
        // {
        //   case 'jpg':icon="fa fa-file-picture-o fa-4x";
        //   break;
        //   case 'png':icon="fa fa-file-picture-o fa-4x";
        //   break;
        //   case 'gif':icon="fa fa-file-picture-o fa-4x";
        //   break;
        //   case 'zip':icon="fa fa-file-zip-o fa-4x";
        //   break;
        //   case 'rar':icon="fa fa-file-zip-o fa-4x";
        //   break;
        //   case 'txt':icon="fa fa-file-text-o fa-4x";
        //   break;
        //   case 'doc':icon="fa fa-file-word-o fa-4x";
        //   break;
        //   case 'xlsx':icon="fa fa-file-excel-o fa-4x";
        //   break;
        //   case 'mp4':icon="fa fa-file-video-o fa-4x";
        //   break;
        //   case 'avi':icon="fa fa-file-video-o fa-4x";
        //   break;
        //   case 'pdf':icon="fa fa-file-pdf-o fa-4x";
        //   break;
        //   case 'pptx':icon="fa fa-file-powerpoint-o fa-4x";
        //   break;
        //   case 'js':icon="fa fa-file-code-o fa-4x";
        //   break;
        //   case 'mp3':icon="fa fa-file-sound-o  fa-4x";
        //   break;
        //   default:icon='fa fa-file-o fa-4x'
        // }
        case "jpg":
          icon = "jpg";
          break;
        case "png":
          icon = "png";
          break;
        case "gif":
          icon = "gif";
          break;
        case "zip":
          icon = "zip";
          break;
        case "rar":
          icon = "zip";
          break;
        case "txt":
          icon = "txt";
          break;
        case "doc":
          icon = "doc";
          break;
        case "xlsx":
          icon = "excel";
          break;
        case "excel":
          icon = "excel";
          break;
        case "mp4":
          icon = "mp4";
          break;
        case "avi":
          icon = "mp4";
          break;
        case "pdf":
          icon = "pdf";
          break;
        case "pptx":
          icon = "ppt";
          break;
        case "ppt":
          icon = "ppt";
          break;
        case "js":
          icon = "js";
          break;
        case "mp3":
          icon = "mp3";
          break;
        default:
          icon = "unknow";
      }
      return icon;
    },
  },
};
</script>
<style lang="scss" scoped>
.content_nav {
  height: 40px;
  margin: 16px 16px 0 16px;
  display: flex;
  align-items: center;
  .content_nav-switch {
    display: flex;
    align-items: center;
  }
}
.demo_uploadbody {
  height: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .demo_item {
    width: 300px;
    margin: 10px auto 0 auto;
    padding: 5px !important;
    border: 1px solid red;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    cursor: pointer;
    .demo_item_icon {
      display: flex;
      align-items: center;
      padding: 5px;
      position: relative;
      .demo_item_svg {
        width: 51px;
        height: 58px;
      }
      .demo_item_i {
        left: 43px;
        position: absolute;
        top: 55px;
      }
    }
    .demo_item_msg {
      flex-direction: column;
      display: flex;
      justify-content: space-between;
      flex: 2 1 0%;
      margin-left: 10px;
      height: 100%;
      padding: 5px 5px 0 0;
      .demo_item_fileName {
        font-size: 15px;
        align-self: flex-start;
        font-weight: bold;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .demo_item_fileSize {
        display: flex;
        justify-content: space-between;
      }
    }
    &:hover {
      .demo_item_opera {
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.3);
      }
    }
    .demo_item_opera {
      display: none;
    }
  }
  .demo_transparentBox {
    margin: 10px auto;
    padding: 5px;
    position: relative;
    border: 1px solid red;
    text-align: left;
    display: flex;
    width: 300px;
    opacity: 0;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
