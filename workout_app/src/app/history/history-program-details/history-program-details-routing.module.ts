import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HistoryProgramDetailsPage } from './history-program-details.page';

const routes: Routes = [
  {
    path: '',
    component: HistoryProgramDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoryProgramDetailsPageRoutingModule {}
