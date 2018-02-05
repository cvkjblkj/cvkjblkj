import { Input, Output, EventEmitter, OnChanges, ViewChild, NgZone, } from '@angular/core';
import { Component, OnInit, AfterViewInit } from '@angular/core';

const echarts = require('echarts');    // 加载echarts
declare const $: any;   // 引入jQuery
@Component({
	selector: 'echarts-ng2',
	templateUrl: 'echarts.component.html'
})

export class EchartsComponent implements OnInit, OnChanges, AfterViewInit {
	private myEcharts: any; // 初始化echarts
	// private _option: any;
	@ViewChild('ecahrtsMain') ecahrtsMain: any // ecahrts 外层容器


	@Input() option: any;

	@Input() showLoading: boolean; // loading动画是否显示
	@Input() loadingTime: any; // loading动画显示时间
	@Output() clickEvent: any;  // 点击

	constructor() {

	}

	ngOnChanges() {
		if (this.myEcharts) {
			this.myEcharts.setOption(this.option);
		}
	}

	ngOnInit() {

	}

	ngAfterViewInit() {
		this.option = this.option ? this.option : {};
		this.myEcharts = echarts.init(this.ecahrtsMain.nativeElement);
		this.myEcharts.setOption(this.option);
		// loading动画
		if (this.showLoading) {
			this.haveShowLoading();
		}
		// this.myEcharts.setOption(this.option);
		this.myEcharts.on('click', function (params) {
			console.log('click==');

		});
	}

	/**
	 * 根据传入的showLoading值判断loading的动画 显示 or 隐藏
	 * 
	 * @memberof EchartsComponent
	 * @author Vicky
	 */
	haveShowLoading() {
		this.myEcharts.showLoading();
		let time = Number(this.loadingTime ? this.loadingTime : 3000);
		setTimeout(() => {
			this.myEcharts.hideLoading();
		}, time)
	}




}