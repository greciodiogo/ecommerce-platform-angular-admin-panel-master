import { Component } from '@angular/core';
import { ShopsActions } from '../../store';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-shops',
  templateUrl: './shops.component.html',
  styleUrls: ['./shops.component.scss'],
})
export class ShopsComponent {
  constructor(private store: Store) {}

   ngOnInit() {
      this.store.dispatch(ShopsActions.loadShops());
    }
}
