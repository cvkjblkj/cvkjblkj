import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot } from '@angular/router';

import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuard implements CanLoad, CanActivate {

    constructor(private router: Router) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let url: string = state.url;
        // console.log("jinru------------");
        return false;
    }
    canLoad(route: Route): boolean {
        // return this.permissions.canLoadChildren(this.currentUser, route);
        // console.log("come in  guard-------");
        // console.log(this.router);
        // console.log(localStorage.getItem('userName'));
        if (!localStorage.getItem('jasToken')) {
            this.router.navigateByUrl('/login');
            return false;
        }
        return true;
    }
}
