import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionReviewComponent } from './submission-review.component';

describe('SubmissionReviewComponent', () => {
  let component: SubmissionReviewComponent;
  let fixture: ComponentFixture<SubmissionReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubmissionReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmissionReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
