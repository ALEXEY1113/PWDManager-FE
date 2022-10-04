import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CredentialComponent } from './components/credential/credential.component';
import { DetailComponent } from './components/detail/detail.component';

const routes: Routes = [
  {
    path: '',
    component: CredentialComponent
  },
  {
    path: 'detail',
    component: DetailComponent
  },
  {
    path: 'detail/:id',
    component: DetailComponent
  },
  {
    path: '**',
    redirectTo: 'credential'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
