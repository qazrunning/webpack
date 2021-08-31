const menus = [
    {
        name: "app-hjdemo",
        text: "门户",
        icon: "fa fa-check-square",  
        iconbg: "linear-gradient(to right,#998EFF, #7364FF)",
        // description: "环检首页demo"
    },
    {
        name: "app-testusermanger",
        text: "增删改查",
        icon: "fa fa-compass",
        iconbg: 'linear-gradient(to right, #FEA21E , #FC9107)',
        // description: "描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述"
    },
   
    // {
    //     name: "app-cardsdemo",
    //     text: "卡片显示模板",
    //     iconbg: "linear-gradient(to right,#998EFF, #7364FF)",
    //     description: "card模板"
    // },
    {
        name: "core-phoneModulesNav",
        text: "菜单",
        children: [
            {
                name: "app-demo",
                text: "Demo",
                icon: "fa fa-navicon fa-lg",
                children: [
                    {
                        name: "app-iviewdebug",
                        text: "UI组件合集",
                        icon: "fa fa-archive",
                        iconbg: "linear-gradient(to right,#998EFF, #7364FF)",
                        // description: "iview组件demo"
                    },
                    {
                        name: "app-gridtest",
                        text: "fx-grid实验",
                        icon: "fa fa-tasks"
                    },
                    {
                        name: "app-h5",
                        text: "H5+功能",
                        icon: "fa fa-check-square",  
                        iconbg: "linear-gradient(to right,#998EFF, #7364FF)",
                        // description: "环检首页demo"
                    },

                ]
            },
            {
                name: "app-modules",
                text: "功能集合1",
                icon: "fa fa-navicon fa-lg",
                children: [
                    {
                        name: "app-socketio",
                        iconbg: 'linear-gradient(to right, #62B866 , #48A44C)',
                        // description: "描述描述描述描述描述描述描述描述描述"
                    },
                    {
                        name: "app-threeColumn",
                        iconbg: 'linear-gradient(to right, #1CDFD4 , #1CBFD4)',
                        text: "三列表单"
                    },
                   
                ]
            },
            

        ]
    }
]
module.exports = {
    menus: menus,
    layouts: ["pad"]
}