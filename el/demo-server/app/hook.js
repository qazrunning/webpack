const path = require("path");


module.exports = app => {

  return {
    name: "demo",
    onIndex:async (ctx)=>{
      let { app } = ctx;
      let { transaction, Raw } = app.Dbs.fx;
      let user=ctx.session.user;
      let extInfo = await Raw.Query(`select * from  PM_USER_EXT where UserId='${user.userid}'`);
      let currentUser={};
      currentUser['userId']=user.userid;
      currentUser['displayName']=encodeURI(user.cnname, "UTF-8");
      currentUser['loginName']=encodeURI(user.username, "UTF-8");

      currentUser['userOrg']=extInfo.ESPOrganizationCode;//站点编号
      currentUser['countyCode']=extInfo.CountyCode;//县
      currentUser['areaCode']=extInfo.AreaCode;//市
      currentUser['priCode']=extInfo.ProvinceCode.substring(extInfo.ProvinceCode.length-4);//权限代码
      currentUser['userLine']=extInfo.ESPStationCode||'02';//工位
      currentUser['isLocal']='01';//工位
      currentUser["gasolineFooterHeight"]=extInfo.GasolineFooterHeight ||"280mm,90mm,300,20";
      currentUser["dieselFooterHeight"]=extInfo.DieselFooterHeight || "270mm,90mm,200,20";
      currentUser["gasBarCodeStyle"]=extInfo.GasBarCodeStyle || "87%,72%";
      currentUser["dieselBarCodeStyle"]=extInfo.DieselBarCodeStyle || "70%,72%";
      currentUser["gasContentStyle"]=extInfo.GasContentStyle || "5,-20";
      currentUser["dieselContentStyle"]=extInfo.DieselContentStyle || "20,-20";
      currentUser["ProvinceCode"]=extInfo.ProvinceCode;
      currentUser["CityCode"]=extInfo.AreaCode;
      currentUser["ESPOrganizationName"]=encodeURI(extInfo.ESPOrganizationName, "UTF-8");//站点名称
      console.log(currentUser)
      ctx.cookies.set('currentUser', JSON.stringify(currentUser), {
        httpOnly: false
      });
      ctx.session.currentUser=currentUser;
    },
    OnDeleteUser: async (UserID, t, pipeline) => {

    },
    onAppLaunch: async (pid) => {
      // let redisfx = app.redis.get("test")
      // redisfx.subscribe("news")
      // redisfx.on("message", (channel, message) => {
      //   app.SendClusterMsg(JSON.stringify({ channel, message }));
      // });
    },
    onEggMsgClusterRecv: async (data) => {
      // app.CoreAPI.Log.trace(`pid=${process.pid},onEggMsgClusterRecv=${data}`);
      // console.log("pid", process.pid, "onEggMsgClusterRecv", data);
    }
  }

}
