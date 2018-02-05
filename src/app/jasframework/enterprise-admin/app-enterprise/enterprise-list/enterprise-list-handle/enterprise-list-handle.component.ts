/**
 * Created by Administrator on 2016/11/25.
 */

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { ConfirmationService } from 'primeng/primeng';

import { AppEnterpriseService } from './../../shared/app-enterprise.service';
import { AppEnterprise } from './../../shared/app-enterprise.model';

@Component({
    selector: 'jas-enterprise-list-handle',
    templateUrl: 'enterprise-list-handle.component.html',
    styleUrls: ['./enterprise-list-handle.component.css']
})

export class EnterpriseListHandleComponent implements OnInit {
    private toeChoice: string;
    private detail: AppEnterprise;
    private rel: AppEnterprise;
    private enterpriseName: string;
    private enterpriseScale: number;
    private registerNum: string;
    private address: string;
    private telephoneNum: string;
    private fileId: string;
    private arg: string;
    private bussinessUrl: Array<Object>;
    private cardUrl: Array<Object>;
    private url: string;
    private imgUrl: string;
    public objectId: any;  //当前企业的id值

    public userName:any; // 管理员的姓名
    public mobileNum:any; // 管理员账号
    public createUsermobileNum:any; // 创建人账号

    constructor(
        private appEnterpriseService: AppEnterpriseService,
        private route: ActivatedRoute,
        private router: Router,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit(): void {
        let arg = this.route.snapshot.params;

        this.toeChoice = arg['type'];
        if (!arg['id']) {
            return;
        }
        this.objectId = arg['id'];
        this.appEnterpriseService.getMessageDetail(arg['id'])
            .then(detail => {
                this.detail = detail["rows"][0];
                if (arg['type'] == 'look') {
                    this.getPicSrc(arg['id']);
                }

                //创建人的id值
                let createUser = this.detail['createUser'];
                //获取创建人的账号
                this.appEnterpriseService.getCreatUser(this.objectId,createUser).then(
                    (res)=>{
                        this.createUsermobileNum = res['rows'][0]['mobileNum']
                    }
                )
            })

        //获取管理员账号
        this.appEnterpriseService.getSysAdmin(this.objectId).then(
            (res)=>{
                this.userName = res['rows'][0]['userName'];
                this.mobileNum = res['rows'][0]['mobileNum'];
            }
        )

    }

    // 获取图片
    // 先获取文件的id,通过id获取图片路径
    getPicSrc(objectId: string): void {

        this.appEnterpriseService.getfileId(objectId)
            .then(filesId => {
                this.fileId = filesId;
                if (!this.fileId['rows'][0][objectId]) {
                    this.imgUrl = '没有图片'
                    return;
                };

                this.arg = this.fileId['rows'][0][objectId];
                //营业执照图片地址
                this.bussinessUrl = this.arg['pic_business'];
                // 身份证图片地址
                this.cardUrl = this.arg['pic_identity']
            });

    }

    goBack(): void {
        //获取父路由路径
        // let sixthParentPath = this.route.parent.parent.parent.parent.parent.parent.routeConfig.path;
        // let seventhParentPath = this.route.parent.parent.parent.parent.parent.parent.parent.routeConfig.path;
        // let fourthParentPath = this.route.parent.parent.parent.parent.routeConfig.path;
        // let secondParentPath = this.route.parent.parent.routeConfig.path;
        // this.router.navigate([`/${seventhParentPath}/${sixthParentPath}/${fourthParentPath}/${secondParentPath}/list-show`]);
        window.history.back();
    }

    /**
     * 编辑修改 
     */
    //  保存
    public body: any;

    // editSave(value: any): void {
    //     let Id = this.detail ? this.detail.objectId : null;
    //     value.objetId = Id;

    //     this.appEnterpriseService.update(value)
    //         .then(res => {
    //             this.rel = res["rows"][0];
    //             this.confirmMes()
    //         });

    // }

    // 提示
    confirmMes(): void {
        if (this.rel['objectId'] != undefined) {
            this.confirmationService.confirm({
                message: '操作成功',
                accept: () => {
                    this.goBack()
                }
            })
        } else {
            this.confirmationService.confirm({
                message: '操作失败，请重新操作'
            })
        }

    }

    //tab切换
    public isclicked: any = true;
    basicMes() {
        this.isclicked = true;
    }

    // 历史记录
    public historise: any;
    historyShow(): void {
        this.isclicked = false;
        let Id = this.detail ? this.detail.objectId : null;
        this.appEnterpriseService.getHistory(this.objectId)
            .then(res => this.historise = res['rows'])
    }
}