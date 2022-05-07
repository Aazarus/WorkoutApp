import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NextWorkoutPage } from './next-workout.page';

const routes: Routes = [
  {
    path: '',
    component: NextWorkoutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NextWorkoutPageRoutingModule {}
