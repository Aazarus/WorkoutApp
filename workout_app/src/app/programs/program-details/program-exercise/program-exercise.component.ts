import { Component, Input, OnInit } from '@angular/core';
import { Exercise } from 'src/app/models/exercises';
import { ProgramService } from 'src/app/services/program.service';

@Component({
  selector: 'app-program-exercise',
  templateUrl: './program-exercise.component.html',
  styleUrls: ['./program-exercise.component.scss'],
})
export class ProgramExerciseComponent implements OnInit {

  @Input() exerciseId: number;
  public exercise: Exercise;
  public sets: number[] = [];

  constructor(
    private programService: ProgramService
  ) { }

  public ngOnInit(): void {
    this.exercise = this.programService.getExercise(this.exerciseId);
    this.sets = Array(this.exercise?.sets).fill(0).map((x, i) => i) ?? [0];
  }

  public getReps(set: number): string {
    if (set) {
      return `Reps: ${this.exercise.reps[set] ? this.exercise.reps[set] : this.exercise.reps[0]}`
    }
    return "";
  }

  public getBodyPartTargeted(): string {
    return this.exercise.bodyTargetArea.join(",");
  }
}
