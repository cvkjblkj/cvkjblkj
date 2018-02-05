export const alarmOpions = [
  { label: '规则名称', value: { name: 'ruleName' } },
  { label: '规则状态', value: { name: 'ruleStates' } },
  { label: '启用/禁用', value: { name: 'isEnable' } },
  { label: '监控项', value: { name: 'metricDescribe' } },
  { label: '监控对象', value: { name: 'monitorObject' } },
  { label: '监控类别', value: { name: 'monitorType' } },
  { label: '通知人', value: { name: 'notifyUserName' } },

];
export const alarmHistoryData = [
  { label: '监控类别', value: { name: 'monitorType' } },
  { label: '监控对象', value: { name: 'monitorObject' } },
  { label: '规则名称', value: { name: 'ruleName' } },
  { label: '状态', value: { name: 'alarmHistoryStates' } },
  { label: '通知人', value: { name: 'notifyUserName' } },
];
export const ruleStatesData = [
  { label: '报警状态', value: 0 },
  { label: '数据不足', value: 1 },
  { label: '正常状态', value: 2 },
  { label: '暂停', value: 3 },
];
export const isEnableData = [
  { label: '已禁用', value: 0 },
  { label: '已启用', value: 1 },
];
export const historyStatesData = [

  { label: '报警发生', value: 0 },
  { label: '通道沉默', value: 1 },
  { label: '恢复正常', value: 2 },


]

export const monitorTypeData = [
  { label: '负载均衡', value: 'slb' },
  { label: '主机', value: 'ecs' },
  { label: 'Docker容器', value: 'docker' },
  { label: 'RDS', value: 'rds' },
  { label: 'Redis', value: 'redis' },
  { label: '对象存储', value: 'oss' },
];

export const createTypeData = [
  { label: '负载均衡', value: 'slb' },
  { label: '主机', value: 'ecs' },
  { label: 'Docker容器', value: 'docker' },
  { label: 'RDS', value: 'rds' },
  { label: 'Redis', value: 'redis' },
  { label: '对象存储', value: 'oss' },
];
export const slbData = [
  { label: '端口流入带宽', value: 'TrafficRXNew' },
  { label: '端口流出带宽', value: 'TrafficTXNew' },
  { label: '端口新建连接数', value: 'NewConnection' },
  { label: '端口流入数据包数', value: 'PacketRX' },
  { label: '端口流出数据包数', value: 'PacketTX' },
  { label: '端口活跃连接数', value: 'ActiveConnection' },
  { label: '端口非活跃连接数', value: 'InactiveConnection' },

];
export const rdsData = [
  { label: '磁盘使用率', value: 'DiskUsage' },
  { label: 'IOPS使用率', value: 'IOPSUsage' },
  { label: '连接数使用率', value: 'ConnectionUsage' },
  { label: 'CPU使用率', value: 'CpuUsage' },
  { label: '内存使用率', value: 'MemoryUsage' },
  { label: 'MySQL网络入流量', value: 'MySQL_NetworkInNew' },
  { label: 'MySQL网络出流量', value: 'MySQL_NetworkOutNew' },
];
export const redisData = [
  { label: '写入网络带宽', value: 'IntranetIn' },
  { label: '读取网络带宽', value: 'IntranetOut' },
  { label: '操作失败数', value: 'FailedCount' },
  { label: '已用连接数百分比', value: 'ConnectionUsage' },
  { label: '已用容量百分比', value: 'MemoryUsage' },
  { label: '写入带宽使用率', value: 'IntranetInRatio' },
  { label: '读取带宽使用率', value: 'IntranetOutRatio' },
];
export const ossData = [

  { label: '层级可用性', value: 'UserAvailability' },
  { label: '有效请求率', value: 'UserRequestValidRate' },
  { label: '用户层级总请求数', value: 'UserTotalRequestCount' },

  { label: '有效请求数', value: 'UserValidRequestCount' },
  { label: '公网流入流量', value: 'UserInternetRecv' },
  { label: '公网流出流量', value: 'UserInternetSend' },
  { label: '内网流入流量', value: 'UserIntranetRecv' },
  { label: '内网流出流量', value: 'UserIntranetSend' },
  { label: 'cdn流入流量', value: 'UserCdnRecv' },
  { label: 'cdn流出流量', value: 'UserCdnSend' },

  { label: '授权错误请求数', value: 'UserAuthorizationErrorCount' },
  { label: '资源不存在错误请求数', value: 'UserResourceNotFoundErrorCount' },
  { label: '客户端其他错误请求总数', value: 'UserClientOtherErrorCount' },
  { label: '成功请求数', value: 'UserSuccessCount' },

];

export const ecsData = [
  { label: 'CPU使用率', value: 'CPUUtilization' },
  { label: 'EIP-网络流入带宽', value: 'InternetInRate' },
  { label: 'EIP-网络流出带宽', value: 'InternetOutRate' },
  { label: '系统磁盘总读BPS', value: 'DiskReadBPS' },
  { label: '系统磁盘总写BPS', value: 'DiskWriteBPS' },
  { label: '系统磁盘读IOPS', value: 'DiskReadIOPS' },
  { label: '系统磁盘写IOPS', value: 'DiskWriteIOPS' },
  { label: 'cpu_idle', value: 'cpu_idle' },
  { label: 'cpu_other', value: 'cpu_other' },
  { label: 'cpu_wait', value: 'cpu_wait' },
  { label: 'cpu_user', value: 'cpu_user' },
  { label: 'cpu_system', value: 'cpu_system' },
  { label: 'memory_totalspace', value: 'memory_totalspace' },//
  { label: 'memory_usedspace', value: 'memory_usedspace' },//
  { label: 'memory_actualusedspace', value: 'memory_actualusedspace' },//
  { label: 'load_15m', value: 'load_15m' },//
  { label: 'load_1m', value: 'load_1m' },//
  { label: 'load_5m', value: 'load_5m' },//

  { label: 'diskusage_free', value: 'diskusage_free' },//
  { label: 'diskusage_used', value: 'diskusage_used' },//
  { label: 'disk_readbytes', value: 'disk_readbytes' },//
  { label: 'disk_writebytes', value: 'disk_writebytes' },//
  { label: 'disk_readiops', value: 'disk_readiops' },//
  { label: 'disk_writeiops', value: 'disk_writeiops' },//
  { label: 'Inode使用率', value: 'fs_inodeutilization' },//

  { label: 'networkin_rate', value: 'networkin_rate' },///
  { label: 'networkout_rate', value: 'networkout_rate' },
  { label: 'networkin_errorpackages', value: 'networkin_errorpackages' },
  { label: 'networkin_packages', value: 'networkin_packages' },
  { label: 'networkout_errorpackages', value: 'networkout_errorpackages' },
  { label: 'networkout_packages', value: 'networkout_packages' },///





  // { label: 'Host.disk.utilization', value: 'diskusage_utilization' },//
  // { label: 'Host.diskussage.total', value: 'diskusage_total' },//


  // { label: 'Host.mem.freeutilization', value: 'memory_freeutilization' },//
  // { label: 'Host.mem.usedutilization', value: 'memory_usedutilization' },//
  // { label: 'Host.tcpconnection', value: 'net_tcpconnection' },//

];
export const dockerData = [
  { label: 'CPU使用率', value: 'cpu' },
  { label: '内存使用量', value: 'memory' },
  { label: '网络流入带宽', value: 'rx_bytes' },
  { label: '网络流出带宽', value: 'tx_bytes' }
];
export const dropDownServerMin = [
  { label: '1分钟', value: 1 },
  { label: '5分钟', value: 5 },
  { label: '15分钟', value: 15 },
  { label: '30分钟', value: 30 },
  { label: '60分钟', value: 60 },
];
export const MinuteContent = [
  { label: '1分钟', value: 1 },
  { label: '5分钟', value: 5 },
  { label: '15分钟', value: 15 },
  { label: '30分钟', value: 30 },
  { label: '60分钟', value: 60 },
]
export const dropDownAvarageValue = [
  { label: '平均值', value: 'average' },
  { label: '总是', value: 'always' },
  { label: '只要有一次', value: 'once' },
];
export const dropDownServerSign = [
  { label: '>=', value: 'gte' },
  { label: '>', value: 'gt' },
  { label: '<=', value: 'lte' },
  { label: '<', value: 'lt' },
  { label: '==', value: 'e' },
  { label: '!=', value: 'ne' },
  { label: 'between', value: 'between' },
];
export const dropDownTime = [
  { label: 1, value: 1 },
  { label: 3, value: 3 },
  { label: 5, value: 5 },
];
export const monitorObjectData = [


]

export const dockerRankData = [
  { "Metric": "cpu", 'describe': 'CPU使用率', 'unit': '%' },
  { "Metric": "memory", 'describe': '内存使用量', 'unit': 'bytes' },
  { "Metric": "rx_bytes", 'describe': '网络流入带宽', 'unit': 'bytes/s' },
  { "Metric": "tx_bytes", 'describe': '网络流出带宽', 'unit': 'bytes/s' },
]

export const listData = [

  //docker
  { "Metric": "cpu", 'describe': 'CPU使用率', 'unit': '%' },
  { "Metric": "memory", 'describe': '内存使用量', 'unit': 'bytes' },
  { "Metric": "rx_bytes", 'describe': '网络流入带宽', 'unit': 'bytes/s' },
  { "Metric": "tx_bytes", 'describe': '网络流出带宽', 'unit': 'bytes/s' },
  //redis
  { "Metric": "IntranetIn", 'describe': '写入网络带宽', 'unit': 'bits/s' },
  { "Metric": "IntranetOut", 'describe': '读取网络带宽', 'unit': 'bits/s' },
  { "Metric": "FailedCount", 'describe': '操作失败数', 'unit': '次/秒' },
  { "Metric": "ConnectionUsage", 'describe': '已用连接数百分比', 'unit': '%' },
  { "Metric": "MemoryUsage", 'describe': '已用容量百分比', 'unit': '%' },
  { "Metric": "IntranetInRatio", 'describe': '写入带宽使用率', 'unit': '%' },
  { "Metric": "IntranetOutRatio", 'describe': '读取带宽使用率', 'unit': '%' },
  //rds
  { "Metric": "DiskUsage", 'describe': '磁盘使用率', 'unit': '%' },
  { "Metric": "IOPSUsage", 'describe': 'IOPS使用率', 'unit': '%' },
  { "Metric": "ConnectionUsage", 'describe': '连接数使用率', 'unit': '%' },
  { "Metric": "CpuUsage", 'describe': 'CPU使用率', 'unit': '%' },
  { "Metric": "MemoryUsage", 'describe': '内存使用率', 'unit': '%' },
  { "Metric": "MySQL_NetworkInNew", 'describe': 'MySQL网络入流量', 'unit': 'bits/s' },
  { "Metric": "MySQL_NetworkOutNew", 'describe': 'MySQL网络出流量', 'unit': 'bits/s' },

  //slb
  { 'Metric': 'TrafficRXNew', 'describe': '端口流入带宽', 'unit': 'bits/s', },
  { 'Metric': 'TrafficTXNew', 'describe': '端口流出带宽', 'unit': 'bits/s', },
  { 'Metric': 'NewConnection', 'describe': '端口新建连接数', 'unit': '个', },
  { 'Metric': 'PacketRX', 'describe': '端口流入数据包数', 'unit': '次/秒', },
  { 'Metric': 'PacketTX', 'describe': '端口流出数据包数', 'unit': '次/秒', },
  { 'Metric': 'ActiveConnection', 'describe': '端口活跃连接数', 'unit': '个', },
  { 'Metric': 'InactiveConnection', 'describe': '端口非活跃连接数', 'unit': '个', },
  //oss
  // { "Metric": "MeteringStorageUtilization", 'describe': '存储大小', 'unit': 'Bytes' },
  // { "Metric": "MeteringInternetTX", 'describe': '公网流出计量流量', 'unit': 'Bytes' },
  // { "Metric": "MeteringPutRequest", 'describe': 'Put类请求数', 'unit': '次' },
  // { "Metric": "MeteringGetRequest", 'describe': 'Get类请求数', 'unit': '次' },
  //用户层级可用性/有效请求率
  { "Metric": "UserAvailability", 'describe': ' 用户层级可用性', 'unit': '%', "title": "用户层级可用性/有效请求率(%)" },
  { "Metric": "UserRequestValidRate", 'describe': ' 用户层级有效请求率', 'title': '用户层级可用性/有效请求率(%)', 'unit': '%' },
  //用户层级总请求数/有效请求数
  { "Metric": "UserTotalRequestCount", 'describe': '用户层级总请求数', 'unit': '次', 'title': '用户层级总请求数/有效请求数(次)', },
  { "Metric": "UserValidRequestCount", 'describe': '用户层级有效请求数', 'unit': '次', 'title': '用户层级总请求数/有效请求数(次)', },
  //用户层级流量
  { "Metric": "UserInternetRecv", 'describe': '用户层级公网流入流量', 'title': '用户层级流量', 'unit': 'Bytes' },
  { "Metric": "UserInternetSend", 'describe': '用户层级公网流出流量', 'title': '用户层级流量', 'unit': 'Bytes' },
  { "Metric": "UserIntranetRecv", 'describe': '用户层级内网流入流量', 'title': '用户层级流量', 'unit': 'Bytes' },//
  { "Metric": "UserIntranetSend", 'describe': '用户层级内网流出流量', 'title': '用户层级流量', 'unit': 'Bytes' },
  { "Metric": "UserCdnRecv", 'describe': '用户层级cdn流入流量', 'title': '用户层级流量', 'unit': 'Bytes' },//
  { "Metric": "UserCdnSend", 'describe': '用户层级cdn流出流量', 'title': '用户层级流量', 'unit': 'Bytes' },//
  { "Metric": "UserAuthorizationErrorCount", 'describe': '用户层级授权错误请求数', 'unit': '次' },//1
  { "Metric": "UserResourceNotFoundErrorCount", 'describe': '用户层级资源不存在错误请求数', 'unit': '次' },
  { "Metric": "UserClientOtherErrorCount", 'describe': '用户层级客户端其他错误请求总数', 'unit': '次' },
  { "Metric": "UserSuccessCount", 'describe': '用户层级成功请求数', 'unit': '次' },//1
  // { "Metric": "UserSyncSend", 'describe': '用户层级跨区域复制流出流量', 'unit': 'Bytes' },
  // { "Metric": "UserSyncRecv", 'describe': '用户层级跨区域复制流入流量', 'unit': 'Bytes' },//1

  //ecs
  { "Metric": "CPUUtilization", 'describe': 'CPU使用率', 'unit': '%', 'category': 'base', 'identifier': 'CPUUtilization' },
  { "Metric": "InternetInRate", 'describe': 'EIP-网络流入带宽', 'unit': 'bps' },
  // { "Metric": "IntranetInRate", 'describe': 'EIP-网络流入带宽', 'unit': 'bps', 'category': 'base', 'identifier': 'IntranetInRate' },
  { "Metric": "InternetOutRate", 'describe': 'EIP-网络流出带宽', 'unit': 'bps' },
  // { "Metric": "IntranetOutRate", 'describe': 'EIP-网络流出带宽', 'unit': 'bps', 'category': 'base', 'identifier': 'IntranetOutRate' },
  { "Metric": "DiskReadBPS", 'describe': '系统磁盘总读BPS', 'title': '系统磁盘BPS', 'unit': 'bps', 'category': 'base', 'identifier': 'BPS' },
  { "Metric": "DiskWriteBPS", 'describe': '系统磁盘总写BPS', 'title': '系统磁盘BPS', 'unit': 'bps', 'category': 'base', 'identifier': 'BPS' },
  { "Metric": "DiskReadIOPS", 'describe': '系统磁盘读IOPS', 'title': '系统磁盘IOPS', 'unit': '次/秒', 'category': 'base', 'identifier': 'IOPS' },
  { "Metric": "DiskWriteIOPS", 'describe': '系统磁盘写IOPS', 'title': '系统磁盘IOPS', 'unit': '次/秒', 'category': 'base', 'identifier': 'IOPS' },
  { "Metric": "cpu_idle", 'describe': 'cpu_idle', 'title': 'CPU使用率', 'unit': '%', 'identifier': 'cpu' },
  { "Metric": "cpu_other", 'describe': 'cpu_other', 'title': 'CPU使用率', 'unit': '%', 'identifier': 'cpu' },
  { "Metric": "cpu_wait", 'describe': 'cpu_wait', 'title': 'CPU使用率', 'unit': '%', 'identifier': 'cpu' },
  { "Metric": "cpu_user", 'describe': 'cpu_user', 'title': 'CPU使用率', 'unit': '%', 'identifier': 'cpu' },
  { "Metric": "cpu_system", 'describe': 'cpu_system', 'title': 'CPU使用率', 'unit': '%', 'identifier': 'cpu' },
  { "Metric": "networkin_rate", 'describe': 'networkin_rate', 'title': '网络流入流出速率 ', 'unit': 'bits/s', 'identifier': 'rate' },
  { "Metric": "networkout_rate", 'describe': 'networkout_rate', 'title': '网络流入流出速率 ', 'unit': 'bits/s', 'identifier': 'rate' },
  { 'Metric': 'networkin_errorpackages', 'describe': 'networkin_errorpackages', 'title': '网络流入流出数据包数 ', 'unit': '个/秒' },
  { "Metric": "networkin_packages", 'describe': 'networkin_packages', 'title': '网络流入流出数据包数 ', 'unit': '个/秒' },
  { "Metric": "networkout_errorpackages", 'describe': 'networkout_errorpackages', 'title': '网络流入流出数据包数 ', 'unit': '个/秒' },
  { "Metric": "networkout_packages", 'describe': 'networkout_packages', 'title': '网络流入流出数据包数 ', 'unit': '个/秒' },
  { "Metric": "diskusage_used", 'describe': 'diskusage_used', 'title': '磁盘使用量 ', 'unit': 'bytes', 'conversion': 1073741824, 'identifier': 'diskusage' },
  { "Metric": "diskusage_free", 'describe': 'diskusage_free', 'title': '磁盘使用量 ', 'unit': 'bytes', 'conversion': 1073741824, 'identifier': 'diskusage' },
  { "Metric": "disk_readbytes", 'describe': 'disk_readbytes', 'title': '读写字节数 ', 'unit': 'bytes/S', 'conversion': 1024, 'identifier': 'bytes' },
  { "Metric": "disk_writebytes", 'describe': 'disk_writebytes', 'title': '读写字节数 ', 'unit': 'bytes/S', 'conversion': 1024, 'identifier': 'bytes' },
  { "Metric": "disk_readiops", 'describe': 'disk_readiops', 'title': '读写请求数', 'unit': '次/秒', 'identifier': 'iops' },
  { "Metric": "disk_writeiops", 'describe': 'disk_writeiops', 'title': '读写请求数', 'unit': '次/秒', 'identifier': 'iops' },
  // { "Metric": "diskusage_utilization", 'describe': 'Host.diskusage.free', 'unit': '%' },
  // { "Metric": "diskusage_total", 'describe': 'Host.diskussage.tota', 'unit': '	bytes' },
  { "Metric": "load_1m", 'describe': 'Host.load1', 'title': '系统平均负载 ', 'identifier': 'load', 'unit': '' },
  { "Metric": "load_15m", 'describe': 'load_15m', 'title': '系统平均负载 ', 'identifier': 'load', 'unit': '' },
  { "Metric": "load_5m", 'describe': 'Host.load5', 'title': '系统平均负载 ', 'identifier': 'load', 'unit': '' },
  { "Metric": "memory_totalspace", 'describe': 'Host.mem.total', 'title': '内存使用量 ', 'unit': 'bytes', 'conversion': 1073741824, 'identifier': 'mem' },
  { "Metric": "memory_usedspace", 'describe': 'Host.mem.used', 'title': '内存使用量 ', 'unit': 'bytes', 'conversion': 1073741824, 'identifier': 'mem' },
  { "Metric": "memory_actualusedspace", 'describe': 'Host.mem.actualused', 'title': '内存使用量 ', 'unit': 'bytes', 'conversion': 1073741824, 'identifier': 'mem' },
  { "Metric": "fs_inodeutilization", 'describe': '	Inode使用率', 'unit': '%' },
];

