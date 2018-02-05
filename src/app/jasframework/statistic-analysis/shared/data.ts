
// 指标统计 ----------------------------------------
//  指标数据
export const indexData = [
    { value: 'addEnterprise', label: '新增企业' },
    // { value: 'add-user', label: '新增用户' },
    // { value: 'add-user', label: '用户登录' },
    // { value: 'add-user', label: '用户规模' },
];

// 维度数据
export const dimensionData = [
    { value: { name: '认证状态', enName: 'enpAuthStatus', value: '-1,0,1,2' }, label: '认证状态' },
    { value: { name: '企业类型', enName: 'enpType', value: '0,1' }, label: '企业类型' },
    { value: { name: '应用使用类型', enName: 'enpAppUseType', value: '0,1' }, label: '应用使用类型' },
    { value: { name: '注册来源', enName: 'registerFrom' }, label: '注册来源' },
]
// 筛选条件数据
export const statisticData = [
    // { label: '企业名称', value: { name: 'enterpriseName' } },
    { label: '企业规模', value: { name: 'enpScale' } },
    { label: '认证状态', value: { name: 'enpAuthStatus' } },
    { label: '企业类型', value: { name: 'enpType' } },
    { label: '注册来源', value: { name: 'registerFrom' } },
    { label: '应用使用类型', value: { name: 'enpAppUseType' } },
];

// 企业规模数据
export const enpScaleData = [
    { label: '50人以下', value: 1 },
    { label: '50-100人', value: 2 },
    { label: '100-200人', value: 3 },
    { label: '200-500人', value: 4 },
    { label: '500人以上', value: 5 },
];
// 认证状态数据
export const enpAuthStatusData = [
    { label: '待审核', value: 2 },
    { label: '未认证', value: 0 },
    { label: '认证通过', value: 1 },
    { label: '认证驳回', value: -1 },
];
// 企业类型
export const enpTypeData = [
    { label: '测试企业', value: 0 },
    { label: '正式企业', value: 1 },
];
// 企业使用类型
export const enpUseTypeData = [
    { label: '试用', value: 0 },
    { label: '协议', value: 1 },
];

// 日期筛选范围
export const dateData = [
    { label: '按小时', value: 'hour' },
    { label: '按天', value: 'day' },
    { label: '按月', value: 'month' },
]
// 下钻的详细列表数据
export const AddEnterprisedetailListOptionsData = [
    // { field: 'enterpriseName', header: '企业名称' },
    { field: 'userRegisterTotal', header: '注册用户数' },
    { field: 'userActiveTotal', header: '激活用户数' },
    { field: 'telephoneNum', header: '电话' },
    { field: 'objectId', header: '企业ID' },
    { field: 'useAppTime', header: '应用激活时间' },
    { field: 'registertime', header: '企业注册时间' },
    { field: 'enterpriseScale', header: '企业规模' },
    { field: 'authenticateStatus', header: '认证状态' },
    { field: 'enterpriseType', header: '企业类型' },
    { field: 'fromAppName', header: '注册来源' },
    { field: 'appName', header: '应用名称' },
    { field: 'appId', header: '应用ID' },
    { field: 'useType', header: '应用使用类型' },
    { field: 'enpAppStatus', header: '应用使用状态' },
    // { field: 'enterpriseAuthStatus', header: '省份' },
]

// 指标统计 ----------------------------------------

// 事件分析
