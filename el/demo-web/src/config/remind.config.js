module.exports = {
     options:{
          groupRule:{
               //必填
               groupFn: function (row) {
                    let dict={
                         "demo-notice-pbtest":  "环境检测55" ,
                         "demo-notice-pbtest1":  "环境检测66" ,
                         "demo-notice-pbtest2":  "环境检测77" ,
                         "demo-notice-pbtest3":  "环境检测88"
                    }
                    return dict[row.Channel]
               },
               //非必填
               compareFn: function (group1, group2) {
                    let time1 = moment(group1.children[group1.children.length-1].RowData.MsgTime);
                    let time2 = moment(group2.children[group2.children.length-1].RowData.MsgTime);
                    return time1.diff(time2) * -1;
               }
          },
          //非必填
          orderRule: {
               compareFn: function (row1, row2, group) {
                    let time1 = moment(row1.MsgTime);
                    let time2 = moment(row2.MsgTime);
                    return time1.diff(time2) * -1;
               }
          },
     },
     hook: {
         msgClick: function (row) {
              // 点击展开的卡片内容 进行自定义事件的处理
            console.log(row);
         }

     }







}