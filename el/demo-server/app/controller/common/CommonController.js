const {Controller} = require('egg');
class CommonController extends Controller{
    /**
     * 获取静态资源
     * @param {*} content {lx,flash}
     * @param {*} param1 
     */
    async getSelected(content,{ ctx, userid }){
        try{
            let type=this.ctx.params.type;
            if(this.ctx.helper.isNotEmpty(type)){
                return await this.ctx.service.common.commonService[type](content);
            }
            return this.ctx.helper.error("类型不能为空");
        }catch (e) {
            console.info(e);
            return this.ctx.helper.error("服务端异常："+e.message);
        }
       
    }
    /**
     * 根据城市获取发标机构
     * @param {*} content //城市编码
     * @param {*} param1 
     */
    async GetEspOrganizationByCity(content,{ctx,userid}){
        try{
            return await this.ctx.service.common.commonService.GetEspOrganizationByCity(content,{ctx,userid});
        }catch (e) {
            console.info(e);
            return [];
        }
    }
    /**
     * 公共数据查询
     * @param {*} content 
     * @param {*} param1 
     */
    async DataQuery(content,{ctx,userid}){
        try{
            return await this.ctx.service.common.commonService.DataQuery(content,{ctx,userid});
        }catch (e) {
            console.info(e);
            return ctx.helper.error(e.message);
        }
    }
}
module.exports = CommonController;