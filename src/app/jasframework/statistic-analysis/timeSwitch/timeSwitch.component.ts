import { INCONFIG } from './../../../core/global';
import { CommonService } from './../../../core/common-service/common.service';
import { Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'timeSwitch',
  templateUrl: './timeSwitch.component.html',
  styleUrls: ['./timeSwitch.component.scss']
})
export class TimeSwitchComponent implements OnInit, OnChanges {

  public isSelectedDate: boolean;
  public zn: any; // 日历的汉化
  public showTime: boolean = true; // 显示时分秒选择
  public dateStartShow: any; // 开始时间显示
  public dateEndShow: any; // 结束时间显示

  public dateEnd: any = new Date(); // 双向数据绑定的结束时间
  public dateStart: any = new Date(); // 双向数据绑定的开始时间
  public maxDateStartMonth: any;  // 按月时，自定义选择 开始时间的最大值
  public minDateEndMonth: any;   // 按月时，自定义选择 结束时间的最小值
  public minHourStartDate: any; // 按小时时，自定义选择 开始时间的最大值
  public minHourDate: any; // 按小时时，自定义选择 开始时间的最大值
  @Input() timeType: any; // 根据的时间类型
  @Output() dateValue: any = new EventEmitter();
  @Input() isClick;
  constructor(private commonService: CommonService) {
    this.zn = INCONFIG.zn;
  }
  ngOnChanges() {
    this.setDafultStatus();

  }
  ngOnInit() {
    this.modalHidden();

  }

  /**
   * 设置默认的选中项
   *
   * @memberof TimeSwitchComponent
   */
  setDafultStatus() {
    this.isSelectedDate = false;
    switch (this.timeType) {
      case 'day':
        this.isClick = 'seven';
        this.dateStart = new Date(new Date().getTime() - 86400000 * 6);
        this.emitParams();
        break;
      case 'hour':
        this.isClick = 'today';
        this.dateStart = new Date(new Date().setHours(0, 0, 0));
        this.dateEnd = new Date(new Date().setHours(23, 59, 59));
        this.minHourStartDate = new Date(this.dateEnd.getTime() - 86400000);
        this.emitParams();
        break;
      case 'month':
        this.isClick = 'threeMonth';
        let date = new Date();
        this.dateStart = this.getPreviousMonth(date, 3);
        this.maxDateStartMonth = this.getPreviousMonth(this.dateEnd, 3);
        this.minDateEndMonth = this.dateEnd;
        this.emitParams();
        break;
    }
  }

  /**
   * 选择日期
   *
   * @param {any} event
   * @memberof TimeSwitchComponent
   */
  datePicker(event: any) {
    let e = event || window.event;
    let obj = e.target || e.srcElement;
    // 当前点击的元素id值
    let clickedDom = obj.id;
    if (clickedDom == '') {
      return;
    } else if (clickedDom != 'self' && this.isSelectedDate) {
      // 当点击不是自定义时
      this.isSelectedDate = false;
    }
    this.isClick = clickedDom;
    this.stopBubble(e);
    this.dateRang(this.isClick);
    if (this.isClick != 'self') {
      // 将选择的开始时间和结束时间
      this.dateEndShow = this.commonService.formatDate(this.dateEnd).formatTime;
      this.dateStartShow = this.commonService.formatDate(this.dateStart).formatTime;
      this.emitParams();
    }

  }

  /**
   * 选择开始时间
   *
   * @param {any} e
   * @memberof TimeSwitchComponent
   */
  selectStartDate(e) {
    this.dateStartShow = this.commonService.formatDate(e).formatTime;
  }

  /**
   * 选择结束时间
   *
   * @param {any} e
   * @memberof TimeSwitchComponent
   */
  selectEndDate(e) {
    if (this.timeType == 'hour') {
      this.minHourStartDate = new Date(e.getTime() - 86400000);
    }
    this.dateEndShow = this.commonService.formatDate(e).formatTime;
  }

  /**
   * 自定义选择时间 点击确定
   *
   * @memberof TimeSwitchComponent
   */
  sure() {

    this.isSelectedDate = true;
    this.isClick = '';
    // 将选择的开始时间和结束时间
    if (this.timeType == 'hour') {
      this.dateEndShow = this.commonService.formatDate(this.dateEnd).formatTime;
      this.dateStartShow = this.commonService.formatDate(this.dateStart).formatTime;
    } else {
      this.dateEndShow = this.commonService.formatDate(this.dateEnd).formcatDate;
      this.dateStartShow = this.commonService.formatDate(this.dateStart).formcatDate;
    }
    this.emitParams();
  }

  /**
   * 确定当前选择的时间范围
   *
   * @param {string} clickedDom 当前选择的时间范围
   * @returns
   * @memberof TimeSwitchComponent
   */
  public dateRang(clickedDom: string) {
    let dayDate = new Date(); // 当前时间
    let y = dayDate.getFullYear();
    let m: any = dayDate.getMonth();
    m = m < 10 ? '0' + m : m;
    let d = dayDate.getDate();
    let h = dayDate.getHours();

    if (clickedDom == 'self') return;
    if (this.timeType == 'day') {
      this.dateEnd = dayDate;
      switch (clickedDom) {
        case 'seven':
          this.dateStart = new Date(dayDate.getTime() - 86400000 * 6);
          break;
        case 'fifteen':
          this.dateStart = new Date(dayDate.getTime() - 86400000 * 14);
          break;
        case 'thirty':
          this.dateStart = new Date(dayDate.getTime() - 86400000 * 29);
          break;
      }
    }

    if (this.timeType == 'hour') {

      switch (clickedDom) {
        case 'today':
          this.dateStart = new Date(y, m, d, 0);
          this.dateEnd = new Date(y, m, d, h, 59, 59);
          break;
        case 'yesterday':
          this.dateStart = new Date(new Date(dayDate.getTime() - 86400000).setHours(0, 0, 0));
          this.dateEnd = new Date(new Date(dayDate.getTime() - 86400000).setHours(23, 59, 59));
          break;
      }
      this.minHourStartDate = new Date(new Date(this.dateStart.getTime() - 86400000).setHours(0, 0, 0));
    }
    if (this.timeType == 'month') {
      this.dateEnd = dayDate;
      this.minDateEndMonth = this.dateEnd;
      this.maxDateStartMonth = this.getPreviousMonth(this.dateEnd, 1);
      switch (clickedDom) {
        case 'threeMonth':
          this.dateStart = this.getPreviousMonth(dayDate, 3);
          break;
        case 'sixMonth':
          this.dateStart = this.getPreviousMonth(dayDate, 6);
          break;
      }
    }
  }


  /**
   * 组件发射出去的参数
   *
   * @memberof TimeSwitchComponent
   */
  emitParams() {
    let params = {
      dateStart: this.commonService.formatDate(this.dateStart).formatTime,
      dateEnd: this.commonService.formatDate(this.dateEnd).formatTime,
    };
    this.dateValue.emit({
      date: params,
      timeType: this.isClick
    });
  }


  /**
   * 获取当前时间的最近月份
   *
   * @param {any} date 当前时间
   * @param {any} num 提前几个月
   * @returns {string} 最近的时间，包括年、月、日、时、分
   * @memberof TimeSwitchComponent
   */
  getPreviousMonth(date, num) {
    let newDate;
    if (typeof (date) == 'string' && date.indexOf('-') != -1) {
      newDate = date.replace(/-/g, '/');
    } else {
      newDate = date;
    }

    let dateObj = new Date(newDate);
    let year = dateObj.getFullYear();
    let month: any = dateObj.getMonth();
    let new_year;
    let new_month;
    if (month <= num) {  // 如果当前月份小于需要提前的月份，则年份转到上一年
      new_year = year - 1;
      new_month = month - num + 12;
    } else {
      new_month = month - num;
      new_year = year;
    }
    let dayDate = new Date();
    dayDate.setFullYear(new_year);
    dayDate.setMonth(new_month);
    return dayDate;
  }

  /**
   * 给body设置click事件，通过冒泡使弹窗消失
   *
   * @memberof TimeSwitchComponent
   */
  public modalHidden() {
    let _this = this;
    let body = document.getElementsByTagName('body')[0];
    this.commonService.addEvent(body, 'click', function () {
      // 是日历的弹窗消失
      if (!_this.isClick) return;
      if (_this.isClick && _this.isClick == 'self') {
        _this.setDafultStatus();
      }
    }, false);
  }

  /**
   * 取消冒泡
   *
   * @param {any} e
   * @memberof TimeSwitchComponent
   */
  stopBubble(e) {
    this.commonService.stopBubble(e);
  }
}
