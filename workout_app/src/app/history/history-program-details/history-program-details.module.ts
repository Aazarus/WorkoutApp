import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HistoryProgramDetailsPageRoutingModule } from './history-program-details-routing.module';
import { HistoryProgramDetailsPage } from './history-program-details.page';
import { HistoryProgramExerciseComponent } from './history-program-exercise/history-program-exercise.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistoryProgramDetailsPageRoutingModule
  ],
  declarations: [
    HistoryProgramDetailsPage, 
    HistoryProgramExerciseComponent
  ]
})
export class HistoryProgramDetailsPageModule {}
