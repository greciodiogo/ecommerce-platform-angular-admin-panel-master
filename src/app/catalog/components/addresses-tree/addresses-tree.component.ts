import { Component, OnDestroy, OnInit } from '@angular/core';
import { Address } from '../../../core/api/model/address';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AddressActions, selectAddressesList } from '../../store';
import { selectUserRole } from 'src/app/core/auth/store';

@Component({
  selector: 'app-addresses-tree',
  templateUrl: './addresses-tree.component.html',
  styleUrls: ['./addresses-tree.component.scss'],
})
export class AddressesTreeComponent implements OnInit, OnDestroy {
  addresses$ = this.store.select(selectAddressesList);
  role$ = this.store.select(selectUserRole);
  addressesTree$ = this.addresses$.pipe(
    map((addresses) => AddressesTreeComponent.createTree(addresses)),
  );
  private subscription!: Subscription;

  tree: Address[] = [];
  treeControl = new NestedTreeControl<Address, number>(
    (node) => node.childAddresses,
    { trackBy: (node) => node.id },
  );
  dataSource = new MatTreeNestedDataSource<Address>();
  newNode: { name: string; parentAddress: null | Address } = {
    name: '',
    parentAddress: null,
  };

  formGroup = new FormGroup({
    newName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor(private store: Store, private router: Router) {}

  static createTree(addresses: Address[]): Address[] {
    const hashTable = Object.create(null);
    addresses.forEach(
      (address) =>
        (hashTable[address.id] = { ...address, childAddresses: [] }),
    );
    addresses.forEach((address) => {
      if (address.parentAddress?.id) {
        hashTable[address.parentAddress.id].childAddresses.push(
          hashTable[address.id],
        );
      }
    });
    // Only root addresses (not children of any other address)
    const childIds = new Set(addresses.filter(a => a.parentAddress?.id).map(a => a.id));
    const dataTree: Address[] = [];
    addresses.forEach((address) => {
      if (!childIds.has(address.id)) {
        dataTree.push(hashTable[address.id]);
      }
    });
    return dataTree;
  }

  ngOnInit() {
    this.subscription = this.addressesTree$.subscribe((addresses) => {
      // Only add the newNode for the add form, not as a real address
      this.tree = [...addresses];
      this.newNode.parentAddress = null;
      this.dataSource.data = [...this.tree, this.newNode as Address];
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  hasChild = (_: number, node: Address) =>
    !!node.childAddresses && node.childAddresses.length > 0;

  hasNoContent = (_: number, node: Address) => !node.name;

  addAddress(address?: Address) {
    if (this.newNode.parentAddress) {
      this.newNode.parentAddress.childAddresses =
        this.newNode.parentAddress.childAddresses.filter(
          (c) => c !== this.newNode,
        );
    }
    this.newNode.parentAddress = address ?? null;
    this.tree = this.tree.filter((c) => c !== this.newNode);
    if (address) {
      address.childAddresses = [
        ...address.childAddresses,
        this.newNode as Address,
      ];
    } else {
      this.tree = [...this.tree, this.newNode as Address];
    }
    this.dataSource.data = [];
    this.dataSource.data = this.tree;
    if (address) {
      this.treeControl.expand(address);
    }
    this.formGroup.reset();
  }

  add() {
    if (this.formGroup.invalid) {
      return;
    }
    this.store.dispatch(
      AddressActions.createAddress({
        data: {
          name: this.formGroup.value.newName!,
          visible: true,
          parentAddressId: this.newNode.parentAddress?.id,
        },
      }),
    );
    this.formGroup.reset();
  }

  goToDetails(address: Address) {
    this.router.navigate(['/catalog/addresses', address.id]);
  }
} 
