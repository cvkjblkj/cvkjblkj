import { Http, Response } from '@angular/http';
import { CommonRequestMethodService } from './../../../core/common-service/request-method.service';
import { Observable } from 'rxjs/Observable';
import { INCONFIG } from './../../../core/global';
import { Injectable } from '@angular/core';
declare var $: any;
@Injectable()
export class JournalInfoService {
  public serviceName = INCONFIG.journalServerSrc;
  public appListData: any;
  public button: any;// 下载按钮的值的集合
  constructor(
    public commonRequestMethodService: CommonRequestMethodService,
    public http: Http
  ) { }

  /**
   * 日志搜索过滤
   * @param url 请求地址
   * @param value 请求参数
   */
  public searchData(__this: any, url: any, value: any, successhandler?: any, errorhandler?: any) {
    let requestUrl = this.serviceName + url;
    this.commonRequestMethodService.doPost(__this, requestUrl, value, successhandler, errorhandler)
  }
  /**
   * 日志下载
   * @param url 请求路径
   * @param value 请求参数
   */
  public downloadData(__this: any, url: any, value: any, successhandler?: any, errorhandler?: any) {
    let requestUrl = this.serviceName + url;
    return this.commonRequestMethodService.doPost(__this, requestUrl, value, successhandler, errorhandler)
  }
  /**
   * 下载文件的方法
   * @param options 下载文件需要的参数
   */
  DownLoadFile(options) {
    var config = $.extend(true, { method: 'post' }, options);
    var $iframe = $('<iframe id="down-file-iframe" />');
    var $form = $('<form target="down-file-iframe" method="' + config.method + '" />');
    $form.attr('action', config.url);
    for (var key in config.data) {
      $form.append('<input type="hidden" name="' + key + '" value="' + config.data[key] + '" />');
    }
    $iframe.append($form);
    $(document.body).append($iframe);
    // console.log($form[0]);
    $form.submit();
    $iframe.remove();
  }


}
