import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AddressesActions from '../../store/actions/addresses.actions';
import * as fromAddresses from '../../store/selectors/addresses.selectors';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  // styleUrls: ['./address.component.scss'],
})
export class AddressComponent implements OnInit, OnDestroy {
  address$ = this.store.select(fromAddresses.selectSelectedAddress);

  constructor(private store: Store, private route: ActivatedRoute) {}

  ngOnInit() {
    this.store.dispatch(
      AddressesActions.selectAddress({
        addressId:
          parseInt(this.route.snapshot.paramMap.get('id') ?? '0') || null,
      }),
    );
  }

  ngOnDestroy() {
    this.store.dispatch(AddressesActions.selectAddress({ addressId: null }));
  }
} 