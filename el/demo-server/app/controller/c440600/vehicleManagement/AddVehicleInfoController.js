const {Controller} = require('egg');
class AddVehicleInfo extends Controller{
    /**
     * 车辆类型查询（方式二）
     * @param {*} content 
     * @param {*} param1 
     */
    async getEmissionStandardOfVehicle(content,{ctx,userid}){
        try{
            return await this.ctx.service.c440600.vehicleManagement.addVehicleInfoService.DaGetEmissionStandardOfVehicletaQuery(content,{ctx,userid});
        }catch (e) {
            console.info(e);
            return ctx.helper.error(e.message);
        }
    }
    /**
     * 判断是否存在车辆
     * @param {*} content 
     * @param {*} param1 
     */
    async VehicleExistsByVINOrVLPNAndColor(content,{ctx,userid}){
        try{
            return await this.ctx.service.c440600.vehicleManagement.addVehicleInfoService.VehicleExistsByVINOrVLPNAndColor(content,{ctx,userid});
        }catch (e) {
            console.info(e);
            return ctx.helper.error(e.message);
        }
    }
    /**
     * 车辆保存接口
     * @param {*} content data 车辆信息实体 type 业务类型：0为机动车检测，1为6年免检车辆，2为标志核发车辆，3为旧牌新用 way 审核排放标准的方式（1.方式一审核，2.方式二审核）
     * @param {*} param1 
     */
    async SaveNewVehicle(content,{ctx,userid}){
        try{
            return await this.ctx.service.c440600.vehicleManagement.addVehicleInfoService.SaveNewVehicle(content,{ctx,userid});
        }catch (e) {
            console.info(e);
            return ctx.helper.error(e.message);
        }
    }
    /**
     * 获取车辆文件信息
     * @param {*} content 
     * @param {*} param1 
     */
    async GetBusinessFileInfo(content,{ctx,userid}){
        try{
            return await this.ctx.service.c440600.vehicleManagement.addVehicleInfoService.GetBusinessFileInfo(content,{ctx,userid});
        }catch (e) {
            console.info(e);
            return ctx.helper.error(e.message);
        }
    }
    /**
     * 获取车辆文件信息
     * @param {*} content 
     * @param {*} param1 
     */
    async ChangeHacCCAToAlarm(content,{ctx,userid}){
        try{
            return await this.ctx.service.c440600.vehicleManagement.addVehicleInfoService.ChangeHacCCAToAlarm(content,{ctx,userid});
        }catch (e) {
            console.info(e);
            return ctx.helper.error(e.message);
        }
    }
    /**
     * 获取同一周期的检测次数
     * @param {*} content VehicleID 车辆id
     * @param {*} param1 
     */
    async GetInspectionTimes(content,{ctx,userid}){
        try{
            return await this.ctx.service.c440600.vehicleManagement.addVehicleInfoService.GetInspectionTimes(content,{ctx,userid});
        }catch (e) {
            console.info(e);
            return ctx.helper.error(e.message);
        }
    }
    /**
     * 查询redis中是否存在受理信息
     * @param {*} content VehicleID 车辆id
     * @param {*} param1 
     */
    async CheckVehicleInAcceptanceRedis(content,{ctx,userid}){
        try{
            return await this.ctx.service.c440600.vehicleManagement.addVehicleInfoService.CheckVehicleInAcceptanceRedis(content,{ctx,userid});
        }catch (e) {
            console.info(e);
            return ctx.helper.error(e.message);
        }
    }
    /**
     * 获取受理编号
     * @param {*} content 
     * @param {*} param1 
     */
    async GetInspectionNum(content,{ctx,userid}){
        try{
            return await this.ctx.service.c440600.vehicleManagement.addVehicleInfoService.GetInspectionNum(content,{ctx,userid});
        }catch (e) {
            console.info(e);
            return ctx.helper.error(e.message);
        }
    }
    /**
     * 是否存在waitcheck信息
     * @param {*} content 
     * @param {*} param1 
     */
    async IsExitsWaitCheck_New(content,{ctx,userid}){
        try{
            return await this.ctx.service.c440600.vehicleManagement.addVehicleInfoService.IsExitsWaitCheck_New(content,{ctx,userid});
        }catch (e) {
            console.info(e);
            return ctx.helper.error(e.message);
        }
    }
}
module.exports=AddVehicleInfo;