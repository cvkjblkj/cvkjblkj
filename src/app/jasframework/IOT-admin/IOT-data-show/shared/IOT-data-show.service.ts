import { CommonRequestMethodService } from './../../../../core/common-service/request-method.service';
import { INCONFIG } from './../../../../core/global';
import { Injectable } from '@angular/core';

@Injectable()
export class IOTDataShowService {
    public token = INCONFIG.getToken();
    public IOTServerSrc = INCONFIG.IOTServerSrc;
    constructor(
        private commonRequestMethodService: CommonRequestMethodService
    ) { }

    //
    /**
     * 获取 IOT的所有设备名称
     * 
     * @param {any} __this 调用组件的this指向
     * @param {any} params 请求参数
     * @param {any} successHandler 成功处理函数
     * @memberof IOTDataShowService
     */
    getTreeIOT(__this, params, successHandler) {
        let url = this.IOTServerSrc + '/realtime/nosqlt/tag/v2/getAllSources';
        this.commonRequestMethodService.doGet(url, params, __this, successHandler);
    }


    /**
     * 获取实时数据
     * 
     * @param {any} __this 调用组件的this指向
     * @param {any} params 请求参数
     * @param {any} successHandler 成功处理函数
     * @memberof IOTDataShowService
     */
    getRealTimeData(__this, params, successHandler) {
        let url = this.IOTServerSrc + '/realtime/nosqlt/realtime/v2/read';
        this.commonRequestMethodService.doGet(url, params, __this, successHandler)
    }

    /**
     * 获取历史数据
     * 
     * @param {any} __this 调用组件的this指向
     * @param {any} params 请求参数
     * @param {any} successHandler 成功处理函数
     * @memberof IOTDataShowService
     */
    getHistoryData(__this, params, successHandler) {
        let url = this.IOTServerSrc + '/realtime/nosqlt/history/v2/read';
        this.commonRequestMethodService.doGet(url, params, __this, successHandler)
    }

    /**
     * 根据id 获取历史数据所有值
     * 
     * @param {any} __this 调用组件的this指向
     * @param {any} params 请求参数
     * @param {any} successHandler 成功处理函数
     * @memberof IOTDataShowService
     */
    getHistoryDataById(__this, params, successHandler) {
        let url = this.IOTServerSrc + '/realtime/nosqlt/tag/v2/getById';
        this.commonRequestMethodService.doGet(url, params, __this, successHandler)
    }



    /**
     * 设置 echarts的配置项
     * 
     * @param {any} dataArr 后台数据
     * @memberof RealTimeDataComponent
     */
    setRealTimeOPtions(dataArr) {
        let i;
        let data = [];
        let _this = this;
        // echarts配置项
        let optionsTmp = {
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis',
            },
            legend: {
                data: [],
            },
            yAxis: {
                type: 'value',
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: [],
            },
            series: [{ name: '', type: 'line', data: [], lineStyle: "1px", }]
        };
        for (i = 0; i < dataArr.length; i++) {
            let item = dataArr[i];
            optionsTmp.title.text = item.tagName.slice(0,item.tagName.indexOf('.'));
            optionsTmp.legend.data = [item.tagName.slice(item.tagName.indexOf('.') + 1, item.tagName.length)];
            optionsTmp.xAxis.data.push(item.timestamp);
            optionsTmp.series[0].name = optionsTmp.legend.data[0];
            data.push(item.value);
            optionsTmp.series[0].data = data;
        };
        return optionsTmp;
    }

}