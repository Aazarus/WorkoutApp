import { ProgramService } from 'src/app/services/program.service';
import { UserService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import { Program } from '../models/program';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-programs',
  templateUrl: './programs.page.html',
  styleUrls: ['./programs.page.scss'],
})
export class ProgramsPage implements OnInit {

  constructor(
    private userService: UserService,
    private programService: ProgramService,
    private navCtrl: NavController
  ) { }

  public ngOnInit(): void {
  }

  hasActiveProgram(): boolean {
    return !!this.userService.currentProgram;
  }

  public programSelected(): void {    
    this.navCtrl.navigateForward(`/tabs/programs/program-details`);
  }

  public get programs(): Program[] {
    return this.programService.getPrograms();
  }
}
