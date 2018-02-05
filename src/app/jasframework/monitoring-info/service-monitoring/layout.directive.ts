/**
 * layout 自定义指令
 * @Input 接受当前索引；判断margin-left的值
 * 设置渲染数据的每一行的margin-left值
 */

import { Directive, ElementRef, Input, HostListener } from "@angular/core";
import { AfterContentInit } from '@angular/core'
@Directive({
  selector: '[layout]'
})
export class LayoutDirective implements AfterContentInit {
  private basic_left =50;
  private el: HTMLElement;
  @Input('layout') index: any;
  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }
  private setStyle() {
    this.el.style.marginLeft = this.basic_left + this.index * 2 + 'px';
  }
  ngAfterContentInit() {
    this.setStyle();

  }
}
