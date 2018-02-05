import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import { Gridpagination } from './shared/grid-pagination.model';


@Component({
	selector: 'grid-pagination',
	templateUrl: 'grid-pagination.component.html',
	styleUrls: ['./grid-pagination.component.scss'],
})

export class GridpaginationComponent implements OnInit, OnChanges {
	//接收数据;
	@Input() totalPages: any;  //总页数   由于查询结果只能有1000条，所以总页数自己算，这里参数没用了，后期有时间去掉这个参数
	@Input() totalItems: any;  //总数据量
	@Input() size: Number;  //当前页容量
	@Input() pageSize: any;  //页容量
	@Input() maxSize: any;  //限制显示的页码

	public itemPages: any = 0; //页容量
  public totalPagesNum:any ;  //计算总页数
	// 发射出的事件
	@Output() sizeChanged = new EventEmitter<any>()      //页容量改变
	@Output() pageChanged = new EventEmitter<any>()        //页码改变
	gridpagination = new Gridpagination();
	constructor() {
		this.gridpagination.currentPage = 1; //当前页数
		this.gridpagination.itemsPerPage = this.size; // 当前页容量
	}

	ngOnInit() {
	}
	ngOnChanges() {
	}

	/**
	 * 页容量改变
	 * paramters : num:number 页容量
	*/
	public sizeData(num: number) {
		// this.gridpagination.itemsPerPage = num; //修改当前页容量
		this.size = num;
		this.gridpagination.currentPage = 1;//无法同时修改当前页和每页总数
		this.gridpagination.itemsPerPage = num;
		this.sizeChanged.emit(num);
	};

	/**
 	* 页码改变
	* paramters event:any 页码改变的信息
 	*/
	public onPageChanged(event: any): void {
		this.gridpagination.currentPage = event.page;
		this.gridpagination.itemsPerPage = this.size;
		this.pageChanged.emit(this.gridpagination)
	};

/**
 *
 * @param event 总共页数
 */
	numTotalPages(event) {
		this.totalPagesNum = event;

	}
}
