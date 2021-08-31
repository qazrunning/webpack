module.exports = app => {
  return {
    // "*": { isSign: false, isEncryption: true },
    "/api/core/profile": { isSign: false, isEncryption: false },// 不能设置true，前端的url权限配置在这个接口获取
    '/api/public/core/login': { isSign: false, isEncryption: false },
    '/api/core/personal/modifypwd': { isSign: false, isEncryption: false },
    "/api/core/remind/index": { isSign: false, isEncryption: false },
    "/api/core/userManager/getall": { isSign: false, isEncryption: true },


  }
}