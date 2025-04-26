import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqDetailsComponent } from './faq-details.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FaqsActions } from '../../store';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SafeUrlPipe } from '../../../shared/pipes/safe-url.pipe';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { cold } from 'jasmine-marbles';
import { first, skip } from 'rxjs';
import { Faq } from '../../../core/api';
// import { FileInput, MaterialFileInputModule } from 'ngx-material-file-input';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialogHarness } from '@angular/material/dialog/testing';
import { selectSettingsList } from '../../../settings/store';
import { FormatCurrencyPipe } from '../../../shared/pipes/format-currency.pipe';

describe('FaqDetailsComponent', () => {
  let component: FaqDetailsComponent;
  let fixture: ComponentFixture<FaqDetailsComponent>;
  let store: MockStore;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        RouterTestingModule,
        NoopAnimationsModule,
        MatCardModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        // MaterialFileInputModule,
        MatDialogModule,
        RouterTestingModule,
      ],
      declarations: [
        FaqDetailsComponent,
        SafeUrlPipe,
        ConfirmDialogComponent,
        FormatCurrencyPipe,
      ],
      providers: [
        provideMockStore({
          initialState: {
            catalog: {
              faqs: {
                list: [
                  {
                    id: 1,
                    question: 'Faq 1',
                    answer: 'Description 1',
                    visible: true,
                  },
                ],
                selectedFaqId: 1,
              },
            },
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FaqDetailsComponent);
    component = fixture.componentInstance;
    component.faq = {
      id: 1,
      question: 'Faq 1',
      answer: 'Description 1',
      visible: true,
    } as Faq;
    // fixture.detectChanges();
    store = TestBed.inject(MockStore);
    loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should ignore when faq is not loaded', async () => {
    component.faq = null;

    fixture.detectChanges();
    const inputs = await loader.getAllHarnesses(MatInputHarness);
    expect(await inputs[0].getValue()).toBe('');
    expect(await inputs[1].getValue()).toBe('');
    expect(await inputs[2].getValue()).toBe('0');
    expect(await inputs[3].getValue()).toBe('0');
  });

  it('should display faq properties', async () => {
    fixture.detectChanges();
    const inputs = await loader.getAllHarnesses(MatInputHarness);
    expect(await inputs[0].getValue()).toBe('Faq 1');
    expect(await inputs[1].getValue()).toBe('Description 1');
    expect(await inputs[2].getValue()).toBe('123');
    expect(await inputs[3].getValue()).toBe('123');
    const select = await loader.getHarness(MatSelectHarness);
    expect(await select.getValueText()).toBe('Visible');
  });

  it('should dispatch save actions', async () => {
    fixture.detectChanges();
    const inputs = await loader.getAllHarnesses(MatInputHarness);
    await inputs[0].setValue('Faq 2');
    await inputs[1].setValue('Description 2');
    await inputs[2].setValue('12345');
    await inputs[3].setValue('12345');

    fixture.detectChanges();
    const saveButton = await loader.getHarness(
      MatButtonHarness.with({ text: 'Save' }),
    );

    store.scannedActions$.pipe(skip(1), first()).subscribe((action) => {
      expect(action).toEqual(
        FaqsActions.updateFaq({
          id: 1,
          data: {
            question: 'Faq 2',
            answer: 'Description 2',
            visible: true,
          },
        }),
      );
    });
    await saveButton.click();
    fixture.detectChanges();
  });

  it('should dispatch delete faq action', async () => {
    const button = await loader.getHarness(
      MatButtonHarness.with({ text: 'Delete faq' }),
    );
    await button.click();
    const dialog = await loader.getHarness(MatDialogHarness);
    const dialogButton = await dialog.getHarness(
      MatButtonHarness.with({ text: 'Delete' }),
    );
    await dialogButton.click();
    expect(store.scannedActions$).toBeObservable(
      cold('a', {
        a: FaqsActions.deleteFaq({ id: 1 }),
      }),
    );
  });
});
