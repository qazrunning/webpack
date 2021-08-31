<template lang="html">
  <div class="editor">
    <div ref="toolbar" class="toolbar"></div>
    <div ref="editor" class="text"></div>
  </div>
</template>

<script>
import E from "wangeditor";
import xss from "xss";
export default {
  name: "editoritem",
  data() {
    return {
      // uploadPath,
      editor: null,
      // info_: null,
      info_: `<a onclick='alert("xss攻击")'>链接</a>`,
    };
  },
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
      type: String,
      default: "",
    },
    isClear: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    isClear(val) {
      // 触发清除文本域内容
      if (val) {
        this.editor.txt.clear();
        this.info_ = null;
      }
    },
    value: function(value) {
      if (value !== this.editor.txt.html()) {
        this.editor.txt.html(this.value);
      }
    },
    //value为编辑框输入的内容，这里我监听了一下值，当父组件调用得时候，如果给value赋值了，子组件将会显示父组件赋给的值
  },
  mounted() {
    this.seteditor();
    this.editor.txt.html(this.value);
  },
  methods: {
       onError(event) {
         console.log(event);
      event.target.src = "static/img/imgError.png";
    },
    seteditor() {
      // http://192.168.2.125:8080/admin/storage/create
      this.editor = new E(this.$refs.toolbar, this.$refs.editor);
      this.editor.customConfig.uploadImgShowBase64 = true; // base 64 存储图片
      this.editor.customConfig.uploadImgServer = "/api/public/hj/uploadArticleFile"; // 配置服务器端地址
      this.editor.customConfig.uploadImgHeaders = {}; // 自定义 header
      this.editor.customConfig.uploadFileName = "1"; // 后端接受上传文件的参数名
      this.editor.customConfig.uploadImgMaxSize = 2 * 1024 * 1024; // 将图片大小限制为 2M
      this.editor.customConfig.uploadImgMaxLength = 6; // 限制一次最多上传 3 张图片
      this.editor.customConfig.uploadImgTimeout = 3 * 60 * 1000; // 设置超时时间

      // 配置菜单
      this.editor.customConfig.menus = [
        "head", // 标题
        "bold", // 粗体
        "fontSize", // 字号
        "head",
        "fontName", // 字体
        "italic", // 斜体
        "underline", // 下划线
        "strikeThrough", // 删除线
        "foreColor", // 文字颜色
        "backColor", // 背景颜色
        "link", // 插入链接
        "list", // 列表
        "justify", // 对齐方式
        "indent",
        "source",
        "quote", // 引用
        "emoticon", // 表情
        "image", // 插入图片
        "table", // 表格
        "indent",
        // 'video', // 插入视频
        "code", // 插入代码
        "undo", // 撤销
        "redo", // 重复
      ];

      this.editor.customConfig.uploadImgHooks = {
        fail: (xhr, editor, result) => {
          // 图片上传失败回调
          console.log("error", xhr, editor);
        },
        success: (xhr, editor, result) => {
          // 图片上传成功回调
        },
        timeout: (xhr, editor) => {
          // 网络超时的回调
        },
        error: (xhr, editor) => {
          // 图片上传错误的回调
        },
        customInsert: (insertImg, result, editor) => {
          window.alert = function() {
            return false;
          };
          insertImg(result.fullPath);
          this.$emit("getFileInfo", result);
          // }
        },
      };
    
      this.editor.customConfig.onchange = (html) => {
        var options = {
          whiteList: {
            audio: ["autoplay", "controls", "loop", "preload", "src", "class", "style", "_url"],
            img: ["src", "alt", "title", "width", "height", "id", "_src", "loadingclass", "class", "_url"],
            video: ["autoplay", "controls", "loop", "preload", "src", "height", "width", "class", "style"],
            source: ["src", "type"],
            embed: [
              "type",
              "class",
              "pluginspage",
              "src",
              "width",
              "height",
              "align",
              "style",
              "wmode",
              "play",
              "loop",
              "menu",
              "allowscriptaccess",
              "allowfullscreen",
            ],
          },
        };
        // myxss = new xss.FilterXSS(options);
        // let filterHtml = myxss.process(html);

        // let filterHtml = filterXSS(html); // 此处进行 xss 攻击过滤
        // this.info_ = filterHtml; // 绑定当前逐渐地值
      let regErr=/<img\b/gi
      html=html.replace(regErr,`<img  @error="onError($event)"`)
          this.info_ = html;
        // this.$emit("change", this.info_); // 将内容同步到父组件中
      };
        //失焦时候函数
      this.editor.customConfig.onblur = (html) =>{
       this.info_ = html;
        this.$emit("change", this.info_); // 将内容同步到父组件中
      };
         //获得焦点时候函数
      this.editor.customConfig.onfocus = (html) =>{
        this.$emit("focus", true); // 将内容同步到父组件中
      };
      // 创建富文本编辑器
      this.editor.create();
    },
  },
};
</script>

<style lang="scss" scoped>
.editor {
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 0;
}
.toolbar {
  border: 1px solid #ccc;
}

.text {
  border: 1px solid #ccc;
  height: 365px;
  overflow: hidden;
}

</style>
