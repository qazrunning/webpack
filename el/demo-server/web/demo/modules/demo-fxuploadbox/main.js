export default async () => {
  return {
    data() {
      let _this = this;
      return {
        msg: "暂无",
        needClear: false,
        items: [],
        opts: {
          url: "api/public/demo/testupload",
          init: {
            //首次初始化事件
            PostInit(uploader) {
            },
            BeforeUpload(uploader, file) {
              if (_this.needClear == true) {
                //清理文件
                _this.items.splice(0, _this.items.length);
                _this.needClear = false;
              }
              //每一个文件上传之前可以附带一些额外的参数
              uploader.setOption("multipart_params", {
                filesize: file.size
              });
            },
            //会在文件上传过程中不断触发，可以用此事件来显示上传进度
            UploadProgress(uploader, file) {
              _this.msg = `总体进度:${uploader.total.percent}%当前上传文件:${file.name},进度：${file.percent}%`
            },
            //当队列中的某一个文件上传完成后触发
            FileUploaded(uploader, file, responseObject) {
              // uploader为当前的实例对象，file为触发此事件的文件对象，responseObject为服务器返回的信息对象，它有以下3个属性：
              // response：服务器返回的文本
              // responseHeaders：服务器返回的头信息
              // status：服务器返回的http状态码，比如200
              let { status, response } = responseObject;
              _this.items.push(`上传完成:${file.name},响应状态:${status} 响应文本:${response},`)
              // console.log(responseObject);
            },
            //当上传队列中所有文件都上传完成后触发
            UploadComplete(uploader, files) {
              _this.msg = "所有文件队列完成"
              uploader.splice(0, files.length)
              _this.needClear = true;
            },
            Error(uploader, errObject) {
              let { message, file } = errObject
              _this.items.push(`上传失败:${file.name},错误:${message},`)
              // alert(errObject.message)
            }
          },
          //上传文件过滤参数
          filters: {
            //只允许上传图片类型
            mime_types: [
              { title: "压缩包", extensions: "rar,zip" },
              { title: "图片", extensions: "jpg,gif,png" }
            ],
            multipart: true,//true代表多选文件,false代表单选文件
            // max_file_size: "4000kb", //最大只能上传4000kb的文件
            prevent_duplicates: true //不允许选取重复文件
          }
        }
      }
    }
  }
}