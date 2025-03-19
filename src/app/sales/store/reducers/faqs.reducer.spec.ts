import { reducer, initialState } from './faqs.reducer';
import { Faq } from '../../../core/api';
import { FaqsActions } from '../actions';

describe('Faqs Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('load faqs success action', () => {
    it('should set the list of faqs', () => {
      const faqs: Faq[] = [];
      const action = FaqsActions.loadFaqsSuccess({ faqs });

      const result = reducer(initialState, action);

      expect(result.list).toEqual(faqs);
    });
  });

  describe('select faq action', () => {
    it('should set the selected faq id', () => {
      const faqId = 1;
      const action = FaqsActions.selectFaq({ faqId });

      const result = reducer(initialState, action);

      expect(result.selectedFaqId).toEqual(faqId);
    });
  });
});
