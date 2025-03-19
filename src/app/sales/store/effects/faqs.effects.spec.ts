import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';

import { FaqsEffects } from './faqs.effects';
import { FaqsActions } from '../actions';

describe('FaqsEffects', () => {
  let actions$: Observable<any>;
  let effects: FaqsEffects;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FaqsEffects, provideMockActions(() => actions$)],
    });

    effects = TestBed.inject(FaqsEffects);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('loadFaqs$', () => {
    it('should return a loadFaqsSuccess action', (done) => {
      actions$ = of(FaqsActions.loadFaqs());

      effects.loadFaqs$.subscribe((result) => {
        expect(result).toEqual(FaqsActions.loadFaqsSuccess({ faqs: [] }));
        done();
      });

      httpTestingController.expectOne({ method: 'GET' }).flush([]);
    });

    it('should return a loadFaqsFailure action', (done) => {
      actions$ = of(FaqsActions.loadFaqs());

      effects.loadFaqs$.subscribe((result) => {
        expect(result).toEqual(
          FaqsActions.loadFaqsFailure({ error: 'error' }),
        );
        done();
      });

      httpTestingController
        .expectOne({ method: 'GET' })
        .flush(
          { message: 'error' },
          { status: 500, statusText: 'Server Error' },
        );
    });
  });

  describe('getFaq$', () => {
    it('should return a getFaqSuccess action', (done) => {
      actions$ = of(FaqsActions.getFaq({ faqId: 1 }));

      effects.getFaq$.subscribe((result) => {
        expect(result).toEqual(
          FaqsActions.getFaqSuccess({
            faq: { id: 1, status: 'pending' } as any,
          }),
        );
        done();
      });

      httpTestingController
        .expectOne({ method: 'GET' })
        .flush({ id: 1, status: 'pending' });
    });

    it('should return a getFaqFailure action', (done) => {
      actions$ = of(FaqsActions.getFaq({ faqId: 1 }));

      effects.getFaq$.subscribe((result) => {
        expect(result).toEqual(
          FaqsActions.getFaqFailure({ error: 'error' }),
        );
        done();
      });

      httpTestingController
        .expectOne({ method: 'GET' })
        .flush(
          { message: 'error' },
          { status: 500, statusText: 'Server Error' },
        );
    });
  });

  describe('selectFaq$', () => {
    it('should dispatch getFaq action', (done) => {
      actions$ = of(FaqsActions.selectFaq({ faqId: 1 }));

      effects.selectFaq$.subscribe((result) => {
        expect(result).toEqual(FaqsActions.getFaq({ faqId: 1 }));
        done();
      });
    });
  });

  describe('createFaq$', () => {
    it('should return a createFaqSuccess action', (done) => {
      actions$ = of(
        FaqsActions.createFaq({
          data: { question: 'test?', answer: 'test' } as any,
        }),
      );

      effects.createFaq$.subscribe((result) => {
        expect(result).toEqual(
          FaqsActions.createFaqSuccess({
            faq: { id: 1, question: 'test?', answer: 'test' } as any,
          }),
        );
        done();
      });

      httpTestingController
        .expectOne({ method: 'POST' })
        .flush({ id: 1, question: 'test?', answer: 'test' });
    });

    it('should return a createFaqFailure action', (done) => {
      actions$ = of(
        FaqsActions.createFaq({
          data: { question: 'test?', answer: 'test' } as any,
        }),
      );

      effects.createFaq$.subscribe((result) => {
        expect(result).toEqual(
          FaqsActions.createFaqFailure({ error: 'error' }),
        );
        done();
      });

      httpTestingController
        .expectOne({ method: 'POST' })
        .flush(
          { message: 'error' },
          { status: 500, statusText: 'Server Error' },
        );
    });
  });

  describe('updateFaq$', () => {
    it('should return a updateFaqSuccess action', (done) => {
      actions$ = of(
        FaqsActions.updateFaq({
          faqId: 1,
          data: { question: 'test?', answer: 'updated' } as any,
        }),
      );

      effects.updateFaq$.subscribe((result) => {
        expect(result).toEqual(
          FaqsActions.updateFaqSuccess({
            faqId: 1,
            faq: { id: 1, question: 'test?', answer: 'updated' } as any,
          }),
        );
        done();
      });

      httpTestingController
        .expectOne({ method: 'PATCH' })
        .flush({ id: 1, question: 'test?', answer: 'updated' });
    });

    it('should return a updateFaqFailure action', (done) => {
      actions$ = of(
        FaqsActions.updateFaq({
          faqId: 1,
          data: { question: 'test?', answer: 'updated' } as any,
        }),
      );

      effects.updateFaq$.subscribe((result) => {
        expect(result).toEqual(
          FaqsActions.updateFaqFailure({ error: 'error' }),
        );
        done();
      });

      httpTestingController
        .expectOne({ method: 'PATCH' })
        .flush(
          { message: 'error' },
          { status: 500, statusText: 'Server Error' },
        );
    });
  });
});
