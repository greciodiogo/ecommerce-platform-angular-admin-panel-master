import { Component, OnDestroy, OnInit } from '@angular/core';
import { FaqsActions, selectSelectedFaq } from '../../store';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent implements OnInit, OnDestroy {
  faq$ = this.store.select(selectSelectedFaq);

  constructor(private store: Store, private route: ActivatedRoute) {}

  ngOnInit() {
    this.store.dispatch(
      FaqsActions.selectFaq({
        faqId: parseInt(this.route.snapshot.paramMap.get('id') ?? '0') || null,
      }),
    );
  }

  ngOnDestroy() {
    this.store.dispatch(FaqsActions.selectFaq({ faqId: null }));
  }
}
