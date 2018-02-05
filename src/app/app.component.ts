import { CommonService } from './core/common-service/common.service';
import { CommonRequestService } from './core/common-service/common-request.service';
import { ConfirmationService } from 'primeng/primeng';
import './app.loader.ts';

import { BaImageLoaderService, BaThemePreloader, BaThemeSpinner } from './theme/services';
import { Component, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuService } from './app.menu';

import { GlobalState } from './global.state';
import { layoutPaths } from './theme/theme.constants';

// import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootsrtap';


/*
 * App Component
 * Top Level Component
 */

/* @Component : 装饰器   详细介绍：https://angular.cn/docs/ts/latest/guide/architecture.html#!#metadata
 * 里面属性：
 * selector： CSS 选择器，它告诉 Angular 在父级 HTML 中查找<app>标签，创建并插入该组件。
 * encapsulation - 通过该component设计封装策略；
 * styles：组件使用的CSS样式表。
 * template： html视图模板
 * 详细介绍参考：http://blog.csdn.net/qq_33315185/article/details/64130064
 * */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styles: [require('normalize.css'), require('./app.scss')],
  template: `
    <main [ngClass]="{'menu-collapsed': isMenuCollapsed}" baThemeRun>
      <div class="additional-bg"></div>
      <!--该指令用来标记出路由器该在哪里显示视图。-->
      <router-outlet></router-outlet> 
    </main>`,
  providers: [MenuService,ConfirmationService,CommonRequestService,CommonService]
})
export class App {
  menu: any;
  isMenuCollapsed: boolean = false;

  constructor(private _state: GlobalState,
              private _imageLoader: BaImageLoaderService,
              private _spinner: BaThemeSpinner) {


    // this._loadImages();

    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });
  }

  public ngAfterViewInit(): void {
    // hide spinner once all loaders are completed
    BaThemePreloader.load().then((values) => {
      this._spinner.hide();
    });
  }


  private _loadImages(): void {
    // register some loaders
    // BaThemePreloader.registerLoader(this._imageLoader.load(layoutPaths.images.root + 'sky-bg.jpg'));
  }

}
