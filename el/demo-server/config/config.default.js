'use strict';

const path = require('path');

const config = {
    cluster: {
      listen: {
        port: 8009,
        hostname: '0.0.0.0',
        // path: '/var/run/egg.sock',
      }
    },
    isMicroservice: false,    // 是否是微服务
    Rpc: {
      server: {
        host: "0.0.0.0", //监听IP
        port: 50051,     //RPC监听端口配置
        whitelist: [],
        timeOut: 5000,
        // loadOption: {
        //   keepCase: true,
        //   longs: String,
        //   enums: String,
        //   defaults: true,
        //   oneofs: true,
        // }
      },
      clients: {
        fx: {
          host: "127.0.0.1",
          port: 50051
        },
        log: {//如果有这个log代表日志用grpc进行传输
          host: "127.0.0.1",
          port: 50051
        },
        livelog: {//如果有这个log代表日志用grpc进行传输
          host: "192.168.0.59",
          port: 3697
        }
      }
    },
    LoginProtection: {    //登录保护配置
      failedCacheTime: 4, //每次密码输错后记录到缓存的存在时长(单位秒)
      lockTimespan: 30,   //连续输错后锁定时长(单位秒)
      maxTryTimes: 10     //缓存的存在时最大输错叠加次数(单位次)
    },
    Proj: {
      version: "v1.1.0",
      code: "demo",             // 项目代号,如广西环监:gxhj,遵义lims：zylims
      title: "机动车环保检验管理系统",     // 项目标题,可用来显示各处项目标题，比如浏览器标题栏
      authToken: "",            // 项目授权码
      defaultPCLayout: "pc2",    // 默认PC布局（必填）目前可选：vs/pc2
      defaultThema: "dark",     // 默认主题色（必填）目前可选：dark/light
      disablethema: false,      // 是否禁用主题切换
      loginIpMutex: false,      // true:代表ip登录排他
      isforceStrongPwd: false,  // 是否强制要求强密码，默认是false
      isCryptoLoginPWD: false,  // 是否对登陆密码加密
      captchaSize: 0            // 验证码位数，为0则不校验验证码
    },
    Dbs: {
        log: {
            dialect: "mysql",
            database: "fxtest",
            host: "192.168.0.59",
            username: "root",
            password: "123456",
            timezone: "+08:00",
            port: 3306,
        },
        fx: {
            dialect: "mssql",
            database: 'Skyland.Node.FX',
            dialectOptions: {
                charset: 'utf8mb4',
            },
            delegate: 'model',
            baseDir: ['${core-server}/app/model', "${gis-server}/app/model", "app/model"],
            host: "172.17.10.100",
            username: 'sa',
            password: 'Yj@Hj@110',
            logging: false
        },
        hj: {
            dialect: "mssql",
            host: '172.17.10.100', // You can use 'localhost\\instance' to connect to named instance
            database: 'Skyland.VIM.HJ',
            username: 'sa',
            password: 'Yj@Hj@110',
            logging: false //是否有日志输出
        },
    },
    redis: {
        clients: {
            fx: { //系统redis
                host: "172.17.10.100",
                port: 5379,
                password: "skyland",
                db: 1,
                keyPrefix: "fx/"
            },
            hj: {
                port: 5379, // Redis port
                host: '172.17.10.100', // Redis host
                password: 'skyland',
                // keyPrefix:"/HJ",
                db: 0,
            },
            // notify: {
            //     host: "127.0.0.1",
            //     port: 6379,
            //     password: '123456',
            //     db: 1,
            //     keyPrefix: "notify/"
            // },
            // test: {
            //     host: "127.0.0.1",
            //     port: 6379,
            //     password: '123456',
            //     db: 2,
            //     keyPrefix: "test/"
            // }
        }
    },   //来源 Referer 校验白名单
    RefererWhitelist: [],
    staticExDirs: [
        //例子
        // { prefix: '/upload', dir: path.join(path.resolve(), 'upload') },
    ],
    bodyParser: {
        jsonLimit: '10mb',
        formLimit: '10mb'
    },
    multipart: {
        fileSize: '2000mb',
        whitelist: [
        '.jpg',
        '.rar',
        '.zip',
        '.jpeg', // image/jpeg
        '.png', // image/png, image/x-png
        '.gif', // image/gif
        '.gz'
        ]
    },
    gd: true,
    enableDataSwitchingWithPolice: '0',
};
module.exports = config;