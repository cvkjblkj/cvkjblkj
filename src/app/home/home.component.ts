import { CommonRequestMethodService } from './../core/common-service/request-method.service';
import { ConfirmationService } from 'primeng/primeng';
import { BaImageLoaderService, BaThemePreloader, BaThemeSpinner } from './../theme/services';
import { Component, OnChanges, OnInit, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { MenuService, TreeNodes } from "./../app.menu";

import { BaMenuService } from './../theme';
import { BaThemeConfig } from './../theme/theme.config';
import { GlobalState } from './../global.state';
import { layoutPaths } from './../theme/theme.constants';


//被删除的底部内容部分
//   <ba-content-top></ba-content-top>
// <div class="al-footer-main clearfix">
//   <div class="al-copy">&copy; <a href="http://www.jasgroup.cn/">北京中盈安信技术服务股份有限公司</a>  2017</div>
//   <ul class="al-share clearfix">
//     <li><i class="socicon socicon-facebook"></i></li>
//     <li><i class="socicon socicon-twitter"></i></li>
//     <li><i class="socicon socicon-google"></i></li>
//     <li><i class="socicon socicon-github"></i></li>
//   </ul>
// </div>
// <footer class="al-footer clearfix">
//   <div class="al-footer-right">管道行业云<i class="ion-heart"></i></div>

// </footer>
@Component({
  selector: 'jas-home',
  encapsulation: ViewEncapsulation.None,
  styles: [],
  providers: [MenuService, ConfirmationService, CommonRequestMethodService],
  template: `
  
 
    <ba-sidebar></ba-sidebar>
    <ba-page-top></ba-page-top>
    <div class="al-main">
      <div class="al-content">
      <p-confirmDialog header="提示" icon="fa fa-question-circle" width="425" #cd>
      <p-footer>
        <button type="button" pButton icon="fa-close" label="取消" (click)="cd.reject()" class="btn-cancle"></button>
        <button type="button" pButton icon="fa-check" label="确认" (click)="cd.accept()" class="btn-reset"></button>
      </p-footer>
    </p-confirmDialog>
        <router-outlet></router-outlet>
      </div>
    </div>
    
    <ba-back-top position="200"></ba-back-top>
  
    `
})
export class HomeComponent implements OnInit {
  private menu: any;
  isMenuCollapsed: boolean = false;

  constructor(
    private menuService: MenuService,
    private _menuService: BaMenuService,
    private _state: GlobalState,
    private _imageLoader: BaImageLoaderService,
    private _spinner: BaThemeSpinner,
    private _config: BaThemeConfig,

    private viewContainerRef: ViewContainerRef
  ) {

    // this._loadImages();

    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });
  }


  ngOnInit() {
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
