import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUserRole } from 'src/app/core/auth/store';

@Component({
  selector: "app-filter-helper",
  templateUrl: "./filter-helper.component.html",
  styleUrls: ['./filter-helper.component.css'],

})
export class FilterHelper  {
    role$ = this.store.select(selectUserRole);
    public openModal: boolean = false

    constructor(private store: Store){}
    

    public handleClick = () => {
      this.openModal = true
    }
}