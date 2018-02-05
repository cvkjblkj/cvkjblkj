import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

//引入登陆功能组件
import { Login } from './login.component';
//引入路由
import { routing }       from './login.routing';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    routing
  ],
  declarations: [
    Login         //声明组件，不声明就使用会报错。
  ]
})
export default class LoginModule {}
