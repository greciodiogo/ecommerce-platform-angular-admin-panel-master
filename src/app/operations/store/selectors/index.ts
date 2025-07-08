import { createFeatureSelector } from '@ngrx/store';
import { operationsFeatureKey, OperationsState } from '../reducers';

export const selectOperationsState = createFeatureSelector<OperationsState>(operationsFeatureKey); 