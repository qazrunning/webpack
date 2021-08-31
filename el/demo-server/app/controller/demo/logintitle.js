'use strict';

const Controller = require('egg').Controller;
class logindemo extends Controller { 
    async gettitle() {
    

        return this.app.config.Proj.title
    }


}
module.exports = logindemo;