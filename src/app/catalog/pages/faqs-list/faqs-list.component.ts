import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { FaqsActions, selectFaqsList } from '../../store';
import { Faq } from '../../../core/api';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom, Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-faqs-list',
  templateUrl: './faqs-list.component.html',
  styleUrls: ['./faqs-list.component.scss'],
})
export class FaqsListComponent implements OnInit, AfterViewInit, OnDestroy {
  faqs$ = this.store.select(selectFaqsList);
  dataSource = new MatTableDataSource<Faq>();
  subscription!: Subscription;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private store: Store, public router: Router) {}

  ngOnInit() {
    this.dataSource.data = [];
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  async ngAfterViewInit() {
    this.dataSource.data = await firstValueFrom(this.faqs$);
    this.subscription = this.faqs$.subscribe((faqs) => {
      this.dataSource.data = faqs;
    });
    this.store.dispatch(FaqsActions.loadFaqs());
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
