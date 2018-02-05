import { Component, ViewEncapsulation } from '@angular/core';
import { Route, Router } from '@angular/router';

import { GlobalState } from '../../global.state';
import { LoginService } from '../../core/login/shared/login.service';

@Component({
  selector: 'ba-page-top',
  styles: [require('./baPageTop.scss')],
  template: require('./baPageTop.html'),
  encapsulation: ViewEncapsulation.None,
  providers: [LoginService]
})
export class BaPageTop {
  public userName: any = window.localStorage['loginUserName'];
  public isScrolled: boolean = false;
  public isMenuCollapsed: boolean = false;

  constructor(
    private _state: GlobalState,
    private router: Router,
    private loginService: LoginService) {
    // this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
    //   this.isMenuCollapsed = isCollapsed;
    // });
  }

  // public toggleMenu() {
  //   this.isMenuCollapsed = !this.isMenuCollapsed;
  //   this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
  //   return false;
  // }

  public scrolledChanged(isScrolled) {
    this.isScrolled = isScrolled;
  }

  public signout() {

    let token = window.localStorage['jasToken'];
    this.loginService.signout(token).then(
      (res) => {
        // 跳转到login页面
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    )

  }
}