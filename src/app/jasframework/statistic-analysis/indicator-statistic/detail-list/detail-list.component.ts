import { JasCommunicationsService } from './../../../jas/shared/jas.commumication.service';
import { JournalInfoService } from './../../../journal-info/shared/journal-info.service';
import { CommonService } from './../../../../core/common-service/common.service';
import { StatisticAnalysisService } from './../../shared/statistic-analysis.service';
import { CommonRequestService } from './../../../../core/common-service/common-request.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AddEnterprisedetailListOptionsData } from './../../shared/data';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { GlobalState } from './../../../../global.state';
import { Subscription } from 'rxjs/Subscription';
@Component({
	selector: 'detail-list',
	templateUrl: 'detail-list.component.html',
	styleUrls: ['./detail-list.component.scss']
})

export class DetailListComponent implements OnInit, OnDestroy {
	public listShowData: any; // 列表展示数据 
	public options: any; // 列表opitions数据 

	public button: any = {}; // button集合 
	// 分页
	public rowsPerPageOptions = ['10', '20', '30'];
	public pageSize: string = '10'; //页容量
	public pageNum: any = 1; //页码
	public maxSize: number = 5;
	public totalPages: any;  //总页数
	public size: any; // 当前页容量
	private totalItems: any; //总数据条数

	// primeng  dataTable列表上属性设置
	public emptyMessage: string = '未查到相关数据';  // 没有数据时显示字段
	public menuId: any; // 菜单id
	public indexName: any;  // 当前索引的指标
	public routeParams: any;  // 通过路由传的参数
	public params: any;  // 企业列表的请求参数
	//  组件消失时,销毁订阅
	private subscription: Subscription;
	public publicRouteParam: any; // 全局的路由参数
	@ViewChild('dt') dt; // 
	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private commonRequestService: CommonRequestService,
		private statisticAnalysisService: StatisticAnalysisService,
		private commonService: CommonService,
		private journalInfoService: JournalInfoService,
		public globaStateService: GlobalState,
		public jasCommunicationService: JasCommunicationsService,
	) {
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
	ngOnInit() {
		// 路由参数
		this.routeParams = this.route.snapshot.params['id'] ? this.route.snapshot.params : this.route.snapshot.queryParams;
		console.log('路由参数');
		console.log(this.routeParams);
		this.menuId = this.routeParams['id'];
		this.indexName = this.routeParams['indexName'];
		this.judgmentIndexValue(this.indexName);
		this.initData();
		this.getBtn();
		let _that = this;
		window.onresize = () => {
			_that.setFrozenWidth(_that);
		}
	}
	ngOnDestroy() {
		window.onresize = () => { }

	}
	/**
	 * 依据指标值得到列表的表头项
	 * 
	 * @param {string} indexValue 
	 * @memberof DetailListComponent
	 */
	public judgmentIndexValue(indexValue) {
		switch (indexValue) {
			case '新增企业':
				this.options = AddEnterprisedetailListOptionsData;
				break;
			default:
				this.options = [];
		}
	}
	/**
	 * 初始化数据
	 * 
	 * @memberof DetailListComponent
	 */
	public initData() {
		let __this = this;
		this.params = this.detailRequestParams();
		this.statisticAnalysisService.getEnpList(__this, this.params, (res) => {
			if (res && res.success == 1) {
				__this.listShowData = res.rows;
				for (let item of __this.listShowData) {
					item.enterpriseScale = __this.commonService.changeEnpAttrValue('企业规模', item.enterpriseScale);
					item.authenticateStatus = __this.commonService.changeEnpAttrValue('认证状态', item.authenticateStatus);
					item.enterpriseType = __this.commonService.changeEnpAttrValue('企业类型', item.enterpriseType);
					item.useType = __this.commonService.changeEnpAttrValue('应用使用类型', item.useType);
				}
				__this.totalItems = res['totalElements'];
				__this.totalPages = res['totalPages'];
				__this.size = res['size'];
				this.setFrozenWidth(__this);
				if (__this.listShowData.length == 0) {

				}
			} else {
			}
		})
	}
	/**
	 * 通过路由获取请求参数
	 * 
	 * @returns 处理好的请求参数对象
	 * @memberof DetailListComponent
	 */
	detailRequestParams() {
		let data = {};
		for (let key in this.routeParams) {
			let newKey = key;
			if (key == 'enpAuthStatus') {
				newKey = 'authenticateStatus';
			} else if (key == 'enpType') {
				newKey = 'enterpriseType';
			} else if (key == 'enpAppUseType') {
				newKey = 'useType';
			} else if (key == 'registerFrom') {
				newKey = 'fromAppName';
			} else if (key == 'enpScale') {
				newKey = 'enterpriseScale';
			}
			data[newKey] = this.routeParams[key];
		}

		delete data['IsRequest'];
		delete data['selfId'];
		delete data['id'];
		delete data['indexName'];
		delete data['queryItems'];
		delete data['statisticsBegin'];
		delete data['statisticsEnd'];
		delete data['statisticsInterval'];
		delete data['appCode'];
		delete data['indexValue'];
		delete data['statisticsType'];
		delete data['countType'];
		delete data['dimension'];
		delete data['metric'];
		data['pageNum'] = this.pageNum;
		data['pageSize'] = this.pageSize;
		data['isStatistic'] = true;
		console.log('请求参数');
		console.log(data);
		return data;
	}

	/**
	 * 设置不固定宽度值
	 * @param _that 
	 */
	setFrozenWidth(_that) {
		// let _that = this;
		// 如果页面的宽度大于当前页面的 不需要冻结列
		if ($('.listShow')[0]) {
			_that.dt.unfrozenWidth = $('.listShow')[0].clientWidth - 15 * 2 - 200 + 'px';
		}



	}
	/**
	* 获取初始化按钮数据
	*/
	public getBtn() {
		let _that = this;
		this.commonRequestService.getMenuBtn(this.menuId, _that, (res) => {
			if (res && res.success == 1) {
				_that.button = _that.commonService.viewBtn(res.rows);
			} else if (res.success == -1) { }
		}
		)
	}

	/**
	 * 下载
	 * 
	 * @memberof DetailListComponent
	 */
	downloadData() {
		let _that = this;
		let token = window.localStorage['jasToken'];
		let downItems = {};
		let downloadItems = '';
		for (let item of AddEnterprisedetailListOptionsData) {
			downloadItems = downloadItems + "," + "'" + item.field + "'" + ":" + "'" + item.header + "'";
		}
		// + "'" + 'enterprisename' + "'" + ':' + "'" + '企业名称' + "'" + ', ' +
		downloadItems = "{" + "'" + 'enterprisename' + "'" + ':' + "'" + '企业名称' + "'" + ',' + downloadItems.slice(1, downloadItems.length) + "}";

		let itemParams = {
			'downloadItems': downloadItems,
			'token': token,
			'fileName': '企业列表'
		}
		delete this.params['indexName'];
		delete this.params['pageNum'];
		delete this.params['pageSize'];
		delete this.params['totalElements'];
		delete this.params['orderBy'];
		delete this.params['appCode'];
		let params = $.extend({}, itemParams, this.params);
		let url = '/statistical/downloadEnterpriseList';
		let urls = this.statisticAnalysisService.dataServerSrc + url;
		this.journalInfoService.DownLoadFile({ url: urls, data: params })


	}


	/**
	 * 翻页
	 * 
	 * @param {Object} event 存放当前页码和页容量
	 * @memberof DetailListComponent
	 */
	public paginate(event) {
		this.pageNum = event.currentPage;
		this.pageSize = event.itemsPerPage;
		this.initData();
		// this.initLoginListData();
	}
	/**
	 * 页容量改变
	 * @param event 存放页容量
	 */
	public sizeChanged(event) {
		this.pageSize = event;
		this.pageNum = 1; //页容量改变时，页码值为1
		this.initData();
		// this.initLoginListData();
	}
	/**
	 * 返回
	 * 
	 * @memberof DetailListComponent
	 */
	goBack() {
		let currentRouteUrl = this.router.url; // 当前路由路径
		let patt = /\?[\s\S]*/;
		let matchRel = currentRouteUrl.match(patt);
		let currentComponentRouteUrl = currentRouteUrl.slice(0, matchRel.index + 1);
		let routePath = currentComponentRouteUrl.slice(0, currentComponentRouteUrl.indexOf('list?')) + 'indicator';
		// console.log(routePath);
		// console.log(this.routeParams);
		let param = {};
		for (let key in this.routeParams) {
			param[key] = this.routeParams[key];
		};
		this.statisticAnalysisService.parentParams = param;

		// this.router.navigate([routePath], { queryParams: this.route.snapshot.queryParams })
		window.history.back();
	}
}