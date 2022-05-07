import { ExerciseComponent } from './exercise/exercise.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NextWorkoutPageRoutingModule } from './next-workout-routing.module';
import { NextWorkoutPage } from './next-workout.page';
import { ConfirmCompleteWorkoutComponent } from './confirm-complete-workout/confirm-complete-workout.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NextWorkoutPageRoutingModule
  ],
  declarations: [
    NextWorkoutPage,
    ExerciseComponent,
    ConfirmCompleteWorkoutComponent
  ]
})
export class NextWorkoutPageModule {}
