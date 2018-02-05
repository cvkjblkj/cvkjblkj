import { CommonRequestMethodService } from './../../../core/common-service/request-method.service';
import { INCONFIG } from './../../../core/global';
import { Injectable } from '@angular/core';

@Injectable()
export class StatisticAnalysisService {

    public button: any;
    public appNameFieldList: any;
    public parentParams: any; // 下钻之后返回的页面的 请求需要参数
    public dataServerSrc = INCONFIG.dataServerSrc;
    constructor(
        private commonRequestMethodService: CommonRequestMethodService
    ) { }

    /**
     * 获取指标统计数据
     * 
     * @param {any} __this 组件的this指向
     * @param {any} data 请求参数
     * @param {any} successHandler 成功的处理函数 
     * @memberof StatisticAnalysisService
     */
    getCount(__this, data, successHandler) {
        let url = this.dataServerSrc + '/statistics/app/getCount';
        this.commonRequestMethodService.doPost(__this, url, data, successHandler)
    }

    /**
     * 获取企业列表数据项
     * 
     * @param {any} __this 
     * @param {any} data 
     * @param {any} successHandler 
     * @memberof StatisticAnalysisService
     */
    getEnpList(__this, data, successHandler) {
        let url = this.dataServerSrc + '/enterprise/getListByApp';
        this.commonRequestMethodService.doGet(url, data, __this, successHandler);
    }



}