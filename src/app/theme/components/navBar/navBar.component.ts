import { ActivatedRoute } from '@angular/router';
import { JasService } from './../../../jasframework/jas/shared/jas.service';
import { Component, EventEmitter, OnInit, Input, Output, AfterViewInit, OnChanges, ViewChild, AfterViewChecked, AfterContentChecked, DoCheck, AfterContentInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router, Routes } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'navBar',
  templateUrl: './navBar.component.html',
  styleUrls: ['./navBar.component.css'],
  providers: [JasService]
})
export class NavBar implements OnInit, AfterViewInit, OnChanges, AfterContentInit {
  @ViewChild('item') item;
  @ViewChild('tabContent') tabContent;
  @Input() menu: any; /* 输出menu*/
  @Input() id: any;
  @ViewChild('navBar') navBar;
  public tabs: any;
  public contents: any;
  public numIndex: any; //当前被选中tab的index
  public value: any; //被选中的tab
  public isShow: boolean = true; //默认显示第一个菜单的二级菜单
  public currentUrlId: any; //当前路由id值

  constructor(private router: Router, private _location: Location, private jasService: JasService, private route: ActivatedRoute) {

  }
  ngOnChanges() {
    let currentUrl = this.router.url.replace(/;\S+/, ''); //当前的url
    this.currentUrlId = this.route.snapshot.params['id'] ? '' : this.route.snapshot.queryParams['id'];  //获取当前的路由id值
    if (this.router.url.indexOf("selfId") != -1) {
      this.currentUrlId = this.route.snapshot.params['selfId'] ? '' : this.route.snapshot.queryParams['selfId'];  //获取当前的路由id值
    }
    if (!this.menu.title && window.localStorage.getItem('menu')) {
      // console.log("进入");
      this.menu = JSON.parse(window.localStorage.getItem('menu'));
    }
    this.numIndex = window.localStorage.getItem('index');
    this.getUrl(this.menu);

    this.ngAfterViewInit();

  }

  ngOnInit() {
  }

  ngAfterContentInit() {

  }

  ngAfterViewInit() {
  }
  /**
   *
   * @param id 选中的节点
   * @param index 选中的菜所在索引
   */
  public tabChange(id: any, index?: any) {
    this.isShow = false;
    window.localStorage.setItem('value', id);
    let tabs = this.item.nativeElement.children;
    let contents = this.tabContent.nativeElement.children;
    if (index) {
      contents[index].className = 'show';
      return;
    }


		/**
		 * tab 切换
		 */

    for (var i = 0, len = tabs.length; i < len; i++) {
      if (tabs[i].id == id) {
        // tabs[i].onclick =
        contents[i].className = 'show';
        this.numIndex = tabs[i].id + 1;
        window.localStorage.setItem('index', id + 1);

      } else {
        contents[i].className = 'hide';
      }
    }
  }

  public addEvent(elm, evType, fn, useCapture) { /*做点击事件兼容*/
    if (elm.addEventListener) {
      elm.addEventListener(evType, fn, useCapture);
      return true;
    }
    else if (elm.attachEvent) {
      var r = elm.attachEvent('on' + evType, fn);
      return r;
    }
    else {
      elm['on' + evType] = fn;
    }
  };

  // public wacthUrl() {
  //   if (!this.navBar.nativeElement) {
  //     this.router.events.subscribe(event => {
  //       if (event.constructor.name == 'NavigationEnd') {
  //         var index = this.router.url.indexOf('?');
  //         var url = this.router.url.slice(0, index);
  //         if (index == -1) {
  //           var index = this.router.url.indexOf(';');
  //           var url = this.router.url.slice(0, index);
  //           if (index == -1) {
  //             var url = this.router.url;
  //           }
  //         }
  //         // console.log(url);

  //         for (let i = 0; i < this.menu.children.length; i++) {

  //           let itemNavBar = this.menu.children[i];
  //           if (url == itemNavBar.attributes.url) {
  //             //当前路由等于一级菜单路由
  //             // 使左边菜单显示
  //             this.navBar.nativeElement.className = 'modelRight';
  //           }
  //           else if (url != itemNavBar.attributes.url) {
  //             // 当前路由不等于一级菜单路由
  //             for (let j = 0; j < itemNavBar.children.length; j++) {
  //               let childNav = itemNavBar.children[j];

  //               if (url == childNav.attributes.url) {
  //                 // 当前路由等于 二级路由
  //                 this.navBar.nativeElement.className = '';
  //               } else if (url != childNav.attributes.url) {
  //                 // 当前路由不等于 二级路由
  //                 // this.navBar.nativeElement.className = 'modelRight';
  //               }
  //             }
  //           }
  //         }
  //       }
  //     })
  //   }

  // }


  public parentId: any; //父级id
  public parentUrl: any; //父级url
  public getUrl(menu: any) {
    // 判断路由
    if (menu.children) {
      let router = this.router.url.replace(/(;|\?)\S+/, ''); //当前路由；
      for (let item of menu.children) {
        if (item.attributes.url == router) { //在左侧时
          this.navBar.nativeElement.className = 'modelRight';
          window.localStorage.setItem('index', this.currentUrlId + 1);
          if (!window.localStorage.getItem('index') || this.numIndex != this.currentUrlId + 1) {
            this.numIndex = this.currentUrlId + 1;
          }
        }
        if (item.children && item.children.length > 0) {
          for (let childItem of item.children) {
            if (childItem.attributes.url == router) {
              // 确定在右侧
              this.navBar.nativeElement.className = '';
              this.parentId = childItem.attributes.parentId; //当前路由在数据中的父级路由
              this.parentUrl = item.attributes.url;
              this.numIndex = window.localStorage.getItem('index');
            } else if (childItem.attributes.url != router) {
            }
          }
        }
      }
    }

  }


  /* 向右偏移*/
  goback() {
    let router = this.router.url.replace(/;\S+/, ''); //当前路由；
    // 获取当前路由在数据中的父路由
    if (this.menu && this.menu.children) {
      this.getUrl(this.menu);
      // item:左侧菜单  childItem:右侧菜单
      // for (let item of this.menu.children) {
      //   if (item.children.length > 0) {
      //     for (let childItem of item.children) {
      //       if (childItem.attributes.url == router) {
      //         var parentId = childItem.attributes.parentId; //当前路由在数据中的父级路由
      //         var parentUrl = item.attributes.url;
      //       }
      //     }

      //   }
      //   console.log(parentUrl);
      // }
    }

    // 使左边菜单显示
    this.navBar.nativeElement.className = 'modelRight';

    let id = this.menu.children[0].id;
    this.router.navigate([this.parentUrl, { id: this.parentId }]);
  }
}

