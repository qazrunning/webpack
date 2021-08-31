;
(function (global, factory) {
		typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
			typeof define === 'function' && define.amd ? define(factory) :
			global.h5plus = factory()
	}
	(this, (function () {
		'use strict';
		
		 return   new function(){
			let _this = this
			_this.appCamera = function appCamera(cameraPath) { //拍照 ok
				return new Promise(function (resolve, reject) {
					var cmr = plus.camera.getCamera(); //创建一个相机的实例
					var res = cmr.supportedImageResolutions[13]; // 拍照或摄像的文件格式
					var fmt = cmr.supportedImageFormats[0]; //图片的类型
					cmr.captureImage(function (path) {
							alert("(本地URL路径)文件以保存在: " + path);
							var connectionStatus = plus.networkinfo.getCurrentType(); //检测当前网络状态
							if (connectionStatus == 0 || connectionStatus == 1) {
								alert('无法上传(无法连接网络),请连接公司WiFi!!!');
							} else if (connectionStatus == 3) {
								resolve(path)
							} else {
								alert('上传失败!!!!----请连接公司wifi!');
							}
						},
						function (error) {
							console.log("Capture image failed: " + error.message);
							alert("Capture image failed: " + error.message);
							reject(error)
						}, {
							filename: cameraPath, //(String 类型 )  //默认存在_doc 目录下(测试时发现好像只能存储在_doc目录下)
							format: fmt, // format: (String 类型 )  拍照或摄像的文件格式
							resolution: res, //拍照或摄像使用的分辨率
							optimize: true //是否优化图片,有些Android手机拍的照片方向是不确定的
						}
					);
				})
				//具体细节去到官网查看  http://www.html5plus.org/doc/zh_cn/camera.html#plus.camera.CameraOptions
			},
			_this.videoCapture = function (videoPath, duration) { //拍摄视频 ok
				return new Promise(function (resolve, reject) {
					var cmr = plus.camera.getCamera(); //创建相机实例
					var res = cmr.supportedVideoResolutions[0]; // 拍照或摄像的文件格式
					var fmt = cmr.supportedVideoFormats[0]; //视频的类型(MP4)
					console.log("Resolution: " + res + ", Format: " + fmt);
					cmr.startVideoCapture(function (path) { //成功拍摄时的回调函数
							alert("文件以保存在:" + path);
							console.log('--------------' + path)
							var connectionStatus = plus.networkinfo.getCurrentType(); //判断网络状态
							if (connectionStatus == 0 || connectionStatus == 1) {
								alert('无法上传(无法连接网络),请连接公司WiFi!!!');
							} else if (connectionStatus == 3) {
								resolve(path)
							} else {
								alert('上传失败!!!!----请连接公司wifi!');
							}
						},
						function (error) { //拍摄失败的回调函数
							reject(error)
							alert("Capture video failed: " + error.message);
						}, {
							filename: videoPath, //视频存放的绝对路径
							videoMaximumDuration: duration, //视频录制的时长 单位s
							resolution: res, // 拍照或摄像的文件格式
							format: fmt //视频的类型(MP4)
						}
					);
				})
			},
			
			_this.appSqliteOpen = function (sqlName, sqliteDBpath) { //打开数据库 ok
				return new Promise(function (resolve, reject) {
					if (plus.sqlite.isOpenDatabase({ //判断数据库是否打开
							name: sqlName,
							path: sqliteDBpath,
						})) {
						alert('数据库已经打开！！！！')
					} else {
						plus.sqlite.openDatabase({ // 打开数据库
							name: sqlName, //设置打开或创建数据库的名称
							path: sqliteDBpath, //生成db文件以及db-journal文件（用于事件回滚）
							success: function (e) { //打开或创建数据库的成功时的回调
								console.log('ok')
								// alert('ok')
								resolve(e)
							},
							fail: function (e) { //失败的回调
								console.log(e.message)
								reject(e.message)
							}
						});
					}
				})
			},
			_this.appSqliteClose = function (sqlName) { //关闭数据库 ok
				return new Promise(function (resolve, reject) {
					plus.sqlite.closeDatabase({
						name: sqlName, //设置关闭数据库的名称
						success: function (e) { //关闭数据库的成功时的回调
							console.log('ok')
							// alert('ok')
							resolve(e)
						},
						fail: function (e) { //失败的回调
							console.log(e.message)
							reject(e)
						}
					});
				})

			},
			_this.appSqliteOperate = function (sqlName, sqlStatements) { //执行sql语句的增删改 ok
				return new Promise(function (resolve, reject) {
					plus.sqlite.executeSql({ //执行sql语句的增删改
						name: sqlName, //sql的名称
						sql: sqlStatements, //要执行的操作
						success: function (e) { //执行sql语句成功时的回调
							console.log('ok');
							// alert('ok')
							resolve(e)
						},
						fail: function (e) { //执行sql语句失败时的回调
							alert(e.message)
							reject()
							console.log(e.message)
						}
					});
				})

			},
			_this.appSqliteSelect = function(sqlName, sqlStatements) { //查询数据库信息的方法 ok
				return new Promise(function (resolve, reject) {
					plus.sqlite.selectSql({ //查询数据库信息的方法
						name: sqlName, //要查询数据库的名称
						sql: sqlStatements, //查询的语句
						success: function (e) { //查询成功的回调
							// alert('ok')
							console.log('selectSql success: ');
							resolve(e)
						},
						fail: function (e) { //执行sql语句失败时的回调
							console.log('selectSql failed: ' + JSON.stringify(e));
							reject(e)
						}
					});
				})
			},
			_this.appUpload= function (path, uploadApi) { //上传  ok
				plus.io.resolveLocalFileSystemURL(
					//拍照成功是获取收相片信息
					path,
					function (entry) {
						// 可通过entry对象操作test.html文件
						entry.file(function (file) {
							var fileReader = new plus.io.FileReader();
							console.log("图片存储的本地路径----------" + entry.fullPath); //图片的绝对路径
							console.log("getFile:" + JSON.stringify(file)); //图片的信息
							fileReader.readAsDataURL(file); //以URL编码格式读取文件数据内容
							fileReader.onloadend = function (evt) { //文件读取操作完成时的回调函数
								// _this.url = evt.target.result;
								var task = plus.uploader.createUpload( //上传图片 
									uploadApi, //上传图片的服务器地址（ps:测试时请把IP地址换成自己的网络IP地址）
									{
										method: 'POST', //请求类型
									},
									function (t, status) {
										// 上传完成
										if (status == 200) {
											alert('上传成功');
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
					function (e) {
						alert("Resolve file URL failed: " + e.message);
						console.log("Resolve file URL failed: " + e.message);
					}
				);
			},
			_this.appPick = function appPick() { //调用手机相册 ok
				return new Promise(function (resolve, reject) {
					plus.gallery.pick( //调用手机相册
						function (path) {
							alert(path);
							resolve(path)
							console.log('--------' + path)
						},
						function (e) {
							reject(e)
							alert(e.message);
						}, {
							filter: 'none', //系统相册选择器中可选择的文件类型，可设置为仅选择图片文件（“image”）、视频文件（“video”）或所有文件（“none”），默认值为“image”
							system: true, //是否使用系统相册文件选择界面
							multiple: false, //是否支持多选照片(目前只支持单选)
						}
					);
				})

			},
			_this.ioFileOperation=function ioFileOperation(path) { //传入目录的路径或者文件的路径 回调 获取目录对象或文件对象
				return new Promise(function (resolve, reject) {
					plus.io.resolveLocalFileSystemURL(
						path,
						function (entry) {
							resolve(entry)
						},
						function (e) {
							reject(e)
							alert('获取io操作对象失败');
						}
					)
				})

			} 

			_this.appSqlite = function(sqlName, sqliteDBpath){  //sqlite增删改查
				_this.appSqliteOpen(sqlName,sqliteDBpath)
				return{
					Query:function(sqlStatements){ //查询 ok
							return new Promise(function (resolve, reject) {
								plus.sqlite.selectSql({ //执行sql语句的增删改
									name: sqlName, //sql的名称
									sql: sqlStatements, //要执行的操作
									success: function (e) { //执行sql语句成功时的回调
										console.log('ok');
										resolve(e)
										_this.appSqliteClose(sqlName)
									},
									fail: function (e) { //执行sql语句失败时的回调
										alert(e.message)
										reject()
										console.log(e.message)
									}
								});
							})
					},
					Insert:function(tablename,insertobj){  //单行插入 ok
						return new Promise(function (resolve, reject) {
						let keyarr = []
						let valuearr = []
						Object.keys(insertobj).forEach(function(key){
							keyarr.push(`'${key}'`)
							valuearr.push(`'${insertobj[key]}'`)
						})
						var sql  = `insert into ${tablename}  (${keyarr.join() }) values (${valuearr.join()})`
						// console.log(sql)

						
							plus.sqlite.executeSql({ //执行sql语句的增删改
								name: sqlName, //sql的名称
								sql: sql, //要执行的操作
								success: function (e) { //执行sql语句成功时的回调
									console.log('ok');
									resolve(e)
									_this.appSqliteClose(sqlName) 

								},
								fail: function (e) { //执行sql语句失败时的回调
									alert(e.message) 
									reject()
									_this.appSqliteClose(sqlName) 
								}
							});
						})
					},
					Delete:function(tablename,deleteobj){  //删除 ok
					return new Promise(function (resolve, reject) {
						if(deleteobj){
						let { wherestr , replacements} = deleteobj //解构传过来的对象
						let arr  = wherestr.split(" ") // 字符串转数组
						arr.forEach((el,index)  => {
							if((el.split(":")[1])){ //找到 ：后面的字段
								console.log(el.split(":")[0])
								Object.keys(replacements).forEach(function(key){ 
									if(el.split(":")[1]===key){ 
										arr[index] = `${el.split(":")[0]}'${replacements[key]}'` //修改数组的值
									}
								})
							}
						});
						var sql = ` DELETE FROM ${tablename} ${ arr.join(' ') } ` //重新拼接sql语句
						console.log(sql)
					}else{
						var sql = ` DELETE FROM ${tablename}`
						console.log(sql)
					}
						
							plus.sqlite.executeSql({ //执行sql语句的增删改
								name: sqlName, //sql的名称
								sql:sql  , //要执行的操作
								success: function (e) { //执行sql语句成功时的回调
									console.log('ok');
									resolve(e)
									_this.appSqliteClose(sqlName)

								},
								fail: function (e) { //执行sql语句失败时的回调
									alert(e.message) 
									reject()
									_this.appSqliteClose(sqlName)
								}
							});
						})
					},
					Update:function(tablename,msgobj,updateobj){  //修改数据 ok
						return new Promise(function (resolve, reject) {
						let { wherestr , replacements} = updateobj //解构传过来的对象
						let arr  = wherestr.split(" ") // 字符串转数组
						arr.forEach((el,index)  => {
							if((el.split(":")[1])){ //找到 ：后面的字段
								Object.keys(replacements).forEach(function(key){ 
									if(el.split(":")[1]===key){ 
										arr[index] = `${el.split(":")[0]}'${replacements[key]}'` //修改数组的值
									}
								})
							}
						});
						let msg = []
						Object.keys(msgobj).forEach(function(key){ 
							msg.push(`${key}='${msgobj[key]}'`)
						})
						
						// UPDATE database SET location = 'li22', age='23'  where ct='北京' and location='安乐林' or age='22' 
						let sql = `UPDATE ${tablename} SET ${msg.join()} ${arr.join(' ')}`
						console.log(sql)
						
							plus.sqlite.executeSql({ //执行sql语句的增删改
								name: sqlName, //sql的名称
								sql: sql, //要执行的操作
								success: function (e) { //执行sql语句成功时的回调
									console.log('ok');
									resolve(e)
									_this.appSqliteClose(sqlName)

								},
								fail: function (e) { //执行sql语句失败时的回调
									alert(e.message) 
									reject()
									_this.appSqliteClose(sqlName)
								}
							});
						})
					},
					//进阶
					InsertList:function(tablename,insertarr){  //多行插入 ok
					return new Promise(function (resolve, reject) {
						var sql = ''
						insertarr.forEach((el,index) => {
							let keyarr = []
							let valuearr = []
							Object.keys(el).forEach(function(key){
								keyarr.push(`'${key}'`)
								valuearr.push(`'${el[key]}'`)
							})
							if(index==0){ 
							 sql  = `insert into ${tablename}  (${keyarr.join() }) VALUES (${valuearr.join()}) `
							}else{
							 sql  = sql + `, (${valuearr.join()})`
							}
							})
							console.log(sql)
							plus.sqlite.executeSql({ //执行sql语句的增删改
								name: sqlName, //sql的名称
								sql: sql, //要执行的操作
								success: function (e) { //执行sql语句成功时的回调
									_this.appSqliteClose(sqlName) 
									resolve(e)
								},
								fail: function (e) { //执行sql语句失败时的回调
									alert(e.message) 
									_this.appSqliteClose(sqlName) 
									reject()
								}
							});
						});
					},
					QueryList:function(sqlStatements,queryListobj){ //条件查询 ok
						return new Promise(function (resolve, reject) {
							if(queryListobj){
								let {  replacements } = queryListobj //解构传过来的对象
								let arr  = sqlStatements.split(" ") // 字符串转数组
								arr.forEach((el,index)  => {
									if((el.split(":")[1])){ //找到 ：后面的字段
										Object.keys(replacements).forEach(function(key){ 
											if(el.split(":")[1]===key){ 
												arr[index] = `${el.split(":")[0]}'${replacements[key]}'` //修改数组的值
											}
										})
									}
								});
								var sql = ` ${arr.join(' ')} ` //重新拼接sql语句
								console.log(sql)
							}else{
								var sql = ` ${sqlStatements}`
								console.log(sql)
							}
							plus.sqlite.selectSql({ //执行sql语句的增删改
								name: sqlName, //sql的名称
								sql: sql, //要执行的操作
								success: function (e) { //执行sql语句成功时的回调
									console.log('ok');
									resolve(e)
									_this.appSqliteClose(sqlName)
								},
								fail: function (e) { //执行sql语句失败时的回调
									alert(e.message)
									reject()
									console.log(e.message)
									_this.appSqliteClose(sqlName)
								}
							});
						})
				
					},
					UpdateOrInsert:function(tablename,insertobj,updateOrInsertobj){ //更新或插入  ok
					let __this  = this
					return new Promise(function(resolve,reject){
						let {wherestr} = updateOrInsertobj
						let arr  = wherestr.split(" ") // 字符串转数组
						let obj = {}
						arr.forEach((el,index)  => {
							if((el.split(":")[1])){ //找到 ：后面的字段
								Object.keys(insertobj).forEach(function(key){ 
									if(el.split(":")[1]===key){ 
										arr[index] = `${el.split(":")[0]}'${insertobj[key]}'` //修改数组的值
										obj.replacements = {}
										obj.replacements[`${key}`] = insertobj[key]
										console.log(JSON.stringify(obj));
									}
								})
							}
						});
						console.log(`select * from ${tablename} ${arr.join(' ')}`)
						__this.Query(`select count(1) from ${tablename} ${arr.join(' ')}`).then(
							function(res){
								_this.appSqliteOpen(sqlName,sqliteDBpath)
								if(res[0]['count(1)']==0){
									__this.Insert(tablename,insertobj).then(function(res){
										_this.appSqliteClose(sqlName)
									}).then(
										function(){
											resolve()
										}
									)
								}else{
									obj.wherestr = wherestr
									console.log(JSON.stringify(obj));
									__this.Update(tablename,insertobj,obj).then(function(res){
										_this.appSqliteClose(sqlName)
									}).then(function(){
											resolve()
									})
									// console.log(JSON.stringify(res));
									
								}
							}
						)
					})
						
					}
				}
					
			}

		 }();
		 


	})));