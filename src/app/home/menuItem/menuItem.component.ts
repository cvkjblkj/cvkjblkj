import { CommonService } from './../../core/common-service/common.service';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router, Routes, ActivatedRoute } from '@angular/router'

@Component({
  selector: 'menuItem',
  templateUrl: './menuItem.component.html',
  styleUrls: ['./menuItem.component.css'],
})

export class MenuItemComponent implements OnInit {

  @Input() menu: any = ''; //设置数据形式
  @Input() child: boolean = false;

  constructor(private _router: Router, ) { }
  ngOnInit() { }
  public go(route, id) {

    // this._router.navigate([route, id]);
    // this._router.navigate(['cloudlink'])
  }


  stopBubble(e) {
    // 如果提供了事件对象，则这是一个非IE浏览器
    if (e && e.stopPropagation) {
      // 因此它支持W3C的stopPropagation()方法
      e.stopPropagation();
    } else {
      // 否则，我们需要使用IE的方式来取消事件冒泡
      window.event.cancelBubble = true;
    }
  }
}







