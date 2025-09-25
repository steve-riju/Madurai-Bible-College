import { TestBed } from '@angular/core/testing';

import { TeacherSubmissionReviewService } from './teacher-submission-review.service';

describe('TeacherSubmissionReviewService', () => {
  let service: TeacherSubmissionReviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeacherSubmissionReviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
