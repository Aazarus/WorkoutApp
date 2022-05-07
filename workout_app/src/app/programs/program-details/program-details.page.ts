import { Day } from 'src/app/models/day';
import { Week } from 'src/app/models/week';
import { Component, OnInit } from '@angular/core';
import { Program } from 'src/app/models/program';
import { ProgramService } from 'src/app/services/program.service';

@Component({
  selector: 'app-program-details',
  templateUrl: './program-details.page.html',
  styleUrls: ['./program-details.page.scss'],
})
export class ProgramDetailsPage implements OnInit {

  public program: Program;
  public selectedWeekNumber: number = 0;
  public selectedWeek: Week = null;
  public selectedDayNumber: number = 0;
  public selectedDay: Day = null;

  constructor(
    private programService: ProgramService
  ) { }

  public ngOnInit(): void {
    this.program = this.programService.getSelectedProgram();

    this.onWeekSelected();
    this.daySelected();
  }

  public onWeekSelected(): void {
    if (this.program && this.program.weeks) {
      this.selectedWeek = this.program.weeks[this.selectedWeekNumber];
      this.selectedDayNumber = 0;
      this.daySelected();
    }
  }

  public onDaySelected(event: any): void {
    this.selectedDayNumber = event.detail.value;
    this.daySelected();
  }

  private daySelected(): void {
    if (this.selectedWeek && this.selectedWeek.days) {
      this.selectedDay = this.selectedWeek.days[this.selectedDayNumber];
    }
  }
}
