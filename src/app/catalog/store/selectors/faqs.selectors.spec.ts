import {
  selectFaqsList,
  selectSelectedFaq,
  selectSelectedFaqId,
} from './faqs.selectors';
import { Faq } from '../../../core/api';
import * as fromFaqs from '../reducers/faqs.reducer';

describe('Faqs Selectors', () => {
  let initialState: fromFaqs.State;

  beforeEach(() => {
    initialState = {
      list: [
        {
          id: 1,
          question: 'Question 1',
          answer: 'Answer 1',
        } as Faq,
      ],
      selectedFaqId: 1,
    };
  });

  describe('selectFaqsList', () => {
    it('should select the faqs list', () => {
      const result = selectFaqsList.projector(initialState);
      expect(result).toEqual(initialState.list);
    });
  });

  describe('selectSelectedFaqId', () => {
    it('should select the selected faq id', () => {
      const result = selectSelectedFaqId.projector(initialState);
      expect(result).toEqual(initialState.selectedFaqId);
    });
  });

  describe('selectSelectedFaq', () => {
    it('should select the selected faq', () => {
      const result = selectSelectedFaq.projector(
        initialState,
        initialState.selectedFaqId,
      );
      expect(result).toEqual(initialState.list[0]);
    });

    it('should return null if no faq is selected', () => {
      const result = selectSelectedFaq.projector(initialState, null);
      expect(result).toEqual(null);
    });
  });
});
