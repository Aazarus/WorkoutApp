import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProgramsPage } from './programs.page';

const routes: Routes = [
  {
    path: '',
    component: ProgramsPage
  },
  {
    path: 'program-details',
    loadChildren: () => import('./program-details/program-details.module').then( m => m.ProgramDetailsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProgramsPageRoutingModule {}
