import { Weight } from './../models/weights';
import { UserService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { PopoverController } from '@ionic/angular';
import { ClearWorkoutComponent } from './clear-workout/clear-workout.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  public isDarkTheme: boolean = false;
  public weight: Weight = Weight.kg;

  constructor(
    private settingsService: SettingsService,
    private popoverController: PopoverController,
    public userService: UserService
  ) { }

  async ngOnInit(): Promise<void> {
    this.isDarkTheme = await this.settingsService.getTheme();
    this.weight = this.userService.weight;
  }

  public onDarkTheme(event: any): void {
    this.isDarkTheme = event.detail.checked;
    this.settingsService.setTheme(this.isDarkTheme);
    this.userService.setTheme(this.isDarkTheme);
  }

  public async endCurrentProgram(): Promise<void> {
    const popover = await this.popoverController.create({
      component: ClearWorkoutComponent
    });
    await popover.present();
  }

  public onChange(): void {
    this.userService.updateWeight(this.weight);
  }
}