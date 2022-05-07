import { ExerciseResult } from 'src/app/models/exerciseResult';
import { Exercise } from 'src/app/models/exercises';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.scss'],
})
export class ExerciseComponent implements OnInit {

  @Input() exercise: Exercise;
  @Output() exerciseCompleted = new EventEmitter<ExerciseResult>();
  exerciseResult: ExerciseResult = null;
  sets: number[] = [];
  isCompleted: boolean = false;

  constructor(private userService: UserService) {}

  public ngOnInit(): void {
    this.sets = Array(this.exercise?.sets).fill(0).map((x, i) => i) ?? [0];
    this.setupExercise();
  }

  public getReps(set: number): string {
    return `Reps: ${this.exercise.reps[set] ? this.exercise.reps[set] : this.exercise.reps[0]}`
  }

  public setupExercise(): void {
    if (this.exercise) {
      this.exerciseResult = JSON.parse(JSON.stringify(this.exercise));
      this.exerciseResult.reps = new Array<string>(this.exerciseResult.sets);
      this.exerciseResult.weight = new Array<string>(this.exerciseResult.sets);
    }
  }

  public getBodyPartTargeted(): string {
    return this.exercise?.bodyTargetArea?.join(",") ?? '';
  }

  public completedExercise(): void {
    if (!this.isCompleted) {
      this.setEmptyValues();
      this.exerciseCompleted.emit(this.exerciseResult);
    }
    this.isCompleted = !this.isCompleted;
  }

  private setEmptyValues(): void {

    if (this.exerciseResult && this.exerciseResult.sets) {
      const count = this.exerciseResult.sets

      for (var i = 0; i < count; i++) {
        if (!this.exerciseResult.reps[i]) {
          this.exerciseResult.reps[i] = "0";
        }

        if (!this.exerciseResult.weight[i]) {
          this.exerciseResult.weight[i] = "0";
        }
      } 
    }
  }
}
