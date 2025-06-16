import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingComponent } from './trending.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CategoriesActions } from '../../store';
import { cold } from 'jasmine-marbles';
import { ActivatedRoute } from '@angular/router';

describe('TrendingComponent', () => {
  let component: TrendingComponent;
  let fixture: ComponentFixture<TrendingComponent>;
  let store: MockStore;
  let routeId: string | null = '1';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrendingComponent],
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
    fixture = TestBed.createComponent(TrendingComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch selectCategory action on init', () => {
    fixture.detectChanges();
    const expected = cold('a', {
      a: CategoriesActions.selectCategory({ categoryId: 1 }),
    });
    expect(store.scannedActions$).toBeObservable(expected);
  });

  it('should dispatch selectCategory action with null', () => {
    routeId = null;
    fixture.detectChanges();
    const expected = cold('a', {
      a: CategoriesActions.selectCategory({ categoryId: null }),
    });
    expect(store.scannedActions$).toBeObservable(expected);
  });
});
