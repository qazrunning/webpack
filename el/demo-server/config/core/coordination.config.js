module.exports = app => {
    return {
        "routerName": "app-wf-caselist",
        //flowList为类型选项,配置新建任务的可选项
        "flowList": [{
            "value": "askforleave",
            "label": "请假申请",
            "icon": "askforleave",
            "description": "这是一个请假申请业务",
            //流程中具备审批权限的可选人员
            "Actlist": [{
                "name": "请假申请",
                "key": "请假申请",
                "fmtChatName": function ({ name, username, key, RoleKey, label, value }) {
                    return `${username}的${name}`
                },
                "onCreated": function ({ ChatID, ChatType }) {
                    console.log(ChatID, ChatType)
                }
            },
            {
                "name": "行政审批",
                "key": "行政审批",
                "defaultApprovalID": ['U000128'],
                "RoleKey": ["F_MiddleLeader"],
            },
            {
                "name": "分管领导审批",
                "key": "分管领导审批",
                "defaultApprovalID": ['U000101'],
                "RoleKey": ["F_lastLeader"],
            },
            {
                "name": "办结",
                "key": "办结",
                "defaultApprovalID": ['U000101'],
                "RoleKey": ["F_MiddleLeader"],
            },]
        },
        {
            "value": "askforovertime",
            "label": "加班申请",
            "icon": "askforovertime",
            "description": "这是一个加班申请业务",
            //流程中具备审批权限的可选人员
            "Actlist": [{
                "name": "加班申请",
                "key": "加班申请",
                "fmtChatName": function ({ name, username, key, RoleKey, label, value }) {
                    return `${username}的${name}`
                },

            },
            {
                "name": "行政审批",
                "key": "行政审批",
                "defaultApprovalID": ['U000128'],
                "RoleKey": ["F_MiddleLeader"],
            },
            {
                "name": "分管领导审批",
                "key": "分管领导审批",
                "defaultApprovalID": ['U000101'],
                "RoleKey": ["F_lastLeader"],
            },
            {
                "name": "办结",
                "key": "办结",
                "defaultApprovalID": ['U000101'],
                "RoleKey": ["F_MiddleLeader"],
            },]
        }
        ],
        //分组规则
        "groupRule": {
            //根据字段ChatState状态,分为'待提交'及'待审批'
            "ChatState": [{
                "type": "请假申请",
                "name": "待提交"
            },
            {
                "type": "加班申请",
                "name": "待提交"
            },
            {
                "type": "行政审批",
                "name": "待审批"
            },
            {
                "type": "分管领导审批",
                "name": "待审批"
            },
            {
                "type": "办结",
                "name": "已办结"
            }
            ],
            //根据字段ChatType类型,分为'请假申请'及'加班申请',以此类推
            "ChatType": [{
                "type": "askforleave",
                "name": "请假申请"
            },
            {
                "type": "askforovertime",
                "name": "加班申请"
            }
            ]
        }
    }
}