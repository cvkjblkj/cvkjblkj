import { Component, OnInit } from '@angular/core';

import { AppAdmin } from './shared/app.model';
import { AppService } from './shared/app.service';

@Component({
	selector: 'app',
	templateUrl: 'app.component.html',
	providers: [AppService]
})

export class AppComponent implements OnInit {
	app: AppAdmin[] = [];

	constructor(private appService: AppService) { }

	ngOnInit() {

	}
}
