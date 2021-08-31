'use strict';

const path = require('path');


const config = {
    cluster: {
        listen: {
            port: 7001,
            hostname: '0.0.0.0',
            // path: '/var/run/egg.sock',
        }    
    }, 
    Proj: {
        code: "demo", //项目代号,如广西环监:gxhj,遵义lims：zylims
        title: "框架演示demo",//项目标题,可用来显示各处项目标题，比如浏览器标题栏
        authToken: "",//项目授权码
    },
    Dbs: { 
        // fx: {
        //     dialect: "mysql",
        //     database: 'skyland',
        //     delegate: 'model',
        //     baseDir: ['${core-server}/app/model', "${gis-server}/app/model", "app/model"],
        //     host: "127.0.0.1",
        //     username: 'root',
        //     password: '123',
        //     port: 3306
        // },
        fx: {
            dialect: "mssql",
            database: 'Skyland.Node.FX',
            dialectOptions: {
                charset: 'utf8mb4',
            },
            delegate: 'model',
            baseDir: ['${core-server}/app/model', "${gis-server}/app/model", "app/model"],
            host: "192.168.0.40",
            username: 'skyland',
            password: 'skyland',
            port: 1433
        },
        // fx: {
        //     dialect: "mssql",
        //     database: 'Skyland.Node.FX',
        //     dialectOptions: {
        //         charset: 'utf8mb4',
        //     },
        //     delegate: 'model',
        //     baseDir: ['${core-server}/app/model', "${gis-server}/app/model", "app/model"],
        //     host: "127.0.0.1",
        //     username: 'sa',
        //     password: '123456',
        //     port: 1433
        // }
    },
    redis: {
        // client: {
        //     host: "192.168.126.129",
        //     port: 6379,
        //     password: '123456',
        //     db: 0,
        //     keyPrefix: "fx/"
        // },
        clients: {
            //核心框架使用的redis应该必须是fx
            fx: {
                host: "127.0.0.1",
                port: 6379,
                password: '123456',
                db: 0,
                keyPrefix: "fx/"
            },
            lims: {
                host: "127.0.0.1",
                port: 6379,
                password: '123456',
                db: 0,
                keyPrefix: "lims/"
            }
        }
    },
    static: {
        prefix: '/',
        dir: path.join(path.resolve(), 'dist'),
        // dirs: [ dir1, dir2 ] or [ dir1, { prefix: '/static2', dir: dir2 } ],
        // support lazy load
        dynamic: true,
        preload: false,
        buffer: false,
        maxFiles: 1000,
    }
};
module.exports = config;
