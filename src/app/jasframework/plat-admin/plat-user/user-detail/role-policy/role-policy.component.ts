import { PlatAdminService } from './../../../shared/plat-admin.service';
import { PlatformUser } from './../../shared/platform-user.model';
import { PlatformUserService } from './../../shared/platform-user.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Message } from 'primeng/primeng';

@Component({
	selector: 'role-policy',
	templateUrl: 'role-policy.component.html',
	styleUrls: ['./role-policy.component.css'],
	providers: [PlatAdminService]
})

export class RolePolicyComponent implements OnInit {
	public dataId: any; //获取到tree的所有选中的节点id值
	public nodeTree: any; //获取tree的数据
	public userName: any;//用户名称
	public userId: any; //用户id值
	constructor(private platAdminService: PlatAdminService,private route: ActivatedRoute) { }

	ngOnInit() {
		let body = this.route.snapshot.params;
		console.log(body);
		this.userId = body['id'];
		this.userName = body['name'];
		this.nodeTree = [
			{
				id: 1,
				text: 'root1',
				children: [
					{ id: 2, text: 'child1' },
					{ id: 3, text: 'child2' }
				]
			},
			{
				id: 4,
				text: 'root2',
				children: [
					{ id: 5, text: 'child2.1' },
					{
						id: 6,
						text: 'child2.2',
						children: [
							{ id: 7, text: 'subsub' }
						]
					}
				]
			}
		]

	}
	/**
	 * 获取当前用户的组织机构
	 * 
	 */
	public InitData() {
		// this.platformUserService.getOrgTree(){

		// }
	}

	/**
	 * 提示信息
	 */
	confirmMsg(msg: any) {
		switch (msg) {
			case 'success':
				this.msgs = [];
				this.msgs.push({ severity: 'success', summary: '', detail: '保存成功' });
			case 'error':
				this.msgs = [];
				this.msgs.push({ severity: 'error', summary: '', detail: '保存失败' });
			case 'warn':
				this.msgs = [];
				this.msgs.push({ severity: 'warn', summary: '', detail: '警告' });
		}
	}

	/**
	 * 保存
	 */
	public msgs: Message[] = [];
	public saveRole() {
		this.msgs = [];
		this.msgs.push({ severity: 'success', summary: '', detail: '保存成功' });
		// this.platformUserService.saveRole(this.dataId){
		// 	(res) => {
		// 		if (res['success'] == 1) {
		// 			this.confirmMsg('success')
		// 		} else if (res['success'] == -1) {
		// 		}
		// 	}
		// }

	}

	/**
	 * 选中节点
	 * @param 节点信息 
	 */
	public selectNode($event) {
		console.log($event);
	}

	// tree的事件触发
	/**
 * tree  复选框选中
 *
 */
	public check(node, $event) {
		this.updateChildNodesCheckBox(node, $event.target.checked);
		this.updateParentNodesCheckBox(node.parent);
	}
	public updateChildNodesCheckBox(node, checked) {
		this.dataId.push(node.id)
		node.data.checked = checked;
		if (node.children) {
			node.children.forEach((child) => this.updateChildNodesCheckBox(child, checked));
		}
	}
	public updateParentNodesCheckBox(node) {
		this.dataId.push(node.id)
		if (node && node.level > 0 && node.children) {
			let allChildChecked = true;
			let noChildChecked = true;

			for (let child of node.children) {
				if (!child.data.checked) {
					allChildChecked = false;
				} else if (child.data.checked) {
					noChildChecked = false;
				}
			}

			if (allChildChecked) {
				node.data.checked = true;
				node.data.indeterminate = false;
			} else if (noChildChecked) {
				node.data.checked = false;
				node.data.indeterminate = false;
			} else {
				node.data.checked = true;
				node.data.indeterminate = true;
			}
			this.updateParentNodesCheckBox(node.parent);
		}
	}


}
