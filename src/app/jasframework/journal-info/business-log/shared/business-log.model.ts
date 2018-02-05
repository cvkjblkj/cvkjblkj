//一条业务日志信息记录
export class BusinessLogData {
  userId:         string;     //用户ID
  userName:       string;     //用户姓名
  enterpriseName: string;     //企业名称
  enterpriseId:   string;     //企业ID
  userIp:         string;     //用户IP
  createTime:     any;        //创建时间
  appName:        string;     //应用名称
  appId:          string;     //应用ID
  appVersion:     string;     //应用版本
  functionName:   string;     //功能名称
  collectionPoint:string;     //采集点
  modifyType: string;     //变更类型
  dataId: string;     //数据ID
  detail: {
    dataItem: string;
    oldValue: string;
    newValue: string;
  }[];     //变更详情
  remark: string;     //备注
}

//一条变更记录信息
export class ChangeLog {
  modifyType:     string;     //变更类型
  dataId:         string;     //数据ID
  detail:{
    dataItem:   string;
    oldValue:   string;
    newValue:   string;
  }[];     //变更详情
  remark:         string;     //备注
}
