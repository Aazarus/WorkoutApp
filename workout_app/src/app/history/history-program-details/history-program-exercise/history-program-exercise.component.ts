import { Component, Input, OnInit } from '@angular/core';
import { ExerciseResult } from 'src/app/models/exerciseResult';

@Component({
  selector: 'app-history-program-exercise',
  templateUrl: './history-program-exercise.component.html',
  styleUrls: ['./history-program-exercise.component.scss'],
})
export class HistoryProgramExerciseComponent implements OnInit {

  @Input() exercise: ExerciseResult = null;
  public sets: number[] = [];

  constructor() {}

  public ngOnInit(): void { 
    this.sets = Array(this.exercise?.sets).fill(0).map((x, i) => i) ?? [];
   }
  
  public getBodyPartTargeted(): string {
    if (this.exercise.bodyTargetArea.length > 0) {
      return this.exercise.bodyTargetArea.join(",");
    }
    
    return '';
  }
}
