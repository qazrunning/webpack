module.exports = app => {
    //返回你需要在提醒里显示的所有频道
    return {
        "dingding": {
            "text": "钉钉",
            "redirect": function (msgArr) {
                return {
                    href: "http://www.baidu.com",//这个代表直接地址栏跳转
                    route: {//这个代表路由跳转
                        path: "",
                        params: {}
                    }
                }
            }
        },
        "qq": {
            "text": "QQ",
            "typedict": {
                "1": "好友来信"
            },
            "redirect": function (msgArr) {
                return {
                    href: "http://www.baidu.com",
                    route: {//这个代表路由跳转
                        path: "",
                        params: {}
                    }
                }
            }
        },
        "progress": {
            "text": "业务进展",
            "redirect": function (data) {
                if (data.length > 1) {
                    return {
                        href: "",
                        route: {//这个代表路由跳转
                            path: "/app-wf-caselist",
                            params: {}
                        }
                    }
                } else if (data.length == 1) {
                    let obj = JSON.parse(data[0].MsgData);
                    return {
                        href: "",
                        route: {//这个代表路由跳转
                            path: `/app-wf-caselist/${obj.ChatType}_${obj.ChatID}`,
                            params: {},
                        }
                    }
                }


            }
        },
        "regression": {
            "text": "业务回退",
            "redirect": function (data) {
                if (data.length > 1) {
                    return {
                        href: "",
                        route: {//这个代表路由跳转
                            path: "/app-wf-caselist",
                            params: {}
                        }
                    }
                } else if (data.length == 1) {
                    let obj = JSON.parse(data[0].MsgData);
                    return {
                        href: "",
                        route: {//这个代表路由跳转
                            path: `/app-wf-caselist/${obj.ChatType}_${obj.ChatID}`,
                            params: {},
                        }
                    }
                }
            }
        },
        "chat": {
            "text": "业务协同",
            "typedict": {
                "askforleave": "请假申请",
                "askforovertime": "加班申请"
            },
            "redirect": function (data) {
                if (data.length > 1) {
                    return {
                        href: "",
                        route: {//这个代表路由跳转
                            path: "/app-wf-caselist",
                            params: {}
                        }
                    }
                } else if (data.length == 1) {
                    let obj = JSON.parse(data[0].MsgData);
                    return {
                        href: "",
                        route: {//这个代表路由跳转
                            path: `/app-wf-caselist/${obj.ChatType}_${obj.ChatID}`,
                            params: {},
                        }
                    }
                }
            }
        },

    };
} 
