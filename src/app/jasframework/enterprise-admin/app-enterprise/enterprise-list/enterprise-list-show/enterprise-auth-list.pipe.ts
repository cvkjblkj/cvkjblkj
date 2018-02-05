import { Pipe } from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | authStatus:exponent
 * Example:
 *   {{ 2 |  authStatus:10}}
 *   formats to: 1024
*/
@Pipe({ name: 'authStatus' })
export class AuthStatusPipe {
    private anthstatus: string;
    transform(value: number): any {
        if (value == 1) {
            return '已认证';
        } else if (value == 0) {
            return '未认证';
        }else if(value == 2){
            return '等待认证';
        }else if(value == -1){
            return '认证驳回';
        }
    }
}