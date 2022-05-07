import { UserService } from 'src/app/services/user.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss'],
})
export class ProgressComponent implements OnInit, OnDestroy {

  private progressChanged: Subject<number>;
  public progress: number = 0;

  constructor(private userService: UserService) {
    this.progressChanged = this.userService.programCompletionChange;
  }

  public async ngOnInit(): Promise<void> {
    this.progressChanged.subscribe(value => {
      this.progress = value;
    });
    this.userService.overallProgramCompletion();
  }

  public async ngOnDestroy(): Promise<void> {
    this.progressChanged.unsubscribe();
  }
}
