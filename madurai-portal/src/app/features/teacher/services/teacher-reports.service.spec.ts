import { TestBed } from '@angular/core/testing';

import { TeacherReportsService } from './teacher-reports.service';

describe('TeacherReportsService', () => {
  let service: TeacherReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeacherReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
