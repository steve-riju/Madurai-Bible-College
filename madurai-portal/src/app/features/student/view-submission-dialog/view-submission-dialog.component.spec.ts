import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSubmissionDialogComponent } from './view-submission-dialog.component';

describe('ViewSubmissionDialogComponent', () => {
  let component: ViewSubmissionDialogComponent;
  let fixture: ComponentFixture<ViewSubmissionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewSubmissionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSubmissionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
