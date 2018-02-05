import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { PersonalCenterService } from '../shared/personal-center.service';

@Component({
  selector: 'jas-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.css'],
  providers: [PersonalCenterService]

})

export class BasicInfoComponent implements OnInit {
  // 页容量数组 
  public rowsPerPageOptions = ['10', '20', '30'];
  public pageSize: string = '10'; //页容量
  public pageNum: any; //页码
  public maxSize: number = 5;
  public totalPages: any = 10;  //总页数
  public size: any=10; // 当前页容量
  private totalItems: number=100;   //总数据条数


  constructor(public PersonalCenterService: PersonalCenterService) {
  }
  ngOnInit() {
  }
}