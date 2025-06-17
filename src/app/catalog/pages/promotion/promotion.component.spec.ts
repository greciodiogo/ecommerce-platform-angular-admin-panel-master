import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionComponent } from './promotion.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ActivatedRoute } from '@angular/router';
import { OrdersActions } from '../../store';
import { cold } from 'jasmine-marbles';

describe('PromotionComponent', () => {
  let component: PromotionComponent;
  let fixture: ComponentFixture<PromotionComponent>;
  let store: MockStore;
  let routeId: string | null = '1';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PromotionComponent],
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
    fixture = TestBed.createComponent(PromotionComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch selectOrder action on init', () => {
    fixture.detectChanges();
    const expected = cold('a', {
      a: OrdersActions.selectOrder({ orderId: 1 }),
    });
    expect(store.scannedActions$).toBeObservable(expected);
  });

  it('should dispatch selectOrder action with null', () => {
    routeId = null;
    fixture.detectChanges();
    const expected = cold('a', {
      a: OrdersActions.selectOrder({ orderId: null }),
    });
    expect(store.scannedActions$).toBeObservable(expected);
  });
});
