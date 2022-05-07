import { PopoverController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-clear-workout',
  templateUrl: './clear-workout.component.html',
  styleUrls: ['./clear-workout.component.scss'],
})
export class ClearWorkoutComponent implements OnInit {

  constructor(
    private userService: UserService,
    private popoverController: PopoverController
  ) { }

  public ngOnInit(): void {}

  public clearProgram(): void {
    this.userService.clearCurrentProgram();
    this.cancel();
  }

  public cancel(): void {
    this.popoverController.dismiss();
  }
}
