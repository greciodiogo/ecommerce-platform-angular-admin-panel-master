import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AddressActions } from '../../store';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss'],
})
export class AddressesComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(AddressActions.loadAddresses());
  }
}