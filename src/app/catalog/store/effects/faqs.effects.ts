import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CategoriesActions, FaqsActions } from '../actions';
import { FaqsApiService } from '../../../core/api';
import { concatMap, exhaustMap, map } from 'rxjs/operators';
import { catchError, of } from 'rxjs';

@Injectable()
export class FaqsEffects {
  constructor(private actions$: Actions, private faqsApi: FaqsApiService) {}

  loadFaqs$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FaqsActions.loadFaqs, CategoriesActions.loadCategories),
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

  addFaq$ = createEffect(() => {
    console.log('teste on effect');
    return this.actions$.pipe(
      ofType(FaqsActions.addFaq),
      concatMap(({ data }) =>
        this.faqsApi.createFaq(data).pipe(
          map((faq) => FaqsActions.addFaqSuccess({ faq })),
          catchError(({ error }) =>
            of(FaqsActions.addFaqFailure({ error: error.message })),
          ),
        ),
      ),
    );
  });

  updateFaq$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FaqsActions.updateFaq),
      concatMap(({ id, data }) =>
        this.faqsApi.updateFaq(id, data).pipe(
          map((faq) => FaqsActions.updateFaqSuccess({ id, faq })),
          catchError(({ error }) =>
            of(FaqsActions.updateFaqFailure({ error: error.message })),
          ),
        ),
      ),
    );
  });

  deleteFaq$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FaqsActions.deleteFaq),
      concatMap(({ id }) =>
        this.faqsApi.deleteFaq(id).pipe(
          map(() => FaqsActions.deleteFaqSuccess({ id })),
          catchError(({ error }) =>
            of(FaqsActions.deleteFaqFailure({ error: error.message })),
          ),
        ),
      ),
    );
  });
}
