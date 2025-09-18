import { TestBed } from '@angular/core/testing';

import { TeacherMaterialsService } from './teacher-materials.service';

describe('TeacherMaterialsService', () => {
  let service: TeacherMaterialsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeacherMaterialsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
