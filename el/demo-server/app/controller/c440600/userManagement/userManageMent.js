const {Controller} = require('egg');
class userManageMent extends Controller{
    /**
     * 添加用户
     * @param {*} content 
     * @param {*} param1 
     */
    async addUser(content) {
        try{
            //return await this.ctx.service.c440600.addVehicleInfoService.DaGetEmissionStandardOfVehicletaQuery(content,{ctx,userid});
            //await this.ctx.service.core.auth.user('U000001');
            let user = {
                //UserID:
                EnName: "lange",
                PWD: "123456",
                SEX: 1,
                Phone: '13129303852',
                CnName: 'test'
                //Status
            }
            console.log("this.app.CoreAPI.userManager ", this.app.CoreAPI.userManager);
            const ret = await this.app.CoreAPI.userManager.add(user);
            //console.log(this.app.CoreAPI.userManager);
        } catch (e) {
            //console.info(e);
            return ctx.helper.error(e.message);
        }
    }
}
module.exports=userManageMent;