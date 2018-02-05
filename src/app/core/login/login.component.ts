import { INCONFIG } from './../global';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, ViewEncapsulation } from '@angular/core';
import { Route, Router } from '@angular/router';

import { LoginService } from './shared/login.service';
import { MD5 } from './shared/md5.js';

@Component({
  selector: 'login',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./login.scss')],    //引入CSS网页样式风格
  template: require('./login.html'),    //网页显示模板
  providers: [LoginService]             //服务的声明使用
})
export class Login {

  public form: FormGroup;
  public text: AbstractControl;
  public password: AbstractControl;
  public submitted: boolean = false;
  public result: any;   //点击登录之后的返回结果
  public error: any;  //接收登录失败的原因
  public isLogin: boolean = true;
  constructor(fb: FormBuilder, public router: Router, public loginService: LoginService) {
    this.form = fb.group({
      'text': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });

    this.text = this.form.controls['text'];
    this.password = this.form.controls['password'];
  }
  public onSubmit(values: Object): void {
    this.submitted = true;

    // values['password'] = MD5(values['password']);

    this.isLogin = false;
    if (this.form.valid) {
      setTimeout(() => { this.isLogin = true; }, 3000);
      this.loginService.getAuth(values)
        .then(result => {
          this.isLogin = true;
          this.result = result;
          let rel = this.result['success'];
          // 后台返回信息判断
          if (rel == -1) {
            let message = this.result['msg'];
            this.error = message;
            return;
          }
          else if (rel == 1) {
            let token = this.result['token'];
            // 存储token
            window.localStorage['jasToken'] = token;
            //存储 系统id
            window.localStorage['appCode'] = 'PaasCloud';
            //存储 用户id
            window.localStorage['userId'] = result.rows[0].objectId;
            //存储组织机构id
            window.localStorage['orgId'] = result.rows[0].orgId;
            //存储 企业id
            window.localStorage['enterpriseId'] = result.rows[0].enterpriseId;
            window.localStorage['viewTypeCode'] = 'WebManage';
            window.localStorage['loginUserName'] = result.rows[0].userName;;
            window.localStorage['loginRolesName'] = result.rows[0].roleNames;;

            INCONFIG.userInfo = result.rows[0];

            this.router.navigate(['/']);
            // if (){
            //   // 默认企业id；
            //   this.router.navigate(['/cloudlink']);


            // } else if (){
            //   // 没有默认企业
            //   this.router.navigate(['./enterprise'])
            // }

          }

        })

      // if (this.text.value == 'amc_lap@163.com') {
      //   console.log("登陆成功!");
      //   localStorage.setItem("userName", this.text.value);
      //   // this.router.navigateByUrl('/cloudlink');
      //   this.router.navigateByUrl('/cloudlink');
      //   console.log(this.router);
      //   console.log("转向成功！");
      // }
      // your code goes here
      // console.log(values);
    }
  }
}
