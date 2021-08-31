/*
    vue2 组件通信

    !父子组件传参
    1.props
    2.#emit / v-on
    3.sync
    4.v-model
    5.ref
    6.$children / $parent
    7.$attrs / $listeners
    
    !兄弟组件通信
    9.eventbus
    10.vuex
    6.$parent

    !跨层级组件
    7.$attrs / $listeners
    8.provide/inject
    9.eventbus
    10.vuex
    
    12.slot

    11.$root
*/

/*
  !~ .sync  可以通过computed 进行双向更改
*/ 

/**
 * v-model 传递 可以留意一下
 * 使用 options API (model)可以修改事件名，默认为 input
    model:{
        event:"updateValue"
    },
 */

/**
 * web worker
 */

/**
 * 单纯的打字的快乐
 * 在说微任务之前 ，先了解一下同步和异步
 * 
 * 除了任务队列 还有一个专门处理需要延迟执行的模块（延迟哈希表）
 * 
 * 常见的异步任务 定时器、ajax、事件绑定、回调函数、async/awiat promise
 * 
 * 
 * 微任务：promise回调、proxy、监听dom、
 * 宏任务：渲染事件、请求、script、setTimeout、setInterval
 * 
 * 也就是说  当前宏任务里的微任务全部执行完了，才会执行下一个宏任务
 * 
 * 当执行栈中任务执行完了 再去检查微任务队列，如果有就执行  微任务执行完了  再去执行 下一个宏任务
 */

/**
 * 如何使首屏加载更快？
 * 为什么第二次打开页面会快很多？
 * 怎么让刷新或关闭浏览器之后数据依然不被清空？
 * 
 * 
 * 因为缓存了一些数据 之后再加载 就直接从缓存中获取而不用请求服务器 
 * 
 * 网络方面的缓存 分为3块 DNS缓存、HTTP缓存、CDN缓存
 *  
 * 进入页面会进行DNS查询 找到域名对应的服务器IP地址 在发送请求
 * 
 * 
 * HTTP缓存
 * 第一次请求时，服务器吧资源过期时间通过响应头中的expris和Cache-control
 * 
 * 协议缓存
 * 第一次请求资源时，服务器除了会返回给浏览器上面说的过期时间，还会在响应头添加 last-modified 字段告知浏览器资源的最后修改时间
 * 
 * 
 * cookie 每个域名下的cookie不能超过20个 大小不能超过4KB
 * 跨域不能共享Cookie
 * 
 * 
 * service Worker
 * 
 * 是运行js主线程之外，在浏览器背后的独立线程，相当于一个代理服务器，可以拉结用户发出的请求，修改请求或直接向用户发出回应。
 * 
 * 一般用于离线缓存（提高首屏加载速度）、消息推送、网络代理 
 * 使用service worker 必须使用https协议 
 * 
 * 实现步骤
 * 1.注册
 * 2.监听install事件
 * 3.
 */

if(navigator.serviceWorker){
  navigator.serviceWorker.register('sw.js').then((registration)=>{
    console.log("注册成功")
  }).catch((err)=>{
    console.log("注册失败")
  })

}

self.addEventListener('install',e=>{
  // 打开执行的缓存文件名
  e.waitUntil(caches.open('my-cache')
  .then(cache =>{
    // 添加需要缓存的文件
    return cache.addAll(['./indexedDB.html','./index.css'])
  }))
})
// 拦截所有请求事件 缓存中有请求的数据就直接用缓存，否则去请求数据 
self.addEventListener('fetch', e => { 
  // 查找request中被缓存命中的response
  e.respondWith(caches.match(e.request).then( response => {
      if (response) {
          return response
      }
      console.log('fetch source')
  }))
})

/**
 * 输入URL到页面显示的前端体系知识
 * 
 * 输入 之后 需要转义的转义的
 * 下一步浏览器进程就会通过IPC把URL发送给网络进程，然后网络进程先找本地缓存
 * 
 * 如果没有缓存 或者缓存过期 在开始解析URL 解析出要请求的服务器IP地址
 * 
 * 这个过程会把我们需要的协议、域名、端口、路径 信息解析提取出来
 * 
 * 然后根据解析出来的域名进行DNS解析 找到要请求的服务器IP地址
 * 
 * 一般我们dns解析过的域名 在我们的浏览器都会有缓存的  
 * 
 * DNS解析找到要请求的服务器IP地址之后  
 * 就开始建立TCP连接 
 * 在建立TCP连接之前双方都需要确认对方的收发消息的能力  也就是常说的三次握手
 * 
 * 客户端向 服务器发送 SYN报文
 * 服务端收到请求后向客户端发送 SYN报文和ACK报文
 * 第三次 客户端收到服务器的应答之后 在向服务端发送应答的ACK报文
 * 
 * 正式完成TCP连接之后 
 * 浏览器就开始构建请求数据 附加到请求头中 发给服务器
 * 然后服务器就想赢数据  把对应的数据返回给客户端 没有就404 或者其他的响应体了
 * 
 * 然后浏览器就开始解析响应的数据
 * 
 * 之后就正式开始我们的前端渲染了
 * 
 * 首先浏览器会先构建DOM树，将HTML转为浏览器认识的结构
 * 构建CSSOM树，将css转换成浏览器认识的结构  stylesheets 
 * css解析和dom解析是可以同时进行的，
 * 但是script和css解析不能同时进行
 * css会阻塞js执行
 * 
 * 在css和Dom解析完成之后 就开始布局渲染页面了
 * 
 * 重绘和重排
 * 重排也叫回流 就是改变一个元素的尺寸位置属性时 会进行样式计算 就会触发布局
 * 重绘就比如说改变元素颜色 就会触发重绘 重绘不会重新触发布局 但是会触发样式计算 和绘制
 * 
 * 所以重排一定会触发重绘 但是重绘不一定会触发重排
 * 
 * 渲染优化
 * 
 *因为js会阻塞HTML解析、css解析 所以script标签尽量放在body的最后
 或者使用async、defer 进行异步请求

 也可以用type="module" 

 HTML优化 
 代码不要嵌套太深
 使用语义化标签
 减少css的层级
 
 */