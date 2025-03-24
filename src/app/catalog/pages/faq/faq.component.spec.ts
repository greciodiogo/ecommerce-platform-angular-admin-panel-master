import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqComponent } from './faq.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { FaqsActions } from '../../store';
import { cold } from 'jasmine-marbles';

describe('FaqComponent', () => {
  let component: FaqComponent;
  let fixture: ComponentFixture<FaqComponent>;
  let store: MockStore;
  let routeId: string | null = '1';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [FaqComponent],
      providers: [
        provideMockStore(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => routeId,
              },
            },
          },
        },
      ],
    }).compileComponents();

    routeId = '1';
    fixture = TestBed.createComponent(FaqComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should dispatch selectFaq action on init', () => {
    fixture.detectChanges();
    const expected = cold('a', {
      a: FaqsActions.selectFaq({ faqId: 1 }),
    });
    expect(store.scannedActions$).toBeObservable(expected);
  });

  it('should dispatch selectFaq action with null', () => {
    routeId = null;
    fixture.detectChanges();
    const expected = cold('a', {
      a: FaqsActions.selectFaq({ faqId: null }),
    });
    expect(store.scannedActions$).toBeObservable(expected);
  });
});
