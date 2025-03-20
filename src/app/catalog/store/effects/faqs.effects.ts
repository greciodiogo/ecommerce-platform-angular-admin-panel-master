import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { FaqsApiService } from '../../../core/api';
import { FaqsActions } from '../actions';
import { exhaustMap, filter, map } from 'rxjs/operators';
import { catchError, of } from 'rxjs';

@Injectable()
export class FaqsEffects {
  constructor(private actions$: Actions, private faqsApi: FaqsApiService) {}

  loadFaqs$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FaqsActions.loadFaqs),
      exhaustMap(() =>
        this.faqsApi.getFaqs().pipe(
          map((faqs) => FaqsActions.loadFaqsSuccess({ faqs })),
          catchError(({ error }) =>
            of(FaqsActions.loadFaqsFailure({ error: error.message })),
          ),
        ),
      ),
    );
  });

  getFaq$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FaqsActions.getFaq),
      exhaustMap(({ faqId }) =>
        this.faqsApi.getFaq(faqId).pipe(
          map((faq) => FaqsActions.getFaqsuccess({ faq })),
          catchError(({ error }) =>
            of(FaqsActions.getFaqFailure({ error: error.message })),
          ),
        ),
      ),
    );
  });

  selectFaq$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FaqsActions.selectFaqNumber),
      filter(({ faqId }) => faqId !== null),
      map(({ faqId }) => FaqsActions.getFaq({ faqId })),
    );
  });

  createFaq$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FaqsActions.createFaq),
      exhaustMap(({ data }) =>
        this.faqsApi.createFaq(data).pipe(
          map((newFaq) => FaqsActions.createFaqsuccess({ faq: newFaq })),
          catchError(({ error }) =>
            of(FaqsActions.createFaqFailure({ error: error.message })),
          ),
        ),
      ),
    );
  });

  updateFaq$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FaqsActions.updateFaq),
      exhaustMap(({ faqId, data }) =>
        this.faqsApi.updateFaq(faqId, data).pipe(
          map((updatedFaq) =>
            FaqsActions.updateFaqsuccess({ faqId, faq: updatedFaq }),
          ),
          catchError(({ error }) =>
            of(FaqsActions.updateFaqFailure({ error: error.message })),
          ),
        ),
      ),
    );
  });
}
