import { CommonRequestMethodService } from './../../../../core/common-service/request-method.service';
import { INCONFIG } from './../../../../core/global';
import { Injectable } from '@angular/core';
@Injectable()
export class DataStrategyService {
    // 微服务名字
    public fileServerSrc = INCONFIG.fileServerSrc;
    public dataServerSrc = INCONFIG.dataServerSrc;
    constructor(
        public commonRequestMethodService: CommonRequestMethodService
    ) { }


    /**
     * 获取 数据规则 的列表数据
     * post请求
     * @param {any} params ruleId?:String,ruleName?:string,description?:string
     * @param {any} __this 
     * @param {any} successHandler 
     * @returns 
     * @memberof DataStrategyService
     */
    public getRuleListData(params, __this, successHandler) {
        let url = this.dataServerSrc + '/app/dataresource/rule/query';
        return this.commonRequestMethodService.doPost(__this, url, params, successHandler)
    }
    /**
     * 添加 规则
     * 
     * @param {any} __this 
     * @param {any} data 
     * @param {any} successHandler 
     * @returns 
     * @memberof DataStrategyService
     */
    public addRuleReq(data, __this, successHandler) {
        let url = this.dataServerSrc + '/app/dataresource/rule/add';
        return this.commonRequestMethodService.doPost(__this, url, data, successHandler)
    }

    /**
     * 查看 规则信息
     * 
     * @param {any} __this 
     * @param {any} params 
     * @param {any} successHandler 
     * @returns 
     * @memberof DataStrategyService
     */
    public viewRuleReq(__this, params, successHandler) {
        let url = this.dataServerSrc + '';
        return this.commonRequestMethodService.doGet(url, params, __this, successHandler)
    }
    /**
     * 更新 规则信息
     * 
     * @param {any} __this 
     * @param {any} data objectId:string
     * @param {any} successHandler 
     * @returns 
     * @memberof DataStrategyService
     */
    public updateRuleReq(data, __this, successHandler) {
        let url = this.dataServerSrc + '/app/dataresource/rule/update';
        return this.commonRequestMethodService.doPost(__this, url, data, successHandler)
    }
    /**
     * 删除 规则信息
     * 
     * @param {any} __this 
     * @param {any} data ruleId:string
     * @param {any} successHandler 
     * @returns 
     * @memberof DataStrategyService
     */
    public delRuleReq(data, __this, successHandler) {
        let url = this.dataServerSrc + '/app/dataresource/rule/delete';
        return this.commonRequestMethodService.doPost(__this, url, data, successHandler)
    }

    /**
     * 验证 是否重名
     * 
     * @param {any} __this 
     * @param {any} params 
     * @param {any} successHandler 
     * @returns 
     * @memberof DataStrategyService
     */
    public verifyTextInput(params, __this, successHandler) {
        let url = this.dataServerSrc + '/app/dataresource/rule/checkCode';
        return this.commonRequestMethodService.doPost(__this, url, params, successHandler)
    }

    // 规则策略

    /**
     * 优先级设置  保存请求
     * 
     * @param {any} params 【{ruleId:String,priority:}，{}】
     * @param {any} __this 
     * @param {any} successHandler 
     * @returns 
     * @memberof DataStrategyService
     */
    public savePriority(params, __this, successHandler) {
        let url = this.dataServerSrc + '/app/dataresource/rule/update/priority';
        return this.commonRequestMethodService.doPost(__this, url, params, successHandler)
    }
    /**
    * 优先级设置  取消请求
    * 
    * @param {any} params 【{ruleId:String,priority:}，{}】
    * @param {any} __this 
    * @param {any} successHandler 
    * @returns 
    * @memberof DataStrategyService
    */
    public canclePriority(params, __this, successHandler) {
        let url = this.dataServerSrc + '/app/dataresource/rule/delete/priority';
        return this.commonRequestMethodService.doPost(__this, url, params, successHandler)
    }

    /**
      * 获取优先级策略  请求
      * post 请求
      * @param {any} params 全局时，传isGlobal:true,appId, 特定资源时 dataresourceId,appId,isGlobal:false
      * @param {any} __this 
      * @param {any} successHandler 
      * @returns 
      * @memberof DataStrategyService
      */
    public getPriority(params, __this, successHandler) {
        let url = this.dataServerSrc + '/app/dataresource/rule/priority/queryListByDataresourceId';
        return this.commonRequestMethodService.doPost(__this, url, params, successHandler)
    }

    /**
     * 获取融合策略  请求
     * * get 请求
     * @param {any} params dataResourceId
     * @param {any} __this 
     * @param {any} successHandler 
     * @returns 
     * @memberof DataStrategyService
     */
    public getFusionlistReq(params, __this, successHandler) {
        let url = this.dataServerSrc + '/app/dataresource/rule/fusion/queryList';
        return this.commonRequestMethodService.doGet(url, params, __this, successHandler)
    }

    /**
     * 添加 融合策略
     * 
     * @param {any} __this appId，
     * @param {any} data 
     * @param {any} successHandler 
     * @returns 
     * @memberof DataStrategyService
     */
    public addStrategyReq(data, __this, successHandler) {
        console.log(data);
        let url = this.dataServerSrc + '/app/dataresource/rule/fusion/add';
        return this.commonRequestMethodService.doPost(__this, url, data, successHandler)
    }

    /**
     * 更新 融合策略
     * 
     * @param {any} __this appId，
     * @param {any} data 
     * @param {any} successHandler 
     * @returns 
     * @memberof DataStrategyService
     */
    public updateStrategyReq(data, __this, successHandler) {
        let url = this.dataServerSrc + '/app/dataresource/rule/fusion/update';
        return this.commonRequestMethodService.doPost(__this, url, data, successHandler)
    }

    /**
     * 查看 策略
     * 
     * @param {any} __this 
     * @param {any} data objectId
     * @param {any} successHandler 
     * @returns 
     * @memberof DataStrategyService
     */
    public viewStrategyReq(data, __this, successHandler) {
        let url = this.dataServerSrc + '/app/dataresource/rule/fusion/getById';
        return this.commonRequestMethodService.doGet(url, data, __this, successHandler)
    }


    /**
     * 删除 策略
     * 
     * @param {any} __this 
     * @param {any} data objectId
     * @param {any} successHandler 
     * @returns 
     * @memberof DataStrategyService
     */
    public delStrategyReq(data, __this, successHandler) {
        let url = this.dataServerSrc + '/app/dataresource/rule/fusion/delete';
        return this.commonRequestMethodService.doPost(__this, url, data, successHandler)
    }

}





