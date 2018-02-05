import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'indicator-statistic',
    template: `<div class="component clearfix">
    <!--页面标题  -->
    <div class="title">
      <span>指标统计</span>
    </div>
    <div class="line"></div>
    <!--内容区域  -->
      <router-outlet></router-outlet>

  </div>`
})

export class IndicatorStatisticComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}