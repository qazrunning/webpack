const path = require("path");
const isProd = process.env.NODE_ENV === "production";
let page = {};
let projectlist = {
  //name 对应 public里的 模板 html文件的名称 ; projectlist[name] 对应 文件夹名称
  index: "src",
  login: "src_login",
};
let pack = "dist/"; //打包到哪个文件
let Staticfolder = "static"; //放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录名称。

// function recursiveIssuer(m) {
//     if (m.issuer) {
//         return recursiveIssuer(m.issuer);
//     } else if (m.name) {
//         return m.name;
//     } else {
//         return false;
//     }
// }

function resolve(dir) {
  return path.join(__dirname, "./", dir);
}
let projectname = process.argv[3];
if (isProd) {
  if (projectname && projectname.search(":") > -1) {
    let arr = projectname.split(":");
    projectlist = {};
    projectlist[arr[0]] = arr[1];
  }
} else {
  //如果是开发模式的话，给projectlist对象加入除index，login的模板名以及对应包名 如：多大屏模块的 bigScreen : src_bigScreen
  // projectlist.bigScreen = 'src_bigScreen'
  // console.log(projectlist)
}

Object.keys(projectlist).forEach((name) => {
  let projectname = {
    entry: "./" + projectlist[name] + "/main.js", // 入口文件
    template: "./public/" + name + ".html", // // 指定模板文件路径
    filename: name + ".html", // 设置生成的内存页面的名称
    title: name + " Page",
    //inject:true,
    chunks: ["chunk-vendors", "chunk-common", name],
  };
  page[name] = projectname;
});
module.exports = {
  publicPath: "./",
  outputDir: pack,
  pages: page,
  transpileDependencies: ["@skyland/core", "@skyland/gis"],
  runtimeCompiler: true,
  productionSourceMap: false, //可以使得打包过后的文件不包含未压缩的.map文件，减少压缩后代码体积(优化性能)
  assetsDir: Staticfolder, //放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  configureWebpack: {
    devtool: "source-map",
  },
  chainWebpack: (config) => {
    //修改 webpack  Loader 选项
    config.plugins.delete("prefetch"); //移除 prefetch 插件 (用来告诉浏览器在页面加载完成后，利用空闲时间提前获取用户未来可能会访问的内容。移除使得首页不预先加载其他页面的css和js，首页能更快加载)
    //css不合并打包时则注释掉
    if (isProd) {
      //用于打包
      config
        .plugin("extract-css")
        .tap((args) => [{ filename: "static/css/[name].[contenthash:8].css" }]);
      // config.optimization.merge({
      //     splitChunks: {
      //         cacheGroups: {//用这个配置项来自定义生成的文件
      //             styles: {
      //                 name: 'styles', //生成的文件名
      //                 test: (m, c, entry = 'app') => m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry, //限制范围，可以是正则，匹配文件夹或文件
      //                 chunks: 'all',
      //                 priority: -11,//优先级，当有chunks满足多个分组条件的时候，优先选择优先级高的
      //                 minChunks: 1,//表示分离前被引用次数,默认为1
      //                 enforce: true//优先处理，这一项好像和priority有些重叠了
      //             }
      //             // iview: {
      //             //     test: /iview/,
      //             //     chunks: "initial",
      //             //     name: "iview",
      //             //     enforce: true,
      //             // },
      //         }
      //     }
      // })
    }

    //(.*node_modules.*)
    // node_modules/((?!@skyland).)*/.*
    // svg rule loader
    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule.exclude.add(/node_modules/);
    // svgRule.exclude.add(/iview/)
    // svgRule.exclude.add(/font-awesome/)
    // svgRule.include.add(/\/fxSvg\/.*\.svg$/)
    svgRule // 添加svg新的loader处理
      //.test(/\/fxSvg\/.*\.svg$/)
      .test(/\.svg$/)
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      });

    // 修改images loader 添加svg处理
    const imagesRule = config.module.rule("images");
    imagesRule.exclude.add(resolve("src/assets/icons"));
    //imagesRule.exclude.add(/\.\/node_modules\/@skyland\/[^\/]*\/src\/assets\/icons/)
    config.module.rule("images").test(/\.(png|jpe?g|gif|svg)(\?.*)?$/);
  },
  devServer: {
    host: "0.0.0.0",
    port: 8080,
    index: "login.html",
    proxy: {
      "/api": {
        target: "http://localhost:8009",
      },
      "/documents/": {
        target: "http://localhost:8009",
      },
      "/web/": {
        target: "http://localhost:8009",
      },
    },
  },
  css: {
    loaderOptions: {
      sass: {
        implementation: require("sass"),
        data: `@import "@/assets/style/common/variables.scss";`,
      },
    },
  },
};
