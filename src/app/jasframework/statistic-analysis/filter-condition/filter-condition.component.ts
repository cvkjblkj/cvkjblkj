import { CommonRequestService } from './../../../core/common-service/common-request.service';
import { StatisticAnalysisService } from './../shared/statistic-analysis.service';
import { GlobalState } from './../../../global.state';
import { statisticData, enpAuthStatusData, enpScaleData, enpTypeData, enpUseTypeData } from './../shared/data';
import { FormsModule } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Input, OnChanges, ViewChild, AfterViewInit } from '@angular/core';
@Component({
  selector: 'filter-condition',
  templateUrl: './filter-condition.component.html',
  styleUrls: ['./filter-condition.component.scss']
})
export class FilterConditionComponent implements OnInit, OnChanges, AfterViewInit {

  public filterSearchData: any; // 筛选条件初始化数据
  public dropdownData: any; // 下拉框的数据集合（例如：应用名称）
  public statisticData: any; // 筛选 dropdown的数据
  public appListData: any;
  public resetClean: boolean = true;
  @Output() addData: any = new EventEmitter();
  @Output() removeData: any = new EventEmitter();
  @Output() resetData: any = new EventEmitter();
  @Input() index: any; // 当前索引
  @ViewChild('filterValueParent') filterValueParent: any; // chips组件
  constructor(
    private globalState: GlobalState,
    public statisticAnalysisService: StatisticAnalysisService,
    public commonRequestService: CommonRequestService) {
    this.statisticData = statisticData;
    this.filterSearchData = [
      [null, null],
    ];
    this.dropdownData = {
      'enpScale': enpScaleData,
      'enpAuthStatus': enpAuthStatusData,
      'enpType': enpTypeData,
      'registerFrom': this.globalState.appNameList,
      'enpAppUseType': enpUseTypeData
    };
    // this.detailAppList();

  }
  ngOnChanges() {

  }

  ngOnInit() {
    this.resetClean = this.index;
    let appNameList = this.globalState.appNameList;  // 应用列表
    if (typeof appNameList == 'string' && appNameList.length == 0) {
      // 空字符串
      this.getEnterpriseAppList();
    } else {
      this.detailAppList();
    }

  }
  ngAfterViewInit() {
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
        // 存储 appNameList的值
        that.globalState.appNameList = that.appListData;
        that.detailAppList();
      } else {
      }
    })

  }

  // 处理appNamelist
  detailAppList() {
    let rel = [];
    for (let item of this.globalState.appNameList) {
      rel.push({
        label: item['appName'],
        value: item['objectId'],
      });
    }
    this.dropdownData.registerFrom = rel;
  }
  /**
   * 选择筛选条件
   *
   * @param {any} e 事件对象

   * @memberof FilterConditionComponent
   */
  changeSelectData(e) {
    let ele = this.filterValueParent.nativeElement;
    // console.log(this.filterValueParent);
    ele.style.maxWidth = ele.offsetParent.offsetWidth - ele.offsetLeft - 30 - 67 + "px";
    this.filterSearchData[1] = null;
  }
  /**
   * 添加筛选条件的值
   *
   * @param {any} e 事件对象

   * @memberof FilterConditionComponent
   */
  addValue(e) {

    let params = {
      event: e,
      value: this.filterSearchData,
    }
    this.addData.emit(params);
  }
  /**
   * 移除筛选条件的值
   *
   * @param {any} e 事件对象
   * @memberof FilterConditionComponent
   */
  removeValue(e) {
    let params = {
      event: e,
      value: this.filterSearchData
    }
    this.removeData.emit(params);
  }

  /**
   * 重置条件
   *
   * @memberof FilterConditionComponent
   */
  reset(e) {
    // console.log('reset===========');
    let isLastEle;
    // 判断是否为最后一项
    let parentEleValue = this.getCurrentFilterINdex(e);
    // console.log(this.filterSearchData);
    // console.log(this.index);
    if (parentEleValue.ele.parentElement.lastElementChild.id > parentEleValue.index) {
      // 不是最后一项，全部删除
      this.filterSearchData = [];
      isLastEle = true;
      this.index = null;
    } else {
      this.filterSearchData[0] = [];
      isLastEle = false;
    }
    let params = {
      event: e,
      value: this.filterSearchData,
      isLastEle: isLastEle
    }
    this.resetData.emit(params);
  }


	/**
	 * 获取当前筛选条件的索引
	 *
	 * @param {Object} e 子组件返回的值
	 * @returns
	 * @memberof StatisticAnalysisComponent
	 */
  getCurrentFilterINdex(e) {
    let event = e.originalEvent ? e.originalEvent : e;
    let srcEle = event.srcElement ? event.srcElement : event.target;
    let eleParant = srcEle.parentElement;
    while (eleParant.className.indexOf('filter-custom') == -1) {
      eleParant = eleParant.parentElement;
    }
    // console.log(eleParant);
    return {
      ele: eleParant,
      index: eleParant.id
    };
  }
}
