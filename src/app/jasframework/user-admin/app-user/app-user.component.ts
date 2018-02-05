import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jas-app-user',
  templateUrl: './app-user.component.html',
  styleUrls: ['./app-user.component.css']
})
export class AppUserComponent implements OnInit {
  public selectedId:any;
  public idData:any; //对象，企业id和应用id
  constructor(public route:ActivatedRoute) { }

  ngOnInit() {
    this.idData = this.route.snapshot.params;
  }
   onSelectedId(selectedId: string) {
        let rootNodeId = window.localStorage['rootNode']
        this.selectedId = selectedId;
    }

}