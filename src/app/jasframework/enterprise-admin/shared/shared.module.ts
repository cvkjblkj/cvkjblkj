import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EnterpriseScalePipe } from './enterprise-list.pipe';

@NgModule({
    imports: [CommonModule],
    declarations: [EnterpriseScalePipe],
    exports: [EnterpriseScalePipe],
})
export class ShareModule { }   