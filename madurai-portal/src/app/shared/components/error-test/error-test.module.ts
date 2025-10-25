import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ErrorTestComponent } from './error-test.component';

@NgModule({
  declarations: [
    ErrorTestComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule
  ],
  exports: [
    ErrorTestComponent
  ]
})
export class ErrorTestModule { }

