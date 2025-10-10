import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAnswerDialogComponent } from './view-answer-dialog.component';

describe('ViewAnswerDialogComponent', () => {
  let component: ViewAnswerDialogComponent;
  let fixture: ComponentFixture<ViewAnswerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewAnswerDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAnswerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
