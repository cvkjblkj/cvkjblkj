import { Component, ElementRef, HostListener, ViewEncapsulation, Input } from '@angular/core';
import { GlobalState } from '../../global.state';
import { layoutSizes } from '../../theme';
// 菜单数据的获取
import { MenuService } from "../../app.menu";

@Component({
  selector: 'ba-sidebar',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./baSidebar.scss')],
  template: require('./baSidebar.html')
})
export class BaSidebar {
  public menu: any; // 接收菜单数据

  public menuHeight: number;
  public isMenuCollapsed: boolean = false;
  public isMenuShouldCollapsed: boolean = false;


  constructor(private _elementRef: ElementRef, private _state: GlobalState, private menuService: MenuService) {

    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });

  }

  /**
   * 改变数据返回的字段
   * 添加字段 selected  expanded
   */
  private changeData(data: any) {
    for (let item of data) {
      item.selected = false;
      item.expanded = false;
      if (item.children.length > 0) {
        this.changeData(item.children)
      }
    }
  }


  public ngOnInit(): void {
    let __this = this;

    this.menuService.getMenu(__this, (res) => {
      __this.menu = res['rows'];
      // let discutir = {
      //   'text': '预研',
      //   'id': '0234-110',
      //   'attributes': {
      //     icon: null,
      //   },
      //   'children': [
      //     {
      //       'text': 'ngx-charts图表',
      //       'id': '0234-ngx-charts',
      //       'attributes': {
      //         'url': '/advanced-research/ngxcharts'
      //       }
      //     }, {
      //       'text': 'echarts图表',
      //       'id': '0234-echarts',
      //       'attributes': {
      //         'url': '/advanced-research/ngecharts'
      //       }
      //     }, {
      //       'text': 'arcgis地图',
      //       'id': '0234-120',
      //       'attributes': {
      //         'url': '/advanced-research/arc-gis-map'
      //       }
      //     },
      //     {
      //       'text': '百度地图',
      //       'id': '0234-1111',
      //       'attributes': {
      //         'url': '/advanced-research/baidu-map'
      //       }
      //     },
      //     {
      //       'text': '实时数据',
      //       'id': '0234-18511',
      //       'attributes': {
      //         'url': '/advanced-research/real-time'
      //       }
      //     },
      //     {
      //       'text': '统计分析',
      //       'id': '00211352',
      //       'attributes': {
      //         'url': '/jas/statistic-analysis'
      //       },
      //     },
      //     {
      //       'text': '监控',
      //       'id': '002113123',
      //       'attributes': {
      //         'url': '/monitoring-info/master-monitor/base-monitor'
      //       },
      //       "children": [
      //         {
      //           'text': '主机监控',
      //           'id': '00211352',
      //           'attributes': {
      //             'url': '/jas/monitoring-info/master-monitor/base-monitor'
      //           },
      //         },
      //       ]
      //     },
      //     {
      //       'text': 'rds监控',
      //       'id': '00211352',
      //       'attributes': {
      //         'url': '/jas/monitoring-info/rds-monitor'
      //       },
      //     },
      //     {
      //       'text': 'balance监控',
      //       'id': '00211352',
      //       'attributes': {
      //         'url': '/jas/monitoring-info/balance-monitor'
      //       },
      
      
      //     },
      //     {
      //       'text': 'redis监控',
      //       'id': '00211352',
      //       'attributes': {
      //         'url': '/jas/monitoring-info/redis-montior'
      //       },
      
      
      //     },
      //     {
      //       'text': 'docker监控',
      //       'id': '00211352',
      //       'attributes': {
      //         'url': '/jas/monitoring-info/docker-monitor'
      //       },
      
      
      //     },
      //   ]
      // };
      // this.menu.push(discutir);
    })

    if (this._shouldMenuCollapse()) {
      this.menuCollapse();
    }
  }

  public ngAfterViewInit(): void {
    setTimeout(() => this.updateSidebarHeight());
  }

  public toggleMenu(collapseBtn: any, collapseMenu: any) {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);

    if (this.isMenuCollapsed) {
      //当菜单收缩

    } else if (!this.isMenuCollapsed) {
    }
    return false;
  }

  @HostListener('window:resize')
  public onWindowResize(): void {

    var isMenuShouldCollapsed = this._shouldMenuCollapse();

    if (this.isMenuShouldCollapsed !== isMenuShouldCollapsed) {
      this.menuCollapseStateChange(isMenuShouldCollapsed);
    }
    this.isMenuShouldCollapsed = isMenuShouldCollapsed;
    this.updateSidebarHeight();
  }

  public menuExpand(): void {
    this.menuCollapseStateChange(false);
  }

  public menuCollapse(): void {
    this.menuCollapseStateChange(true);
  }

  public menuCollapseStateChange(isCollapsed: boolean): void {
    this.isMenuCollapsed = isCollapsed;
    this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
  }

  public updateSidebarHeight(): void {
    // TODO: get rid of magic 84 constant
    this.menuHeight = this._elementRef.nativeElement.childNodes[0].clientHeight - 84;
  }

  private _shouldMenuCollapse(): boolean {
    return window.innerWidth <= layoutSizes.resWidthCollapseSidebar;
  }
}
