import { PopoverController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirm-complete-workout',
  templateUrl: './confirm-complete-workout.component.html',
  styleUrls: ['./confirm-complete-workout.component.scss'],
})
export class ConfirmCompleteWorkoutComponent implements OnInit {

  constructor(
    private popoverController: PopoverController
  ) { }

  public ngOnInit(): void {}

  public complete(): void {
    this.close(true);
  }

  public cancel(): void {
    this.close(false);
  }

  private close(complete: boolean): void {
    this.popoverController.dismiss(complete);
  }
}
