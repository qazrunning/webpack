module.exports = app => {
    const {controller, apiRouter,router} = app;
    //环检业务路由
    apiRouter.post('/c440600/uploadFile/UploadFileData/GetBusinessFileInfo',controller.c440600.vehicleManagement.addVehicleInfoController.GetBusinessFileInfo);//获取车辆文件信息
    apiRouter.post('/c440600/verify/Verify/GetEmissionStandardOfVehicle',controller.c440600.vehicleManagement.addVehicleInfoController.getEmissionStandardOfVehicle);//计算排放标准
    apiRouter.post('/c440600/vehicle/Vehicle/VehicleExistsByVINOrVLPNAndColor',controller.c440600.vehicleManagement.addVehicleInfoController.VehicleExistsByVINOrVLPNAndColor);//判断是否存在车辆
    apiRouter.post('/c440600/vehicle/Vehicle/SaveNewVehicle',controller.c440600.vehicleManagement.addVehicleInfoController.SaveNewVehicle);//添加车辆信息
    apiRouter.post('/c440600/vehicle/Vehicle/ChangeHacCCAToAlarm',controller.c440600.vehicleManagement.addVehicleInfoController.ChangeHacCCAToAlarm);//添加车辆改变三元装置预警信息
    apiRouter.post('/c440600/Inspection/InspectionData/GetInspectionTimes',controller.c440600.vehicleManagement.addVehicleInfoController.GetInspectionTimes);//获取同一个检测周期检测次数
    apiRouter.get('/c440600/Inspection/Acceptance/CheckVehicleInAcceptanceRedis',controller.c440600.vehicleManagement.addVehicleInfoController.CheckVehicleInAcceptanceRedis);//查询redis中是否存在受理信息
    apiRouter.get('/c440600/Inspection/Acceptance/GetInspectionNum',controller.c440600.vehicleManagement.addVehicleInfoController.GetInspectionNum);//获取受理编号
    apiRouter.post('/c440600/Inspection/Acceptance/IsExitsWaitCheck_New',controller.c440600.vehicleManagement.addVehicleInfoController.IsExitsWaitCheck_New);//是否存在waitCheck信息

    // apiRouter.get('/public/hjyj/user/getUserIdAndDepartId', controller.hjyj.enterprise.base.baseInfoController.getUserIdAndDepartId);
    // apiRouter.get('c440600/businesscom/util/GetEspOrganizationBySessionAreaCode',controller.common.commonController.GetEspOrganizationByCity);
    // apiRouter.post('c440600/vehicle/Vehicle/VehicleExistsByVINOrVLPNAndColor',controller.c440600.vehicleManagement.AddVehicleInfoController);

    // 获取表字典表数据
    apiRouter.get('/hj/getCDData', controller.c440600.stationManagement.exhaustData.getCDData);

    // 首屏站点管理
    apiRouter.get('/hj/getAllStation', controller.c440600.stationManagement.stationManagementController.getAllStation);
    apiRouter.get('/hj/getAllStationPage', controller.c440600.stationManagement.stationManagementController.getAllStationPage);  // 获取全部站点信息
    apiRouter.post('/hj/saveStationArea', controller.c440600.stationManagement.stationManagementController.saveStationArea);  // 添加站点行政区域
    apiRouter.get('/hj/getAllArea', controller.c440600.stationManagement.stationManagementController.getAllArea);  // 获取行政区域列表
    apiRouter.get('/hj/getOtherBusinessID', controller.c440600.stationManagement.stationManagementController.getOtherBusinessID);  // 获取选中区域之外的站点
    apiRouter.post('/hj/updateStationInfo', controller.c440600.stationManagement.stationManagementController.updateStationInfo);  // 更新站点信息
    apiRouter.post('/hj/removeArea', controller.c440600.stationManagement.stationManagementController.removeArea);  // 删除行政区域
    apiRouter.post('/hj/updateStationInfo', controller.c440600.stationManagement.stationManagementController.updateStationInfo);  // 更新站点信息
    // apiRouter.get('/hj/getChildrenArea', controller.c440600.stationManagement.stationManagementController.getChildrenArea);  // 根据父级获取子级区域下的站点信息
    apiRouter.post('/hj/updateAreaGroup', controller.c440600.stationManagement.stationManagementController.updateAreaGroup);  // 更新站点分组规则
    apiRouter.get('/hj/getSysConfig', controller.c440600.stationManagement.stationManagementController.getSysConfig);
    apiRouter.get('/hj/GetStationScoringIntegral', controller.c440600.stationManagement.stationManagementController.GetStationScoringIntegral); //获取点位计分
    apiRouter.get('/hj/getDataAnalysisFromRedis', controller.c440600.stationManagement.stationManagementController.getDataAnalysisFromRedis);
    apiRouter.get('/hj/getexternalImgIP', controller.c440600.stationManagement.stationManagementController.getexternalImgIP);
    apiRouter.get('/hj/getSmokeCapturePath', controller.c440600.stationManagement.stationManagementController.getSmokeCapturePath);
    apiRouter.get('/hj/getisImageCenterEnd', controller.c440600.stationManagement.stationManagementController.getisImageCenterEnd);
    apiRouter.get('/hj/getisVideoCenterEnd', controller.c440600.stationManagement.stationManagementController.getisVideoCenterEnd);
    apiRouter.get('/hj/getreSure', controller.c440600.stationManagement.stationManagementController.getreSure);
    apiRouter.get('/hj/getstationLine', controller.c440600.stationManagement.stationManagementController.getstationLine);
    apiRouter.get('/hj/GetDVRInfo', controller.c440600.stationManagement.stationManagementController.GetDVRInfo);
    apiRouter.get('/hj/GetStationDevice', controller.c440600.stationManagement.stationManagementController.GetStationDevice);
    apiRouter.get('/hj/getLineCheckInfo', controller.c440600.stationManagement.stationManagementController.getLineCheckInfo);
    apiRouter.get('/hj/GetStationStaff', controller.c440600.stationManagement.stationManagementController.GetStationStaff);
    apiRouter.get('/hj/GetLineByStationCode', controller.c440600.stationManagement.stationManagementController.GetLineByStationCode);
    apiRouter.get('/hj/getStationConfig', controller.c440600.stationManagement.stationManagementController.getStationConfig);
    apiRouter.get('/hj/GetInspectionMethod', controller.c440600.stationManagement.stationManagementController.GetInspectionMethod);
    apiRouter.get('/hj/getstationCameras', controller.c440600.stationManagement.stationManagementController.getstationCameras);
    apiRouter.get('/hj/getUserCity', controller.c440600.stationManagement.stationManagementController.getUserCity);

    //检测方法设置
    apiRouter.get('/hj/GetInspectionMethod', controller.c440600.stationManagement.stationManagementController.GetInspectionMethod);
    apiRouter.post('/hj/SETInspectionMethod', controller.c440600.stationManagement.stationManagementController.SETInspectionMethod);
    apiRouter.post('/hj/ADDInspectionMethod', controller.c440600.stationManagement.stationManagementController.ADDInspectionMethod);
    apiRouter.get('/hj/GetStationInfo', controller.c440600.stationManagement.stationManagementController.GetStationInfo);
    apiRouter.get('/hj/GetselfChecking', controller.c440600.stationManagement.stationManagementController.GetselfChecking);
    apiRouter.get('/hj/GetcarfChecking', controller.c440600.stationManagement.stationManagementController.GetcarfChecking);
    apiRouter.get('/hj/getstationLine', controller.c440600.stationManagement.stationManagementController.getstationLine);
    // apiRouter.get('/hj/GetDVRInfo', controller.c440600.stationManagement.stationManagementController.GetDVRInfo);
    apiRouter.get('/hj/GetStationDevice', controller.c440600.stationManagement.stationManagementController.GetStationDevice);
    apiRouter.get('/hj/GetStationStaff', controller.c440600.stationManagement.stationManagementController.GetStationStaff);
    apiRouter.get('/hj/getStaffimg', controller.c440600.stationManagement.stationManagementController.getStaffimg);
    apiRouter.get('/hj/getLineCheckInfo', controller.c440600.stationManagement.stationManagementController.getLineCheckInfo);
    apiRouter.get('/hj/getSelfCheckData', controller.c440600.stationManagement.stationManagementController.getSelfCheckData);
    apiRouter.get('/public/hj/getStationPublicInfo', controller.c440600.stationManagement.stationManagementController.getStationPublicInfo);
    apiRouter.get('/hj/getStaffSum', controller.c440600.stationManagement.stationManagementController.getStaffSum);

    //站点详细信息
    apiRouter.get('/hj/getStations', controller.c440600.stationManagement.stationManagementController.getStations);
    apiRouter.get('/hj/getStationimg', controller.c440600.stationManagement.stationManagementController.getStationimg);
    apiRouter.get('/hj/GetStationIntegral', controller.c440600.stationManagement.stationManagementController.GetStationIntegral);
    apiRouter.get('/hj/getSeachTable', controller.c440600.stationManagement.stationManagementController.getSeachTable);
    apiRouter.post('/hj/hasAuthority', controller.c440600.stationManagement.exhaustData.hasAuthority);
    apiRouter.post('/hj/hasAuthoritys', controller.c440600.stationManagement.exhaustData.hasAuthoritys);

    //站点管理新增
    apiRouter.post('/hj/addOrUpdateStation', controller.c440600.stationManagement.stationManagementController.addOrUpdateStation);
    apiRouter.post('/hj/AddTableRedis', controller.c440600.stationManagement.stationManagementController.AddTableRedis);
    apiRouter.post('/hj/SetTableRedis', controller.c440600.stationManagement.stationManagementController.SetTableRedis);
    apiRouter.post('/hj/delectTableID', controller.c440600.stationManagement.stationManagementController.delectTableID);
    apiRouter.post('/hj/uploadImage', controller.c440600.stationManagement.stationManagementController.uploadImage);

    // 存储在redis
    apiRouter.post('/hj/saveAreaRedis', controller.c440600.stationManagement.exhaustData.saveAreaRedis);

    // 检测报告
    apiRouter.get('/hj/getUserProcessMenuConfig', controller.c440600.reportManagement.reportManagement.getUserProcessMenuConfig);  // 获取用户个性化tab栏配置
    apiRouter.post('/hj/changeUserThema', controller.c440600.reportManagement.reportManagement.changeUserThema); //修改用户个性化tab栏设置
    apiRouter.post('/hj/getHistorySearch', controller.c440600.reportManagement.reportManagement.getHistorySearch);//获取检测数据
    apiRouter.get('/hj/GetInspectionResultNew', controller.c440600.reportManagement.reportManagement.GetInspectionResultNew);//检测结果
    apiRouter.post('/hj/AddChangeLog', controller.c440600.reportManagement.reportManagement.AddChangeLog);//打印报告记录日志
    apiRouter.get('/hj/getSelStationInfo', controller.c440600.reportManagement.reportManagement.getSelStationInfo);//检测照片
    apiRouter.get('/hj/getStationVideoType', controller.c440600.reportManagement.reportManagement.getStationVideoType);//检测录像
    apiRouter.get('/hj/getInspectProcessFromDB', controller.c440600.reportManagement.reportManagement.getInspectProcessFromDB);//过程数据
    apiRouter.get('/hj/getObdInspectProcess', controller.c440600.reportManagement.reportManagement.getObdInspectProcess);//OBD过程数据
    apiRouter.get('/hj/getBlackBoxProcess', controller.c440600.reportManagement.reportManagement.getBlackBoxProcess);//黑匣子过程数据
    apiRouter.get('/hj/getProxyPath', controller.c440600.reportManagement.reportManagement.getProxyPath);//
    apiRouter.get('/hj/getBlackSmokeCheck', controller.c440600.reportManagement.reportManagement.getBlackSmokeCheck);//黑烟车数据
    apiRouter.get('/hj/getResultDBInfo', controller.c440600.reportManagement.reportManagement.getResultDBInfo);//过程数据
    apiRouter.get('/hj/getFuelProcessData', controller.c440600.reportManagement.reportManagement.getFuelProcessData);//燃油蒸发过程数据/
    apiRouter.get('/hj/getBlackSmokeParam', controller.c440600.reportManagement.reportManagement.getBlackSmokeParam);
    apiRouter.get('/hj/getAppearanceInfoData', controller.c440600.reportManagement.reportManagement.getAppearanceInfoData);//外检信息
    apiRouter.get('/hj/getisUseMapIP', controller.c440600.reportManagement.reportManagement.getisUseMapIP);
    apiRouter.get('/hj/getMapIPtoIE', controller.c440600.reportManagement.reportManagement.getMapIPtoIE);
    apiRouter.get('/hj/getAllSysConfig', controller.c440600.reportManagement.reportManagement.getAllSysConfig);
    apiRouter.get('/hj/getDVRInfo', controller.c440600.reportManagement.reportManagement.getDVRInfo);
    apiRouter.get('/public/hj/getVideoChannel', controller.c440600.reportManagement.reportManagement.getVideoChannel);
    apiRouter.get('/hj/getAlarmHistory', controller.c440600.reportManagement.reportManagement.getAlarmHistory);
    // 维修管理
    //获取海南维修厂信息
    apiRouter.post('/hj/searchHNFactoryInfo', controller.c440600.specialBusiness.specialBusiness.seacrchHNFactory)

    // IM维修信息
    apiRouter.get('/hj/IM/getRepairData', controller.c440600.getIMRepairInfo.getIMRepairInfo.getRepairData); //获取维修信息(海南IM)
    apiRouter.get('/hj/IM/getAllRepairInfo', controller.c440600.getIMRepairInfo.getIMRepairInfo.getAllRepairInfo); //获取维修信息(统一IM)
    apiRouter.get('/hj/IM/getlastInspectionNum', controller.c440600.getIMRepairInfo.getIMRepairInfo.getlastInspectionNum); // 获取上一次检测编号
    apiRouter.get('/hj/IM/getMaintainDetail', controller.c440600.getIMRepairInfo.getIMRepairInfo.getMaintainDetail); //获取维修详细详细
    apiRouter.get('/hj/IM/getImgToUpload', controller.c440600.getIMRepairInfo.getIMRepairInfo.getImgToUpload); //获取维修图片类型
    apiRouter.get('/hj/IM/getSuccessInfoIM', controller.c440600.getIMRepairInfo.getIMRepairInfo.getSuccessInfoIM); //获取发送成功的检测信息
    apiRouter.get('/hj/IM/getIMfujianInfo', controller.c440600.getIMRepairInfo.getIMRepairInfo.getIMfujianInfo); //IM维修后复检情况统计
    apiRouter.get('/hj/IM/getStationFilterRole', controller.c440600.getIMRepairInfo.getIMRepairInfo.getStationFilterRole); //获取站点权限
    apiRouter.get('/hj/IM/getIsfujian', controller.c440600.getIMRepairInfo.getIMRepairInfo.getIsfujian); //获取维修后是否有复检
    apiRouter.get('/hj/IM/getIMfujianInfo', controller.c440600.getIMRepairInfo.getIMRepairInfo.getIMfujianInfo); //IM维修后复检情况统计
    apiRouter.get('/hj/IM/getNoQualifiedReport', controller.c440600.getIMRepairInfo.getIMRepairInfo.getNoQualifiedReport); ////IM从主检测表关联结果表获取尾气不合格数据

    // 业务审核
    apiRouter.get('/hj/getAuditInfo', controller.c440600.businessAudit.businessAudit.getAuditInfo);
    apiRouter.get('/hj/getAcceptAudit', controller.c440600.businessAudit.businessAudit.getAcceptAudit);
    apiRouter.get('/hj/getAuditHistory', controller.c440600.businessAudit.businessAudit.getAuditHistory);
    apiRouter.post('/hj/SaveAuditForWaitCheck', controller.c440600.businessAudit.businessAudit.SaveAuditForWaitCheck);
    apiRouter.get('/hj/getStandardGas', controller.c440600.businessAudit.businessAudit.getStandardGas);
    apiRouter.get('/hj/getStandardGasData', controller.c440600.businessAudit.businessAudit.getStandardGasData);
    apiRouter.get('/hj/getLambdaLimit', controller.c440600.businessAudit.businessAudit.getLambdaLimit);
    apiRouter.get('/hj/getCartTypeList', controller.c440600.businessAudit.businessAudit.getCartTypeList);
    apiRouter.post('/hj/getEmissionStandard', controller.c440600.businessAudit.businessAudit.getEmissionStandard);
    apiRouter.get('/hj/getCrossAudit', controller.c440600.businessAudit.businessAudit.getCrossAudit);
    apiRouter.get('/hj/getVehicleUpdateInfo', controller.c440600.businessAudit.businessAudit.getVehicleUpdateInfo);
    apiRouter.get('/hj/getBusinessFileInfo', controller.c440600.businessAudit.businessAudit.getBusinessFileInfo);
    apiRouter.get('/hj/getSpecialImg', controller.c440600.businessAudit.businessAudit.getSpecialImg);
    apiRouter.post('/hj/SaveModifyVec', controller.c440600.businessAudit.businessAudit.SaveModifyVec);
    apiRouter.get('/hj/getSkillDiscernAudit', controller.c440600.businessAudit.businessAudit.getSkillDiscernAudit);
    apiRouter.post('/hj/SaveJSJBApplyLogic', controller.c440600.businessAudit.businessAudit.SaveJSJBApplyLogic)
    apiRouter.get('/hj/getlastTenData', controller.c440600.businessAudit.businessAudit.getlastTenData);
    apiRouter.get('/hj/getCountData', controller.c440600.businessAudit.businessAudit.getCountData);
    apiRouter.get('/hj/getRecentAudit', controller.c440600.businessAudit.businessAudit.getRecentAudit);
    apiRouter.get('/hj/getFGKData', controller.c440600.businessAudit.businessAudit.getFGKData);
    apiRouter.get('/hj/getSpotCheckAudit', controller.c440600.businessAudit.businessAudit.getSpotCheckAudit);
    apiRouter.post('/hj/SaveVehicleRingTestSpotCheck', controller.c440600.businessAudit.businessAudit.SaveVehicleRingTestSpotCheck);
    apiRouter.get('/hj/getChangeRegistratAudit', controller.c440600.businessAudit.businessAudit.getChangeRegistratAudit);
    apiRouter.post('/hj/SaveChangeRegistratAudit', controller.c440600.businessAudit.businessAudit.SaveChangeRegistratAudit);
    apiRouter.get('/hj/getOutInspectUpdateAudit', controller.c440600.businessAudit.businessAudit.getOutInspectUpdateAudit);
    apiRouter.post('/hj/SaveOutInspectUpdateAudit', controller.c440600.businessAudit.businessAudit.SaveOutInspectUpdateAudit);
    apiRouter.get('/hj/getModelReview', controller.c440600.businessAudit.businessAudit.getModelReview);
    apiRouter.get('/hj/getUploadFileData', controller.c440600.businessAudit.businessAudit.getUploadFileData);
    apiRouter.get('/hj/getAcceptAuditImg', controller.c440600.businessAudit.businessAudit.getAcceptAuditImg);
    apiRouter.get('/hj/getCheckDateAudit', controller.c440600.businessAudit.businessAudit.getCheckDateAudit);
    apiRouter.get('/hj/getLatestLingmanDataInspectionnum', controller.c440600.businessAudit.businessAudit.getLatestLingmanDataInspectionnum);
    apiRouter.post('/hj/SaveChangeCheckDateAudit', controller.c440600.businessAudit.businessAudit.SaveChangeCheckDateAudit);
    apiRouter.get('/hj/getChangeRegistratImage', controller.c440600.businessAudit.businessAudit.getChangeRegistratImage);
    apiRouter.post('/hj/auditedEmit', controller.c440600.businessAudit.businessAudit.auditedEmit); // 业务审核已处理推送
    apiRouter.post('/hj/SaveCrossStationAudit', controller.c440600.businessAudit.businessAudit.SaveCrossStationAudit);
    apiRouter.get('/hj/getOldVehicleInfo', controller.c440600.businessAudit.businessAudit.getOldVehicleInfo);
    apiRouter.get('/hj/getChangeIutype', controller.c440600.businessAudit.businessAudit.getChangeIutype);
    apiRouter.get('/hj/getInspectRatio', controller.c440600.businessAudit.businessAudit.getInspectRatio);
    apiRouter.get('/hj/getChangeInspectionMethodAudit', controller.c440600.businessAudit.businessAudit.getChangeInspectionMethodAudit);
    apiRouter.post('/hj/SaveChangeLingmanDataAudit', controller.c440600.businessAudit.businessAudit.SaveChangeLingmanDataAudit);
    apiRouter.post('/hj/getInspectionRecord', controller.c440600.businessAudit.businessAudit.getInspectionRecord) // 获取检测记录信息
    apiRouter.get('/hj/getSpotAuditImg', controller.c440600.businessAudit.businessAudit.getSpotAuditImg);
    apiRouter.post('/public/hj/sendAuditInfo', controller.c440600.businessAudit.businessAudit.sendAuditInfo);
    apiRouter.get('/hj/getApplyFJAudit', controller.c440600.businessAudit.businessAudit.getApplyFJAudit);
    apiRouter.post('/hj/saveApplyFJAudit', controller.c440600.businessAudit.businessAudit.saveApplyFJAudit);
    apiRouter.get('/hj/getUserAuditFastReply', controller.c440600.businessAudit.businessAudit.getUserAuditFastReply);
    apiRouter.post('/hj/updateUserAuditFastReply', controller.c440600.businessAudit.businessAudit.updateUserAuditFastReply);
    apiRouter.get('/hj/getModifyMethodDetail', controller.c440600.businessAudit.businessAudit.getModifyMethodDetail);
    apiRouter.get('/hj/getVehicleAuditHistory', controller.c440600.businessAudit.businessAudit.getVehicleAuditHistory);
    apiRouter.get('/hj/changeEmissionStandard', controller.c440600.businessAudit.businessAudit.changeEmissionStandard);   //修改车型审核排放标准
    apiRouter.post('/hj/checkVehicleInfoExist', controller.c440600.businessAudit.businessAudit.checkVehicleInfoExist);
    apiRouter.post('/hj/saveBackToAudit', controller.c440600.businessAudit.businessAudit.saveBackToAudit);

    //站点管理主界面
    apiRouter.get('/hj/getStationsZD', controller.c440600.stationManagement.stationManagementController.getStationsZD);
    apiRouter.get('/hj/getStationTGL', controller.c440600.stationManagement.stationManagementController.getStationTGL);
    apiRouter.get('/hj/getInspectionRedis', controller.c440600.stationManagement.stationManagementController.getInspectionRedis);
    // apiRouter.get('/hj/getStationImages', controller.hj.homeData.getStationImages);
    // apiRouter.get('/hj/getStationRedis', controller.hj.homeData.getStationRedis);
    apiRouter.get('/hj/getStationTGLNew', controller.c440600.stationManagement.stationManagementController.getStationTGLNew);

    // 特殊业务处理
    apiRouter.get('/hj/getMuitAuditDate', controller.c440600.specialBusiness.specialBusiness.getMuitAuditDate);
    apiRouter.post('/hj/editHowLongTimes', controller.c440600.specialBusiness.specialBusiness.editHowLongTimes);
    apiRouter.get('/hj/geMutiAcceptanceAuditDate', controller.c440600.specialBusiness.specialBusiness.geMutiAcceptanceAuditDate);//多受理审核修改获取数据
    apiRouter.post('/hj/editMutiAcceptanceAuditHowLongTimes', controller.c440600.specialBusiness.specialBusiness.editMutiAcceptanceAuditHowLongTimes);//多受理审核修改保存修改

    // 受理审核设置
    apiRouter.get('/hj/getUserAreaData', controller.c440600.businessSetting.businessSetting.getUserAreaData);
    apiRouter.get('/hj/getAcceptSettingData', controller.c440600.businessSetting.businessSetting.getAcceptSettingData);
    apiRouter.post('/hj/saveAuditSettingData', controller.c440600.businessSetting.businessSetting.saveAuditSettingData);
    apiRouter.get('/hj/resetAcceptAuditSetting', controller.c440600.businessSetting.businessSetting.resetAcceptAuditSetting);
};
