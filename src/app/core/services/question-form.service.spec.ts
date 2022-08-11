import { TestBed } from '@angular/core/testing';

import { QuestionFormService } from './question-form.service';

describe('QuestionFormService', () => {
  let service: QuestionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestionFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
