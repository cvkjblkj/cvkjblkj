export class EnterpriseAdminModel {
  businessLicense: string;
  address: string;
  authenticateStatus: number;
  telephoneNum: string;
  idCard: string;
  active: string;
  idCardFront: string;
  enterpriseScale: number;
  approveUserId: string;
  modifyUser: string;
  approveUserName: string;
  startUserId: string;
  modifyTime: string;
  createTime: string;
  startUserName: string;
  approveContent: string;
  createUser: string;
  startTime: string;
  registerNum: string;
  endTime: string;
  enterpriseName: string;
  idCardBack: string;
  objectId: string;

}

//企业认证审核 -> 已审核 -> 详情页面数据格式
export class EnterpriseAuditInfo {
  approveContent: any;
  approveResult: any;
  approveUserId: any;
  approveUserName: any;
  authEnterpriseName: any;
  authRegisterNum: any;
  businessId: any;
  endTime: any;
  fromAppId: any;
  fromAppName: any;
  objectId: any;
  startTime: any;
  startUserId: any;
  startUserName: any;
  authIdCardPhoto:any;      //法人身份证照片文件ID
  authLicensePhoto:any;     //企业营业执照照片文件ID
}