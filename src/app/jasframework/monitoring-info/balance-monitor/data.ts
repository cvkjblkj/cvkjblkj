export const balanceDate = {
  'Balancer': [

    { 'Metric': 'TrafficRXNew', 'describe': '端口流入带宽', 'unit': 'bits/s', },
    { 'Metric': 'TrafficTXNew', 'describe': '端口流出带宽', 'unit': 'bits/s', },
    { 'Metric': 'NewConnection', 'describe': '端口新建连接数', 'unit': '个', },
    { 'Metric': 'PacketRX', 'describe': '端口流入数据包数', 'unit': '次/秒', },
    { 'Metric': 'PacketTX', 'describe': '端口流出数据包数', 'unit': '次/秒', },
    { 'Metric': 'ActiveConnection', 'describe': '端口活跃连接数', 'unit': '个', },
    { 'Metric': 'InactiveConnection', 'describe': '端口非活跃连接数', 'unit': '个', },

  ],
  'OSS': [
    { "Metric": "MeteringStorageUtilization", 'describe': '存储大小', 'unit': 'Bytes' },
    { "Metric": "MeteringInternetTX", 'describe': '公网流出计量流量', 'unit': 'Bytes' },
    { "Metric": "MeteringPutRequest", 'describe': 'Put类请求数', 'unit': '次' },
    { "Metric": "MeteringGetRequest", 'describe': 'Get类请求数', 'unit': '次' },
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
    { "Metric": "UserResourceNotFoundErrorCount", 'describe': '用户层级资源不存在错误请求数', 'unit': '%' },
    { "Metric": "UserClientOtherErrorCount", 'describe': '用户层级客户端其他错误请求总数', 'unit': '次' },
    { "Metric": "UserSuccessCount", 'describe': '用户层级成功请求数', 'unit': '%' },//1

],
  'Bucket': [
    //buket层级可用性/有效请求率
    { "Metric": "Availability", 'describe': ' 可用性', 'title': 'Bucket层级可用性/有效请求率(%)', 'unit': '%' },//
    { "Metric": "RequestValidRate", 'describe': ' 有效请求率', 'title': 'Bucket层级可用性/有效请求率(%)', 'unit': '%' },//
    //用户层级总请求数/有效请求数
    { "Metric": "TotalRequestCount", 'describe': '总请求数', 'unit': '次', 'title': 'Bucket层级总请求数/有效请求数(次)', },//
    { "Metric": "ValidRequestCount", 'describe': '有效请求数', 'unit': '次', 'title': 'Bucket层级总请求数/有效请求数(次)', },//

    { "Metric": "InternetRecv", 'describe': '公网流入流量', 'title': 'Bucket层级流量', 'unit': 'Bytes' },//
    { "Metric": "InternetSend", 'describe': '公网流出流量', 'title': 'Bucket层级流量', 'unit': 'Bytes' },//
    { "Metric": "IntranetRecv", 'describe': '内网流入流量', 'title': 'Bucket层级流量', 'unit': 'Bytes' },//
    { "Metric": "IntranetSend", 'describe': '内网流出流量', 'title': 'Bucket层级流量', 'unit': 'Bytes' },//
    { "Metric": "CdnRecv", 'describe': 'cdn流入流量', 'title': 'Bucket层级流量', 'unit': 'Bytes' },//
    { "Metric": "CdnSend", 'describe': 'cdn流出流量', 'title': 'Bucket层级流量', 'unit': 'Bytes' },//
    { "Metric": "SyncRecv", 'describe': '跨区域复制流入流量', 'title': 'Bucket层级流量', 'unit': 'Bytes' },//
    { "Metric": "SyncSend", 'describe': '跨区域复制流出流量', 'title': 'Bucket层级流量', 'unit': 'Bytes' },


    { "Metric": "AuthorizationErrorCount", 'describe': 'Bucket层级授权错误请求数', 'unit': '%' },//
    { "Metric": "ResourceNotFoundErrorCount", 'describe': 'Bucket层级资源不存在错误请求数', 'unit': '%' },
    { "Metric": "ClientOtherErrorCount", 'describe': 'Bucket层级客户端其他错误请求数', 'unit': '%' },
    { "Metric": "SuccessCount", 'describe': 'Bucket层级成功请求数', 'unit': '%' },



    { "Metric": "MeteringStorageUtilization", 'describe': '存储大小', 'unit': 'Bytes' },
    { "Metric": "MeteringInternetTX", 'describe': '公网流出计量流量', 'unit': 'Bytes' },
    { "Metric": "MeteringPutRequest", 'describe': 'Put类请求数', 'unit': '次' },
    { "Metric": "MeteringGetRequest", 'describe': 'Get类请求数', 'unit': '次' },






  ],
  'RDS': [
    { "Metric": "DiskUsage", 'describe': '磁盘使用率', 'unit': '%' },
    { "Metric": "IOPSUsage", 'describe': 'IOPS使用率', 'unit': '%' },
    { "Metric": "ConnectionUsage", 'describe': '连接数使用率', 'unit': '%' },
    { "Metric": "CpuUsage", 'describe': 'CPU使用率', 'unit': '%' },
    { "Metric": "MemoryUsage", 'describe': '内存使用率', 'unit': '%' },
    { "Metric": "MySQL_NetworkInNew", 'describe': 'MySQL网络入流量', 'unit': 'bits/s' },
    { "Metric": "MySQL_NetworkOutNew", 'describe': 'MySQL网络出流量', 'unit': 'bits/s' },
  ],
  'Redis': [
    { "Metric": "IntranetIn", 'describe': '写入网络带宽', 'unit': 'bits/s' },
    { "Metric": "IntranetOut", 'describe': '读取网络带宽', 'unit': 'bits/s' },
    { "Metric": "FailedCount", 'describe': '操作失败数', 'unit': '次/秒' },
    { "Metric": "ConnectionUsage", 'describe': '已用连接数百分比', 'unit': '%' },
    { "Metric": "MemoryUsage", 'describe': '已用容量百分比', 'unit': '%' },
    { "Metric": "IntranetInRatio", 'describe': '写入带宽使用率', 'unit': '%' },
    { "Metric": "IntranetOutRatio", 'describe': '读取带宽使用率', 'unit': '%' },
  ],
  // 主机监控
  // category:类别，是基础还是操作系统
  // identifier：唯一标识符，判断是否是在一个图表里

  'ECS': [

    { "Metric": "CPUUtilization", 'describe': 'CPU使用率', 'unit': '%', 'category': 'base', 'identifier': 'CPUUtilization' },
    { "Metric": "IntranetInRate", 'describe': 'EIP-网络流入带宽', 'unit': 'bps', 'category': 'base', 'identifier': 'IntranetInRate' },
    { "Metric": "IntranetOutRate", 'describe': 'EIP-网络流出带宽', 'unit': 'bps', 'category': 'base', 'identifier': 'IntranetOutRate' },
    //系统磁盘BPS
    { "Metric": "DiskReadBPS", 'describe': '系统磁盘总读BPS', 'title': '系统磁盘BPS', 'unit': 'bps', 'category': 'base', 'identifier': 'BPS' },
    { "Metric": "DiskWriteBPS", 'describe': '系统磁盘总写BPS', 'title': '系统磁盘BPS', 'unit': 'bps', 'category': 'base', 'identifier': 'BPS' },
    //系统磁盘IOPS
    { "Metric": "DiskReadIOPS", 'describe': '系统磁盘读IOPS', 'title': '系统磁盘IOPS', 'unit': '次/秒', 'category': 'base', 'identifier': 'IOPS' },
    { "Metric": "DiskWriteIOPS", 'describe': '系统磁盘写IOPS', 'title': '系统磁盘IOPS', 'unit': '次/秒', 'category': 'base', 'identifier': 'IOPS' },
    //CPU使用率
    { "Metric": "cpu_idle", 'describe': 'Host.cpu.idle', 'title': 'CPU使用率', 'unit': '%', 'identifier': 'cpu' },
    { "Metric": "cpu_other", 'describe': 'Host.cpu.other', 'title': 'CPU使用率', 'unit': '%', 'identifier': 'cpu' },
    { "Metric": "cpu_wait", 'describe': 'Host.cpu.iowait', 'title': 'CPU使用率', 'unit': '%', 'identifier': 'cpu' },
    { "Metric": "cpu_user", 'describe': 'Host.cpu.user', 'title': 'CPU使用率', 'unit': '%', 'identifier': 'cpu' },
    { "Metric": "cpu_system", 'describe': 'Host.cpu.system', 'title': 'CPU使用率', 'unit': '%', 'identifier': 'cpu' },
    //内存使用量
    { "Metric": "memory_totalspace", 'describe': 'Host.mem.total', 'title': '内存使用量 ', 'unit': 'bytes', 'conversion': 1073741824, 'identifier': 'mem' },
    { "Metric": "memory_usedspace", 'describe': 'Host.mem.used', 'title': '内存使用量 ', 'unit': 'bytes', 'conversion': 1073741824, 'identifier': 'mem' },
    { "Metric": "memory_actualusedspace", 'describe': 'Host.mem.actualused', 'title': '内存使用量 ', 'unit': 'bytes', 'conversion': 1073741824, 'identifier': 'mem' },
    //系统平均负载
    { "Metric": "load_1m", 'describe': 'Host.load1', 'title': '系统平均负载 ', 'identifier': 'load' },
    { "Metric": "load_15m", 'describe': 'Host.load15', 'title': '系统平均负载 ', 'identifier': 'load' },
    { "Metric": "load_5m", 'describe': 'Host.load5', 'title': '系统平均负载 ', 'identifier': 'load' },
    //磁盘使用量
    { "Metric": "diskusage_used", 'describe': 'Host.diskusage.used', 'title': '磁盘使用量 ', 'unit': 'bytes', 'conversion': 1073741824, 'identifier': 'diskusage' },
    { "Metric": "diskusage_free", 'describe': 'Host.diskusage.free', 'title': '磁盘使用量 ', 'unit': 'bytes', 'conversion': 1073741824, 'identifier': 'diskusage' },
    //读写字节数
    { "Metric": "disk_readbytes", 'describe': 'Host.disk.readbytes', 'title': '读写字节数 ', 'unit': 'bytes/s', 'conversion': 1024, 'identifier': 'bytes' },
    { "Metric": "disk_writebytes", 'describe': 'Host.disk.writebytes', 'title': '读写字节数 ', 'unit': 'bytes/s', 'conversion': 1024, 'identifier': 'bytes' },
    //读写请求数
    { "Metric": "disk_readiops", 'describe': 'Host.disk.readiops', 'title': '读写请求数', 'unit': '次/秒', 'identifier': 'iops' },
    { "Metric": "disk_writeiops", 'describe': 'Host.disk.writeiops', 'title': '读写请求数', 'unit': '次/秒', 'identifier': 'iops' },
    // Inode使用率
    { "Metric": "fs_inodeutilization", 'describe': 'Inode使用率', 'unit': '%', 'identifier': 'fs_inodeutilization' },
    //网络流入流出速率
    { "Metric": "networkin_rate", 'describe': 'Host.netin.rate', 'title': '网络流入流出速率 ', 'unit': 'bits/s', 'identifier': 'rate' },
    { "Metric": "networkout_rate", 'describe': 'Host.netout.rate', 'title': '网络流入流出速率 ', 'unit': 'bits/s', 'identifier': 'rate' },
    //网络流入流出数据包数

    { 'Metric': 'networkin_errorpackages', 'describe': 'Host.netin.errorpackage', 'title': '网络流入流出数据包数 ', 'unit': '个/秒' },
    { "Metric": "networkin_packages", 'describe': 'Host.netin.packages', 'title': '网络流入流出数据包数 ', 'unit': '个/秒' },
    { "Metric": "networkout_errorpackages", 'describe': 'Host.netout.errorpackages', 'title': '网络流入流出数据包数 ', 'unit': '个/秒' },
    { "Metric": "networkout_packages", 'describe': 'Host.netout.packages', 'title': '网络流入流出数据包数 ', 'unit': '个/秒' },



  ],

  'Docker': [
    { "Metric": "cpu", 'describe': 'CPU使用率', 'unit': '%' },
    { "Metric": "memory", 'describe': '内存使用量', 'unit': 'bytes' },
    { "Metric": "netInwork", 'describe': '网络流入带宽', 'unit': 'bytes/s' },
    { "Metric": "netOutwork", 'describe': '网络流出带宽', 'unit': 'bytes/s' },

  ]


}

