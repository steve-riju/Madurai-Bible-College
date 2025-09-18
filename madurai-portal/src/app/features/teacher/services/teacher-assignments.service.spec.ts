import { TestBed } from '@angular/core/testing';

import { TeacherAssignmentsService } from './teacher-assignments.service';

describe('TeacherAssignmentsService', () => {
  let service: TeacherAssignmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeacherAssignmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
