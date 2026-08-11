import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicProfileRoutingModule } from './public-profile-routing.module';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { ProfileSplashComponent } from './components/profile-splash/profile-splash.component';

@NgModule({
  declarations: [
    ProfilePageComponent,
    ProfileSplashComponent
  ],

  imports: [
    CommonModule,
    PublicProfileRoutingModule
  ]
})
export class PublicProfileModule {}