import { TestBed } from '@angular/core/testing';

import { StudentAssignmentsService } from './student-assignments.service';

describe('StudentAssignmentsService', () => {
  let service: StudentAssignmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentAssignmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
