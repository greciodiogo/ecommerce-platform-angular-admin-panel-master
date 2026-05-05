import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CategoriesActions, FaqsActions } from '../actions';
import { CustomFaqService } from '../../services/custom-faq.service';
import { concatMap, exhaustMap, map } from 'rxjs/operators';
import { catchError, of } from 'rxjs';

@Injectable()
export class FaqsEffects {
  constructor(private actions$: Actions, private customFaqService: CustomFaqService) {}

  loadFaqs$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FaqsActions.loadFaqs, CategoriesActions.loadCategories),
      exhaustMap(() =>
        this.customFaqService.getFaqs().pipe(
          map((faqs) => FaqsActions.loadFaqsSuccess({ faqs })),
          catchError((error) =>
            of(FaqsActions.loadFaqsFailure({ error: error.message || 'Failed to load FAQs' })),
          ),
        ),
      ),
    );
  });

  addFaq$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FaqsActions.addFaq),
      concatMap(({ data }) =>
        this.customFaqService.createFaq(data).pipe(
          map((faq) => FaqsActions.addFaqSuccess({ faq })),
          catchError((error) =>
            of(FaqsActions.addFaqFailure({ error: error.message || 'Failed to create FAQ' })),
          ),
        ),
      ),
    );
  });

  updateFaq$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FaqsActions.updateFaq),
      concatMap(({ id, data }) =>
        this.customFaqService.updateFaq(id, data).pipe(
          map((faq) => FaqsActions.updateFaqSuccess({ id, faq })),
          catchError((error) =>
            of(FaqsActions.updateFaqFailure({ error: error.message || 'Failed to update FAQ' })),
          ),
        ),
      ),
    );
  });

  deleteFaq$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FaqsActions.deleteFaq),
      concatMap(({ id }) =>
        this.customFaqService.deleteFaq(id).pipe(
          map(() => FaqsActions.deleteFaqSuccess({ id })),
          catchError((error) =>
            of(FaqsActions.deleteFaqFailure({ error: error.message || 'Failed to delete FAQ' })),
          ),
        ),
      ),
    );
  });
}
