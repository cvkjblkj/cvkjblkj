import { Component } from '@angular/core';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
    selector: 'user-detail',
    template: `<router-outlet></router-outlet>`,
})
export class UserDetailComponent {
    constructor() {

    }
}