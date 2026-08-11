import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: 'profile',
    loadChildren: () =>
      import('./public-profile/public-profile.module')
        .then(m => m.PublicProfileModule)
  },

  {
    path: '',
    redirectTo: 'profile/blank',
    pathMatch: 'full'
  },

  {
    path: '**',
    redirectTo: 'profile/blank'
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}