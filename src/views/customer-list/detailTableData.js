const detailTableData=[
    [
        {
            name:"操作时间",
            value:"create_time",
            width:"110"
        },
        {
            name:"跟进类型",
            value:"follow_type",
            width:"90"
        },
        {
            name:"跟进目的",
            value:"reason_type",
            width:"100"
        },
        {
            name:"目的描述",
            value:"follow_reason",
            width:"160"
        },
        {
            name:"操作人",
            value:"pc_name",
            width:"100"
        },
    ],
    [
        {
            name:"操作时间",
            value:"create_time",
            width:"110"
        },
        {
            name:"报备项目",
            value:"b_name",
            width:"120",
            deletePower:"deletePower"
        },
        {
            name:"报备状态",
            value:"state",
            width:"100"
        },
        {
            name:"预计带看时间",
            value:"expect_look_time",
            width:"110"
        },
        {
            name:"保护期",
            value:"pro_time_agent_report",
            width:"90",
            value2:"period_time"
        },
        {
            name:"剩余时间",
            value:"remaining",
            width:"110"
        },
        {
            name:"操作人",
            value:"pc_name",
            width:"120"
        },
    ],
    [
        {
            name:"操作时间",
            value:"create_time",
            width:"110"
        },
        {
            name:"带看项目",
            value:"b_name",
            width:"120",
            deletePower:"deletePower"
        },
        {
            name:"带看状态",
            value:"state",
            width:"100"
        },
        {
            name:"剩余时间",
            value:"remaining",
            width:"110"
        },
        {
            name:"操作人",
            value:"pc_name",
            width:"120"
        },
    ],
    [
        {
            name:"操作时间",
            value:"create_time",
            width:"110"
        },
        {
            name:"功能名称",
            value:"function_name",
            width:"100"
        },
        {
            name:"内容",
            value:"log_content",
            width:"120"
        },
        {
            name:"操作人",
            value:"name",
            width:"120"
        },
    ]
]
const RULE = {
    // followType:[{ required: true, message: '请选择跟进类型', trigger: 'change' }],
    // reasonType:[{ required: true, message: '请选择跟进目的', trigger: 'change' }],
    // followReason:[{ required: true, message: '请输入备注说明', trigger: 'blur' }],
    level:[{required: true, message: '请选择客户等级', trigger: 'change' }],
}
const titleData = ["跟进记录","报备记录","带看记录","操作记录"]
export {detailTableData,titleData,RULE}