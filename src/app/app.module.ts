import { CommonService } from './core/common-service/common.service';
import { CommonRequestService } from './core/common-service/common-request.service';
import { CommonRequestMethodService } from './core/common-service/request-method.service';
import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
//加载路由
import { routing } from './app.routing';

// App is our top level component
//引入app 组件
import { App } from './app.component';
import { AppState, InternalStateType } from './app.service';
import { GlobalState } from './global.state';
import { NgaModule } from './theme/nga.module';
//HomeModule ：这个模块中路由也被加载进来了。
import { HomeModule } from './home/home.module';
import { AuthGuard } from './core/shared/auth-guard.service';
// Application wide providers
const APP_PROVIDERS = [
  AppState,
  GlobalState
];

type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */

/* NgModule是一个装饰器函数，它接收一个用来描述模块属性的元数据对象。其中最重要的属性:
 * bootstrap : 指定应用的主视图（称为根组件），它是所有其它视图的宿主。只有根模块才能设置bootstrap属性。
 * imports : 本模块声明的组件模板需要的类所在的其它模块。
 * declarations : 声明本模块中拥有的视图类。Angular 有三种视图类：组件、指令和管道。
 * providers : 服务的创建者，并加入到全局服务列表中，可用于应用任何部分。
 * 详细介绍: https://angular.cn/docs/ts/latest/guide/architecture.html#!#modules
 * */
@NgModule({
  bootstrap: [App],
  declarations: [
    App
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    HttpModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgaModule.forRoot(),
    HomeModule,
    routing
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS,
    AuthGuard,
    CommonRequestMethodService,
    CommonRequestService,
    CommonService

  ]
})

export class AppModule {

  constructor(public appRef: ApplicationRef, public appState: AppState) {
  }

  hmrOnInit(store: StoreType) {
    if (!store || !store.state) return;
    console.log('HMR store', JSON.stringify(store, null, 2));
    // set state
    this.appState._state = store.state;
    // set input values
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }
    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // save state
    const state = this.appState._state;
    store.state = state;
    // recreate root elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // save input values
    store.restoreInputValues = createInputTransfer();
    // remove styles
    removeNgStyles();
  }

  hmrAfterDestroy(store: StoreType) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}
