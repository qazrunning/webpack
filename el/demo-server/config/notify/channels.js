require('colors')


module.exports = app => {

  return {
    
      "demo-notice-pbtest": { text: "频道0" },
      "demo-notice-pbtest1": { text: "频道1" },
      "demo-notice-pbtest2": { text: "频道2" },
      "demo-notice-pbtest3": { text: "频道3" },
      "app-wfcase-test": {
        text: "特殊频道",
        //对额外某一个频道通知计数
        async onGetCount() {
          return 10;
        },
        async onGetData() {
          return []
        }
      }

  };


};