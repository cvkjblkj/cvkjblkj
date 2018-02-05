
import { INCONFIG } from './../../../../core/global';
import { JasCommunicationsService } from './../../../jas/shared/jas.commumication.service';
import { JournalInfoService } from './../../../journal-info/shared/journal-info.service';
import { GlobalState } from './../../../../global.state';
import { ViewChild, AfterContentInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonService } from './../../../../core/common-service/common.service';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/primeng';

import { CommonRequestMethodService } from './../../../../core/common-service/request-method.service';
import { CommonRequestService } from './../../../../core/common-service/common-request.service';
import { indexData, dimensionData, statisticData, dateData, enpUseTypeData, enpTypeData } from '../../shared/data';
import { StatisticAnalysisService } from '../../shared/statistic-analysis.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
declare var $: any
@Component({
	selector: 'indicator',
	templateUrl: 'indicator.component.html',
	styleUrls: ['./indicator.component.scss'],
})

export class IndicatorComponent implements OnInit {
	public indexData: any; // 指标数据
	public dimensionData: any; // 维度数据
	public statisticData: any; // 筛选数据
	public dateData: any; // 日期筛选数据
	public appListData: any; // 应用列表数据
	public listShowData: any; // 展示列表数据
	public options: any; // 展示列表的配置项
	public unFrozenOptions: any = []; // 不固定列
	public frozenOptions: any = []; // 固定列

	public dimensionValue: any; // 维度选择的值
	public indexValue: any; // 指标选择的值
	public indexName: any; // 指标的name
	public appCode: any; // 应用Code  用于添加应用的选中色
	public appId: any;  // 应用id

	public isSearched: boolean = true; // 搜索按钮是否禁用
	// primeng  dataTable列表上属性设置
	public emptyMessage: string = '未查到相关数据';  // 没有数据时显示字段
	public customFrozenOptions: any; // 自定义的固定的头尾

	public button: any = {}; // 按钮集合
	public menuId: any; // 菜单id值

	public routePath: any; // 跳转路由
	// 自定义筛选 组件条件
	public loop: any = [0]; // 筛选遍历增加条件
	public conditionArr: any = []; // 判断筛选条件增加的条数
	public conditionFilterSearch: any = []; // 判断筛选条件增加的条数

	// 时间切换条件
	public dateValue: string = 'day';
	public startDate: any = new Date().getTime() - 60 * 60 * 24 * 1000 * 6; // 开始时间
	public endDate: any = new Date(); // 结束时间
	public timeType: any;  // 时间间隔类型
	// 搜索条件
	public searchCondition: any; // 搜索条件
	public queryItems: any;  // 表头数据项
	public IsFrozen: boolean = true;   // 是否需要固定列
	public totalData: any;  //总数据
	@ViewChild('dt') dt: any; // dataTable的实例
	// ecahrt
	public dimensionValueEchart: boolean = false;  // 判断折线 维度值改变时的显示状态
	public echartsOptions = {};
	public chart: any = 'line'; // 选中的图表项  用于添加图表切换的选中色 默认是折线图
	//  组件消失时,销毁订阅
	private subscription: Subscription;

	constructor(
		private statisticAnalysisService: StatisticAnalysisService,
		private commonRequestService: CommonRequestService,
		private globalState: GlobalState,
		private commonService: CommonService,
		private router: Router,
		private route: ActivatedRoute,
		private journalInfoService: JournalInfoService,
		public globaStateService: GlobalState,
		public jasCommunicationService: JasCommunicationsService,
	) {

		this.indexData = indexData;
		this.dimensionData = dimensionData;
		this.statisticData = statisticData;
		this.dateData = dateData;
		this.startDate = this.commonService.formatDate(this.startDate).formatTime;
		this.startDate = this.commonService.formatDate(this.endDate).formatTime;
		//  一级垂直菜单隐藏事件消息处理订阅方法
		this.globaStateService.subscribe('menu.isCollapsed', () => {
			setTimeout(() => {
				this.setFrozenWidth(this);
			}, 10);
			setTimeout(() => {
				this.setFrozenWidth(this);
			}, 100);
			setTimeout(() => {
				this.setFrozenWidth(this);
			}, 1000);
		});
		//  二级垂直菜单隐藏事件处理订阅方法
		this.subscription = this.jasCommunicationService.getSubscribe.subscribe(
			data => {
				if ('second-level menu change' === data) {
					setTimeout(() => {
						this.setFrozenWidth(this);
					}, 50);
					setTimeout(() => {
						this.setFrozenWidth(this);
					}, 100);
					setTimeout(() => {
						this.setFrozenWidth(this);
					}, 150);
					setTimeout(() => {
						this.setFrozenWidth(this);
					}, 200);
					setTimeout(() => {
						this.setFrozenWidth(this);
					}, 250);
					setTimeout(() => {
						this.setFrozenWidth(this);
					}, 1000);
				}
			},
			error => {
				//  console.error(error);
			}
		);


	}
	/**
	 * 页面初始化
	 *
	 * @memberof StatisticAnalysisComponent
	 */
	ngOnInit() {
		this.appListData = this.globalState.appNameList;  // 应用列表
		this.menuId = this.route.snapshot.queryParams['id'] ? this.route.snapshot.queryParams['id'] : this.route.snapshot.params['id'];
		if (this.statisticAnalysisService.parentParams) {
			let routeParams = this.statisticAnalysisService.parentParams;
			// console.log('进入------');
			// console.log(routeParams);
			this.indexName = routeParams['indexName'];
			this.indexValue = routeParams['metric'];
			this.appCode = routeParams['appCode'];
			this.appId = routeParams['appId'];
			this.dateValue = routeParams['countType'];
			this.chart = routeParams['chart'];
			if (routeParams['dimension']) {
				for (let item of dimensionData) {
					if (item.value.enName == routeParams['dimension']) {
						this.dimensionValue = item.value;
						break;
					}
				}
			}
		} else {
			this.indexValue = 'addEnterprise'; // 默认指标值
			this.indexName = '新增企业';  // 默认的指标name
		}
		// 获取应用列表
		// if (typeof this.appListData == 'string' && this.appListData.length == 0) {
		this.getEnterpriseAppList();
		// } else {
		// 	this.appCode = this.appListData[0]['appCode'];
		// 	this.appId = this.appListData[0]['objectId'];
		// }

		if (!this.statisticAnalysisService.button) {
			this.getBtn();
		} else {
			this.button = this.statisticAnalysisService.button;
		}
		// 设置冻结列
		let __that = this;
		window.onresize = () => {
			__that.setFrozenWidth(__that);
		}

	}

	/**
	 * 改变固定宽度的值
	 *
	 * @param {any} _that
	 * @memberof IndicatorComponent
	 */

	setFrozenWidth(_that) {
		let __that = this;

		// __that.dtFrozen.
	}

	/**
 	* 获取初始化按钮数据
 	*/
	public getBtn() {
		let _that = this;
		this.commonRequestService.getMenuBtn(this.menuId, _that, (res) => {
			if (res && res.success == 1) {
				_that.button = _that.commonService.viewBtn(res.rows);
				_that.statisticAnalysisService.button = _that.button;
			}
		}
		)
	}

	/**
	 * 初始化统计数据
	 *
	 * @memberof StatisticAnalysisComponent
	 */
	public initData() {
		let __that = this;
		__that.setCountCondition();
		__that.statisticAnalysisService.getCount(__that, __that.searchCondition, (res) => {
			if (res && res.success == 1 && res.rows) {
				__that.totalData = res.rows;
				__that.isSearched = true;
				__that.getOptionsAndListData(res.rows);
				__that.echartsOptions = __that.detailEchartsData(res.rows);
			}
		})
	}
	/**
	 * 获取 列表数据的 options及options对应的数据
	 *
	 * @param {any} arr 后台返回数据
	 * @memberof IndicatorComponent
	 */
	public pieTotalPercentArr = [];  // 饼图的总百分比
	getOptionsAndListData(arr) {
		this.pieTotalPercentArr = [];
		this.options = [];
		this.listShowData = [];
		// 设置冻结的头尾，总计和数据的筛选条件
		this.customFrozenOptions = {
			// 冻结头
			frozenHeader: {
				name: '',
				data: []
			},
			// 冻结尾
			frozenFooter: {
				data: []
			}
		};
		// 获取列表项的 表头
		let queryItem = arr && arr.length > 0 && arr[0].total ? arr[0].total : this.getTimeInterval(this.startDate, this.endDate, this.timeType).split(',');
		queryItem = this.getListOptions(queryItem);
		// 当数据为空时
		if (arr.length == 0) {
			// 冻结的头 显示的数据
			this.customFrozenOptions.frozenHeader.name = this.dimensionValue ? this.dimensionValue.name : '指标';
			this.customFrozenOptions.frozenHeader.value = this.dimensionValue ? this.dimensionValue.name : this.indexName;
			this.customFrozenOptions.frozenHeader.data = [];
		}
		if (arr.length > 0) {
			// 数据不为空时
			let data = arr[0];
			// 设置冻结的头尾，总计和数据的筛选条件
			this.customFrozenOptions.frozenHeader.name = data.name;
			this.customFrozenOptions.frozenHeader.value = this.dimensionValue ? this.dimensionValue.name : this.indexName;
			for (let i = 0; i < data.sources.length; i++) {
				let item = data.sources[i];
				let listItem = $.extend({}, item.sources, { index: i })
				this.listShowData.push(listItem);
				this.customFrozenOptions.frozenHeader.data.push(item.name);
				this.customFrozenOptions.frozenFooter.data.push(item.total);
			}
			// 所有数据的总和
			let totalSum = this.sum(this.customFrozenOptions.frozenFooter.data);
			let optionsItem = {}; // 百分比的总计
			if (this.chart == 'pie') {
				// 饼图时
				this.listShowData = [];

				for (let m = 0; m < this.customFrozenOptions.frozenFooter.data.length; m++) {
					let item = this.customFrozenOptions.frozenFooter.data[m];
					this.pieTotalPercentArr[m] = ((item / totalSum) * 100) == 100 ? ((item / totalSum) * 100) + "%" : ((item / totalSum) * 100).toFixed(2) + '%';
					let listItem = {};
					// listItem[queryItem[0]] = ((item / totalSum) * 100).toFixed(2) + '%';
					listItem[queryItem[0]] = item;
					listItem['index'] = m;
					this.listShowData.push(listItem);
				}
				optionsItem[queryItem[0]] = totalSum;

			}
			// 最后一行的总计
			if (data.sources.length > 1) {
				this.listShowData.push(this.chart == 'pie' ? optionsItem : data.total);
				this.customFrozenOptions.frozenHeader.data.push('总计');
				this.customFrozenOptions.frozenFooter.data.push(totalSum);
				this.pieTotalPercentArr.push('100%');
			}
		}
	}
	/**
	 * 获取列表项的表头
	 *
	 * @param {any} queryItem 当数据为空，列表项 显示的表头
	 * @return 返回queryItems
	 * @memberof IndicatorComponent
	 */
	getListOptions(queryItem) {
		// 获取列表options的 表头
		if (this.chart == 'pie') {
			let startNewTime;
			let endNewTime;
			// 如果是饼状图，列表头只显示为 开始~结束
			if (this.dateValue == 'day') {
				startNewTime = this.startDate.slice(0, 10);
				endNewTime = this.endDate.slice(0, 10);
			} else if (this.dateValue == 'hour') {
				startNewTime = this.startDate.slice(0, 10) + " " + "00:00:00";
				endNewTime = this.endDate.slice(0, 10) + " " + this.endDate.slice(11, 13) + ":59:59";
			} else if (this.dateValue == 'month') {
				startNewTime = this.startDate.slice(0, 7);
				endNewTime = this.endDate.slice(0, 7);
			}
			let item = startNewTime + '~' + endNewTime;
			queryItem = [item];
		}
		if (queryItem instanceof Array) {
			for (let item of queryItem) {
				this.options.push({ field: item, header: item });
			}
		} else {
			for (let key in queryItem) {
				let headerValue = key;
				if (this.dateValue === 'hour') {
					headerValue = key + ":00:00";
				}
				this.options.push({ field: key, header: headerValue });
			}
		}
		return queryItem;
	}


	/**
	 * 设置筛选条件
	 */
	setCountCondition() {
		// 开始时间
		let startTime = this.getDateRightParamsSytle().startTime;
		// 结束时间
		let endTime = this.getDateRightParamsSytle().endTime;
		this.searchCondition = {
			appCode: this.appCode,
			metric: this.indexValue, //指标
			"statisticsInterval": 1,
			statisticsType: this.dateValue, // 统计类型，时间
			statisticsBegin: startTime,
			statisticsEnd: endTime,
		}
		// 判断是否有维度被选中
		if (this.dimensionValue) {
			this.searchCondition.dimension = this.dimensionValue.enName;   // 维度
		}
		// 判断是否有自定义的筛选条件
		// this.conditionFilterSearch = this.uniqueFilterValue(this.conditionFilterSearch);
		if (this.conditionFilterSearch && this.conditionFilterSearch.length > 0) {
			let constomFilter = this.uniqueFilterValue(this.conditionFilterSearch);
			for (let item of constomFilter) {
				for (let key in item) {
					this.searchCondition[key] = item[key];
				}
			}
		}

		// 判断服务中是否有值
		if (this.statisticAnalysisService.parentParams) {
			let routeParams = this.statisticAnalysisService.parentParams;
			this.searchCondition = {
				appCode: this.appCode,
				metric: this.indexValue, //指标
				"statisticsInterval": 1,
				statisticsType: this.dateValue, // 统计类型，时间
				statisticsBegin: routeParams['statisticsBegin'],
				statisticsEnd: routeParams['statisticsEnd'],
			}
			if (routeParams['dimension']) {
				this.searchCondition.dimension = routeParams['dimension'];
			}
		};

	}
	/**
	 * 获取正确的 传参的开始时间和结束时间
	 *
	 * @returns {startTime:number，endTime:number}开始时间和结束时间
	 * @memberof IndicatorComponent
	* */
	getDateRightParamsSytle() {
		let startTime;
		let endTime;
		let startDayTime;
		let endHourTime;
		// 选择时间类型时，默认返回的格式为 yyyy-mm-dd hh:mm:ss; 需要转换为 long的数据
		if (this.dateValue == 'day') {
			startDayTime = typeof this.startDate == 'string' && this.startDate.indexOf('-') != -1 ? this.startDate.slice(0, 10) + " " + "00:00:00" : this.startDate;
		} else if (this.dateValue == 'month') {
			startDayTime = typeof this.startDate == 'string' && this.startDate.indexOf('-') != -1 ? this.startDate.slice(0, 7) + "-01" + " " + "00:00:00" : this.startDate;
		} else if (this.dateValue == 'hour') {
			startDayTime = typeof this.startDate == 'string' && this.startDate.indexOf('-') != -1 ? this.startDate.slice(0, 10) + " " + "00:00:00" : this.startDate;
			if (this.timeType == 'today') {
				endHourTime = typeof this.startDate == 'string' && this.startDate.indexOf('-') != -1 ? this.startDate.slice(0, 10) + " " + this.startDate.slice(11, 13) + ":59:59" : this.startDate;
			} else if (this.timeType == 'yesterday') {
				endHourTime = typeof this.startDate == 'string' && this.startDate.indexOf('-') != -1 ? this.startDate.slice(0, 10) + " " + "23:59:59" : this.startDate;
			} else {
				endHourTime = typeof this.endDate == 'string' && this.endDate.indexOf('-') != -1 ? this.endDate.slice(0, 10) + " " + this.endDate.slice(11, 13) + ":59:59" : this.endDate;
			};
		}
		startTime = typeof startDayTime == 'string' ? this.commonService.formatDate(startDayTime).times : startDayTime;
		endTime = typeof this.endDate == 'string' ? this.commonService.formatDate(this.endDate).times : this.endDate;
		return {
			startTime: startTime,
			endTime: endTime
		}
	}


	/**
	 * 获得企业应用的名字列表
	 *
	 * @param {any} e
	 * @memberof StatisticAnalysisComponent
	 */

	getEnterpriseAppList() {
		let that = this;
		let params = { pageNum: -1 };
		this.commonRequestService.getAppNameList(params, that, (res) => {
			if (res && res.success == 1) {
				that.appListData = res.rows;
				if (!that.appCode) {
					that.appCode = that.appListData[0].appCode;
					that.appId = that.appListData[0].objectId;
				}
				// 存储 appNameList的值
				that.globalState.appNameList = that.appListData;
				that.initData();

			} else {
				that.appListData = [];
			}

		})

	}

	/**
	 * 选择应用
	 *
	 * @param {Object} item  选中应用的信息
	 * @memberof StatisticAnalysisComponent
	 */
	getEnterpriseAppItem(item) {
		this.appCode = item.appCode;
		this.appId = item.objectId;
		if (this.isSearched) {
			this.statisticAnalysisService.parentParams = undefined;
			this.initData();
		}

	}

	/**
	 * 选择指标
	 *
	 * @param {object} e 事件对象
	 * @memberof StatisticAnalysisComponent
	 * @return
	 */
	changeSelectindexData(e) {
		this.isSearched = false;
		this.indexValue = e.value;
	}
	/**
	 * 选择维度
	 *
	 * @param {object} e 事件对象
	 * @memberof StatisticAnalysisComponent
	 * @return
	 */
	changeSelectdimensionData(e) {
		this.isSearched = false;
		this.dimensionValue = e.value;

	}
	/**
	 * 删除维度的值
	 *
	 * @memberof IndicatorComponent
	 */
	resetDimension() {
		this.dimensionValue = null;
		this.isSearched = false;
	}


	/**
	 * 增加一个筛选条件的值
	 *
	 * @param {any} e
	 * @param {any} index
	 * @memberof StatisticAnalysisComponent
	 */

	addValue(e) {
		this.isSearched = false;
		let parentEleValue = this.getCurrentFilterINdex(e);
		let conditionValue = {
			index: parentEleValue.index,
			value: e.value,
		}
		this.conditionFilterSearch.push(conditionValue);
		// this.conditionFilterSearch = this.uniqueFilterValue(this.conditionFilterSearch);

		this.isSearched = false;
		// 判读是否需要增加一个筛选条件
		for (let item of this.conditionArr) {
			if (parentEleValue.index == item) {
				return;
			}
		}
		this.conditionArr.push(parentEleValue.index);
		if (this.conditionArr && this.conditionArr.length > 1 && this.conditionArr[this.conditionArr.length - 1] == this.conditionArr[this.conditionArr.length - 2]) return;
		this.loop.push(this.loop.length);
	}

	/**
	 * 移除一个筛选条件的值
	 *
	 * @param {any} e
	 * @memberof StatisticAnalysisComponent
	 */
	removeValue(e) {
		this.isSearched = false;
		let parentEleValue = this.getCurrentFilterINdex(e);
		let conditionValue = {
			index: parentEleValue.index,
			value: e.value,
		};

		this.conditionFilterSearch.push(conditionValue);
	}
	/**
	 * 重置一个筛选条件
	 *
	 * @param {any} e
	 * @memberof StatisticAnalysisComponent
	 */
	resetValue(e) {
		this.isSearched = false;
		let parentEleValue = this.getCurrentFilterINdex(e);
		let conditionValue = {
			index: parentEleValue.index,
			value: e.value,
		};

		this.conditionFilterSearch.push(conditionValue);

		// this.conditionFilterSearch = this.uniqueFilterValue(this.conditionFilterSearch);
		if (e.isLastEle) {
			// 是最后一项
			parentEleValue.ele.className = '';
		} else {
			if ($('.custom-condition-filte')[0]) {
				$('.custom-condition-filte')[0].childlren()[parentEleValue.index].html('');
			}

		}
	}

	/**
	 * 获取当前筛选条件的索引
	 *
	 * @param {Object} e 子组件返回的值
	 * @returns
	 * @memberof StatisticAnalysisComponent
	 */
	getCurrentFilterINdex(e) {
		let event = e.event.originalEvent ? e.event.originalEvent : e.event;
		let srcEle = event.srcElement ? event.srcElement : event.target;
		let eleParant = srcEle.parentElement;
		while (eleParant.className.indexOf('filter-custom') == -1) {
			eleParant = eleParant.parentElement;
		}
		return {
			ele: eleParant,
			index: eleParant.id
		};
	}

	/**
	 * 搜索
	 *
	 * @memberof StatisticAnalysisComponent
	 */

	search() {
		// 下钻之后返回的参数
		this.statisticAnalysisService.parentParams = undefined;
		this.initData();
	}


	/**
	 * 选择日期
	 *
	 */
	changeSelectdateData(e) {

	}

	/**
	 * 日期选择
	 *
	 * @param {any} e
	 * @memberof StatisticAnalysisComponent
	 */
	public dateClick(e) {
		this.startDate = e.date.dateStart;
		this.endDate = e.date.dateEnd;
		this.timeType = e.timeType;
		if (this.isSearched && this.appCode) {
			this.statisticAnalysisService.parentParams = undefined;
			// if (!this.dimensionValue) {
			// 	this.chart = 'line';
			// }
			this.initData();
		}

	}
	/**
	 * 获取时间间隔
	 *
	 * @param {any} startTime 开始时间 （三种格式2017-08-01,毫秒，标准时间）
	 * @param {any} endTime 结束时间
	 * @param {any} selectInterval 选择的时间间隔
	 * @memberof IndicatorComponent
	 */
	getTimeInterval(startTime, endTime, selectInterval) {
		let queryItems = [];  // 表头数据项
		let oneDayMsec = 86400000; // 一天的毫秒数
		let endTimeMsec = this.commonService.formatDate(endTime).times;
		let startTimeMsec = this.commonService.formatDate(startTime).times;
		if (this.dateValue == 'day') {
			let interval = Number(endTimeMsec) - Number(startTimeMsec);
			// 总共有多少天
			let dayNum = interval / oneDayMsec;

			for (let i = 0; i <= dayNum; i++) {
				queryItems.push(this.commonService.formatDate(oneDayMsec * i + startTimeMsec).formcatDate);
			}

		} else if (this.dateValue == 'month') {
			let endDate = this.commonService.formatDate(this.endDate).formcatDate;
			let startDate = this.commonService.formatDate(this.startDate).formcatDate;
			queryItems = this.commonService.getMonthBetween(startDate, endDate);

		} else if (this.dateValue == 'hour') {
			let endHour = new Date().getHours();
			let timeDay = startTime.slice(0, 10);
			let hour;
			this.startDate = timeDay + " " + "00:00";
			if (selectInterval == 'today') {
				for (let i = 0; i <= endHour; i++) {
					hour = i < 10 ? timeDay + " " + "0" + i + ":00:00" : timeDay + " " + i + ":00:00";
					queryItems.push(hour);
				}
				this.endDate = this.commonService.formatDate(new Date()).formatTime;
			} else {
				for (let i = 0; i <= 23; i++) {
					hour = i < 10 ? timeDay + " " + "0" + i + ":00:00" : timeDay + " " + i + ":00:00";
					queryItems.push(hour);
				}
				this.endDate = queryItems[queryItems.length - 1] + ":59:59";
			}

		}
		return queryItems.join(',');
	}

	/**
	 * 选择图表显示
	 *
	 * @param {Object} e 事件对象
	 * @memberof StatisticAnalysisComponent
	 */
	selectCharts(e) {
		// 兼容ff下不支持srcElement而是支持target
		let srcEle = e.srcElement ? e.srcElement : e.target;
		let srcEleClassName = srcEle.className;
		let matchRel = srcEleClassName.match(/-[a-zA-Z]+-/);
		let selectedCharts = matchRel[0].slice(1, matchRel[0].length - 1);
		if (this.isSearched) {
			this.chart = selectedCharts;
			this.options = [];
			this.getOptionsAndListData(this.totalData);
			this.echartsOptions = this.detailEchartsData(this.totalData);
		}
	}

	/**
	 * 下钻到企业列表页
	 *
	 * @param {any} rowData 横向数据
	 * @param {any} colData 纵向数据
	 * @memberof IndicatorComponent
	* */
	drillDown(rowData, colData) {
		let currentRouteUrl = this.router.url; // 当前路由路径
		let patt = /\?[\s\S]*/;  // 截取路由 ？之前的地址
		let matchRel = currentRouteUrl.match(patt);
		let currentComponentRouteUrl = currentRouteUrl.slice(0, matchRel.index + 1);
		this.routePath = currentComponentRouteUrl.slice(0, currentComponentRouteUrl.indexOf('indicator?')) + 'list';
		// 下钻到企业列表页传的参数
		let requestParams = {
			indexName: this.indexName,
			appId: this.appId,
			countType: this.dateValue,
			chart: this.chart,
		};
		// 维度值
		let dimensionIndex = rowData.index;
		let dimensionName = this.customFrozenOptions.frozenHeader.data[dimensionIndex];
		// console.log('固定列的值');
		// console.log(this.customFrozenOptions);
		// console.log('rowData-------');
		// console.log(rowData);
		// console.log('colData-------');
		// console.log(colData);
		// console.log('维度名字');
		// console.log(this.dimensionValue);
		// // console.log(this.dimensionValue.name);
		// console.log('维度字段值');
		// console.log(dimensionName);
		if (this.dimensionValue) {
			if (dimensionName) {
				requestParams[this.dimensionValue.enName] = this.commonService.changeEnpAttrValue(this.dimensionValue.name, dimensionName);
			} else {
				requestParams[this.dimensionValue.enName] = this.dimensionValue.value;
			}
		}
		// 将时间区间字符串转为数组
		let timeArr = colData.field.split('~');
		// 列表 表头显示的 结束时间
		let endCountTime = timeArr.length == 1 ? timeArr[0] : timeArr[1];
		let startTime;
		let endTime;
		if (this.dateValue == 'day') {
			startTime = timeArr[0] + " " + '00:00:00';
			endTime = endCountTime + " " + '23:59:59';
		} else if (this.dateValue == 'hour') {
			startTime = timeArr[0] + " " + '00:00:00';
			endTime = endCountTime + " " + '59:59';
		} else if (this.dateValue == 'month') {
			let startDateY = timeArr[timeArr.length - 1].slice(0, 4);
			let startDateM = timeArr[timeArr.length - 1].slice(5.7);
			// 当前月的最后一天
			let lastDay = new Date(startDateY, startDateM, 0).getDate();
			startTime = timeArr[0] + "-01" + " " + '00:00:00';
			endTime = endCountTime + "-" + lastDay + " " + '23:59:59'
		}
		requestParams['useAppTimeBegin'] = startTime;
		requestParams['useAppTimeEnd'] = endTime;
		// 将原本的路由上的参数、页面的请求参数及跳转参数合并到一起
		let params = $.extend({}, this.route.snapshot.params['id'] ? this.route.snapshot.params : this.route.snapshot.queryParams, requestParams, this.searchCondition);

		this.router.navigate([this.routePath], { queryParams: params })
	}

	/**
	 * 在数组 arr 开头添加元素 item。不要直接修改数组 arr，结果返回新的数组
	 *
	 * @param arr 原数组
	 * @param item 添加元素
	 * @return 返回新数组
	 */
	public prepend(arr, item) {
		var newarr = arr.slice(0);
		newarr.unshift(item);
		return newarr;
	}
	/**
	 * 下载列表数据，输出格式是 .xls文件
	 *
	 * @memberof IndicatorComponent
	* */
	downloadData() {
		let _that = this;
		let token = window.localStorage['jasToken'];
		let downItems = {};
		let downloadItems = '';
		// console.log(this.customFrozenOptions);
		let headerkey = this.customFrozenOptions.frozenHeader.name;
		let headerValue = this.customFrozenOptions.frozenHeader.value;
		let listOptions = this.prepend(this.options, { field: headerValue, header: headerkey });

		for (let i = listOptions.length - 1; i >= 0; i--) {
			let item = listOptions[i];
			if (this.dateValue == 'month') {
				downloadItems = "," + "'" + item.field + "'" + ":" + "'" + item.field + "'" + downloadItems;
			} else {
				downloadItems = "," + "'" + item.field + "'" + ":" + "'" + item.header + "'" + downloadItems;
			}
		}

		downloadItems = "{" + downloadItems.slice(1, downloadItems.length) + "}";
		let itemParams = {
			'downloadItems': downloadItems,
			'token': token,
			'fileName': this.indexName
		};
		let params = $.extend({}, itemParams, this.searchCondition);
		let url = '/statistics/app/download';
		let urls = this.statisticAnalysisService.dataServerSrc + url;
		this.journalInfoService.DownLoadFile({ url: urls, data: params })
	}


	/**
	 * 将自定义筛选的条件 进行过滤、去重
	 *
	 * @param {any} arr
	 * @returns
	 * @memberof IndicatorComponent
	 */
	uniqueFilterValue(arr) {
		let res = [];
		let json = {};
		arr.reverse();
		for (let i = 0; i < arr.length; i++) {
			let item = arr[i];
			if (!json[item.index] && item.length != 0) {
				res.push(item);
				json[item.index] = res.length;
			}
		}
		let sameKey = {};  // 将同名的值，合并
		let sameRes = [];
		// 将有重复选择的值合并
		for (let m = 0; m < res.length; m++) {
			let resItem = res[m];
			if (resItem.value && resItem.value.length > 0 && resItem.value[1] && resItem.value[1].length > 0) {
				if (!sameKey[resItem.value[0].name]) {
					let obj = {};
					let key = resItem['value'][0]['name'];
					obj[key] = resItem['value'][1].join(',');
					sameRes.push(obj);
					sameKey[resItem.value[0].name] = {
						'indexRes': sameRes.length - 1,
						'valueRes': resItem.value[1].join(',')
					};
				} else {
					let newValue = sameKey[resItem.value[0].name].valueRes + ',' + resItem.value[1].join(',');
					// 将重复的值去掉
					newValue = this.commonService.arrUnique(newValue.split(',')).join(',');
					let obj = {};
					let key = resItem['value'][0]['name'];
					obj[key] = newValue;
					sameRes[sameKey[resItem.value[0].name].indexRes] = obj;
				}
			}

		}
		return sameRes;
	}

	/**
	 * 获取echarts的配置项
	 *
	 * @param {any} arr
	 * @param {any} echartsType
	 * @returns
	 * @memberof IndicatorComponent
	 */
	detailEchartsData(arr) {
		this.dimensionValueEchart = !this.dimensionValueEchart;
		let echartsLineOptions: any = {
			color: INCONFIG.echartLineColor,
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data: [],
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: []
			},
			yAxis: {
				type: 'value',
			},
			series: []
		}; // echarts的 折线图配置项
		let echartsPieOptions: any = {
			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b} : {c} ({d}%)"
			},
			legend: {
				orient: 'vertical',
				left: 'left',
				data: [],
			},

			series: [
				{
					name: '',
					type: 'pie',
					radius: '80%',
					center: ['50%', '55%'],
					data: [],
				}
			]
		}; // echarts的 饼图配置项
		let echartOptions = this.chart == 'line' ? echartsLineOptions : echartsPieOptions;
		if (arr.length == 0) return;
		let data = arr[0];
		// 配置初始化的echarts配置项
		if (this.chart == 'line') {
			let seriesArr = [];
			let legendData = [];  // legend的data数据
			let xAxisData = []; // x轴的data数据
			for (let item of data.sources) {
				legendData.push(item.name);
				// series 的每一项
				let seriesItem = {
					name: item.name,
					type: 'line',
					lineStyle: '1px',
					data: item.datas,
				};
				seriesArr.push(seriesItem);
			}
			for (let key in data.total) {
				if (this.dateValue === "hour") {
					key = key + ":00:00";
				}
				xAxisData.push(key);
			}
			echartOptions.legend.data = legendData;
			echartOptions.xAxis.data = xAxisData;
			echartOptions.series = seriesArr;

		} else if (this.chart == 'pie') {
			let seriesDataArr = []; // series 的data数据
			let legendData = [];  // legend的data数据
			for (let item of data.sources) {
				legendData.push(item.name);
				let seriesData = {
					name: item.name,
					value: item.total
				};
				seriesDataArr.push(seriesData);
			}
			echartOptions.legend.data = legendData;
			echartOptions.series[0].data = seriesDataArr;
		}
		return echartOptions;
	}

	/**
	 * 计算数组的和
	 *
	 * @returns
	 * @memberof IndicatorComponent
	 */
	public sum(arr) {
		var all = 0;
		for (var i = 0; i < arr.length; i++) {
			if (typeof (arr[i] == "number")) {
				all += arr[i];
			}
		}
		return all;
	}


}

