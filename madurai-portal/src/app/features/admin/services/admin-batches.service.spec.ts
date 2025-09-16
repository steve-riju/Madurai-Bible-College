import { TestBed } from '@angular/core/testing';

import { AdminBatchesService } from './admin-batches.service';

describe('AdminBatchesService', () => {
  let service: AdminBatchesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminBatchesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
