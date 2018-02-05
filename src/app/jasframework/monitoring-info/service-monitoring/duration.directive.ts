/**
 * duration 自定义指令
 * @Input 每一条数据的信息：当前数据item，第一条数据duration，当前索引index
 * 设置 当前数据的状态：宽度、背景色
 *
 */

import { Directive, ElementRef, Input, HostListener } from "@angular/core";
import { AfterContentInit } from '@angular/core';
@Directive({
  selector: '[duration]'
})
export class DurationDirective implements AfterContentInit {
  private el: HTMLElement;
  public firstTimestamp: any; //第一次的时间戳
  public selfTimestamp: any; //本次的时间戳
  public firstDuration: any;  //第一次请求持续的的时间
  public selfDuration: any; //本次的请求持续的的时间
  public data: any;
  @Input('duration') info: any;

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  private setStyle() {
    let opacity = this.info.hierarchy / 10 + 0.4;
    this.el.style.backgroundColor = 'rgba(66, 146, 198,' + opacity + ')';

    this.el.style.left = ((this.selfTimestamp - this.firstTimestamp) / this.firstDuration) * 100 + '%';
    this.el.style.width = (this.selfDuration / this.data) * 100 + '%'
  }

  ngAfterContentInit() {
    this.selfDuration = this.info.item.duration;
    this.selfTimestamp = this.info.item.timestamp;

    var firstduration = this.info.item.duration + this.info.item.timestamp //第一个span的持续时间
    this.firstTimestamp = this.info.duration.timestamp;
    var it = this.info.item.children
    this.firstDuration = this.info.duration.duration;
    this.data = this.info.duration.duration;
    for (var i = 0; i < it.length; i++) {
      var errycount = it[i].duration + it[i].timestamp;
      var count = it[i].timestamp;
      if (firstduration < errycount) {
        this.data = errycount - this.firstTimestamp;
      }
    }
    this.setStyle();
  }

}
