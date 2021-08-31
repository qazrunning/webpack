module.exports = app => {

  app.loadRoutes();

  const {
    controller,
    apiRouter,
    router
  } = app;


  apiRouter.get('/public/demo/pbtest', controller.demo.pbtest.index);
  apiRouter.get('/public/demo/pbtestsqlbug', controller.demo.pbtest.pbtestsqlbug);

  apiRouter.get('/demo/lookuser', controller.demo.pbtest.lookuser);
  //测试上传文件
  apiRouter.post('/public/demo/testupload', controller.demo.upload.saveFile);
  //单点登录入口
  apiRouter.get('/public/demo/ssoLogin/entry', controller.demo.ssoLogin.entry);
  apiRouter.get('/public/demo/video', controller.demo.pbtest.video);
  
  apiRouter.post('/public/demo/smoke/submit', controller.demo.smoke.submit);




  apiRouter.get('/demo/usermanager/getall', controller.demo.usermanagerDemo.index);
  apiRouter.get('/demo/usermanager/get', controller.demo.usermanagerDemo.get);
  apiRouter.post('/demo/usermanager/update', controller.demo.usermanagerDemo.update);
  apiRouter.post('/demo/usermanager/add', controller.demo.usermanagerDemo.add);
  apiRouter.post('/demo/usermanager/del', controller.demo.usermanagerDemo.del);
  apiRouter.get('/demo/usermanagerDemo/search', controller.demo.usermanagerDemo.search);


  apiRouter.post('/demo/workflowtest/del', controller.demo.workflowDemo.del);
  apiRouter.post('/demo/workflowtest/getlist', controller.demo.workflowDemo.getlist);


  apiRouter.post('/demo/setTestRemind', controller.demo.testMQ.setTestRemind);
  apiRouter.get('/public/grpctest', controller.demo.testMQ.grpctest);

  // 消息推送测试
 

  apiRouter.get('/public/demo/readFile', controller.demo.uploadFiles.readFile);//读取文件
  apiRouter.post('/public/demo/saveFile', controller.demo.uploadFiles.saveFile);//上传文件并存储数据库
  router.get('/api/public/demo/download', controller.demo.uploadFiles.download);//下载文件 
  router.get('/api/public/demo/checkfile', controller.demo.uploadFiles.checkfile);//查询数据库文件是否存在


  // apiRouter.post('/demo/upload/saveFile', controller.demo.upload.saveFile);
  // apiRouter.get('/demo/upload/readFile', controller.demo.upload.readFile);

  apiRouter.get('/public/demo/logintitle', controller.demo.logintitle.gettitle);//登录页title 

  //树形结构模块
  apiRouter.get('/public/demo/treeconfig/getdata', controller.demo.treeConfig.getdata);
  apiRouter.post('/public/demo/treeconfig/savedata', controller.demo.treeConfig.savedata);

  //消息通知测试
  apiRouter.get("/notify/testgetData", controller.demo.testnotify.getData);
  apiRouter.post("/notify/testsend", controller.demo.testnotify.sendMsg);
  apiRouter.post("/notify/testcancel", controller.demo.testnotify.cancelMsg);
  apiRouter.post("/notify/testsetRead", controller.demo.testnotify.setRead);
  //自动升级服务
  router.post('/api/public/ops/update', controller.demo.updateFile.index)
  //环检公共路由
  apiRouter.get('/public/common/dm/:type', controller.common.commonController.getSelected);
  apiRouter.get('/common/query/:keycode', controller.common.commonController.DataQuery);
  //车辆管理
  //apiRouter.post('/demo/vehicle/add', controller.hj.vehicle.add);
  apiRouter.get('/demo/vehicle/get', controller.hj.vehicle.get);
  //apiRouter.put('/demo/vehicle/update', controller.hj.vehicle.update);
  //apiRouter.del('/demo/vehicle/delete', controller.hj.vehicle.del);
  //用户管理
  apiRouter.post('/demo/user/add', controller.hj.user.add);
  apiRouter.post('/demo/user/update', controller.hj.user.update);
  apiRouter.get('/demo/user/get', controller.hj.user.get);
  apiRouter.post('/demo/user/del', controller.hj.user.del);
  // apiRouter.get('/c440600/verify/Verify/GetEmissionStandardOfVehicle1',controller.common.commonController.DataQuery);
  //佛山路由
  require('./router/c440600')(app);
};