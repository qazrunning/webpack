<template>
  <div>
    <Card style="width:350px;margin:10px;auto">
      <p slot="title" style="text-align:center">
        <!-- <Icon type="ios-film-outline"></Icon> -->
        H5+常用功能--内置数据库sqlitdb
      </p>
      <div style="display: flex;
    flex-direction: column;">
        <Button type="primary" class="btn" @click="appshock">H5+接口测试手机震动</Button>
        <Button type="primary" class="btn" @click="appSqlitOpen">H5+数据库测试(打开或创建)</Button>
        <Button type="primary" class="btn" @click="appSqlitClose">H5+数据库测试(关闭)</Button>
        <Button type="primary" class="btn" @click="appSqlitOperate">H5+数据库测试(增加)</Button>
        <Button type="primary" class="btn" @click="appSqlitSelect">H5+数据库测试(查询)</Button>
      </div>
    </Card>
    <Card style="width:350px;margin:10px;auto">
      <p slot="title" style="text-align:center">
        <!-- <Icon type="ios-film-outline"></Icon> -->
        H5+常用功能--文件的读写
      </p>
      <div style="display: flex; 
    flex-direction: column;">
        <Input
          v-model="msg"
          placeholder="创建文件目录与文件的位置：Android/data/你app的名称/documents目录下(输入内容点击'写入文件内容按钮'改变文件内容...)"
          :rows="3"
          type="textarea"
          style="width:100%"
        />
        <Button type="primary" class="btn" @click="appAddStorage">H5+创建缓存</Button>
        <Button type="primary" class="btn" @click="appRemoveStorage">H5+删除缓存</Button>
        <Button type="primary" class="btn" @click="appWriteFile">H5+写入文件内容</Button>
        <Button type="primary" class="btn" @click="appReadFile">H5+查看文件内容</Button>
        <Button type="primary" class="btn" @click="appGetCatalogue">H5+创建文件夹</Button>
        <Button type="primary" class="btn" @click="appRemoveCatalogue">H5+删除文件夹</Button>
        <Button type="primary" class="btn" @click="appPick">H5+文件上传</Button>
      </div>
    </Card>
    <Card style="width:350px;margin:10px;auto">
      <p slot="title" style="text-align:center">
        <!-- <Icon type="ios-film-outline"></Icon> -->
        H5+常用功能--拍照上传
      </p>
      <div style="display: flex; 
    flex-direction: column;">
        <div style="text-align:center">
          <Icon type="md-camera" size="50" @click="appCamera" />
        </div>
        <div style="height:100%;margin-top:16px" v-if="url">
          <img :src="url" id="aa" style="width:100%;height:100%" />
        </div>
        <!-- <Button type="primary" class="btn" @click="appPickFile">上传图片</Button> -->
      </div>
    </Card>
    <Card style="width:350px;margin:10px;auto">
      <p slot="title" style="text-align:center">
        <!-- <Icon type="ios-film-outline"></Icon> -->
        H5+常用功能--视频录制上传
      </p>
      <div style="display: flex; 
    flex-direction: column;">
        <div style="text-align:center">
          <Icon type="ios-videocam" size="50" @click="appVideoCapture" />
        </div>
        <div style="height:100%;margin-top:16px">
          <video :src="vUrl" id="bb" controls="controls" width="100%" height="100%" v-if="vUrl"></video>
        </div>
        <!-- <Button type="primary" class="btn" @click="appPickFile">上传图片</Button> -->
      </div>
    </Card>
  </div>
</template>
<script>
//具体细节去到官网查看  http://www.html5plus.org/doc/zh_cn/camera.html#plus.camera.CameraOptions
// let a=  plus.io.convertLocalFileSystemURL( path )  //将本地URL路径转换成平台绝对路径
export default {
  data() {
    return {
      msg: "",//文本内容
      url: "",//图片展示src
      vUrl: "",//视频展示src
      uploadApi: "http://192.168.19.164:8080/api/public/demo/saveFile",//上传图片的服务器地址（ps:测试时请把IP地址换成自己的网络IP地址）
    };
  },
  methods: {
    appshock() {
      //测试pulsAPI
      plus.device.vibrate(500); //调用了手机震动的接口
    },
    appSqlitOpen() {
      //打开或创建数据库
      let _this = this;
      if (
        plus.sqlite.isOpenDatabase({
          //判断数据库是否打开
          name: "test", //数据库名称
          path: "_doc/skyland.db" //sqliteDB文件路劲
        })
      ) {
        alert("数据库已经打开！！！！");
      } else {
        plus.sqlite.openDatabase({
          // 打开数据库
          name: "test", //数据库名称
          path: "_doc/skyland.db", //生成db文件以及db-journal文件（用于事件回滚）
          success: function(e) {
            //成功打开数据库的回调
            console.log("ok");
            _this.$Message.success("ok");
          },
          fail: function(e) {
            //失败数据库的回调
            console.log(e.message);
            _this.$Message.error(e.message);
          }
        });
      }
    },
    appSqlitClose() {
      //关闭数据库
      let _this = this;
      plus.sqlite.closeDatabase({
        name: "test", //关闭数据库的名称
        success: function(e) {
          //成功的回调
          console.log("ok");
          _this.$Message.success("ok");
        },
        fail: function(e) {
          //失败的回调
          console.log(e.message);
          _this.$Message.error(e.message);
        }
      });
    },
    appSqlitOperate() {
      //增删改数据库
      let _this = this;
      plus.sqlite.executeSql({
        name: "test", //数据库的名称
        //写入SQL语句
        sql:
          'create table if not exists database("where" CHAR(110),"location" CHAR(100),"age" INT(11))',
        success: function(e) {
          //成功的回调
          console.log("ok");
          plus.sqlite.executeSql({
            //同上
            name: "test",
            sql: "insert into database values('北京','安乐林','11')",
            success: function(e) {
              console.log("executeSql success!");
              _this.$Message.success("executeSql success!");
            },
            fail: function(e) {
              console.log("executeSql failed: " + JSON.stringify(e));
              _this.$Message.error("executeSql failed: " + JSON.stringify(e));
            }
          });
        },
        fail: function(e) {
          //失败的回调
          console.log(e.message);
          _this.$Message.error(e.message);
        }
      });
    },
    appSqlitSelect() {
      //查询的sql
      let _this = this;
      plus.sqlite.selectSql({
        //执行查询的sql语句
        name: "test",
        sql: "select * from database",
        success: function(e) {
          console.log("selectSql success: " + JSON.stringify(e));
          _this.$Message.success("selectSql success: " + JSON.stringify(e));
        },
        fail: function(e) {
          console.log("selectSql failed: " + JSON.stringify(e));
          _this.$Message.error("selectSql failed: " + JSON.stringify(e));
        }
      });
    },
    appAddStorage() {
      //创建本地缓存
      let _this = this;
      plus.storage.setItem("name", "hcoder");
      var total = plus.storage.getItem("name"); //storage对应Key的value
      var number = plus.storage.getLength(); //storage的长度
      var keyNames = [];
      for (var i = 0; i < number; i++) {
        keyNames[i] = plus.storage.key(i);
      }
      console.log("storageKey---------" + JSON.stringify(keyNames));
      // plus.networkinfo.getCurrentType(); 网络连接状态
      _this.$Message.success("已创建------" + total);
    },
    appRemoveStorage() {
      //删除本地缓存
      let _this = this;
      plus.storage.removeItem("name"); //删除storagekey相对应的缓存
      // plus.storage.clear();
      var total = plus.storage.getLength();
      _this.$Message.success("已删除，缓存长度为------" + total);
    },
    appWriteFile() {
      //写与编辑文件
      let _this = this;
      plus.io.resolveLocalFileSystemURL(
        "_documents/", // 文件的存放路径 只有_documents 和 _downloads 目录下的文件才可以编辑以及创建 其他目录下只能读取
        function(entry) {
          console.log(entry.fullPath);
          entry.getFile(
            //创建或打开文件
            "test.txt", //文件名
            {
              create: true, //是否创建对象标记 指示如果文件或目录不存在时是否进行创建，默认值为false。
              exclusive: false //其本身没有任何效果，需与create属性值设置为true时一起使用，如果目标文件或目录已经存在则会导致文件或目录打开失败，默认值为false。
            },
            function(file) {
              file.createWriter(
                function(writer) {
                  writer.write(_this.msg);
                  _this.$Message.success("写入成功");
                },
                function(e) {
                  _this.$Message.error("写入失败" + e.message);
                }
              );
            },
            function(e) {
              _this.$Message.error("打开文件失败" + e.message);
            }
          );
        },
        function(e) {
          _this.$Message.error("打开文件夹" + e.message);
        }
      );
    },
    appReadFile() {
      //查看文件内容
      let _this = this;
      plus.io.resolveLocalFileSystemURL(
        "_documents/test.txt",
        function(entry) {
          console.log(entry.fullPath);
          entry.file(function(file) {
            //文件路径entry.file()
            var fileReader = new plus.io.FileReader();
            fileReader.readAsText(file, "utf-8");
            fileReader.onloadend = function(evt) {
              _this.$Message.success(
                "evt.target.result:" + JSON.stringify(evt.target.result)
              );
            };
          });
        },
        function(e) {
          _this.$Message.error(e.message);
        }
      );
    },
    appGetCatalogue() {
      //创建目录
      let _this = this;
      plus.io.resolveLocalFileSystemURL(
        "_documents",
        function(entry) {
          entry.getDirectory(
            "mytest",
            { create: true, exclusive: false },
            function(entry1) {
              _this.$Message.success("创建或打开成功");
            },
            function() {
              _this.$Message.error("创建或者打开子目录失败");
            }
          );
        },
        function(e) {
          _this.$Message.error("获取io操作对象失败-----" + e.message);
        }
      );
    },
    appRemoveCatalogue() {
      //删除目录
      let _this = this;
      plus.io.resolveLocalFileSystemURL(
        "_documents/mytest",
        function(entry) {
          entry.remove(function() {
            _this.$Message.success("删除成功");
          });
        },
        function(e) {
          _this.$Message.error("获取io操作对象失败------" + e.message);
        }
      );
    },
    appCamera() {
      //拍照上传 --- 上传图片的服务器地址为网络IP地址（ps:测试时请把IP地址换成自己的网络IP地址）
      let _this = this;
      var cmr = plus.camera.getCamera(); //创建相机
      // console.log( '摄像头支持的拍照分辨率:属性类型为String[]，若不支持此属性则返回空数组对象。------------'+JSON.stringify(cmr.supportedImageResolutions))
      // console.log( '摄像头支持的拍视频分辨率:属性类型为String[]，若不支持此属性则返回空数组对象。------------'+JSON.stringify(cmr.supportedVideoResolutions))
      // console.log( '摄像头支持的拍照文件格式:属性类型为String[]，若不支持此属性则返回空数组对象。------------'+JSON.stringify(cmr.supportedImageFormats ))
      // console.log( '摄像头支持的拍视频文件格式:属性类型为String[]，若不支持此属性则返回空数组对象。------------'+JSON.stringify(cmr.supportedVideoFormats  ))
      // alert( cmr.supportedImageResolutions );
      // var res = cmr.supportedImageResolutions[0];
      var fmt = cmr.supportedImageFormats[0];
      cmr.captureImage(
        //打开相机
        function(path) {
          console.log("(本地URL路径)Capture image success: " + path);
          plus.io.resolveLocalFileSystemURL(
            //拍照成功是获取收相片信息
            `${path}`,
            function(entry) {
              // 可通过entry对象操作test.html文件
              entry.file(function(file) {
                var fileReader = new plus.io.FileReader();
                console.log("图片存储的本地路径----------" + entry.fullPath); //图片的绝对路径
                console.log("getFile:" + JSON.stringify(file)); //图片的信息
                fileReader.readAsDataURL(file); //以URL编码格式读取文件数据内容
                fileReader.onloadend = function(evt) {
                  //文件读取操作完成时的回调函数
                  _this.url = evt.target.result;
                  var connectionStatus = plus.networkinfo.getCurrentType(); 
                  if (connectionStatus == 0 || connectionStatus == 1) {
                    alert('无法上传(无法连接网络),请连接公司WiFi!!!');
                  } else if (connectionStatus == 3) {
                    _this.appUpload(path) //调用上传图片视频方法
                  } else {
                    alert('上传失败!!!!----请连接公司wifi!');
                  }
                };
              });
            },
            function(e) {
              _this.$Message.error("Resolve file URL failed: " + e.message);
              console.log("Resolve file URL failed: " + e.message);
            }
          );
        },
        function(error) {
          _this.$Message.error("Capture image failed: " + e.message);
          console.log("Capture image failed: " + error.message);
        },
        {
          //配置拍照时参数
          filename: "_doc/images/", //(String 类型 )  //默认存在_doc 目录下(测试时发现好像只能存储在_doc目录下)
          format: fmt, // format: (String 类型 )  拍照或摄像的文件格式
          // resolution:res, 拍照或摄像使用的分辨率
          optimize: true
        }
      );
    },
    appVideoCapture() {
      // 上传视频
      let _this = this;
      console.log("---------这是视频录制功能测试");
      var cmr = plus.camera.getCamera();
      var res = cmr.supportedVideoResolutions[0];
      var fmt = cmr.supportedVideoFormats[0];
      console.log("Resolution: " + res + ", Format: " + fmt);
      cmr.startVideoCapture(
        function(path) {
          _this.$Message.success("Capture video success: " + path);
          console.log("--------------" + path);
          plus.io.resolveLocalFileSystemURL(
            //拍照成功是获取收相片信息
            `${path}`,
            function(entry) {
              // 可通过entry对象操作test.html文件
              entry.file(function(file) {
                var fileReader = new plus.io.FileReader();
                console.log("视频存储的本地路径----------" + entry.fullPath); //图片的绝对路径
                console.log("getFile:" + JSON.stringify(file)); //图片的信息
                fileReader.readAsDataURL(file); //以URL编码格式读取文件数据内容
                //这可以通过读取文件来获取文件的大小，通过if条件控制文件上传大小 if(file.size>200000).....
                fileReader.onloadend = function(evt) {
                  //文件读取操作完成时的回调函数
                  _this.vUrl = evt.target.result;
                  var connectionStatus = plus.networkinfo.getCurrentType(); //判断网络状态
                  if (connectionStatus == 0 || connectionStatus == 1) {
                    alert('无法上传(无法连接网络),请连接公司WiFi!!!');
                  } else if (connectionStatus == 3) {
                    _this.appUpload(path) //调用上传图片视频方法
                  } else {
                    alert('上传失败!!!!----请连接公司wifi!');
                  }
                };
              });
            },
            function(e) {
              _this.$Message.error("Resolve file URL failed: " + e.message);
              console.log("Resolve file URL failed: " + e.message);
            }
          );
        },
        function(error) {
          _this.$Message.success("Capture video failed: " + error.message);
        },
        {
          filename: "_doc/video/",
          videoMaximumDuration: 10,
          resolution: res,
          format: fmt
        }
      );
    },
    appPick() { //选择手机图片视频文件
      let _this = this;
      plus.gallery.pick(
        function(path) { //返回图片视频文件路径
          alert(path);
          _this.appUpload(path);
          console.log("--------" + path);
        },
        function(e) {
          alert(e.message);
        },
        {
          filter: "none", //系统相册选择器中可选择的文件类型，可设置为仅选择图片文件（“image”）、视频文件（“video”）或所有文件（“none”），默认值为“image”
          system: true, //是否使用系统相册文件选择界面
          multiple: false //是否支持多选照片(目前只支持单选)
        }
      );
    },
    appUpload(path) { //图片视频上传
    let _this = this 
    console.log('已经调用了图片视频上传');
      plus.io.resolveLocalFileSystemURL(
        //拍照成功是获取收相片信息
        path,
        function(entry) {
          // 可通过entry对象操作test.html文件
          entry.file(function(file) {
            var fileReader = new plus.io.FileReader();
            console.log("图片存储的本地路径----------" + entry.fullPath); //图片的绝对路径
            console.log("getFile:" + JSON.stringify(file)); //图片的信息
            fileReader.readAsDataURL(file); //以URL编码格式读取文件数据内容
            fileReader.onloadend = function(evt) {
              //文件读取操作完成时的回调函数
              // _this.url = evt.target.result;
              var task = plus.uploader.createUpload(
                //上传图片
                _this.uploadApi, //上传图片的服务器地址（ps:测试时请把IP地址换成自己的网络IP地址）
                {
                  method: "POST" //请求类型
                },
                function(t, status) {
                  // 上传完成
                  if (status == 200) {
                    alert("上传成功");
                    // alert("Upload success: " + t.url);
                    console.log("Upload success: " + t.url);
                  } else {
                    alert("Upload failed: " + status);
                  }
                }
              );
              task.addFile(path, {
                key: file.name
              }); //上传文件在上传任务中的键名，默认值为为文件名称。 上传任务中如果已经存在相同key的上传文件或数据将导致添加文件失败。
              task.addData("filesize", `${file.size}`);
              // task.addData("testkey", `testvalue`); 若想加更多的参数，则继续添加addData()
              //task.addEventListener( "statechanged", onStateChanged, false );
              task.start();
              // console.log('readAsDataURL-------------'+_this.url)   <--调试的时候有点慢，请耐心等待一下
            };
          });
        },
        function(e) {
          alert("Resolve file URL failed: " + e.message);
          console.log("Resolve file URL failed: " + e.message);
        }
      );
    }

    // appPickFile() { //选择照片上传
    //   let _this = this;
    //   // if(_this.url===''){
    //   //   _this.$Message.error("请拍摄照片");
    //   // }else{
    //   // }
    //   console.log("测试上传图片");
    //   plus.gallery.pick(
    //     function(path) {
    //       var task = plus.uploader.createUpload(
    //         "http://192.168.19.164:8080/api/public/demo/saveFile",
    //         { method: "POST", blocksize: 204800, priority: 100 },
    //         function(t, status) {
    //           console.log(JSON.stringify(t));
    //           console.log(status);
    //         }
    //       );
    //       task.start();
    //     },
    //     function(e) {
    //       mui.toast("取消了选择");
    //     }
    //   );
    // }
  }
};
</script>
<style >
.btn {
  margin: 10px;
}
</style>