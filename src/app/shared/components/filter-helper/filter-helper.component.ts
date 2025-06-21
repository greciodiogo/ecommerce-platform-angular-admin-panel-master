import { Component, EventEmitter, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUserRole } from 'src/app/core/auth/store';

@Component({
  selector: "app-filter-helper",
  templateUrl: "./filter-helper.component.html",
  styleUrls: ['./filter-helper.component.css'],

})
export class FilterHelper  {
    @Output() close = new EventEmitter<void>();
    role$ = this.store.select(selectUserRole);
    public openModal: boolean = false

    constructor(private store: Store){}
    

    public handleClick = () => {
      this.openModal = !this.openModal
    }

    public handleClose = () => {
      this.openModal = false;
      this.close.emit();
    }
}