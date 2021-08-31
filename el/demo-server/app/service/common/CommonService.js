// const fs= require('fs');
// const path = require('path');
// const Pump = require('mz-modules/pump');
// const moment = require('moment');
const {Service} = require('egg');
// const PizZip = require('pizzip');
// const Docxtemplater = require('docxtemplater');
class CommonService extends Service{
    async getSelected(content) {
        let { app,ctx } = this;
        return await ctx.helper.getDictionaryTable();
    }
    async getSystemParams(content) {
        let { app,ctx } = this;
        return await ctx.helper.getAllSystemParam();
    }
    async getCurrentUser(content) {
        let { app,ctx } = this;
        return await ctx.helper.getCurrentUser();
    }
    // async getSelected(content) {
    //     let {lx,flash}=content;
    //     let replacements = {};
    //     let { app,ctx } = this;
    //     let {transaction, Raw} = app.Dbs.hj;
    //     let redis = app.redis.get("hj");
    //     let json=await redis.get("static");
    //     if(flash==true){
    //         json=null;
    //     }
    //     if(ctx.helper.isNotEmpty(json)) {
    //         json = JSON.parse(json);
    //     }else{
    //         let sql="select type,codename as label,codevalue as value from CD_STATIC where IsAvailable='1' order by type,orderid";
    //         json= await Raw.QueryList(sql,{
    //             replacements: replacements
    //         });
    //         redis.set("static",JSON.stringify(json));
    //     }
    //     let res={};
    //     if(ctx.helper.isNotEmpty(json)){
    //         if(ctx.helper.isNotEmpty(lx)){
    //             let types=lx.split(",");
    //             for(let i=0;i<types.length;i++){
    //                 let temp=[];
    //                 for(let j=0;j<json.length;j++){
    //                     if(types[i]==json[j].type){
    //                         temp.push(json[j]);
    //                     }
    //                 }
    //                 if(types.length==1){
    //                     res=temp;
    //                 }else{
    //                     res[types[i]]=temp;
    //                 }
    //             }
    //         }else{
    //             // res=json;
    //             for(let j=0;j<json.length;j++){
    //                 if(!res[json[j].type]){
    //                     res[json[j].type]=[];
    //                 }
    //                 res[json[j].type].push(json[j]);
    //             }
    //         }
    //     }
    //     return res;
    // }
    async getHySelected(content) {
        let {type,flash}=content;
        let replacements = {};
        let { app,ctx } = this;
        let {transaction, Raw} = app.Dbs.gfpj;
        let redis = app.redis.get("gfpj");
        let json=await redis.get("staticHy");
        console.info(json);
        if(flash==true){
            json=null;
        }
        
        if(ctx.helper.isNotEmpty(json)) {
            json = JSON.parse(json);
        }else{
            let sql="select zj value,mc label,fjzj pvalue from zd_hylb where sfqy ='1' order by px";
            json= await Raw.QueryList(sql,{
                replacements: replacements
            });
            json=await ctx.helper.recursion(json);
            redis.set("staticHy",JSON.stringify(json));
        }
        return json;
    }
    async getXzqhSelected(content) {
        let {type,flash,rootValue}=content;
        let replacements = {};
        let { app,ctx } = this;
        let {transaction, Raw} = app.Dbs.hj;
        let redis = app.redis.get("hj");
        let json=await redis.get("staticXzqh");
        rootValue=rootValue||null;
        if(flash==true){
            json=null;
        }
        if(ctx.helper.isNotEmpty(json)) {
            json = JSON.parse(json);
        }else{
            let sql="select areacode value,areaname label,parentareacode pvalue from Area";
            json= await Raw.QueryList(sql,{
                replacements: replacements
            });
            json=await ctx.helper.recursion(json,rootValue);
            redis.set("staticXzqh",JSON.stringify(json));
        }
        return json;
    }
    /**
     * 根据城市获取发标机构
     * @param {*} content 城市编码
     */
    async GetEspOrganizationByCity(content){
        let {cityCode}=content;
        let replacements = {};
        let { app,ctx } = this;
        let {transaction, Raw} = app.Dbs.hj;
        let user=ctx.session.currentUser;
        if(ctx.helper.isEmpty(cityCode)){
            cityCode=user.areaCode;
        }
        let cfg=app.Cfg['system.440600'];
        let sql="select StationCode,IUSTA,StationName from StationInfo";
        if(cityCode!=cfg.ProvinceCode){
            sql+=` where cityCode=:cityCode`;
        }
        let list=await Raw.QueryList(sql,{
            replacements:{
                cityCode
            }
        })
        return list;
    }
    async DataQuery(content){
        let params=this.ctx.params;
        let {flash}=content;
        let { app,ctx } = this;
        let {transaction, Raw} = app.Dbs.hj;
        let redis = app.redis.get("hj");
        let json=await redis.get("staticSql");
        if(flash==true){
            json=null;
        }
        delete content.flash;
        if(ctx.helper.isNotEmpty(json)) {
            json = JSON.parse(json);
        }else{
            let sql="select keycode,sqltext,btx,lx,ywsm,cjsj,xgsj,cjr,gxr,sfqy from yw_sql where sfqy='1'";
            json= await Raw.QueryList(sql,{
                replacements: {}
            });
            redis.set("staticSql",JSON.stringify(json));
        } 
        // redis.hgetall("t5").then((res)=>{
        //     console.log(res);
        // })
        // console.log(await redis.hget("t5"));
        // console.log(await redis.hget("t5",'a'));
        for(let i=0;i<json.length;i++){
            let op=json[i];
            if(op.keycode===params.keycode){
                let res=this.checkValue(op,content);
                if(res!==''){
                    return ctx.helper.error(res);
                }
                let data=[];
                let sql="";
                if(op.lx==='0'){
                    sql=this.wrapSearchSql(op.sqltext,content);
                    data= await Raw.Query(sql,{
                        replacements: content
                    });
                }else if(op.lx==='1'){
                    sql=this.wrapSearchSql(op.sqltext,content);
                    data= await Raw.QueryList(sql,{
                        replacements: content
                    });
                }else if(op.lx==='2'){
                    let tw=op.sqltext.split(";");
                    if(tw.length<2){
                        return ctx.helper.error("更新失败，请检查");
                    }
                    let tableName=tw[0];
                    delete content['keycode'];
                    await Raw.Update(tableName,content, {
                        wherestr: tw[1],
                        replacements:content
                      });
                }else if(op.lx==='3'){
                    let tw=op.sqltext.split(";");
                    if(tw.length<2){
                        return ctx.helper.error("删除失败，请检查");
                    }
                    let tableName=tw[0];
                    delete content['keycode'];
                    await Raw.Delete(tableName, {
                        wherestr: tw[1],
                        replacements:content
                      });
                }else if(op.lx==='4'){
                    delete content['keycode'];
                    await Raw.Insert(op.sqltext, content);
                }else if(op.lx=='5'){
                    sql=this.wrapSearchSql(op.sqltext,content);
                    let r={
                        replacements: content
                    };
                    if(content.orderstr){
                        r.orderstr=content.orderstr
                    }
                    data= await Raw.QueryPageData(sql, content.pageNum, content.pageSize, r );
                }else{
                    content.yhzj=userid
                    sql=this.wrapSearchSql(op.sqltext,content);
                    data= await Raw.QueryPageData(sql, content.pageNum, content.pageSize, {
                        replacements: content
                    });
                }
                return ctx.helper.success(data);
            }
        }
        return ctx.helper.error("路由错误");
    }
    checkValue(op,content){
        let btx=op.btx;
        let res="";
        if(this.ctx.helper.isEmpty(btx)){
            return res;
        }
        let strs=btx.split(";");
        for(let i=0;i<strs.length;i++){
            let str=strs[i];
            let kv=str.split(":");
            let k=kv[0]||'未知key';
            let v=kv[1]||'未知v';
            if(this.ctx.helper.isEmpty(content[k])){
                res+=(v+";");
            }
        }
        if(res!==''){
            res+="不能为空";
        }
        return res;
    }
    wrapSearchSql(sql,content){
        let r = /(@[\s\S]*?@)/ig;
        let ms = sql.match(r);
        if(this.ctx.helper.isEmpty(ms)){
            return sql;
        }
        console.log(content)
        for(let k in content){
            for(let i=0;i<ms.length;i++){
                if(ms[i].indexOf(k)>=0&&this.ctx.helper.isNotEmpty(content[k])){
                    let t=ms[i].substring(1,ms[i].length-1);
                    sql=sql.replace(ms[i],t);
                }
            }
        }
        sql=sql.replace(r,"");
        // console.log(sql);
        return sql;
    }
}
module.exports = CommonService;