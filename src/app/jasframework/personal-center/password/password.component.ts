import { Component, OnInit,Input} from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import {Router, Routes} from '@angular/router'

@Component({
  selector:'jas-example',
  templateUrl:'./password.component.html',
  styleUrls:[ './password.component.css' ],
  
})

export class PasswordComponent implements OnInit {
  //  @Input() detail:any;
  //  @Input() child:boolean = false
  public name:any;
   constructor(private _router:Router) {}
	ngOnInit() {
         	
 
        }
	   
      
	}
	






