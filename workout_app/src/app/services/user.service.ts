import { Program } from 'src/app/models/program';
import { Onboarding } from 'src/app/models/onboarding';
import { UserData, defaultUserData } from 'src/app/models/user.data';
import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { Week } from 'src/app/models/week';
import { Day } from 'src/app/models/day';
import { NextWorkout } from 'src/app/models/nextWorkout';
import { Subject } from 'rxjs';
import { Weight } from 'src/app/models/weights';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userData: UserData = null;
  private storageKey = 'UserData';

  public programCompletion: number = 0;
  public programCompletionChange: Subject<number> = new Subject<number>();

  constructor() {
    this.programCompletionChange.subscribe(value => {
      this.programCompletion = value;
    })
   }

  public async init(): Promise<void> {
    await this.loadUserData();
  }

  public async onboard(onboarding: Onboarding): Promise<void> {
    this.userData.user.username = onboarding.name;
    this.userData.user.preferences.darkTheme = onboarding.isDarkTheme;
    this.userData.user.preferences.weight = onboarding.weight;
    this.userData.user.needsOnboarding = false;
    this.userData.completedPrograms = [];
    await this.saveUserData();
  }

  public get needsOnboarding(): boolean {
    return this.userData.user.needsOnboarding;
  }

  public get hasProgram(): boolean {
    return !!this.userData?.currentProgram ?? false;
  }

  public get hasHistory(): boolean {
    return this.hasProgram || (!!this.userData?.completedPrograms && this.userData.completedPrograms.length > 0);
  }

  public get currentProgram(): Program {
    return this.userData.currentProgram;
  }

  public get previousPrograms(): Program[] {
    return this.userData.completedPrograms;
  }

  public get username(): string {
    return this.userData.user.username;
  }
  
  
  public get weight(): Weight {
    return this.userData?.user?.preferences?.weight ?? Weight.kg;
  }

  public async overallProgramCompletion(): Promise<void>  {
    let totalDays = 0;
    let completedDays = 0;

    if(!this.userData) {
      await this.loadUserData();
    }

    if (this.userData && this.userData.currentProgram) {
      this.userData.currentProgram.weeks.forEach(week => {
          totalDays += week.days.length;

          completedDays += this.getCompletedDaysFromWeek(week);
        }
      );
    }

    if (totalDays > 0 && completedDays > 0) {
      let completionPercentage = (100/totalDays) * completedDays;

      // Needs to be between 0 - 1
      completionPercentage = completionPercentage / 100;
      this.programCompletionChange.next(completionPercentage);
    } else {
      this.programCompletionChange.next(0);
    }
  }
  
  public getNextWorkout(): NextWorkout {
    if (this.userData && this.userData.currentProgram && this.currentProgram.weeks) {
      for(let i = 0; i < this.userData.currentProgram.weeks.length; i++) {

        if (this.userData.currentProgram.weeks[i].completed) {
          continue;
        }

        for (let j = 0; j < this.userData.currentProgram.weeks[i].days.length; j++) {
          if (!this.userData.currentProgram.weeks[i].days[j].completed) {
            
            // if first day set week start date
            if ( j == 0 ) {
              this.userData.currentProgram.weeks[i].startDate = this.getDate();
            }
            return {
              title: this.userData.currentProgram.weeks[i].title + ' - Day # ' + (j+1),
              day: this.userData.currentProgram.weeks[i].days[j]
            }
          }
        }
      }
    }
  }
  
  public async updateProgram(program: Program): Promise<void> {

    if (!!program) {
      program.startDate = this.getDate();
    }

    if (!this.userData) {
      await this.loadUserData();
    }

    if (!!this.userData.currentProgram) {
      const currentProgram = JSON.parse(JSON.stringify(this.userData.currentProgram));
      this.userData.completedPrograms.unshift(currentProgram);
    }

    this.userData.currentProgram = null;
    this.userData.currentProgram = program;
    await this.saveUserData();
    await this.overallProgramCompletion();
  }
  
  public completeDay(day: Day): void {
    for(let i = 0; i < this.userData.currentProgram.weeks.length; i++) {

      if (this.userData.currentProgram.weeks[i].completed) {
        continue;
      }

      for (let j = 0; j < this.userData.currentProgram.weeks[i].days.length; j++) {
        if (!this.userData.currentProgram.weeks[i].days[j].completed) {
          this.userData.currentProgram.weeks[i].days[j] = day;
          this.userData.currentProgram.weeks[i].days[j].completed = true;

          // Check if week has been completed.
          if (this.userData.currentProgram.weeks[i].days.length == (j+1)) {
            this.userData.currentProgram.weeks[i].endDate = this.getDate();
            this.userData.currentProgram.weeks[i].completed = true;

            // Check if this week was the last week
            if ((i+1) === this.userData.currentProgram.weeks.length) {
              // Program finished
              this.userData.currentProgram.endDate = this.getDate();
              this.archiveCurrentProgram();
            }
          }

          this.overallProgramCompletion();
          this.saveUserData();
          return;
        }
      }
    }
    
    this.overallProgramCompletion();
  }

  public clearCurrentProgram(): void {
    this.updateProgram(null);    
  }

  public updateWeight(weight: Weight) {
    if (!!weight) {
      this.userData.user.preferences.weight = weight;
      this.saveUserData();
    }
  }

  public setTheme(isDarkTheme: boolean) {
    if (!this.userData) {
      this.loadUserData();
    }
    
    this.userData.user.preferences.darkTheme = isDarkTheme;
    this.saveUserData();
  }

  private async loadUserData(): Promise<void> {
    const result = await Storage.get({ key: this.storageKey });
    let userData: UserData = JSON.parse(result.value);

    if (userData) {
      this.userData = userData;
    } else {
      this.userData = defaultUserData();
    }
  }

  private async saveUserData(): Promise<void> {
    await Storage.set({ key: this.storageKey, value: JSON.stringify(this.userData) });
  }

  private getCompletedDaysFromWeek(week: Week): number {
    var completedDays = 0;
    for (var i = 0; i < week.days.length; i++) {
      if (week.days[i].completed) {
        completedDays++;
      } else {
        break;
      }
    }

    return completedDays;
  }

  private getDate(): string {
    var nowDate = new Date(); 
    var date = nowDate.getFullYear()+'/'+(nowDate.getMonth()+1)+'/'+nowDate.getDate();
    return date;
  }

  private archiveCurrentProgram(): void {
    this.clearCurrentProgram();
  }
}
