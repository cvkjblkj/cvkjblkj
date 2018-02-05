import { Component, OnInit, Input} from '@angular/core';
// import { FormsModule } from '@angular/forms';

@Component({
  selector: 'query-data-overloaded',
  // styleUrls: [''],
  styles: [`
    /*查询的数据太多，超过1000条提示风格*/
    .query-data-overloaded-info {
      color: #e49771;
    }
    .query-data-overloaded-info-number {
      color: #6ea2f2;
      font-size: 14px;
    }
  `],
  providers: [],
  template: `
    <div class="query-data-overloaded-info">
      <!--总共查询到2000条，当前仅显示前1000条数据，改进筛选条件以查看其他数据-->
      <span>共</span>
      <span class="query-data-overloaded-info-number">{{total}}</span>
      <span>条，</span>
      <span>当前仅显示前</span>
      <span class="query-data-overloaded-info-number">1000</span>
      <span>条，改进筛选条件以查看其他数据</span>
    </div>
  `,
})

export class QueryDataOverloadedComponent implements OnInit{
  //传入的总共有多少数据
  @Input() total: any;

  constructor() {

  }

  public ngOnInit() {

  }
}
