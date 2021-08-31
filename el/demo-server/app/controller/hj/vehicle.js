'use strict';

const Controller = require('egg').Controller;

class vehicle extends Controller {
    async get({ id }, { ctx, userid }) {
        let { app } = this;
        let { transaction, Raw } = app.Dbs.hj;
        //if (!id) app.Throw("id为空");
        let Vehicles = await Raw.QueryList("select * from Vehicle where pricode=440601581", { });
        // let vehicle = {
        //     GAVType: 'K31',
        //     FuelType: 'A',
        //     VML: 3500,
        //     RatedSeats: 3,
        //     VRDATE: new Date('2009-07-01'),
        //     FuelType: 'B',
        //     PG: '01'
        // };
        console.log(Vehicles.length);
        //console.log("test GetEmissionStandardOfVehicle = ", await ctx.helper.GetEmissionStandardOfVehicle(vehicle))
        //console.log("test GetVehicleInspectionPeriod = ", await ctx.helper.GetVehicleInspectionPeriod(Vehicle, new Date('2009-10-01')))
        //async VehicleExistsByVINOrVLPNAndColor(vin, vlpn, vlpnColor, vehicleID, priCode, /*IDataManager dataManager,*/ isAllow)
        let exist = await ctx.helper.VehicleExistsByVINOrVLPNAndColor('VIN23222231', '桂B新0000138', '01', 1472022, '440604026', 0)
        console.log(this.app.Cfg.GD);
        return JSON.stringify({ Exist: exist });
    }
}

module.exports = vehicle;
