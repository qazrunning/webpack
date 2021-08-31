'use strict';

const path = require('path');


const config = {

  Dbs: {
    fx: {
      dialect: "mysql",
      database: 'fxdemo',
      host: "192.168.0.59",
      username: 'root',
      password: '123456',
      timezone: '+08:00',
      port: 3306
    },
    log: {
      dialect: "mysql",
      database: "fxdemo",
      host: "192.168.0.59",
      username: "root",
      password: "123456",
      timezone: "+08:00",
      port: 3306,
    }
  }
};
module.exports = config;
