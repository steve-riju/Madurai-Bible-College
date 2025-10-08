import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { FilterPipe } from './pipes/filter.pipe';
import { SafeUrlPipe } from './pipes/safe-url.pipe';

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    FilterPipe,
    SafeUrlPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    FilterPipe,
    SafeUrlPipe
  ]
})
export class SharedModule {}
