import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'alarm-manage',
  templateUrl: './alarm-manage.component.html',
  styleUrls: ['./alarm-manage.component.scss']
})
export class AlarmManageComponent implements OnInit {

  msgs: any;

  public isClick: any;  //时间搜索条件被点击
  public date: any;  //点击自定义，被选中的时间
  public isSelectedDate: any = false;  //点击自定义，展示被选中的时间，是否显示
  public maxSelectedLabels: number = 0;
  public defaultLabel: string = "列表项";
  public dateEnd: Date; //自定义选择   结束时间
  public dateStart: Date; //自定义选择 开始时间
  constructor() {

  }

  ngOnInit() {
    this.dateEnd = new Date();
    this.dateStart = new Date();
  }

}
