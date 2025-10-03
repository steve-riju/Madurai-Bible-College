import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentSubmitDialogComponent } from './assignment-submit-dialog.component';

describe('AssignmentSubmitDialogComponent', () => {
  let component: AssignmentSubmitDialogComponent;
  let fixture: ComponentFixture<AssignmentSubmitDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignmentSubmitDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignmentSubmitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
