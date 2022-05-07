import { NextWorkout } from 'src/app/models/nextWorkout';
import { ProgramService } from 'src/app/services/program.service';
import { ExerciseResult } from 'src/app/models/exerciseResult';
import { Exercise } from 'src/app/models/exercises';
import { Day } from 'src/app/models/day';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { PopoverController } from '@ionic/angular';
import { ConfirmCompleteWorkoutComponent } from './confirm-complete-workout/confirm-complete-workout.component';

@Component({
  selector: 'app-next-workout',
  templateUrl: './next-workout.page.html',
  styleUrls: ['./next-workout.page.scss'],
})
export class NextWorkoutPage implements OnInit {

  private nextWorkout: NextWorkout;
  public day: Day;
  public exercises: Exercise[] = [];
  public exerciseResults: ExerciseResult[] = [];
  public isCompleted: boolean;
  public displayPostWorkout: boolean;
  public displayCompletedProgram: boolean;
  public title: string;

  private completedExercises: number[] = [];

  constructor(
    private userService: UserService,
    private programService: ProgramService,
    private popoverController: PopoverController
  ) { }

  public ngOnInit(): void {
    this.loadNextWorkout();
  }

  public exerciseCompleted(exerciseResult: ExerciseResult): void {
    if (exerciseResult) {
      var exercise = this.exerciseResults.find(ex => ex.id === exerciseResult.id);
      exercise.reps = exerciseResult.reps;
      exercise.weight = exerciseResult.weight
      exercise.notes = exerciseResult.notes;

      this.completedExercises.push(exerciseResult.id);
      this.completedExercises.sort();
    }
  }

  public async completeDay(): Promise<void> {
    const remainingExercises = this.getRemainingExercises();

    if (remainingExercises && remainingExercises.length === 0) {
      this.allowDayToComplete();
    } else {
      await this.notifyUserTheyHaveNotFinished();
    }
  }

  public loadNextWorkout(): void {

    this.exerciseResults = [];
    this.exercises = [];
    this.nextWorkout = this.userService.getNextWorkout();

    if (this.nextWorkout) {
      this.day = this.nextWorkout.day;
      this.title = this.nextWorkout.title;

      if (this.day) {
        this.exercises = this.programService.getExercises(this.day.exercises);
        this.exercises.forEach(ex => {
          this.exerciseResults.push({
            id: ex.id,
            title: ex.title,
            reps: [],
            sets: ex.sets,
            bodyTargetArea: ex.bodyTargetArea,
            weight: [],
            expectedReps: ex.reps
          });
        });
        this.isCompleted = false;
        this.displayPostWorkout = false;
      } else {
        this.exercises = [];
      }
    }
  }

  private getRemainingExercises(): number[] {
    const ids = this.exercises.map(ex => ex.id).sort();
    return ids.filter(id => !this.completedExercises.includes(id));
  }

  private allowDayToComplete(): void {
    this.isCompleted = true;
    this.displayPostWorkout = true;
    this.day.exerciseResults = this.exerciseResults;
    this.userService.completeDay(this.day);

    this.displayCompletedProgram = this.userService.currentProgram === null;
  }

  private async notifyUserTheyHaveNotFinished(): Promise<void> {
    var popover = await this.popoverController.create({
      component: ConfirmCompleteWorkoutComponent
    });

    popover.onDidDismiss().then(result => {
      if (result.data) {
        this.setEmptyValues();
        this.allowDayToComplete();
      }
    });

    await popover.present();
  }

  private setEmptyValues(): void {
    this.exerciseResults.forEach(exerciseResult => {
      const count = exerciseResult.sets

      if (exerciseResult.reps.length < count) {
        for (var i = 0; i < count; i++) {
          exerciseResult.reps.push("0");
        }
      }

      if (exerciseResult.weight.length < count) {
        for (var i = 0; i < count; i++) {
          exerciseResult.weight.push("0");
        }
      }

      for (var i = 0; i < count; i++) {
        if (!exerciseResult.reps[i]) {
          exerciseResult.reps[i] = "0";
        }

        if (!exerciseResult.weight[i]) {
          exerciseResult.weight[i] = "0";
        }

        if (!isNaN(+exerciseResult.weight[i])) {
          exerciseResult.weight[i] += ` ${this.userService.weight.toLocaleLowerCase()}`
        }
      }
    });
  }
}
