import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Program } from 'src/app/models/program';
import { ProgramService } from 'src/app/services/program.service';

@Component({
  selector: 'app-program-summary',
  templateUrl: './program-summary.component.html',
  styleUrls: ['./program-summary.component.scss'],
})
export class ProgramSummaryComponent implements OnInit {

  @Input() program: Program;
  @Output() programSelected = new EventEmitter();

  constructor(private programService: ProgramService) { }

  public ngOnInit(): void {}

  public async selected(): Promise<void> {
    this.programService.setSelectedProgram(this.program);
    this.programSelected.emit();
  }

  public getTitle(): string {
    return this.program?.title ?? "";
  }  

  public getDescription(): string {
    return this.program?.description ?? "";
  }
}
